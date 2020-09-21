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
        <span>show</span>
        <PlayBtn class="showreel__play" @click="playReel" />
        <span>reel</span>
      </button>
      <prismic-embed class="showreel" :field="showreel" ref="showreel" />
    </div>

    <div class="bio">
      <div class="bio__text">
        <prismic-rich-text class="bio__title" :field="biography_title" />
        <prismic-rich-text class="bio__copy" :field="biography" />
      </div>
      <div class="bio__photo">
        <prismic-image class="photo" :field="photo" />
        <prismic-rich-text class="credit" :field="credit" />
      </div>
    </div>
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
  methods: {
    playReel() {
      const { display } = this.$refs.showreel.style
      this.$refs.showreel.style.display = display === 'block' ? 'none' : 'block'
    },
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
  min-height: 100vh;
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
  top: rem(25px);
  left: rem(30px);
  * {
    font-size: rem(12px);
    line-height: 1em;
  }
  @include responsive('m') {
    top: rem(50px);
    left: rem(60px);
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
}
.money {
  position: absolute;
  top: 40vh;
  left: 50%;
  transform: translateX(-50%) perspective(1px);
  text-align: center;
}
.job-title {
  * {
    font-size: rem(12px);
  }
  @include responsive('m') {
    * {
      font-size: rem(20px);
    }
  }
}
.showreel-cta {
  font-size: rem(27.5px);
  @include responsive('m') {
    font-size: rem(50px);
  }
  line-height: 1em;
  &__play {
    transform: scale(0.7) translateY(42%);
    @include responsive('m') {
      transform: none;
    }
  }
}
.showreel {
  display: none;
}
$photo-width: 480px;
.bio {
  position: absolute;
  top: 120vh;
  width: 80%;
  max-width: 1024px;
  left: 50%;
  transform: translateX(-50%) perspective(1px);
  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 1px;
    height: 160px;
    background-color: white;
    top: -200px;
    left: 50%;
  }
  &__text {
    position: absolute;
    max-width: 560px;
    width: 50%;
    left: $photo-width - 20px;
    top: 50px;
  }
  &__title {
    * {
      font-size: rem(70px);
    }
  }
  &__copy {
    padding-left: 70px;
  }
  &__photo {
    width: $photo-width;
  }
}
</style>
