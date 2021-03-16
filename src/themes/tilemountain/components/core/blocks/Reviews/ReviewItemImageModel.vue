<template>
  <transition :name="transitionName">
    <div class="modal" v-if="isVisible" ref="modal">
      <!--      <div class="modal-wrapper">-->
      <!--        <div class="modal-center">-->

      <div class="modal-backdrop" @click="close" />
      <div
        class="modal-container bg-cl-primary ReviewItemImageModel"
        ref="modal-content"
        :style="style"
      >
        <a @click="close" href="javascript:void(0);" class="close">×</a>
        <header
          class="modal-header py25 px65 h1 serif weight-700 bg-cl-secondary"
          v-if="$slots.header"
        >
          <slot name="header" />
          <i
            slot="close"
            class="modal-close material-icons cl-bg-tertiary"
            @click="close"
            data-testid="closeModalButton"
          >
            close
          </i>
        </header>
        <div
          class="modal-content bg-cl-primary pt30 pb60 px65"
          v-if="$slots.content"
        >
          <slot name="content" />
        </div>

        <!-- ContentHere -->
        <div
          class="yotpo_popup_content_img_div"
          id="yotpo_popup_content_img_div"
        >
          <template
            v-if="review.reviewImages && review.reviewImages.length > 0"
          >
            <no-ssr>
              <carousel
                :per-page-custom="[
                  [320, 1],
                  [375, 1],
                  [768, 1],
                  [1000, 1],
                  [1200, 1],
                ]"
                :center-mode="false"
                :navigation-enabled="true"
                :pagination-enabled="false"
                :adjustable-height="true"
                navigation-next-label="<i class='recent-right-arrow cl-bg-tertiary-new arrow-mobile  material-icons p15  pointer'>keyboard_arrow_right</i>"
                navigation-prev-label="<i class='recent-left-arrow cl-bg-tertiary-new arrow-mobile material-icons p15  pointer'>keyboard_arrow_left</i>"
              >
                <slide
                  v-for="(rImage, rImgIndex) in review.reviewImages"
                  :key="rImgIndex"
                  class="slider-new-main"
                >
                  <div
                    class="pic_one"
                    v-if="rImage.original_url && rImage.original_url"
                  >
                    <!--                        {{ rImgIndex }}-->
                    <img :src="rImage.original_url" alt="review image" />
                  </div>
                </slide>
              </carousel>
            </no-ssr>
          </template>
        </div>
        <div class="yotpo_popup_content_review_div">
          <div class="row">
            <div class="col-xs-3 col-md-4">
              <div class="rating">
                <rating :score="review.score ? parseFloat(review.score) : 0" />
              </div>
            </div>
            <div class="col-xs-9 col-md-8 mrg">
              <div>
                <span class="blue">{{ review.reviewerName }}</span>
                <span class="buyer">{{ formatDate(review.created_date) }}</span>
              </div>
            </div>
          </div>
          <p class="review-title">
            <b v-html="review.title" />
          </p>
          <p class="review-content" v-html="review.content" />
          <div class="verified-buyer-mobile">
            <div class="verify-buyer">
              <span class="buyer">
                {{ review.is_verified_buyer === '1' ? 'Verified Buyer' : '' }}
                <i aria-hidden="true" class="fa fa-check-circle" />
              </span>
            </div>
          </div>
        </div>
        <!-- Content Ends Here -->

        <slot />
      </div>
    </div>
    <!--      </div>-->
    <!--    </div>-->
  </transition>
</template>

<script>
import { mapMutations } from 'vuex'
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import NoSSR from 'vue-no-ssr'
import dateFormat from 'dateformat'
import rating from './Rating'

export default {
  name: 'Modal',
  data () {
    return {
      isVisible: false,
      review: null,
      selectedImgIndex: null
    }
  },
  components: {
    Carousel: () => import('vue-carousel').then(Slider => Slider.Carousel),
    Slide: () => import('vue-carousel').then(Slider => Slider.Slide),
    'no-ssr': NoSSR,
    rating
  },
  watch: {
    isVisible (state) {
      setTimeout(() => {
        if (document.getElementById('yotpo_popup_content_img_div') !== null) {
          const yotpo_slider2 = document.getElementById('yotpo_popup_content_img_div').querySelector('.VueCarousel-inner')
          // yotpo_slider2.style.transform = 'translate(0px, 0px)'
          let widthMedia = window.matchMedia('(max-width: 767px)')
          yotpo_slider2.style.height = '368px'
          widthMedia.style.height = '207px'
        }
      }, 80)
      if (state) {
        this.$nextTick(() => {
          disableBodyScroll(this.$refs['modal'])
          // let bodyVar = document.getElementsByTagName('BODY')[0]
          // bodyVar.style.position = 'fixed'
          // bodyVar.style.width = '100%'
          // bodyVar.classList.add('body-style')
        })
      } else {
        clearAllBodyScrollLocks()
        // let bodyVar = document.getElementsByTagName('BODY')[0]
        // bodyVar.style.position = 'unset'
        // bodyVar.style.width = 'auto'
        // bodyVar.classList.remove('body-style')
      }
    }
  },
  methods: {
    onHide (name, state, params) {
      return name === this.name ? this.toggle(false) : false
    },
    onShow ({ modalName, selectedImgIndex, review }, state, params) {
      this.selectedImgIndex = selectedImgIndex
      this.review = review
      //   console.log('modalName', modalName, selectedImgIndex, review)
      return modalName === this.name ? this.toggle(true) : false
    },
    onToggle (name, state, params) {
      if (name === this.name) {
        state = typeof state === 'undefined' ? !this.isVisible : state
        this.toggle(state)
      }
    },
    onEscapePress () {
      this.close()
    },
    ...mapMutations('ui', [
      'setOverlay'
    ]),
    toggle (state) {
      this.isVisible = state
      state ? this.setOverlay(state) : setTimeout(() => this.setOverlay(state), this.delay)
    },
    close () {
      this.toggle(false)
    },
    formatDate (date) {
      let formattedDate = date.replace(' ', 'T')
      let d = new Date(formattedDate)
      return dateFormat(d, 'dd/mm/yy')
    }
  },
  beforeMount () {
    this.$bus.$on('modal-toggle', this.onToggle)
    this.$bus.$on('modal-show', this.onShow)
    this.$bus.$on('modal-hide', this.onHide)
  },
  beforeDestroy () {
    this.$bus.$off('modal-toggle', this.onToggle)
    this.$bus.$off('modal-show', this.onShow)
    this.$bus.$off('modal-hide', this.onHide)
  },
  mixins: [onEscapePress],
  props: {
    name: {
      required: true,
      type: String
    },
    delay: {
      required: false,
      type: Number,
      default: 300
    },
    width: {
      type: Number,
      default: 0
    },
    transitionName: {
      type: String,
      default: 'fade-in-down'
    }
  },
  computed: {
    style () {
      return this.width ? `width: ${this.width}px` : false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/base/global_vars';
$z-index-modal: map-get($z-index, modal);

.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  //   overflow: auto;
  z-index: $z-index-modal;

  .modal-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 945px;
    margin: 0 auto;
    max-width: 100%;
    max-height: 100%;
    z-index: $z-index-modal + 1;
    border-radius: 5px;

    @media (max-width: 767px) {
      min-height: 100%;
      min-width: 98%;
      margin: 0;
      top: 55%;
      overflow: hidden;
      width: 98%;
      overflow: scroll;
    }
  }

  .modal-header {
    position: relative;

    > * {
      margin: 0;
    }

    @media (max-width: 600px) {
      padding: 25px 20px;
    }
  }

  .modal-content {
    @media (max-width: 600px) {
      padding: 30px 20px;
    }
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .modal-close {
    cursor: pointer;
  }
  .modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .yotpo_popup_content_img_div {
    width: 52%;
    float: left;
    text-align: center;
    position: relative;
    background: black;
    padding: 0 15px;
    border-radius: 5px 0px 0px 5px;
  }
  .yotpo_popup_content_review_div {
    float: left;
    margin: auto 0;
    text-align: left !important;
    padding: 25px 10px 20px 10px;
    width: 42%;
  }
  .yotpo_popup_content_img_div .pic_one img {
    width: 100%;
  }
  .buyer .fa-check-circle:before {
    content: '\f058';
    color: #66c136;
  }
  .buyer {
    color: #4a4a4a;
    font-family: Arial;
    /* line-height: 26px; */
    font-size: 14px;
  }
  .verified-buyer-mobile {
    position: absolute;
    top: 25px;
    right: 25px;
  }
  .blue {
    margin-top: 0;
    color: #4e86d2;
    font-weight: bold;
    font-family: Arial;
    font-size: 14px;
  }
  .buyer {
    color: #acacac;
    margin-bottom: -6px;
    font-family: Arial;
    font-size: 14px;
    margin-top: 0px;
  }
  .review-content {
    color: #4a4a4a;
    font-family: Arial;
    font-size: 16px;
  }
  .review-title {
    color: #4a4a4a;
    font-family: Arial;
    font-size: 16px;
  }
  .yotpo_popup_content_img_div .pic_one img {
    max-height: 656px !important;
    max-width: 100%;
    height: 100%;
  }
  .close {
    position: absolute;
    top: 0px;
    right: 12px;
    -webkit-transition: all 200ms;
    -o-transition: all 200ms;
    transition: all 200ms;
    font-size: 30px;
    font-weight: normal;
    text-decoration: none;
    color: #a2a2a2;
    z-index: 999;
  }
  @media (max-width: 767px) {
    .yotpo_popup_content_img_div {
      width: 91%;
      border-radius: 5px 0px 0px 0px;
    }
    .yotpo_popup_content_review_div {
      width: 94%;
      position: relative;
    }
    .buyer {
      font-size: 11px;
    }
    .close {
      top: -5px;
      right: 0;
      color: #fff;
    }
  }

  @media (min-width: 768px) and (max-width: 992px) {
    .yotpo_popup_content_img_div {
      width: 51%;
    }
    .buyer {
      font-size: 11px;
    }
    .blue {
      font-size: 12px;
    }
  }
}
</style>
<style>
.yotpo_popup_content_img_div
  .VueCarousel-navigation
  .VueCarousel-navigation-prev {
  left: 55px;
}
.yotpo_popup_content_img_div
  .VueCarousel-navigation
  .VueCarousel-navigation-prev:focus {
  outline: none;
}
.yotpo_popup_content_img_div
  .VueCarousel-navigation
  .VueCarousel-navigation-next {
  right: 55px;
}
.yotpo_popup_content_img_div
  .VueCarousel-navigation
  .VueCarousel-navigation-next:focus {
  outline: none;
}
.yotpo_popup_content_img_div .VueCarousel-navigation button i {
  font-size: 45px;
  color: #fff;
}
.yotpo_popup_content_img_div .VueCarousel-navigation {
  opacity: 1 !important;
}
</style>
