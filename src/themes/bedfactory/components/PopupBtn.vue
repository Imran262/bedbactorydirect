<template>
  <div>
    <button-full
      @click.native="addToCart(product), showAdding(prodId)"
      :disabled="isProductDisabled"
      data-testid="addToCart"
      class="carousel-addtocart-btn"
      >{{ $t("Add to Basket") }}</button-full
    >
  </div>
</template>

<script>
import { formatProductMessages } from "@vue-storefront/core/filters/product-messages";
import { notifications } from "@vue-storefront/core/modules/cart/helpers";
import focusClean from "theme/components/theme/directives/focusClean";
import ButtonFull from "theme/components/theme/ButtonFullCustom.vue";
import { mapGetters } from "vuex";
import { log } from 'util';

export default {
  directives: { focusClean },
  components: { ButtonFull },
  props: {
    productOptions: {
      required: true,
      type: Array,
    },
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
    async myFunction(product) {
    //  console.log("2233 in test funtion");
      let optionType = "Size";
      let selectedOption = "Single";
    //  console.log("112233  selected options are", this.productOptions);

      product.custom_options.forEach((option, index) => {
        this.productOptions.forEach((prodOption, prodIndex) => {
          if (option.title == prodOption.title) {
          }
          console.log("1122 optionis", option);
          console.log(
            "\n\n\n\nThis is the original product",
            this.getCurrentProduct.product_option.extension_attributes
              .custom_options
          );
          if (option.title == prodOption.title) {
            option.values.forEach((val, valIndex) => {
              if (val.title == prodOption.option_value) {
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
      });
    },
    async addToCart(product) {
      let optionType = "Size";
      let selectedOption = "Single";
    //  console.log("112233  selected options are", this.productOptions);
if (product.custom_options && product.custom_options.length > 0) {
  product.custom_options.forEach((option, index) => {
        this.productOptions.forEach((prodOption, prodIndex) => {
          if (option.title == prodOption.title) {
          }
     //     console.log("1122 optionis", option);
     //     console.log(
          //   "\n\n\n\nThis is the original product",
          //   this.getCurrentProduct.product_option.extension_attributes
          //     .custom_options
          // );
          if (option.title == prodOption.title) {
            option.values.forEach((val, valIndex) => {
              if (val.title == prodOption.option_value) {
                // console.log("value is ", val);
                // console.log(
                //   "Desired values are ",
                //   "\n\noption_id",
                //   option.option_id,
                //   "\noption_value ",
                //   val.option_type_id
                // );
                let obj2 = {
                  [option.option_id]: {
                    option_id: option.option_id,
                    option_value: val.option_type_id,
                  },
                };
                let obj3 = { [option.option_id]: obj2 };
                // console.log("Desired object is ", obj2, "\n\n\n\n", obj3);
                product.product_option.extension_attributes.custom_options = obj2;
              }
            });
          }
        });
      });
     } 
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
      console.log("789456 notificationData",notificationData);
      this.$store.dispatch("notification/spawnNotification", notificationData);
    },
    showAdding(event) {
      // console.log('eventevent', event);
      const addedDiv = document.querySelectorAll(".successfull-added");
      Array.from(addedDiv).forEach((element, index) => {
        if (event === element.getAttribute("data-success-attr")) {
          // console.log('AliASLAM_AliASLAM');
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
  border: 2px solid #29275b;
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
  background: #29275b;
  font-family: "Poppins", sans-serif;
}
button.carousel-addtocart-btn:hover {
  background: #000;
  border: 2px solid #000;
}
</style>
