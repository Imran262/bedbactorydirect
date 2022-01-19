<template>
  <div class="maincart">
   <!-- totals {{totals}}
   <br/>
   productsInCart {{JSON.stringify (productsInCart)}} -->
    <div class="container">
      <div class="row uz_mb_top_checkout">
        <div class="col-xs-4 col-sm-6 uz-top-checkout-left">
          <p class="uz_top_grandtotal">Grand Total</p>
          <p class="uz_top_grand_price">
            <span class="price">{{ grandTotal | price }}</span>
          </p>
        </div>
        <div class="col-xs-8 col-sm-6 padding-right">
          <div class="grid12-12 uz-proceed-checkout">
            <button-full
              type="button"
              class="
                sb-button
                button
                btn-proceed-checkout
                override-btn-checkout
                btn-checkout
              "
              :link="{ name: 'checkout' }"
            >
              <span><span class="sb-checkout-cart">CHECKOUT</span></span>
            </button-full>
          </div>
        </div>
      </div>
      <template v-if="checkIfAnyGroutAdhesive">
        <template v-if="!discountCheck">
          <template v-if="totalPriceToSendInCall >= 50">
            <div
              class="col-md-12 sb-special-main"
              v-if="
                !addAllBtnClicked &&
                productsIncludesTileProduct &&
                totalPriceToSendInCall !== 0 &&
                productsHasAdhesivesAndGroutCheck &&
                groutAddedOrNoThanks
              "
            >
              <div class="row">
                <div class="col-md-1 col-xs-1 sb-special-off">
                  <img src="assets/tm_save_notices.png" alt="tm save notices" />
                </div>

                <div class="col-md-7 col-xs-7 sb-congragulation-text">
                  <p class="limited_offer_p2">
                    Save £
                    <span class="discount" v-if="discountOfTenPound">10</span>
                    <span class="discount" v-else> {{ discountPrice }} </span>
                    when you add all our specially calculated adhesive and
                    grouts for your project now...
                  </p>
                </div>

                <div
                  class="
                    col-md-4 col-xs-4
                    rec_banner_total
                    sb-add-all-button
                    pull-right
                  "
                >
                  <button
                    id="rec_banner_total_btn"
                    @click="addAllGroutAdhesives()"
                    type="reset"
                    value="Reset"
                  >
                    ADD ALL FOR £
                    <span id="discounted_rec_total">
                      {{ totalPriceOfGroutAdhesive.toFixed(2) }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </template>
      </template>
      <div class="row flex row-cart-inner-main">
        <div class="cart-details col-lg-8 col-md-12 col-xs-12">
          <div class="cartinfo">
            <div class="bg-cl-primary m0 px40 products prod-ul">
              <div class="headingtop col-md-12 col-xs-12">
                <h2>{{ $t("Your Basket") }}</h2>
              </div>
              <!-- typeof product.options ,typeof product.totals.options ,typeof product.product_option.extension_attributes.custom_options.configurable_item_options  ,'\n', product
              
              products
              {{typeof productsInCart[2].options}}<br/>
              {{typeof productsInCart[2].totals.options}}<br/>
              {{typeof productsInCart[2].product_option.extension_attributes.custom_options.configurable_item_options}}<br/>
              {{productsInCart[2]}} -->
              <!-- {{productsInCart}}  -->
              <ProductCartPage
                :products-in-cart="productsInCart"
                v-for="product in productsInCart"
                :key="product.server_item_id || product.id"
                :product="product"
                :cart-adhesive-grout="cartHasGroutAdhesive"
                :full-cart="true"
                :orignalprice="true"
                :no-grout-adhesives-product="noGroutAdhesives"
                @grouts-adhesives="updateAllGroutsAdhesives"
                @add-all-total-price="addAllTotalPrice"
              />
            </div>
          </div>
          <div class="rcodelink col-lg-8 col-md-12 col-xs-12 pb40 pt10 pl0">
            <div
              v-if="OnlineOnly && !addCouponPressed"
              class="col-xs-12 hidden-xs"
            >
              <button
                class="
                  p0
                  brdr-none
                  serif
                  fs-medium-small
                  cl-accent
                  bg-cl-transparent
                  Voucher
                "
                type="button"
                @click="addDiscountCoupon"
              >
                {{ $t("Apply a voucher code?") }}
              </button>
            </div>
            <div
              v-if="OnlineOnly && addCouponPressed"
              class="col-xs-12 pt30 coupon-wrapper"
            >
              <div class="coupon-input">
                <label class="h6 cl-secondary">{{ $t("Discount code") }}</label>
                <base-input
                  type="text"
                  id="couponinput"
                  :autofocus="true"
                  v-model.trim="couponCode"
                  @keyup.enter="setCoupon"
                />
              </div>
              <button-outline
              :class="' Discount-Voucher'"
                :disabled="!couponCode"
                @click.native="setCoupon"
                >{{ $t("Add discount code") }}
              </button-outline>
            </div>
          </div>
        </div>

        <div class="Total col-lg-4 col-md-12 col-xs-12 total-box-inner">
          <Retailfinancev12 :currentPrice="(getGrandTotal() ? getGrandTotal() : '0')" :key="getGrandTotal()"/>
          <div class="cart-summary-main" id="cart-summary-main">
            <div class="inner-total bg-cl-primary">
              <div
                v-for="(segment, index) in totals"
                :key="index"
                class="row sub-title"
                v-if="segment.code !== 'grand_total'"
              >
                <div class="subtotal">
                  {{ segment.code == "subtotal" ? segment.title : "" }}
                </div>

                <div
                  v-if="segment.value != null && segment.code == 'subtotal'"
                  class="col-xs align-right sep-price"
                >
                  {{ segment.value | price() }}
                </div>
              </div>

              <div
                class="row sub-title row sub-title-discount"
                v-for="(segment, index) in totals"
                :key="`Dis` + index"
                v-if="segment.code === 'discount'"
              >
                <div class="col-xs h4 subtotal">
                  {{ segment.title }}
                </div>

                <div class="col-xs align-right sep-price">
                  {{ segment.value | price() }}
                </div>
              </div>

              <div
                class="row sub-title row sub-title-shipping"
                v-for="(segment, index) in totals"
                :key="`ship` + index"
                v-if="segment.code === 'shipping'"
              >
                <div class="col-xs h4 subtotal">
                  <template
                    v-if="(segment.title.indexOf('Kerbside') !== -1) == true"
                  >
                    Kerbside Pallet Delivery
                  </template>
                  <template
                    v-else-if="(segment.title.indexOf('DPD') !== -1) == true"
                  >
                    DPD Delivery
                  </template>
                  <template
                    v-else-if="
                      (segment.title.indexOf('Royal Mail') !== -1) == true
                    "
                  >
                    Royal Mail
                  </template>
                  <template v-else> Delivery</template>
                </div>

                <div class="col-xs align-right sep-price">
                  {{
                    segment.value === 0
                      ? "Free Delivery"
                      : segment.value | price()
                  }}
                </div>
              </div>

              <div
                class="row weight-700 middle-xs grandTotal"
                v-for="(segment, index) in totals"
                :key="index"
                v-if="segment.code === 'grand_total'"
              >
                <div class="col-xs h4 total-price-label">
                  {{ segment.title }} Inc.VAT
                </div>

                <div class="col-xs align-right h2 total-price-value">
                  {{ segment.value | price() }}
                </div>
              </div>

              <div class="check-btn-outer">
                <button-full
                  class="checkoutbutton"
                  :link="{ name: 'checkout' }"
                >
                  {{ $t("Proceed To Checkout") }}
                </button-full>
              </div>
            </div>

            <!-- <div class="Gpay">
              <h3>You can also pay with:</h3>

              <img
                src="assets/paypal.svg"
                alt="paypal button"
                class="paypalBtn"
                @click="expressCheckout"
              />
            </div> -->
          </div>
        </div>
       
      </div>
    </div>
  </div>
</template>

<script>
import Retailfinancev12 from "src/themes/bedfactory/components/core/V12Calculator/Retailfinancev12.vue";
import V12calculator from "src/themes/bedfactory/components/core/V12Calculator/CalculatorV12.vue";
import i18n from "@vue-storefront/i18n";
import { CartSummary } from "@vue-storefront/core/modules/checkout/components/CartSummary";
import EventBus from "@vue-storefront/core/compatibility/plugins/event-bus";
import config from "config";
import axios from "axios";
import ProductCartPage from "theme/components/core/blocks/Microcart/ProductCartPage";
import ButtonFull from "theme/components/theme/ButtonFull";
import VueOfflineMixin from "vue-offline/mixin";
import { mapGetters, mapActions } from "vuex";
import ButtonOutline from "theme/components/theme/ButtonOutline";
import BaseInput from "theme/components/core/blocks/Form/BaseInput";
import { MeasureProductClick } from "src/modules/google-gtag/mixins/MeasureProductClick";
import _ from "lodash";

export default {
  data() {
    return {
       updatedPrice:0,
      regular: true,
      addCouponPressed: false,
      sorted: [],
      couponCode: "",
      cartHasGroutAdhesive: [],
      discount: false,
      allGroutsAdhesivesDataArray: {},
      allGroutsAdhesives: {
        data: [],
      },
      totalPriceOfGroutAdhesive: 0,
      totalPriceToSendInCall: 0,
      allProductsTotals: {},
      ProductsHasAdhesiveGrouts: {},
      productsHasAdhesivesAndGroutCheck: false,
      discountPrice: 20,
      noGroutAdhesives: false,
      addAllBtnClicked: false,
      hasGroutAdhesives: {},
      discountOfTenPound: false,
      groutAdhesiveAddedOrNoThanks: {},
      groutAddedOrNoThanks: true,
      discountCheck: false,
      productsIncludesTileProduct: false,
      grandTotal: 0,
    };
  },
  mixins: [VueOfflineMixin, CartSummary, MeasureProductClick],
  components: {
     Retailfinancev12,
    V12calculator,
    ProductCartPage,
    ButtonFull,
    ButtonOutline,
    BaseInput,
  },
  async mounted() {
    await this.checkCart();
    await this.getGrandTotal();
    await this.discountAppliedCheck();
    console.log("1012 1235 in Mounted ",this.grandTotal);
    if (this.grandTotal) {
      await this.sendCartClick({
        productsInCart: this.productsInCart,
        grandTotal: this.grandTotal,
      });
    }
    // window.addEventListener('scroll', this.handleScroll)
    this.updateScroll();
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  computed: {
    ...mapGetters({
      productsInCart: "cart/getCartItems",
      appliedCoupon: "cart/getCoupon",
      totals: "cart/getTotals",
      getCartToken: "cart/getCartToken",
    }),
    productsInCartComputed(){
      let data = this.productsInCart;
      console.log("7412589 in computed property ",data.length,data[2],data);
      data.forEach(async (product,dataIndex)=>{
        console.log("7412589 Current Product is ",product);
        if (product.configurable_children && product.configurable_children.length >0){
          console.log("7896541254 In cart current product is configurable it has ",product.configurable_children.length," children",product.configuration);
          // if (product.configuration){
            console.log("7896541254 current product is from quotes");
            console.log("7896541254 Checking children Now");
            product.configurable_children.forEach((child,childIndex)=>{
              console.log(" 7896541254 parent sku ",product.sku," child sku",child.sku , typeof product.sku , typeof child.sku,product.sku === child.sku);
              if (product.sku === child.sku)
              {
                console.log("7896541254 child found with sku ",child.sku);
                console.log(product.totals,"7896541254 child is ",child,"configurable options of this product are ",product.configurable_options.length,product.configurable_options );
                
                let porductOptions =[];
                let configurableItemOptions=[];
                product.options=[]
                if (product.totals){
                product.totals.options=[]
              }
              //  if (product.product_option.extension_attributes.custom_options)
              //  {
              //    product.product_option.extension_attributes.custom_options.configurable_item_options = []
              // }
              let configurableOptions = [];
              let selectedOptions = []
              product.type_id = 'configurable';
              product.shipping_grouptext = '0';
                product.configurable_options.forEach((option,index)=>{
                  console.log("7896541254 current option is ",option, option.label );
                  let attributeCode = option.attribute_code ;// size
                  let currentOptionValueSelected = parseInt(product[attributeCode]) ; // 49
                  let attributeId = option.attribute_id; // 152
                  let currentValue = 'Single'; //Single
                  let currentOption =  option.label //Size
                  option.values.forEach((value,valueIndex)=>{
                    console.log("7896541254 comparing  ",currentOptionValueSelected ,"with ", value.value_index,typeof currentOptionValueSelected,typeof value.value_index , typeof (parseInt(currentOptionValueSelected)) ,typeof (parseInt(value.value_index)), parseInt(currentOptionValueSelected) === parseInt(value.value_index));
                    if (parseInt(currentOptionValueSelected) === parseInt(value.value_index)){
                      console.log("7896541254 value matched",value.value_index);
                      currentValue = value.label // Single
                    }
                  })
                  console.log("789654125478 current values are \n",
                  "\n attributeCode",attributeCode,
                  "\n currentOptionValueSelected",currentOptionValueSelected,
                  "\n attributeId",attributeId,
                  "\n currentValue",currentValue,
                  "\n currentOption",currentOption
                  );
                  let productOptions ={};
                  let configurableItemOptions={};
                  productOptions = {
                    "value": currentValue,
                    "label": currentOption
                    }
                  configurableItemOptions = {
                    "option_id": attributeId.toString(),
                    "option_value": currentOptionValueSelected
                    }
                    
                    configurableOptions.push(configurableItemOptions)
                    console.log("789654125478 new objects ",configurableItemOptions ,configurableOptions ,productOptions);
                   product.product_option = {
                     "extension_attributes": {
                      "configurable_item_options": configurableOptions
                      //[
                      //    {
                      //      "option_id": "152",
                      //      "option_value": 52
                      //     }
                      //   ]
                      }
                   }
                  product.options.push(productOptions)
                  product.totals.options.push(productOptions)
                  // product.product_option.extension_attributes.custom_options.configurable_item_options.push(configurableItemOptions)
                  console.log("7896541254 now the product becomes ",typeof product.options ,typeof product.totals.options   ,'\n', JSON.stringify (product));
                  // if (product.configurable_options.lenght === index +1){
                  //   return 
                  // }
                })
              }
              else{
                console.log("7896541254 sku did not match");
              }
            })
          // }
          // else{
          //   console.log("7896541254 current product is NOT from quotes");
          // }
        }
      //   if(data.length-1 === dataIndex){
      // return data
      //   }
      });
      return data
    },
    checkIfAnyGroutAdhesive() {
      if (this.cartHasGroutAdhesive && this.cartHasGroutAdhesive.length > 0) {
        return false;
      }
      return true;
    },
    nonzeroProduct() {
      return this.productsInCart.filter((item) => {
        if(item.totals && item.totals.price_incl_tax ){
          return item.totals.price_incl_tax > 0;
        }else{
          console.log("1012 in non zero product this item has no totals",item.totals);

        }
      });
    },
    // productsHasAdhesivesAndGrouts () {
    //   if (!this.productsInCart || this.productsInCart.length === 0) {
    //     return false
    //   }
    //   console.log('this.ProductsHasAdhesiveGrouts before', this.ProductsHasAdhesiveGrouts, typeof this.ProductsHasAdhesiveGrouts)
    //   for (let key in this.ProductsHasAdhesiveGrouts) {
    //     console.log('this.ProductsHasAdhesiveGrouts key', key, this.ProductsHasAdhesiveGrouts.hasOwnProperty(key), this.ProductsHasAdhesiveGrouts[key].minSqmValue, this.ProductsHasAdhesiveGrouts[key].sqm, this.ProductsHasAdhesiveGrouts[key].minSqmValue <= this.ProductsHasAdhesiveGrouts[key].sqm)
    //     if (
    //       this.ProductsHasAdhesiveGrouts.hasOwnProperty(key) &&
    //       this.ProductsHasAdhesiveGrouts[key].minSqmValue &&
    //       this.ProductsHasAdhesiveGrouts[key].sqm &&
    //       this.ProductsHasAdhesiveGrouts[key].minSqmValue <= this.ProductsHasAdhesiveGrouts[key].sqm
    //     ) {
    //       console.log('inside if of for', this.ProductsHasAdhesiveGrouts)
    //       return true
    //     }
    //   }
    //   console.log('outside of for', this.ProductsHasAdhesiveGrouts)
    //   return false
    // }
  },
  async beforeMount() {
    await this.checkCart();
    console.log("1012 in before mount  ", this.productsInCart.length,JSON.stringify(this.productsInCart));
    if (this.productsInCart.length === 0) {
      console.log("1012 Cart is Empty ");
      this.$router.push(this.localizedRoute("/"));
    }
    this.$bus.$on("carPageUpdate", ({ productId }) => {
      console.log("1012 carPageUpdate grout adhesive is ",this.hasGroutAdhesives);
      if (productId in this.hasGroutAdhesives) {
        delete this.hasGroutAdhesives[productId];
        this.groutAdhesivesOnCart();
      }
    });
    this.$bus.$on("has-grout-adhesive", ({ recommendation, productId }) => {
      console.log("1012 has-grout-adhesive grout adhesive is ",this.hasGroutAdhesives);
      if (productId in this.hasGroutAdhesives) {
        this.hasGroutAdhesives[productId].recommendation = recommendation;
      } else {
        this.hasGroutAdhesives[productId] = { recommendation };
      }
      this.groutAdhesivesOnCart();
    });

    this.$bus.$on("quantity-updated", ({ sqm, productId }) => {
      console.log("1012 quantity-updated grout adhesive is ",this.ProductsHasAdhesiveGrouts);
      if (productId in this.ProductsHasAdhesiveGrouts) {
        this.ProductsHasAdhesiveGrouts[productId].sqm = sqm;
      } else {
        this.ProductsHasAdhesiveGrouts[productId] = { sqm };
      }
      this.productsHasAdhesivesAndGrouts();
    });

    this.$bus.$on("minSqmValue", ({ minSqmVal, productId, sqm }) => {
       console.log("1012 minSqmValue grout adhesive is ",this.ProductsHasAdhesiveGrouts);
      if (productId in this.ProductsHasAdhesiveGrouts) {
        this.ProductsHasAdhesiveGrouts[productId].minSqmValue = minSqmVal;
        this.ProductsHasAdhesiveGrouts[productId].sqm = sqm;
      } else {
        this.ProductsHasAdhesiveGrouts[productId] = {
          minSqmValue: minSqmVal,
          sqm,
        };
      }
      this.productsHasAdhesivesAndGrouts();
    });
    this.$bus.$on(
      "remove-grout-adhesive-section",
      ({ doesNotHasGroutAdhesiveSection, productId }) => {
        console.log("1012 minSqmValue grout adhesive is ",this.ProductsHasAdhesiveGrouts);
        if (productId in this.groutAdhesiveAddedOrNoThanks) {
          this.groutAdhesiveAddedOrNoThanks[productId].check =
            doesNotHasGroutAdhesiveSection;
        } else {
          this.groutAdhesiveAddedOrNoThanks[productId] = {
            check: doesNotHasGroutAdhesiveSection,
          };
        }
        this.groutAndAdhesiveAddedOrNoThanks();
      }
    );
    /* this.$bus.$on('cartItemQuantityUpdated', _.debounce(async (payload) => {
          await this.sendCartClick({ productsInCart: this.productsInCart, grandTotal: this.grandTotal });
        }, 600)) */
  },
  watch: {
    totals: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          console.log("1012 Totals being updated",newVal !== oldVal ,newVal , oldVal,this.getGrandTotal());
          // Re-fetch the GrandTotal
          this.getGrandTotal();
          // if (this.grandTotal) {
          //   this.sendCartClick({ productsInCart: this.productsInCart, grandTotal: this.grandTotal });
          // }
        }
      },
      deep: true,
    },
    productsInCart: function (oldVal) {
      this.discountAppliedCheck();
      if (oldVal.length === 0 && this.$route.name === "cart") {
        console.log("1012 products in cart are zero");
        this.$router.push("/");
      }
    },
  },
  metaInfo() {
    return {
      title: "",
      titleTemplate: "Shopping Cart",
    };
  },
  methods: {
       setPrice(data) {
      console.log("7778855 Current price is ",data);
      let price = data.special ?(data.original - data.special === 0) ? data.original : data.special : data.original
      console.log("778855 current calculated price is ",price);
      this.updatedPrice = price;
      this.calculatedProductPrice = data;
    },
    ...mapActions({
      applyCoupon: "cart/applyCoupon",
    }),
    updateScroll() {
      if (this.$route.name === "cart") {
        // document.getElementById('app').style.overflowX  = "unset";
         if (window.innerWidth > 768)
      {
        document.getElementById('app').style.overflowX  = "unset";
      }
        document.getElementById("viewport").style.overflow = "unset";
      }
    },
    checkCart() {
      // console.log(
      //   "789456 Checking cart ",
      //   this.$store.state.cart.cartItems.length
      // );
      if (this.$store.state.cart.cartItems.length === 0) {
        // this.notifyEmptyCart();
        console.log("1012 Cart is empty");
        this.$router.push(this.localizedRoute("/"));
        return true;
      } else {
        return true;
      }
    },
    getGrandTotal() {
      if (this.totals && this.totals.length > 0) {
        let grandTotal = this.totals.filter(
          (item) => item.code === "grand_total"
        );
        if (
          grandTotal &&
          grandTotal.length > 0 &&
          grandTotal[0] &&
          grandTotal[0].value
        ) {
          this.grandTotal = grandTotal[0].value;
          return grandTotal[0].value;
        }
      }
    },
    discountAppliedCheck() {
      if (this.totals && this.totals.length > 0) {
        let discountCheck = [];
        this.totals.forEach((item) => {
          discountCheck.push(item.code && item.code === "discount");
        });
        this.discountCheck =
          discountCheck.filter((check) => check === true).length > 0;
        return this.discountCheck;
      }
    },
    groutAndAdhesiveAddedOrNoThanks() {
      let booleans = [];
      for (let x in this.groutAdhesiveAddedOrNoThanks) {
        if (
          this.groutAdhesiveAddedOrNoThanks.hasOwnProperty(x) &&
          this.groutAdhesiveAddedOrNoThanks[x].check === false
        ) {
          booleans.push(this.groutAdhesiveAddedOrNoThanks[x].check);
        }
      }
      this.groutAddedOrNoThanks =
        booleans.filter((bool) => bool === false).length > 0;
      return this.groutAddedOrNoThanks;
    },
    productsHasAdhesivesAndGrouts() {
      let booleans = [];
      for (let key in this.ProductsHasAdhesiveGrouts) {
        if (
          this.ProductsHasAdhesiveGrouts.hasOwnProperty(key) &&
          this.ProductsHasAdhesiveGrouts[key].minSqmValue &&
          this.ProductsHasAdhesiveGrouts[key].sqm &&
          this.ProductsHasAdhesiveGrouts[key].minSqmValue <=
            this.ProductsHasAdhesiveGrouts[key].sqm
        ) {
          booleans.push(
            this.ProductsHasAdhesiveGrouts[key].minSqmValue <=
              this.ProductsHasAdhesiveGrouts[key].sqm
          );
        }
      }
      this.productsHasAdhesivesAndGroutCheck =
        booleans.filter((bool) => bool === true).length > 0;
      return this.productsHasAdhesivesAndGroutCheck;
    },
    groutAdhesivesOnCart() {
      let booleans = [];
      for (let key in this.hasGroutAdhesives) {
        if (
          this.hasGroutAdhesives.hasOwnProperty(key) &&
          this.hasGroutAdhesives[key].recommendation === true
        ) {
          booleans.push(this.hasGroutAdhesives[key].recommendation);
        }
      }
      this.productsIncludesTileProduct =
        booleans.filter((bool) => bool === true).length > 0;
      return this.productsIncludesTileProduct;
    },
    addAllTotalPrice(singleProductTotal) {
      for (let key in singleProductTotal) {
        if (singleProductTotal[key] && singleProductTotal.hasOwnProperty(key)) {
          this.allProductsTotals[key] = singleProductTotal[key];
        }
      }
      // console.log('this.allProductsTotals', this.allProductsTotals)
      this.totalPriceOfGroutAdhesive = this.allProductsTotalsValue();
      this.totalPriceToSendInCall = this.allProductsTotalsValue();
      if (this.totalPriceOfGroutAdhesive > 100) {
        this.discountOfTenPound = false;
        this.totalPriceOfGroutAdhesive -= this.discountPrice;
      } else if (this.totalPriceOfGroutAdhesive >= 50) {
        this.discountOfTenPound = true;
        this.totalPriceOfGroutAdhesive -= 10;
      }
    },
    allProductsTotalsValue() {
      let totals = 0;
      for (const key in this.allProductsTotals) {
        totals += this.allProductsTotals[key];
      }
      return totals;
    },
    async checkCartHasGroutAdhesiveAttachedToProduct() {
      await this.$store
        .dispatch("groutadhesive/groutAdhesiveGetRecommendations", {
          data: {
            quote_id: this.getCartToken,
          },
        })
        .then((resp) => {
          console.log("1012 in checkCartHasGroutAdhesiveAttachedToProduct ",resp);
          let response = JSON.parse(resp);
          if (response.success) {
            this.cartHasGroutAdhesive = response.data;
            this.noGroutAdhesives = false;
            this.$bus.$emit("notification-progress-stop");
          } else {
            this.cartHasGroutAdhesive = [];
            this.noGroutAdhesives = true;
            this.$bus.$emit("notification-progress-stop");
          }
        });
    },
    addDiscountCoupon() {
      this.addCouponPressed = true;
    },
    getProducts() {
      var pQuery = {};
      this.nonzeroProduct.forEach((p, i) => {
        let product = p.totals.price_incl_tax;
        product = product.toFixed(2);
        var tmp = {};
        tmp["L_PAYMENTREQUEST_0_NAME" + i] =
          p.name.replace(/[^a-zA-Z0-9- ]/g, "") + "&";
        // tmp['L_PAYMENTREQUEST_0_DESC' + i ] = p.short_description.replace(/[^a-zA-Z0-9- ]/g, '')+ '&';
        tmp["L_PAYMENTREQUEST_0_AMT" + i] = product + "&";
        tmp["L_PAYMENTREQUEST_0_NUMBER" + i] =
          p.sku.replace(/[^a-zA-Z0-9- ]/g, "") + "&";
        tmp["L_PAYMENTREQUEST_0_QTY" + i] = p.qty + "&";
        tmp["L_PAYMENTREQUEST_0_ITEMCATEGORY" + i] = "Physical" + "&";
        Object.assign(pQuery, tmp);
      });

      return pQuery;
    },
    expressCheckout() {
      var url = `${config.api.url}${config.paypalManual.endpoints.initiatePayment}`;
      let subtotal = this.totals[0].value;
      subtotal = subtotal.toFixed(2);
      let shippingAmt = this.totals[1].value;
      shippingAmt = shippingAmt.toFixed(2);
      let taxAmt = this.totals[2].value;
      taxAmt = taxAmt.toFixed(2);
      let grandTotal = this.totals[3].value;
      grandTotal = grandTotal.toFixed(2);
      let data = {
        totalCost: grandTotal,
        subtotal: subtotal,
        shipping: shippingAmt,
        tax: taxAmt,
        product: JSON.stringify(this.getProducts())
          .replace(/[^a-zA-Z_ : & 0-9 .]/g, "")
          .replace(/[:]/g, "="),
      };
      EventBus.$emit("notification-progress-start", i18n.t("Please wait..."));
      axios.post(url, data).then(({ data }) => {
        if (data) {
          let token = data.result.split("&TIMESTAMP");
          token = token[0];
          token = token.split("TOKEN=");
          token = token[1];
          token = decodeURIComponent(token);
          if (token.includes("EC")) {
            if (config.paypalManual.mode === "sandbox") {
              window.location.href = `https://${config.paypalManual.approvalUrl.sandbox}/cgi-bin/webscr?cmd=_express-checkout&token=${token}`;
            } else {
              window.location.href = `https://${config.paypalManual.approvalUrl.live}/cgi-bin/webscr?cmd=_express-checkout&token=${token}`;
            }
          }
        }
      });
    },
    clearCoupon() {
      this.$store.dispatch("cart/removeCoupon");
      this.addCouponPressed = false;
    },
    async setCoupon() {
      const couponApplied = await this.applyCoupon(this.couponCode);
      this.addCouponPressed = false;
      this.couponCode = "";
      if (!couponApplied) {
        this.$store.dispatch("notification/spawnNotification", {
          type: "warning",
          message: i18n.t(
            "You've entered an incorrect coupon code. Please try again."
          ),
          action1: { label: i18n.t("OK") },
        });
      }
    },
    updateAllGroutsAdhesives(groutAdhesive) {
      if (
        groutAdhesive &&
        groutAdhesive.length > 0 &&
        groutAdhesive[0] &&
        groutAdhesive[0].length > 0
      ) {
        groutAdhesive[0].map((item, key) => {
          if (this.allGroutsAdhesivesDataArray[item.product_id]) {
            this.allGroutsAdhesivesDataArray[item.product_id][item.recomm_id] =
              item;
          } else {
            this.allGroutsAdhesivesDataArray[item.product_id] = {
              [item.recomm_id]: { item },
            };
          }
        });
      }
    },
    mergeAdhesiveGrouts() {
      if (!_.isEmpty(this.allGroutsAdhesivesDataArray)) {
        this.allGroutsAdhesives.data = [];
        for (let key in this.allGroutsAdhesivesDataArray) {
          for (let subKey in this.allGroutsAdhesivesDataArray[key]) {
            this.allGroutsAdhesives.data.push(
              this.allGroutsAdhesivesDataArray[key][subKey]
            );
          }
        }
      }
    },
    async addAllGroutAdhesives() {
      let updatedObjectValues = {};
      this.mergeAdhesiveGrouts();
      this.allGroutsAdhesives.data.forEach((value, index) => {
        updatedObjectValues[index] = value;
      });
      updatedObjectValues.apply_discount = true;
      updatedObjectValues.total_recommendations = this.totalPriceToSendInCall;
      await this.$store
        .dispatch("groutadhesive/groutAdhesiveAddRecommendationsFunction", {
          data: updatedObjectValues,
        })
        .then((res) => {
          let response = JSON.parse(res);
          if (response.success) {
            this.addAllBtnClicked = true;
            this.pullCartSync();
            this.discountAppliedCheck();
          } else if (!response.success) {
            this.addAllBtnClicked = false;
          }
        });
    },
    async pullCartSync() {
      await this.$store.dispatch("cart/sync", {
        forceClientState: false,
        forceSync: true,
      });
      await this.$store.dispatch("cart/syncTotals", { forceServerSync: true });
      this.$forceUpdate();
    },
    // handleScroll (event) {
    //   var SAFETY_MARGIN = 20
    //   const FOOTER_HEIGHT = document.getElementsByClassName('footer-main')[0]
    //     .offsetHeight
    //   if (FOOTER_HEIGHT) {
    //     SAFETY_MARGIN = FOOTER_HEIGHT + 150
    //   } else {
    //     SAFETY_MARGIN = 600
    //   }
    //   const scrollY = window.scrollY
    //   const visible = window.innerHeight
    //   const pageHeight = document.documentElement.scrollHeight
    //   const bottomOfPage = scrollY + SAFETY_MARGIN >= pageHeight - visible
    //   var position = document.getElementsByClassName('footer-main')[0].scrollTop
    //   if (bottomOfPage === true) {
    //     let stickyDiv = document.getElementById('cart-summary-main')
    //     if (stickyDiv && stickyDiv.classList) {
    //       stickyDiv.classList.add('topSticky')
    //       stickyDiv.classList.remove('bottomSticky')
    //     }
    //   } else {
    //     let stickyDiv = document.getElementById('cart-summary-main')
    //     if (stickyDiv && stickyDiv.classList) {
    //       stickyDiv.classList.add('bottomSticky')
    //       stickyDiv.classList.remove('topSticky')
    //     }
    //   }
    // }
  },
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "Oblik";
  src: url("/assets/fonts/Oblik_Bold.otf");
}

.paypalBtn {
  cursor: pointer;
}

.maincart {
  background-color: #f2f2f2 !important;

  //  overflow: auto;
  @media (max-width: 767px) {
    background-color: #ffffff !important;
    margin-top: 10px;
  }

  .grandTotalMobile {
    display: none;
  }

  .buttonmobile {
    display: none;

    @media (max-width: 991px) {
      // display: flex;
    }
  }

  .row-cart-inner-main {
    padding-top: 60px;
    position: relative;
    @media (max-width: 767px) {
      margin-top: 37px;
    }
  }

  .topSticky {
    position: absolute !important;
    bottom: 56px !important;
    top: unset !important;
    @media (max-width: 767px) {
      margin-top: 37px;
    }
  }

  .cart-summary-main {
    width: 412px;
    // position: fixed;
    // // z-index: 1;
    // top: auto;
  }

  .cart-details {
    @media (max-width: 767px) {
      padding-left: 17px;

      padding-right: 17px;
    }

    .cartinfo {
      border: 1px solid #bfc3cb;
      width: 100%;
      background: #fff;
      padding: 15px 0 30px 0px;
      .headingtop {
        padding: 0;

        padding-left: 4px;

        h2 {
          padding-top: 10px;
          color: #29275b;
          font-family: "Oblik";

          font-size: 30px;
        }
      }

      .prod-ul {
        padding: 0px 20px 0 20px;
      }
    }
  }

  .rcodelink {
    padding-top: 12px;
    font-family: Arial;
  }

  .Voucher {
    font-family: Arial;
    color: #4c4845;
    font-size: 16px;
    border-bottom: 1px solid #4c4845;
    padding-left: 1px;
    // text-decoration: underline;
    // text-decoration-color: #4c4845;
  }

  .Total {
    @media (max-width: 767px) {
      padding-bottom: 20px;

      padding-left: 6px;

      padding-right: 6px;
    }

    .inner-total {
      width: 92%;

      float: right;

      background-color: #ffff;

      border: 1px solid #bfc3cb !important;

      @media (max-width: 767px) {
        width: 99%;
      }

      //.sub-title {

      //  border: 1px solid #bfc3cb !important;

      //}

      .subtotal {
        padding: 33px 14px;

        color: #4a4a4a;

        font-family: Arial;

        font-size: 14px !important;

        width: 50% !important;

        font-weight: bold;

        @media (max-width: 991px) and (min-width: 767px) {
          // padding: 33px 13px;

          padding: 0px;

          padding-top: 39px;

          padding-left: 13px;
        }
      }

      .sep-price {
        padding: 33px 16px;

        @media (max-width: 991px) and (min-width: 767px) {
          padding: 38px 16px;
        }

        @media (max-width: 767px) {
          padding: 33px 11px;
        }
      }

      .row {
        margin: 0;

        border-bottom: 1px solid #bfc3cb;

        border-top: none;
      }

      .total-price-label {
        color: #4a4a4a;

        font-family: Arial;

        font-size: 14px !important;

        width: 50% !important;

        font-weight: bold;

        padding-left: 13px;

        @media (max-width: 991px) and (min-width: 767px) {
          padding: 0px 0px 0px 13px;
        }
      }

      .total-price-value {
        padding-right: 16px;

        @media (max-width: 991px) and (min-width: 767px) {
          padding: 38px 16px;
        }

        @media (max-width: 991px) and (min-width: 767px) {
          padding: 34px 16px;
        }
      }
    }
  }

  .grandTotal {
    // border-top: 1px solid #bfc3cb;

    // height: 100px;

    .total-price-label {
      font-size: 14px;

      font-weight: bold;

      padding-left: 14px;

      padding: 33px 33px;

      color: #4a4a4a;
    }
  }

  .total-price-value {
    color: #29275b;

    float: right;

    font-size: 20px;

    font-weight: bold;
  }

  .check-btn-outer {
    // padding: 30px 20px 70px 20px;
    height: 70px;
    display: flex;
    align-items: center
  }

  .checkoutbutton {
    border-radius: 3px;

    /* width: 75.5%; */

    width: 100%;

    /* float: right; */

    height: 45px;

    background-color: #071a44 !important;

    color: #fff !important;

    font-family: Arial;

    /* margin-top: 10px; */

    line-height: 0.5;

    font-size: 14px;

    text-transform: uppercase;

    font-weight: bold;

    min-width: 150px;
    // margin-bottom: 15px;

    @media (max-width: 1200px) and (min-width: 992px) {
      font-size: 13px;
    }

    @media (max-width: 767px) {
      width: 99%;
    }

    @media (max-width: 330px) {
      min-width: 110px;
    }
  }

  @media (min-width: 767px) {
    .total-box-inner {
      position: sticky;
      top: 70px;
    }
  }

  .Gpay {
    width: 92%;

    float: right;

    display: -ms-flexbox;

    display: flex;

    flex-direction: column;

    -ms-flex-pack: center;

    justify-content: center;

    align-items: center;

    @media (max-width: 991px) and (min-width: 320px) {
      width: 100%;
    }

    h3 {
      font-family: Oblik;

      color: #4a4643;
    }

    img {
      width: 100%;

      max-width: 285px;

      padding-bottom: 22px;
    }
  }

  @media (max-width: 767px) {
    .prod-ul {
      padding: 0px 10px 0 14px !important;
    }
    .cart-details {
      padding-left: 7px;
      padding-right: 7px;
    }
    .headingtop {
      padding-top: 10px !important;
      padding-left: 1px !important;

      h2 {
        margin-top: 0;
        padding-top: 0;
      }

      // text-align: center;
    }

    .grandTotal .total-price-label {
      padding: 37px 30px;
    }

    .grandTotalMobile {
      background-color: #fff;

      display: inline-flex;

      border-bottom: 2px solid #dddddd;

      border-top: 2px solid #dddddd;

      margin-top: 20px;

      width: 100%;

      .total-price-top {
        color: #29275b !important;
      }

      .checkoutmobilebutton {
        padding-top: 28px;
      }
    }
  }
}

// @media (max-width: 991px) {

//   .buttonmobile {

//     display: flex;

//   }

// }

.maincart .Total .inner-total .sub-title:nth-child(n + 2) {
  display: none;
}

.maincart .Total .inner-total .sub-title:nth-child(n + 3) {
  display: none;
}

.sb-special-main {
  background-color: #d9ebe9;

  border: 2px solid #00a997;

  border-radius: 3px;

  padding: 14px 0;

  width: 100%;

  margin-top: 30px;
  margin-bottom: -30px;
}

.sb-special-off {
  justify-content: center;

  align-items: center;

  display: flex;
}

.sb-congragulation-text > p {
  color: #4d4d4d;

  font-family: Arial;

  font-weight: bold;

  font-size: 14px;

  margin: 1.5% 1.5% 1.5% 3%;

  line-height: 1.5em;
}

.sb-congragulation-text span {
  font-family: Arial;

  font-weight: bold;

  font-size: 14px;
}

.sb-add-all-button > button {
  background: #00a997 none repeat scroll 0 0;

  border: medium none;

  border-radius: 3px;

  color: #ffffff;

  cursor: pointer;

  font-family: Arial;

  font-size: 14px;

  font-weight: bold;

  height: 100%;

  max-width: 281px;

  min-height: 48px;

  width: 100%;
}

.codelink {
  a {
    text-decoration: none;

    color: #4c4845;

    cursor: pointer;

    font-family: Arial, Helvetica, sans-serif;

    border-bottom: 1px solid #4c4845;

    padding-bottom: 0;
  }
}

@media (min-width: 1200px) and (max-width: 1280px) {
  .maincart .cart-summary-main {
    width: 389px;
  }
}

@media (max-width: 1200px) and (min-width: 992px) {
    .total-box-inner .V-12-retail-Finance.cart-V-12{
   margin-left: 24px !important;
    width: 88%;
}
  .sb-congragulation-text > p {
    font-size: 13px;
  }

  .maincart .cart-summary-main {
    width: 310px;
  }

  .sb-add-all-button > button {
    font-size: 14px;

    max-width: 250px;

    width: 90%;
  }

  .maincart {
    .cart-details {
      .cartinfo {
        .prod-ul {
          padding: 0px 8px 0 8px;
        }
      }
    }
  }

  .maincart .base-input-number__input {
    width: 40px;

    height: 40px;

    font-size: 16px;
  }
}

@media (max-width: 991px) and (min-width: 320px) {
  .Total {
    padding: 15px 0 0 0;
  }

  .maincart .Total .inner-total {
    float: unset;

    width: 100%;
  }

  .maincart .checkoutbutton {
    width: 100%;
  }

  .cart-details {
    padding-left: 0;

    padding-right: 0;
  }

  .sb-special-main {
    padding-left: 0;

    padding-right: 0;

    .row {
      margin: 0;
    }
  }
  .maincart .cart-summary-main {
    width: 100%;
    position: relative;
    z-index: 1;
    top: 0;
  }
  .maincart .topSticky {
    position: relative !important;
    bottom: 40px !important;
    top: unset !important;
  }
}

@media (max-width: 767px) {
  .cartinfo {
    .headingtop {
      h2 {
        font-size: 4.266vw !important;
      }
    }
  }
  // .sb-special-main {
  //   padding-bottom: 0;
  //   margin-top: 0;
  //   padding-top: 7px;
  // }
  // .sb-add-all-button {
  //   padding: 0;
  //   // padding-top: 15px;
  //   padding-bottom: 8px;
  //   padding-right: 7px;
  // }
  // .sb-add-all-button > button {
  //   border-radius: 0;
  //   max-width: 95px;
  //   width: 100%;
  //   font-size: 1.766vw;
  //   min-height: 22px;
  //   height: 100%;
  // }
  .maincart .base-input-number__input {
    font-size: 2.853vw;
  }
  .sb-congragulation-text {
    p {
      font-size: 2.3vw;
      margin: 10px 0px;
    }

    span {
      font-size: 1.866vw;
    }
  }
  // .limited_offer_p2{
  //   font-size: 1.866vw;
  //   span{
  //     font-size: 1.866vw;
  //   }
  // }
}

@media (max-width: 767px) {
  .sb-special-off {
    padding-left: 12px;
    padding-right: 0;

    img {
      // padding-left: 10px;
      width: 5.625vw;
    }
  }
  .sb-special-main {
    padding-bottom: 0;
    margin-top: 0;
    padding-top: 0;
  }
  .sb-congragulation-text {
    // padding-left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 0 0 10px;
  }
  .limited_offer_p2 {
    margin-left: 0;
  }

  .sb-add-all-button {
    padding-bottom: 4px;
    padding-top: 4px;
    // padding-top: 15px;
    // padding-bottom: 8px;
    // padding-right: 7px;
    // padding-top: 8px;
  }

  .sb-add-all-button > button {
    width: 100%;
    font-size: 1.766vw;
    min-height: 22px;
    height: 100%;
  }
  .maincart .rcodelink {
    padding-bottom: 0px;
  }
}

@media screen and (min-width: 320px) and (max-width: 400px) {
  .sb-add-all-button {
    padding-bottom: 4px;
    padding-top: 1px;
  }
  .sb-add-all-button > button {
    margin-top: 1px;
    font-size: 1.66vw;
  }
}

@media (max-width: 350px) {
  .maincart .cart-details .cartinfo .prod-ul {
    padding: 0 5px 0 5px;
  }

  .maincart .Total {
    padding-bottom: 20px;
    padding-top: 10px;
  }
}

.row.sub-title.sub-title-discount {
  display: flex !important;
}

.row.sub-title.sub-title-shipping {
  display: flex !important;
}

@media screen and (max-width: 991px) {
  .uz_mb_top_checkout {
    display: block;
    background-color: #fff;
    // border-bottom: 2px solid #dddddd;
    // border-top: 2px solid #dddddd;
    display: inline-flex !important;
    margin-top: 8px;
    width: 102% !important;
  }
  .uz_top_grand_price {
    color: #29275b;
    font-family: Arial;
    font-size: 20px;
    font-weight: bold;
  }
  .grid12-6.uz-top-checkout-left {
    float: left;
    padding: 0;
    width: 48% !important;
  }
  .uz_top_grandtotal {
    color: #4a4a4a;
    font-family: Arial;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 6px;
  }
  .uz_top_grand_price {
    color: #29275b;
    font-family: Arial;
    font-size: 20px;
    font-weight: bold;
    margin-top: 0px;
  }
  .grid12-12.price {
    white-space: nowrap !important;
  }
  .sb-button.button.btn-proceed-checkout.override-btn-checkout.btn-checkout {
    margin-top: 10px;
    margin-left: 0 !important;
    width: 100%;
    text-transform: uppercase;
    padding: 15px;
    background-color: #29275b !important;
  }
  .sb-button .sb-checkout-cart {
    background-color: #29275b !important;
    color: #fff !important;
    font-family: Arial;
    font-weight: bold;
    height: 45px;
    /* line-height: 52px!important; */
    padding: 0;
    /* background: url(images/checkout-cart-image-button-gary.png)no-repeat left 5px center,#f4c55d!important; */
    border-radius: 3px;
    font-size: 14px;
    /* font-weight: bold; */
    width: 100%;
  }
  .sb-button.button.btn-proceed-checkout.override-btn-checkout.btn-checkout
    > span {
    border-radius: 3px;
    width: 100%;
  }
  .uz-top-checkout-right {
    padding-right: 0px;
  }
  .uz-proceed-checkout {
    padding-bottom: 10px;
  }
}

.uz_mb_top_checkout {
  display: none;
}

@media screen and (min-width: 320px) and (max-width: 390px) {
  .sb-button.button.btn-proceed-checkout.override-btn-checkout.btn-checkout {
    min-width: 198px !important;
  }
  .padding-right {
    padding-right: 0px;
  }
}

@media screen and (min-width: 376px) and (max-width: 500px) {
  .padding-right {
    padding-right: 0px;
  }
}
.hidden-xs {
    display: inherit !important;
}
.Discount-Voucher {
    border: 2px solid #071a44;
    border-radius: 3px;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    min-height: auto;
    font-family: Arial;
    font-weight: bold;
    text-transform: uppercase;
    background: #071a44;
}
.total-box-inner .V-12-retail-Finance.cart-V-12 {
    position: absolute;
    bottom: 0;
    margin-left: 32px;
    margin-bottom: 10px;
    background: #ffff;
     @media (max-width: 991px){
    margin-left: 0;
    width: 100%;
     }
       @media (max-width: 767px){
    width: 97% !important;
    margin-left: 5px !important;
     }
       @media (max-width: 480px){
    width: 94% !important;
     }
}
.total-box-inner {
      height: 480px;
       }
 @media (max-width: 1201px){
   .total-box-inner {
      // height: 580px;
       @media (max-width: 991px){
         height: 510px !important;
       }
    }
 }
</style>

