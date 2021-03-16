<template>
  <transition :name="transitionName">
    <div class="modal" v-show="isVisible" ref="modal">
      <!--      <div class="modal-wrapper">-->
      <!--        <div class="modal-center">-->
      <div class="modal-backdrop" @click="close" />
      <div
        id="ModalQuickCheckout"
        class="modal-container bg-cl-primary ModalQuickCheckout"
        ref="modal_content"
        :style="style"
      >
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

export default {
  name: 'ModalQuickCheckout',
  data () {
    return {
      isVisible: false
    }
  },
  watch: {
    isVisible (state) {
      if (state) {
        this.$nextTick(() => {
          clearAllBodyScrollLocks()
          let bodyVar = document.getElementsByTagName('BODY')[0]
          // let mediaQueryList = window.matchMedia("(max-width: 700px)")
          // if (mediaQueryList.matches) {
          //   //bodyVar.style.position = 'fixed'
          //   //bodyVar.style.overflow = 'hidden'
          //   bodyVar.style.width = '100%'
          // }
          if (window.screen.width < 768) {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop
            let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
            window.onscroll = function () {
              window.scrollTo(scrollLeft, scrollTop)
            }
          }
          bodyVar.classList.add("body-style")
        })
      } else {
        clearAllBodyScrollLocks()
        let bodyVar = document.getElementsByTagName('BODY')[0]
        bodyVar.classList.remove("body-style")
        window.onscroll = function () { }
      }
    },
    showModal (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal === false) {
          this.toggle(false)
        }
      }
    }
  },
  methods: {
    onHide (name, state, params) {
      // document.getElementById('ModalQuickCheckout').style.bottom = '-70%'
      return name === this.name ? this.toggle(false) : false
    },
    onShow (name, state, params) {
      document.getElementById('ModalQuickCheckout').style.bottom = '0'
      const mobileMenuClass = document.getElementsByClassName('right-sidebar-mobile')[0]
      if (mobileMenuClass) {
        this.$store.commit('ui/setSidebar', false)
        mobileMenuClass.style.display = 'none'
        let hamColorChange = document.getElementById("hamberger")
        hamColorChange.classList.remove("hamberger-color")
      }
      return name === this.name && this.showModal ? this.toggle(true) : false
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
    ...mapMutations('ui', ['setOverlay']),
    toggle (state) {
      this.isVisible = state
      state
        ? this.setOverlay(state)
        : setTimeout(() => this.setOverlay(state), this.delay)
    },
    close () {
      this.toggle(false)
      this.$bus.$emit('modal-hide', 'modal-quickcheckoutmodel')
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
      default: 'fade-in-up'
    },
    showModal: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    style () {
      return this.width ? `width: ${this.width}px` : false
    }
  }
};
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
  overflow: unset !important;
  z-index: $z-index-modal;
  transition: all 1s ease;

  .modal-container {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0);
    width: 100%;
    margin: 0 auto;
    max-width: 1247px;
    // max-height: 605px;
    height: auto;
    z-index: $z-index-modal + 1;
    width: 100%;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    @media (max-width: 767px) {
      max-width: 95.99%;
      // max-height: 100%;
    }
    @media screen and (orientation: landscape) and (min-device-width: 812px) and (max-device-width: 812px) {
      overflow-y: auto;
      overflow-x: hidden;
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
}

@media (max-width: 767px) and (orientation: landscape) {
  .modal {
    .modal-container {
      max-height: 450px;
    }
  }
}
</style>
<style>
.body-style .overlay {
  z-index: 10 !important;
}
.zsiq_theme1.zsiq_floatmain {
  z-index: 2 !important;
}
</style>
