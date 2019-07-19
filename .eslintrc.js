module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'prettier',
    'prettier/vue',
    'plugin:nuxt/recommended',
    'plugin:vue/recommended',
    '@nuxtjs'
  ],
  plugins: [
    'vue',
    'prettier'
  ],
  // add your custom rules here
  rules: {
  }
}
