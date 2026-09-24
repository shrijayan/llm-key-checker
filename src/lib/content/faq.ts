export interface FaqItem {
  question: string
  answer: string
}

/**
 * Addresses the single biggest source of friction for this specific tool:
 * it asks you to paste a secret. Visual polish doesn't fix that hesitation —
 * a straight answer does.
 */
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Do you store my API key?',
    answer:
      'No. Your key travels from your browser to a stateless serverless function, gets used exactly once to call the provider\u2019s API, and is discarded when the function exits. It is never written to a database, a log, or a file. The handler is public — see src/app/api/validate/route.ts in the repo.',
  },
  {
    question: 'Is it actually safe to paste my key here?',
    answer:
      'The request runs entirely over HTTPS, and the only two parties who ever see the key are your browser and the provider you\u2019re checking against — the same exposure as pasting it into your own app\u2019s .env file. If you\u2019d rather not take our word for it, the whole project is open source, so you can read it first or run it on your own machine with npm run dev.',
  },
  {
    question: 'How does the "paste to detect" feature work?',
    answer:
      'Well-known providers issue keys with a recognizable shape — Anthropic keys start with sk-ant-, Gemini keys with AIzaSy, Groq with gsk_, and so on. We match that shape in your browser, select the provider, and when the prefix is unique we run the check immediately. Bare sk- keys are used by more than one provider, so we guess OpenAI and let you switch. If we don\u2019t recognize the pattern, pick a provider from the list — the key stays filled in.',
  },
  {
    question: 'What exactly counts as "valid"?',
    answer:
      'We send a real, authenticated GET request to the provider\u2019s own models endpoint. A successful response means the key is valid; anything else surfaces the provider\u2019s own error message. We never fabricate a status — if we don\u2019t know something, we say so.',
  },
  {
    question: 'My provider isn\u2019t in the list. Now what?',
    answer:
      'The registry syncs automatically every day from LiteLLM\u2019s provider data, so most new or missing providers show up on their own within 24 hours. In the meantime, the local/self-hosted option validates any OpenAI-compatible endpoint you give it a URL for.',
  },
  {
    question: 'Is this actually open source?',
    answer:
      'Yes, entirely — MIT licensed. Read it, fork it, or self-host it from the GitHub repo linked in the footer.',
  },
]
