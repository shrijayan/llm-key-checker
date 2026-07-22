import nextConfig from 'eslint-config-next'

/**
 * Next.js 16 removed the built-in `next lint` CLI wrapper — ESLint 9's flat
 * config is now the supported path, and `eslint-config-next` already ships
 * one (core rules + TypeScript rules + sensible ignores). We just use it
 * directly instead of hand-rolling parser/plugin wiring.
 */
const config = [...nextConfig]

export default config
