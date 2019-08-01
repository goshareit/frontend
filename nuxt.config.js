export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    'video.js/dist/video-js.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/goshare-client',
    '~/plugins/session-handler',
    { src: '~/plugins/vue-video-player', ssr: false }
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    '@nuxtjs/eslint-module',
    'cookie-universal-nuxt',
    '@nuxtjs/dotenv',
    ['nuxt-fontawesome', {
      component: 'fa',
      imports: [
        {
          set: '@fortawesome/free-solid-svg-icons',
          icons: ['fas']
        }
      ]
    }]
  ],
  /*
   ** Build configuration
   */
  build: {
    devtools: true,
    transpile: ['goshare-client'],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'eval-source-map' : 'inline-source-map'
      }

      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  }
}
