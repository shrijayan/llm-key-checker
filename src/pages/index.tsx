import React from 'react';
import KeyValidationForm from '@/components/KeyValidationForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <div className="flex flex-col items-center justify-center w-full">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">API Key Checker</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Verify the validity of your LLM API keys for OpenAI, Claude, Google Gemini, and AWS Bedrock.
          </p>
        </header>
        
        <KeyValidationForm />
        
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p className="mb-2">This tool checks if your API keys are valid by making a lightweight call to each provider's API.</p>
          <p className="font-semibold">We do not store your API keys or any data sent through this tool.</p>
        </footer>
      </div>
    </main>
  );
}
