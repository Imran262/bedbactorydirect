<template>
  <div class="base-input-number">
    <!-- <label class="base-input-number__label cl-primary flex" :for="getInputId">{{ name }}</label> -->
    <input
      :id="getInputId"
      type="tel"
      :min="min"
      :max="max"
      :disabled="disabled"
      :maxlength="maxLength"
      class="m0 no-outline base-input-number__input brdr-cl-primary bg-cl-transparent h4"
      :focus="autofocus"
      v-model="inputValue"
       @blur="$emit('blur', $event.target.value)"
      @keyup="$emit('keyup', $event.target.value)"
      @click="$emit('click')"
    >
    <!-- <span class="sqm-txt">Tiles </span> -->
    <label class="sqm-txt txt-sqm" v-if="forbaseinput === 'sqm'"> m<sup>2</sup></label>
    <label class="sqm-txt-tiles" v-else-if="forbaseinput === 'Tiles'">{{ forbaseinput }}</label>
    <label class="sqm-txt" v-else-if="forbaseinput === 'Boxes'">Packs</label>
    <label class="sqm-txt" v-else>{{ forbaseinput }}</label>
    <ValidationMessages v-if="validations" :validations="validations" />
  </div>
</template>

<script>
import ValidationMessages from './ValidationMessages.vue'
export default {
  name: 'BaseInput',
  components: {
    ValidationMessages
  },
  props: {
    value: {
      type: [String, Number],
      default: 0
    },
    name: {
      type: String,
      required: false,
      default: ''
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    validations: {
      type: Array,
      default: () => []
    },
    onlyPositive: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: 5
    },
    forbaseinput: {
      type: String,
      required: true
    }
  },
  computed: {
    getInputId () {
      return `input_${this._uid}`
    },
    inputValue: {
      get () {
        return this.value
      },
      set (value) {
        if (!this.onlyPositive) {
          this.$emit('input', value)
        } else {
          const targetValue = parseInt(value, 10)
          if (!isNaN(targetValue)) {
            this.$emit('input', targetValue !== 0 ? Math.abs(targetValue) : 1)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';

.base-input-number {
  &__input {
    border-style: solid;
    border-width: 0 0 1px 0;
    width: 50px;
    height: 1.4rem;
    line-height: 1.7rem;
    @media (min-width: 768px) {
      height: 1.7rem;
    }
  }

  &__label {
    font-size: 0.8rem;
    line-height: 1.2rem;
    @media (min-width: 768px) {
      font-size: 1rem;
      line-height: 1.4rem;
    }
  }
}
.adhesive-qty.product-quantity{
  .sqm-txt {
    margin-left: 10px;
    font-family: oblik;
    text-transform: uppercase;
    color: #4a4a4a;
    font-size: 16px;
    float: left;
    margin-right: 10px;
    margin-top: 20px;
  }
  .sqm-txt-tiles {
    margin-left: 10px;
    font-family: oblik;
    text-transform: uppercase;
    color: #4a4a4a;
    font-size: 16px;
    float: left;
    margin-right: 10px;
    margin-top: 20px;
  }
}
.product-quantity{
  input{
    border: 3px solid #2a275c;
    background: #fff;
    width: 60px;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    height: 38px;
    border-radius: 10px;
  }
  .sqm-txt{
        margin-left: 3px;
        font-family: Arial, Helvetica, sans-serif;
        color: #4a4a4a;
        font-size: 16px;
        font-weight: 700;
    }
     .sqm-txt-tiles{
        margin-left: 3px;
        font-family: Arial, Helvetica, sans-serif;
        color: #4a4a4a;
        font-size: 16px;
        font-weight: 700;
    }
  .txt-sqm {
    text-transform: none !important;
  }
}
@media(max-width: 360px){
  .product-quantity{
    input{
      width: 45px !important;
    }
  }
}
@media(max-width: 767px){
  .product-quantity{
    input{
      height: 50px;
    }
    .sqm-txt{
      text-transform: capitalize;
      // float: left;
      margin-top: 25px;
      margin-right: 15px;
    }
    .sqm-txt-tiles{
    // margin-right: 11px;
    }
  }
  .adhesive-qty.product-quantity{
  .sqm-txt {
    margin-top: 30px;
  }
}
}
@media(min-width: 767px) and (max-width: 991px){
  .product-quantity input {
    width: 45px;
  }
}
@media(min-width: 991px) and (max-width: 1200px){
  .product-quantity input {
    width: 45px;
    font-size: 12px;
  }
  .product-quantity .sqm-txt {
    font-size: 12px;
    margin-left: 0px;
  }
}
</style>
