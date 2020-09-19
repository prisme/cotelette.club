<template>
  <article class="root">
    <prismic-rich-text class="name" :field="name" />

    <nav>
      <ul>
        <li v-for="link in contact_links" :key="link.id">
          <prismic-link :field="link.link">{{
            $prismic.asText(link.label)
          }}</prismic-link>
        </li>
      </ul>
    </nav>

    <prismic-rich-text class="job-title" :field="job_title" />
    <button class="showreel-cta">
      <span>show</span>
      <PlayBtn />
      <span>reel</span>
    </button>
    <prismic-embed class="showreel" :field="showreel" />

    <prismic-rich-text class="title" :field="title" />
    <prismic-rich-text class="description" :field="description" />
    <prismic-image class="photo" :field="photo" />
    <prismic-rich-text class="credit" :field="credit" />

    <video autoplay loop playsinline muted class="video-background">
      <source :src="video.url" type="video/mp4" />
    </video>
  </article>
</template>

<script>
import PlayBtn from '~/assets/images/play.svg?inline'
export default {
  components: {
    PlayBtn,
  },
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
.root {
  min-height: 100vh;
  font-family: 'Vesper Libre', serif;
  color: white;
}
.video-background {
  object-fit: cover;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
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
