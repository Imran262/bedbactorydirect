<template>
  <div class="addtocart-popup">
    <!-- {{ disabled }}
    {{isProductDisabled}} -->
    <button-full
      @click.native="
        addToCart(product);
        showPopUp(product);
      "
      :disabled="isProductDisabled"
      data-testid="addToCart"
      >{{ $t("Add to cart") }}</button-full
    >
    <popup-cart
      :productOptions="productOptions"
      class="popup-main-cart"
      :product="product"
      :custom-options="customOptions"
      v-if="cartpopupshow"
      @popInterface="handlePopupAfteBack"
      :productCalculatedPrice="productCalculatedPrice"
    />
  </div>
</template>

<script>
import { formatProductMessages } from "@vue-storefront/core/filters/product-messages";
import { notifications } from "@vue-storefront/core/modules/cart/helpers";
import focusClean from "theme/components/theme/directives/focusClean";
import ButtonFull from "theme/components/theme/ButtonFull.vue";
import { mapGetters } from "vuex";
import PopupCart from "theme/components/PopupCart";

export default {
  data() {
    return {
      cartpopupshow: false,
    };
  },
  directives: { focusClean },
  components: { ButtonFull, PopupCart },
  props: {
    productCalculatedPrice: {
      required: true,
      type: Object,
    },
    productOptions: {
      required: true,
      type: Array,
    },
    product: {
      required: true,
      type: Object,
    },
    customOptions: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    showPopUp(product) {
      this.cartpopupshow = true;
      // var x = document.getElementsByTagName("BODY")[0];
      // x.style.overflow ="hidden";
      this.$bus.$emit("modal-show", "modal-switcher");
    },
    onAfterRemovedVariant() {
      this.$forceUpdate();
    },
    async addToCart(product) {
      try {
        const diffLog = await this.$store.dispatch("cart/addItem", {
          productToAdd: product,
        });
        diffLog.clientNotifications.forEach((notificationData) => {
          // this.notifyUser(notificationData);
        });
      } catch (message) {
        this.notifyUser(
          notifications.createNotification({ type: "error", message })
        );
      }
    },
    notifyUser(notificationData) {
      this.$store.dispatch("notification/spawnNotification", notificationData, {
        root: true,
      });
    },
    handlePopupAfteBack(event) {
      console.log("EventEventEvent ", event);
      this.cartpopupshow = event;
      var x = document.getElementsByTagName("BODY")[0];
      x.style.overflow ="scroll";
    },
    customOptionsCheck(){
      return false;
    }
  },
  computed: {
    ...mapGetters({
      isAddingToCart: "cart/getIsAdding",
    }),
    isProductDisabled() {
      console.log("112233445577 product options ",this.productOptions,"\n\nCustomOptions\n",this.customOptions,"\n\n\n",this.disabled,"\n\n\n",this.customOptionsCheck(),"\n\n\n");
    console.log("1122334455 ",formatProductMessages(this.product.errors),this.product.errors,"\n is adding to cart",this.isAddingToCart,"\n\n",this.disabled,"\n\n",(
        this.disabled ||
        formatProductMessages(this.product.errors) !== "" ||
        this.isAddingToCart
      ));
      console.log("1122334455 product is ",this.product);
      return (
        this.disabled ||
        formatProductMessages(this.product.errors) !== "" ||
        this.isAddingToCart
      );
    },
    customOptionsCheck(){
      return false;
    }
  },
  beforeMount() {
    console.log('SomethingToTest', this.productOptions, this.customOptions, this.productCalculatedPrice)
    this.$bus.$on("product-after-removevariant", this.onAfterRemovedVariant);
  },
  beforeDestroy() {
    this.$bus.$off("product-after-removevariant");
  },
};
</script>
<style scoped>
.bt-product-addtocartbtn .addtocart-popup button {
  padding: 7.5px 15px;
  border-bottom-left-radius: 6px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  background: #00bfb3;
  text-transform: uppercase;
  font-weight: bold;
}
</style>
