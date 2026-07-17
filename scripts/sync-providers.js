#!/usr/bin/env node
/**
 * sync-providers.js
 * 
 * Fetches LiteLLM's provider data daily and updates registry.generated.json.
 * Run by GitHub Actions cron or manually with: npm run sync-providers
 * 
 * Sources:
 *   1. litellm/llms/openai_like/providers.json — simple providers with base_url
 *   2. model_prices_and_context_window.json   — all 123+ provider IDs
 */

const fs = require('fs')
const path = require('path')

const LITELLM_PRICES_URL =
  'https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json'
const LITELLM_SIMPLE_PROVIDERS_URL =
  'https://raw.githubusercontent.com/BerriAI/litellm/main/litellm/llms/openai_like/providers.json'
const OUTPUT_PATH = path.join(__dirname, '../src/lib/providers/registry.generated.json')

// ─── Known base URLs (from LiteLLM constants.py + research) ─────────────────
// These are providers hardcoded in LiteLLM Python files, not in providers.json
const KNOWN_BASE_URLS = {
  groq:           'https://api.groq.com/openai/v1',
  mistral:        'https://api.mistral.ai/v1',
  deepseek:       'https://api.deepseek.com/v1',
  together_ai:    'https://api.together.xyz/v1',
  fireworks_ai:   'https://api.fireworks.ai/inference/v1',
  deepinfra:      'https://api.deepinfra.com/v1/openai',
  perplexity:     'https://api.perplexity.ai',
  xai:            'https://api.x.ai/v1',
  sambanova:      'https://api.sambanova.ai/v1',
  cerebras:       'https://api.cerebras.ai/v1',
  nebius:         'https://api.studio.nebius.ai/v1',
  moonshot:       'https://api.moonshot.cn/v1',
  dashscope:      'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
  featherless_ai: 'https://api.featherless.ai/v1',
  meta_llama:     'https://api.llama.com/compat/v1/',
  codestral:      'https://codestral.mistral.ai/v1',
  nvidia_nim:     'https://integrate.api.nvidia.com/v1',
  openrouter:     'https://openrouter.ai/api/v1',
  ai21:           'https://api.ai21.com/studio/v1',
  novita:         'https://api.novita.ai/v3/openai',
  hyperbolic:     'https://api.hyperbolic.xyz/v1',
  lambda_ai:      'https://api.lambda.ai/v1',
  stepfun:        'https://api.stepfun.com/v1',
  baichuan:       'https://api.baichuan-ai.com/v1',
  volcengine:     'https://ark.cn-beijing.volces.com/api/v3',
  minimax:        'https://api.minimax.io/v1',
  huggingface:    'https://router.huggingface.co/v1',
  cohere:         'https://api.cohere.com/v1',
  zai:            'https://open.bigmodel.cn/api/paas/v4',
  tencent:        'https://api.hunyuan.cloud.tencent.com/v1',
  anyscale:       'https://api.endpoints.anyscale.com/v1',
  aiml:           'https://api.aimlapi.com/v1',
  galadriel:      'https://api.galadriel.com/v1',
  predibase:      'https://serving.app.predibase.com/v1',
  friendliai:     'https://inference.friendli.ai/v1',
  nlp_cloud:      'https://api.nlpcloud.io/v1',
  aleph_alpha:    'https://api.aleph-alpha.com/v1',
}

// ─── Providers handled by registry.static.ts — skip in generated ────────────
const STATIC_IDS = new Set([
  'openai', 'anthropic', 'gemini', 'bedrock', 'bedrock_converse',
  'azure', 'azure_ai', 'azureopenai', 'vertex_ai', 'sagemaker',
  'watsonx', 'snowflake', 'databricks', 'cloudflare', 'oci',
  'chatgpt', 'github_copilot', 'palm', 'replicate',
  'groq', 'mistral', 'deepseek', 'together_ai', 'fireworks_ai',
  'deepinfra', 'perplexity', 'xai', 'sambanova', 'cerebras',
  'nebius', 'moonshot', 'dashscope', 'featherless_ai', 'meta_llama',
  'codestral', 'nvidia_nim', 'openrouter', 'ai21', 'novita',
  'hyperbolic', 'lambda_ai', 'stepfun', 'baichuan', 'volcengine',
  'minimax', 'huggingface', 'cohere', 'zai', 'tencent',
  'ollama', 'lmstudio', 'vllm',
])

// ─── Skip entirely — not LLM chat providers ─────────────────────────────────
const SKIP_IDS = new Set([
  'text-completion-openai', 'text-completion-codestral', 'text-completion-inception',
  'deepgram', 'elevenlabs', 'stability', 'runwayml', 'fal_ai',
  'black_forest_labs', 'aws_polly', 'recraft',
  'vercel_ai_gateway', 'wandb',
  'exa_ai', 'firecrawl', 'serper', 'searxng', 'tavily', 'linkup',
  'dataforseo', 'duckduckgo', 'google_pse', 'you_com',
  'bedrock_mantle', 'amazon_nova',
  'vertex_ai-embedding-models', 'vertex_ai-image-models', 'vertex_ai-video-models',
  'vertex_ai-text-models', 'vertex_ai-ai21_models', 'vertex_ai-llama_models',
  'vertex_ai-mistral_models', 'vertex_ai-deepseek_models', 'vertex_ai-openai_models',
  'vertex_ai-qwen_models', 'vertex_ai-zai_models', 'vertex_ai-moonshot_models',
  'vertex_ai-minimax_models', 'vertex_ai-language-models', 'vertex_ai-anthropic_models',
  'vertex_ai', 'vertex_ai-embedding-models',
  'soniox', 'assemblyai', 'reducto', 'topaz',
  'snowflake', 'gigachat', 'azure_text',
])

// ─── Display names override ──────────────────────────────────────────────────
const DISPLAY_NAMES = {
  together_ai:    'Together AI',
  fireworks_ai:   'Fireworks AI',
  deepinfra:      'DeepInfra',
  deepseek:       'DeepSeek',
  nvidia_nim:     'NVIDIA NIM',
  sambanova:      'SambaNova',
  featherless_ai: 'Featherless AI',
  meta_llama:     'Meta Llama API',
  codestral:      'Codestral (Mistral)',
  ai21:           'AI21 Labs',
  lambda_ai:      'Lambda AI',
  xai:            'xAI (Grok)',
  openrouter:     'OpenRouter',
  xiaomi_mimo:    'Xiaomi MiMo',
  'nano-gpt':     'NanoGPT',
  volcengine:     'ByteDance (Doubao/Ark)',
  minimax:        'MiniMax',
  dashscope:      'Qwen / DashScope (Alibaba)',
  moonshot:       'Moonshot AI (Kimi)',
  zai:            'Zhipu AI (GLM)',
  huggingface:    'HuggingFace',
  stepfun:        'StepFun',
  baichuan:       'Baichuan AI',
  tencent:        'Tencent Hunyuan',
  hyperbolic:     'Hyperbolic',
  novita:         'Novita AI',
  veniceai:       'Venice AI',
  charity_engine: 'Charity Engine',
  aihubmix:       'AI Hub Mix',
  llamagate:      'LlamaGate',
  gmi:            'GMI Cloud',
  sarvam:         'Sarvam AI',
  scaleway:       'Scaleway',
  crusoe:         'Crusoe',
  neosantara:     'NeoSantara',
  tensormesh:     'TensorMesh',
  parasail:       'Parasail',
  libertai:       'LibertAI',
  empiriolabs:    'Empirio Labs',
  pinstripes:     'Pinstripes',
  publicai:       'Public AI',
  darkbloom:      'Darkbloom',
  synthetic:      'Synthetic AI',
  apertis:        'Apertis',
  helicone:       'Helicone',
  poe:            'Poe',
  chutes:         'Chutes AI',
  abliteration:   'Abliteration AI',
  aiml:           'AI/ML API',
  predibase:      'Predibase',
  friendliai:     'FriendliAI',
  nlp_cloud:      'NLP Cloud',
  aleph_alpha:    'Aleph Alpha',
  galadriel:      'Galadriel',
  morph:          'Morph',
  gradient_ai:    'Gradient AI',
  wandb_inference: 'W&B Inference',
  nscale:         'Nscale',
  ovhcloud:       'OVH Cloud',
  lemonade:       'Lemonade',
  inception:      'Inception Labs',
  cometapi:       'CometAPI',
  telnyx:         'Telnyx',
  qiniu:          'Qiniu Cloud',
}

const CHINESE_IDS = new Set([
  'deepseek', 'moonshot', 'dashscope', 'minimax', 'volcengine', 'zai',
  'tencent', 'baichuan', 'stepfun', 'xiaomi_mimo', 'baidu', 'sensetime',
  'iflytek', 'internlm', 'qiniu', 'neosantara',
])

const LOCAL_IDS = new Set(['ollama', 'lmstudio', 'vllm', 'llamacpp', 'llamafile', 'lemonade'])

const POPULAR_IDS = new Set([
  'groq', 'mistral', 'together_ai', 'fireworks_ai', 'deepinfra', 'perplexity',
  'xai', 'cerebras', 'sambanova', 'openrouter', 'cohere', 'ai21', 'huggingface',
  'nebius', 'nvidia_nim', 'deepseek', 'moonshot',
])

function toDisplayName(id) {
  if (DISPLAY_NAMES[id]) return DISPLAY_NAMES[id]
  return id.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function getCategory(id) {
  if (CHINESE_IDS.has(id)) return 'chinese'
  if (LOCAL_IDS.has(id)) return 'local'
  if (POPULAR_IDS.has(id)) return 'popular'
  return 'other'
}

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return res.json()
}

async function main() {
  console.log('Syncing providers from LiteLLM...')

  // Load current registry
  let current = []
  try {
    current = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'))
  } catch {
    console.log('No existing registry.generated.json, starting fresh')
  }
  const currentIds = new Set(current.map((p) => p.id))

  // Fetch LiteLLM data in parallel
  const [prices, simpleProviders] = await Promise.all([
    fetchJSON(LITELLM_PRICES_URL),
    fetchJSON(LITELLM_SIMPLE_PROVIDERS_URL),
  ])

  // Extract all provider IDs from prices.json
  const allProviderIds = new Set()
  for (const val of Object.values(prices)) {
    if (val && typeof val === 'object' && val.litellm_provider) {
      allProviderIds.add(val.litellm_provider)
    }
  }

  const newEntries = []

  // Process providers.json (have exact base_url)
  for (const [id, config] of Object.entries(simpleProviders)) {
    if (STATIC_IDS.has(id) || SKIP_IDS.has(id) || currentIds.has(id)) continue
    newEntries.push({
      id,
      name: toDisplayName(id),
      baseUrl: config.base_url,
      authType: 'bearer',
      corsEnabled: false,
      category: getCategory(id),
      fields: [{ key: 'apiKey', label: 'API Key', secret: true }],
    })
  }

  // Process all providers from prices.json not yet handled
  for (const id of allProviderIds) {
    if (STATIC_IDS.has(id) || SKIP_IDS.has(id)) continue
    if (currentIds.has(id) || newEntries.find((e) => e.id === id)) continue

    const baseUrl = KNOWN_BASE_URLS[id] || null
    newEntries.push({
      id,
      name: toDisplayName(id),
      ...(baseUrl ? { baseUrl } : {}),
      authType: 'bearer',
      corsEnabled: false,
      category: getCategory(id),
      fields: baseUrl
        ? [{ key: 'apiKey', label: 'API Key', secret: true }]
        : [
            { key: 'baseUrl', label: 'Base URL', placeholder: 'https://api.example.com/v1', secret: false },
            { key: 'apiKey', label: 'API Key', secret: true },
          ],
    })
  }

  if (newEntries.length === 0) {
    console.log('No new providers found. Registry is up to date.')
    return
  }

  const updated = [...current, ...newEntries].sort((a, b) => a.name.localeCompare(b.name))
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(updated, null, 2) + '\n')
  console.log(`Added ${newEntries.length} new providers: ${newEntries.map((e) => e.id).join(', ')}`)
  console.log(`Total providers in registry: ${updated.length}`)
}

main().catch((err) => {
  console.error('Sync failed:', err)
  process.exit(1)
})
