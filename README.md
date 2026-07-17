# API Key Checker

A web application that allows users to verify the validity of their LLM API keys for various providers including OpenAI, Anthropic Claude, AWS Bedrock, and Google Gemini.

## 🚀 Features

- Validate API keys for multiple LLM providers:
  - OpenAI (GPT models)
  - Anthropic Claude
  - AWS Bedrock
  - Google Gemini
- Clean, intuitive interface
- Real-time validation feedback
- Secure, server-side validation
- No storage of API keys
- Serverless architecture

## 🔒 Security

- We do not store your API keys
- All validation happens server-side in ephemeral functions
- HTTPS-only access
- Rate limiting to prevent abuse
- No logging of sensitive data

## 🛠️ Technologies

- **Frontend**: Next.js with React
- **Backend**: Next.js API routes (serverless functions)
- **API Interaction**: Python for key validation
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Vercel account (for deployment)

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/key-checker.git
   cd key-checker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables in a `.env.local` file:
   ```
   # No API keys needed for local development
   # Add any other environment variables here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🖥️ Usage

1. Select the API provider you want to check (OpenAI, Claude, Bedrock, Gemini)
2. Enter your API key in the secure input field
3. Click "Check Key"
4. View the validation result

## 🧪 Testing

Run the test suite with:

```bash
npm test
# or
yarn test
```

## 📦 Deployment

This project is optimized for deployment on Vercel:

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure any required environment variables
4. Deploy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

- Support for additional LLM providers
- More detailed validation feedback (token limits, model access)
- OAuth integration for provider accounts
- Batch validation of multiple keys
