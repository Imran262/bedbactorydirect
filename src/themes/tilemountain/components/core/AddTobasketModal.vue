<template>
  <div
    class="modal"
    :class="
      checkGroutAdhesive &&
      showGroutAdhesives &&
      parseInt(minSqmValue) <= parseInt(productSqmQuantity)
        ? 'simpleModal'
        : 'adhesiveModal'
    "
  >
    <div class="modal-backdrop" @click="hidemodal" />
    <div class="modal-content">
      <div class="scroll">
        <span class="close" @click="hidemodal">&times;</span>
        <div class="col1">
          <h1>Your basket has been updated!</h1>
          <div class="row m0 firstheading">
            <div class="col-md-4 col-xs-4" v-if="productImage">
              <!-- <img :src="productImage" class="image-icon"/> -->
              <product-image :image="image" class="image-icon" />
            </div>
            <div class="col-md-4 col-xs-4" v-else>
              <img
                src="/assets/placeholder.svg"
                class="image-icon"
                alt="placeorder"
              />
            </div>
            <div class="col-md-8 col-xs-8">
              <ul
                :class="
                  `productspecsul` +
                  (product.type_id === 'bundle' ? ' bundleOption' : '')
                "
              >
                <template >
                  <li>{{ product.name }}</li>
                  <span class="Qty">Qty :</span>
                      <span>{{ boxSqm }}</span>
                  <li class="product_price">
                    <!-- {{
                      (product.price * (product.qty || 1)) | price(storeView)
                    }} -->
                    {{priceToShow.special}}
                  </li>
                </template>
              </ul>
            </div>
          </div>
          <div class="bottom-button">
            <div class="row line">
              <div class="col-xs-6 col-md-6 col-lg-6 modalbuttoncol pl0">
                <router-link :to="localizedRoute('/cart')" exact>
                  <button class="Modalbutton" @click="removeAll">
                    {{ $t('View Basket') }}
                  </button>
                </router-link>
              </div>
              <div class="col-xs-6 col-md-6 col-lg-6 pr0">
                <button class="shopping-button" @click="hidemodal">
                  {{ $t('Continue Shopping') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ProductImage from 'theme/components/core/ProductImageAdhesive'
import {
  getThumbnailForProduct,
  getProductConfiguration
} from '@vue-storefront/core/modules/cart/helpers'
import { mapGetters, mapActions } from 'vuex'
import { getThumbnailPath } from '@vue-storefront/core/helpers'
import Vue from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { notifications } from '@vue-storefront/core/modules/cart/helpers'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import config from 'config'
import RecommendedAdhesives from './adhesives/RecommendedAdhesives'
import RecommendedGrouts from './adhesives/RecommendedGrouts'

Vue.component('v-select', vSelect)

export default {
  name: 'Addtobasket',
  components: {
    ProductImage,
    // vSelect,
    RecommendedAdhesives,
    RecommendedGrouts
  },
  data () {
    return {
      productImage: '',
      adhesiveInput: 1,
      groutInput: 1,
      selectedFixing: '',
      selectedMadeOf: '',
      selectGroutJoint: '',
      window: {
        width: 0
      },
      colWidth: false,
      adhesiveProduct: '',
      groutProduct: '',
      defaultPayload: {
        'data': {
          product_id: '',
          item_id: '',
          fixing_type: 'Wall',
          applied_material: 'Concrete',
          grout_width: '2',
          total_qty: '',
          sqm: ''
        }
      },
      payload: {
        'data': {
          product_id: '',
          item_id: '',
          fixing_type: '',
          applied_material: '',
          grout_width: '',
          total_qty: '',
          sqm: ''
        }
      },
      groutAdhesiveArray: [],
      cartItemId: '',
      cartItemsTotal: 0,
      vinylPriceOnModal: 0,
      showGroutAdhesives: config.productPageGroutAdhesive
    }
  },
  props: {
    priceToShow:{
      required:true,
      type : Object
    },
    fixing: {
      required: true,
      type: Array
    },
    madeOf: {
      required: true,
      type: Array
    },
    boxSqm: {
      required: true,
      type: [ String, Number ]
    },
    groutJoint: {
      required: true,
      type: Array
    },
    product: {
      required: true,
      type: Object
    },
    checkGroutAdhesive: {
      required: true,
      type: Boolean
    },
    groutAdhesiveData: {
      required: true,
      type: [ Object, Array ]
    },
    productSqmQuantity: {
      required: true,
      type: [ Number, String ]
    },
    productTileQuantity: {
      required: true,
      type: [ Number, String ]
    },
    minSqmValue: {
      required: true,
      type: [ Number, String ]
    },
    vinylProductPrice: {
      type: Number,
      required: true
    },
    vinylRecommendedItemPrice: {
      type: Number,
      required: true
    }
  },
  async mounted () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.getProductDetails(this.product)
    await this.extractProductItemId()
    if(this.fixing) {
      this.selectedFixing = this.fixing[ 0 ]
    }
    if(this.madeOf) {
      this.selectedMadeOf = this.madeOf[ 0 ]
    }
    if(this.groutJoint) {
      if(this.groutJoint && this.groutJoint.length > 0) {
        this.selectGroutJoint = this.groutJoint[ 0 ].value
      }
    }
  },
  methods: {
    ...mapActions({
      getProduct: 'product/single'
    }),
    showLoader () {
      this.$nextTick(function() {
        if(this.$refs.spinner && this.$refs.spinner.classList) {
          this.$refs.spinner.classList.remove('hidden')
        }
      })
    },
    hideLoader () {
      this.$nextTick(function() {
        if(this.$refs.spinner && this.$refs.spinner.classList) {
          this.$refs.spinner.classList.add('hidden')
        }
      })
    },
    async extractProductItemId () {
      this.showLoader()
      await this.productsInCart.forEach((product) => {
        if(product.id === this.product.id) {
          if(product.totals && product.totals.item_id) {
            this.cartItemId = product.totals.item_id
          }
        }
      })
      if(this.cartItemId) {
        this.hideLoader()
      }
    },
    async onChange (e) {
      this.payload.data.product_id = this.product.id
      this.payload.data.fixing_type = this.selectedFixing
      this.payload.data.applied_material = this.selectedMadeOf
      this.payload.data.grout_width = this.selectGroutJoint
      this.payload.data.total_qty = this.productTileQuantity
      this.payload.data.sqm = this.productSqmQuantity
      await this.$store.dispatch(
        'groutadhesive/groutAdhesiveFunction', this.payload).then((res) => {
          let response = JSON.parse(res)
          if(response.success) {
            this.groutAdhesiveArray = []
            this.groutAdhesiveArray = response.data
          } else {
            this.groutAdhesiveArray = []
          }
        })
    },
    async getProductDefaultGroutAndAdhesive () {
      this.defaultPayload.data.product_id = this.product.id
      this.defaultPayload.data.sqm = this.productSqmQuantity
      this.defaultPayload.data.total_qty = this.productTileQuantity
      await this.$store.dispatch(
        'groutadhesive/groutAdhesiveFunction', this.defaultPayload).then((res) => {
          let response = JSON.parse(res)
          if(response.success) {
            this.groutAdhesiveArray = response.data
          } else {
            this.groutAdhesiveArray = []
          }
        })
    },
    productTileTypeUnitCheck (product) {
      let productUnit = ''
      if(product.product_price_type) {
        if(this.productTileType[ product.product_price_type ] === 'sqm') {
          productUnit = 'm<sup>2</sup>'
        } else if(this.productTileType[ product.product_price_type ]) {
          productUnit = this.productTileType[ product.product_price_type ]
        } else {
          productUnit = 'm<sup>2</sup>'
        }
      } else {
        productUnit = 'm<sup>2</sup>'
      }
      return productUnit
    },
    hidemodal () {
      this.$emit('closemodal')
      let x = document.getElementsByTagName('BODY')[ 0 ]
      x.style.overflow = 'scroll'
    },
    removeAll () {
      let x = document.getElementsByTagName('BODY')[ 0 ]
      x.style.overflow = 'scroll'
    },
    getProductDetails (product) {
      this.productImage = getThumbnailPath(product.image)
    },
    handleResize () {
      this.window.width = window.innerWidth
      if(this.window.width <= 992) {
        this.colWidth = true
      } else {
        this.colWidth = false
      }
    },
    calculateSqmQuantity (productQuantity) {
      let sqm = productQuantity / this.product.qty_per_sqm
      return sqm.toFixed(2)
    },
    selectedBundleOption (bundleOption) {
      // return this.productsInCartSkus;
      return bundleOption.product_links.filter(p => {
        return this.productsInCartSkus.includes(p.sku)
      })
      // return bundleOption.product_links.filter(pLink => this.productsInCartSkus.includes(pLink.sku));
    }
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      appliedCoupon: 'cart/getCoupon',
      totals: 'cart/getTotals',
      getCurrentProduct: 'product/getCurrentProduct',
      getCartToken: 'cart/getCartToken',
      getCurrentProductConfiguration: 'product/getCurrentProductConfiguration',
    }),
    storeView () {
      return currentStoreView()
    },
    productTileType () {
      return config.tileTypes
    },
    image () {
      return {
        loading: this.thumbnail,
        src: this.thumbnail
      }
    },
    thumbnail () {
      return getThumbnailForProduct(this.product)
    },
    productsInCartSkus () {
      return this.productsInCart.map(p => p.sku)
    },
    selectedBundleOptions () {
      return this.product.bundle_options.map(bundleOption => {
        return {
          ...bundleOption,
          'selected_product': this.selectedBundleOption(bundleOption)
        }
      })
    }
  },
  watch: {
    productsInCart: function() {
      this.extractProductItemId()
    }
  }
};
</script>
<style scoped>
div#crafty_loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #29275b;
  width: 40px;
  height: 40px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

div#crafty_loader_after {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #29275b;
  width: 10px;
  height: 10px;
  -webkit-animation: spin-data-v-877bcfc0 2s linear infinite;
  animation: spin-data-v-877bcfc0 2s linear infinite;
  position: absolute;
  bottom: 16px;
  left: 16%;
}
</style>
<style lang="scss" scoped>
@font-face {
  font-family: 'Oblik-regular';
  src: url('/assets/fonts/Oblik-Regular.otf');
}
ul.bundleOption {
  padding: 0;
  margin-left: 20px;
  display: flex;
  align-items: center;
  height: 100%;
}

.image-icon {
  width: 100%;
  margin: 36px 15px;
}
.simpleModal .image-icon {
  margin: 10px 15px;
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

/* Modal Content */
.modal-content {
  z-index: 999;
  background-color: #fefefe;
  margin: auto;
  border: 1px solid #888;
  width: 64%;
  position: absolute;
  top: 50%;
  border-radius: 14px;
  left: 50%;
  transform: translate(-50%, -50%);
  @media screen and (min-width: 1511px) and (max-width: 1652px) {
    width: 70%;
  }
  @media screen and (min-width: 1400px) and (max-width: 1510px) {
    width: 80%;
  }
  @media screen and (min-width: 1200px) and (max-width: 1399px) {
    width: 90%;
  }
  @media screen and (min-width: 993px) and (max-width: 1199px) {
    width: 95%;
  }
  @media screen and (min-width: 768px) and (max-width: 992px) {
    width: 70%;
  }
  @media screen and(max-width: 767px) {
    width: 95%;
  }
}

@media screen and (max-width: 992px) {
  .firstheading {
    margin-top: 47px;
  }
  .close {
    z-index: 1000;
  }
  // .scroll {
  //   height: 384px;
  //   overflow-y: scroll;
  //   overflow-x: hidden;
  // }
  .scroll::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
    border-radius: 10px;
  }

  .scroll::-webkit-scrollbar {
    width: 5px;
    background-color: #f5f5f5;
    border-radius: 10px;
  }

  .scroll::-webkit-scrollbar-thumb {
    background-color: #676566;
    border-radius: 5px;
  }
}

/* The Close Button */
.close {
  color: #fff;
  float: right;
  font-size: 40px;
  position: absolute;
  background-color: #eb3679;
  right: -16px;
  width: 47px;
  height: 47px;
  padding-left: 0px;
  text-align: center;
  border-radius: 50%;
  top: -15px;
  @media screen and (max-width: 767px) {
    right: -8px;
    width: 40px;
    height: 40px;
    padding-left: 0px;
    text-align: center;
    top: -16px;
    font-size: 32px;
  }
}

.close:hover,
.close:focus {
  text-decoration: none;
  cursor: pointer;
}

.col1 {
  width: 37.55%;
  border-right: 5px solid #e1e1e0;
  @media screen and (max-width: 1740px) {
    border-right: 0px solid #e1e1e0 !important;
  }
  @media screen and (min-width: 1201px) and (max-width: 1740px) {
    width: 38%;
  }
}

.col2 {
  width: 62%;
}

.col1,
.col2 {
  float: left;
}

.secondcol {
  @media screen and (min-width: 320px) and (max-width: 414px) {
    padding: 0px;
  }
}

.thirdcol {
  @media screen and (min-width: 320px) and (max-width: 414px) {
    padding-left: 0px;
  }
}

@media screen and (max-width: 992px) {
  .col1,
  .col2 {
    width: 100% !important;
  }
}

.col1 h1 {
  font-size: 24px;
  color: white;
  background-color: #29275b;
  /* height: 94px; */
  font-family: 'Oblik-regular';
  font-weight: bold;
  padding: 21px 0px;
  margin: 0;
  text-align: center;
  border-top-left-radius: 13px;
  @media screen and (min-width: 768px) and (max-width: 992px) {
    font-size: 20px;
  }
  @media screen and (max-width: 767px) {
    font-size: 13px;
  }
  @media screen and(max-width: 992px) {
    position: fixed;
    width: 100%;
    z-index: 999;
  }
}

@media (min-width: 991px) and (max-width: 1300px) {
  .Modalbutton {
    font-size: 11px !important;
  }
  .shopping-button {
    font-size: 11px !important;
  }
}

.col2 h1 {
  font-size: 24px;
  font-family: 'Oblik-regular';
  font-weight: bold;
  color: white;
  background-color: #29275b;
  /* height: 94px; */
  padding: 21px 0px;
  margin: 0;
  text-align: center;
  border-top-right-radius: 13px;
  @media screen and (min-width: 768px) and (max-width: 992px) {
    font-size: 20px;
    background-color: white;
    color: #29275b;
  }
  @media screen and (max-width: 767px) {
    font-size: 16px;
    background-color: white;
    color: #29275b;
  }
}

.cart-button {
  padding-right: 15px;
  width: 100% !important;
  display: flex;
  justify-content: center;
  padding-bottom: 25px;
  @media screen and (max-width: 992px) {
    border-bottom: 2px solid #c2c2c2;
  }
}

.Modalbutton {
  background-image: none !important;
  text-transform: capitalize !important;
}

// select{
//   width: 91px;
//     padding: 5px;
//     font-size: 16px;
//     line-height: 1;
//     border-radius: 5px;
//     height: 34px;
//     background: url(/assets/dropdownarrow.svg) no-repeat right;
//     -webkit-appearance: none;
//     background-color: white;
//     background-position-x: 68px;
// }
.made {
  width: 116px;
  padding: 5px;
  font-size: 15px;
  line-height: 1;
  border: 0;
  border-radius: 5px;
  height: 40px;
  background: url(/assets/downarrow1.png) no-repeat right #ddd;
  -webkit-appearance: none;
  background-color: white;
  background-position-x: 91px;
  border: 1px solid #ddd;
  color: #b5bdc5;
  @media screen and (max-width: 767px) {
    border-radius: 3px;
  }
  @media (min-width: 1200px) and (max-width: 1838px) {
    width: 100px;
    background-position-x: 75px !important;
  }
  @media screen and (min-width: 992px) and (max-width: 1199px) {
    width: 96px !important;
    background-position-x: 73px !important;
  }
  @media screen and (max-width: 992px) {
    float: right;
    width: 120px;
    height: 130px;
    background-position-x: 100px;
  }
  @media screen and (min-width: 1800px) {
    padding-left: 17px;
  }
  @media (min-width: 320px) and (max-width: 767px) {
    font-size: 12px;
  }
}

.fixing {
  width: 116px;
  padding: 5px;
  font-size: 15px;
  line-height: 1;
  border: 0;
  border-radius: 5px;
  height: 40px;
  background: url(/assets/downarrow1.png) no-repeat right #ddd;
  -webkit-appearance: none;
  background-color: white;
  background-position-x: 92px;
  border: 1px solid #ddd;
  color: #b5bdc5;
  @media screen and (max-width: 767px) {
    border-radius: 3px;
  }
  @media (min-width: 1200px) and (max-width: 1838px) {
    width: 100px;
    background-position-x: 75px !important;
  }
  @media screen and (max-width: 992px) {
    float: right;
    width: 120px;
    height: 130px;
    background-position-x: 100px;
  }
  @media screen and (min-width: 1800px) {
    padding-left: 33px;
  }
  @media (min-width: 320px) and (max-width: 767px) {
    font-size: 12px;
  }
}

.joint {
  width: 64px;
  padding: 5px;
  font-size: 15px;
  line-height: 1;
  border: 0;
  border-radius: 5px;
  height: 40px;
  background: url(/assets/downarrow1.png) no-repeat right #ddd;
  -webkit-appearance: none;
  background-color: white;
  background-position-x: 42px;
  border: 1px solid #ddd;
  color: #b5bdc5;
  @media screen and (max-width: 767px) {
    border-radius: 3px;
  }
  @media (min-width: 1200px) and (max-width: 1838px) {
    width: 64px;
    background-position-x: 42px !important;
  }
  @media screen and (max-width: 992px) {
    float: right;
    width: 120px;
    height: 130px;
    background-position-x: 100px;
  }
  @media screen and (min-width: 1800px) {
    padding-left: 6px;
  }
  @media (min-width: 320px) and (max-width: 767px) {
    font-size: 12px;
  }
}

// .select3 select {
//   width: 67px;
//   background-position-x: 52px;
// }

option {
  color: #ddd;
}

.dropdown-txt {
  color: #908f8d;
  padding-right: 12px;
  font-family: 'Arial';
  font-size: 15px;
  color: #48403d;
  @media (min-width: 1200px) and (max-width: 1838px) {
    font-size: 13px !important;
  }
  @media screen and (min-width: 992px) and (max-width: 1200px) {
    padding-right: 6px;
  }
  @media screen and (min-width: 320px) and (max-width: 767px) {
    font-size: 14px;
  }
}

.select2 {
  padding-left: 24px;
  @media screen and (max-width: 992px) {
    padding-bottom: 7px;
    padding-left: 15px;
  }
}

.select1 {
  padding-bottom: 19px;
  @media screen and (max-width: 992px) {
    padding-bottom: 7px;
    padding-left: 15px;
  }
}

.select3 {
  padding-left: 27px;
  @media screen and (max-width: 992px) {
    padding-bottom: 7px;
    padding-left: 15px;
  }
}

.row1 {
  display: inline-flex;
  float: right;
  /* text-align: -webkit-center; */
  padding-right: 20px;
  padding-top: 20px;
  border-bottom: 2px solid grey;
}

.iteminput {
  display: inline-flex;
  @media screen and (max-width: 992px) {
    justify-content: flex-end;
  }
}

.modalinput {
  border: 1px solid #ddd;
  height: 40px;
  width: 45px;
  color: grey;
  border-radius: 6px;
  text-align: center;
  @media screen and (max-width: 767px) {
    border-radius: 3px;
  }
}

.pricep {
  padding-right: 20px;
  color: #2a275c;
  font-family: 'Arial';
  font-size: 15px;
  font-weight: bold;
  @media screen and (max-width: 1200px) {
    padding-right: 8px;
  }
}

.addbtn {
  background-image: none !important;
  width: 78px !important;
  height: 44px;
  margin-top: 0px !important;
  margin-left: 23px;
  text-transform: capitalize;
  @media screen and (max-width: 1200px) {
    margin-left: 24px;
  }
  @media screen and (min-width: 320px) and (max-width: 767px) {
    width: 65px !important;
    height: 30px !important;
  }
  @media screen and (max-width: 767px) {
    border-radius: 3px;
  }
}

.headingrow h5 {
  margin: 0;
  font-family: Arial;
  font-size: 15px;
  font-weight: bold;
  // padding-bottom: 4px;
  color: #29275b;
  text-transform: capitalize;
}

@media screen and (max-width: 1200px) {
  .headingrow {
    padding: 0px;
  }
}

.prow {
  margin: 0;
  color: #48403d;
  padding-bottom: 15px;
  font-family: Arial;
  font-size: 14px;
  @media screen and (max-width: 1200px) {
    padding-left: 0px;
  }
  @media screen and (min-width: 320px) and (max-width: 500px) {
    font-size: 10px;
  }
  @media screen and (min-width: 501px) and (max-width: 767px) {
    font-size: 12px;
  }
}

@media screen and (min-width: 320px) and (max-width: 500px) {
  .notelast {
    font-size: 8px !important;
  }
  .adhesiveModal .Modalbutton {
    font-size: 12px !important;
    width: 100% !important;
    height: 78% !important;
    margin-left: -10px !important;
  }
  .adhesiveModal .shopping-button {
    font-size: 12px !important;
    padding: 10px 2px !important;
    width: 100% !important;
    height: 78% !important;
  }
  .adhesiveModal .productspecsul li:nth-child(4) {
    font-size: 19px !important;
  }
}

.firstrow {
  padding-left: 33px;
  padding-top: 14px;
  border-bottom: 1px solid #e1e1e0;
  @media screen and (max-width: 1200px) {
    padding-left: 5px;
  }
  @media screen and (max-width: 992px) {
    border-bottom: none;
  }
}

@media screen and (min-width: 320px) and (max-width: 360px) {
  .inputimage {
    left: -1 !important;
  }
}

@media screen and (min-width: 992px) and (max-width: 1200px) {
  .select2 {
    padding-left: 8px;
  }
  .select3 {
    padding-left: 10px;
  }
  .col2 {
    width: 62.44%;
  }
  .fixing {
    width: 75px;
    background-position-x: 51px;
  }
}

.pt8 {
  padding-top: 4px;
}

.pt8 select {
  width: 181px;
  background-position-x: 160px;
  height: 42px !important;
}

.paddingleft {
  padding-left: 17px;
  @media screen and (max-width: 1200px) {
    padding-left: 0px;
  }
}

.cart-button {
  padding: 0;
}

.bottom-button {
  margin: 20px 0px 30px 23px;
  @media screen and (min-width: 992px) {
    margin: 0px 0px 30px 23px;
  }
}
.adhesiveModal .bottom-button {
  @media screen and (min-width: 768px) {
    margin: 3px 0px 30px 23px;
  }
}

.Modalbutton {
  background-color: #071A44;
  border: 2px solid #071A44;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 14px;
  min-height: auto;
  position: relative;
  text-align: center;
  font-family: Arial;
  line-height: auto;
  font-weight: bold;
  padding: 15px 10px;
  width: 91%;
  float: left;
}
@media screen and (max-width: 767px) {
  .modalbuttoncol {
    padding-left: 17px;
  }
  .line {
    padding-bottom: 10px;
  }
}
.shopping-button {
  background-color: #57c9c0;
  border: 2px solid #57c9c0;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 14px;
  min-height: auto;
  position: relative;
  text-align: center;
  font-family: Arial;
  line-height: auto;
  font-weight: bold;
  padding: 15px 10px;
  text-transform: capitalize;
  width: 91%;
  // height: 100%;
  float: left;
}
.nothanks {
  background-color: #fff;
  color: grey;
  border: 1px solid grey;
  cursor: pointer;
  display: block;
  font-size: 14px;
  min-height: auto;
  position: relative;
  text-align: center;
  font-family: Arial;
  line-height: auto;
  font-weight: bold;
  padding: 15px 10px;
  text-transform: capitalize;
  width: 91%;
  height: 100%;
  // float: left;
}
.Addall {
  background-color: #2aa897;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 14px;
  min-height: auto;
  position: relative;
  text-align: center;
  font-family: Arial;
  line-height: auto;
  font-weight: bold;
  padding: 15px 10px;
  text-transform: capitalize;
  width: 91%;
  height: 100%;
  float: left;
}
@media screen and (min-width: 767px) {
  .nothanks {
    display: none;
  }
  .Addall {
    display: none;
  }
}
button {
  background-attachment: scroll;
  background-clip: border-box;
  background-color: #2aa897;
  border: 1px solid #2aa897;
  background-origin: padding-box;
  background-position: 16% 45%;
  background-repeat: no-repeat;
  background-size: auto auto;
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
}

.blend {
  flex: 0 0 150px;
}

// product-image{
//         padding-bottom: 39% !important;

// }
.productspecsul {
  list-style-type: none;
  padding-top: 17px;
  @media screen and (max-width: 700px) {
    font-size: 13px;
    margin-left: -15px;
  }
  @media screen and (max-width: 700px) {
    li {
      padding-bottom: 8px !important;
    }
  }
}
.simpleModal .productspecsul li {
  padding-bottom: 19px;
}
.adhesiveModal .productspecsul li {
  padding-bottom: 19px;
}

.simpleModal .productspecsul li:nth-child(1) {
  font-family: Arial;
  font-weight: bold;
  color: #48403d;
  @media screen and (min-width: 768px) {
    font-size: 15px;
  }
  @media screen and (max-width: 767px) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.simpleModal .productspecsul li:nth-child(2) {
  color: #48403d;
  @media screen and (min-width: 768px) {
    font-size: 14px;
    padding-bottom: 9px;
  }
}

.productspecsul li:nth-child(3) {
  color: #48403d;
}

.simpleModal .productspecsul li:nth-child(4) {
  font-weight: bold;
  font-size: 21px;
  color: #2a275c;
  @media screen and (max-width: 700px) {
    font-size: 15px;
  }
  @media only screen and (max-width: 700px) and (min-width: 360px) {
    float: right;
    padding-right: 20px;
  }
}
@media screen and (min-width: 768px) {
  .simpleModal .productspecsul .product_price {
    font-size: 14px;
  }
}
@media screen and (max-width: 700px) {
  .productspecsul li:nth-child(3) {
    display: inline-flex;
    padding-right: 21px;
  }
  .productspecsul .product_price {
    display: inline-flex;
  }
}
@media screen and (min-width: 768px) {
  .simpleModal .productspecsul li:nth-child(3) {
    font-size: 14px;
  }
  .simpleModal .productspecsul .product_price {
    font-size: 24px;
  }
}

.note {
  float: right;
  font-size: 10px;
  color: #2a275c;
  font-family: 'Arial';
  padding-top: 10px;
  font-weight: bold;
}

@media screen and (max-width: 992px) {
  .note {
    display: none;
  }
  .notelast {
    display: block;
    font-size: 10px;
    color: #2a275c;
    font-family: 'Arial';
    padding-top: 10px;
    font-weight: bold;
    padding-bottom: 7px;
    text-align: center;
  }
}

@media screen and (min-width: 993px) {
  .notelast {
    display: none;
  }
}

.pb23 {
  padding-bottom: 19px;
}

.update {
  font-family: 'Arial';
  font-weight: bold;
  color: #e7008a;
}

.tick {
  margin-top: -5px;
}

.pcolor {
  color: #d4d4de;
}
</style>
<style lang="scss">
.secondcol .vs__actions {
  display: none;
}

.secondcol .v-select:before {
  background: url(/assets/arrows-01.svg) right center no-repeat;
  background-size: 40%;
  content: '';
  display: block;
  height: 20px;
  pointer-events: none;
  position: absolute;
  right: 17px;
  top: 12px;
  width: 20px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.secondcol input.vs__search {
  padding: 0;
  margin: 0;
  width: 100%;
  cursor: pointer;
}

.secondcol .vs__dropdown-option {
  padding: 3px 10px;
}

.secondcol span.vs__selected {
  color: #9b9b9b;
  font-size: 12px;
}

.secondcol .vselected {
  width: 65%;
  cursor: pointer;
  @media screen and (min-width: 576px) and (max-width: 707px) {
    width: 100%;
  }
  @media screen and (min-width: 768px) and (max-width: 992px) {
    width: 127%;
  }
}

.secondcol .vs__selected img {
  position: absolute;
  left: 8px;
  top: 11px;
}

@media screen and (min-width: 440) and (max-width: 530px) {
  .secondcol .vs__selected img {
    left: 2px;
  }
}

.secondcol strong {
  line-height: 2.8;
  margin-left: 10px;
}

.secondcol .vs--searchable .vs__dropdown-toggle {
  cursor: text;
  height: 43px;
  padding: 0;
}

.secondcol .vs__dropdown-toggle {
  height: 45px;
}

.secondcol .vs__selected-options {
  justify-content: center;
}

.secondcol .vs__dropdown-menu {
  top: calc(100% - 13px);
  /* left: 8px; */
  z-index: 1000;
  padding: 5px 0;
  margin: 0;
  width: 30%;
  min-width: 100%;
  overflow-y: visible;
  font-size: 12px;
}

img {
  vertical-align: bottom;
}

.adhesiveModal .col1 {
  width: 100%;
  border: none;
  background: #fff;
  border-radius: 3%;
}

.adhesiveModal .modal-content {
  width: 630px;
  border: none;
  position: relative;
  margin: 0 auto;
  transform: none;
  left: 0;
  top: 24%;
}

.adhesiveModal .row {
  padding: 0 60px;
}

.adhesiveModal .close {
  right: -16px;
  width: 47px;
  height: 47px;
  padding-left: 0px;
  text-align: center;
}

.adhesiveModal .productspecsul {
  padding: 20px 0 0 0;
  margin-left: 20px;
  @media screen and (min-width: 768px) {
    padding: 0 0 0 0;
  }
}

.adhesiveModal .productspecsul {
  color: #4a4a4a;
}
@media screen and (min-width: 320px) and (max-width: 500px) {
  .adhesiveModal .productspecsul {
    padding: 19px 0 0 0 !important;
  }
  .adhesiveModal .productspecsul .product_price {
    margin-bottom: 0px !important;
  }
}
.adhesiveModal .productspecsul li:nth-child(1) {
  color: #4a4a4a;
  font-weight: 600;
  line-height: 20px;
  @media screen and (min-width: 768px) {
    font-size: 15px;
  }
  @media screen and (max-width: 767px) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.adhesiveModal .productspecsul li:nth-child(2) {
  color: #4a4a4a;
  @media screen and (min-width: 768px) {
    font-size: 14px;
    padding-bottom: 14px;
  }
}

.adhesiveModal .productspecsul li:nth-child(3) {
  color: #4a4a4a;
  @media screen and (min-width: 768px) {
    font-size: 14px;
    padding-bottom: 25px;
  }
}

.adhesiveModal .productspecsul .product_price {
  font-weight: 700;
  @media screen and (max-width: 768px) {
    font-size: 17px !important;
  }
  color: #2a275c !important;
  margin-bottom: -10px;
}
@media screen and (min-width: 1280px) {
  .adhesiveModal .Qty {
    padding-right: 12px;
  }
  .adhesiveModal .Qty0 {
    padding-right: 6px;
  }
}

.adhesiveModal .col1 h1 {
  padding: 40px 0px 21px 0px;
  @media screen and (min-width: 768px) {
    padding: 34px 0px 21px 0px;
  }
}

.adhesiveModal .image-icon {
  width: 100%;
  margin: 36px 0 0 15px;
  @media screen and (min-width: 768px) {
    margin: 0px 0 0 15px;
  }
}

.secondcol ul li {
  background: #fff !important;
}

.secondcol ul li:hover,
.secondcol ul li:focus,
.secondcol ul li:active {
  background: #807e94 !important;
}

@media (max-width: 1200px) and (min-width: 992px) {
  .vs__dropdown-menu {
    width: 88.5%;
    min-width: 134px;
    font-size: 11px;
  }
  .vs__dropdown-option {
    padding-left: 2px;
  }
  .vs__selected img {
    position: absolute;
    left: 3px;
    top: 12px;
    height: 18px;
  }
  strong {
    line-height: 3.4;
    margin-left: 3px;
    font-size: 10px;
  }
}

@media (max-width: 991px) and (min-width: 767px) {
  .vs__dropdown-menu {
    width: 90.5%;
    min-width: 130px;
    font-size: 11px;
  }
  .vs__selected img {
    position: absolute;
    left: 3px;
    top: 12px;
    height: 18px;
  }
  strong {
    line-height: 3.4;
    margin-left: 3px;
    font-size: 10px;
  }
}

@media (max-width: 767px) {
  .square {
    margin-top: -3px;
  }
  .adhesiveModal .modal-content {
    width: 95%;
  }
  .adhesiveModal .col1 {
    border-radius: 5px;
  }
  .adhesiveModal .col1 h1 {
    border-top-left-radius: 5px;
  }
  .adhesiveModal .row {
    padding: 0 20px;
  }
  .adhesiveModal .close {
    right: -8px;
    width: 40px;
    height: 40px;
    padding-left: 0px;
    text-align: center;
    top: -16px;
  }
  .adhesiveModal .productspecsul .product_price {
    float: right;
    margin-bottom: 50px;
  }
  .adhesiveModal .productspecsul {
    padding: 35px 0 0 0;
  }
  .adhesiveModal .productspecsul li {
    padding-bottom: 15px !important;
  }
  .adhesiveModal .cart-button {
    border-bottom: none;
    margin-top: 15px;
  }
  .cart-button {
    display: block !important;
  }
  .Modalbutton {
    width: 100%;
    float: none !important;
    margin: 0 auto;
    margin-bottom: 15px;
  }
  .shopping-button {
    float: none !important;
    margin: 0 auto;
  }
}

@media (min-width: 700px) and (max-width: 767px) {
  .adhesiveModal .productspecsul .product_price {
    float: none !important;
  }
}

@media screen and (max-width: 992px) {
  .adhesiveModal .col1 h1 {
    position: relative;
  }
  .adhesiveModal .scroll {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .adhesiveModal .cart-button {
    border-bottom: none;
  }
  .adhesiveModal .firstheading {
    margin-top: 0px;
  }
  .simpleModal .scroll {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 15px;
  }
}

.btnclicked {
  background-color: #cccbd1 !important;
}
@media screen and (min-width: 992px) {
  .simpleModal .headingrow h5 {
    padding-bottom: 0px;
  }
}
@media screen and (min-width: 375px) and (max-width: 992px) {
  .simpleModal .image-icon {
    // margin: 36px 15px
    margin: 36px 15px 6px 15px !important;
  }
  .simpleModal .bottom-button {
    margin: 10px 0px 17px 0px !important;
    border-bottom: 1px solid#C2C2C2;
  }
  .simpleModal .Modalbutton {
    margin-bottom: 6px !important;
    font-size: 12px !important;
    width: 170px !important;
    height: 34px;
    padding: 8px 10px;
  }

  .simpleModal .col2 h1 {
    padding: 0px 0px 16px 0px !important;
  }
  .simpleModal .firstrow {
    padding-top: 0px !important;
  }
  .simpleModal .fixing {
    height: 30px !important;
    color: #48403d;
  }
  .simpleModal .made {
    height: 30px !important;
    color: #48403d;
  }
  .simpleModal .joint {
    height: 30px !important;
    color: #48403d;
  }
  .simpleModal .headingrow h5 {
    padding-bottom: 0px !important;
  }
  .simpleModal .prow p {
    margin-bottom: 6px !important;
    margin-top: 5px !important;
  }
  .simpleModal .prow {
    padding-bottom: 2px !important;
  }
  .simpleModal .shopping-button {
    font-size: 12px !important;
    width: 150px !important;
    height: 34px;
    padding: 8px 10px;
  }
  .simpleModal .scroll {
    overflow-y: auto;
    overflow-x: hidden;
    height: 640px;
  }
  .modalinput {
    height: 29px !important;
    width: 32px !important;
  }
  .pricep {
    margin-top: 10px !important;
    font-size: 14px !important;
  }
  .simpleModal .nothanks {
    font-size: 12px !important;
    width: 150px !important;
    height: 34px;
    padding: 8px 10px;
  }
  .simpleModal .Addall {
    font-size: 12px !important;
    width: 150px !important;
    height: 34px;
    padding: 8px 10px;
  }
  .nothankscol {
    padding-top: 13px;
  }
  .addallcol {
    padding-top: 13px;
  }
}
.lastrow {
  border-top: 1px solid #c2c2c2;
  @media screen and (min-width: 992px) {
    display: none !important;
  }
}
@media screen and (min-width: 320px) and (max-width: 374px) {
  .simpleModal .headingrow h5 {
    font-size: 11px !important;
  }
  .simpleModal .Modalbutton {
    margin-bottom: 6px !important;
    font-size: 9px !important;
    width: 130px !important;
    height: 34px;
    padding: 10px 10px;
  }
  .simpleModal .shopping-button {
    font-size: 9px !important;
    width: 130px !important;
    height: 34px;
    padding: 10px 10px;
  }
  .pricep {
    margin-top: 10px !important;
    font-size: 12px !important;
  }
  .nothanks {
    font-size: 9px !important;
    width: 130px !important;
    height: 34px !important;
    padding: 10px 10px !important;
  }
  .Addall {
    font-size: 9px !important;
    width: 130px !important;
    height: 34px !important;
    padding: 10px 10px !important;
  }
  .nothankscol {
    padding-top: 6px;
  }
  .addallcol {
    padding-top: 6px;
  }
  .simpleModal .fixing {
    height: 34px !important;
  }
  .simpleModal .made {
    height: 34px !important;
  }
  .simpleModal .joint {
    height: 34px !important;
  }
  .simpleModal .prow p {
    margin-bottom: 5px !important;
    margin-top: 5px !important;
  }
  .simpleModal .col2 h1 {
    padding: 0px 0px 16px 0px !important;
  }
  .simpleModal .image-icon {
    margin: 36px 15px 6px 15px !important;
  }
  .simpleModal .bottom-button {
    margin: 0px 0px 17px 0px !important;
    border-bottom: 1px solid grey;
  }
  .simpleModal .scroll {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 10px;
  }
  .modalinput {
    height: 29px !important;
    width: 32px !important;
  }
}
</style>
