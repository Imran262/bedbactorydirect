<template>
  <div class="outer_border">
    <div
      class="quoter-container"
      v-for="(quoteVal, index) in quoteData"
      :key="index"
    >
      <div class="heading latestHeading" v-if="quoteVal.items">
        <template v-if="quoteVal.quote_number == firstQuoteId">
          Your Latest Quote
        </template>
        <template v-else> Quote {{ quoteVal.quote_number }} </template>
      </div>
      <div class="quote-inner-container" v-if="quoteVal.items">
        <div class="text">
          Hello
          <template v-if="quoteVal.customer_firstname">
            {{ quoteVal.customer_firstname }}
          </template>
          <template v-if="quoteVal.customer_middlename">
            {{ quoteVal.customer_middlename }}
          </template>
          <template v-if="quoteVal.customer_lastname">
            {{ quoteVal.customer_lastname }},
          </template>
        </div>
        <div class="new_quote">
          <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <div
                v-if="quoteVal.quote_number == firstQuoteId"
                class="text_one"
              >
                You Have <span class="clr">{{ quoteData.length }}</span> new
                Quote(s).
              </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <div class="text_one txr">
                Quote No:
                <span class="txr1"> {{ quoteVal.quote_number }} </span>
              </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <div class="text_one txr">
                Expiry Date:
                <span class="txr1">{{ expiryDate(quoteVal.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="new_quote1">
          <table>
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Product Name</th>
                <th scope="col">Price</th>
                <th scope="col">Qty</th>
                <th class="right-align" scope="col">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(itemsVal, itemsIndex) in quoteVal.items"
                :key="itemsIndex"
              >
                <td scope="row">
                  <img
                    class="center quote-image"
                    :src="getQuoteProdImage(itemsVal.image)"
                    alt="quoteimage"
                  />
                </td>
                <td data-label="Name">
                  {{ itemsVal.name }}
                </td>
                <td data-label="price">
                  {{ itemsVal.price_incl_tax | price(storeView) }}
                </td>
                <td data-label="Quantity">{{ itemsVal.items.qty }}</td>
                <td class="right-align" data-label="Subtotal">
                  {{ itemsVal.row_total_incl_tax | price(storeView) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p_right">
          <div class="row">
            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-2"></div>
            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-7">
              <p class="bold">Subtotal</p>
              <p class="bold">Discount</p>
              <p class="bold">Delivery</p>
              <p class="bold">Grand Total Inc VAT</p>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-3">
              <p class="align_right">
                {{ quoteVal.base_grand_total | price(storeView) }}
              </p>
              <p class="align_right">
                {{ quoteVal.discount_amount | price(storeView) }}
              </p>
              <p class="align_right">
                {{ quoteVal.delivery | price(storeView) }}
              </p>
              <p class="align_right">
                {{ quoteVal.base_grand_total | price(storeView) }}
              </p>
            </div>
          </div>
        </div>
        <div class="row p20 botom-space">
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 quote-back-button">
            <router-link
              to="/my-account/orders"
              data-v-fab91130=""
              data-v-e79937e8=""
              type="button"
              data-testid="addToCart"
              class="
                back-button
                no-outline
                button_left button-full
                brdr-none
                w-100
                px10
                py15
                :bg-cl-th-secondary
                ripple
                weight-400
                h4
                cl-white
                sans-serif
                fs-medium
                add-btn
              "
            >
              Back
            </router-link>
          </div>
          <div
            class="col-lg-6 col-md-6 col-sm-6 col-xs-12 qoute-addtocart-button"
          >
            <template
              v-if="
                quoteVal.order_entity_id && quoteVal.order_entity_id !== null
              "
            >
              <router-link
                :to="{
                  path: '/my-account/orders/' + quoteVal.order_entity_id,
                  query: {currentuser : currentUser.id},
                }"
                class="
                  f_right f_right_vieworder
                  button_right
                  no-outline
                  button-full
                  block
                  brdr-none
                  w-100
                  px10
                  py20
                  :bg-cl-th-secondary
                  ripple
                  weight-400
                  h4
                  cl-white
                  sans-serif
                  fs-medium
                  add-btn
                "
              >
              <button @click="sendCurrentQuoteData(quoteVal.order_entity_id)">
                {{ "View Order" }}
                </button>
              </router-link>
            </template>
            <template v-else>
              <button
                data-v-fab91130=""
                data-v-e79937e8=""
                type="button"
                data-testid="addToCart"
                class="
                  f_right
                  button_right
                  no-outline
                  button-full
                  block
                  brdr-none
                  w-100
                  px10
                  py15
                  :bg-cl-th-secondary
                  ripple
                  weight-400
                  h4
                  cl-white
                  sans-serif
                  fs-medium
                  add-btn
                "
                @click="quoteAddToCart(quoteVal.quote_number, index)"
              >
                Add to BASKET
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateFormat from 'dateformat';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import MyProfile from '@vue-storefront/core/compatibility/components/blocks/MyAccount/MyProfile';
import { mapGetters } from 'vuex';
import { getThumbnailPath } from '@vue-storefront/core/helpers';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import i18n from '@vue-storefront/i18n';
import { CartService } from '@vue-storefront/core/data-resolver';
import axios from 'axios';
import config from 'config';

export default {
  Name: 'Quotations',
  data () {
    return {
      quoteData: [],
      firstQuoteId: null
    };
  },
  mixins: [MyProfile],
  created () {
    var self = this;
    self.$nextTick(() => {
      self.loaded = true;
    });
  },
  async mounted () {
    await this.$store.dispatch(
      'quotesystem/quoteSystemFunction', {
        customerId: this.currentUser.id
      })
      .then(resp => {
        console.log('1122 response is ', resp);
        const firstQuote = resp[Object.keys(resp)[0]];
        this.firstQuoteId = firstQuote.entity_id;
        this.quoteData = resp;

        let convertedOrder = [];
        for (var prop in resp) {
          if (resp.hasOwnProperty(prop)) {
            convertedOrder.push(resp[prop].converted_order);
          }
        }
      })
      .catch(err => {
        console.log('err occured from api call', err);
      });
  },
  computed: {
    ...mapGetters({
      shippingMethods: 'checkout/getShippingMethods',
      getCartToken: 'cart/getCartToken',
      getUserToken: 'user/getToken'
    }),
    storeView () {
      return currentStoreView();
    }
  },
  methods: {
    sendCurrentQuoteData(currentOrderID){
      let orderOld = {}
      console.log("1014 Current Order id is ",currentOrderID,this.quoteData);
      var self =this;
      this.quoteData.forEach(function(order,orderIndex){
        console.log("1014 Current order under test is ",order.order_entity_id , currentOrderID , order.order_entity_id === currentOrderID);
        if(order.order_entity_id === currentOrderID)
        {
          console.log("1014 This is an actual order with self1",order);
          orderOld = order;
          setTimeout(function(){
             localStorage.setItem('orderData', JSON.stringify(order.items))
           console.log("After 2 seconds 1014 orderData is ", localStorage.getItem('orderData'));
          },100)
          return;
        }
      })
       this.$bus.$emit('current-order-data',orderOld)
    },
    async getProduct (psku) {
      return this.$store.dispatch('product/single', {
        options: { sku: psku },
        setCurrentProduct: false,
        setCurrentCategoryPath: false,
        selectDefaultVariant: false
      });
    },
    expiryDate (date) {
      const d = new Date(date.replace(' ', 'T'));
      d.setDate(d.getDate() + 30);
      const finalDate = dateFormat(d, 'dd-mm-yyyy');
      return finalDate;
    },
    getQuoteProdImage (slug) {
      return getThumbnailPath(slug, 186, 186);
    },
    async addQuote (quoteId, index) {
      console.log(
        '36521 Here to add quote ',
        quoteId,
        index,
        this.quoteData[index]
      );
      await this.$store.dispatch('cart/clear', { disconnect: false });
      let qouteProduct = this.quoteData[index].items[0];
      console.log('36521 current product in qoute is new ', qouteProduct);
      const URL = config.baseUrl.url + 'vueapi/ext/V12Finance/getSku';
      let order = {
        item_id: qouteProduct.itemid,
        quote_id: quoteId
      };
      console.log('74123 Parameters for quote data are  ', order);
      axios
        .post(URL, order, {
          headers: {
            'Content-type': 'application/json'
          }
        })
        .then(async res => {
          console.log(
            '96521 789654 Received Quote Data with Parameters ',
            order
          );
          let receivedQouteData = res.data.result;
          console.log(
            '96521 789654 Received quote data is ',
            receivedQouteData
          );
          let self = this;
          let index = 0;
          for (index = 0; index < receivedQouteData.length; index++) {
            let receivedQouteProduct = receivedQouteData[index];
            console.log(
              '96521 789654 Current Product is ',
              receivedQouteProduct
            );
            await this.addProductToCart(receivedQouteProduct);
            console.log("37915 Checking special price ",receivedQouteProduct.custom_price);
            if (receivedQouteProduct.custom_price){
              console.log("37915 About to call special price function");
              await this.addSpecialPrice(quoteId,receivedQouteProduct.item_id,receivedQouteProduct.custom_price);
            }
            if (index+1 == receivedQouteData.length){
              await this.saveQuoteId(quoteId);
              await this.$store.dispatch('cart/syncTotals', { forceServerSync: true })
      await this.$store.dispatch("cart/sync", {
        forceClientState: false,
        forceSync: true,
      })
      this.$forceUpdate()
      this.$bus.$emit('notification-progress-stop')
      this.$router.push(this.localizedRoute('/cart'))
              this.$bus.$emit('notification-progress-stop');
            }
          }
        })

        .catch(error => {
          this.$bus.$emit('notification-progress-stop');
          console.log(
            '36521 Error occured while getting data for quote id  : ',
            quoteId,
            'Error is ',
            error
          );
        });
    },
    addSpecialPrice(quoteId,itemId,price){
      console.log("37915 In here to set Special price",this.$store.state);
      let URL= config.baseUrl.url + "vueapi/ext/quotesystem/setcustomprice"
      let order ={
        "quoteId": quoteId,
        "cartId":this.$store.state.cart.cartServerToken,
        "itemId":itemId,
        "price":price,
      }
      axios
        .post(URL, order, {
          headers: {
            'Content-type': 'application/json'
          }
        })
        .then(async res => {
          console.log(
            '96521 789654 Received Data After Setting Price ',
            res
          );

        })
        .catch(error => {
          console.log(
            '36521 Error occured while setting Custom price for item: ',itemId ,"\n with qouteId",
            quoteId,
            'Error is ',
            error
          );
        });
    },
    saveQuoteId(quoteId){
      console.log("37915 In here to set Special price",this.$store.state);
      let URL= config.baseUrl.url+config.quoteSystem.saveQuoteId ;
      let order ={
        "quoteId": quoteId,
        "cartId":this.$store.state.cart.cartServerToken
      }
      axios
        .post(URL, order, {
          headers: {
            'Content-type': 'application/json'
          }
        })
        .then(async res => {
          console.log(
            '96521 789654 Received Data After Saving Quote and Cart ID ',
            res
          );

        })
        .catch(error => {
          console.log(
            '36521 Error occured while Saving Quote and Cart ID',order ,
            'Error is ',
            error
          );
        });
    },
    async addProductToCart (receivedQouteProduct) {
      let simpleProductCheck = receivedQouteProduct.parentSku
        ? receivedQouteProduct.parentSku === receivedQouteProduct.sku
        : true;
      console.log('Product check', simpleProductCheck);
      let productSku = receivedQouteProduct.parentSku
        ? receivedQouteProduct.parentSku
        : receivedQouteProduct.sku;
      console.log('95123654 Product Sku is ', productSku);

      // if (receivedQouteProduct.parentSku === receivedQouteProduct.sku )
      // {
      // }
      let actualProduct = await this.getProduct(productSku);
      console.log(
        '7456321 from API ',
        JSON.stringify(receivedQouteProduct),
        '\n\n\n actualProduct',
        JSON.stringify(actualProduct),"\n\n\n\n\nNow we should be adding ",actualProduct.name
      );
      let updatedTestProduct = actualProduct;
      if (simpleProductCheck) {
        console.log('7456321 Its a simple product ', updatedTestProduct.qty);
        // Simple Product
        updatedTestProduct.qty = parseInt(receivedQouteProduct.qty);
        // product_option
        if (updatedTestProduct.product_option) {
          updatedTestProduct.product_option =
            receivedQouteProduct.product_option;
        } else {
          console.log('7456321 Its a simple product without any options');
        }
      } else {
        // Configureable product
        console.log('1230154 Its a configureable product');
        let configureableOptionsActual =
          updatedTestProduct.product_option.extension_attributes
            .configurable_item_options;
        let configureableOptionsQuoteProduct =
          receivedQouteProduct.product_option.extension_attributes
            .configurable_item_options;
        console.log(
          '1230154 configureableOptions',
          configureableOptionsActual,
          '\n\n',
          configureableOptionsQuoteProduct
        );
        let productOption = 0;
        let qouteProductOption = 0;
        for (productOption in configureableOptionsActual) {
          console.log(
            '1230154 configureableOptions',
            productOption,
            configureableOptionsActual[productOption]
          );
          qouteProductOption = 0;
          for (qouteProductOption in configureableOptionsQuoteProduct) {
            console.log(
              '1230154 configureableOptions',
              qouteProductOption,
              configureableOptionsQuoteProduct[qouteProductOption],
              typeof configureableOptionsActual[productOption].option_id,
              typeof configureableOptionsQuoteProduct[qouteProductOption]
                .option_id
            );
            if (
              parseInt(configureableOptionsActual[productOption].option_id) ===
              configureableOptionsQuoteProduct[qouteProductOption].option_id
            ) {
              console.log(
                '1230154 Ids matched',
                configureableOptionsActual[productOption].option_value,
                configureableOptionsQuoteProduct[qouteProductOption]
                  .option_value
              );
              configureableOptionsActual[productOption].option_value =
                configureableOptionsQuoteProduct[
                  qouteProductOption
                ].option_value;
              console.log(
                '1230154 configureableOptionsActual',
                configureableOptionsActual,
                configureableOptionsQuoteProduct
              );
            }
          }
        }
        console.log(
          '1230154 configureableOptionsActual',
          configureableOptionsActual,
          configureableOptionsQuoteProduct
        );
        updatedTestProduct.product_option.extension_attributes.configurable_item_options = configureableOptionsActual;
        productOption = 0;
        qouteProductOption = 0;
        let optionsActualProduct = updatedTestProduct.options;
        let optionsQoutesProduct = receivedQouteProduct.options;
        for (productOption in optionsActualProduct) {
          console.log(
            '1230154 789 Options',
            productOption,
            optionsActualProduct[productOption]
          );
          qouteProductOption = 0;
          for (qouteProductOption in optionsQoutesProduct) {
            console.log(
              '1230154 789 options ',
              qouteProductOption,
              optionsQoutesProduct[qouteProductOption],
              optionsActualProduct[productOption].label ===
                optionsQoutesProduct[qouteProductOption].label
            );
            if (
              optionsActualProduct[productOption].label ===
              optionsQoutesProduct[qouteProductOption].label
            ) {
              console.log(
                '1230154 789 labels matched',
                optionsActualProduct[productOption].label,
                optionsQoutesProduct[qouteProductOption].label
              );
              optionsActualProduct[productOption].value =
                optionsQoutesProduct[qouteProductOption].value;
              let label = optionsActualProduct[
                productOption
              ].label.toLowerCase();
              updatedTestProduct[label] = parseInt(receivedQouteProduct[label]);
              console.log('1230154 789 Label ', updatedTestProduct[label]);
            }
          }
        }
        updatedTestProduct.options = optionsActualProduct;
        delete updatedTestProduct.configuration;
      }
      updatedTestProduct.sku = receivedQouteProduct.sku;
      updatedTestProduct.qty = parseInt(receivedQouteProduct.qty);
      console.log('7456321 updatedTestProduct ', updatedTestProduct.qty);

      console.log(
        '7456321 updatedTestProduct ',
        JSON.stringify(updatedTestProduct)
      );

      const diffLog = await this.$store.dispatch('cart/addItem', {
        productToAdd: updatedTestProduct
      });
      this.$store.dispatch('cart/syncTotals', { forceServerSync: true });
      this.$forceUpdate();
      console.log('789456 Product adding to cart', diffLog);
      diffLog.clientNotifications.forEach(notificationData => {
        console.log('789456 Successfully added', notificationData);
        // this.notifyUser(notificationData)
      });
    },
    async addQuoteOriginal (quoteId) {
      console.log('785214 Here to add qoute to cart', quoteId);
      await this.$store.dispatch('cart/clear', { disconnect: false });
      await this.$store
        .dispatch('quotesystem/quoteSystemAddtoCart', {
          ref_quoteId: quoteId,
          current_quoteId: this.getCartToken
        })
        .then(resp => {
          console.log('785214 addtocartResponse', resp);
          this.$router.push(this.localizedRoute('/my-account/'));
        })
        .catch(err => {
          console.log('err occured from api call', err);
        });
      await this.$store.dispatch('cart/syncTotals', { forceServerSync: true });
      await this.$store.dispatch('cart/sync', {
        forceClientState: false,
        forceSync: true
      });
      this.$forceUpdate();
      this.$bus.$emit('notification-progress-stop');
      this.$router.push(this.localizedRoute('/cart'));
      await this.$store.dispatch('cart/sync', {
        forceClientState: false,
        forceSync: true
      });
      await this.$store.dispatch('cart/syncTotals', { forceServerSync: true });
      console.log('789652365 about to send to cart page');
      this.$router.push(this.localizedRoute('/cart'));
    },
    async quoteAddToCart (quoteId, index) {
      const quoteItemData = await CartService.getItems();
      if (
        !quoteItemData ||
        !quoteItemData.result ||
        quoteItemData.result.length <= 0
      ) {
        this.$bus.$emit('notification-progress-start', 'Processing ... ');
        this.addQuote(quoteId, index);
      } else {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'warning',
          item: quoteId,
          message: i18n.t(
            'Once a quote is added, the current items in the basket will be removed. Are you Sure?'
          ),
          action1: { label: i18n.t('Cancel'), action: 'close' },
          action2: {
            label: i18n.t('Yes Please'),
            action: async () => {
              this.$bus.$emit('notification-progress-start', 'Processing ... ');
              this.addQuote(quoteId, index);
            }
          },
          hasNoTimeout: true
        });
      }
    }
  }
};
</script>

<style>
.outer_border {
  border: 1px solid #cccccc;
  border-radius: 15px;
  background-color: #fff;
}
.heading {
  text-align: center;
  font-size: 28px;
  font-family: oblik;
  background-color: #071a44;
  color: #fff;
  padding: 8px;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
}
.heading.otherQuoteHeading {
  background-color: #29275b;
}
.botom-space {
  padding-bottom: 45px !important;
}
.quoter-container:last-child .row.p20.botom-space {
  padding-bottom: 20px !important;
}
.text {
  font-size: 30px;
  font-family: oblik;
  padding: 26px;
  color: #4f4f4f;
}
.new_quote {
  padding: 24px 25px 30px 30px;
  border-bottom: 1px solid #cccccc;
}
.right-align {
  text-align: end !important;
}
.text_one {
  font-weight: bold;
  color: #4f4f4f;
  font-size: 18px;
  font-family: "Oblik";
}
.clr {
  color: #00a897;
}
.txr {
  text-align: right;
}
.txr1 {
  font-weight: normal;
  font-size: 18px;
  font-family: Arial;
}
body {
  font-family: "Open Sans", sans-serif;
  line-height: 1.25;
}

table {
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  width: 100%;
}

table caption {
  font-size: 1.5em;
  margin: 0.5em 0 0.75em;
}

table tr {
  padding: 0.35em;
}

table th,
table td {
  padding: 0.625em;
  color: #4f4f4f;
  font-family: Arial;
}

table th {
  font-size: 18px;
  font-family: oblik;
  text-align: left;
  color: #4f4f4f;
}
@media screen and (max-width: 600px) {
  table {
    border: 0;
  }

  table caption {
    font-size: 1.3em;
  }
  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
  table tr {
    display: block;
    margin-bottom: 0.625em;
  }
  table td {
    display: block;
    font-size: 0.8em;
    text-align: right;
  }
  table td::before {
    /*
* aria-label has no advantage, it won't be read inside a table
content: attr(aria-label);
*/
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }
}

@media screen and (max-width: 767px) {
  .quote-back-button .button_left {
    max-width: 100%;
    margin-bottom: 10px;
  }
  .qoute-addtocart-button .button_right {
    max-width: 100% !important;
    min-width: 100% !important;
  }
}
.left {
  text-align: left;
  color: #4f4f4f;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.new_quote1 {
  padding: 24px 19px 15px 30px;
  border-bottom: 1px solid #cccccc;
}
.align_right {
  text-align: right;
  font-family: Arial;
}
.p_right {
  padding-right: 28px;
  color: #4f4f4f;
  border-bottom: 1px solid #cccccc;
}
.bold {
  font-weight: bold;
  font-family: "Oblik";
}
.button_right {
  background-color: #29275b;
  border-radius: 3px;
  max-width: 284px;
  text-transform: uppercase;
  font-family: Arial !important;
  padding: 14.5px 0px !important;
}
.f_right {
  float: right;
}
.button_left {
  background-color: #b7b4b4;
  border-radius: 3px;
  max-width: 102px;
  font-family: Arial !important;
  padding: 14px 0px !important;
}
.back-button {
  float: left;
  text-align: center;
}
.f_right_vieworder {
  text-align: center;
}
.quote-image {
  width: 40px;
  margin: 0;
}
</style>
