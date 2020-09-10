<template>
  <div class="base-input-number">
    <label class="base-input-number__label cl-primary flex" :for="getInputId">{{
      name
    }}</label>
    <input
      :id="getInputId"
      type="number"
      :min="min"
      :max="max"
      :disabled="disabled"
      class="m0 no-outline base-input-number__input brdr-cl-primary bg-cl-transparent h4"
      :focus="autofocus"
      v-model="inputValue"
      @blur="$emit('blur', $event.target.value)"
    />
    <ValidationMessages v-if="validations" :validations="validations" />
  </div>
</template>

<script>
import ValidationMessages from "./ValidationMessages.vue";
export default {
  name: "BaseInput",
  components: {
    ValidationMessages,
  },
  props: {
    value: {
      type: [String, Number],
      default: 0,
    },
    name: {
      type: String,
      required: false,
      default: "",
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    validations: {
      type: Array,
      default: () => [],
    },
    onlyPositive: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    getInputId() {
      return `input_${this._uid}`;
    },
    inputValue: {
      get() {
        return this.value;
      },
      set(value) {
        if (!this.onlyPositive) {
          this.$emit("input", value);
        } else {
          const targetValue = parseInt(value, 10);
          if (!isNaN(targetValue)) {
            this.$emit("input", targetValue !== 0 ? Math.abs(targetValue) : 1);
          }
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";

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
/**Custom Css */
.bt-product-qty label.base-input-number__label {
  display: none;
}

.bt-product-qty .base-input-number__input[type="number"] {
  -moz-appearance: textfield;
}
.bt-product-qty .base-input-number__input::-webkit-outer-spin-button,
.bt-product-qty .base-input-number__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.bt-product-qty .base-input-number__input {
  width: 38px;
  height: 36px;
  text-align: center;
  background-color: #ffffff;
  border: 3px solid #f0f1f2;
}
/**Custom Css */
</style>
