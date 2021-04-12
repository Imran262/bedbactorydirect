<template>
  <div class="sort-by">
    <select
      name="sortby"
      class="cl-secondary"
      v-model="sortby"
      @change="changeOrder"
    >
      <option selected="selected" disabled value="" v-if="!hasLabel">
        {{ $t("Sort By") }}
      </option>
      <option
        v-for="variant in sortingVariants"
        :value="variant"
        :key="variant.id"
      >
        {{ $t(variant.label) }}
      </option>
    </select>
  </div>
</template>

<script>
import SortBy from "@vue-storefront/core/compatibility/components/SortBy";
import { products } from "config";
export default {
  mixins: [SortBy],
  props: {
    hasLabel: {
      type: Boolean,
      required: false,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      sortby: null,
    };
  },
  watch: {
    value: {
      handler() {
        const defaultVariant =
          this.value && this.value.length
            ? this.value
            : products.defaultSortBy.attribute;
        this.sortby = this.sortingVariants.find((variant) =>
          variant.id.includes(defaultVariant)
        );
      },
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~theme/css/base/text";
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$color-tertiary: color(tertiary);
.sort-by {
  display: inline-flex;
  position: relative;
  select {
    @extend .h4;
    font-size: 12px;
    width: 132px;
    color: #606063;
    font-family: "Arial";
    font-weight: bold;
    border-radius: 0;
    background-color: transparent;
    margin-right: 0;
    border-radius: 4px;
    border: 1px solid #7d7d7d;
    height: 33px;
    background: url(/assets/arrows.svg) no-repeat right;
    background-position-x: 92px;
    -webkit-appearance: none;
    line-height: 33px;
    padding-left: 5px;
    @media (max-width: 442px) and (min-width: 320px) {
       width: 79px;
       background-position-x: 59px;
       font-size: 2.667vw;
       height: 28px;
       line-height: 29px;
       margin-left: 5px;
    }
    @media (max-width: 382px) and (min-width: 375px) {
      margin-left: 0px !important;
    }
    @media (min-width: 768px) {
      color: #606063;
      font-weight: 400;
    }
    &:focus {
      outline: none;
    }
  }
  &__icon {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
}
@media (max-width: 770px) {
  .sort-by {
    width: 100%;
  }
}
</style>

<script>
import SortBy from "@vue-storefront/core/compatibility/components/SortBy";
import { products } from "config";
export default {
  mixins: [SortBy],
  props: {
    hasLabel: {
      type: Boolean,
      required: false,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      sortby: null,
    };
  },
  watch: {
    value: {
      handler() {
        const defaultVariant =
          this.value && this.value.length
            ? this.value
            : products.defaultSortBy.attribute;
        this.sortby = this.sortingVariants.find((variant) =>
          variant.id.includes(defaultVariant)
        );
      },
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~theme/css/base/text";
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$color-tertiary: color(tertiary);
.sort-by {
  display: inline-flex;
  position: relative;
  select {
    @extend .h4;
    font-size: 14px;
    width: 137px;
    color: #606063;
    font-family: "Arial";
    font-weight: bold;
    border-radius: 0;
    background-color: transparent;
    margin-right: 0;
    border-radius: 4px;
    border: 1px solid #7d7d7d;
    height: 33px;
    background: url(/assets/arrows.svg) no-repeat right;
    background-position-x: 115px;
    -webkit-appearance: none;
    line-height: 33px;
    padding-left: 5px;
    @media (max-width: 575px) and (min-width: 320px) {
       width: 113px;
       background-position-x: 81px;
       font-size: 9px;
       height: 28px;
       line-height: 24px;
       margin-left: 0px;
    }
    @media (max-width: 382px) and (min-width: 375px) {
      margin-left: 0px !important;
    }
    @media (min-width: 768px) {
      color: #606063;
      font-weight: 400;
    }
    &:focus {
      outline: none;
    }
  }
  &__icon {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
}
@media (max-width: 770px) {
  .sort-by {
    width: 100%;
  }
}
@media (min-width: 576px) and (max-width: 767px){
.sort-by select {
    width: 163px !important;
    background-position-x: 125px !important;
}
}

</style>
