<template>
  <div class="sb-product-sqm">
    <h2 class="price-room-title-added">
      Select your recommended accessories:
      <br />
    </h2>
    <label>Qty</label>
    <template v-if="underlayProducts && underlayProducts.length > 0">
      <vinyl-item
        v-for="(item, index) in underlayProducts"
        :key="index"
        :item="item"
        :product-in-cart="productInCartChecked(item)"
        @sendValueToTotalPrice="vinylPrice"
      />
    </template>
    <template v-if="recommendations && recommendations.length > 0">
      <vinyl-item
        v-for="item in recommendations"
        :key="item.id"
        :item="item"
        :product-in-cart="productInCartChecked(item)"
        @sendValueToTotalPrice="vinylPrice"
      />
    </template>
    <div class="vinyl_product_toggle">
      <div class="vinyl_product_total_sqm_main">
        <div class="vinyl_product_total_sqm_heading">
          <span>Packs Required</span>
        </div>
        <div class="vinyl_product_total_sqm">
          <span v-if="boxSqm != '0.00'" class="vinyl_product_calculate_sqm">
            <span v-if="!isNaN(boxQuantity)">{{ boxQuantity }}</span>
            <!-- <span v-else>0</span> -->
            (
            <span v-if="!isNaN(boxSqm)">{{ boxSqm }}</span
            >m<sup>2</sup>)
          </span>
          <span v-else class="vinyl_product_calculate_sqm">
            <span> 0 </span>
            <!-- <span v-else>0</span> -->
            (
            <span> 0.00 </span>m<sup>2</sup>)
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VinylItem from './VinylItem'
import { mapGetters } from 'vuex'
export default {
  name: 'VinylRecommendationItem',
  components: {
    VinylItem
  },
  props: {
    product: {
      required: true,
      type: Object
    },
    boxSqm: {
      required: true,
      type: [ String, Number ]
    },
    underlayProducts: {
      required: true,
      type: Array
    },
    recommendations: {
      required: true,
      type: Array
    },
    sqmQuantity: {
      required: true,
      type: [ String, Number ]
    }
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems'
    }),
    boxQuantity () {
      if(this.product.box_qty) {
        return Math.ceil(this.product.qty / (parseInt(this.product.box_qty)))
      } else {
        return Math.ceil(this.product.qty)
      }
    }
  },
  methods: {
    vinylPrice (priceandQty) {
      let calculatePrice = (priceandQty.price * priceandQty.qty).toFixed(2)
      this.$emit('vinylPriceAndQty', calculatePrice)
    },
    productInCartChecked (product) {
      const inCart = this.productsInCart.filter((item) => {
        return item.sku === product.sku
      })
      if(inCart.length > 0) {
        return true
      } else {
        return false
      }
    }
  }
};
</script>
<style scoped>
.sb-product-sqm {
  width: 100%;
  position: relative;
}
.sb-product-sqm label {
  position: absolute;
  right: 115px;
  top: -8px;
  font-size: 14px;
  color: #2a275c;
  font-weight: bold;
  margin: 10px 0;
  font-family: 'Arial', serif;
}
.price-room-title-added {
  font-size: 14px;
  color: #2a275c;
  font-weight: bold;
  margin: 10px 0;
  font-family: 'Arial', serif;
}
.vinyl_product_total_sqm_heading {
  font-family: 'Arial', serif;
}
.vinyl_product_total_sqm_main {
  background: #d5d5d5;
  padding: 10px;
  margin-top: 4px;
  float: right;
  width: 150px;
  text-align: center;
}
.vinyl_product_toggle .sb-add-to-box-button {
  float: left;
  width: auto !important;
}
.sb-product-total-price {
  color: #29275b;
  font-size: 1.15rem;
  font-family: 'Arial', serif;
  font-weight: normal;
}
.sb-product-vat {
  color: #9b9b9b;
  font-size: 0.75rem;
  padding-left: 5px;
}
.vinyl_product_total_sqm {
  color: #6d6d6d;
  font-size: 18px;
  font-weight: bold;
}
@media (max-width: 767px) {
  .acc-quan-price-added .price {
    font-size: 18px;
  }
  .sb-product-sqm label {
    display: none;
  }
}
@media (min-width: 1200px) and (max-width: 1330px) {
  .sb-product-sqm label {
    right: 20%;
  }
}
@media (min-width: 991px) and (max-width: 1200px) {
  .sb-product-sqm label[data-v-7fee7900] {
    right: 73px;
  }
}
@media (min-width: 767px) and (max-width: 991px) {
  .sb-product-sqm label {
    right: 154px;
  }
}
</style>
