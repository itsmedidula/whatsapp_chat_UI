# WhatsApp Chat Wall with OpenRouter AI

This is a WhatsApp-like chat interface powered by OpenRouter AI, built with React, Vite, and Tailwind CSS. It is designed to be deployed on Vercel.

## Features

- 📱 Responsive WhatsApp-like UI
- 🤖 AI Chatbot integration via OpenRouter
- 🔒 Secure API handling using Vercel Serverless Functions
- ⚡ Fast performance with Vite

## Deployment Instructions

### Deploy to Vercel

1. **Push to GitHub**: Push this code to a GitHub repository.
2. **Import in Vercel**: Go to [Vercel](https://vercel.com) and import your repository.
3. **Environment Variables**:
   - In the "Configure Project" step, find the **Environment Variables** section.
   - Add a new variable:
     - **Key**: `OPENROUTER_API_KEY`
     - **Value**: Your OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai/keys)).
4. **Deploy**: Click **Deploy**.

### Local Development

To run locally with the API function, you need `vercel` CLI or you can mock the API.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run with Vercel CLI (recommended for API support):
   ```bash
   npm i -g vercel
   vercel dev
   ```
   *You will need to link your Vercel project and set the environment variable there or in a `.env` file.*

3. Run frontend only (API calls will fail without a backend):
   ```bash
   npm run dev
   ```

## Project Structure

- `src/`: Frontend React code.
- `api/`: Serverless functions (backend) handled by Vercel.
