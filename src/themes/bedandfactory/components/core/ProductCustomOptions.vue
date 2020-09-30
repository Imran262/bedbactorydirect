<template>
  <div>
    <!-- in custom options  {{color}}
    {{product.custom_options.length}}-->

    <!-- {{product.custom_options[0]}} -->
    <form class="custom-options">
      <div
        v-for="(option, count) in product.custom_options"
        :key="'customOption_' + option.option_id"
      >
        <!-- {{option}} -->
        <!-- {{(count>1 && color)}}
        {{(count<=1 && !color)}}-->
        <!-- For color only -->
        <div v-if="count > 1 && color" class="custom-option mb15 basin">
          <h4 class="basin-head">{{ option.title }}</h4>
          <!-- {{option}} -->
          <!-- about to call function {{ setOptions()}} -->
          <div
            class="mt5 mb5 relative basin_size"
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
                optionChanged(option);
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
              v-for="(value, vIndex) in option.values"
              :key="vIndex + value.option_type_id"
            >
              <div v-if="value.option_type_id == imageSrc">
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
                @click="setOption(value, option)"
              />
            </div>
            <div></div>
          </div>
        </div>
        <!-- For all other options -->
        <div v-if="count <= 1 && !color" class="custom-option mb15 basin">
          <!-- second condition is true
          {{ count }}
          {{ color }}-->
          <h4 class="basin-head">{{ option.title }}</h4>
          <input
            v-if="option.type === 'field'"
            class="py10 w-100 border-box brdr-none brdr-bottom-1 brdr-cl-primary h4 sans-serif"
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
            <!-- radio -->
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
            <!-- drop_down hello -->
            <select
              ref="dropDown"
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
            <!-- hello
            {{option.option_id}} -->
            <!-- {{makeList()}} -->
          </div>
          <div
            class="m5 relative"
            v-for="opval in option.values"
            :key="opval.option_type_id"
            v-if="option.type === 'checkbox'"
          >
            checkbox
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
//import ColorPicker from "theme/components/core/blocks/ColorPIcker/ColorPicker";
export default {
  mixins: [ProductCustomOptions],
  components: {
    //    ColorPicker
  },
  data() {
    return {
      options: [],
      imageSrc: "",
    };
  },
  props: {
    color: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
  
    setOption(value, option) {
      // console.log(
      //   "2244 in set option function",
      //   value,
      //   "\n selected option is ",
      //   value.option_type_id,
      //   "\n",
      //   typeof this.inputValues,
      //   "current color is ",
      //   this.inputValues.customOption_15
      // );
      let data1 = this.$refs.colorImage;
      // console.log(
      //   "1155\n Selected value ",
      //   value.option_type_id,
      //   "\n before assignment",
      //   data1
      // );
      this.inputValues.customOption_15 = value.option_type_id;
      data1 = this.$refs.colorImage;
      // console.log(
      //   "\n Selected value ",
      //   value.option_type_id,
      //   "\n after assignment",
      //   data1
      // );
      // this.setImage();
      this.optionChanged(option);
      this.imageSrc = value.option_type_id;
      // setTimeout(()=>{
      //   console.log('Arsltest', this.$refs.colorImage[0].selectedOptions[0])
      //   let data = this.$refs.colorImage[0].selectedOptions[0].value;
      //   console.log("\n after assignment", data);
      //   this.imageSrc = value.option_type_id;
      //   }, 100);
    },
    setImage() {
      // console.log(
      //   "1122 in set image function\n",
      //   this.$refs.colorImage,
      //   "\n\n\n"
      // );
      // console.log(
      //   "1144 in set image function\n",
      //   JSON.stringify(this.$refs.colorImage),
      //   "\n\n\n"
      // );
      // console.log(
      //   "1133 length\n",
      //   typeof this.$refs.colorImage[0].selectedOptions,
      //   "\n\n\n"
      // );
      let data = this.$refs.colorImage[0].selectedOptions[0].value;
      this.imageSrc = data;
      // console.log(
      //   "1122 \n selected option is  ",
      //   data,
      //   "image source is ",
      //   this.imageSrc
      // );

      // let input = this.$refs.colorImage[0].selectedOptions[0];
      // // this.$refs.colorImage[0].selectedOptions[0].text = "red"
      // console.log("1133 length\n", input, "\n\n\n");
      // 0.selectedOption[0].label
    },
    // makeList(option) {
    //   console.log("112233 options are ", this.options.length);
    //   console.log("Here we are");

    //   console.log("refernce is ",this.$refs.dropDown);

    //   if (this.options.length > 0) {
    //   }
    // },
    // setOptions() {
    //   console.log("1122 Custom options are ", this.customOptions.length);
    //   this.customOptions.forEach((option, index) => {
    //     console.log("Now traversing Option no ", index);
    //     this.optionChanged(option);
    //   });
    // },
    // sendStorageOption(option) {
    //   this.$emit("storage", option);
    // },
    // sendSizeOption(option) {
    //   this.$emit("size", option);
    // }
  },
};
</script>
<style lang="scss" scoped>
.allImages {
  width: 100px;
}
.selctedImage {
  width: 100px;
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
