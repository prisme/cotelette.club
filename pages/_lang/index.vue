<template>
  <div class="app">
    <video autoplay loop playsinline muted class="video-background">
      <source :src="video.url" type="video/mp4" />
    </video>
    <div class="wrapper">
      <prismic-rich-text class="title" :field="title" />
      <prismic-embed class="showreel" :field="showreel" />
      <prismic-rich-text class="description" :field="description" />
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $prismic, params, error }) {
    try {
      // get lang param from url or use prismic default
      let languages = $prismic.api.data.languages
      let lang = { lang: languages[0].id }
      if (params.lang !== undefined || null) {
        lang = { lang: params.lang }
      }

      const document = await $prismic.api.getSingle('homepage', lang)
      return {
        ...document.data,
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Page not found' })
    }
  },
}
</script>

<style lang="scss">
.app {
  display: flex;
  margin: 0 auto;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Vesper Libre', serif;
  &,
  & a {
    color: white;
  }
}
.video-background {
  object-fit: cover;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.wrapper {
  max-width: 80%;
  text-align: left;
}
.title {
}
.description {
}
</style>
