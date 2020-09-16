export default {
  mode: "universal",
  target: "static",
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/pwa", "@nuxtjs/prismic"],
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  prismic: {
    endpoint: "https://cotelette.cdn.prismic.io/api/v2",
    disableGenerator: false,
  },
  build: {
    extend(config, ctx) {
      config.resolve.alias["vue"] = "vue/dist/vue.common";
    },
  },
  generate: {
    fallback: "404.html",
  },
};
