<template>
  <main class="root">
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
      <button @click="openReel">
        <prismic-rich-text class="job-title" :field="job_title" />
        <span class="showreel-cta">show</span
        ><PlayBtn class="showreel-cta__play" /><span class="showreel-cta"
          >reel</span
        >
      </button>
    </div>
    <transition-group name="fade">
      <button
        v-show="isReelShown"
        class="showreel__close"
        @click="closeReel"
        key="showreel__close"
      >
        <CloseBtn />
      </button>
      <vue-plyr
        v-show="isReelShown"
        class="showreel"
        :options="plyrOptions"
        key="showreel__player"
        ref="plyr"
      >
        <div
          data-plyr-provider="vimeo"
          :data-plyr-embed-id="showreel.video_id"
        ></div>
      </vue-plyr>
    </transition-group>
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
  </main>
</template>

<script>
import PlayBtn from '~/assets/images/play.svg?inline'
import CloseBtn from '~/assets/images/close.svg?inline'
import debounce from 'lodash.debounce'

export default {
  components: {
    PlayBtn,
    CloseBtn,
  },
  data() {
    return {
      videoUrl: null,
      isPortrait: true,
      plyrOptions: {
        controls: ['mute', 'fullscreen'],
        fullscreen: { iosNative: true },
        hideControls: false,
      },
      isReelShown: false,
    }
  },
  methods: {
    openReel() {
      this.isReelShown = true
      this.$refs.plyr.player.play()
      document.body.style.position = 'fixed'
      document.body.style.overflow = 'hidden'
      document.body.style.width = '100%'
    },
    closeReel() {
      this.isReelShown = false
      this.$refs.plyr.player.stop()
      document.body.style.position = ''
      document.body.style.overflow = ''
      document.body.style.width = ''
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
$y: 50px;
$x: 60px;
.showreel {
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .plyr--video {
    background-color: #131313;
    .plyr__controls {
      margin: 0 rem($x/2) 3.125rem;
      @include responsive('m') {
        margin: 0 rem($x) 3.125rem;
      }
      .plyr__control {
        padding: 0.5em;
      }
    }
  }
  &__close {
    // drunk css is the best
    &,
    &:hover {
      position: absolute;
      top: rem($y/4);
      right: rem($x/2);
      @include responsive('m') {
        top: calc(3.125rem - 0.6em); // who cares
        right: rem($x);
      }
      z-index: 2;
      padding: 0.5em;
      width: var(--plyr-control-icon-size, 18px);
      height: var(--plyr-control-icon-size, 18px);
      svg {
        fill: white;
      }
    }
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
.name,
.contact {
  position: absolute;
  top: rem($y/2);
  @include responsive('m') {
    top: rem($y);
  }
  * {
    line-height: 1em;
    font-size: rem(14px);
    @include responsive('m') {
      font-size: rem(16px);
    }
  }
}
.name {
  z-index: 2;
  left: rem($x/2);
  @include responsive('m') {
    left: rem($x);
  }
}
.contact {
  right: rem($x/2);
  @include responsive('m') {
    right: rem($x);
  }
}
.contact {
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
  left: 50.4%;
  text-align: center;
  transform: translateX(-50%) perspective(1px) scale(1.1);
  @include responsive('m') {
    transform: translateX(-50%) perspective(1px) scale(1);
  }
}
.job-title {
  line-height: 1;
  * {
    font-size: rem(14px);
  }

  @include responsive('m') {
    line-height: normal;
    * {
      font-size: rem(19px);
    }
  }
}
.showreel-cta {
  line-height: 1em;
  letter-spacing: 0.03em;
  font-size: rem(34px);
  @include responsive('m') {
    font-size: rem(47px);
  }
  &__play {
    transform: scale(0.9) translateY(30%);
    @include responsive('m') {
      transform: scale(1.1) translateY(11%);
      margin: 0 0.1em;
    }
    path {
      fill: white;
    }
    circle {
      stroke: white;
    }
  }
  span:nth-of-type(2n) {
    letter-spacing: 0.05em;
    margin-left: 0.1em;
  }
}
.bio {
  position: absolute;
  top: 110vh;
  width: 65%;
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
      font-size: rem(13px);
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity $anim-transition-in;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
