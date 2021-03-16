<template>
<div class="clearance">
  <div class="modal-content">
    <div class="scroll">
      <button type="button" class="close">
        <i class="material-icons" @click="hidemodal">close</i>
        </button>
      <!-- <span class="close" @click="hidemodal">&times;</span> -->
      <div class="col2">
        <div class="header">
          <h1>Sorry, your order quantity is more than available stock!</h1>
          <div class="row m0">
            <div class="col-md-6">
              <h2 v-if="product.qty_per_sqm">
                Your current order: <span class="current">{{currentUserTiles}}m<sup>2</sup></span>
              </h2>
              <h2 v-else>
                Your current order: <span class="current">{{product.qty}}</span>
              </h2>
            </div>
            <div class="col-md-6">
              <h2 v-if="product.qty_per_sqm">
                Available stock: <span class="available">{{calculateSqmQuantity()}}m<sup>2</sup></span>
              </h2>
              <h2 v-else>
                Available stock: <span class="available">{{product.stock.qty}}</span>
              </h2>
            </div>
          </div>
          <div class="row m0">
            <div class="col-md-12">
              <p class="clearancep1">
                Unfortunately you are trying to order more of this product than
                we have in stock.
              </p>
            </div>
            <div class="col-md-12">
              <p class="clearancep2">
                Please adjust your order and try again or browse a similar
                option below.
              </p>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <no-ssr>
            <ClearanceCarousel :similar-products="similarProducts"/>
          </no-ssr>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
// import ProductImage from "theme/components/core/ProductImage";
import Product from "theme/components/core/blocks/Microcart/Product";
import { currentStoreView } from "@vue-storefront/core/lib/multistore";
import Modal from "theme/components/core/Modal";
import config from "config";
import NoSSR from "vue-no-ssr";
import ClearanceCarousel from "theme/components/ClearanceCarousel";
export default {
  name: "ClearanceModal",
  components: {
    Modal,
    ClearanceCarousel,
    "no-ssr": NoSSR,
  },
    props: {
    similarProducts: {
      type: Object,
      required: false,
      default: null
    },
    currentUserTiles: {
      type: String,
      required: false,
      default: null
    },
    product: {
      type: Object,
      required: false,
      default: null
    }
  },
  data(){
    return{
      cartItems:0,
    }
  },
  methods: {
    hidemodal() {
      this.$bus.$emit("modal-hide", "modal-clearancemodal");
    },
    calculateSqmQuantity () {
      let Sqm = this.product.stock.qty / this.product.qty_per_sqm;
      return Sqm.toFixed(2)
    }
  },
  computed: {
    storeView() {
      return currentStoreView();
    },
  },
  mounted(){
    this.$bus.$on('sendvalueToCart', (value)=>{
      this.cartItems = value;
    })
  },
};
</script>
<style lang="scss" scoped>
@font-face {
  font-family: "Oblik";
  src: url("/assets/fonts/Oblik_Bold.otf");
}
.image-icon {
  width: 100%;
  margin: 36px;
}
.modal {
  position: fixed; /* Stay in place */
  z-index: 999; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
}

.modal-backdrop {
  position: fixed; /* Stay in place */
  z-index: 999; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}
.modal-content {
  background-color: #ffffff;
  margin: 0;
  padding: 0px 0px;
  border-radius: 15px;
  margin-bottom: 40px;
}
.close {
    color: #fefefe;
    float: right;
    top: -10px;
    right: -14px;
    position: absolute;
    font-size: 36px;
    height: 44px;
    width: 44px;
    border: none;
    font-weight: bold;
    border-radius: 24px;
    background-color: #ec0e8b !important;
  @media screen and (max-width: 767px) {
      font-size: 8px;
      right: -10px;
      width: 35px;
      height: 35px;
      top: -9px;
    i{
      margin-left: 0px;
      font-size: 20px;
      margin-bottom: 0px;
      display: block;

    }
  }
}

.close:hover,
.close:focus {
  text-decoration: none;
  cursor: pointer;
}

.col2 h1 {
  font-size: 24px;
  font-family: "Oblik";
  font-weight: bold;
  color: #ffffff;
  background-color: #29275b;
  /* height: 94px; */
  padding: 20px 0px;
  margin: 0;
  text-align: center;
  border-top-right-radius: 13px;
  border-top-left-radius: 13px;
}
.col2 h2 {
  font-size: 22px;
  font-family: "Oblik";
  font-weight: bold;
  padding: 21px 0px;
  margin: 0;
  text-align: center;
  color: #413f3f;
}
@media screen and (max-width: 425px) {
  .col2 .clearancep1{
    font-size: 11px !important;
    padding: 21px 34px 0px 26px !important;
    text-align: left !important;
  }
  .col2 .clearancep2{
    font-size: 11px !important;
    padding-top: 13px !important;
    padding: 0px 34px 0px 26px !important;
    text-align: left !important;
  }
  .col2 h2{
    padding: 12px 0px 0px 0px !important;
    font-size: 16px !important;
  }
  .current ,.available{
    font-size: 16px !important;
  }
}
@media screen and (min-width: 426px) and (max-width: 767px){
  .col2 h2{
    padding: 5px 0px 10px !important;
  }
}
@media screen and (max-width: 767px) {
  .col2 h1 {
    padding: 21px 22px !important;
    font-size: 19px !important;
  }
  .col2 .clearancep1{
    text-align: left !important;
    padding-left: 24px;
    padding-right: 34px;
  }
  .col2 .clearancep2{
    text-align: left !important;
    padding-left: 34px;
    padding-right: 34px;
  }
}
.current {
  font-family: "Arial";
  font-weight: bold;
  color: #e7008a;
  font-size: 22px;
}
.available {
  font-family: "Arial";
  font-weight: bold;
  color: #e7008a;
  font-size: 22px;
}
.col2 .clearancep1 {
  font-family: "Arial";
  font-size: 16px;
  color: #54575b;
  margin: 0px;
  margin-bottom: 19px;
  text-align: center;
}
.col2 .clearancep2 {
  font-family: "Arial";
  font-size: 16px;
  color: #54575b;
  margin: 0px;
  margin-bottom: 19px;
  text-align: center;
}
.modal-body {
  padding: 0px 37px;
}
@media screen and (max-width: 500px) {
  .modal-body {
    padding: 0px 24px;
}
}
@media(max-width: 357px){
  // .modal-content{
  //   transform: translate(-50%, -49%);
  // }
  .modal-body {
    padding: 0px 9px;
}
}
</style>
