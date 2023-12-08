import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
  },
  {
    files: ['**/*.ts'],
    rules: { 'style/semi': ['error', 'always'] },
  },
)
