<template>
  <div>
    <form class="custom-options" v-if="product.custom_options">
      <div
        v-for="(option, count) in product.custom_options"
        :key="'customOption_' + option.option_id + count"
      >
        <h4 v-if="!color" class="basin-head">{{ option.title }} </h4>
        <div
          v-if="
            (option.iscolor == 1 ||
              option.iscolor == '1' ||
              option.iscolor == true) &&
            color
          "
        >
          <div class="custom-option mb15 basin">
            <h4 class="basin-head">{{ option.title }}<i data-v-0b1c0f15="" class="material-icons close fab-cross cl-white" @click="$emit('closeColorPickerModal')">close</i></h4>
            <span @click="$emit('closeColorPickerModal')" class="close-modal">
            </span>

            <div
              class="mt5 mb5 basin_size basin-size-color"
              v-if="option.type === 'select' || option.type === 'drop_down'"
            >
              <!-- <i
                data-v-35f9ed0c=""
                class="material-icons p15 cl-bg-tertiary pointer select-color-icon chevron-down-clr"
                ></i
              > -->
              <select
                ref="colorImage"
                :name="'customOption_' + option.option_id"
                class="m0 no-outline chevron-down chevron-down-color inside-Fabric chevron-down"
                v-model="inputValues['customOption_' + option.option_id]"
                @focus="$emit('focus')"
                @blur="$emit('blur')"
                @change="
                  setOption(option);
                  setImage();
                "
              >
                <option disabled value="" :key="2378695843" selected="selected">
                  Please Select
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
               <span
              class="error"
              v-if="
                validation.results['customOption_' + option.option_id] &&
                validation.results['customOption_' + option.option_id].error
              "
              >{{
                validation.results["customOption_" + option.option_id].message
              }}</span
            >
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
                      backEnd+'/pub/media/catalog/layer' +
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
                      backEnd+'/pub/media/catalog/layer' +
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
        </div>
        <div
          v-else-if="
            (option.iscolor == 0 ||
              option.iscolor == '0' ||
              option.iscolor == ' ' ||
              option.iscolor == false) &&
            !color
          "
        >
          <div class="custom-option mb15 basin">
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
              <!-- <i
                class="material-icons p15 cl-bg-tertiary pointer select-color-icon chevron-down"
                ></i 
              > -->

              <select
                ref="selectedOption"
                :name="'customOption_' + option.option_id"
                class="m0 no-outline size-storage-select chevron-down"
                focus
                v-model="inputValues['customOption_' + option.option_id]"
                @focus="$emit('focus')"
                @blur="$emit('blur')"
                @change="optionChanged(option), setCrossOptions(option)"
              >
                <option disabled value="" :key="2378695843" selected="selected">
                  Please Select
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
              v-if="
                validation.results['customOption_' + option.option_id] &&
                validation.results['customOption_' + option.option_id].error
              "
              >{{
                validation.results["customOption_" + option.option_id].message
              }}</span
            >
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ProductCustomOptions } from "@vue-storefront/core/modules/catalog/components/ProductCustomOptions.ts";
import { changeFilterQuery } from "@vue-storefront/core/modules/catalog-next/helpers/filterHelpers";
import { mapGetters } from "vuex";
import config from 'config'
export default {
  mixins: [ProductCustomOptions],
  components: {},
  data() {
    return {
      backEnd: config.backEnd,
      options: [],
      imageSrc: "",
      currentOption: null,
      colorName: "",
      productName: "",
    };
  },
  computed: {
    ...mapGetters({
      getCurrentProduct: "product/getCurrentProduct",
    }),
    updatedProduct: function () {
      return this.getCurrentProduct;
    },
  },
  props: {
    color: {
      type: Boolean,
      required: true,
    },
    currProduct: {
      type: String,
      default: "",
    },
    product: {
      type: Object,
      required: true,
    },
  },
  beforeMount() {
    this.$forceUpdate();
    // this.productName = this.currProduct.name;
    // this.product = this.currProduct;
    // this.product = this.getCurrentProduct;
  },
  methods: {
    update() {
      this.$forceUpdate();
    },
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
      this.inputValues["customOption_" + option.option_id] =
        value.option_type_id;
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
.chevron-down{
background: url(/assets/icons/downarrow.png) no-repeat 99% 46% !important;
background-size: 17px !important ;
}
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
    background: #ffffff;
    //  font-family: 'OBLIK';
      color: #071A44;
      font-size: 16px;
      border: 2px solid #071A44;
      appearance: none;
      padding-left: 4px !important;
       cursor: pointer;
    }
  }
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
  /*width: 96.7%;*/
  width: 90%;
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
  background: #57c9c0 no-repeat 100%
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
.select-color-icon {
  padding: 0;
  float: right;
  color: #24224d;
  font-size: 20px;
  position: absolute;
  right: 3px;
  top: 15px;
  font-weight: 500;
  background: url(/assets/icons/downarrow.png) no-repeat 100% 35%;
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
  pointer-events: none;
}
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  /*padding: 2px 2px 2px 2px;*/
  border: none;
}
.basin_size {
  width: 550px;
}
 @media (max-width: 1268px){
    .basin_size {
      width: 400px;
  }
  }
h4.basin-head {
    color: #071A44 !important;
     margin-bottom: 5px;
}
/*@media only screen and (min-device-width: 320px) and (max-device-width: 400px) {
.size-storage-select {
    width: 250px !important;
}
}
@media (max-width: 767px) {
   .basin_size{
    width: 350px !important;
  }
}
@media (max-width: 400px) {
   .basin_size{
    width: 250px !important;
  }
}*/
.basin-size-color {
  width: 100% !important;
}
.chevron-down-color {
  width: 100% !important;
}
@media (max-width: 767px){
.inside-Fabric {
     width: 100% !important;
}
}
.chevron-down-clr{
 padding: 0;
  float: right;
  color: #000;
  font-size: 20px;
  position: absolute;
  right: 20px;
  top: 60px;
  font-weight: 500;
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
}
.basin_size{
    width: 95%;
}
select.m0.no-outline.size-storage-select {
    width: 100%;
}
.fab-cross {
    position: relative;
    top: -2px;
    float: right;
   cursor: pointer;
   background: #EE4C56;
    border: 2px solid #EE4C56;
    border-radius: 22px;
}
</style>