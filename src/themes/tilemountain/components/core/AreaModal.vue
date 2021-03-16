<template>
  <div class="surface" id="surface">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">
          <i class="fa fa-calculator"></i> Tile Calculator
        </h4>
        <button type="button" class="close" @click="closeAreaModal">
          <img src="/assets/close.png" alt="close" class="closeicon" />
        </button>
      </div>
      <div class="modal-body">
        <div class="body-head row">
          <div class="col-md-4 col-xs-4">
            <img :src="productImage" :alt="productName" class="image-icon" />
          </div>
          <div class="col-md-8 col-xs-8">
            <p>
              You Will need:
              <strong>{{getTotalSqm()}}</strong> sqm of
              <br />
              <strong>{{ productName }}</strong> for your area.
            </p>
          </div>
        </div>
        <div v-if="product.qty_per_sqm" class="col-md-12 dataBlock sfddf">
          <div class="area-modal-popup">
            <waste-percent-toggle :product="product" @click="$emit('addWasted',$event)"></waste-percent-toggle>
          </div>
        </div>
        <div class="price-div">
          <product-price-total
            v-if="getCurrentProduct.type_id !== 'grouped'"
            :product="getCurrentProduct"
            :custom-options="getCurrentCustomOptions"
            :option="true"
          />
          <span>Total Inc VAT</span>
        </div>
        <add-to-cart
          :product="product"
          :name="`Add to Basket`"
          class="addToBasketBtn"
          v-on:closeAreaModal="closeAreaModal"
        />
      </div>
      <div class="bottom-link">
        <!-- <a href="#" class="dimensions">save dimensions to project</a> -->
      </div>
    </div>
    <div class="modal-footer"></div>

    <div class="clearfix"></div>
  </div>
</template>

<script>
import AddToCart from "theme/components/core/AddToCart.vue";
import ProductPriceTotal from "theme/components/core/blocks/custom/ProductPriceTotal.vue";
import { getThumbnailPath } from "@vue-storefront/core/helpers";
import { mapGetters } from "vuex";
import WastePercentToggle from "theme/components/core/WastePercentToggle";

export default {
  name: "AreaModal",
  components: {
    WastePercentToggle,
    AddToCart,
    ProductPriceTotal,
  },
  data() {
    return {
      productName: "",
      productImage: "",
      name,
    };
  },
  computed: {
    ...mapGetters({
      getCurrentProduct: "product/getCurrentProduct",
      getCurrentCustomOptions: "product/getCurrentCustomOptions",
    }),
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    totalSurface: {
      type: Number,
      required: true,
    },
    getPerSqmPrice: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.getProductDetails(this.product);
  },
  methods: {
    getProductDetails(product) {
      this.productName = this.product.name;
      this.productImage = getThumbnailPath(this.product.image);
    },
    totalSqmPrice() {
      let pricePerSqm;
      pricePerSqm = this.getPerSqmPrice * this.totalSurface;
      return pricePerSqm;
    },
    getTotalSqm() {
      //  console.log(this.product);

      return this.totalSurface.toFixed(2);
    },

    closeAreaModal() {
      this.$bus.$emit("modal-show", "modal-area");
      this.$emit("areaModalcheck", 0);
    },
    getOptions() {
      return true;
    },
  },
};
</script>

<style scoped>
.price {
  @media (max-width: 767px) {
    color: $color-primary;
  }
  /*Custom*/
  font-weight: normal;
  text-align: left;
}
.small.perTile {
  font-size: 16px;
  padding-left: 10px;
}
.price-div h3 {
  margin: 0;
  line-height: 18px;
}
.price-div span {
  margin-left: 13px;
  font-size: 13px;
  margin-top: 7px;
}
.price-div {
  color: #484340;
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
  font-weight: 700;
  justify-content: center;
  display: flex;
  margin-bottom: 0px;
}
.image-icon {
  width: 100%;
  margin-top: 5px;
}
.bottom-link {
  text-align: right;
  margin: 12px 5px 6px 246px;
  display: -webkit-inline-box;
}
@media screen and (max-width: 373px) and (min-width: 320px) {
  .bottom-link {
    margin: 12px 5px 6px 188px;
  }
}
a.dimensions {
  text-decoration: underline;
  bottom: 3px;
  font-size: 10px;
}
.waste-div {
  padding: 0 30px;
}
.switch {
  position: relative;
  display: inline-block;
  /* width: 62px; */
  height: 22px;
  margin: 7px 49px 6px -9px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 3px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  width: 74px;
  height: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 15px;
  width: 15px;
  left: 4px;
  bottom: 2px;
  background-color: black;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border: 3px solid #d6de29;
}
input:checked + .slider:before {
  -webkit-transform: translateX(40px);
  -ms-transform: translateX(40px);
  transform: translateX(40px);
  border: 3px solid #fff;
}

input:checked + .slider {
  background-color: black;
  /* border: 3px solid #fff; */
}

input:focus + .slider {
  box-shadow: 0 0 1px #434343;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(46px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
.body-head.row {
  margin: 25px 0;
}
button.addToBasketBtn {
  background: #d6de29;
  padding: 12px;
  width: 60%;
  font-size: 12pt;
  font-weight: bold;
  border: 0;
  color: #434343;
  display: initial;
  min-width: 60% !important;
}
.modal-body p {
  margin: 0px;
  line-height: 21px;
  font-size: 13px;
  text-align: left;
}
.reorderingp {
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
}
.control {
  width: auto;
  float: left;
}
.total-area {
  margin: 11%;
}
.total-area {
  font-family: "Arial";
}

a.dimensions {
  font-family: "Arial";
}
button.calculate-area {
  width: 90%;
  background: #d6de29;
  padding: 12px;
  margin: 5px;
  font-size: 16px;
  color: #434343;
  font-weight: bold;
  /* font-family: "Playfair Display", serif; */
  font-family: "Arial";
  border: 0;
}
button.add-surface {
  /* font-family: "Playfair Display", serif; */
  font-family: "Arial";
  background: #434343;
  color: white;
  font-weight: bold;
  width: 90%;
  font-size: 16px;
  margin-top: 10px;
  padding: 6px;
  border: 0;
}
.addother-surface {
  padding: 20px 0;
  cursor: pointer;
}
.addother-surface .plus {
  float: left;
}
.addother-surface .plus .fa {
  /* color: #d5de29; */
  font-size: 18px;
  margin-top: 3px;
}
.addother-surface p {
  font-size: 16px;
  margin-left: 10px;
  text-align: initial;
  display: block;
}
.addother-surface .plus {
  background: #d6de29;
  height: 22px;
  width: 22px;
  border-radius: 50%;
}
.fa-plus:before {
  content: "\f067";
}

input#meters {
  height: 10px;
}
.modal {
  background-color: rgba(0, 0, 0, 0.7);
}
.modal-header {
  background: #434343;
  color: white;
  font-size: 24px;
}
h4.modal-title {
  margin: 0;
  padding: 10px 0;
  text-align: left;
  margin-left: 15px;
}
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 0; /* 15% from the top and centered */
  padding: 0px 0px;
  border: 2px solid #d6de29;
  /* width: 80%;  */
}

button.close {
  background: #434343;
}
/* The Close Button */
.close {
  color: #fefefe;
  float: right;
  top: 12px;
  right: 14px;
  position: absolute;
  font-size: 16px;
  font-weight: bold;
  border: none;
}

.close:hover,
.close:focus {
  /* color: white; */
  text-decoration: none;
  cursor: pointer;
}

.area-modal-popup {
}
/* @media only screen and (max-width: 767px) {
  .calculateTxt a {
    border: unset;
  }
  button.addToBasketBtn {
    background: #d6de29;
    padding: 8px !important;
  }
  .close[data-v-cde4c774] {
    top: 16px;
    right: 12px;
  }
  .modal-body p {
    line-height: 17px;
  }
}
i.fa.fa-calculator {
  margin-right: 5px;
} */
@media (max-width: 767px) {
  .tileWidth {
    height: 31px;
    border: 1px solid #ececec!important;
    background: white;
    width: 75px !important;
    text-align: center;
    display: block;
    margin-top: 9px !important;
    line-height: 0px !important;
    border-radius: 5px;
}
span.mutiply {
    float: left;
    padding-top: 32px;
    padding-left: 20px !important;
    padding-right: 20px !important;
    font-size: 17px;
    color: #48403d;
}
.tileHeight {
    height: 31px;
    border: 1px solid #ececec!important;
    background: white;
    width: 75px !important;
    text-align: center;
    display: block;
    margin-top: 9px !important;
    line-height: 0px !important;
    border-radius: 5px;
}
.third-label {
    padding-left: 30px !important;
        float: left;
    margin: 0 0 0 10px;
    position: relative;
    width: 15%;
}
.Totalarea {
    height: 31px;
    border: 1px solid #ececec!important;
    background: white;
    width: 100px !important;
    text-align: center;
    display: block;
    margin-top: 9px !important;
    line-height: 0px !important;
    border-radius: 5px;
}
}
</style>
