<template>
  <div>
    <div class="row m0">
      <div class="col-md-12 headingrow">
        <h5>
          {{ data.type }}
          <span v-if="groutBtn" class="update"> -Basket Updated</span>
        </h5>
      </div>
    </div>
    <div class="row m0  groutrow">
      <div
        class="col-lg-8 col-xs-12 col-sm-12 col-xs-5 prow"
        :class="!groutColors ? 'col-lg-8' : ''"
      >
        <p :class="[groutBtn ? 'pcolor' : '']">
          {{ fetchedGroutProductProperties.name }}
        </p>
      </div>
<!--      <div class="col-lg-2 col-sm-2 col-xs-4 secondcol" v-if="groutColors">-->
<!--        <v-select :options="groutColors" label="title" class="vselected">-->
<!--          <template-->
<!--            slot="option"-->
<!--            slot-scope="option"-->
<!--            class="template"-->
<!--          >-->
<!--            <img :src="option.cardImage" class="inputimage"/>-->
<!--             <label class="labelTest">{{ option.title }}</label>-->
<!--          </template>-->
<!--          <template #selected-option="{ cardImage }">-->
<!--            <div style="display: flex; align-items: baseline">-->
<!--              <img :src="cardImage"/>-->
<!--               <strong>{{ title }}</strong>-->
<!--            </div>-->
<!--          </template>-->
<!--        </v-select>-->
<!--      </div>-->
      <div class="col-lg-4 col-xs-12 col-sm-12 col-xs-7 iteminput">
        <p class="pricep" :class="[groutBtn ? 'pcolor' : '']">
          &#163;{{ priceOfGrout }}
        </p>
        <input
          type="tel"
          maxlength="5"
          name="groutInput"
          ref="groutInput"
          @keypress="isNumber($event)"
          v-model="groutInput"
          class="modalinput"
          :class="groutBtn ? 'pcolor' : ''"
        />
        <button
          class="addbtn"
          :class="groutBtn ? 'btnclicked' : ''"
          :disabled="disableGrout"
          @click="addedGroutToBasket()"
        >
          <span v-if="groutBtn">
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
import vSelect from 'vue-select'

export default {
  name: 'RecommendedGrouts',
  components: {
    vSelect
  },
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
      type: [String, Array]
    },
    selectedMadeOf: {
      required: true,
      type: [String, Array]
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
      groutColors: [],
      groutInput: 1,
      groutProduct: '',
      fetchedGroutProductProperties: {
        name: '',
        price: '',
        quantity: ''
      },
      groutBtn: false,
      disableGrout: false,
      priceOfGrout: 0,
      payload: {
        'data': []
      }
    }
  },
  async mounted () {
    await this.getGroutProduct()
    if (this.disabledCheck === 'Yes') {
      this.disableGrout = true
      this.groutBtn = true
      this.$emit('show-grout-section', {
        disable: true,
        productId: this.product.id
      })
    }
    if (this.disabledCheck === 'No') {
      this.disableGrout = false
      this.groutBtn = false
      this.$emit('show-grout-section', {
        disable: false,
        productId: this.product.id
      })
    }
  },
  computed: {
    ...mapGetters({
      getCartToken: 'cart/getCartToken'
    })
  },
  watch: {
    data (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.groutInput = this.data.qty;
      }
    },
    groutInput (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.priceOfGrout = (this.fetchedGroutProductProperties.price * this.groutInput).toFixed(2);
        this.$emit('price-of-grout', this.priceOfGrout)
      }
    },
    disabledCheck (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (this.disabledCheck === 'Yes') {
          this.disableGrout = true;
          this.groutBtn = true;
          this.$emit('show-grout-section', {
            disable: true,
            productId: this.product.id
          })
        }
        if (this.disabledCheck === 'No') {
          this.disableGrout = false;
          this.groutBtn = false;
          this.$emit('show-grout-section', {
            disable: false,
            productId: this.product.id
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
    async addedGroutToBasket () {
      if (!this.groutProduct || !this.groutProduct.stock) {
        await this.getProduct()
      }
      this.groutBtn = true
      this.payload.data.apply_discount = false
      this.payload.data.push({
        product_id: this.product.id,
        item_id: this.cartItemId,
        quote_id: this.getCartToken,
        recomm_id: this.groutProduct.id,
        total_qty: 2,
        recomm_qty: this.groutInput,
        fixing_type: this.selectedFixing,
        applied_material: this.selectedMadeOf,
        grout_width: this.selectedGroutJoint
      })
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
        await this.$store.dispatch('groutadhesive/groutAdhesiveAddRecommendationsFunction', { data: updatedObjectValues }).then((res) => {
          let response = JSON.parse(res)
          if (response.success) {
            if (this.product.id && this.groutProduct.id) {
              this.disableGrout = true
            }
            this.pullCartSync()
            this.$bus.$emit('carPageUpdate', true)
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
    async getGroutProduct () {
      this.groutInput = this.data.qty
      this.groutColors = this.data.grout_colors
      const product = await this.getProduct()
      this.$emit('grout-product', {
        product_id: this.product.id,
        item_id: this.cartItemId,
        quote_id: this.getCartToken,
        recomm_id: this.groutProduct.id,
        total_qty: 2,
        recomm_qty: this.groutInput,
        fixing_type: this.selectedFixing,
        applied_material: this.selectedMadeOf,
        grout_width: this.selectedGroutJoint
      });
      this.fetchedGroutProductProperties.name = product.name;
      this.fetchedGroutProductProperties.price = product.priceInclTax;
      this.priceOfGrout = (product.priceInclTax * this.groutInput).toFixed(2);
      this.$emit('price-of-grout', this.priceOfGrout)
      // this.fetchedGroutProductProperties.quantity = product.qty;
      return product;
    },
    async getProduct () {
      this.groutProduct = await this.$store.dispatch('product/single', {
        options: { sku: this.data.sku },
        setCurrentProduct: false,
        setCurrentCategoryPath: false,
        selectDefaultVariant: false
      })
      return this.groutProduct
    }
  }
}
</script>

<style lang="scss" scoped>
@media screen and (min-width: 992px){
  .groutrow{
  margin-bottom: 14px;
}
}
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
  color: grey;
  border-radius: 6px;
  text-align: center;
  line-height: 1.5;
  @media screen and (max-width: 767px) {
    border-radius: 3px;
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
    height: 30px  !important;
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
.vs__actions {
  display: none;
}
.v-select:before {
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
input.vs__search {
  padding: 0;
  margin: 0;
  width: 100%;
}
.vs__dropdown-option {
  padding: 3px 10px;
}
span.vs__selected {
  color: #9b9b9b;
  font-size: 12px;
}
.vs__selected img {
  position: absolute;
  left: 8px;
  top: 11px;
}
strong {
  line-height: 2.8;
  margin-left: 10px;
}
.vs--searchable .vs__dropdown-toggle {
  cursor: text;
  height: 43px;
  padding: 0;
}
.vs__selected-options {
  justify-content: center;
}
.vs__dropdown-menu {
  top: calc(100% - 13px);
  left: 8px;
  z-index: 1000;
  padding: 5px 0;
  margin: 0;
  width: 91.5%;
  overflow-y: visible;
  font-size: 12px;
}
img {
  vertical-align: bottom;
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
</style>
