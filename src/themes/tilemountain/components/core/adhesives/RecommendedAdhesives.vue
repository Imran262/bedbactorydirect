<template>
  <div>
    <div class="row m0">
      <div class="col-md-12 headingrow">
        <h5>
          {{ data.type }}
          <span v-if="adhesiveBtn" class="update"> -Basket Updated</span>
        </h5>
      </div>
    </div>
    <div class="row m0">
      <div class="col-lg-8 col-xs-12 col-sm-12 col-xs-5 prow">
        <p :class="[adhesiveBtn ? 'pcolor' : '']">
          {{ fetchedAdhesiveProductProperties.name }}
        </p>
      </div>
      <div class="col-lg-4 col-xs-12 col-sm-12 col-xs-7 iteminput">
        <p class="pricep" :class="[adhesiveBtn ? 'pcolor' : '']">
          &#163;{{ priceOfAdhesive }}
        </p>
        <input
          type="tel"
          maxlength="5"
          name="adhesiveInput"
          ref="adhesiveInput"
          v-model="adhesiveInput"
          @keypress="isNumber($event)"
          class="modalinput"
          :class="adhesiveBtn ? 'pcolor' : ''"
        />
        <button
          class="addbtn"
          :class="adhesiveBtn ? 'btnclicked' : ''"
          :disabled="disableAdhesive"
          @click="addedAdhesiveToBasket()"
        >
          <span v-if="adhesiveBtn">
            <img class="tick" src="/assets/tick.svg" alt="tick"
          /></span>
          <span v-else>Add</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getProductPrimaryCategory } from '@vue-storefront/core/helpers';
import { MeasureProductClick } from 'src/modules/google-gtag/mixins/MeasureProductClick';

export default {
  name: 'RecommendedAdhesives',
  props: {
    data: {
      required: true,
      type: [Array, Object]
    },
    product: {
      required: true,
      type: [Array, Object]
    },
    selectedFixing: {
      required: true,
      type: String
    },
    selectedMadeOf: {
      required: true,
      type: String
    },
    selectedGroutJoint: {
      required: true,
      type: [String, Object]
    },
    cartItemId: {
      required: true,
      type: [Number, String]
    },
    disabledCheck: {
      required: true,
      type: String,
      default: ''
    }
  },
  data () {
    return {
      fetchedAdhesiveProductProperties: {
        name: '',
        price: ''
      },
      adhesiveInput: 1,
      adhesiveProduct: '',
      adhesiveBtn: false,
      disableAdhesive: false,
      priceOfAdhesive: 0,
      payload: {
        'data': []
      }
    }
  },
  mixins: [MeasureProductClick],
  mounted () {
    this.getAdhesiveProduct()
    if (this.disabledCheck === 'Yes') {
      this.disableAdhesive = true
      this.adhesiveBtn = true
      this.$emit('show-adhesive-section', {
        check: true,
        productId: this.data.product_id
      })
    }
    if (this.disabledCheck === 'No') {
      this.disableAdhesive = false
      this.adhesiveBtn = false
      this.$emit('show-adhesive-section', {
        check: false,
        productId: this.data.product_id
      })
    }
  },
  computed: {
    ...mapGetters({
      getCartToken: 'cart/getCartToken',
      productsInCart: 'cart/getCartItems'
    })
  },
  watch: {
    data (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal.sku && oldVal.sku && newVal.sku !== oldVal.sku) {
          this.getAdhesiveProduct();
        }
        this.adhesiveInput = this.data.qty;
      }
    },
    adhesiveInput (newQty, oldQty) {
      if (newQty !== oldQty) {
        this.priceOfAdhesive = (this.fetchedAdhesiveProductProperties.price * this.adhesiveInput).toFixed(2);
        this.$emit('quantity-of-input', {
          qty: this.adhesiveInput,
          productID: this.adhesiveProduct.id
        })
      }
    },
    priceOfAdhesive (newVal, oldVal) {
      if (newVal !== oldVal && !this.disableAdhesive) {
        this.$emit('price-of-adhesive', {
          price: newVal,
          productID: this.adhesiveProduct.id
        })
      }
    },
    disabledCheck (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (this.disabledCheck === 'Yes') {
          this.disableAdhesive = true;
          this.adhesiveBtn = true;
          this.$emit('show-adhesive-section', {
            check: true,
            productId: this.data.product_id
          })
          this.$emit('price-of-adhesive', {
            price: 0,
            productID: this.data.product_id
          })
        }
        if (this.disabledCheck === 'No') {
          this.disableAdhesive = false;
          this.adhesiveBtn = false;
          this.$emit('show-adhesive-section', {
            check: false,
            productId: this.data.product_id
          })
          this.$emit('price-of-adhesive', {
            price: this.priceOfAdhesive,
            productID: this.data.product_id
          })
        }
      }
    }
  },
  methods: {
    isNumber (evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault()
      } else {
        return true;
      }
    },
    getProductOrCategoryPageMetaInfo (obj = this) {
      // console.log('selectedObj', obj?.$options?.name);
      if (obj && (!obj.$options || !obj.$options.name || obj.$options.name !== 'DefaultLayout') && obj.$parent) {
        return this.getProductOrCategoryPageMetaInfo(obj.$parent);
      }
      if (obj?.$options?.name === 'DefaultLayout') {
        let component = obj.$children.find(c => ['ProductPage', 'CategoryPage', 'HomePage'].includes(c?.$options?.name))
        return { name: component?.$options?.name, meta: { ...component.$metaInfo } }
      }
    },
    async addedAdhesiveToBasket () {
      if (!this.adhesiveProduct || !this.adhesiveProduct.stock) {
        await this.getProduct()
      }

      // if (this.product && this.product?.name) {
      //   let page = this.getProductOrCategoryPageMetaInfo();
      //   let productCat = getProductPrimaryCategory(this.product);
      //   console.log('productCategorySelectedIs', productCat);
      //   this.$bus.$emit('sendAddCartProdClick', {
      //     product: this.product,
      //     page,
      //     priceFromTotals: false,
      //     category: productCat
      //   });
      // }
      this.adhesiveBtn = true
      this.payload.data.push({
        product_id: this.product.id,
        item_id: this.cartItemId,
        quote_id: this.getCartToken,
        recomm_id: this.adhesiveProduct.id,
        total_qty: 2,
        recomm_qty: this.adhesiveInput,
        fixing_type: this.selectedFixing,
        applied_material: this.selectedMadeOf,
        grout_width: this.selectedGroutJoint
      })
      this.payload.data.apply_discount = true
      // TODO: Need to implement method for feature
      // this.payload.data.cartId = this.cartId;
      // if (!this.cartId) {
      //   await this.$store.dispatch('cart/createCartId', {
      //     productToAdd: this.product
      //   });
      //   this.payload.cartId = this.getCartToken;
      // }
      let updatedObjectValues = {}
      this.payload.data.forEach((value, index) => {
        updatedObjectValues[index] = value
      })
      updatedObjectValues.apply_discount = false
      updatedObjectValues.total_recommendations = 133
      try {
        await this.$store.dispatch('groutadhesive/groutAdhesiveAddRecommendationsFunction', { data: updatedObjectValues }).then(async res => {
          let response = JSON.parse(res)
          if (response.success) {
            this.disableAdhesive = true
            this.pullCartSync()
            this.$bus.$emit('carPageUpdate', {
              productId: 0
            })
            this.$emit('price-of-adhesive', {
              price: 0,
              productID: this.adhesiveProduct.id
            })
            console.log('add_to_cart_should_be_called', res, this.adhesiveProduct);
            let page = this.getProductOrCategoryPageMetaInfo();
            let productCat = getProductPrimaryCategory(this.adhesiveProduct);

            await this.sendAddCartProdClick({
              product: this.adhesiveProduct,
              page,
              priceFromTotals: false,
              category: productCat
            })
          }
        })
      } catch (message) {
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
    async getAdhesiveProduct () {
      this.adhesiveInput = this.data.qty;
      const product = await this.getProduct();
      this.$emit('adhesive-product', {
        product_id: this.product.id,
        item_id: this.cartItemId,
        quote_id: this.getCartToken,
        recomm_id: this.adhesiveProduct.id,
        total_qty: 2,
        recomm_qty: this.adhesiveInput,
        fixing_type: this.selectedFixing,
        applied_material: this.selectedMadeOf,
        grout_width: this.selectedGroutJoint
      });
      this.fetchedAdhesiveProductProperties.name = product.name;
      this.fetchedAdhesiveProductProperties.price = product.priceInclTax;
      this.priceOfAdhesive = (product.priceInclTax * this.adhesiveInput).toFixed(2)
      if (product && product.id && !this.disableAdhesive) {
        this.$emit('price-of-adhesive', {
          price: this.priceOfAdhesive,
          productID: product.id
        })
      }
      return product;
    },
    async getProduct () {
      this.adhesiveProduct = await this.$store.dispatch('product/single', {
        options: { sku: this.data.sku },
        setCurrentProduct: false,
        setCurrentCategoryPath: false,
        selectDefaultVariant: false
      })
      return this.adhesiveProduct
    }
  }
}
</script>

<style lang="scss" scoped>
.headingrow h5 {
  margin: 0;
  font-family: Arial;
  font-size: 15px;
  font-weight: bold;
  padding-bottom: 4px;
  color: #29275B;
  text-transform: capitalize;
}

.modalinput {
  border: 1px solid #ddd;
  height: 40px;
  width: 45px;
  border-radius: 6px;
  color: grey;
  text-align: center;
  line-height: 1.5;
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
  @media screen and (min-width: 1200px) {
    max-width: 62px;
    width: 100%;
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
    padding-left: 8px;
  }
  @media screen and (min-width: 501px) and (max-width: 767px) {
    font-size: 12px;
    padding-left: 8px;
  }
}

.iteminput {
  display: inline-flex;
  @media screen and (max-width: 992px) {
    justify-content: flex-end;
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
    line-height: 0;
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
  margin-top: -12px;
}

.pcolor {
  color: #d4d4de;
}

.btnclicked {
  background-color: #cccbd1 !important;
}
</style>
