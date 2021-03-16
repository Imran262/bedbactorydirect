<template>
  <div class="base-input-numberz">
    <label class="base-input-number__label cl-primary flex" :for="getInputId">{{ name }}</label>
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
// .maincart {
//   .base-input-number__label {
//     display: none;
//   }
//   .base-input-number {
//     &__input {
//       background-color: #fff;
//       border: 1px solid #9b9b9b;
//       border-radius: 3px;
//       color: #9b9b9b;
//       font-family: Arial;
//       font-size: 14px;
//       height: 45px;
//       width: 54px !important;
//       line-height: 0px;
//     }
//   }
// }
.maincart {
  .base-input-number__label {
    display: none;
  }
  .base-input-number__input {
    border: none;
    height: 100% !important;
    text-align: center;
  }
  .base-input-number {
    height: 100%;
    border: 1px solid #9b9b9b;
    border-radius: 3px;
    color: #9b9b9b;
    font-family: Arial;
    font-size: 14px;
    height: 45px;
    width: 54px !important;
    line-height: 0px;
  }
  .base-input-number__input input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
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
</style>

