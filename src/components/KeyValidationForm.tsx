import React, { useState } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';

type Provider = 'openai' | 'claude' | 'gemini' | 'bedrock';

type Inputs = {
  provider: Provider;
  apiKey: string;
  awsAccessKey: string;
  awsSecretKey: string;
  awsRegion: string;
};

const providerOptions = [
  { id: 'openai', name: 'OpenAI' },
  { id: 'claude', name: 'Anthropic Claude' },
  { id: 'gemini', name: 'Google Gemini' },
  { id: 'bedrock', name: 'AWS Bedrock' }
];

type ValidationResult = {
  valid: boolean;
  message: string;
};

export default function KeyValidationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors }, 
    reset 
  } = useForm<Inputs>({
    defaultValues: {
      provider: 'openai',
      apiKey: '',
      awsAccessKey: '',
      awsSecretKey: '',
      awsRegion: 'us-east-1'
    }
  });

  const selectedProvider = watch('provider');
  
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await axios.post('/api/validate', data);
      setResult(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setResult(error.response.data as ValidationResult);
      } else {
        setResult({
          valid: false,
          message: 'An error occurred while validating the key'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card max-w-lg w-full mx-auto">
      <div className="card-header">
        <h2 className="text-xl font-semibold">API Key Validator</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="card-body space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provider
          </label>
          <select
            {...register('provider')}
            className="input-field"
          >
            {providerOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {selectedProvider !== 'bedrock' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                {...register('apiKey', { required: 'API Key is required' })}
                className="input-field pr-10"
                placeholder={`Enter your ${selectedProvider} API key`}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showApiKey ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.apiKey && (
              <p className="mt-1 text-sm text-red-600">{errors.apiKey.message}</p>
            )}
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AWS Access Key ID
              </label>
              <input
                type={showApiKey ? 'text' : 'password'}
                {...register('awsAccessKey', { required: 'AWS Access Key is required' })}
                className="input-field"
                placeholder="Enter your AWS Access Key ID"
              />
              {errors.awsAccessKey && (
                <p className="mt-1 text-sm text-red-600">{errors.awsAccessKey.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AWS Secret Access Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  {...register('awsSecretKey', { required: 'AWS Secret Key is required' })}
                  className="input-field pr-10"
                  placeholder="Enter your AWS Secret Access Key"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showApiKey ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.awsSecretKey && (
                <p className="mt-1 text-sm text-red-600">{errors.awsSecretKey.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AWS Region
              </label>
              <input
                type="text"
                {...register('awsRegion')}
                className="input-field"
                placeholder="us-east-1"
              />
              <p className="mt-1 text-xs text-gray-500">
                Default: us-east-1 (if left blank)
              </p>
            </div>
          </>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Validating...' : 'Check Key'}
          </button>
        </div>

        {result && (
          <div className={`mt-4 p-4 rounded-md ${result.valid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {result.valid ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p>{result.message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-2 text-xs text-gray-500 text-center">
          <p>We do not store your API keys. All validation is performed server-side.</p>
        </div>
      </form>
    </div>
  );
}
