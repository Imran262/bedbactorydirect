<template>
  <div class="price-slider-container">
    <no-ssr placeholder="loading..." placeholader-tag="span">
      <vue-slider
        ref="priceSlider"
        v-model="value"
        v-bind="priceSliderOptions"
        :clickable="false"
        :min="getMin"
        :max="getMax"
        :tooltip-formatter="tooltipContent"
        @drag-end="setPrice"
        @input="sliderChange"
      />
    </no-ssr>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import isEqual from 'lodash-es/isEqual';
import { products } from 'config';

const PriceSliderComponents = {};

if (process.browser) {
  let VueSlider = require('vue-slider-component');
  PriceSliderComponents['vue-slider'] = VueSlider;
}
PriceSliderComponents['no-ssr'] = NoSSR;

export default {
  name: 'PriceSlider',
  props: {
    content: {
      type: null,
      default: ''
    },
    id: {
      type: null,
      required: true
    },
    code: {
      type: null,
      required: true
    },
    priceRange: {
      type: Array,
      required: true
    },
    context: {
      type: null,
      default: ''
    }
  },
  beforeMount () {
    this.$bus.$on('reset-filters', this.resetPriceSlider);
    this.$bus.$on('reset-price-slider', this.resetPriceSlider);
  },
  beforeDestroy () {
    this.$bus.$off('reset-filters', this.resetPriceSlider);
    this.$bus.$off('reset-price-slider', this.resetPriceSlider);
  },
  mounted () {
    const routeQueryData = this.$store.state.route[products.routerFiltersSource];
    if (routeQueryData.hasOwnProperty('price')) {
      const routePriceRange = routeQueryData['price'].split('-');
      if (!isEqual(this.value, routePriceRange)) {
        this.value = routePriceRange;
      }
    }
  },
  data () {
    return {
      active: false,
      remove: false,
      value: this.priceRange,
      currencySign: this.$store.state.config.i18n.currencySign,
      priceSliderConfig: this.$store.state.config.layeredNavigation.priceSliderOptions
    };
  },
  computed: {
    priceSliderOptions () {
      return {
        ...this.priceSliderConfig,
        ...this.tooltipContent,
        silent: true
      };
    },
    tooltipContent () {
      return { formatter: this.currencySign + ' {value}' + ' /Sqm' };
    },
    getMin () {
      return this.priceRange[0];
    },
    getMax () {
      return this.priceRange[1];
    }
  },
  watch: {
    $route: function (to, from) {
      this.validateRoute('update');
      if (from.path && to.path && from.path !== to.path) {
        this.value = this.priceRange;
      }
    }
  },
  methods: {
    setPrice: function (e) {
      let val = e.val;
      let from = parseInt(val[0]);
      let to = parseInt(val[1]);
      let id = from.toFixed(1) + '-' + to.toFixed(1);
      this.remove = isEqual([from, to], this.priceRange);
      this.switchFilter({
        id: id,
        type: this.code,
        from: from,
        to: to,
        remove: this.remove
      });
    },
    switchFilter (variant) {
      this.$emit('change', variant);
    },
    resetPriceSlider () {
      if (this.$refs.priceSlider) {
        this.$refs.priceSlider.setValue(this.priceRange);
      }
    },
    validateRoute () {
      const routeQueryData = this.$store.state.route[products.routerFiltersSource];
      if (this.$refs.priceSlider && !routeQueryData.hasOwnProperty('price')) {
        this.$nextTick(() => {
          this.$refs.priceSlider.setValue(this.priceRange);
        });
      }
    },
    sliderChange: function (e) {
      const sliderDot = this.$el.querySelectorAll('.vue-slider-dot')[1];
      const dotStyles = getComputedStyle(sliderDot);
      let dotMatrix = new WebKitCSSMatrix(dotStyles.transform);
      if (dotMatrix.m41 < 100) {
        this.$el.querySelectorAll('.vue-slider-process .vue-merged-tooltip')[0].classList.add('left-fixed')
      } else {
        this.$el.querySelectorAll('.vue-slider-process .vue-merged-tooltip')[0].classList.remove('left-fixed')
      }
    }
  },
  components: PriceSliderComponents
};
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";

$color-event: color(tertiary);
$color-active: color(accent);

.price-slider-container {
  padding-bottom: 50px;
  position: relative;
  z-index: 0;
  padding-right: 6px;
  @media (max-width: 767px) {
    padding-right: 0px;
  }
  @media (max-width: 480px) {
    width: 96%;
  }
}

.price-selector {
  width: 20px;
  height: 20px;

  &.active {
    .square {
      background-color: $color-active;
    }
  }
}

// .square {
//   width: 80%;
//   height: 80%;
//   left: 50%;
//   top: 50%;
//   transform: translate(-50%,-50%);
// }
.square {
  width: 80%;
  @media (max-width: 480px) {
    width: 50%;
  }
  height: 80%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>

<style lang="scss">
.vue-slider-component .vue-slider-dot {
  box-shadow: none;
}

.vue-slider-dot-handle {
  background-color: #da2f89 !important;
}

.vue-slider-component.vue-slider-horizontal .vue-slider-process {
  background-color: #2a285a !important;
  height: 4px !important;
  padding: 0px !important;
}

.vue-slider-tooltip {
  background-color: #ffffff !important;
  color: #434343 !important;
  border-color: #2a285a !important;
}

.vue-slider-tooltip:before {
  display: none;
}

.vue-slider-horizontal {
  padding: 0px !important;
}

.vue-slider-always.vue-slider-dot .vue-slider-tooltip-bottom {
  margin-left: 0px !important;
  left: 2px;
  transform: translate(0, 100%);
  right: auto;
}

.vue-slider-always.vue-slider-dot:nth-child(2) .vue-slider-tooltip-bottom {
  margin-left: 0px !important;
  right: 2px;
  left: auto;
  transform: translate(0, 100%);
}

.vue-slider-component .vue-slider-tooltip {
  font-size: 13px;
  color: #434343 !important;
  font-weight: bold;
  padding: 4px 5px !important;
  min-width: fit-content;
}

.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-bottom.vue-merged-tooltip {
  transform: translate(0%, 92%) !important;
  right: -5px !important;
  left: auto !important;
}

.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-bottom.vue-merged-tooltip.left-fixed {
  right: auto !important;
  left: -5px !important;
}

// @media (max-width: 767px) {
//   .vue-slider-tooltip {
//     background-color: #ffffff !important;
//     color:#434343 !important;
//     border-color: #2a285a !important;
//     // font-weight: bold;
//   }
//   .vue-slider-component .vue-slider-tooltip {
//     border: none !important;
//     font-size: 18px;
//   }
// }
</style>
