<template>
  <div>
    <header class="thank-you-title bg-cl-secondary pl20">
      <div class="container">
        <breadcrumbs
          :with-homepage="true"
          :routes="[]"
          :active-route="this.$t('Order confirmation')"
        />
        <h2 class="category-title hidden">{{ $t('Order confirmation') }}</h2>
      </div>
    </header>
    <div class="container mobile-container">
      <div class="row">
        <div class="col-lg-8 col-md-12 col-sm-12 col-padding">
          <div v-if="OnlineOnly" class="success-header row">
            <div class="col-md-3 col-lg-2 col-xs-4 non-selected-tick" />
            <div class="col-md-9 col-lg-10 col-xs-8 success-heading">
              <p class="order-received">Your Order has been received!</p>
              <p
                class="order-received-text"
              >Please keep an eye on your inbox, we'll send you an email shortly</p>
            </div>
          </div>
          <div v-if="OnlineOnly" class="seccess-body row">
            <div class="col-md-12 inner-success">
              <span class="purchaser-text" v-if="orderElements.length">
                <label
                  class="purchaser-name"
                >{{ orderElements.order.addressInformation.shippingAddress.firstname }}</label>, thank you for your purchase!
              </span>
              <span>
                Your personal order ID is:
                <label
                  class="order-num"
                >{{ lastOrderConfirmation.orderNumber }}</label>
              </span>
              <span>You will receive an order confirmation email with full details of your order.</span>
            </div>
          </div>
          <div v-if="getAddressInformation">
          </div>
        </div>
        <div
          class="col-lg-4 col-md-12 col-padding"
          v-if="getCartItems && getCartItems && getFinalItems && orderPriceElements && getPersonalDetails"
        >
          
        </div>
      </div>
    </div>
    <div class="thank-you-content align-justify pl20">
      <div class="container">
        <div class="row">
          <div class="col-md-6 pl20 pr20">
            <h3 class="hidden" v-if="OnlineOnly">{{ $t('Your purchase') }}</h3>
            <p
              class="hidden"
              v-if="OnlineOnly"
              v-html="
                this.$t(
                  'You have successfuly placed the order. You can check status of your order by using our <b>delivery status</b> feature. You will receive an order confirmation e-mail with details of your order and a link to track its progress.'
                )
              "
            />
            <p
              class="hidden"
              v-if="OnlineOnly && lastOrderConfirmation.orderNumber"
              v-html="
                this.$t('The OrderNumber is {id}', {
                  id: lastOrderConfirmation.orderNumber
                })
              "
            />

            <h4 v-if="OfflineOnly">{{ $t('You are offline') }}</h4>
            <p v-if="OfflineOnly && !isNotificationSupported">
              {{
              $t(
              'To finish the order just come back to our store while online. Your order will be sent to the server as soon as you come back here while online and then confirmed regarding the stock quantities of selected items'
              )
              }}
            </p>
            <p
              v-if="
                OfflineOnly && isNotificationSupported && !isPermissionGranted
              "
            >
              {{
              $t(
              "You can allow us to remind you about the order via push notification after coming back online. You'll only need to click on it to confirm."
              )
              }}
            </p>
            <p
              v-if="
                OfflineOnly && isNotificationSupported && !isPermissionGranted
              "
            >
              {{
              $t(
              `Or if you will stay on "Order confirmation" page, the order will be placed automatically without confirmation, once the internet connection will be back.`
              )
              }}
            </p>
            <p
              v-if="
                OfflineOnly && isNotificationSupported && isPermissionGranted
              "
            >
              <strong>
                {{
                $t(
                'You will receive Push notification after coming back online. You can confirm the order by clicking on it'
                )
                }}
              </strong>
            </p>
            <p v-if="!isPermissionGranted && isNotificationSupported && OfflineOnly">
              <button-outline
                color="dark"
                @click.native="requestNotificationPermission()"
              >{{ $t('Allow notification about the order') }}</button-outline>
            </p>
            <p v-if="OfflineOnly">
              <button-outline
                color="dark"
                @click.native="$router.push('/')"
              >{{ $t('Return to shopping') }}</button-outline>
            </p>
            <div v-if="OfflineOnly" id="thank-you-extensions" />
          </div>
          <div v-if="OfflineOnly">
            <h3>{{ $t('What we can improve?') }}</h3>
            <p class="mb25">
              {{
              $t(
              'Your feedback is important for us. Let us know what we could improve.'
              )
              }}
            </p>
            <form @submit.prevent="sendFeedback">
              <base-textarea
                class="mb25"
                type="text"
                name="body"
                v-model="feedback"
                :placeholder="$t('Type your opinion')"
                :autofocus="true"
              />
              <button-outline color="dark">{{ $t('Give a feedback') }}</button-outline>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Composite from '@vue-storefront/core/mixins/composite';
import Breadcrumbs from 'theme/components/core/Breadcrumbs';
import BaseTextarea from 'theme/components/core/blocks/Form/BaseTextarea';
import ButtonOutline from 'theme/components/theme/ButtonOutline';
import VueOfflineMixin from 'vue-offline/mixin';
import { EmailForm } from '@vue-storefront/core/modules/mailer/components/EmailForm';
import { isServer } from '@vue-storefront/core/helpers';
import config from 'config';
import { registerModule } from '@vue-storefront/core/lib/modules';
import { MailerModule } from '@vue-storefront/core/modules/mailer';
import _ from 'lodash';

export default {
  name: 'ThankYouPage',
  mixins: [Composite, VueOfflineMixin, EmailForm],
  beforeCreate() {
    registerModule(MailerModule);
  },
  data() {
    return {
      feedback: '',
    };
  },
  mounted() {
    this.$bus.$on('notification-progress-start')
    this.$bus.$on('order-after-placed', async () => {
      setTimeout(async () => {
        await window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      }, 200);
    });
  },
  computed: {
    getAddressInformation() {
      if (this.orderElements && this.orderElements.order) {
        return this.orderElements.order.addressInformation;
      }
      return undefined;
    },
    getPersonalDetails() {
      if (this.orderElements && this.orderElements.order) {
        const firstName = this.orderElements.order.addressInformation
          .billingAddress.firstname;
        const lastName = this.orderElements.order.addressInformation
          .billingAddress.lastname;
        const email = this.orderElements.order.addressInformation.billingAddress
          .email;
        return {
          firstName,
          lastName,
          email,
        };
      }
      return undefined;
    },
    lastOrderConfirmation() {
      return this.$store.state.order.last_order_confirmation
        ? this.$store.state.order.last_order_confirmation.confirmation
        : {};
    },
    isNotificationSupported() {
      if (isServer || !('Notification' in window)) return false;
      return 'Notification' in window;
    },
    isPermissionGranted() {
      if (isServer || !('Notification' in window)) return false;
      return Notification.permission === 'granted';
    },
    checkoutPersonalEmailAddress() {
      return this.$store.state.checkout.personalDetails.emailAddress;
    },
    mailerElements() {
      return config.mailer.contactAddress;
    },
    orderElements() {
      console.log('orderElementsOrderCheck ', this.$store.state.order);
      if (this.$store.state.order.last_order_confirmation !== null) {
        return this.$store.state.order.last_order_confirmation;
      } else {
        return {};
      }
    },
    orderPriceElements() {
      return this.$store.state.cart.platformTotals;
    },
    getOrderItems() {
      console.log(
        'getOrderItemsOrderCheck ',
        this.$store.state.order.last_order_confirmation
      );
      if (this.$store.state.order.last_order_confirmation !== null) {
        console.log(
          'getOrderItemsOrderCheckif ',
          this.$store.state.order.last_order_confirmation.order.products
        );
        return this.$store.state.order.last_order_confirmation.order.products;
      } else {
        return {};
      }
    },
    getCartItems() {
      console.log(
        'getCartItemsOrderCheck ',
        this.$store.state.cart.platformTotals
      );
      if (this.$store.state.cart.platformTotals !== null) {
        return this.$store.state.cart.platformTotals.items;
      } else {
        return {};
      }
    },
    getFinalItems() {
      const merged = _.merge(
        _.keyBy(this.getCartItems, 'item_id'),
        _.keyBy(this.getOrderItems, 'item_id')
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
          const skuKey = current['extension_attributes']['original_item_sku'];
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
    requestNotificationPermission() {
      if (isServer) return false;
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    },
    sendFeedback() {
      this.sendEmail(
        {
          sourceAddress: this.checkoutPersonalEmailAddress,
          targetAddress: this.mailerElements,
          subject: this.$t('What we can improve?'),
          emailText: this.feedback,
        },
        this.onSuccess,
        this.onFailure
      );
    },
    onSuccess(message) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message,
        action1: { label: this.$t('OK') },
      });
      if (this.mailerElements.sendConfirmation) {
        this.sendEmail({
          sourceAddress: this.mailerElements,
          targetAddress: this.checkoutPersonalEmailAddress,
          subject: this.$t('Confirmation of receival'),
          emailText: this.$t(
            `Dear customer,\n\nWe have received your letter.\nThank you for your feedback!`
          ),
          confirmation: true,
        });
      }
    },
    onFailure(message) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message,
        action1: { label: this.$t('OK') },
      });
    },
  },
  destroyed() {
    this.$store.dispatch('checkout/setThankYouPage', false);
  },
  components: {
    BaseTextarea,
    Breadcrumbs,
    ButtonOutline
  },
};
</script>

<style lang="scss">
.thank-you-content {
  padding-left: 0;

  p {
    line-height: 25px;
  }

  @media (min-width: 64em) {
    h4 {
      font-size: 24px;
    }
  }
}
.thank-you-title .category-title {
  margin-bottom: 0;
}
.thank-you-improvment {
  padding: 0 20px 15px;

  @media (min-width: 64em) {
    padding: 0 40px 10px;
  }

  textarea {
    min-height: 100px;
  }
}

.success-header {
  position: relative;
  margin-top: 25px;
  padding: 25px 25px;
  background: #00a997;
}

.success-header .non-selected-tick {
  background: url(/assets/tick.png) no-repeat;
  height: 80px;
  width: 100%;
  position: relative;
  top: 0;
  right: 0;
}

.success-heading {
  color: #fff;
  font-family: 'Poppins', sans-serif;
}

p.order-received {
  font-size: 24px;
  font-weight: 700;
  margin: 7px 0 0 0;
  font-family: 'Poppins', sans-serif;
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
  font-family: 'Poppins', sans-serif;
  color: #54575b;
}

.seccess-body span {
  display: block;
  padding-bottom: 15px;
  font-family: 'Poppins', sans-serif;
}

span.purchaser-text {
  font-size: 28px;
  font-weight: 600;
  color: #54575b;
  padding-bottom: 15px;
  font-family: 'Poppins', sans-serif;
}

label.order-num {
  color: #00a997;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
}

table.order-item {
  width: 100%;
  font-family: 'Poppins', sans-serif;
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
