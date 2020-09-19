export default {
  mode: 'universal',
  target: 'static',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: ['assets/styles/index.scss'],
  plugins: [],
  components: true,
  buildModules: ['@nuxtjs/google-fonts', '@nuxtjs/svg'],
  modules: ['@nuxtjs/pwa', '@nuxtjs/prismic'],
  prismic: {
    endpoint: 'https://cotelette.cdn.prismic.io/api/v2',
    disableGenerator: false,
  },
  googleFonts: {
    families: {
      'Vesper+Libre': true,
    },
    display: 'swap',
  },
  build: {
    extend(config, ctx) {
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
    },
  },
  generate: {
    fallback: '404.html',
  },
}
