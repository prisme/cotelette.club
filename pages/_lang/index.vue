<template>
  <article class="root">
    <prismic-rich-text class="name" :field="name" />

    <nav class="contact">
      <ul class="contact__list">
        <li v-for="link in contact_links" :key="link.id" class="contact__item">
          <prismic-link :field="link.link">
            {{ $prismic.asText(link.label) }}
          </prismic-link>
        </li>
      </ul>
    </nav>
    <div class="money">
      <prismic-rich-text class="job-title" :field="job_title" />
      <button class="showreel-cta">
        <span>show</span
        ><PlayBtn class="showreel-cta__play" @click="playReel" /><span
          >reel</span
        >
      </button>
      <prismic-embed class="showreel" :field="showreel" ref="showreel" />
    </div>
    <div class="bio">
      <prismic-rich-text
        v-if="isPortrait"
        class="bio__title"
        :field="biography_title"
      />
      <div class="bio__photo">
        <prismic-image :field="photo" />
        <prismic-rich-text class="bio__credit" :field="credit" />
      </div>
      <div class="bio__text">
        <prismic-rich-text
          v-if="!isPortrait"
          class="bio__title"
          :field="biography_title"
        />
        <prismic-rich-text class="bio__copy" :field="biography" />
      </div>
    </div>
    <video
      autoplay
      loop
      playsinline
      muted
      class="video-background"
      :src="videoUrl"
    />
  </article>
</template>

<script>
import PlayBtn from '~/assets/images/play.svg?inline'
import debounce from 'lodash.debounce'

export default {
  components: {
    PlayBtn,
  },
  data() {
    return {
      videoUrl: null,
      isPortrait: true,
    }
  },
  methods: {
    playReel() {
      const { display } = this.$refs.showreel.style
      this.$refs.showreel.style.display = display === 'block' ? 'none' : 'block'
    },
    onResize() {
      const { video_portrait, video } = this
      const { innerWidth, innerHeight } = window
      this.isPortrait = innerWidth < innerHeight || innerWidth < 720
      this.videoUrl = this.isPortrait ? video_portrait.url : video.url
    },
  },
  async mounted() {
    await this.$nextTick
    this.onResize()
    window.addEventListener('resize', debounce(this.onResize, 50))
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
      return { ...document.data }
    } catch (e) {
      error({ statusCode: 404, message: 'Page not found' })
    }
  },
  head() {
    const { meta_title, meta_description, meta_image } = this
    const title = meta_title.length ? this.meta_title[0].text : ''
    const description = meta_description.length
      ? this.meta_description[0].text
      : ''
    const image = this.meta_image.url || ''
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        { hid: 'og:title', name: 'og:title', content: title },
        { hid: 'og:description', name: 'og:description', content: description },
        { hid: 'og:image', name: 'og:image', content: image },
      ],
    }
  },
}
</script>

<style lang="scss">
.root {
  max-width: 100vw;
  overflow-x: hidden;
  min-height: 100vh;
}
@supports (-webkit-touch-callout: none) {
  .root {
    height: -webkit-fill-available;
  }
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
.name {
  position: absolute;
  $top: 50px;
  $left: 60px;
  * {
    line-height: 1em;
  }
  top: rem($top/2);
  left: rem($left/2);
  * {
    font-size: rem(12px);
  }
  @include responsive('m') {
    top: rem($top);
    left: rem($left);
    * {
      font-size: rem(16px);
    }
  }
}
.contact {
  position: absolute;
  top: rem(25px);
  right: rem(30px);
  * {
    font-size: rem(10px);
    line-height: 1.2em;
  }
  @include responsive('m') {
    top: rem(50px);
    right: rem(60px);
    * {
      font-size: rem(14px);
    }
  }
  &__list {
    list-style: none;
    padding: 0;
  }
  &__item {
    display: inline;
    &:not(:last-child)::after {
      content: '/';
      margin: 0 rem(5px);
    }
  }
  a {
    border-bottom: 0.5px solid white;
    display: inline-block;
    line-height: 1;
    text-decoration: none;
  }
}
.money {
  position: absolute;
  top: 40vh;
  left: 50%;
  transform: translateX(-50%) perspective(1px);
  text-align: center;
}
.job-title {
  line-height: 0.5;
  * {
    font-size: rem(12px);
  }
  @include responsive('m') {
    line-height: normal;
    * {
      font-size: rem(20px);
    }
  }
}
.showreel-cta {
  line-height: 1em;
  letter-spacing: 0.03em;
  font-size: rem(27.5px);
  @include responsive('m') {
    font-size: rem(50px);
  }
  &__play {
    transform: scale(0.9) translateY(30%);
    @include responsive('m') {
      transform: scale(1.1) translateY(11%);
      margin: 0 0.1em;
    }
  }
}
.showreel {
  display: none;
}
.bio {
  position: absolute;
  top: 120vh;
  width: 64%;
  @include responsive('m') {
    width: 80%;
  }
  max-width: 1024px;
  left: 50%;
  transform: translateX(-50%) perspective(1px);

  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 1px;
    height: 200px;
    background-color: white;
    top: -140px;
    @media screen and (min-height: 400px) {
      top: -240px;
    }
    left: 51.5%;
  }
  &__text {
    padding-bottom: 20vh;
    padding-top: 1em;
    @include responsive('m') {
      padding-top: 0;
      position: absolute;
      max-width: 560px;
      width: 45%;
      left: unquote('min(63%, 530px)');
      top: 50px;
    }
  }
  &__title {
    position: relative;
    z-index: 1;
    line-height: 0.4;
    left: -20px;
    * {
      font-size: rem(35px);
    }
    @include responsive('m') {
      z-index: 0;
      line-height: unset;
      // left: 0;
      left: -70px;
      * {
        font-size: rem(70px);
      }
    }
  }
  &__copy {
    * {
      font-size: rem(12px);
    }
    @include responsive('m') {
      // padding-left: 70px;
      * {
        font-size: rem(14px);
      }
    }
    p {
      margin: 0 0 1em;
    }
  }
  &__photo {
    max-width: 480px;
    width: 100%;
    @include responsive('m') {
      width: 55%;
    }
    img {
      display: block;
      width: 100%;
    }
  }
  &__credit {
    padding: 0.2em 0;
    color: fade-out(white, 0.3);
    * {
      font-size: rem(8px);
    }
    @include responsive('m') {
      * {
        font-size: rem(10px);
      }
    }
  }
}
</style>
