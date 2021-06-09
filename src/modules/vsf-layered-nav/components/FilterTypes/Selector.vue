<template>
  <div :class="{'filter-label work': true }">
    <span
      :class="{'active': isActive, 'filter-label': true}"
      @click="$emit('change', variant)"
      :aria-label="$t('Select ' + variant.label)"
    >
    <button v-if="code==='comfort_grade'" class='rounded-button' :class="setComfortColor(variant)">
      {{ variant.label }}   
    </button>
    <div v-else>
      {{ variant.label }} 
    </div>
    </span>

  </div>
</template>

<script>
import filterMixin from 'src/modules/vsf-layered-nav/mixins/filterMixin'
import Button from 'src/modules/vsf-paypal-method/components/Button.vue'

export default {
  components: { Button },
  props:{
    code: {
      type: String,
      required: false,
      default: ''
    },
    position: {
      type: Number,
      required: false,
      default: 0
    },
  },
  mixins: [filterMixin],
  mounted () {
    console.log("I have it here",this.position)
  },
  methods:{
    setComfortColor(variant) {
      if (
        variant.id === 203 ||
        variant.id === '203'
      ) {
        return 'color-soft';
      } else if (
        variant.id === 204 ||
        variant.id === '204'
      ) {
        return 'color-medium-soft';
      } else if (
        variant.id === 205 ||
        variant.id === '205'
      ) {
        return 'color-medium';
      } else if (
        variant.id === 206 ||
        variant.id === '206'
      ) {
        return 'color-medium-firm';
      } else if (
        variant.id === 207 ||
        variant.id === '207'
      ) {
        return 'color-orthopaedic';
      } else {
        return 'color-soft';
      }
    },
  }
}
</script>

<style lang="scss">
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $color-primary: color(primary);
  $color-tertiary: color(tertiary);
  $color-secondary: color(secondary);
  $color-white: color(white);
  $color-dim-gray: color(dim-gray);
  $color-persian-red: color(persian-red);
  $bg-secondary: color(secondary, $colors-background);
  $border-secondary: color(secondary, $colors-border);

.color-soft {
  background-color: #F5949A !important;
}
.color-medium-soft {
  background-color: #9CA3B4 !important;
}
.color-medium {
  background-color: #6A768F !important;
}
.color-medium-firm {
  background-color: #071A44 !important;
}
.color-orthopaedic {
  background-color: #333333 !important;
}
  .filter-label {
    line-height: 30px;
    font-size: 16px;
    opacity: 1;
    transition: opacity .2s;
    display: flex;
    &.no-products-left {
      opacity: .3;
      cursor: not-allowed;
      span.filter-label {
        cursor: not-allowed;
      }
    }
    span.filter-label {
      cursor: pointer;
      position: relative;
      &:before {
        content: '';
        position: relative;
        top: 6px;
        margin-right: 10px;
        display: inline-block;
        vertical-align: text-top;
        width: 14px;
        height: 14px;
        background: $color-white;
        border: 1px solid $border-secondary;
      }
      &:hover {
        &:before {
          background: $bg-secondary;
        }
      }
      &.active {
        &::before {
          background: #da2f89;
          border-color: #da2f89;
        }
        &:after {
          content: '';
          position: absolute;
          left: 3px;
          top: 13px;
          background: white;
          width: 2px;
          height: 2px;
          box-shadow:
            2px 0 0 white,
            4px 0 0 white,
            4px -2px 0 white,
            4px -4px 0 white,
            4px -6px 0 white,
            4px -8px 0 white;
          transform: rotate(45deg);
        }
      }

    }
    span.product-counter {
      //float: right;
      // color: #8d8d8d;
    }
  }
  button.rounded-button {
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
    background: #fa8a63;
}
@media screen and (max-width: 1244px){
 button.rounded-button{
padding: 6px 15px 6px 15px;
width: 86%;
}
}
@media screen and (max-width: 1199px){
 button.rounded-button{
  font-size: 14px;
  padding: 6px 8px 6px 8px;
    width: 125px;
}
}
@media (min-width: 768px) and (max-width: 991px) { 
    button.rounded-button{
    font-size: 13px;
    padding: 6px 6px 6px 6px;   
    width: 118px;
       }
}
@media screen and (max-width: 767px){
      button.rounded-button{
    font-size: 16px;
    padding: 6px 23px 6px 23px;
    width: 169px;
}
}
</style>
