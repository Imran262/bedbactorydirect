<template>
  <div>
    {{product.custom_options.length}}
        <!-- {{product.custom_options[0]}} -->
    <form class="custom-options">
      <div
        v-for="(option,count) in product.custom_options"
        :key="('customOption_' + option.option_id)"
      >
        <div v-if="count>1 && color">
          <!-- <button type="button" @click="showColorPicker">{{ $t('Select color')}}</button>
          <div id="overlay" @click="hideColorPicker" v-if="hamza" />
          <color-picker :colors="option" v-if="hamza" /> -->
          <div class="mt5 mb5 relative basin_size" v-if="option.type === 'select' || option.type === 'drop_down'" >
              drop_down
            <select
              :name="'customOption_' + option.option_id"
              class="m0 no-outline"
              v-model="inputValues['customOption_' + option.option_id]"
              @focus="$emit('focus')"
              @blur="$emit('blur')"
              @change="optionChanged(option)"
            >
              <!-- <option
              v-for="(opval, key) in option.values"
              :key="key"
              :value="opval.option_type_id"
              >{{ opval.title }}</option>-->
              <option :value="null" :key="2378695843" selected>Please select</option>
              <template v-for="(opval, key) in option.values">
                <option v-if="key==0" :value="opval.option_type_id" :key="key">{{ opval.title }}</option>
                <option v-else :value="opval.option_type_id" :key="key">{{ opval.title }}</option>
              </template>
            </select>
          </div>
        </div>
        <div v-if="count<=1" class="custom-option mb15 basin">
          <h4 class="basin-head">{{ option.title }}</h4>
          <input v-if="option.type === 'field'"
            class="py10 w-100 border-box brdr-none brdr-bottom-1 brdr-cl-primary h4 sans-serif"
            
            type="text"
            :name="('customOption_' + option.option_id)"
            focus
            v-model="inputValues[('customOption_' + option.option_id)]"
            :placeholder="option.title"
            @change="optionChanged(option)"
          />
          <div class="m5 relative" v-for="opval in option.values" :key="opval.option_type_id" v-if="option.type === 'radio'">
              radio
            <input
              @change="optionChanged(option)"
              type="radio"
              class="m0 no-outline"
              :name="('customOption_' + option.option_id)"
              :id="('customOption_' + opval.option_type_id)"
              focus
              :value="opval.option_type_id"
              v-model="inputValues[('customOption_' + option.option_id)]"
            />
            <label
              class="pl10 lh20 h4 pointer"
              :for="('customOption_' + opval.option_type_id)"
              v-html="opval.title"
            />
          </div>
          <div class="mt5 mb5 relative basin_size" v-if="option.type === 'select' || option.type === 'drop_down'" >
              drop_down
            <select
              :name="'customOption_' + option.option_id"
              class="m0 no-outline"
              v-model="inputValues['customOption_' + option.option_id]"
              @focus="$emit('focus')"
              @blur="$emit('blur')"
              @change="optionChanged(option)"
            >
              <!-- <option
              v-for="(opval, key) in option.values"
              :key="key"
              :value="opval.option_type_id"
              >{{ opval.title }}</option>-->
              <option :value="null" :key="2378695843" selected>Please select</option>
              <template v-for="(opval, key) in option.values">
                <option v-if="key==0" :value="opval.option_type_id" :key="key">{{ opval.title }}</option>
                <option v-else :value="opval.option_type_id" :key="key">{{ opval.title }}</option>
              </template>
            </select>
          </div>
          <div class="m5 relative" v-for="opval in option.values" :key="opval.option_type_id" v-if="option.type === 'checkbox'">
            checkbox
            <input
              @change="optionChanged(option)"
              type="checkbox"
              class="m0 no-outline"
              :name="('customOption_' + option.option_id)"
              :id="('customOption_' + opval.option_type_id)"
              focus
              :value="opval.option_type_id"
              v-model="inputValues[('customOption_' + option.option_id)]"
            />
            <label
              class="pl10 lh20 h4 pointer"
              :for="('customOption_' + opval.option_type_id)"
              v-html="opval.title"
            />
          </div>
          <span
            class="error"
            v-if="validation.results[('customOption_' + option.option_id)].error"
          >{{ validation.results[('customOption_' + option.option_id)].message }}</span>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ProductCustomOptions } from "@vue-storefront/core/modules/catalog/components/ProductCustomOptions.ts";
//import ColorPicker from "theme/components/core/blocks/ColorPIcker/ColorPicker";
export default {
  mixins: [ProductCustomOptions],
  components: {
//    ColorPicker
  },
  data() {
    return {
      hamza: false
    };
  },
  props:{
    color:{
      type: Boolean,
      required:true
    }
  },
  methods: {
    showColorPicker() {
      this.hamza = true;
    },
    hideColorPicker() {
      this.hamza = false;
    }
  }
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
.hide-color-picker {
  display: none;
}
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
#overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  cursor: pointer;
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
