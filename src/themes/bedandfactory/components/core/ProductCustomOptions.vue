<template>
  <form class="custom-options">
    <div
      v-for="option in product.custom_options"
      :key="'customOption_' + option.option_id"
    >
      <div class="custom-option mb15 basin">
        <h4 class="basin-head">{{ option.title }}</h4>
        <input
          class="py10 w-100 border-box brdr-none brdr-bottom-1 brdr-cl-primary h4 sans-serif"
          v-if="option.type === 'field'"
          type="text"
          :name="'customOption_' + option.option_id"
          focus
          v-model="inputValues['customOption_' + option.option_id]"
          :placeholder="option.title"
          @change="optionChanged(option)"
        />
        <div
          class="m5 relative"
          v-for="opval in option.values"
          :key="opval.option_type_id"
          v-if="option.type === 'radio'"
        >
          <input
            @change="optionChanged(option)"
            type="radio"
            class="m0 no-outline"
            :name="'customOption_' + option.option_id"
            :id="'customOption_' + opval.option_type_id"
            focus
            :value="opval.option_type_id"
            v-model="inputValues['customOption_' + option.option_id]"
          />
          <label
            class="pl10 lh20 h4 pointer"
            :for="'customOption_' + opval.option_type_id"
            v-html="opval.title"
          />
        </div>
        <div
          class="mt5 mb5 relative basin_size"
          v-if="option.type === 'select' || option.type === 'drop_down'"
        >
          <select
            ref="selectedOption"
            :name="'customOption_' + option.option_id"
            class="m0 no-outline"
            v-model="inputValues['customOption_' + option.option_id]"
            @focus="$emit('focus')"
            @blur="$emit('blur')"
            @change="optionChanged(option), setOption(option)"
          >
      
            <!-- <option
              v-for="(opval, key) in option.values"
              :key="key"
              :value="opval.option_type_id"
            >{{ opval.title }}</option>-->
            <option :value="null" :key="2378695843" selected>
              Please select
            </option>
            <template v-for="(opval, key) in option.values">
              <option v-if="key == 0" :value="opval.option_type_id" :key="key">
                {{ opval.title }}
              </option>
              <option v-else :value="opval.option_type_id" :key="key">
                {{ opval.title }}
              </option>
            </template>
          </select>
        </div>

        <div
          class="m5 relative"
          v-for="opval in option.values"
          :key="opval.option_type_id"
          v-if="option.type === 'checkbox'"
        >
          <input
            @change="optionChanged(option)"
            type="checkbox"
            class="m0 no-outline"
            :name="'customOption_' + option.option_id"
            :id="'customOption_' + opval.option_type_id"
            focus
            :value="opval.option_type_id"
            v-model="inputValues['customOption_' + option.option_id]"
          />
          <label
            class="pl10 lh20 h4 pointer"
            :for="'customOption_' + opval.option_type_id"
            v-html="opval.title"
          />
        </div>
        <span
          class="error"
          v-if="validation.results['customOption_' + option.option_id].error"
          >{{
            validation.results["customOption_" + option.option_id].message
          }}</span
        >
      </div>
    </div>
  </form>
</template>

<script>
import { ProductCustomOptions } from "@vue-storefront/core/modules/catalog/components/ProductCustomOptions.ts";

export default {
  mixins: [ProductCustomOptions],
  methods: {
    setOption(option) {
      console.log("option",option);
      let obj = {
        title : option.title,
        option_id : option.option_id,
        option_value : this.$refs.selectedOption[0].selectedOptions[0].label
      }
      console.log("1122 ",this.$refs.selectedOption[0].selectedOptions[0].label);
      let data = this.$refs.selectedOption;
      console.log("1122 Selected option is ", this.inputValues['customOption_' + option.option_id]);
      console.log("1155 Final data is ", obj);
     this.$emit('option-added', obj);
    },
    showOption(value, option) {
      let data1 = this.$refs.colorImage;
      console.log("1122 value", value);
      this.inputValues.customOption_15 = value.option_type_id;
      this.colorName = value.title;
      data1 = this.$refs.colorImage;
      this.imageSrc = value.option_type_id;
    },
    setImage() {
      let data = this.$refs.colorImage[0].selectedOptions[0];
      this.colorName = data.innerHTML;
      this.imageSrc = data.value;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$color-tertiary: color(tertiary);
$color-black: color(black);
$color-hover: color(tertiary, $colors-background);

$bg-secondary: color(secondary, $colors-background);
$color-secondary: color(secondary);
$color-error: color(error);

.custom-option > label {
  font-weight: bold;
  margin-bottom: 10px;
}
.basin {
  .basin-head {
    color: #54575b;
    margin: 0px;
  }
  .basin_size {
    select {
      width: 350px;
      background: #ffffff;
      font-family: "Poppins", sans-serif;
      color: #000;
      font-size: 16px;
      border: 3px solid #f0f1f2;
    }
  }
  // .basin-head,
  // .basin_size {
  //   display: inline-block;
  // }
}

.error {
  color: $color-error;
  padding-top: 5px;
  display: block;
}
$color-silver: color(silver);
$color-active: color(secondary);
$color-white: color(white);

.relative label {
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 16px;
  line-height: 30px;
  &:before {
    content: "";
    position: absolute;
    top: 3px;
    left: 0;
    width: 22px;
    height: 22px;
    background-color: $color-white;
    border: 1px solid $color-silver;
    cursor: pointer;
  }
}
input[type="text"] {
  transition: 0.3s all;
  &::-webkit-input-placeholder {
    color: $color-tertiary;
  }
  &::-moz-placeholder {
    color: $color-tertiary;
  }
  &:hover,
  &:focus {
    outline: none;
    border-color: $color-black;
  }
  background: inherit;
}
input[type="radio"],
input[type="checkbox"] {
  position: absolute;
  top: 3px;
  left: 0;
  opacity: 0;
  &:checked + label {
    &:before {
      background-color: $color-silver;
      border-color: $color-silver;
      cursor: pointer;
    }
    &:after {
      content: "";
      position: absolute;
      top: 9px;
      left: 5px;
      width: 11px;
      height: 5px;
      border: 3px solid $color-white;
      border-top: none;
      border-right: none;
      background-color: $color-silver;
      transform: rotate(-45deg);
    }
  }
  &:hover,
  &:focus {
    + label {
      &:before {
        border-color: $color-active;
      }
    }
  }
  &:disabled + label {
    cursor: not-allowed;
    &:hover,
    &:focus {
      &:before {
        border-color: $color-silver;
        cursor: not-allowed;
      }
    }
  }
}

@media (max-width: 767px) {
  .basin-head,
  .basin_size {
    display: block !important;
    margin-right: 0px;
    margin-left: 0px;
  }
  .basin_size select {
    margin-left: 0px !important;
  }
}
@media (min-width: 767px) and (max-width: 991px) {
  .basin .basin_size select {
    width: 250px;
  }
}
</style>
