<template>
  <no-ssr>
    <transition>
      <div
        class="mw-100 fixed cl-accent right-sidebar right-sidebar-mobile"
        data-testid="sidebar"
        ref="sidebar"
        v-show="isOpen"
      >
        <component
          :is="component"
          @close="$emit('close')"
          @reload="getComponent"
        />
      </div>
    </transition>
  </no-ssr>
</template>

<script>
import NoSSR from "vue-no-ssr"
import LoadingSpinner from "theme/components/theme/blocks/AsyncSidebar/LoadingSpinner.vue"
import LoadingError from "theme/components/theme/blocks/AsyncSidebar/LoadingError.vue"
import {
  /**disableBodyScroll, */ clearAllBodyScrollLocks,
} from "body-scroll-lock"

export default {
  props: {
    asyncComponent: {
      type: Function,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    /** "right" or "left"  */
    direction: {
      type: String,
      default: "right",
    },
  },
  components: {
    "no-ssr": NoSSR,
  },
  data() {
    return {
      component: null,
    }
  },
  watch: {
    isOpen(state) {
      if (state) {
        if (!this.component) {
          this.getComponent()
        }
        // this.$nextTick(() => {
        //   disableBodyScroll(this.$refs.sidebar)
        // })
      } else {
        clearAllBodyScrollLocks()
      }
    },
  },
  methods: {
    getComponent() {
      this.component = () => ({
        component: this.asyncComponent(),
        loading: LoadingSpinner,
        error: LoadingError,
        timeout: 3000,
      })
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~theme/css/animations/transitions';

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.25s;
}

.slide-left-enter,
.slide-left-leave-to {
  transform: translateX(100%);
}

.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(-100%);
}

.right-sidebar-mobile {
  top: 119px;
  right: auto;
  z-index: 99999;
  height: 100%;
  width: 100%;
  max-width: 230px;
  // overflow-y: auto;
  // overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  // border: 2px solid #292758;
  left: 0;
  height: 100%;
  max-height: 421px;
}

.microcart-sidebar {
  top: 80px;
  right: 55px;
  z-index: 10;
  height: auto;
  width: 20%;
  min-width: 365px;
  border: 1px solid #cccccc;
  border-radius: 10px;
  position: absolute;
}

.left-sidebar {
  height: 100vh;
  width: 350px;
  top: 0;
  left: 0;
  overflow: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  z-index: 4;

  @media (max-width: 767px) {
    width: 100%;
    max-width: 320px;
  }
}

.close {
  i {
    opacity: 0.6;
  }
  &:hover,
  &:focus {
    i {
      opacity: 1;
    }
  }
}

@media (max-width: 767px) {
  .microcart-sidebar {
    top: 60px;
    right: 19px;
    width: 100%;
    min-width: 310px;
  }
  .right-sidebar-mobile {
    top: 122px;
  }
}
@media (min-width: 320px) and (max-width: 480px) {
  .right-sidebar-mobile {
    top: 98px;
  }
}
</style>
