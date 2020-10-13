<template>
  <button-full
    @click.native="addToCart(product), showAdding(prodId)"
    :disabled="isProductDisabled"
    data-testid="addToCart"
    class="carousel-addtocart-btn"
    >{{ $t("Add to basket") }}</button-full
  >
</template>

<script>
import { formatProductMessages } from "@vue-storefront/core/filters/product-messages";
import { notifications } from "@vue-storefront/core/modules/cart/helpers";
import focusClean from "theme/components/theme/directives/focusClean";
import ButtonFull from "theme/components/theme/ButtonFull.vue";
import { mapGetters } from "vuex";

export default {
  directives: { focusClean },
  components: { ButtonFull },
  props: {
    product: {
      required: true,
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    prodId: {
      type: String,
      default: "",
    },
  },
  methods: {
    onAfterRemovedVariant() {
      this.$forceUpdate();
    },
    async addToCart(product) {
      let optionType = "Size";
      let selectedOption = "Single";

      let obj1 = {
        val: {
          val1: "",
          val2: "",
        },
      };

      product.custom_options.forEach((option, index) => {
        console.log("1122 optionis", option);
        console.log(
          "\n\n\n\nThis is the original product",
          this.getCurrentProduct.product_option.extension_attributes
            .custom_options
        );
        if (option.title == optionType) {
          option.values.forEach((val, valIndex) => {
            if (val.title == selectedOption) {
              console.log("value is ", val);
              console.log(
                "Desired values are ",
                "\n\noption_id",
                option.option_id,
                "\noption_value ",
                val.option_type_id
              );
              let obj2 = {
                [option.option_id]: {
                  option_id: option.option_id,
                  option_value: val.option_type_id,
                },
              };
              let obj3 = { [option.option_id]: obj2 };
              console.log("Desired object is ", obj2, "\n\n\n\n", obj3);
              product.product_option.extension_attributes.custom_options = obj2;
            }
          });
        }
      });
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
    showAdding(event) {
      // console.log('eventevent', event);
      const addedDiv = document.querySelectorAll(".successfull-added");
      Array.from(addedDiv).forEach((element, index) => {
        if (event === element.getAttribute("data-success-attr")) {
          // console.log('FAWADASLAM_FAWADASLAM');
          element.classList.add("showed");
          var mainProdElementZero = document.getElementsByClassName(event)[0];
          mainProdElementZero.classList.add("podElementHide");
          var mainProdElementOne = document.getElementsByClassName(event)[1];
          mainProdElementOne.classList.add("podElementHide");
        }
      });
    },
  },
  computed: {
    ...mapGetters({
      isAddingToCart: "cart/getIsAdding",
      getCurrentProduct: "product/getCurrentProduct",
    }),
    isProductDisabled() {
      return (
        this.disabled ||
        formatProductMessages(this.product.errors) !== "" ||
        this.isAddingToCart
      );
    },
  },
  beforeMount() {
    this.$bus.$on("product-after-removevariant", this.onAfterRemovedVariant);
  },
  beforeDestroy() {
    this.$bus.$off("product-after-removevariant");
  },
};
</script>
<style scoped>
button.carousel-addtocart-btn {
  border: 2px solid #00998c;
  border-radius: 5px;
  min-width: auto;
  color: #fff;
  font-weight: 600;
  width: auto;
  padding: 0 20px;
  line-height: 1.8;
  font-size: 12px;
  margin-top: 5px;
  text-transform: uppercase;
  background: #00998c;
  font-family: "Poppins", sans-serif;
}
button.carousel-addtocart-btn:hover {
  background: #000;
  border: 2px solid #000;
}
</style>
