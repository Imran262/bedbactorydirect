<template>
  <div
    class="sb-table-left"
    v-if="productsInCart.length > 0 && !isAdhesiveGroutItem"
  >
    <div class="row row-sb-left-padding">
      <CartProduct
        :products-in-cart="productsInCart"
        :product="product"
        :full-cart="true"
        :orignalprice="true"
        :min-sqm-value="minSqmValue"
        :adhesive-grout-items="adhesiveGroutItemsForSelectedProduct"
        @tile-quantity-updated="tileQuantityUpdated"
      />
      <!-- <div class="col-lg-12 col-md-12 sb-md-dropdown">
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import config from "config";
import Product from "@vue-storefront/core/compatibility/components/blocks/Microcart/Product";
import CartProduct from "./CartProduct";
import { ProductOption } from "@vue-storefront/core/modules/catalog/components/ProductOption";
import EditMode from "./EditMode";
import AdhesiveAndGroutDropDown from "theme/components/core/blocks/Microcart/AdhesiveAndGroutDropDown";

export default {
  name: "ProductCartPage",
  data() {
    return {
      maxQuantity: 0,
      groutProdDetail: {},
      adhesiveProdDetail: {},
      optionCheck: false,
      payload: {
        data: {
          product_id: "",
          item_id: "",
          fixing_type: "",
          applied_material: "",
          grout_width: "",
          total_qty: "",
          sqm: ""
        }
      },
      groutAdhesiveArray: [],
      sqmCheckForModelType: true,
      groutAdhesiveParentProducts: "",
      checkIfArraysAreloaded: false,
      minSqmValue: 0,
      groutAdhesiveChildData: [],
      sqmQuantity: 0,
      addPrice: 0,
      total: {}
    };
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    fullCart: {
      type: Boolean,
      default: false
    },
    orignalprice: {
      type: Boolean,
      default: false
    },
    cartAdhesiveGrout: {
      required: true,
      type: [Object, Array]
    },
    noGroutAdhesivesProduct: {
      required: true,
      type: Boolean
    },
    productsInCart: {
      required: true,
      type: [Array, Object]
    }
  },
  components: {
    AdhesiveAndGroutDropDown,
    CartProduct
  },
  mixins: [Product, ProductOption, EditMode],
  async mounted() {
    this.sqmQuantity = parseFloat(
      this.product.qty / this.product.qty_per_sqm
    ).toFixed(2);
    // this.loaderSet();
    // await this.checkIfProductHasGroutAndAdhesive();
    if (this.minSqmValue > this.sqmQuantity) {
      this.$bus.$emit("remove-grout-adhesive-section", {
        doesNotHasGroutAdhesiveSection: true,
        productId: this.product.id
      });
    }
    // this.$bus.$emit('minSqmValue', {
    //   minSqmVal: this.minSqmValue,
    //   sqm: parseFloat(this.sqmQuantity),
    //   productId: this.product.id
    // })
  },
  watch: {
    changeGroutAdhesive() {
      // this.loaderSet();
    },
    groutAdhesiveChildData(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit("grouts-adhesives", this.groutAdhesiveChildData);
      }
    },
    total(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit("add-all-total-price", this.total);
      }
    },
    productQuantity(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.sqmQuantity = parseFloat(
          this.product.qty / this.product.qty_per_sqm
        ).toFixed(2);
      }
    }
  },
  computed: {
    ...mapGetters({
      appliedCoupon: "cart/getCoupon",
      totals: "cart/getTotals"
    }),
    ...mapState({
      isMicrocartOpen: state => state.ui.microcart
    }),
    productQuantity() {
      return this.product.qty;
    },
    changeGroutAdhesive() {
      return this.cartAdhesiveGrout;
    },
    hasProductInfo() {
      return this.product.info && Object.keys(this.product.info).length > 0;
    },
    productQty() {
      return this.editMode ? this.getEditingQty : this.product.qty;
    },
    hasProductErrors() {
      const errors = this.product.errors || {};
      const errorsValuesExists =
        Object.keys(errors).filter(errorKey => errors[errorKey]).length > 0;
      return errorsValuesExists;
    },
    productsAreReconfigurable() {
      return (
        config.cart.productsAreReconfigurable &&
        this.product.type_id === "configurable" &&
        this.isOnline
      );
    },
    adhesiveGroutItemsInCart() {
      return this.cartAdhesiveGrout.map(item => {
        return item.recommended_sku;
      });
    },
    isAdhesiveGroutItem() {
      return this.adhesiveGroutItemsInCart.includes(this.product.sku);
    },
    adhesiveGroutItemsForSelectedProduct() {
      return this.cartAdhesiveGrout.filter(item => {
        return parseInt(item.parent_product_id) === this.product.id;
      });
    }
  },
  methods: {
    ...mapActions({
      getProduct: "product/single"
    }),
    tileQuantityUpdated(data) {
      // this.updatedQtyPass = data;
    },
    adhesivesGroutsFromChild(adhesivesGrouts) {
      this.groutAdhesiveChildData = [adhesivesGrouts];
      this.$emit("grouts-adhesives", this.groutAdhesiveChildData);
    },
    addTotalPrice(addPrice) {
      this.total[addPrice.sku] = addPrice.price;
      this.$emit("add-all-total-price", this.total);
    },
    loaderSet() {
      if (!this.noGroutAdhesivesProduct) {
        if (!this.cartAdhesiveGrout[0] || !this.cartAdhesiveGrout.length > 0) {
          this.$bus.$emit("notification-progress-start", "Processing ... ");
        } else if (
          this.cartAdhesiveGrout[0] ||
          this.cartAdhesiveGrout.length > 0
        ) {
          this.$bus.$emit("notification-progress-stop");
        }
      }
    },
    async checkIfProductHasGroutAndAdhesive() {
      this.payload.data.product_id = this.product.id;
      await this.$store
        .dispatch("groutadhesive/groutAdhesiveFunction", this.payload)
        .then(resp => {
          let response = JSON.parse(resp);
          if (response.success) {
            if (response.recommendation) {
              this.groutAdhesiveArray = response.data;
              this.sqmCheckForModelType = true;
              this.$bus.$emit("has-grout-adhesive", {
                recommendation: true,
                productId: this.product.id
              });
            } else if (!response.recommendation) {
              this.groutAdhesiveArray = [];
              this.sqmCheckForModelType = false;
              this.$bus.$emit("has-grout-adhesive", {
                recommendation: false,
                productId: this.product.id
              });
            }
            this.minSqmValue = parseInt(response.min_sqm);
            this.$bus.$emit("minSqmValue", {
              minSqmVal: this.minSqmValue,
              sqm: parseInt(this.sqmQuantity),
              productId: this.product.id
            });
          } else {
            this.sqmCheckForModelType = false;
            this.$bus.$emit("has-grout-adhesive", {
              recommendation: false,
              productId: this.product.id
            });
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";

.blend {
  flex: 0 0 150px;
}

.image {
  mix-blend-mode: multiply;
  vertical-align: top;
  width: 150px;
  @media (max-width: 767px) {
    width: 100px;
  }
}

.details {
  flex: 1 1 auto;
  display: flex;
  flex-flow: row wrap;
}

.mobilerow {
  display: none;
}

.name {
  @media (max-width: 767px) {
    font-size: 14px;
  }
}

.options {
  color: #4a4a4a;
  font-family: Arial;
  font-size: 12px;
  font-weight: normal;
  padding-right: 15px;
  margin-top: 10px;

  .opn {
    color: #4a4a4a;
    font-family: Arial;
    font-size: 14px;
    font-weight: bold;
    padding-right: 0px;
    margin-top: -5px;
    display: block;
    margin-bottom: 5px;
  }

  .opv {
    color: #4a4a4a;
    font-family: Arial;
    font-size: 14px;
    font-weight: normal;
    padding-right: 15px;
    display: block;
  }
}

.options,
.sku {
  @media (max-width: 767px) {
    font-size: 10px;
  }
}

.qty {
  padding-right: 30px;

  @media (max-width: 767px) {
    font-size: 12px;
  }
}

.actions {
  margin: 0 -5px;
}

.prices {
  flex-direction: column;
  @media (max-width: 767px) {
    padding: 0;
    font-size: 12px;
  }
}

.price-special {
  @media (max-width: 767px) {
    font-size: 14px;
  }
}

.price-original {
  text-decoration: line-through;
}

input {
  width: 30px;
}

.flex-nowrap {
  flex-wrap: nowrap;
}

.flex-wrap {
  flex-wrap: wrap;
}

.edit-mode {
  border-bottom: 1px solid color(white-smoke);
}

.filters {
  flex: 1 1 200px;
}
.piecesQty {
  .sb-prodcut-qty-on-cart- {
    padding-top: 16px;
  }
}
.update-button {
  font-size: 14px;
  min-width: 150px;
  width: 150px;
  padding: 10px;
}

.maincart {
  .mobilerow {
    display: none;
  }

  li {
    border-bottom: 1px solid #e6ebee;
    width: 100%;
    margin: 0px;
  }

  .qty {
    // padding-right: 0px;
    // padding-top: 54px;
    // width: 17%;
    padding: 0;
  }

  .mainprice {
    // padding-top: 68px;
    // padding-right: 0px;
    // flex-direction: column;
    // margin: 0px;
    // width: 20%;
    // margin: 0px;
    // span {
    //   color: #29275b;
    //   font-size: 20px;
    //   font-family: Arial, Helvetica, sans-serif;
    //   font-weight: bold;
    // }
  }

  .firstprice {
    // padding-top: 70px;
    // padding-right: 0px;
    // width: 10%;
    // text-align: center;
    padding-left: 20px;
    color: #878382;
    font-size: 16px;
    font-weight: bold;

    .firstprice-cross {
      padding-right: 11px;
      color: #878382;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .name {
    font-family: Arial, Helvetica, sans-serif;
  }

  .details-inner {
    .Q-inner {
      width: 80%;
    }
  }

  @media (max-width: 1200px) and (min-width: 992px) {
    .product-qty-input {
      span {
        font-size: 13px;
        padding-right: 12px;
      }
    }
    .firstprice {
      padding-left: 10px;

      .firstprice-cross {
        padding-right: 4px;
      }
    }
    .details-inner {
      .Q-inner {
        width: 70%;
      }
    }
    .qty {
      width: 23%;
    }
    .mainprice {
      width: 22%;
      padding-right: 16px;
    }
    .mainprice .prices span {
      font-size: 17px;
    }
  }
  @media (max-width: 991px) and (min-width: 767px) {
    .details {
      position: relative;

      .Q-inner {
        width: 100%;
      }

      .qty {
        padding-top: 10px;
      }

      .firstprice {
        position: absolute;
        bottom: 15px;
        right: 140px;
      }

      .mainprice {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    }
  }
  @media (max-width: 767px) {
    .mobilerow {
      display: flex;
    }
    h2 {
      text-align: center;
    }
    .mobprice {
      padding-top: 12px;
    }
    .qty-mobile {
      padding-left: 0px;
    }
    // .cart-remove-button{
    //   position: relative;
    //   margin: 0;
    //   .cart-remove-btn{
    //     position: absolute;
    //     bottom: 114px;
    //   }
    // }
    .details {
      position: relative;

      .Q-inner {
        width: 93%;
      }

      .mainprice {
        display: none;
      }

      .firstprice {
        display: none;
      }

      .qty {
        display: none;
      }
    }
    .update-link {
      display: none;
    }
    .piecesQty {
      .sb-prodcut-qty-on-cart- {
        padding-top: 16px;
      }
    }
  }
}

.row-sb-left-padding {
  margin: 0;
  position: relative;
  width: 100%;
}

.product-name a {
  color: #4a4a4a;
  font-family: Arial;
  font-size: 16px;
  margin: 6px 0;
  height: auto !important;
  margin-bottom: 12px;
  font-weight: bold;
  white-space: nowrap;
  @media (max-width: 767px) {
    white-space: unset;
  }
}

.sku {
  color: #4a4a4a;
  font-family: Arial;
  font-weight: normal;
  font-size: 14px;
  margin-top: 15px;
}

.sku-text {
  color: #4a4a4a;
  font-family: Arial;
  font-size: 14px;
  font-weight: bold;
  padding-right: 15px;
}

.size {
  color: #4a4a4a;
  font-family: Arial;
  font-weight: normal;
  font-size: 14px;
  margin-top: 10px;
}

.size-text {
  color: #4a4a4a;
  font-family: Arial;
  font-size: 14px;
  font-weight: bold;
  padding-right: 15px;
}

.area {
  color: #4a4a4a;
  font-family: Arial;
  font-weight: normal;
  font-size: 14px;
  margin-top: 10px;
}

.area-text {
  color: #4a4a4a;
  font-family: Arial;
  font-size: 14px;
  font-weight: bold;
  padding-right: 15px;
}

.product-qty-input span {
  color: #9b9b9b;
  font-family: Arial;
  font-size: 16px;
  font-weight: normal;
  padding-right: 20px;
  // margin-top: 2;
}

.product-quantity.qty .base-input-numberz input {
  height: 45px;
  width: 45px;
  border: 2px solid #f2f2f2;
  text-align: center;
  border-radius: 5px;
}

.sb-product-qty-input {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.product-quantity {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // height: 100%;
  padding-top: 56px;
  @media (max-width: 767px) {
    padding-top: 0;
  }
}
.mainprice .prices span {
  color: #29275b;
  font-family: Arial;
  font-weight: bold;
  font-size: 20px;
  // margin-top: 25px;
  display: block;
}

.headingtop h2 {
  padding-top: 10px;
  color: #4a4a4a;
  font-family: "Oblik";
  font-size: 30px;
}

.update-link {
  color: #ea429d;
  text-decoration: underline;
  font-size: 11px;
  text-align: center;
  display: block;
  font-family: Arial;
  padding-top: 5px;
  border: 0;
  background: none;
}

.sb-product-img {
  flex-basis: 21.9%;
}

.sb-product-detail {
  flex-basis: 28.1%;
  max-width: 28.1%;
}

.update-link:after {
  background-color: transparent !important;
}

.cart-remove-button {
  display: flex;
  justify-content: flex-end;
  width: auto;
  position: absolute;
  right: 0;
}

.sb-md-dropdown {
  margin: 35px 0;
  width: 100%;
  padding: 0;
}

@media (min-width: 767px) and (max-width: 991px) {
  // .mainprice .prices span {
  //   // margin-top: 45px;
  // }
  // .product-qty-input span {
  //   // margin-top: 45px;
  // }
}
@media (min-width: 991px) and (max-width: 1200px) {
  // .mainprice .prices span {
  //   margin-top: 60px;
  // }
  // .product-qty-input span {
  //   margin-top: 60px;
  // }
}
@media (max-width: 455px) {
  // .sb-product-img {
  //   flex-basis: 40%;
  // }
  .sb-product-detail {
    flex-basis: 50%;
    max-width: 50%;
  }
  .product-qty-input span {
    padding-right: 10px;
    margin-top: 0;
  }

  .maincart {
    .firstprice {
      padding-left: 10px;
    }
  }
  .mainprice .prices span {
    font-size: 16px;
    margin-top: 0;
  }
  // .cart-remove-button {
  //   // margin-top: 12px;
  // }
}

@media (max-width: 350px) {
  .product-qty-input span {
    font-size: 11px;
    font-weight: bold;
  }
}
</style>
<style>
@media (max-width: 767px) {
  .maincart .base-input-number__input {
    color: #48403d !important;
  }
  .sb-md-dropdown {
    margin: 35px 0 0 0 !important;
  }
}
@media (max-width: 455px) {
  .maincart .base-input-number__input {
    width: 11vw !important;
    height: 25px !important;
    border: 1px solid #cccccc !important;
    border-radius: 0 !important;
    font-size: 2.853vw !important;
  }
}
</style>
