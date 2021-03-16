<template>
  <div class="custom-option">
    <h4>Select {{ option.title }} <sub>*</sub></h4>
    <div class="row">
      <div class="col-xs-12 col-md-10 col-lg-10">
        <template v-if="product && option.type === 'select'">
          <input
            type="hidden"
            v-model="vSelect.value"
            :name="(vSelect.name = 'bundleOption_' + option.option_id)"
          />
          <v-select
            :options="vSelectBundleOptions"
            v-model="productOptionId"
            :label="option.title"
            @focus="$emit('focus')"
            @blur="$emit('blur')"
            :name="vSelect.name"
            :searchable="false"
            :placeholder="`Select...`"
          >
            <template slot="option" slot-scope="option">
              <div
                class="img-detail"
                v-if="!option.title.includes('Underfloor')"
                :alt="option.title"
              >
                <img :src="option.cardImage" />
              </div>
              <div class="row">
                <div class="col-xs-8 col-lg-10">
                  <p class="title1">
                    {{ option.title }}
                  </p>
                </div>
                <div class="col-xs-4 col-lg-2">
                  <p class="price1">
                    {{ option.price | price }}
                  </p>
                </div>
              </div>
            </template>
            <template slot="selected-option" slot-scope="option">
              <div class="row selected-slot">
                <div class="col-xs-6 col-lg-11 col-md-6">
                  <p class="title">
                    {{ option.title }}
                  </p>
                </div>
                <div class="col-xs-6 col-lg-1 col-md-6">
                  <p class="price">
                    {{ option.price | price }}
                  </p>
                </div>
              </div>
            </template>
          </v-select>
          <!--<select
            ref="selectedOption"
            :name="'bundleOption_' + option.option_id"
            class="m0 no-outline"
            focus
            v-model="productOptionId"
            @focus="$emit('focus')"
            @blur="$emit('blur')"
          >
            <label class="labelTest">{{ option.title }}</label>
            <template v-for="(optionObject, key) in option.product_links">
              <option
                :value="optionObject.id"
                :key="key"
                :selected="optionObject.id === productOptionId"
              >
                {{ optionObject.product.name }}
              </option>
            </template>
          </select>-->
        </template>
        <template v-else>
          <div
            class="m5 relative"
            v-for="opval in option.product_links"
            :key="opval.id"
            data-testid="bundle-single-option"
          >
            <input
              type="radio"
              class="m0 no-outline"
              :name="bundleOptionName + opval.id"
              :id="bundleOptionName + opval.id"
              focus
              :value="opval.id"
              v-model="productOptionId"
            />
            <label
              v-if="opval.product"
              class="pl10 lh20 h4 pointer"
              :for="bundleOptionName + opval.id"
              v-html="opval.product.name"
            />
          </div>
        </template>
      </div>
      <div class="col-xs-6 mobile-price">
        <h2>
          {{
            productOptionId && productOptionId.price
              ? `£` + productOptionId.price
              : ''
          }}
        </h2>
      </div>
      <div
        class="col-xs-6 col-md-2 col-lg-2"
        :class="
          option &&
          option.title &&
          option.title === 'Thermostat' &&
          productOptionId &&
          productOptionId.title ? 'hidden'
            : ''
        "
      >
        <div class="qty-box-bundle">
          <label class="qty-label flex" :for="quantityName">{{
            $t('Qty')
          }}</label>
          <input
            type="number"
            min="0"
            class="m0 no-outline qty-input py10 brdr-cl-primary bg-cl-transparent h4"
            :name="quantityName"
            :id="quantityName"
            focus
            v-model="quantity"
          />
        </div>
        <span class="error" v-if="errorMessage">{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ProductBundleOption } from '@vue-storefront/core/modules/catalog/components/ProductBundleOption.ts'
import vSelect from 'vue-select'

export default {
  mixins: [ProductBundleOption],
  components: {
    vSelect
  },
  data () {
    return {
      details: [
        {
          title: 'Volcano Sandss',
          cardImage: '/assets/select.png',
          price: '149'
        },
        {
          title: 'Tornado Grey',
          cardImage: '/assets/select.png',
          price: '174'
        },
        {
          title: 'Manhattan Grey',
          cardImage: '/assets/select.png',
          price: '110'
        },
        {
          title: 'Cement Grey',
          cardImage: '/assets/select.png',
          price: '113'
        }
      ],
      vSelect: {
        value: null,
        name: ''
      }
    }
  },
  mounted () {
  },
  props: {
    product: {
      type: Object,
      required: false,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-tertiary: color(tertiary);
$color-black: color(black);
$color-hover: color(tertiary, $colors-background);

$bg-secondary: color(secondary, $colors-background);
$color-secondary: color(secondary);
$color-error: color(error);
.qty-input {
  border-style: solid;
  border-width: 0 0 1px 0;
  width: 90px;
}

.custom-option > label {
  font-weight: bold;
  margin-bottom: 10px;
}

.error {
  color: $color-error;
  padding-top: 5px;
  display: block;
}
$color-silver: color(silver);
$color-active: color(secondary);
$color-white: color(white);

.relative label.qty {
  padding-left: 5px;
}

.relative label {
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 16px;
  line-height: 30px;
  &:before {
    content: '';
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
input[type='text'] {
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
input[type='radio'],
input[type='checkbox'] {
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
      content: '';
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
.qty-label {
  font-size: 12px !important;
  padding-left: 0px !important;
  @media screen and (min-width: 768px) {
    justify-content: center;
    padding-right: 2px;
  }
}
.custom-option {
  padding: 25px 40px;
  border-bottom: 1px solid #cccccc;
  h4 {
    font-family: 'Oblik';
    color: #29275b;
    font-size: 16px;
    width: 100%;
    margin-top: 0px;
    margin-bottom: 3px;
    sub {
      color: #ef0b0b;
      position: relative;
      top: -7px;
      right: 5px;
    }
  }
  select {
    width: 100%;
    background: #ffffff;
    color: #4a4a4a;
    font-size: 14px;
    border: 1px solid #cccccc;
    max-width: 100%;
    padding-left: 10px;
    font-family: Arial, Helvetica, sans-serif;
    height: 50px;
    background: url(/assets/down-arrow.jpg) no-repeat top right;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  option {
    padding: 10px 0px;
  }
  option:hover {
    background-color: red;
  }
  .qty-box-bundle {
    margin-top: -30px;
    float: right;
  }
  label {
    font-family: 'Oblik';
    color: #29275b;
    margin-bottom: 0px;
    font-size: 14px;
  }
  label::before {
    width: 0px;
    border: 1px solid transparent;
    position: relative;
  }
  input {
    width: 42px;
    height: 25px;
    text-align: center;
    background-color: #ffffff;
    border: 2px solid #29275b;
    font-size: 14px;
    border-radius: 5px;
    text-align: center;
    :hover {
      border: 2px solid #29275b;
      border-color: #29275b;
    }
  }
  input[type='text']:hover,
  input[type='text']:focus {
    outline: none;
    border-color: #29275b;
  }
  .img-detail {
    img {
      margin-top: 5px;
    }
  }
  .title {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    margin-top: 6px;
    margin-bottom: 5px;
    @media screen and (min-width: 320px) and (max-width: 375px) {
      white-space: nowrap;
      width: 142px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media screen and (min-width: 376px) and (max-width: 425px) {
      white-space: nowrap;
      width: 185px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media screen and (min-width: 426px) and (max-width: 490px) {
      white-space: nowrap;
      width: 245px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media screen and (min-width: 992px) and (max-width: 1296px) {
      white-space: nowrap;
      width: 142px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media screen and (min-width: 768px) and (max-width: 991px) {
      white-space: nowrap;
      width: 319px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media screen and (min-width: 491px) and (max-width: 767px) {
      white-space: nowrap;
      width: 273px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .title1 {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    margin-top: 6px;
    margin-bottom: 5px;
    @media screen and (min-width: 320px) and (max-width: 375px) {
      white-space: nowrap;
      width: 175px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media screen and (min-width: 376px) and (max-width: 425px) {
      white-space: nowrap;
      width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media screen and (min-width: 426px) and (max-width: 490px) {
      white-space: nowrap;
      width: 245px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media screen and (min-width: 992px) and (max-width: 1296px) {
      white-space: nowrap;
      width: 230px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media screen and (min-width: 768px) and (max-width: 991px) {
      white-space: nowrap;
      width: 319px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media screen and (min-width: 491px) and (max-width: 767px) {
      white-space: nowrap;
      width: 273px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .price {
    text-align: right;
    margin-right: 30px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: #29275b;
    margin-top: 6px;
    margin-bottom: 5px;
  }
  .selected-slot {
    .price {
      position: relative;
      // right: -20px;
      margin-right: 0px;
    }
  }
  .price1 {
    text-align: right;
    margin-right: 30px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: #29275b;
    margin-top: 6px;
    margin-bottom: 5px;
    width: 100%;
  }
  .selected-slot {
    .price1 {
      position: relative;
      // right: -20px;
      margin-right: 0px;
    }
  }
}
@media (min-width: 768px) {
  .mobile-price {
    display: none;
  }
}
@media (max-width: 767px) {
  .custom-option .qty-box-bundle {
    margin-top: 20px;
  }
  .custom-option {
    padding: 25px 20px;
    border-bottom: none;
  }
  .custom-option label {
    position: relative;
    left: -5px;
    // top: 6px;
  }
  .custom-option label,
  .custom-option input {
    display: inline-block;
  }
  .custom-option input {
    border-radius: 10px;
  }
  .mobile-price {
    h2 {
      font-family: Arial, Helvetica, sans-serif;
      color: #29275b;
      font-size: 26px;
      margin-top: 35px;
      margin-bottom: 0px;
    }
  }
}
</style>
<style>
.custom-option .vs__dropdown-toggle {
  border-radius: 0px;
  padding: 0px;
  border-bottom-color: rgba(60, 60, 60, 0.26);
}
.custom-option .vs__actions button {
  display: none;
}
.custom-option .vs__actions .vs__open-indicator {
  background: url(/assets/down-arrow.jpg) no-repeat top right;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 49px;
  width: 45px;
}
.custom-option input.vs__search {
  width: 0;
}
.custom-option .vs--open .vs__open-indicator {
  transform: none;
}
.custom-option .vs__open-indicator path {
  display: none;
}
.custom-option .vs__actions {
  padding: 0px;
  display: block !important;
  height: 49px;
  padding: 0px !important;
}
.custom-option .vs__actions button {
  display: none !important;
}
.custom-option .vs__dropdown-menu {
  margin-top: 1px;
  z-index: 1;
}
.custom-option .vs__clear {
  display: none !important;
}
/* .custom-option  .vs__dropdown-menu li.active {
  background-color:#41BFF1 !important;
} */
/* .custom-option .vs__dropdown-menu li:hover,
.custom-option .vs__dropdown-menu li:focus,
.custom-option .vs__dropdown-menu li:active,
.custom-option .vs__dropdown-menu li:visited{
  background-color:#41BFF1 !important;
} */
.custom-option .vs__selected {
  line-height: initial;
  margin: 0px 2px 0;
  width: 95%;
  position: relative !important;
}
.custom-option .vs__search {
  padding: 0;
}
.custom-option .vs__selected .row {
  width: 100%;
}
@media (max-width: 767px) {
  .custom-option .vs__selected-options {
    flex-wrap: initial;
  }
}
.qty-box-bundle input[type='number'] {
  -moz-appearance: textfield;
}
.qty-box-bundle input::-webkit-outer-spin-button,
.qty-box-bundle input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.img-detail img {
  width: 60px;
}
</style>
