<template>
  <section class="head-image w-100 cl-white">
    <div class="slider-desktop" v-if="windowWidth > 767">
      <slider-desktop
        :identifier="'home_slider_desktopTM'"
      />
    </div>
    <div class="slider-mobile">
      <slider-mobile
        :identifier="'Home_Slider_Mobile_TM'"
      />
    </div>
  </section>
</template>

<script>
// import ButtonOutline from 'theme/components/theme/ButtonOutline'
import { mapGetters } from 'vuex'
import SliderDesktop from 'src/themes/bedfactory/components/core/blocks/Home/SliderDesktopTM'
import SliderMobile from 'src/themes/bedfactory/components/core/blocks/Home/SliderMobile'

export default {
  components: {
    SliderDesktop,
    SliderMobile
  },
  data () {
    return {
      windowWidth: 768
    }
  },
  mounted () {
    console.log('HeadImage Mounted called')
    this.windowWidth = window.innerWidth
    window.addEventListener('resize', () => {
      this.getWidth()
    })
  },
  methods: {
    getWidth () {
      this.windowWidth = window.innerWidth
    }
  },
  computed: {
    ...mapGetters({
      currentImage: 'promoted/getHeadImage'
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWidth)
  }
};
</script>

<style lang="scss" scoped>
.head-image {
  @media (min-width: 767px) {
    display: inherit;
  }

  .head-image-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 15%;

    .title {
      font-size: 3.4rem;
      margin-bottom: 0;
    }

    .subtitle {
      font-size: 0.8rem;
      max-width: 340px;
      font-family: 'Roboto', sans-serif;
      line-height: 1.2rem;
    }
  }
}
.container {
  background-size: cover;
  background-position: bottom center;
  background-repeat: no-repeat;
}
.row {
  height: 640px;
}
.slider-mobile {
  display: none;
}
@media (max-width: 75em) {
  .head-image {
    height: auto;
  }
  .title {
    font-size: 50px;
  }
  .subtitle {
    font-size: 20px;
  }
  .row {
    height: 400px;
  }
}
@media (max-width: 64em) {
  .head-image {
    height: auto;
  }
  .container {
    background-position: left;
  }
  .title {
    font-size: 48px;
  }
  .subtitle {
    font-size: 18px;
  }
  .button {
    font-size: 16px;
  }
  .row {
    height: 359px;
  }
}



@media (max-width: 480px) {
  .slider-mobile {
    display: block;
    margin-top: -5px;
    padding-bottom: 6px;
    background-color: #fff;
  }
}
@media (min-width: 480px) and (max-width: 600px) {
  .slider-mobile {
    display: block;
    margin-top: -11px;
    padding-bottom: 6px;
    background-color: #fff;
  }
}
@media (min-width: 600px) and (max-width: 700px) {
  .slider-mobile {
    display: block;
    margin-top: -11px;
    padding-bottom: 6px;
    background-color: #fff;
  }
}
@media (min-width: 700px) and (max-width: 767px) {
  .slider-mobile {
    display: block;
    margin-top: -9px;
    padding-bottom: 6px;
    background-color: #fff;
  }
}

@media (max-width: 767px) {
  .slider-desktop {
    display: none;
  }
  .mobilehomepagebanner {
    padding-bottom: 90%;
    position: relative;
  }
}
</style>
<style>
@media (max-width: 767px) {
  .mobilehomepagebanner a {
    position: unset !important;
  }
  .mobilehomepagebanner a img {
    width: 100%;
    height: auto;
    margin-bottom: -4px;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    object-fit: contain;
    position: absolute;
  }
}
</style>
