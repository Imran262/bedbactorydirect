<template>
  <div class="columns">
    <select name="column" class="cl-secondary" v-model="filterOptions.column" @change="changeColumn">
      <option v-for="(option) in filterOptions.productColumns" :value="option" :key="option">{{ option }}</option>
    </select>
  </div>
</template>

<script>
import config from 'config';

export default {
  data () {
    return {
      filterOptions: (config && config.filterShowItems) ? {
        productColumns: config.filterShowItems.availableOptions,
        column: config.filterShowItems.selectedOption
      } : {
        productColumns: [12, 24, 36],
        column: 12
      }
    };
  },
  methods: {
    changeColumn () {
      this.$emit('change-column', this.filterOptions.column);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~theme/css/base/text";
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";

$color-tertiary: color(tertiary);
.columns {
  display: inline-flex;
  position: relative;
  @media (max-width: 1023px) and (min-width: 768px) {
    width: 25%;
  }
  @media (max-width: 767px) {
    display: none;
  }

  select {
    @extend .h4;
    font-size: 14px;
    width: 100%;
    margin-right: 0;
    border-radius: 4px;
    border: 1px solid #7D7D7D;
    height: 33px;
    background: transparent url(/assets/arrows.svg) no-repeat right;
    background-position-x: 46px;
    -webkit-appearance: none;
    line-height: 33px;
    padding-right: 35px;
    padding-left: 22px;
    @media screen and (min-width: 768px) and (max-width: 1024px) {
      padding-right: 27px;
      padding-left: 22px;
    }
    @media (min-width: 767px) {
      color: #606063;
      // margin-top: 3px;
    }

    &:focus {
      outline: none;
    }

    @media screen and (min-width: 768px) and (max-width: 1023px) {
      background-position-x: 22px;
      padding-right: 0px;
      padding-left: 5px;
    }
    @media screen and (min-width: 1025px) and (max-width: 1279px) {
      background-position-x: 23px;
      -webkit-appearance: none;
      line-height: 33px;
      padding-right: 18px;
      padding-left: 7px;
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

// @media (max-width: 770px) {
//   .columns {
//     width: 100%;
//   }
// }
</style>
