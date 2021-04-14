<template>
  <div class="color-picker">
    <!-- {{      (colors.custom_options && colors.custom_options.length > 0 ) }} -->
    <!-- In color picker product is {{ $store.state.product.current.name }}
    {{ "................." }}Product: {{ "....." }}{{ colors.name }} <br /> -->
    <product-custom-options
      v-if="colors.custom_options && colors.custom_options.length > 0"
      :product="colors"
      :color="true"
      @closeColorPickerModal="$emit('closeColorPickerModal')"
      @changeColor="$emit('selectedColor', $event)"
    />
  </div>
</template>

<script>
import ProductCustomOptions from 'src/themes/bedfactory/components/core/ProductCustomOptions'
import { mapState } from "vuex";
import i18n from "@vue-storefront/i18n";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import { require } from "vue-analytics";

export default {
  components: {
    ProductCustomOptions
  },
  props: {
    colors: {
      type: Object,
      default: false,
      required: true
    },
  },
  computed: {
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     this.componentLoaded = true;
  //     disableBodyScroll(this.$refs.container);
  //   });
  // },
  // destroyed() {
  //   clearAllBodyScrollLocks();
  // },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/css/animations/transitions";
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$bg-secondary: color(secondary, $colors-background);
$color-gainsboro: color(gainsboro);
$color-matterhorn: color(matterhorn);
$color-mine-shaft: color(mine-shaft);
.color-picker {
  border-top: none !important;
  -webkit-box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.55);
  -moz-box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.55);
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.55);
  position: fixed !important;
  top: 0;
  right: 0;
  height: 100%;
  background-color: #fafafa;
  width: 36%;
  padding: 14px;
  z-index: 999999;
}
.overlay {
  position: fixed;
  width: 70%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  cursor: pointer;
}
.sidebar-menu {
  height: 100vh;
  width: 350px;
  overflow: hidden;
  .color-picker .custom-options .basin h4 {
    font-size: 15px;
    color: #3a5776;
    font-weight: 700;
    margin: 0;
  }
  .color-picker .custom-options .custom-option .basin_size select {
    width: 100%;
  }
  @media (max-width: 767px) {
    width: 100vh;
  }

  &__container {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: calc(100% - 55px);
  }

  &__list {
    transition: transform $duration-main $motion-main;
  }

  ul {
    list-style-type: none;
  }

  li {
    &:hover,
    &:focus {
      background-color: $color-gainsboro;
    }
    &.bg-cl-primary {
      &:hover,
      &:focus {
        background-color: $bg-secondary;
      }
    }
    a {
      color: $color-mine-shaft;
    }
  }

  .subcategory-item {
    display: flex;
    width: 100%;
  }

  button {
    color: $color-mine-shaft;
    a {
      color: $color-mine-shaft;
    }
  }

  .close-btn {
    i {
      color: $color-gainsboro;
    }
    &:hover,
    &:focus {
      i {
        color: $color-matterhorn;
      }
    }
  }
}
@media (max-width: 767px) {
  .color-picker {
    width: 88%;
  }
}
@media (min-width: 768px) and (max-width: 1024px) {
  .color-picker {
    width: 50%;
  }
}
</style>
