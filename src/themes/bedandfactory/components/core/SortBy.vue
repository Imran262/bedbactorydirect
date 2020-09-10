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
  border: 1px solid #eaeaea;
  background-color: #f5f7fa;
  border-radius: 5px;
  height: 35px;
  margin-right: 1rem;
  select {
    @extend .h4;
    font-size: 0.9325rem;
    color: #54575b;
    font-family: "Poppins", sans-serif;
    border: none;
    width: 100%;
    border-radius: 0;
    background-color: transparent;
    margin-right: 0;
    -webkit-appearance: none;
    background: url("/assets/category-images/filter-down-arrow.png") no-repeat
      100% 75%;
    padding-left: 0.55rem;
    height: 100%;
    line-height: 2;
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
    select {
      background: url("/assets/category-images/category-filer-mobile-icon.png")
        no-repeat 95% 55%;
    }
  }
}
@media (max-width: 767px) {
  .sort-by {
    width: 95%;
    select {
      background: url("/assets/category-images/category-filer-mobile-icon.png")
        no-repeat 95% 55%;
      font-size: 0.8rem;
    }
  }
}
</style>
