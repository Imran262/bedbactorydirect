<template>
  <div class="relative base-input">
    <div class="relative">
      <input
        class="py10 w-100 border-box brdr-none brdr-bottom-1 brdr-cl-primary h4 sans-serif"
        :class="{pr30: type === 'password', empty: value === '' && placeholder !== 'Company' && (validations.length > 0 ? validations[0].condition : '') }"
        :type="type === 'password' ? passType : type"
        :name="name"
        :autocomplete="autocomplete"
        :value="value"
        :autofocus="autofocus"
        :ref="name"
        :placeholder="emailformate"
        @input="$emit('input', $event.target.value)"
        @blur="$emit('blur')"
        @keyup.enter="$emit('keyup.enter', $event.target.value)"
        @keyup="$emit('keyup', $event)"
      />
      <label>{{ placeholder }}</label>
    </div>
    <button
      v-if="iconActive"
      type="button"
      class="icon material-icons absolute brdr-none no-outline p0 bg-cl-transparent cl-brdr-secondary pointer"
      @click="togglePassType()"
      :aria-label="$t('Toggle password visibility')"
      :title="$t('Toggle password visibility')"
    >{{ icon }}</button>
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
  data() {
    return {
      passType: "password",
      iconActive: false,
      icon: "visibility_off",
    };
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      default: "",
    },
    name: {
      type: String,
      required: false,
      default: "",
    },
     emailformate: {
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
    focus: {
      type: Boolean,
      required: false,
      default: false,
    },
    autofocus: {
      type: Boolean,
      required: false,
      default: false,
    },
    validations: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    togglePassType() {
      if (this.passType === "password") {
        this.passType = "text";
        this.icon = "visibility";
      } else {
        this.passType = "password";
        this.icon = "visibility_off";
      }
    },
    // setFocus sets focus on a field which has a value of 'ref' tag equal to fieldName
    setFocus(fieldName) {
      if (this.name === fieldName) {
        this.$refs[this.name].focus();
      }
    },
  },
  created() {
    if (this.type === "password") {
      this.iconActive = true;
    }
  },
  mounted() {
    if (this.focus) {
      this.$refs[this.name].focus();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$color-tertiary: color(tertiary);
$color-black: color(black);
$color-puerto-rico: color(puerto-rico);
$color-hover: color(tertiary, $colors-background);

.base-input {
  min-height: 4.5rem;
}

input {
  background: inherit;

  &:hover,
  &:focus {
    outline: none;
    border-color: $color-puerto-rico;
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
  left: 0;
  top: 10px;
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
}
input:focus ~ label,
input:not(.empty) ~ label {
  top: -10px;
  font-size: 14px;
  color: $color-puerto-rico;
}

.icon {
  right: 6px;
  top: 10px;
  &:hover,
  &:focus {
    color: $color-hover;
  }
}
.coming-back-section{
  .relative.base-input.mb10.input-box {
    margin-bottom: 0;
}
.base-input {
    min-height: 4rem;
}
  input {
    background: #EBEBEB;
    border: none;
   @media (min-width: 767px){
     padding: 25px 0;
     text-indent: 20px;
   }
}
 label{
      color: #8B8C8E;
      font-style: italic;
      font-family: Arial, Helvetica, sans-serif;
      padding-left: 16px;
      line-height: 1.7;
      font-size: 14px;
      @media (min-width: 767px){
    font-size: 18px;
   }
    }
input:focus ~ label,
input:not(.empty) ~ label {
  top: -20px;
  font-size: 14px;
  color: transparent;
}
}
.coming-back-section{
  button{
    display: none;
  }
}
.personal-details{
  .base-input{
    margin-top: 30px;
  }
  input{
    border: 1px solid #bdbdbd;
    border-radius: 3px;
    padding: 0px 10px;
    color: #9b9b9b;
    font-size: 14px;
    height: 48px;
    line-height: 1;
  }
  input.empty{
    background-color: #FAEBE7 !important;
  }
  input:focus{
    background-color: #edf7fd !important;
  }
  input:focus ~ label,
  input:not(.empty) ~ label {
    top: -30px;
    color: #3A3E3D;
    font-size: 14px;
  }
  label {
    top: -30px;
    color: #3A3E3D;
    font-weight: 600;
    font-size: 14px;
  }
  label:after {
    content: '*';
    color: #ef0b0b;
    position: absolute;
    right: -10px;
    bottom: 3px;
    }
  }

.coupon-wrapper{
  input{
    border: 1px solid #bdbdbd;
    border-radius: 3px;
    padding: 0px 10px;
    color: #9b9b9b;
    font-size: 14px;
    height: 48px;
  }
}

.billing-details{
  .base-input{
    margin-top: 30px;
  }
  input{
    border: 1px solid #bdbdbd;
    border-radius: 3px;
    padding: 0px 10px;
    color: #9b9b9b;
    font-size: 14px;
    height: 48px;
    line-height: 1;
  }
  input.empty{
    background-color: #FAEBE7 !important;
  }
  input:focus{
    background-color: #edf7fd !important;
  }
  .mobile-number input.empty{
    background-color:inherit !important;
  }
  input:focus ~ label,
  input:not(.empty) ~ label {
    top: -30px;
    color: #3A3E3D;
    font-size: 14px;
  }
  label {
    top: -33px;
    color: #3A3E3D;
    font-weight: 600;
    font-size: 14px;
  }
  .req-label label:after {
    content: '*';
    color: #ef0b0b;
    position: absolute;
    right: -10px;
    bottom: 3px;
    }
}
@media (min-width: 320px) and (max-width: 767px) {
  .shipping-phone-number {
    margin-top: 10px;
  }
  .input-box label {
      font-size: 12px !important;
  }
  .billing-details label{
    top: -15px;
  } 
  .personal-details input:focus ~ label,
  .personal-details input:not(.empty) ~ label {
    top: -26px !important;
  }
  .coupon-wrapper{
    input{
      border-radius: 0px;
      width: 90%;
    }
  }
}
 @media(min-width: 767px) and (max-width: 1200px){
    .input-box label {
      font-size: 10px !important;
     }
  }
.LoginForm,.RegisterForm,.reset-password{
  button{
    display: none;
  }
}
</style>
