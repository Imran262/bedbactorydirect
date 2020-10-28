<template>
  <div>
    <header class="thank-you-title bg-cl-secondary pl20">
      <div class="container">
        <h2 class="category-title hidden">
          {{ $t('Order confirmation') }}  
        </h2>
      </div>
    </header>
    <div class="container mobile-container">
      <div class="row">
        <div class="col-lg-8 col-md-12 col-sm-12 col-padding">
          <div v-if="OnlineOnly" class="success-header row">
            <div class="col-md-3 col-lg-2 col-xs-4 non-selected-tick" />
            <div class="col-md-9 col-lg-10 col-xs-8 success-heading">
              <p class="order-received">
                Your Order has been received!
                 <!-- {{lastOrderItem}} -->

                 <!-- purchaserName{{purchaserName}}<br />
                 backendOrderId{{backendOrderId}}<br />
                 getAddressInformation{{getAddressInformation}}<br />
                 getCartItems{{getCartItems}}<br />
                 lastOrderItem{{lastOrderItem}}<br />
                 getFinalItems{{getFinalItems}}<br />
                 orderPriceElements{{orderPriceElements}}<br />
                 getPersonalDetails{{getPersonalDetails}}<br /> -->
              </p>
              <p class="order-received-text">
                Please keep an eye on your inbox, we'll send you an email shortly
              </p>
            </div>
          </div>
          <div v-if="OnlineOnly" class="seccess-body row">
            <div class="col-md-12 inner-success">
                <span v-if="purchaserName" class="purchaser-text">
                  <label
                    class="purchaser-name"
                  >{{ purchaserName }}</label>, thank you for your purchase!
                </span>
                <span v-if="backendOrderId">
                  Your personal Order ID is:
                  <label class="order-num">{{ backendOrderId }}</label>
                </span>
                <span>You will receive an order confirmation email with full details of your order.</span>
              </div>
          </div>
            <div v-if="getAddressInformation">
              <DeliveryInformationSuccess :address-information="getAddressInformation" />
            </div>
        </div>
        <div class="col-lg-4 col-md-12 col-padding" v-if="lastOrderItem && getCartItems && getCartItems && getFinalItems && orderPriceElements && getPersonalDetails">
          <OrderReviewList :products="getFinalItems" :totals="orderPriceElements" :address-information="getAddressInformation" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueOfflineMixin from "vue-offline/mixin";
import Composite from "@vue-storefront/core/mixins/composite";
import { isServer } from "@vue-storefront/core/helpers";
import _ from "lodash";
// import OrderReviewList from 'theme/components/theme/blocks/OrderReviewList/OrderReviewList';
// /home/ejaz/vsf/BEDFACTORY/BFD/bfdvuestore/src/themes/bedandfactory/components/theme/blocks/Reviews/ReviewsList.vue
// import OrderReviewList from 'theme/components/theme/blocks/Reviews/ReviewsList';
import OrderReviewList from "theme/components/theme/blocks/Reviews/list/OrderReviewList";
import DeliveryInformationSuccess from 'theme/components/theme/blocks/DeliveryInformationSuccess/DeliveryInformationSuccess';

// import OrderReviewList from 'theme/components/theme/blocks/OrderReviewList/OrderReviewList';
// import DeliveryInformationSuccess from 'theme/components/theme/blocks/DeliveryInformationSuccess/DeliveryInformationSuccess';
// import RegisterAccountSuccess from 'theme/components/theme/blocks/RegisterAccountSuccess/RegisterAccountSuccess';
// import ThingsToRememberSuccess from 'theme/components/theme/blocks/ThingsToRememberSuccess/ThingsToRememberSuccess';

export default {
  name: "SuccessPage",
  mixins: [Composite, VueOfflineMixin],
  data() {
    return {
      lastOrderItem: null,
      newlast:null
    };
  },
  components: {
    OrderReviewList,
    DeliveryInformationSuccess
    // RegisterAccountSuccess,
    // ThingsToRememberSuccess
  },
  computed: {
    backendOrderId() {
      if (this.lastOrderItem) {
        return this.lastOrderItem.confirmation.backendOrderId;
      }
      return undefined;
    },
    getAddressInformation() {
      if (this.lastOrderItem) {
        return this.lastOrderItem.order.addressInformation;
      }
      return undefined;
    },
    purchaserName() {
      if (this.lastOrderItem) {
        return this.lastOrderItem.order.addressInformation.billingAddress
          .firstname;
      }
      return undefined;
    },
    getPersonalDetails() {
      if (this.lastOrderItem) {
        const firstName = this.lastOrderItem.order.addressInformation
          .billingAddress.firstname;
        const lastName = this.lastOrderItem.order.addressInformation
          .billingAddress.lastname;
        const email = this.lastOrderItem.order.addressInformation.billingAddress
          .email;
        return {
          firstName,
          lastName,
          email,
        };
      }
      return undefined;
    },
    // orderElements() {
    //   if (this.$store.state.order.last_order_confirmation !== null) {
    //     return this.$store.state.order.last_order_confirmation;
    //   } else {
    //     return {};
    //   }
    // },
    orderPriceElements() {
      return this.lastOrderItem.platformTotals;
    },
    getOrderItems() {
      if (this.lastOrderItem.order.products !== null) {
        return _.values(this.lastOrderItem.order.products);
      } else {
        return [];
      }
    },
    getCartItems() {
      if (this.lastOrderItem.platformTotals !== null) {
        return this.lastOrderItem.platformTotals.items;
      } else {
        return [];
      }
    },
    getFinalItems() {
      const merged = _.merge(
        _.keyBy(this.getCartItems, "name"),
        _.keyBy(this.getOrderItems, "name")
      );
      const values = _.values(merged);
      const extensionAttributes = values.filter(
        (value) =>
          value.extension_attributes &&
          value.extension_attributes.original_item_sku
      );
      const simpleProducts = values.filter(
        (value) =>
          !(
            value.extension_attributes &&
            value.extension_attributes.original_item_sku
          )
      );
      let finalItems = [];
      if (extensionAttributes.length > 0) {
        const reducedProducts = extensionAttributes.reduce((acc, current) => {
          const skuKey = current["extension_attributes"]["original_item_sku"];
          if (!(skuKey in acc) && !acc[skuKey]) {
            return { ...acc, [skuKey]: [current] };
          }
          return { ...acc, [skuKey]: [...acc[skuKey], current] };
        }, {});

        for (const item of _.values(reducedProducts)) {
          const reducedItem = item.reduce(
            (acc, current) => {
              const price = acc.price_incl_tax;

              return {
                price_incl_tax: price + current.price_incl_tax,
                name: current.extension_attributes.product_name,
                sku: current.extension_attributes.original_item_sku,
                qty: current.qty,
              };
            },
            { price_incl_tax: 0 }
          );

          finalItems.push(reducedItem);
        }
      }
      if (simpleProducts.length > 0) {
        finalItems = [...finalItems, ...simpleProducts];
      }
      return finalItems;
    },
  },
  methods: {
    removeLastOrderItem() {
      localStorage.removeItem("lastOrderItem");
    },
  },
  async mounted() {
    if (!isServer) {
      try {
        if (performance.navigation.type === 1) {
          await this.removeLastOrderItem();
        }
        const lastOrderItem = localStorage.getItem("lastOrderItem");
        this.lastOrderItem = JSON.parse(lastOrderItem);
        console.log("lastOrderItemIs",lastOrderItem, this.lastOrderItem);
        // Check if its a reload
        if (this.lastOrderItem && this.lastOrderItem.confirmation) {
          this.$bus.$emit("checkout_com-order-placed", this.lastOrderItem);
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  beforeDestroy() {
    this.removeLastOrderItem();
  },
  destroyed() {
    this.$bus.$off("checkout_com-order-placed");
  },
};
</script>

<style scoped>
.thank-you-title .category-title {
  margin-bottom: 0;
}
.success-header {
  position: relative;
  margin-top: 25px;
  padding: 25px 25px;
  background: #00a997;
}
.success-header .non-selected-tick {
  background: url(../assets/tick.png) no-repeat;
  height: 80px;
  width: 100%;
}
.success-heading {
  color: #fff;
  font-family: "Poppins", sans-serif;
}

p.order-received {
  font-size: 24px;
  font-weight: 700;
  margin: 7px 0 0 0;
  font-family: "Poppins", sans-serif;
  text-align: center;
}

p.order-received-text {
  font-weight: 500;
  font-size: 18px;
  margin: 0px;
  text-align: center;
}
.col-padding {
  padding-right: 35px;
  padding-left: 20px;
}
.seccess-body {
  padding: 25px 0px;
  font-size: 17px;
  font-family: "Poppins", sans-serif;
  color: #54575b;
}

.seccess-body span {
  display: block;
  padding-bottom: 15px;
  font-family: "Poppins", sans-serif;
}

span.purchaser-text {
  font-size: 28px;
  font-weight: 600;
  color: #54575b;
  padding-bottom: 15px;
  font-family: "Poppins", sans-serif;
}

label.order-num {
  color: #00a997;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
}

table.order-item {
  width: 100%;
  font-family: "Poppins", sans-serif;
  border-spacing: 0;
  padding: 0;
}

table.order-item thead {
  background: #606060;
}

thead tr th {
  padding: 10px 15px;
  text-align: left;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
}

table.order-item tbody tr td {
  padding: 15px 5px 35px 5px;
  text-align: center;
}

table.order-item tbody {
  background: #ebebeb;
}

td.empty-dark-row-cell {
  background: #6060608f;
  width: 100%;
  min-width: 100%;
  color: transparent;
}
table.order-item tfoot {
  background: #ebebeb;
}

table.order-item tfoot tr {
  text-align: right;
}

td.empty-row-cell {
  width: 0;
  padding: 10px 0px 15px 15px;
  text-align: center;
}

td.footer-last-cel {
  text-align: left;
  text-align: center;
}
@media (max-width: 423px) {
  p.order-received {
    font-size: 12px !important;
  }
  p.order-received-text {
    font-size: 12px !important;
  }
}
@media (max-width: 767px) {
  .mobile-container {
    padding: 0px;
  }
  .mobile-container .row {
    margin: 0px;
  }
  .mobile-container .col-padding {
    padding-right: 0px;
    padding-left: 0px;
  }
  p.order-received {
    font-size: 16px;
  }
  p.order-received-text {
    font-size: 14px;
  }
  .seccess-body .inner-success {
    padding: 0px 20px;
  }
  span.purchaser-text {
    font-size: 16px;
  }
  .seccess-body span {
    font-size: 14px;
  }
}
@media (min-width: 767px) and (max-width: 991px) {
  .col-padding {
    padding-right: 20px;
    padding-left: 20p;
  }
}
</style>
