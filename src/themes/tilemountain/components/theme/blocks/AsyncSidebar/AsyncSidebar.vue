<template>
  <no-ssr>
    <transition>
      <div
        class="mw-100 fixed cl-accent bg-cl-primary right-sidebar"
        data-testid="sidebar"
        ref="sidebar"
        v-show="isOpen"
      >
        <Microcart/>
      </div>
    </transition>
  </no-ssr>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import LoadingSpinner from 'theme/components/theme/blocks/AsyncSidebar/LoadingSpinner.vue';
import LoadingError from 'theme/components/theme/blocks/AsyncSidebar/LoadingError.vue';
import Microcart from 'theme/components/core/blocks/Microcart/Microcart.vue';
import {
  /**disableBodyScroll, */ clearAllBodyScrollLocks,
} from 'body-scroll-lock';

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
      default: 'right',
    },
  },
  components: {
    'no-ssr': NoSSR,
    Microcart
  },
  data () {
    return {
      component: null,
    };
  },
  watch: {
    isOpen (state) {
      if (state) {
        if (!this.component) {
          this.getComponent();
        }
        // this.$nextTick(() => {
        //   disableBodyScroll(this.$refs.sidebar)
        // })
      } else {
        clearAllBodyScrollLocks();
      }
    },
  },
  methods: {
    getComponent () {
      this.component = () => ({
        component: this.asyncComponent(),
        loading: LoadingSpinner,
        error: LoadingError,
        timeout: 3000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~theme/css/animations/transitions";

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

.right-sidebar {
  top: 0;
  right: 0;
  z-index: 4;
  height: 100%;
  width: 800px;
  min-width: 320px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.microcart-sidebar {
  top: 80px;
  right: 55px;
  z-index: 9999;
  height: auto;
  width: 20%;
  min-width: 365px;
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
    width: 100vh;
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

@media(max-width: 370px){
  .microcart-sidebar{
    min-width: 280px !important;
  }
}
@media (max-width: 767px) {
  .microcart-sidebar {
    top: 26px;
    right: 47px;
    width: 100%;
    min-width: auto;
    max-width: 310px;

  }
  @media(max-width: 320px) {
    .microcart-sidebar {
      top: 26px;
      right: 31px;
      width: 100%;
      min-width: 292px;
      max-width: 310px;
    }
  }
}

</style>
