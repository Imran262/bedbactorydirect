<template>
  <div class="product-filter" :class="filterIndex === 'price' && (filter[1] - filter[0] == 1 || filter[1] - filter[0] == 0) ? 'hidePriceFilterDiv': ''">
    <h4
      :class="[
        'filter-heading ',
        ['price', 'product_type', 'filter_type.keyword'].includes(filterIndex)
          ? 'toggle-icon'
          : '',
        changeFilterName === 'Type' ? 'tgle' : '',
        filterIndex === 'price' ? 'tgle1' : ''
      ]"
      :data-attr-index="$t(filterIndex)"
      @click="FiltershowList"
    >
    <!-- {{changeFilterName}} -->
      <span class="col-md-6 pl0">{{ $t(changeFilterName) }} </span>
      <span
        v-if="changeFilterName == 'Type'"
        class="weight-400 sidebar__header__clear pointer sans-serif col-md-6 clear"
        @click="resetAllFilters"
        v-show="hasActiveFilters"
      >
        <!-- <i class="material-icons cl-accent mr5">cancel</i> -->
        {{ $t("Clear all") }}
      </span>
    </h4>

    <div
      class="filter-option filter-main-container filter-options column_wrapper"
      :data-attr-contaent="filterIndex"
      v-if="filterIndex === 'filter_colour.keyword'"
    >
      <selector
        context="category"
        code="filter_colour.keyword"
        v-for="(color, index) in filter"
        :key="index"
        :variant="color"
        :show-count="false"
        :selected-filters="selectedFilters"
        @change="$emit('changeFilter', $event)"
      />
    </div>
    <div
      class="filter-main-container is-open price-open"
      style="width: 90%; margin-left: 5%;"
      :id="filterIndex"
      :data-attr-contaent="filterIndex"
      v-else-if="filterIndex === 'price'"
    >
      <price-slider
        context="category"
        code="price"
        id="price"
        :price-range="filter"
        content="Price "
        label="Price Label"
        :selected-filters="selectedFilters"
        @change="$emit('changeFilter', $event)"
      />
    </div>
    <div
      v-else-if="['filter_type.keyword', 'product_type'].includes(filterIndex)"
      class="filter-option filter-main-container is-open"
      :data-attr-contaent="filterIndex"
      :class="{
        'filter-options': showFilterExpander(),
        'filter-expanded': filterExpand,
        'filter-expanded-new': filterNewExpand,
      }"
      :style="{ 'max-height': setMaxHeight }"
    >
      <product-type
        context="category"
        :code="filterIndex"
        v-for="(option, index) in filter"
        :key="index"
        :variant="option"
        :selected-filters="selectedFilters"
        :prod-type-filter-main-val="prodTypeFilterBothVal"
        @change="$emit('changeFilter', $event)"
      />
      <div class="filter-expander" v-show="showFilterExpander()">
        <span class="filter-expand" @click="filterExpander()">
          <div class="plus-minus">
            <div class="horizontal" />
            <div class="vertical" />
          </div>
          <span class="label">
            {{ filterExpanderMessage }}
          </span>
        </span>
      </div>
    </div>
    <div
      v-else
      class="filter-option filter-main-container"
      :data-attr-contaent="filterIndex"
      :class="{
        'filter-options': showFilterExpander(),
        'filter-expanded': filterExpand,
        'filter-expanded-new': filterNewExpand,
      }"
      :style="{ 'max-height': setMaxHeight }"
    >
      <selector
        context="category"
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
          <span class="label">
            {{ filterExpanderMessage }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import rootStore from "@vue-storefront/core/store";
import ColorSelector from "./FilterTypes/ColorSelector";
import Selector from "./FilterTypes/Selector";
import PriceSlider from "./FilterTypes/PriceSlider";
import ProductType from "./FilterTypes/ProductType";
import i18n from "@vue-storefront/i18n";
import pickBy from "lodash-es/pickBy";

export default {
  name: "ProductFilter",
  props: {
    filterIndex: {
      type: String,
      required: true,
    },
    filter: {
      type: Array,
      required: true,
    },
    selectedFilters: {
      type: Object,
      default: () => ({}),
    },
    limit: {
      type: Number,
      required: false,
      default: 10,
    },
    prodTypeFilterBothVal: {
      type: [Number, String],
      required: false,
    },
  },
  data() {
    return {
      filterExpand: false,
      filterNewExpand: false,
    };
  },
  components: {
    ColorSelector,
    Selector,
    PriceSlider,
    ProductType,
  },
  computed: {
    ...mapGetters("category", [
      "getCurrentCategory",
      "getActiveCategoryFilters",
      "getCurrentCategoryProductQuery",
      "getAvailableCategoryFilters",
    ]),
    hasActiveFilters() {
      return this.$store.getters["category-next/hasActiveFilters"];
    },
    changeFilterName() {
      if (this.filterIndex === "filter_size.keyword") {
        return (this.filterIndexName = "Size");
      } else if (
        this.filterIndex &&
        this.filterIndex.toLowerCase() === "color"
      ) {
        return (this.filterIndexName = "Colour");
      } else if (this.filterIndex === "filter_material.keyword") {
        return (this.filterIndexName = "Material");
      } else if (this.filterIndex === "filter_thickness.keyword") {
        return (this.filterIndexName = "Thickness");
      } else if (this.filterIndex === "filter_colour.keyword") {
        return (this.filterIndexName = "Colour");
      } else if (this.filterIndex === "filter_type.keyword") {
        return (this.filterIndexName = "Type");
      } else {
        return (this.filterIndexName = this.filterIndex.replace(/_/g, " "));
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
        ? i18n.t("Show less filter options")
        : i18n.t("Show more filter options");
    },
    setMaxHeight() {
      return !this.filterExpand
        ? this.filterOptionElHeight * this.limit + "px"
        : this.filterOptionElHeight * this.availableFilterOptions + "px";
    },
  },
  methods: {
    showFilterExpander() {
      return this.availableFilterOptions > this.limit;
    },
    resetAllFilters() {
      this.$store.dispatch("category-next/resetSearchFilters");
    },
    filterExpander() {
      this.filterExpand = !this.filterExpand;
      let thisEvent = event;
      if (this.filterExpand) {
        this.filterNewExpand = false;
        this.filterNewExpand = true;
        setTimeout(() => {
          thisEvent.toElement.parentNode.parentNode.parentNode.classList.add(
            "is-open"
          );
          if (
            !thisEvent.toElement.parentNode.parentNode.parentNode.parentNode.firstElementChild.classList.contains(
              "toggle-icon"
            )
          ) {
            thisEvent.toElement.parentNode.parentNode.parentNode.parentNode.firstElementChild.classList.add(
              "toggle-icon"
            );
          }
        }, 1000);
      } else {
        this.filterNewExpand = true;
      }
    },
    FiltershowList(e) {
      if(this.changeFilterName == 'Type' || this.filterIndex === 'price'){ }
      else{
      e.currentTarget.classList.toggle("toggle-icon");
      const data_index = e.currentTarget.getAttribute("data-attr-index");
      var x_container, i_container;
      x_container = document.querySelectorAll(".filter-main-container");
      for (i_container = 0; i_container < x_container.length; i_container++) {
        const data_index_main = x_container[i_container].getAttribute(
          "data-attr-contaent"
        );
        if (data_index == data_index_main) {
          x_container[i_container].classList.toggle("is-open");
          if (
            x_container[i_container].classList.contains("filter-expanded-new")
          ) {
            x_container[i_container].classList.remove("filter-expanded-new");
            x_container[i_container].classList.remove("is-open");
          }
        }
      }
    }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$primary-color: color(primary, $colors-theme);
$puerto-rico-color: color(puerto-rico);
$white-color: color(white);
$white-smoke-color: color(white-smoke);

h4 {
  margin-bottom: 10px;
  text-transform: capitalize;
  cursor: pointer;
}

.filter-options {
  max-height: 300px;
  transition: max-height 0.3s ease-in;
  overflow: hidden;
  padding-bottom: 30px;
  position: relative;
  .filter-expander {
    height: 33px;
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

.mobile-filters .filter-expander {
  background-color: #f2f2f2;
  @media screen and (max-width: 767px){
    background-color: #ffff;
    
  }
}

.filter-option.filter-main-container.filter-options.filter-expanded.is-open {
  display: block !important;
}

.filter-option.filter-main-container {
  display: none !important;
  padding-bottom: 7px;
}
@media screen and (min-width: 320px) and (max-width: 767px){
  .product-filter {
  h4 {
    background: url("/assets/category-images/add.png") no-repeat 100% 16%;
    height: 25px;
   
    &.toggle-icon {
      background: url("/assets/category-images/minus.png") no-repeat 100% 16%;
    }
  }
  }
}
.product-filter {
  user-select: none;
  @media (max-width: 767px) {
    width: 88%;
    padding-left: 39px;
  }
  h4 {
    font-size: 14px;
    color: #2A285A;
    font-weight: bold;
    font-family: "Arial";
    text-transform: capitalize !important;
    @media screen and (min-width: 768px) {
    background: url("/assets/category-images/add.png") no-repeat 96% 16%;
    }
    height: 25px;
    @media (max-width: 480px) {
      width: 90%;
    }
    @media screen and (min-width: 768px) {
    &.toggle-icon {
      background: url("/assets/category-images/minus.png") no-repeat 96% 16%;
    }
    }
  }
  div.filter-main-container.is-open {
    display: block !important;
  }
  div#filter-main-container {
    display: none !important;
  }
  .filter-option.filter-main-container.filter-options.filter-expanded {
    display: none !important;
  }
  .filter-option.filter-main-container.filter-options.filter-expanded.is-open {
    display: block !important;
  }
  .filter-option.filter-main-container.filter-options.filter-expanded-new {
    display: block !important;
  }
  .filter-main-container.is-open.price-open {
    display: block;
  }
  .filter-main-container.price-open {
    display: none;
  }
}
.column_wrapper {
  max-height: 200px;
  display: flex;
  flex-flow: column wrap;
  column-count: 2;
}
.tgle {
  background: none !important;
      width: 100%;
      display: inline-flex;
      margin-bottom: 0px;
}
.tgle1 {
  background: none !important;
      width: 100%;
      display: inline-flex;
      margin-bottom: 10px;
}
.clear{
  text-align: right;
      text-decoration: underline;
      color: #BEBEBE;
      font-size: 13px;
}
@media screen and (max-width: 767px){
  .clear{
    display: none;
  }
}
.isopen{
  display: block !important;
}
.product-filter.hidePriceFilterDiv {
  display: none;
}
</style>
