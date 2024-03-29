<template>
  <div class="select-wrapper relative">
    <select
      :name="name"
      :class="{
        'cl-tertiary' : options.length === 0,
        'empty': !selected
      }"
      :autocomplete="autocomplete"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @change="$emit('change', $event.target.value)"
      @input="$emit('input', $event.target.value)"
    >
      <option disabled selected value v-if="!selected" />
      <option
        v-for="(option, key) in options"
        :key="key"
        :value="option.value"
        v-bind="{selected: option.value === selected}"
      >{{ option.label }}</option>
    </select>
    <label>{{ placeholder }}</label>

    <ValidationMessages v-if="validations" :validations="validations" />
  </div>
</template>

<script>
import ValidationMessages from "./ValidationMessages.vue";

export default {
  name: "BaseSelect",
  components: {
    ValidationMessages,
  },
  props: {
    id: {
      type: String,
      required: false,
      default: "",
    },
    name: {
      type: String,
      required: false,
      default: "",
    },
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
    selected: {
      type: String,
      required: false,
      default: "",
    },
    placeholder: {
      type: String,
      required: false,
      default: "",
    },
    autocomplete: {
      type: String,
      required: false,
      default: "",
    },
    validations: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
@import "~theme/css/base/text";
$color-tertiary: color(tertiary);
$color-black: color(black);
$color-puerto-rico: color(puerto-rico);
$color-hover: color(tertiary, $colors-background);

.select-wrapper {
  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 1rem;
    right: 10px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 8px 6px 0 6px;
    border-color: $color-tertiary transparent transparent transparent;
    pointer-events: none;
  }

  select {
    @extend .h4;
    border: none;
    border-bottom: 1px solid $color-tertiary;
    width: 100%;
    -moz-appearance: none;
    -webkit-appearance: none;
    border-radius: 0;
    background-color: transparent;

    &:hover,
    &:focus {
      outline: none;
    }

    &:disabled,
    &:disabled + label {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
  label {
    color: #999;
    position: absolute;
    pointer-events: none;
    user-select: none;
    top: 10px;
    left: 8px;
    transition: 0.2s ease all;
    -moz-transition: 0.2s ease all;
    -webkit-transition: 0.2s ease all;
  }
  select:focus ~ label,
  select:not(.empty) ~ label {
    top: -10px;
    font-size: 14px;
    color: $color-puerto-rico;
  }
}
.cart-main {
  input {
    -webkit-appearance: none;
  }
}
.billing-details{
  .country-req-label{
    margin-top: 25px;
    &::after {
      content: none !important;
    }
  }
  select{
    border: 1px solid #bdbdbd;
    border-radius: 3px;
    padding: 0px 10px;
    color: #9b9b9b;
    font-size: 14px;
    background: url('/assets/arrows-01.svg') no-repeat right;
    background-position: 95% 46%;
    -webkit-appearance: none;
    height: 48px;
  }
  select::after {
      content: none !important;
  }
  select:focus ~ label,
  select:not(.empty) ~ label {
    top: -33px;
    font-size: 14px;
    color: #3A3E3D;
  }
  label {
    top: -33px;
    color: #3A3E3D;
    font-weight: 600;
  }
  .req-label label:after {
    content: '*';
    color: #ef0b0b;
    position: absolute;
    right: -10px;
    bottom: 3px;
    }
}

.instruction {
  select {
    border: 1px solid #bdbdbd;
    border-radius: 3px;
    padding: 0px 10px;
    color: #9b9b9b;
    font-size: 14px;
    background: url('/assets/arrows-01.svg') no-repeat right;
    background-position: 95% 46%;
    -webkit-appearance: none;
    height: 48px;
  }
}
</style>
