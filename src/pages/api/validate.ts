// API route for validating LLM API keys.
// The actual provider calls live in Python (api/validators/*.py, shared with
// the Vercel @vercel/python functions declared in vercel.json) - a .ts file
// can't statically import a .py module, so we shell out to a small stdin/
// stdout bridge (api/cli.py) instead.
import type { NextApiRequest, NextApiResponse } from 'next';
import { execFile } from 'child_process';
import path from 'path';

type ValidationResult = {
  valid: boolean;
  message: string;
}

function runPythonValidator(payload: Record<string, unknown>): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const cliPath = path.join(process.cwd(), 'api', 'cli.py');
    const python = process.env.PYTHON_BIN || 'python3';

    // Strip PYTHONPATH: it belongs to whichever interpreter launched this
    // Node process (e.g. an agent's own venv), not to python/PYTHON_BIN's
    // site-packages. A stale foreign value here silently breaks every
    // provider by shadowing the real openai/boto3/requests installs.
    const { PYTHONPATH: _drop, ...cleanEnv } = process.env;

    const child = execFile(
      python,
      [cliPath],
      { timeout: 15_000, env: cleanEnv },
      (error, stdout) => {
        if (error) {
          resolve({ valid: false, message: `Validator process failed: ${error.message}` });
          return;
        }
        try {
          resolve(JSON.parse(stdout));
        } catch {
          resolve({ valid: false, message: 'Validator returned an unparseable response' });
        }
      }
    );

    child.stdin?.write(JSON.stringify(payload));
    child.stdin?.end();
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidationResult>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ valid: false, message: 'Method Not Allowed' });
  }

  try {
    const { provider, apiKey, awsAccessKey, awsSecretKey, awsRegion } = req.body;

    if (!provider) {
      return res.status(400).json({ valid: false, message: 'Provider is required' });
    }

    let result: ValidationResult;

    switch (provider.toLowerCase()) {
      case 'openai':
        if (!apiKey) {
          return res.status(400).json({ valid: false, message: 'API key is required' });
        }
        result = await runPythonValidator({ provider: 'openai', apiKey });
        break;
        
      case 'claude':
        if (!apiKey) {
          return res.status(400).json({ valid: false, message: 'API key is required' });
        }
        result = await runPythonValidator({ provider: 'claude', apiKey });
        break;
        
      case 'gemini':
        if (!apiKey) {
          return res.status(400).json({ valid: false, message: 'API key is required' });
        }
        result = await runPythonValidator({ provider: 'gemini', apiKey });
        break;
        
      case 'bedrock':
        if (!awsAccessKey || !awsSecretKey) {
          return res.status(400).json({ 
            valid: false, 
            message: 'AWS Access Key and Secret Key are required' 
          });
        }
        result = await runPythonValidator({
          provider: 'bedrock',
          awsAccessKey,
          awsSecretKey,
          awsRegion: awsRegion || 'us-east-1',
        });
        break;
        
      default:
        return res.status(400).json({ 
          valid: false, 
          message: `Unsupported provider: ${provider}` 
        });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({ 
      valid: false, 
      message: 'An error occurred during validation' 
    });
  }
}
