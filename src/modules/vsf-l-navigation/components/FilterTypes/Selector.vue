<template>
  <div :class="{ 'filter-label': true }">
    <span
      :class="{ active: isActive, 'filter-label': true }"
      @click="$emit('change', variant)"
      :aria-label="$t('Select ' + variant.label)"
    >
      <button v-if="comfort" class="rounded-button" :class="getBackGroundColor(variant)">
        <span>{{ variant.label }}</span>
      </button>
      <span v-else>{{ variant.label }}</span>
      
    </span>
  </div>
</template>

<script>
import filterMixin from 'src/modules/vsf-l-navigation/mixins/filterMixin';
import Button from '../../../vsf-payment-paypal/components/Button.vue';

export default {
  components: { Button },
  mixins: [filterMixin],
  methods: {
    getBackGroundColor(option) {
      // let classList=document.getElementById('comfortBtn').classList;

      // console.log("hello Before ",classList);
      //   classList=document.getElementById('comfortBtn').classList.add("color-red");
      // console.log("hello Afer",classList);
      // document.getElementById('comfortBtn').style.backgroundColor = 'red';

      console.log('Current option is ', option);
      if (option.id === 203 || option.id === '203') {
        return 'color-soft';
      } else if (option.id === 204 || option.id === '204') {
        return 'color-medium-soft';
      } else if (option.id === 205 || option.id === '205') {
        return 'color-medium';
      } else if (option.id === 206 || option.id === '206') {
        return 'color-medium-firm';
      } else if (option.id === 207 || option.id === '207') {
        return 'color-orthopaedic';
      } else {
        return 'color-soft';
      }
    }
  },
  props:{
    comfort:{
      type:Boolean
    }
  }
};
</script>

 <style >
/* // .color-soft {
//   background-color: #f6a076 !important;
// }
// .color-medium-soft {
//   background-color: #fa8a63 !important;
// }
// .color-medium {
//   background-color: #cb6885 !important;
// }
// .color-medium-firm {
//   background-color: #965177 !important;
// }
// .color-orthopaedic {
//   background-color: #5b364c !important;
// } */
</style>
<style lang="scss">
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$color-primary: color(primary);
$color-tertiary: color(tertiary);
$color-secondary: color(secondary);
$color-white: color(white);
$color-dim-gray: color(dim-gray);
$color-persian-red: color(persian-red);
$bg-secondary: color(secondary, $colors-background);
$border-secondary: color(secondary, $colors-border);
.rounded-button {
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 3px 0px;
  cursor: pointer;
  border-radius: 25px;
  padding: 6px 23px 6px 23px;
  font-weight: bold;
  width: 169px;
}



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
.filter-label {
  line-height: 30px;
  font-size: 16px;
  opacity: 1;
  transition: opacity 0.2s;
  &.no-products-left {
    opacity: 0.3;
    cursor: not-allowed;
    span.filter-label {
      cursor: not-allowed;
    }
  }
  span.filter-label {
    cursor: pointer;
    position: relative;
    &:before {
      content: "";
      position: relative;
      top: 1px;
      margin-right: 10px;
      display: inline-block;
      vertical-align: text-top;
      width: 14px;
      height: 14px;
      background: $color-white;
      border: 1px solid #e0e0e0;
    }
    &:hover {
      &:before {
        background: $bg-secondary;
      }
    }
    &.active {
      &::before {
        background: $color-primary;
        border-color: $color-primary;
      }
      &:after {
        content: "";
        position: absolute;
        left: 3px;
        top: 8px;
        background: white;
        width: 2px;
        height: 2px;
        box-shadow: 2px 0 0 white, 4px 0 0 white, 4px -2px 0 white,
          4px -4px 0 white, 4px -6px 0 white, 4px -8px 0 white;
        transform: rotate(45deg);
      }
    }
  }
  span.product-counter {
    float: right;
    opacity: 0.2;
  }
}
</style>
