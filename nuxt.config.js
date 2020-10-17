export default {
  mode: 'universal',
  target: 'static',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
      },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
      { name: 'theme-color', content: '#000000' },
      { name: 'msapplication-TileColor', content: '#000000' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚑</text></svg>' }],
  },
  css: ['assets/styles/index.scss', 'plyr/dist/plyr.css'],
  plugins: ['~/plugins/vue-plyr'],
  components: true,
  buildModules: [
    '@nuxtjs/google-fonts',
    '@nuxtjs/svg',
    '@nuxtjs/style-resources',
  ],
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
  styleResources: {
    scss: [
      '~~/node_modules/sass-rem/_rem.scss',
      'assets/styles/_animation.scss',
      'assets/styles/_responsive.scss',
    ],
  },
  build: {
    extend(config, ctx) {
      // to transform link with <nuxt-link> for the htmlSerializer
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
    },
  },
  generate: {
    fallback: '404.html',
  },
}
