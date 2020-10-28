<template>
  <div class="addtocart-popups">
    <modal
      name="modal-switcher"
      :width="950"
      @popInterface="handlePopupAfteBack"
    >
      <p slot="header" />
      <div slot="content" class="popup-modal-content">
        <div class="popup-content-container">
          <div class="row popup-top-row">
            <div class="col-md-3 tick-col-main">
              <label class="added-tick">
                <img src="/assets/checkout-non-selected-tick.png" />
              </label>
              <span class="added-text">Item Added to Basket</span>
            </div>
            <div class="col-xs-3 col-md-2 mainprod-image-col">
              <template v-if="variantSkuProduct">
                <popup-image :image="variantImage" />
              </template>
              <template v-else>
                <popup-image :image="image" />
              </template>
            </div>
            <div class="col-xs-9 col-md-7">
              <template v-if="variantSkuProduct">
                <p class="popup-prod-name">{{ variantProdutName }}</p>
              </template>
              <template v-else>
                <p class="popup-prod-name">{{ product.name }}</p>
              </template>
              <template v-if="variantSkuProduct">
                <p class="product-amount">{{ priceValue | price }}</p>
              </template>
              <template v-else>
                <p class="product-amount">
                  {{ (product.finalPriceInclTax + priceValue) | price }}
                </p>
                <p class="product-save-amount" v-if="product.specialPrice">
                  <span
                    >Was:
                    {{
                      (product.original_price_incl_tax + priceValue) | price
                    }}</span
                  >
                  Save:
                  {{
                    (product.original_price_incl_tax -
                      product.special_price_incl_tax +
                      priceValue)
                      | price
                  }}
                </p>
              </template>
              <div class="stock-main">
                <img src="/assets/checkout-non-selected-tick.png" />
                <span v-if="product.stock.is_in_stock == true">In Stock</span>
                <span v-else-if="product.stock.is_in_stock == false"
                  >Out of Stock</span
                >
              </div>
            </div>
          </div>
          <div
            class="row essentials-heading"
            v-if="popupProducts && popupProductSku.length > 0"
          >
            <h4 class="essentials-prod-heading">
              Essential Items
              <span class="essentials-sub-heading"
                >You may require these for installation.</span
              >
            </h4>
            <h4 class="essentials-prod-heading mobile-essentials-prod-heading">
              <span class="essentials-sub-heading"
                >You may require these for installation.</span
              >
              Essential Items
            </h4>
          </div>
          <div
            class="row essentials-products"
            v-if="popupProducts && popupProductSku.length > 0"
          >
            <div
              v-for="(popup_item, popup_index) in popupProductSku"
              :key="popup_index"
              :id="popup_item.sku"
              class="col-md-4 popup-product-col"
            >
              <product-popup
                :productOptions="productOptions"
                :pop-item="popup_item"
              />
            </div>
          </div>
          <div class="row bottom-row-popup">
            <div class="col-md-5">
              <p class="basket-info">
                <span class="basket-item-count"
                  >Basket: {{ totalQuantity }}</span
                >
                <span class="basket-items-label">Item(s) -</span>
                <span class="basket-items-total" v-if="subTotal !== undefined">
                  <span class="subtotal" v-if="subTotal"
                    >&#163;{{ subTotal }}</span
                  >
                </span>
              </p>
            </div>
            <div class="col-md-7">
              <div class="footer-btns-links">
                <button class="btn-shopping" @click="popupclose">
                  Continue Shopping
                </button>
                <router-link
                  :to="localizedRoute('/checkout')"
                  class="no-underline cl-secondary link btn-checkout"
                >
                  <button class="btn-checkout" @click="popupclose">
                    PROCEED to checkout
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <div class="bottom-row-popup mobile-bottom-row-popup" ref="mobBtnLinks">
      <div class="col-md-12">
        <div class="footer-btns-links">
          <button class="btn-shopping" @click="popupclose">
            CONTINUE SHOPPING
          </button>
          <router-link
            :to="localizedRoute('/checkout')"
            class="no-underline cl-secondary link btn-checkout"
          >
            <button class="btn-checkout" @click="popupclose">
              PROCEED to checkout
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import PopupImage from "theme/components/PopupImage";
import Modal from "theme/components/core/Modal.vue";
import ProductPopup from "theme/components/ProductPopup";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import {
  getThumbnailPath,
  productThumbnailPath,
} from "@vue-storefront/core/helpers";
import {
  getThumbnailForProduct,
  getProductConfiguration,
} from "@vue-storefront/core/modules/cart/helpers";

export default {
  name: "PopupCart",
  data() {
    return {
      popupProductSku: [],
      itemThumbnail: [],
      componentLoaded: false,
      variantSkuProduct: "",
      variantProdutName: "",
    };
  },
  components: {
    PopupImage,
    Modal,
    ProductPopup,
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    subTotal() {
      const cartTotals = this.cartTotals.find((seg) => seg.code === "subtotal");
      console.log("cartTotalscartTotals", cartTotals);
      if (cartTotals) {
        return cartTotals.value;
      }
    },
    ...mapGetters({
      productsInCart: "cart/getCartItems",
      totalQuantity: "cart/getItemsTotalQuantity",
      cartTotals: "cart/getTotals",
    }),
    image() {
      return {
        loading: this.thumbnail,
        src: this.thumbnail,
      };
    },
    variantImage() {
      return {
        loading: this.variantThumbnail,
        src: this.variantThumbnail,
      };
    },
    thumbnail() {
      return getThumbnailForProduct(this.product);
    },
    variantThumbnail() {
      return getThumbnailForProduct(this.variantSkuProduct);
    },
    popupProducts() {
      // console.log('productsInCart', this.productsInCart);

      if (this.productsInCart) {
        var cartItemArray = new Array(0);
        var cartProduct_obj_sku = this.productsInCart.map((item) => item.sku);
      }
      // console.log('cartItemArraycartItemArray', cartProduct_obj_sku);
      let finalData_obj = "";
      let sku_array = [];
      let finalPop_obj_sku = [];
      if (this.product.product_links) {
        console.log("NOrmal Product");
        let product_links = this.product.product_links;
        console.log("product_links", product_links);
        finalPop_obj_sku = product_links
          .filter((item) => item.link_type === "crosssell")
          .map((item) => item.linked_product_sku);
      } else {
        console.log("Variant Product", this.variantSkuProduct);
        if (this.variantSkuProduct) {
          let product_links = this.variantSkuProduct.product_links;
          finalPop_obj_sku = product_links
            .filter((item) => item.link_type === "crosssell")
            .map((item) => item.linked_product_sku);
        }
      }
      console.log("finalPop_obj_sku", finalPop_obj_sku);
      // return;
      if (finalPop_obj_sku) {
        // console.log('if_finalPop_obj_sku');
        const finalSkusArray = finalPop_obj_sku.filter(
          (singleDate) => !cartProduct_obj_sku.includes(singleDate)
        );
        return finalSkusArray;
      } else {
        const finalSkusArray = "";
        return finalSkusArray;
      }
    },
  },
  async mounted() {
    this.$nextTick(() => {
      this.componentLoaded = true;
      this.$bus.$emit("modal-show", "modal-switcher");
    });
    if (this.variantSku) {
      const variantSkuPro = await this.getProduct({
        options: { sku: this.variantSku },
        setCurrentProduct: false,
        setCurrentCategoryPath: false,
        selectDefaultVariant: false,
      });
      this.variantSkuProduct = variantSkuPro;
      this.variantProdutName = variantSkuPro.name;
    }
    if (this.popupProducts) {
      var popup_arr = [];
      this.popupProducts.forEach(async (item) => {
        console.log("popupProductsItem", item);
        const popup_product = await this.getProduct({
          options: { sku: item },
          setCurrentProduct: false,
          setCurrentCategoryPath: false,
          selectDefaultVariant: false,
        });
        // console.log('popupProductsP_p', popup_product);
        popup_arr.push(popup_product);
        const thumbnail = productThumbnailPath(popup_product);
        Vue.set(
          this.itemThumbnail,
          item,
          getThumbnailPath(thumbnail, 280, 280)
        );
      });
      this.popupProductSku = popup_arr;
    }
  },
  watch: {
    async popupProducts() {
      // var popup_arr = [];
      // this.popupProducts.forEach(async item => {
      //   console.log('popupProducts', item);
      //   const popup_product = await this.getProduct({
      //     options: { sku: item },
      //     setCurrentProduct: false,
      //     setCurrentCategoryPath: false,
      //     selectDefaultVariant: false
      //   });
      //   console.log('popupProductsP_p', popup_product);
      //   popup_arr.push(popup_product);
      //   const thumbnail = productThumbnailPath(popup_product);
      //   Vue.set(
      //     this.itemThumbnail,
      //     item,
      //     getThumbnailPath(thumbnail, 280, 280)
      //   );
      // });
      // this.popupProductSku = popup_arr;
    },
  },
  methods: {
    ...mapActions({
      getProduct: "product/single",
    }),
    handlePopupAfteBack(event) {
      // console.log('handlePopupAfteBackhandlePopupAfteBack ', event);
      this.$emit("popInterface", 0);
    },
    close() {
      var x = document.getElementsByTagName("BODY")[0];
      x.style.overflow = "scroll";
      this.$bus.$emit("modal-hide", "modal-switcher");
    },
    popupclose() {
      clearAllBodyScrollLocks();
      this.$bus.$emit("modal-hide", "modal-switcher");
      this.$emit("popInterface", 0);
    },
  },
  props: {
    productOptions: {
      required: true,
      type: Array,
    },
    product: {
      required: true,
      type: Object,
    },
    priceValue: {
      type: Number,
      default: 0,
    },
    variantSku: {
      type: String,
      default: "",
    },
  },
};
</script>
<style scoped>
.cart-popup {
  position: absolute;
  z-index: 9;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: 90%;
  max-width: 1100px;
  text-align: center;
  background: #fff;
  border: 1px solid #cacaca;
  top: 5%;
  padding: 0px 20px 60px 20px;
  background: #f4f8fb;
}
.cart-popup .popup-sliders {
  margin-bottom: 15px;
}
.row.popup-top-row {
  padding: 0 0 10px 0;
}
h4.popup-heading {
  font-family: "Poppins", sans-serif;
  color: #54575b;
  text-transform: initial;
  margin: 0;
  padding: 25px 15px;
  font-size: 20px;
  text-align: left;
  margin-bottom: 20px;
  margin-left: -15px;
}
.cart-popup .product-detail {
  padding: 0px 10px;
}
.cart-popup .VueCarousel {
  background: #f4f8fb !important;
}
p.popup-prod-name {
  margin: 0;
  font-size: 14px;
  font-family: "Poppins", sans-serif;
  color: #54575b;
  text-align: left;
  font-weight: 600;
}
/* .popup-sliders{
  background:red !important;
} */
p.sku {
  color: #7d8997;
  text-transform: uppercase;
  font-weight: 600;
  text-align: left;
}
p.amount {
  color: #7d8997;
  text-transform: uppercase;
  font-weight: 600;
  text-align: left;
  font-size: 25px;
  margin: 0px;
}
p.save-amount {
  text-align: left;
  color: #ee5954;
  margin-top: 10px;
}
p.save-amount span {
  color: #7d8997;
  text-decoration: line-through;
  margin-right: 5px;
}
span.cross-popup {
  border: 1px solid #ee5954;
  cursor: pointer;
  border-radius: 50%;
  height: 25px;
  width: 25px;
  background: #ee5954;
  color: #fff;
  position: absolute;
  right: -15px;
  top: -15px;
  font-size: 18px;
  text-align: center;
}
.basket-detail {
  background: #f0f1f2;
  padding: 15px 20px;
  margin-top: -35px;
  position: relative;
}
.basket-detail p {
  color: #5f6061;
  text-align: right;
}
.basket-detail p .subtotal {
  font-weight: 700;
  color: #ee5954;
  font-size: 22px;
  margin-left: 10px;
}
.basket-detail img {
  width: 40px;
}
.basket-detail .btn-shopping {
  width: 100%;
  background: transparent;
  box-shadow: none;
  margin-bottom: 10px;
  border: 3px solid #5f6061;
  border-radius: 5px;
  padding: 7px;
  font-weight: 700;
  font-size: 16px;
  color: #5f6061;
}
.basket-detail .btn-checkout {
  width: 100%;
  background: #00998c;
  box-shadow: none;
  margin-bottom: 10px;
  border: 3px solid #00998c;
  border-radius: 5px;
  padding: 7px;
  font-weight: 700;
  font-size: 16px;
  color: #ffffff;
}
.basket-detail .minicart-count {
  top: 31px;
  left: auto;
  width: 20px;
  height: 20px;
  background-color: #0f988b;
  color: #fff;
  border-radius: 3px;
  font-size: 0.8rem;
  font-family: "Poppins", sans-serif;
  right: 15px;
}
@media (max-width: 767px) {
  .cart-popup {
    top: 20%;
  }
  span.cross-popup {
    right: -3px;
  }
  .basket-detail {
    margin-top: 20px;
  }
  p.popup-prod-name {
    text-align: left;
  }
  p.sku {
    text-align: left;
  }
  p.amount[data-v-e6253676] {
    text-align: left;
  }
  .cart-popup .product-image {
    padding-bottom: 300px !important;
  }
}
.overlay-popup {
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 4;
}
@media (min-width: 991px) {
  .cart-popup .product-image {
    padding-bottom: 100% !important;
  }
}
/* Popup Content Area New*/
label.added-tick img {
  width: 12px;
  background: #00998c;
  padding: 4px 2px;
  float: left;
}

span.added-text {
  color: #54575b;
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 28px;
  position: absolute;
  width: 18%;
  line-height: 28px;
  margin-top: -3px;
  margin-left: 10px;
}
p.product-amount {
  font-size: 18px;
  font-family: "Poppins", sans-serif;
  color: #d10000b8;
  text-align: left;
  font-weight: 700;
  margin: 5px 0px;
}

.addtocart-popups .stock-main img {
  width: 12px;
  background: #00998c;
  padding: 4px 2px;
  float: left;
}

.addtocart-popups .stock-main span {
  font-size: 11px;
  font-weight: 600;
  color: #54575b;
  text-transform: uppercase;
  display: inline-block;
  margin-top: 5px;
  padding-left: 5px;
}
h4.essentials-prod-heading {
  font-family: "Poppins", sans-serif;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  display: block;
  width: 100%;
  background: #54575b;
  padding: 10px 8px;
  margin: 0;
}
span.essentials-sub-heading {
  padding-left: 35px;
  font-weight: 600;
  font-size: 14px;
}
span.basket-item-count {
  color: #737c77;
  font-family: "Poppins", sans-serif;
  font-weight: 700;
}

span.basket-items-label {
  color: #737c77;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
}

span.basket-items-total {
  color: #737c77;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
}

.popup-product-col {
  padding: 10px 0 10px 0px;
  border-bottom: 1px solid #737c77;
}

.row.bottom-row-popup {
  border: 2px solid #fff;
  box-shadow: 0px 0 10px 0px #737c77;
}
button.btn-shopping {
  border: 1px solid #737c77;
  margin: 15px 0px;
  color: #fff;
  background: #737c77;
  font-family: "Poppins", sans-serif;
  padding: 5px 15px;
  text-transform: uppercase;
}

a.btn-checkout button {
  border: 1px solid #00998c;
  margin: 15px 0px;
  color: #fff;
  background: #00998c;
  font-family: "Poppins", sans-serif;
  padding: 5px 15px;
  text-transform: uppercase;
}

.footer-btns-links {
  text-align: right;
}
.row.essentials-products {
  max-height: 490px;
  overflow-y: auto;
}
h4.essentials-prod-heading.mobile-essentials-prod-heading {
  display: none;
}
.bottom-row-popup.mobile-bottom-row-popup {
  display: none;
}
.bottom-row-hidden {
  display: none !important;
}
/* Popup Content Area New*/
@media (max-width: 767px) {
  h4.essentials-prod-heading {
    display: none;
  }
  span.added-text {
    width: 90%;
    position: relative;
  }
  span.essentials-sub-heading {
    display: block;
    padding-left: 0;
  }
  .tick-col-main {
    margin-bottom: 30px;
  }
  .row.essentials-products {
    max-height: 100%;
    overflow-y: auto;
  }
  button.btn-shopping {
    width: 48%;
    padding: 10px 0px !important;
    float: left;
    font-size: 11px;
  }

  a.btn-checkout {
    width: 48%;
    padding: 0 !important;
    display: inline-block;
  }

  a.btn-checkout button.btn-checkout {
    padding: 10px 0px;
    font-size: 11px;
    width: 100%;
  }
  .row.bottom-row-popup {
    display: none;
  }
  .bottom-row-popup.mobile-bottom-row-popup {
    display: block;
    position: fixed;
    width: 100%;
    bottom: 0px;
    background: #fff;
    left: 0;
    z-index: 99;
  }
  .bottom-row-popup.mobile-bottom-row-popup button.btn-shopping {
    margin: 15px 0px 55px 0px;
  }
  h4.essentials-prod-heading.mobile-essentials-prod-heading {
    display: block;
    background: #fff;
    color: #54575b;
    border-bottom: 1px solid #737c77;
  }

  h4.essentials-prod-heading.mobile-essentials-prod-heading
    span.essentials-sub-heading {
    background: #54575b;
    text-align: center;
    padding: 10px 5px;
    color: #fff;
    margin-bottom: 15px;
  }
  .bottom-row-hidden {
    display: none !important;
  }
}
</style>
<style>
/*Popup Main */
.addtocart-popups header.modal-header {
  background: #fff;
  padding: 0;
}

.addtocart-popups header.modal-header p {
  display: none;
}

.addtocart-popups header.modal-header i.modal-close {
  position: absolute;
  right: 0;
  background: #fff;
  top: -25px;
  padding: 5px 5px;
}
.addtocart-popups .modal-content {
  padding: 15px 8px 0px 8px !important;
}
@media (max-width: 767px) {
  .addtocart-popups .modal .modal-header {
    padding: 0px !important;
  }
  .addtocart-popups header.modal-header i.modal-close {
    top: 0px;
  }
  .addtocart-popups .modal-content {
    padding: 30px 8px 110px 8px !important;
  }
}
@media (min-width: 767px) and (max-width: 1050px) {
  .footer-btns-links {
    text-align: left !important;
  }
}
/*Popup Main */
</style>
