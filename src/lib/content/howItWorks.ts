export interface HowItWorksStep {
  step: string
  title: string
  description: string
}

/**
 * Grounded in what the tool actually does (see requestPreview.ts and
 * validators/*) — not marketing fluff. Each step should stay true even if
 * you read the source code right after reading this copy.
 */
export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: '01',
    title: 'Paste your key',
    description:
      'Drop a key into the console. We recognize the shape of well-known keys — like sk-ant- or AIzaSy — and pick the matching provider automatically.',
  },
  {
    step: '02',
    title: 'We call the real endpoint',
    description:
      'A live request goes straight from a stateless function to the provider\u2019s own API — the same GET /models call your own app would make — with your key attached exactly once.',
  },
  {
    step: '03',
    title: 'You get the real response',
    description:
      'Valid or invalid, you see the provider\u2019s own answer, not a guess. Nothing about the request or the key is logged, cached, or stored anywhere.',
  },
]
