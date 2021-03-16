<template>
  <div >
    <div
      class="col-md-12 sb-md-dropdown-inner transform"
      :class="removeGroutAdhesiveSection ? 'transform-active' : ''"
      v-if="hasRecommendation && minSqmValue <= sqmQuantityNew"
    >
      <div class="dropdown-title">
        Need Adhesive &amp; Grout for these tiles?
      </div>
      <!-- Drop downs of options for the customer against that item -->
      <div class="mb-item-option">
        <div class="row">
          <div class="inner-row">
            <div class="sb-floor-wall">
              <span class="mb-block-span">
                <label class="mb-strong-label">I am fixing to the</label>
              </span>
              <span class="mb-block-span span-right">
                <label class="blue-dropdown">
                  <select
                    class="fixing"
                    v-model="selectedFixing"
                    @change="getProductDefaultGroutAndAdhesive($event)"
                  >
                    <option
                      v-for="(fix, index) in allAdhesiveGrouts.options
                        .fixing_type"
                      :key="index"
                      :value="fix"
                    >
                      {{ fix }}
                    </option>
                  </select>
                </label>
              </span>
            </div>
            <div class="sb-made-of">
              <span class="mb-block-span">
                <label class="mb-strong-label">made of</label>
              </span>
              <span class="mb-block-span span-right">
                <label class="blue-dropdown">
                  <select
                    class="made"
                    v-model="selectedMadeOf"
                    @change="getProductDefaultGroutAndAdhesive($event)"
                  >
                    <option
                      v-for="(made, index) in allAdhesiveGrouts.options
                        .applied_material"
                      :key="index"
                      :value="made"
                    >
                      {{ made }}
                    </option>
                  </select>
                </label>
              </span>
            </div>
            <div class="sb-grout-width">
              <span class="mb-block-span">
                <label class="mb-strong-label">with a grout joint of</label>
              </span>
              <span class="mb-block-span span-right">
                <label class="blue-dropdown">
                  <select
                    class="joint"
                    v-model="selectedGroutJoint"
                    @change="getProductDefaultGroutAndAdhesive($event)"
                  >
                    <option
                      v-for="(joint, index) in allAdhesiveGrouts.options
                        .grout_width"
                      :key="index"
                      :value="joint.value"
                    >
                      {{ joint.label }}
                    </option>
                  </select>
                </label>
              </span>
            </div>
          </div>
        </div>
        <!--  Controllers  -->
        <div class="recomendations grid12-12">
          <!-- Loading product base on ajax -->
          <div class="row">
            <div class="recomended_products grid12-12">
              <template
                v-if="
                  extractProductItemId &&
                  !isEmpty(allAdhesiveGrouts.items) &&
                  groutAdhesiveArray.length > 0
                "
              >
                <div v-for="(data, index) in groutAdhesiveArray" :key="index">
                  <template v-if="data.type">
                    <RecommendedAdhesives
                      :data="data"
                      :product="product"
                      :selected-fixing="selectedFixing"
                      :selected-made-of="selectedMadeOf"
                      :selected-grout-joint="selectedGroutJoint"
                      :cart-item-id="extractProductItemId"
                      :disabled-check="matchSkuToDisabled(data.sku, data.parent_id)"
                      @adhesive-product="updateAdhesivesGrouts"
                      @price-of-adhesive="priceOfAdhesive"
                      @show-adhesive-section="showAdhesiveSection"
                    />
                  </template>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="recomended_item col-md-12 col-xs-12">
          <div class="recomended_item_inner">
            <div class="add-all-button col-md-4 col-xs-12 pull-right Add-all">
              <div class="Add_all_outer">
                <span
                  class="sb_add_all add_all_items add_items_all"
                  @click="addAllGroutAdhesive()"
                >
                  <span class="add_all">
                    Add all for
                    <span class="mb-price">
                      <span class="symbol">£</span>
                      <span class="price">{{ groutAdhesivePrice.toFixed(2) }}</span>
                    </span>
                  </span>
                </span>
              </div>
            </div>
            <div class="remove_outer">
              <div
                style="cursor: pointer"
                id="removeButton"
                class="remove_rec_button sb_add_all add_all_items col-md-4 col-xs-6 pull-right add-all-button"
              >
                <span
                  class="remove_recomendations"
                  @click="removeGroutAdhesive()"
                  >No Thanks</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="col-md-12 col-xs-12 everything"
      v-if="removeGroutAdhesiveSection && !noThanksBtnClicked"
    >
      <div style="text-align: center; color: white">
        <p>You have everything you need for this tile</p>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { mapGetters } from 'vuex'
import { notifications } from '@vue-storefront/core/modules/cart/helpers'
import RecommendedAdhesives from '../../adhesives/RecommendedAdhesives'
import { prepareRelatedQuery } from '@vue-storefront/core/modules/catalog/queries/related'
import _ from 'lodash'
Vue.component('v-select', vSelect)
export default {
  components: {
    vSelect,
    RecommendedAdhesives
  },
  data () {
    return {
      noThanksBtnClicked: false,
      removeGroutAdhesiveSection: false,
      adhesiveQuantity: 0,
      groutQuantity: 0,
      selectedGroutJoint: '',
      selectedMadeOf: '',
      selectedFixing: '',
      defaultPayload: {
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
      sqmQuantity: '',
      groutAdhesiveArray: [],
      groutAdhesivePayload: {
        'data': []
      },
      adhesiveDisabled: {},
      groutsAndAdhesivesProductsArray: [],
      priceFromGrout: 0,
      priceFromAdhesive: {},
      groutAdhesivePriceForAddAll: 0,
      groutAdhesivePrice: 0,
      singleProductGroutAdhesiveSku: [],
      singleProductGroutAdhesiveItems: [],
      productsQty: {}
    }
  },
  props: {
    product: {
      required: true,
      type: [Object, Array]
    },
    adhesiveGroutData: {
      required: false,
      type: [Object, Array],
      default: () => []
    },
    cartHasGroutAdhesive: {
      required: true,
      type: [Object, Array]
    },
    hasRecommendation: {
      required: true,
      type: Boolean
    },
    tilesQuantity: {
      required: true,
      type: Number
    },
    minSqmValue: {
      required: true,
      type: [Number, String]
    },
    sqmQuantityNew: {
      required: true,
      type: [Number, String]
    }
  },
  async mounted () {
    this.$bus.$emit('remove-grout-adhesive-section', {
      doesNotHasGroutAdhesiveSection: this.removeGroutAdhesiveSection,
      productId: this.product.id
    })
    if (this.product) {
      this.sqmQuantity = (this.tilesQuantity / this.product.qty_per_sqm).toFixed(2)
    }
    this.selectedFixing = this.allAdhesiveGrouts.defaults.fixing_type
    this.selectedMadeOf = this.allAdhesiveGrouts.defaults.applied_material
    this.selectedGroutJoint = (this.allAdhesiveGrouts.defaults.grout_width && this.allAdhesiveGrouts.defaults.grout_width.value) ? this.allAdhesiveGrouts.defaults.grout_width.value : ''
    if (this.hasRecommendation) {
      await this.getProductDefaultGroutAndAdhesive()
    }
    this.$bus.$emit('fixing-madeOf-grout', {
      selectedFixing: this.selectedFixing,
      selectedMadeOf: this.selectedMadeOf,
      selectedGroutJoint: this.selectedGroutJoint
    })
    this.$bus.$on('additional-products', (updatedProducts) => {
      this.$nextTick(() => {
        this.productGroutAdhesiveQuantityUpdated(updatedProducts)
      })
    })
  },
  computed: {
    ...mapGetters({
      getCartToken: 'cart/getCartToken',
      isAddingToCart: 'cart/getIsAdding',
      productsInCart: 'cart/getCartItems'
    }),
    cartHasGroutAdhesiveProp () {
      return this.cartHasGroutAdhesive
    },
    priceFromAdhesiveProp () {
      return this.priceFromAdhesive
    },
    extractProductItemId () {
      if (this.product && this.product.totals) {
        return this.product.totals.item_id
      }
      return null
    },
    allAdhesiveGrouts () {
      let adhesiveGroutData = {
        items: this.adhesiveGroutData,
        options: {},
        defaults: {}
      }
      if (adhesiveGroutData.items.fixing_type) {
        adhesiveGroutData.options.fixing_type = this.adhesiveGroutData.fixing_type
        adhesiveGroutData.defaults.fixing_type = this.adhesiveGroutData.fixing_type.length ? this.adhesiveGroutData.fixing_type[0] : ''
        delete adhesiveGroutData.items.fixing_type
      }
      if (adhesiveGroutData.items.applied_material) {
        adhesiveGroutData.options.applied_material = this.adhesiveGroutData.applied_material
        adhesiveGroutData.defaults.applied_material = this.adhesiveGroutData.applied_material.length ? this.adhesiveGroutData.applied_material[0] : ''
        delete adhesiveGroutData.items.applied_material
      }
      if (adhesiveGroutData.items.grout_width) {
        adhesiveGroutData.options.grout_width = this.adhesiveGroutData.grout_width
        adhesiveGroutData.defaults.grout_width = this.adhesiveGroutData.grout_width.length ? this.adhesiveGroutData.grout_width[0] : ''
        delete adhesiveGroutData.items.grout_width
      }
      this.$bus.$emit('fixing-madeOf-grout', {
        selectedFixing: adhesiveGroutData.defaults.fixing_type,
        selectedMadeOf: adhesiveGroutData.defaults.applied_material,
        selectedGroutJoint: adhesiveGroutData.defaults.grout_width
      })
      return adhesiveGroutData
    }
  },
  watch: {
    groutsAndAdhesivesProductsArray (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('all-adhesive-grout-products', this.groutsAndAdhesivesProductsArray)
      }
    },
    groutAdhesivePrice (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('add-total-price', this.groutAdhesivePrice)
      }
    },
    groutAdhesiveArray (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$bus.$emit('fixing-madeOf-grout', {
          selectedFixing: this.selectedFixing,
          selectedMadeOf: this.selectedMadeOf,
          selectedGroutJoint: this.selectedGroutJoint
        })
      }
    },
    removeGroutAdhesiveSection (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$bus.$emit('remove-grout-adhesive-section', {
          doesNotHasGroutAdhesiveSection: newVal,
          productId: this.product.id
        })
      }
    },
    allAdhesiveGrouts: {
      handler (newData, oldData) {
        if (newData !== oldData && newData.defaults) {
          if (!this.selectedFixing) {
            this.selectedFixing = newData.defaults.fixing_type
          }
          if (!this.selectedMadeOf) {
            this.selectedFixing = newData.defaults.applied_material
          }
          if (!this.selectedGroutJoint) {
            this.selectedFixing = newData.defaults.grout_width
          }
          this.getProductDefaultGroutAndAdhesive()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    showAdhesiveSection ({ check, productId }) {
      if (productId in this.adhesiveDisabled) {
        this.adhesiveDisabled[productId].check = check
      } else {
        this.adhesiveDisabled[productId] = { check }
      }
      this.removeGroutAdhesiveSection = true
      for (let key in this.adhesiveDisabled) {
        if (!this.adhesiveDisabled[key].check) {
          this.removeGroutAdhesiveSection = false
        }
      }
    },
    isEmpty (object) {
      return _.isEmpty(object)
    },
    totalPrice (allPricesObject) {
      let totalsPrice = 0
      if (!this.isEmpty(allPricesObject)) {
        for (let [key, value] of Object.entries(allPricesObject)) {
          totalsPrice += Math.abs(value)
        }
      }
      this.groutAdhesivePrice = totalsPrice
      this.$emit('add-total-price', { price: this.groutAdhesivePrice, sku: this.product.sku })
      return this.groutAdhesivePrice
    },
    priceOfAdhesive ({ price, productID }) {
      if (productID && typeof price !== 'undefined') {
        this.priceFromAdhesive[productID] = price
      }
      this.totalPrice(this.priceFromAdhesive)
    },
    priceOfGrout (groutPrice) {
      this.priceFromGrout = groutPrice
    },
    productGroutAdhesiveQuantityUpdated (updatedProducts) {
      this.groutAdhesiveArray = []
      this.groutAdhesiveArray = updatedProducts.groutAdhesiveArray
    },
    updateAdhesivesGrouts (groutAdhesive) {
      this.groutsAndAdhesivesProductsArray.push(groutAdhesive)
      this.$emit('all-adhesive-grout-products', this.groutsAndAdhesivesProductsArray)
    },
    removeGroutAdhesive () {
      this.removeGroutAdhesiveSection = true
      this.noThanksBtnClicked = true
    },
    async fetchGroutAndAdhesive () {
      this.groutAdhesiveArray.forEach((item) => {
        if (item.type !== undefined) {
          this.singleProductGroutAdhesiveSku.push(item.sku)
        }
      })
      if (this.singleProductGroutAdhesiveSku && this.singleProductGroutAdhesiveSku.length > 0) {
        let singleTileQuery = prepareRelatedQuery(
          'sku',
          this.singleProductGroutAdhesiveSku
        )
        await this.$store
          .dispatch('product/list', {
            query: singleTileQuery,
            size: 10,
            prefetchGroupProducts: false,
            updateState: false
          })
          .then(({ items }) => {
            this.singleProductGroutAdhesiveItems = items
          })
          .catch((err) => {
            console.log('Fetching single Tile grout adhesive failed', err)
          })
      }
    },
    async addAllGroutAdhesive () {
      if (this.singleProductGroutAdhesiveItems.length > 0) {
        this.singleProductGroutAdhesiveItems.forEach((item) => {
          let selectedProduct = this.groutAdhesiveArray.find(product => parseInt(item.id) === parseInt(product.product_id))
          if (selectedProduct !== undefined) {
            this.groutAdhesivePayload.data.push({
              product_id: this.product.id,
              quote_id: this.getCartToken,
              recomm_id: item.id,
              total_qty: 2,
              recomm_qty: selectedProduct.qty,
              fixing_type: this.selectedFixing,
              applied_material: this.selectedMadeOf,
              grout_width: this.selectedGroutJoint
            })
          }
        })
        let updatedObjectValues = {}
        this.groutAdhesivePayload.data.forEach((value, index) => {
          updatedObjectValues[index] = value
        })
        updatedObjectValues.apply_discount = false
        updatedObjectValues.total_recommendations = 13
        this.$bus.$emit('notification-progress-start', 'Processing ... ')
        await this.$store.dispatch('groutadhesive/groutAdhesiveAddRecommendationsFunction', {
          data: updatedObjectValues
        })
          .then((res) => {
            let response = JSON.parse(res)
            if (response.success) {
              this.pullCartSync()
              if (screen.width < 450) {
                window.scrollTo(0, 100)
              }
            }
            this.$bus.$emit('notification-progress-stop')
          }).catch(err => {
            console.log('Error adding all grout adhesive', err)
            this.$bus.$emit('notification-progress-stop')
          })
      }
    },
    async pullCartSync () {
      await this.$store.dispatch('cart/sync', {
        forceClientState: false,
        forceSync: true
      })
      await this.$store.dispatch('cart/syncTotals', { forceServerSync: true })
      this.$forceUpdate()
    },
    matchSkuToDisabled (sku, parentId) {
      const matchedTrue = this.cartHasGroutAdhesive.filter((item) => {
        if (item.recommended_sku === sku && item.parent_product_id === parentId) {
          return item.recommended_sku
        }
      })
      if (matchedTrue.length > 0) {
        return 'Yes'
      } else {
        return 'No'
      }
    },
    async getProductDefaultGroutAndAdhesive () {
      this.defaultPayload.data.product_id = this.product.id
      this.defaultPayload.data.sqm = this.sqmQuantityNew
      this.defaultPayload.data.total_qty = this.tilesQuantity
      this.defaultPayload.data.fixing_type = this.selectedFixing
      this.defaultPayload.data.grout_width = this.selectedGroutJoint
      this.defaultPayload.data.applied_material = this.selectedMadeOf
      await this.$store.dispatch(
        'groutadhesive/groutAdhesiveFunction', this.defaultPayload)
        .then((res) => {
          let response = JSON.parse(res)
          if (response.success) {
            this.groutAdhesiveArray = response.data
            this.fetchGroutAndAdhesive()
          } else {
            this.groutAdhesiveArray = []
          }
        })
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'vue-select/src/scss/vue-select.scss';
@font-face {
  font-family: 'Oblik-regular';
  src: url('/assets/fonts/Oblik-Regular.otf');
}
.btnClicked {
  background-color: #cccbd1 !important;
}
.dropdown-title {
  background-color: #00a997;
  border-radius: 3px 3px 0 0;
  color: #fff;
  font-family: 'Oblik';
  font-size: 22px;
  font-weight: bold;
  padding: 15px 15px 15px 19px;
  text-align: center;
}
.dropdown-title > span {
  float: right;
  margin-top: 5px;
}
.dropdown-title > span:after {
  width: 0;
  height: 0;
  border-left: 3px solid rgba(0, 0, 0, 0);
  border-top: 6px solid #fff;
  border-right: 3px solid rgba(0, 0, 0, 0);
  margin-right: 8px;
  content: '';
  float: left;
  display: block;
}
.mb-item-option {
  border-bottom: 1px solid #dddddd;
  border-left: 1px solid #dddddd;
  border-radius: 0 0 3px 3px;
  border-right: 1px solid #dddddd;
  padding: 10px 5px 10px 10px;
  float: left;
  width: calc(100% - 17px);
}
.inner-row {
  padding: 0 0 0 51px;
}
.sb-floor-wall {
  margin-bottom: 5px;
  float: left;
}
.mb-block-span {
  display: inline-block;
  padding-top: 5px;
  position: relative;
}
.mb-strong-label {
  color: #4a4a4a;
  font-family: Arial;
  font-size: 14px;
  font-weight: normal;
  line-height: 3;
  padding: 0 3px;
}
.blue-dropdown {
  position: relative;
}
.blue-dropdown:before {
  background: url(/assets/arrows-01.svg) right center no-repeat;
  background-size: 40%;
  content: '';
  display: block;
  height: 20px;
  pointer-events: none;
  position: absolute;
  right: 13px;
  top: 0;
  width: 20px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.blue-dropdown > select {
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  background: #fff;
  color: #9b9b9b;
  font-size: 14px;
  font-family: Arial;
  border: 1px solid #ddd;
  outline: none;
  display: inline-block;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  width: 124px;
  padding-right: 25px !important;
  margin: 0 5px;
  line-height: 2;
  text-align-last: center;
}
.grout-m-m {
  width: 70px !important;
}
.mb-dropdown option {
  padding-right: 8px;
}
.sb-made-of {
  margin-bottom: 5px;
  padding-left: 5px;
  float: left;
}
.sb-grout-width {
  margin-bottom: 5px;
  float: left;
}
.recomendations {
  position: relative;
  margin: 0px !important;
  padding-top: 20px;
  width: 100% !important;
}
.recomended_products {
  padding: 0;
  width: 100%;
}
.recomended_item:first-child {
  border-top: 1px solid #f2f2f2;
}
.recomended_item {
  border-top: 1px solid #f2f2f2;
  padding: 20px 0;
  margin: 0px;
  width: 100%;
  position: relative;
}
.adhesive-text {
  color: #4a4a4a;
  font-family: Arial;
  font-size: 14px;
  line-height: 1.5;
}
.adhesive-text strong {
  color: #4a4a4a;
  display: block;
  float: left;
  font-family: Arial;
  font-size: 14px;
  font-weight: bold;
  line-height: 0;
  width: 100%;
  padding: 10px 0;
}
.adhesive-text span {
  float: right;
  width: 100%;
  margin-top: 15px;
}
.adhesive_price {
  text-align: center;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: end;
  justify-content: center;
  align-items: flex-end;
}
.mb-price {
  display: inline-block;
}
.adhesive_price .price,
.adhesive_price .symbol {
  color: #29275b;
  font-family: Arial;
  font-size: 14px;
  font-weight: bold;
  line-height: 2.4;
}
.symbol {
  letter-spacing: -3px;
}
.recomended_products input {
  background-color: #fff;
  border-radius: 3px;
  color: #9b9b9b;
  font-family: Arial;
  font-size: 14px;
  height: 42px;
  text-align: center;
  //margin: 0 12px;
  border: 1px solid #ddd;
  padding: 0;
  width: 100%;
  max-width: 55px;
}
.recomended_item > .add_adhesive {
  float: right;
}
.add_adhesive,
.sb_add_all {
  background: #00a997 none repeat scroll 0 0;
  border-radius: 3px;
  color: #fff;
  font-family: Arial;
  font-size: 14px;
  font-weight: bold;
  padding: 15px 26px;
  text-align: center;
  // text-transform: uppercase;
  border: none;
}
.add_adhesive {
  max-width: 80px;
  cursor: pointer;
}
.row-recomended_item-row {
  margin: 0;
  padding-left: 31px;
  padding-right: 22px;
}
.adhesive_basket {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
.add_all_items {
  padding: 15px 0;
}
.add_all_items.add_items_all {
  padding: 17px 24px;
  position: relative;
  cursor: pointer;
  top: 14px;
  @media screen and (min-width: 320px) and (max-width: 455px) {
    padding: 17px 0px;
    position: initial;
    display: block;
    width: 100%;
  }
  @media screen and (min-width: 992px) and (max-width: 1024px) {
    padding: 17px 23px;
    position: initial;
    display: block;
    width: 75%;
  }
}
.add_all_items span.add_all {
  // padding: 0px 20px;
}
.add_all_items span {
  color: #fff;
}
.Add-all {
  margin-right: 18px;
  margin-left: 22px;
  @media screen and (min-width: 1280px) {
    margin-right: 2px;
  }
  @media screen and (min-width: 768px) and (max-width: 1279px) {
    margin-right: -8px;
  }
}
.remove_outer {
  width: 73.2%;
}
.remove_rec_button {
  background: #fff !important;
  border: 2px solid #dddddd;
}
.remove_rec_button span {
  color: #777777;
  padding: 15px 45px;
}
.remove_rec_button a {
  color: #888;
}
.recomended_products .recomended_item .add-all-button {
  /* margin: 0 14px; */
  max-width: 163px;
  width: 100%;
}
.adhesive_input {
  display: flex;
  align-items: flex-end;
  padding: 0;
}
.transform {
  -webkit-transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  transition: all 0.5s ease;
  overflow: hidden;
}
.transform-active {
  height: 0 !important;
}
.sb-md-dropdown-inner {
  height: 100%;
}
@media (max-width: 1200px) and (min-width: 992px) {
  .blue-dropdown > select {
    width: 88px;
  }
  .recomended_products input {
    margin: 0;
  }
  .row-recomended_item-row {
    padding: 0;
  }
  .inner-row {
    padding: 0 0 0 6px;
  }
  .remove_rec_button span {
    padding-left: 30px;
    padding-right: 30px;
  }
}
@media (max-width: 991px) and (min-width: 768px) {
  .inner-row {
    padding: 0 0 0 30px;
  }
  .row-recomended_item-row {
    margin: 0;
    padding-left: 22px;
    padding-right: 6px;
  }
}
@media (max-width: 767px) {
  recomended_item {
    display: none;
  }
  .span-right {
    float: right;
  }
  .adhesive_input {
    justify-content: space-around;
  }
  .adhesive_basket {
    padding-top: 25px;
  }
  .recomended_products input {
    width: 100%;
    max-width: 124px;
  }
  .inner-row {
    padding: 0 17px 0 5px;
  }
  .dropdown-title {
    font-size: 3.762vw;
  }
  .sb-floor-wall {
    width: 100%;
  }
  .sb-made-of {
    padding-left: 0;
    width: 100%;
  }
  .sb-grout-width {
    width: 100%;
  }
  .row-recomended_item-row {
    margin: 0;
    padding-left: 10px;
    padding-right: 15px;
  }
  .vselected {
    display: none;
  }
  .remove_rec_button span {
    padding-left: 30px;
    padding-right: 30px;
  }
}
@media (max-width: 455px) {
  .recomended_products input {
    max-width: 62px;
    height: 44px;
  }
  .recomended_products .recomended_item .add-all-button {
    max-width: 140px;
  }
  .remove_rec_button a {
    font-size: 13px;
  }
  .add_all_items a {
    font-size: 13px;
  }
  .remove_outer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .remove_rec_button {
    padding-left: 0;
    padding-right: 0;
    flex-basis: 100%;
    max-width: 100%;
  }
  .Add_all_outer {
    width: 100%;
  }
  .Add-all {
    margin-right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0;
    margin-bottom: 10px;
  }
  .add_all_items.add_items_all {
    width: 100%;
  }
}
@media (max-width: 399px) {
  .Add-all {
    margin-right: 1px;
  }
  .inner-row {
    padding: 0px 8px 0 4px;
  }
  .row-recomended_item-row {
    margin: 0;
    padding-left: 0px;
    padding-right: 4px;
  }
  .mb-price {
    font-size: 5px !important;
  }
  .adhesive-text {
    font-size: 13px;
  }
  .adhesive_input {
    justify-content: space-evenly;
  }
  .recomended_products .recomended_item .add-all-button {
    max-width: 136px;
  }
  .symbol {
    font-size: 14px !important;
    letter-spacing: -1px;
  }
  .price {
    font-size: 14px !important;
  }
}
.vs__dropdown-toggle {
  height: 43px;
}
.vselected {
  margin-top: 24px;
}
</style>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 5;
}
.everything {
  background-color: #8c8c8e;
  overflow: auto;
  border-radius: 10px;
}
</style>
