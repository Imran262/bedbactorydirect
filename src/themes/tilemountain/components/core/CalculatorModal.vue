<template>
  <div class="main-Calculator">
    <div class="modal-content mobile-modal" id="calculatorModal">
      <div class="modal-header">
        <h4 class="modal-title">
          Calculate Area
        </h4>
        <button type="button" class="close" @click="closeModal">
          <i class="material-icons">close</i>
        </button>
      </div>
      <div class="modal-body">
        <p>
          Enter your measurements
          <!-- <strong>{{ productName }}</strong> are required for your area. -->
        </p>
        <div class="calculator">
          <surface
            v-for="surface in surfaces"
            :key="surface.surfaceKey"
            :surface-key="surface.surfaceKey"
            @addAreaToSurface="updateTotalArea"
            @removeAreaFromSurface="removefromTotalArea"
          />
          <!-- <div class="row">
            <div class="col-md-6 col-xs-12 col-sm-12">
              <div class="total-area">
                Total Area:
                <span>{{ surfacesArea }} sqm</span>
              </div>
            </div>
          </div>-->
          <div class="row modal-buttons m0">
            <div class="col-md-6 col-xs-6 totalarea">
              <p id="window-Floor">Additional Wall / Floor</p>
              <i
                class="fa fa-plus one"
                aria-hidden="true"
                @click="addSurface"
              ></i>
            </div>
            <div class="col-md-6 col-xs-6 btnadd">
              <div class="total-area wallarea">
                <p class="mobile_responsive">Total =</p>
                <span>
                  {{ surfacesArea.toFixed(2) }}
                  <!-- <sup>2</sup> -->
                </span>
              </div>
            </div>
            <!-- <div class="row">
            <div class="col-md-6 col-xs-12">
              <button
                class="calculate-area"
                @click="showAreaModal"
                :disabled="totalSurfaceSqm === 0"
              >Calculate Area</button>
            </div>
          </div> -->
          </div>
          <div class="factorobstacles">
            <div class="col-md-6 col-xs-12 obstacleshow flex">
              <p id="window-Door">Subtract Window / Door</p>
              <i
                class="fa fa-angle-right icons"
                id="arrowbig"
                @click="shownObstacles"
              ></i>
              <i
                class="fa fa-angle-down icons down-arrow"
                id="arrowsmall"
                @click="hideDownArrow"
              ></i>
            </div>
            <div class="obstacles-count" v-if="obstacleShow">
              <obsticle
                v-for="obsticle in obstacles"
                :key="obsticle.obstacleKey"
                :obstacle-key="obsticle.obstacleKey"
                @addAreaToObstacle="updateTotalObsticle"
                @removeAreaFromObsticle="removefromTotalAreaObsticle"
              />
              <div class="row modal-buttons m0">
                <div class="col-md-6 col-xs-7 totalarea total-factor">
                  <p id="Add-window-Door">Additional Window / Door</p>
                  <i
                    class="fa fa-plus two"
                    aria-hidden="true"
                    @click="addNewObsticle"
                  ></i>
                </div>
                <div class="col-md-6 col-xs-5 btnadd">
                  <div class="total-area">
                    <p class="mobile_responsive" id="wall">Total =</p>
                    <span>
                      {{ obstaclesTotal.toFixed(2) }}
                      <!-- <sup>2</sup> -->
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="area col-md-12 col-xs-12 flex btn">
            <div class="price-div col-md-6 col-xs-6">
              <span class="total-price-span">Total Price</span>
              <div class="finalPrices flex">
                <div class="row">
                  <span
                    class="TotalSqmPrice"
                    v-if="
                      !calculatedPrice.original &&
                        !calculatedPrice.special &&
                        !calculatedPrice.default
                    "
                  >£0.0
                    <p>inc VAT</p>
                  </span>
                  <span
                    class="TotalSqmPrice"
                    v-else-if="calculatedPrice.original"
                  >£{{ calculatedPrice.original.toFixed(2) }}
                    <p>inc VAT</p></span
                  >
                  <span
                    class="TotalSqmPrice"
                    v-else-if="calculatedPrice.special"
                  >
                    £{{ calculatedPrice.special.toFixed(2) }}
                    <p>inc VAT</p>
                  </span>
                  <span class="TotalSqmPrice" v-else
                  >£{{ calculatedPrice.default.toFixed(2) }}
                    <p>inc VAT</p></span
                  >
                </div>
              </div>
              <!-- <span>inc VAT</span> -->
              <product-price-total
                v-if="getCurrentProduct.type_id !== 'grouped'"
                :product="getCurrentProduct"
                :custom-options="getCurrentCustomOptions"
                :option="true"
                :totalIncVat="totalIncVat"
                :calCheck="false"
              />
            </div>
            <div class="basket-button col-md-6 col-xs-6">
              <add-to-cart
                :product="product"
                :name="`Add to Basket`"
                class="addToBasketBtn"
                @click="closeModal"
              />
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
    <!-- <area-modal
      v-if="areaModalcheck == 1"
      :product="product"
      :totalSurface="totalSurfaceSqm"
      :getPerSqmPrice="getPerSqmPrice"
      v-on:areaModalcheck="closeModal"
      v-on:addWasted="$emit('addWasted',$event)"
    /> -->
  </div>
</template>

<script>
import Surface from 'theme/components/core/Surface';
import AreaModal from 'theme/components/core/AreaModal';
import Obsticle from 'theme/components/core/Obsticle';
import Modal from 'theme/components/core/Modal.vue';
import AddToCart from 'theme/components/core/AddToCart.vue';
import ProductPriceTotal from 'theme/components/core/blocks/custom/ProductPriceTotal.vue';
import { mapGetters } from 'vuex';
import { log } from 'util';

export default {
  name: 'calculatorModal',
  components: {
    Surface,
    AreaModal,
    Obsticle,
    Modal,
    AddToCart,
    ProductPriceTotal
  },
  data () {
    return {
      width: 0,
      height: 0,
      areaModalcheck: 0,
      totalSurfaceSqm: 0,
      totalIncVat: 0,
      bothAreas: 0,
      totalSurfaceArea: 0,
      totalCalculatedArea: 0,
      calculateAreaSqm: 0,
      totalObstacleArea: 0,
      obstacleShow: false,
      calculatedPrice: {
        special: 0,
        original: 0,
        default: 0
      },
      surfaces: [
        {
          surfaceKey: 0,
          surfaceTotal: 0
        }
      ],
      obstacles: [
        {
          obstacleKey: 0,
          obstacleTotal: 0
        }
      ]
    };
  },
  props: {
    product: {
      required: true,
      type: Object
    },
    getPerSqmPrice: {
      required: true,
      type: String
    }
  },
  mounted () {
    this.getProductDetails(this.product);
    this.$bus.$on('calculatedFinalPrice', (data) => {
      this.calculatedPrice = data;
    });
  },
  methods: {
    totalsOfSurfacesAndObstacles2 () {
      this.calculateAreaSqm = this.surfacesArea + this.obstaclesTotal;
      return this.surfacesArea + this.obstaclesTotal;
    },
    calculateTotalpriceTotal (data) {
      // this.calculatedPrice =data.original + this.totalsOfSurfacesAndObstacles;
      this.calculatedPrice = data;
    },
    shownObstacles () {
      this.obstacleShow = true;
      let greaterThanArrow = document.getElementById('arrowbig');
      greaterThanArrow.style.display = 'none';
      let dowArrow = document.getElementById('arrowsmall');
      dowArrow.style.display = 'block';
    },
    hideDownArrow () {
      this.obstacleShow = false;
      let greaterThanArrow = document.getElementById('arrowbig');
      greaterThanArrow.style.display = 'block';
      let dowArrow = document.getElementById('arrowsmall');
      dowArrow.style.display = 'none';
    },
    getProductDetails (product) {
      this.productName = this.product.name;
    },
    addSurface (event) {
      this.surfaces.push({
        surfaceKey: this.surfaces.length,
        surfaceTotal: 0
      });
    },
    addNewObsticle (event) {
      this.obstacles.push({
        obstacleKey: this.obstacles.length,
        obstacleTotal: 0
      });
    },
    updateTotalArea (updatedTotal) {
      this.surfaces[updatedTotal.surface]['surfaceTotal'] = updatedTotal.area;
      this.calculateTotalArea();
    },
    removefromTotalArea (surfaceKey) {
      this.surfaces.forEach((surface, key) => {
        if (surface.surfaceKey == surfaceKey) {
          surface.surfaceKey = null;
          surface.surfaceTotal = 0;
        }
      });
      this.calculateTotalArea();
    },
    calculateTotalArea () {
      let calculatedTotalArea = this.surfacesArea - this.obstaclesTotal
      this.totalSurfaceSqm = (calculatedTotalArea >= 0) ? calculatedTotalArea : 0;
      this.$emit('totalSqmUpdate', this.totalSurfaceSqm);
    },
    updateTotalObsticle (updatedTotal) {
      this.obstacles[updatedTotal.obstacle]['obstacleTotal'] =
        updatedTotal.area;
      let calculatedTotalArea = this.surfacesArea - this.obstaclesTotal
      this.totalSurfaceSqm = (calculatedTotalArea >= 0) ? calculatedTotalArea : 0;
      this.$emit('totalSqmUpdate', this.totalSurfaceSqm);
    },
    removefromTotalAreaObsticle (obstacleKey) {
      this.obstacles.forEach((obsticle, key) => {
        if (obsticle.obstacleKey == obstacleKey) {
          obsticle.obstacleKey = null;
          obsticle.obstacleTotal = 0;
        }
      });
    },
    showAreaModal () {
      // document.getElementById("calculatorModal").classList.add("hidden");
      // this.$bus.$emit("modal-show", "modal-area");
      this.areaModalcheck = 1;
      this.$emit('totalSqmUpdate', this.totalSurfaceSqm);
    },
    closeModal () {
      this.$bus.$emit('modal-hide', 'modal-calculator');
    }
  },
  computed: {
    ...mapGetters({
      getCurrentProduct: 'product/getCurrentProduct',
      getCurrentCustomOptions: 'product/getCurrentCustomOptions'
    }),
    calculateTotalprice () {
      return this.product.originalPriceInclTax * this.totalsOfSurfacesAndObstacles;
    },
    totalsOfSurfacesAndObstacles () {
      this.calculateAreaSqm = this.surfacesArea - this.obstaclesTotal;
      return this.surfacesArea - this.obstaclesTotal;
    },

    surfacesArea () {
      let totalCalculatedArea = 0;
      this.surfaces.forEach((surface, key) => {
        totalCalculatedArea += surface.surfaceTotal;
      });
      this.totalSurfaceSqm = totalCalculatedArea;
      return totalCalculatedArea;
    },
    obstaclesTotal () {
      let totalCalculatedArea = 0;
      this.obstacles.forEach((obs, key) => {
        totalCalculatedArea += obs.obstacleTotal;
      });
      this.totalSurfaceSqm = totalCalculatedArea;
      return totalCalculatedArea;
    }
  }
};
</script>

<style lang="css" scoped>
@font-face {
  font-family: "Oblik-regular";
  src: url("/assets/fonts/Oblik-Regular.otf");
}

a.dimensions {
  text-decoration: underline;
  bottom: 14px;
  font-size: 9px;
}

.modal-buttons {
  margin-top: 20px;
  padding-bottom: 23px;
  border-bottom: 1px solid #ececec;
}

.bottom-link {
  text-align: right;
  margin: 12px 5px 0px 0px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 77px;
  height: 29px;
  /* margin-bottom: 0px; */
  bottom: 6px;
  left: 17px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 20px;
  left: 2px;
  bottom: 4px;
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

.modal-body p {
  margin-bottom: 8px;
  line-height: 26px;
  font-size: 13px;
  padding-left: 30px;
  padding-right: 9px;
  color: #29275b;
  font-weight: bold;
}

.calculator {
  overflow: auto;
  height: 100%;
  max-height: 504px;
  overflow-x: hidden;
}

.calculator::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
  border-radius: 5px;
}

.calculator::-webkit-scrollbar {
  width: 5px;
  background-color: #d4d4d4;
  border-radius: 5px;
}

.calculator::-webkit-scrollbar-thumb {
  background-color: #d4d4d4;
  border-radius: 5px;
}

.totalarea {
  display: flex;
}

.totalarea p {
  padding-left: 21px;
  color: #11a599;
}

.total-area sup {
  font-size: 10px;
  margin-left: -4px;
}

.control {
  width: auto;
  float: left;
}

.btnadd {
  padding-right: 95px;
}

.total-area {
  text-align: end;
  font-size: 13px;
  margin-top: 17px;
  font-weight: bold;
  display: flex;
  justify-content: flex-end;
}

.total-area p {
  margin: 0px;
  padding: 0px;
  color: #48403d;
  font-family: Arial;
}

.total-area span {
  float: right;
  font-size: 18px;
  color: #2a275c;
  margin-top: 3px;
  padding-left: 3px;
  font-family: Arial;
}

button.calculate-area {
  width: 178px;
  background: #d6de29;
  padding: 6px;
  margin: 5px;
  font-size: 13px;
  color: black;
  font-weight: bold;
  /* font-family: "Playfair Display", serif; */
  font-family: "Arial";
  margin-left: 15px;
  border: none;
  margin-bottom: 48px;
}

button.add-surface {
  font-family: "Arial";
  background: #434343;
  color: white;
  font-weight: bold;
  width: 178px;
  font-size: 13px;
  margin-top: 10px;
  padding: 8px;
  border: none;
  margin-left: 15px;
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
  background: #2a275c;
  color: white;
  font-size: 24px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}

h4.modal-title {
  margin: 0;
  padding: 29px 0;
  margin-left: 10px;
  font-family: "Oblik";
  font-size: 24px;
  text-align: center;
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
  background-color: #ffffff;
  margin: 0;
  padding: 0px 0px;
  /* width: 80%; */
  border-radius: 5px;
}

/* The Close Button */
.close {
  color: #fefefe;
  float: right;
  top: -10px;
  right: -14px;
  position: absolute;
  height: 44px;
  width: 44px;
  border: none;
  font-weight: bold;
  border-radius: 24px;
  background-color: #ec0e8b !important;
}

.close:hover,
.close:focus {
  /* color: white; */
  text-decoration: none;
  cursor: pointer;
}

.obstacleshow p {
  font-size: 12px;
  padding-left: 21px;
}

.icons {
  background-color: #ec0e8b;
  height: 18px;
  width: 18px;
  border-radius: 10px;
  color: #fff;
  margin-top: 15px;
  cursor: pointer;
  font-size: 20px;
}

.down-arrow {
  display: none;
}

.fa-angle-right:before {
  content: "\f105";
  margin-left: 7px;
  margin-top: -2px;
  /* margin-top: -4px; */
  /* height: 6px; */
  display: block;
}

.fa-angle-down:before {
  content: "\f107";
  margin-left: 2px;
  display: block;
  margin-top: -1px;
}

/*.hidearrow {*/
/*  display: none;*/
/*}*/
/*#arrowsmall{*/
/*  display: none;*/
/*}*/
.area {
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 21px;
  padding-bottom: 17px;
  border-top: 1px solid #ececec;
}

.area span.total-price-span {
  margin-left: -7px;
}

.area span {
  font-size: 13px;
  color: #48403b;
  font-weight: bold;
  width: 100%;
  display: block;
  font-family: Arial;
}

.addToBasketBtn {
  /*padding: 15px 0px !important;*/
  /*width: 80.5% !important;*/
  /*text-transform: uppercase;*/
  /*font-size: 14px;*/
  /*font-weight: 700;*/
  /*background-color: #2A275C;*/
  /*border-radius: 3px;*/
  background-attachment: scroll;
  background-clip: border-box;
  background-color: #29275b;
  background-image: url(/dist/add-to-basket.jpg?749b71f…);
  background-origin: padding-box;
  background-position: 16% 45%;
  background-repeat: no-repeat;
  background-size: auto auto;
  border: 2px solid #29275b;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
  display: block;
  float: right;
  font-size: 14px;
  max-width: 260px;
  min-height: auto;
  position: relative;
  text-align: center;
  width: 100%;
  font-family: Arial;
  line-height: auto;
  font-weight: bold;
  padding: 15px 0px;
  text-transform: uppercase;
  margin-top: 5px;
}

i.fa.fa-calculator {
  /* float: left; */
  margin-right: 5px;
}

img.closeicon {
  width: 20px;
  height: 20px;
}

.pull-left {
  display: inline-flex;
}

.ft,
.switch {
  display: inline-block;
}

.m {
  margin-left: 12px;
  margin-right: -10px;
  font-size: 12px;
  font-weight: bold;
}

.ft {
  margin-left: 23px;
  font-size: 12px;
  font-weight: bold;
}

i.fa.fa-plus {
  font-size: 10px;
  background-color: #11a599;
  height: 20px;
  width: 20px;
  text-align: center;
  border-radius: 10px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  cursor: pointer;
}

.mobile_responsive {
  font-size: 15px !important;
}

.price-div {
  display: block;
  margin-top: 2px;
}

span.TotalSqmPrice {
  font-size: 19px;
  color: #29275b;
  font-family: Arial;
  font-weight: bold;
}

.TotalSqmPrice p {
  margin: 0;
  padding: 0;
  font-family: Arial;
  /* float: right; */
  font-size: 10px;
  font-weight: bold;
  color: #48403b;
  line-height: 3;
  display: inline-block;
  padding-left: 4px;
}

@media (max-width: 767px) {
  h4.modal-title {
    text-align: center;
    margin: 0;
    padding: 40px 0 40px 26px;
  }

  .close {
    height: 60px;
    width: 60px;
    font-weight: bold;
    border-radius: 51px;
    top: 23px;
    right: 23px;
  }

  .material-icons {
    font-size: 26px;
    font-weight: bold;
    line-height: 2;
  }

  .modal-body p {
    padding-left: 26px;
    font-size: 14px;
  }

  .total-area {
    margin-top: 0px;
    font-weight: bold;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: center;
    justify-content: flex-end;
    padding-right: 30px;
  }

  .totalarea #window-Floor {
    padding-left: 17px;
  }

  .totalarea #wall-Floor {
    padding-left: 17px;
  }

  .mobile_responsive {
    padding: 0 !important;
  }

  /* .btnadd {
    display: flex;
    justify-content: center;
  } */
  .obstacleshow #window-Door {
    padding-left: 17px;
  }

  .price-div {
    padding-left: 28px;
  }

  .finalPrices p {
    padding-left: 4px;
  }

  .TotalSqmPrice p {
    padding-left: 4px !important;
  }

  .basket-button {
    /* padding-right: 40px; */
    max-width: 61%;
    padding-right: 55px;
  }

  .addToBasketBtn {
    min-width: 176px;
    width: 100%;
    /* float: none; */
    min-height: 35px;
    padding: 0;
  }

  /* .fa-plus:before {
    margin-top: 0;
  } */
}

@media (max-width: 500px) {
  .totalarea #window-Floor {
    font-size: 12px;
  }

  .mobile_responsive {
    font-size: 12px !important;
  }

  i.fa.fa-plus {
    height: 19px !important;
    width: 19px !important;
    border-radius: 15px !important;
  }

  i.fa.fa-plus.one:before {
    content: "\F067";
    display: block;
    margin-top: 0px;
    margin-left: 1px;
  }

  i.fa.fa-plus.two:before {
    display: block;
    margin-top: -1px;
    margin-left: 0px;
  }

  .icons {
    height: 18px !important;
    width: 18px !important;
    border-radius: 15px !important;
  }

  .fa-angle-right:before {
    margin-left: 7px !important;
    margin-top: -2px !important;
  }

  .fa-angle-down:before {
    margin-left: 2px !important;
    margin-top: 0px !important;
  }

  .totalarea #Add-window-Door {
    font-size: 12px;
    padding-left: 15px;
  }

  .addToBasketBtn {
    background-position: 9% 45%;
  }
}

@media (max-width: 480px) {
  .calculator {
    overflow: auto;
    height: 100%;
    max-height: 100%;
    /* min-height: 504px; */
    overflow-x: hidden;
  }

  h4.modal-title {
    padding: 24px 0 20px 0;
    font-size: 13px;
    text-align: center;
  }

  .close {
    height: 29px;
    width: 29px;
    top: 15px;
  }

  .close .material-icons {
    font-size: 18px;
    font-weight: bold;
    line-height: 0;
    display: block;
    margin-top: 1px;
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .modal-body p {
    padding-left: 18px;
    font-size: 3.382vw;
    font-family: Arial;
  }

  .totalarea #window-Floor {
    padding-left: 11px;
    font-size: 3.2vw;
  }

  .total-area p {
    font-size: 12px !important;
    font-family: Arial;
  }

  .total-area span {
    font-size: 14px !important;
    font-family: Arial;
    margin-top: 4px;
  }

  .obstacleshow #window-Door {
    padding-left: 10px;
  }

  .totalarea #Add-window-Door {
    padding-left: 10px;
    font-size: 3.2vw;
  }

  /* i.fa.fa-plus.one:before {
    margin-top: 0;
    margin-right: 1px !important;
    vertical-align: unset;
  } */
  i.fa.fa-plus {
    margin-top: 16px;
  }

  .fa-angle-down:before {
    margin-left: 3px !important;
    margin-top: 0px !important;
  }

  .area span {
    font-size: 12px;
  }

  .area .TotalSqmPrice {
    font-size: 18px;
  }

  .TotalSqmPrice p {
    font-size: 12px;
  }

  div#wallObstacle {
    padding-right: 0 !important;
  }

  /* .price-div {
    padding-left: 15px;
  } */
  .price .vat {
    font-size: 10px;
  }

  .addToBasketBtn {
    font-size: 12px;
  }

  /* .basket-button {
    padding-right: 20px;
    padding-left: 31px;
} */
  /* .total-area span {
    font-size: 11px!important;
} */
  .mobile_responsive {
    font-size: 9px !important;
  }

  .height,
  .width {
    font-size: 9px;
  }

  .addToBasketBtn {
    font-size: 9px;
  }
}

@media (max-width: 380px) {
  .total-area {
    padding-right: 22px;
  }
}

@media (max-width: 340px) {
  .modal-body p {
    padding-left: 12px;
  }

  .close {
    top: 19px;
  }

  .WindowDoorArea {
    flex-basis: 66.66666667%;
    max-width: 58.666667%;
  }

  .wallarea {
    padding-right: 14px;
  }

  .totalarea {
    flex-basis: 51%;
    max-width: 51%;
  }

  .totalarea #window-Floor {
    padding-left: 2px;
  }

  .btnadd {
    flex-basis: 47%;
    max-width: 47%;
  }

  .total-factor {
    flex-basis: 53%;
    max-width: 54%;
    padding: 0;
    padding-left: 1px;
  }

  div#wallObstacle {
    flex-basis: 42.333333%;
    max-width: 41.333333%;
  }

  .obstacleshow #window-Door {
    padding-left: 2px;
  }

  .price-div {
    padding-left: 21px;
  }

  .price .vat {
    font-size: 9px;
  }

  .area span {
    font-size: 9px;
  }

  .area .TotalSqmPrice {
    font-size: 14px;
  }

  .TotalSqmPrice p {
    font-size: 10px;
    padding-left: 0px !important;
  }

  /* .price-div {
    padding-left: 9px;
  } */
}
</style>
