<template>
  <div class="product-filter">
    <h4
      :class="['filter-heading ', (filterIndex !== 'price' && filterIndex !== 'colour' && filterIndex !== 'orientation' && filterIndex !== 'custom_width' && filterIndex !== 'custom_height' && filterIndex !== 'style' && filterIndex !== 'range' && filterIndex !== 'btu_at_delta_t65') ? 'toggle-icon' : '']"
      :data-attr-index="$t(filterIndex)"
      @click="FiltershowList"
    >
    {{ $t(changeFilterName) }}</h4>
    <div
      class="filter-main-container is-close"
      :data-attr-contaent="filterIndex"
      v-if="filterIndex === 'color'"
    >
      <color-selector
        context="category"
        code="color"
        v-for="(color, index) in filter"
        :key="index"
        :variant="color"
        :selected-filters="selectedFilters"
        @change="$emit('changeFilter', $event)"
      />
    </div>
    <div
      class="filter-main-container"
      :id="filterIndex"
      :data-attr-contaent="filterIndex"
      v-else-if="filterIndex === 'price'"
    >
      <price-slider
        context="category"
        code="price"
        id="price"
        ref="priceRef"
        :price-range="filter"
        content="Price "
        label="Price Label"
        :selected-filters="selectedFilters"
        @change="$emit('changeFilter', $event)"
      />
    </div>
    <div
      v-else-if="filterIndex === 'comfort_grade'"
      class="filter-option filter-main-container"
      :data-attr-contaent="filterIndex"
      :class="[{
                 'filter-options': showFilterExpander(),
                 'filter-expanded': filterExpand
               },
               (filterIndex !== 'colour' && filterIndex !== 'orientation' && filterIndex !== 'custom_width' && filterIndex !== 'custom_height' && filterIndex !== 'style' && filterIndex !== 'range' && filterIndex !== 'btu_at_delta_t65' ) ? 'is-close' : ''
      ]"
      :style="{ 'max-height': setMaxHeight }"
    >
      <selector
        context="category"
        :comfort="true"
        :code="filterIndex"
        v-for="(option, index) in filter"
        :key="index"
        :variant="option"
        :selected-filters="selectedFilters"
        @change="$emit('changeFilter', $event)"
      />
      <div class="filter-expander" v-show="showFilterExpander()">
        <span class="filter-expand" @click="filterExpander()">
          <div class="plus-minus">
            <div class="horizontal" />
            <div class="vertical" />
          </div>
          <span class="label">{{ filterExpanderMessage }}</span>
        </span>
      </div>
    </div>
    <div
      v-else
      class="filter-option filter-main-container pading-filter"
      :data-attr-contaent="filterIndex"
      :class="[{
                 'filter-options': showFilterExpander(),
                 'filter-expanded': filterExpand
               },
               (filterIndex !== 'colour' && filterIndex !== 'orientation' && filterIndex !== 'custom_width' && filterIndex !== 'custom_height' && filterIndex !== 'style' && filterIndex !== 'range' && filterIndex !== 'btu_at_delta_t65' ) ? 'is-close' : ''
      ]"
      :style="{ 'max-height': setMaxHeight }"
    >
      <selector
        context="category"
        :comfort="false"
        :code="filterIndex"
        v-for="(option, index) in filter"
        :key="index"
        :variant="option"
        :selected-filters="selectedFilters"
        @change="$emit('changeFilter', $event)"
      />
      <div class="filter-expander" v-show="showFilterExpander()">
        <span class="filter-expand" @click="filterExpander()">
          <div class="plus-minus">
            <div class="horizontal" />
            <div class="vertical" />
          </div>
          <span class="label">{{ filterExpanderMessage }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import rootStore from '@vue-storefront/core/store';
import ColorSelector from './FilterTypes/ColorSelector';
import Selector from './FilterTypes/Selector';
import PriceSlider from './FilterTypes/PriceSlider';
import i18n from '@vue-storefront/i18n';
import pickBy from 'lodash-es/pickBy';

export default {
  name: 'ProductFilter',
  props: {
    filterIndex: {
      type: String,
      required: true
    },
    filter: {
      type: Array,
      required: true
    },
    selectedFilters: {
      type: Object,
      default: () => ({})
    },
    limit: {
      type: Number,
      required: false,
      default: 10
    }
  },
  data() {
    return {
      filterExpand: false,
      filterIndexName: ''
    };
  },
  components: {
    ColorSelector,
    Selector,
    PriceSlider
  },
  computed: {
    ...mapGetters('category', [
      'getCurrentCategory',
      'getActiveCategoryFilters',
      'getCurrentCategoryProductQuery',
      'getAvailableCategoryFilters'
    ]),
    changeFilterName() {
      if (this.filterIndex == 'filter_size') {
        return (this.filterIndexName = 'Size');
      }else if (this.filterIndex == 'btu_at_delta_t65') {
        return (this.filterIndexName = 'BTU');
      } else if (this.filterIndex == 'custom_width') {
        return (this.filterIndexName = 'Width');
      } else if (this.filterIndex == 'custom_height') {
        return (this.filterIndexName = 'Height');
      } else {
        return (this.filterIndexName = this.filterIndex.replace(/_/g, ' '));
      }
    },
    availableFilterOptions() {
      return this.filter.length;
    },
    filterOptionElHeight() {
      return this.$store.state.config.layeredNavigation.filterOptionElHeight;
    },
    remainingFilterOptions() {
      return this.availableFilterOptions - this.limit;
    },
    filterExpanderMessage() {
      return this.filterExpand
        ? i18n.t('Show less filter options')
        : i18n.t('Show more filter options ({remainingFilterOptions})', {
            remainingFilterOptions: this.remainingFilterOptions
          });
    },
    setMaxHeight() {
      return !this.filterExpand
        ? this.filterOptionElHeight * this.limit + 'px'
        : this.filterOptionElHeight * this.availableFilterOptions + 'px';
    }
  },
  methods: {
    getBackGroundColor(option) {
      // let classList=document.getElementById('comfortBtn').classList;

      // console.log("hello Before ",classList);
      //   classList=document.getElementById('comfortBtn').classList.add("color-red");
      // console.log("hello Afer",classList);
      // document.getElementById('comfortBtn').style.backgroundColor = 'red';

      console.log("Current option is ",option);
      if (
        option.id === 203 ||
        option.id === '203'
      ) {
        return 'color-soft';
      } else if (
        option.id === 204 ||
        option.id === '204'
      ) {
        return 'color-medium-soft';
      } else if (
        option.id === 205 ||
        option.id === '205'
      ) {
        return 'color-medium';
      } else if (
        option.id === 206 ||
        option.id === '206'
      ) {
        return 'color-medium-firm';
      } else if (
        option.id === 207 ||
        option.id === '207'
      ) {
        return 'color-orthopaedic';
      } else {
        return 'color-soft';
      }
    },
    showFilterExpander() {
      return this.availableFilterOptions > this.limit;
    },
    filterExpander() {
      this.filterExpand = !this.filterExpand;
    },
    FiltershowList(e) {
      e.currentTarget.classList.toggle('toggle-icon');
      const data_index = e.currentTarget.getAttribute('data-attr-index');
      console.log('Eeee', data_index);
      var x_container, i_container;
      x_container = document.querySelectorAll('.filter-main-container');
      for (i_container = 0; i_container < x_container.length; i_container++) {
        const data_index_main = x_container[i_container].getAttribute(
          'data-attr-contaent'
        );
        if (data_index == data_index_main) {
          console.log('Iff ');
          x_container[i_container].classList.toggle('is-close');
        }
      }
    }
  }
};
</script>

<style >
.color-soft {
  background-color: #f6a076 !important;
}
.color-medium-soft {
  background-color: #fa8a63 !important;
}
.color-medium {
  background-color: #cb6885 !important;
}
.color-medium-firm {
  background-color: #965177 !important;
}
.color-orthopaedic {
  background-color: #5b364c !important;
}
</style>
<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$primary-color: color(primary, $colors-theme);
$puerto-rico-color: color(puerto-rico);
$white-color: color(white);
$white-smoke-color: color(white-smoke);

h4 {
  margin-bottom: 10px;
}
.pading-filter{
  padding: 10px;
}
.filter-options {
  max-height: 300px;
  transition: max-height 0.3s ease-in;
  overflow: hidden;
  padding-bottom: 30px;
  position: relative;
  .filter-expander {
    height: 30px;
    width: 100%;
    position: absolute;
    bottom: 0;
    background-color: #fff;
    span {
      line-height: 30px;
      cursor: pointer;
      &.label {
        padding-left: 5px;
        text-decoration: underline;
        font-weight: 700;
        font-size: 14px;
        color: $puerto-rico-color;
      }
    }
  }
  &.filter-expanded {
    max-height: 10000px;
  }
}

.plus-minus {
  position: relative;
  display: inline-block;
  width: 10px;
  height: 10px;
  top: 0;
  .vertical {
    transition: all 0.2s ease-in-out;
    transform: rotate(-90deg);
  }
  .horizontal {
    transition: all 0.2s ease-in-out;
    transform: rotate(-90deg);
    opacity: 1;
  }
}
.plus-minus .horizontal {
  position: absolute;
  background-color: $puerto-rico-color;
  width: 10px;
  height: 2px;
  left: 50%;
  margin-left: -5px;
  top: 50%;
  margin-top: -1px;
}
.plus-minus .vertical {
  position: absolute;
  background-color: $puerto-rico-color;
  width: 2px;
  height: 10px;
  left: 50%;
  margin-left: -1px;
  top: 50%;
  margin-top: -5px;
}
.filter-expanded {
  opacity: 1;
  .vertical {
    transition: all 0.2s ease-in-out;
    transform: rotate(90deg);
  }
  .horizontal {
    transition: all 0.2s ease-in-out;
    transform: rotate(90deg);
    opacity: 0;
  }
}

.product-filter {
  user-select: none;
  h4 {
    font-size: 1rem;
    color: #54575b;
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
    text-transform: capitalize;
    background: url('/assets/category-images/filter-down-arrow.png') no-repeat
      100% 100%;
    height: 25px;
    &.toggle-icon {
      background: url('/assets/category-images/filter-up-arrow.png') no-repeat
        100% 100%;
    }
  }
  div.filter-main-container.is-close {
    display: none;
  }
  div#filter-main-container {
    display: block;
  }
}
</style>
