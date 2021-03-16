<template>
  <div class="price-room-item-added row">
    <div class="acc-info-added col-xs-12 col-md-7">
      {{ item.name }} - {{ item.price | price }}
    </div>
    <div class="acc-quan-price-added col-xs-12 col-md-5">
      <p class="price">
        <span v-if="itemQty === 0">
          {{ 0.00 | price }}
        </span>
        <span v-else>
          {{ calculateItemPrice.toFixed(2) | price }}
        </span>
      </p>
      <div class="price-action-detail">
        <label>Qty</label>
        <div class="grid-action-added">
          <vinyl-item-quantity
            :value="itemQty"
            :min="0"
            :disable="itemDisable"
            :only-positive="false"
            @input="changedQuantity"
          />
        </div>
        <div class="grid-price-added">
          <button
            class="addBtn"
            :class="itemAddBtn ? 'btn-clicked' : ''"
            @click="addBtnVinylItem(item)"
            :disabled="productInCart"
          >
            <span v-if="itemAddBtn">
              <img class="tick" alt="tick" src="/assets/tick.svg"></span>
            <span v-else>Add</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VinylItemQuantity from './VinylItemQuantity';
export default {
  name: 'VinylItem',
  components: {
    VinylItemQuantity
  },
  data () {
    return {
      itemQty: 0,
      itemAddBtn: false,
      itemDisable: false
    }
  },
  props: {
    item: {
      required: true,
      type: Object
    },
    productInCart: {
      required: true,
      type: Boolean
    }
  },
  watch: {
    itemQty () {
      this.calculateItemPrice
    },
    productInCart (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (this.productInCart) {
          this.itemDisable = true
          this.itemAddBtn = true
        } else {
          this.itemDisable = false
          this.itemAddBtn = false
        }
      }
    }
  },
  mounted () {
    if (this.productInCart) {
      this.itemDisable = true
      this.itemAddBtn = true
    } else {
      this.itemDisable = false
      this.itemAddBtn = false
    }
  },
  computed: {
    calculateItemPrice () {
      return this.item.price * this.itemQty
    }
  },
  methods: {
    async addBtnVinylItem (item) {
      if (this.itemQty !== 0) {
        this.itemAddBtn = true;
        item.qty = this.itemQty
        await this.$store.dispatch('cart/addItem', {
          productToAdd: item
        });
        this.$emit('sendValueToTotalPrice', {
          price: this.item.price,
          qty: this.itemQty
        });
        this.itemDisable = true
        await this.pullCartSync()
      }
    },
    changedQuantity (val) {
      if (val && val === '' && isNaN(val)) {
        this.itemQty = 0
      } else {
        this.itemQty = parseFloat(val)
      }
    },
    async pullCartSync () {
      await this.$store.dispatch('cart/sync', {
        forceClientState: false,
        forceSync: true
      })
      await this.$store.dispatch('cart/syncTotals', { forceServerSync: true })
      this.$forceUpdate()
    }
  }
};
</script>

<style scoped>
.btn-clicked {
  background-color: #cccbd1 !important;
}
.addBtn{
  background: #00a799;
  color: #fff;
  border: none;
  padding: 10px 10px;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: bold;
  margin-left: 10px;
  font-family: Arial, Helvetica, sans-serif;
  width: 50px;
}
.addBtn img{
  height: 15px;
}
.price-room-item-added {
  margin-bottom: 15px;
  list-style: none;
  margin-top: 20px;
}
.acc-info-added {
  font-size: 14px;
  text-transform: uppercase;
  color: #4a4a4a;
  margin-top: 7px;
}
.sb-product-sqm {
  height: 30px !important;
  text-align: center !important;
  width: 30px !important;
  float: none !important;
  border: none !important;
  border-radius: 0px !important;
  font-weight: bold;
  color: #636363;
  margin-top: -4px;
}
.price-action-detail, .price{
  display: inline-block;
}
.grid-action-added, .grid-price-added{
  display: inline-block;
}
.acc-quan-price-added .price{
  margin: 0px;
  font-size: 14px;
  color: #2a275c;
  font-weight: bold;
  font-family: "Arial", serif;
  margin-right: 20px;
  width: 45px;
}
@media(min-width:767px){
  .price-action-detail label{
    display: none;
  }
}
@media(max-width: 767px){
  .acc-quan-price-added .price {
    font-size: 18px;
    margin-top: 15px;
  }
  .acc-info-added {
    margin-bottom: 15px;
  }
  .price-action-detail{
    float: right;
  }
  .acc-quan-price-added .price{
    float: left;
  }
  .price-action-detail label{
    font-size: 14px;
    color: #2a275c;
    font-weight: bold;
    font-family: "Arial", serif;
    position: relative;
    top: 4px;
    left: -6px;
  }
  .addBtn{
    padding: 12px 10px;
    border-radius: 6px;
    border: 2px solid #a1a1a1;
  }
}
@media(min-width:991px) and (max-width:1200px){
  .acc-quan-price-added .price {
    margin-right: 5px;
  }
  .addBtn {
    margin-left: 3px;
    width: 50px;
  }
}
</style>
