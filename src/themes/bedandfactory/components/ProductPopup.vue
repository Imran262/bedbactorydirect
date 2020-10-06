<template>
  <div class="popup-product-main row">
    <div class="left-side popup_item-image col-md-4" :class="popItem.sku">
      <popup-image :image="image" />
    </div>
    <div class="right-side popup_item-detail col-md-8" :class="popItem.sku">
      <p class="popup_item_name" @click="prodClick">
        <router-link
          class="block no-underline product-link slider-custom-link"
          :to="popItem.url_path"
          data-testid="productLink"
        >
          {{ popItem.name }}
        </router-link>
      </p>
      <p class="product-amount">
        {{ popItem.finalPriceInclTax | price }}
      </p>
      <p class="product-save-amount" v-if="popItem.specialPrice">
        <span>Was: {{ popItem.original_price_incl_tax | price }}</span>
        Save: {{ popItem.original_price_incl_tax - popItem.special_price_incl_tax | price }}
      </p>
      <div class="stock-main">
        <img src="/assets/checkout-non-selected-tick.png">
        <span v-if="popItem.stock.is_in_stock == true">In Stock</span>
        <span v-else-if="popItem.stock.is_in_stock == false">Out of Stock</span>
      </div>
      <div class="poup-btn-cart-main">
        <popup-btn :product="popItem" class="poup-btn-cart" :prod-id="popItem.sku" />
      </div>
    </div>
    <div class="col-md-12 successfull-added" :data-success-attr="popItem.sku">
      <div class="success-content-main">
        <div class="success-tick">
          <img src="/assets/checkout-non-selected-tick.png">
        </div>
        <div class="success-prod-name">
          <span>{{ popItem.name }}</span> - is added to your cart
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PopupImage from 'theme/components/PopupImage';
import PopupBtn from 'theme/components/PopupBtn';
import { onlineHelper, isServer } from '@vue-storefront/core/helpers';
import {
  getThumbnailForProduct,
  getProductConfiguration
} from '@vue-storefront/core/modules/cart/helpers';
export default {
  name: 'ProductPopup',
  data() {
    return {
      maxQuantity: 0,
      quantityError: false,
      isStockInfoLoading: false
    };
  },
  components: {
    PopupImage,
    PopupBtn
  },
  props: {
    popItem: {
      type: Object,
      required: true
    }
  },
  computed: {
    isOnline(value) {
      return onlineHelper.isOnline;
    },
    image() {
      return {
        loading: this.thumbnail,
        src: this.thumbnail
      };
    },
    thumbnail() {
      return getThumbnailForProduct(this.popItem);
    }
  },
  methods: {
    prodClick() {
      this.$bus.$emit('modal-hide', 'modal-switcher');
      document
        .getElementsByClassName('mobile-bottom-row-popup')[0]
        .classList.toggle('bottom-row-hidden');
    }
  }
};
</script>
<style scoped>
.popup-product-main {
  border-right: 1px solid #737c77;
  padding: 0 8px;
  margin-right: 0;
  margin-left: 0;
  height: 100%;
}

.popup-product-col:nth-child(3n) .popup-product-main {
  border-right: 0px solid #737c77;
}

p.popup_item_name {
  margin: 0;
  font-size: 11px;
  font-family: 'Poppins', sans-serif;
  color: #54575b;
  text-align: left;
  font-weight: 600;
  text-transform: capitalize;
  min-height: 45px;
}
p.popup_item_name:hover a {
  color: #00998c;
}
.left-side.popup_item-image {
  width: 30%;
  display: inline-block;
}

.right-side.popup_item-detail {
  display: inline-block;
}

p.product-amount {
  font-size: 18px;
  font-family: 'Poppins', sans-serif;
  color: #d10000b8;
  text-align: left;
  font-weight: 700;
  margin: 5px 0px;
}

.stock-main img {
  width: 12px;
  background: #00998c;
  padding: 4px 2px;
  float: left;
}

.stock-main span {
  font-size: 11px;
  font-weight: 600;
  color: #747c77;
  text-transform: uppercase;
  display: inline-block;
  margin-top: 5px;
  padding-left: 5px;
}
.successfull-added {
  display: none;
}
.successfull-added {
  display: none;
}
.successfull-added.showed {
  display: block;
}
.success-content-main {
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
}

.success-content-main .success-tick img {
  display: inline-block;
  background: #00998c;
  border-radius: 50%;
  padding: 12px 7px;
}

.success-prod-name span {
  text-transform: capitalize;
  font-weight: 600;
  font-size: 14px;
}
.left-side.popup_item-image.podElementHide {
  display: none;
}
.right-side.popup_item-detail.podElementHide {
  display: none;
}
@media (max-width: 767px) {
  .right-side.popup_item-detail {
    display: inline-block;
    width: 60%;
    padding: 0px 5px 0px 10px;
  }
  .popup-product-main {
    border-right: 0px solid #737c77;
  }
  p.popup_item_name {
    min-height: auto;
  }
}
</style>
