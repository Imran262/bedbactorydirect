<template>
  <div class="base-input-number">
    <input
      :id="getInputId"
      type="tel"
      :min="min"
      :maxlength="maxLength"
      :disable="disable"
      class="m0 no-outline base-input-number__input brdr-cl-primary bg-cl-transparent h4"
      v-model="inputValue"
      @blur="$emit('blur', $event.target.value)"
      @keyup="$emit('keyup', $event.target.value)"
      @click="$emit('click')"
    >
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  components: {
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
    autofocus: {
      type: Boolean,
      default: false
    },
    disable: {
      type: Boolean,
      default: false
    },
    onlyPositive: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: 5
    }
  },
  computed: {
    getInputId () {
      // console.log('inputid', `input_${this._uid}`)
      return `input_${this._uid}`
    },
    inputValue: {
      get () {
        return this.value
      },
      set (value) {
        const targetValue = parseInt(value, 10)
        if (!isNaN(targetValue)) {
          this.$emit('input', targetValue !== 0 ? Math.abs(targetValue) : 0)
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
.grid-action-added input{
  border: 2px solid #2a275c;
  background: #fff;
  width: 50px;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  height: 30px;
  border-radius: 5px;
  font-size: 14px;
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
@media(max-width:767px){
  .grid-action-added input {
    width: 45px;
    height: 35px;
    border-radius: 6px;
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
  .grid-action-added input {
    width: 35px;
    font-size: 12px;
  }
}
</style>
