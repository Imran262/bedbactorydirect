<template>
  <div>
    <form class="custom-options">
      <div
        v-for="(option, count) in product.custom_options"
        :key="'customOption_' + option.option_id"
      >
        <!-- For color only -->
        <div v-if="count > 1 && color" class="custom-option mb15 basin">
          <h4 class="basin-head">{{ option.title }}</h4>
          <span @click="$emit('closeColorPickerModal')" class="close-modal"
            >×</span
          >

          <div
            class="mt5 mb5 basin_size"
            v-if="option.type === 'select' || option.type === 'drop_down'"
          >
            <select
              ref="colorImage"
              :name="'customOption_' + option.option_id"
              class="m0 no-outline"
              v-model="inputValues['customOption_' + option.option_id]"
              @focus="$emit('focus')"
              @blur="$emit('blur')"
              @change="
                setOption(option);
                setImage();
              "
            >
              <option disabled value="" :key="2378695843" selected="selected">
                Please select
              </option>
              <template v-for="(opval, key) in option.values">
                <option
                  v-if="key == 0"
                  :value="opval.option_type_id"
                  :key="key"
                >
                  {{ opval.title }}
                </option>
                <option v-else :value="opval.option_type_id" :key="key">
                  {{ opval.title }}
                </option>
              </template>
            </select>
            <div
              class="select-img-display"
              v-for="(value, vIndex) in option.values"
              :key="vIndex + value.option_type_id"
              v-if="value.option_type_id == imageSrc"
            >
              <div>
                <img
                  v-if="
                    !(
                      value.layer == '' ||
                      value.layer == null ||
                      value.layer == ' '
                    )
                  "
                  class="selctedImage"
                  :src="
                    'http://m2.bedfactorydirect.co.uk/pub/media/catalog/layer' +
                    value.layer
                  "
                  alt="Image"
                />
              </div>
            </div>
            <div class="custom-attribute-list height-adjust">
              <div
                v-for="(value, vIndex) in option.values"
                :key="vIndex + value.layer"
              >
                <img
                  class="allImages"
                  :src="
                    'http://m2.bedfactorydirect.co.uk/pub/media/catalog/layer' +
                    value.layer
                  "
                  alt="Image"
                  @click="
                    showOption(value, option);
                    setOption(option);
                  "
                />
              </div>
            </div>

            <div class="green-grad-main">
              <div @click="confirmColor()" class="green-grad confirm-extra">
                CONFIRM COLOUR
              </div>
            </div>
          </div>
        </div>
        <!-- For all other options -->
        <div v-if="count <= 1 && !color" class="custom-option mb15 basin">
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
              focus
              v-model="inputValues['customOption_' + option.option_id]"
              @focus="$emit('focus')"
              @blur="$emit('blur')"
              @change="optionChanged(option), setCrossOptions(option)"
            >
              <option :value="null" :key="2378695843" selected>
                Please select
              </option>
              <template v-for="(opval, key) in option.values">
                <option
                  v-if="key == 0"
                  :value="opval.option_type_id"
                  :key="key"
                >
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
  </div>
</template>

<script>
import { ProductCustomOptions } from "@vue-storefront/core/modules/catalog/components/ProductCustomOptions.ts";
import { changeFilterQuery } from "@vue-storefront/core/modules/catalog-next/helpers/filterHelpers";
export default {
  mixins: [ProductCustomOptions],
  components: {},
  data() {
    return {
      options: [],
      imageSrc: "",
      currentOption: null,
      colorName: "",
    };
  },
  props: {
    color: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    setCrossOptions(option) {
      //   console.log("option",option);
      let obj = {
        title: option.title,
        option_id: option.option_id,
        option_value: this.$refs.selectedOption[0].selectedOptions[0].label,
      };
      // console.log("1122 ",this.$refs.selectedOption[0].selectedOptions[0].label);
      let data = this.$refs.selectedOption;
      // console.log("1122 Selected option is ", this.inputValues['customOption_' + option.option_id]);
      // console.log("1155 Final data is ", obj);
      this.$emit("option-added", obj);
    },
    setOption(option) {
      this.currentOption = option;
    },
    confirmColor() {
      if (this.currentOption) {
        this.optionChanged(this.currentOption);
        this.$emit("changeColor", this.colorName);
        this.$emit("closeColorPickerModal");
      } else {
      }
    },
    showOption(value, option) {
      let data1 = this.$refs.colorImage;
      // console.log("1122 value", value);
      this.inputValues["customOption_"+option.option_id] = value.option_type_id;
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
.height-adjust {
  height: calc(100vh - 212px);
}
.basin-text {
  color: #54575b;
  margin: 0px;
}
.allImages {
  width: 100%;
  height: 100%;
}
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

.close-modal {
  position: absolute;
  right: 15px;
  cursor: pointer;
  font-size: 30px;
  color: #333;
  top: 5px;
}
.color-picker .custom-options .custom-option .basin_size select {
  width: 96.7%;
}
.custom-attribute-list div {
  display: inline-block;
  width: 78px;
  height: 78px;
  margin: 4px;
  border-radius: 3px;
  border: 1px solid;
  overflow: hidden;
  cursor: pointer;
}
.custom-attribute-list div:nth-child(n + 1) {
  margin-left: 0;
}
.select-img-display {
  width: 96.7%;
  margin-top: 10px;
}
.select-img-display div img {
  max-height: 200px;
  width: 100%;
}
.custom-attribute-list {
  margin: 20px 0;
  max-height: calc(100vh - 155px);
  /* height: 100%; */
  overflow: auto;
}
.green-grad-main {
  background: #fafafa;
  height: 75px;
  width: 96.7%;
  position: absolute;
  bottom: 15px;
}
.green-grad.confirm-extra {
  width: 100%;
  max-width: calc(100% - 60px);
  vertical-align: baseline;
  position: absolute;
  bottom: 22px;
  border-radius: 4px;
  padding: 0 1rem;
  line-height: 45px;
  font-size: 16px;
  color: #fff;
  font-family: Arial;
  font-weight: 600;
  display: inline-block;
  background: #3fa39a url("../../assets/arrow-forward-white.png") no-repeat 100%
    55%;
  left: 0;
  cursor: pointer;
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
  .custom-attribute-list div {
    width: 62px;
    height: 62px;
  }
  .select-img-display div img {
    max-height: 100px;
  }
  .green-grad.confirm-extra {
    width: 100%;
    max-width: calc(100% - 60px);
  }
}
@media (min-width: 767px) and (max-width: 991px) {
  .basin .basin_size select {
    width: 250px;
  }
}
@media (min-width: 768px) and (max-width: 992px) {
  .custom-attribute-list div {
    width: calc(16.5% - 8px);
    height: 60px;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .green-grad.confirm-extra {
    max-width: calc(100% - 55px);
  }
  .custom-attribute-list div {
    width: calc(16.5% - 8px);
  }
  .select-img-display div img {
    max-height: 100px;
  }
}
</style>