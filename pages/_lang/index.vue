<template>
  <div class="app">
    <prismic-rich-text :field="title" />
    <video autoplay loop playsinline muted class="video-background">
      <source :src="video.url" type="video/mp4" />
    </video>
  </div>
</template>

<script>
export default {
  async asyncData({ $prismic, params, error }) {
    try {
      let languages = $prismic.api.data.languages;
      let lang = { lang: languages[0].id };
      if (params.lang !== undefined || null) {
        lang = { lang: params.lang };
      }

      const document = await $prismic.api.getSingle("homepage", lang);
      return {
        ...document.data,
      };
    } catch (e) {
      error({ statusCode: 404, message: "Page not found" });
    }
  },
};
</script>

<style>
.app {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.video-background {
  object-fit: cover;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
