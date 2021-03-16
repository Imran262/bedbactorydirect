<template>
  <ModalQuickCheckout
    name="modal-quickcheckoutmodel"
    :show-modal="hasFreeSampleWithZeroSubTotal"
  >
    <span class="close" @click="hideModelQuickCheckout">&times;</span>
    <div class="col-lg-12 col-md-12 quick-checkout-main">
      <div class="quick-checkout-title">
        <h2 class="desktop">
          Totally Free Cut Samples!
          <span>Add up to 3 Free Cut Samples to compare at home!</span>
        </h2>
        <div class="mobile" @click="hideModelQuickCheckout">
          <h2>Totally Free Cut Samples!</h2>
          <img src="/assets/cut-sample-arrow-down.svg" alt="cutsample arrow"/>
        </div>
      </div>
      <div class="col-lg-12 col-md-12 quick-checkout-inner">
        <div class="row">
          <div class="col-lg-7 col-md-7 free-cut-sample-images">
            <h3>Your FREE Cut Samples</h3>
            <div class="row">
              <template v-for="(sampleProduct, index) in sampleProducts">
                <div
                  class="col-lg-4 col-md-4 col-xs-4 cut-sample-image"
                  :key="index"
                  v-if="sampleProduct"
                >
                  <div class="cut-sample-image-inner">
                    <div class="cut-sample-img-div">
                      <router-link
                        :to="'/' + sampleProduct.url_path"
                        target="_blank"
                      >
                        <img
                          :src="
                            getThumbnail(
                              sampleProduct.thumbnail || sampleProduct.image
                            )
                          "
                        />
                      </router-link>
                    </div>
                    <div class="free-cut-sample-title">
                      <h5>
                        {{ sampleProduct.name }}
                      </h5>
                    </div>
                    <div class="free-cut-sample-remove-button">
                      <span
                        class="remove-icon-img"
                        @click="removeSample(sampleProduct)"
                        ><img src="/assets/remove-icon.svg" alt="remove icon"
                      /></span>
                      <span
                        class="remove-text"
                        @click="removeSample(sampleProduct)"
                        >Remove</span
                      >
                    </div>
                  </div>
                </div>
                <div
                  class="col-lg-4 col-md-4 col-xs-4 cut-sample-image"
                  v-else
                  :key="index"
                >
                  <div
                    class="cut-sample-image-inner add-image-inner"
                    @click="hideModelQuickCheckout"
                  >
                    <!-- <div class="cut-sample-img-div">
                      <img src="/assets/free-cut-sample-img.jpg" />
                    </div> -->
                    <div class="free-cut-sample-plus-icon">
                      <span>+</span>
                    </div>
                    <div class="free-cut-sample-add-another-text">
                      <span>Add Another Free Cut Sample</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div
              class="free-cut-sample-images-title-bottom"
              v-if="!samplesMaxedOut"
            >
              <h4>
                You currently have<strong>
                {{ sampleProducts.filter((p) => !!p).length }} </strong
              >of a possible <strong> 3 FREE cut samples </strong>in your
                Sample List.
              </h4>
            </div>
            <div class="more-samples" v-else>
              <div class="row">
                <div class="col-xs-12 col-md-8 col-lg-7">
                  <div class="moresample-details">
                    <h2>Want to order more Samples?</h2>
                    <p>
                      Sorry, you have used up your FREE cut sample allocation.
                      Don’t panic though... You can order more for just a small
                      fee per sample tile - still available with Free, Fast
                      Delivery.
                    </p>
                  </div>
                </div>
                <div class="col-xs-12 col-md-4 col-lg-5">
                  <div class="moresample-close-button">
                    <button
                      class="moresmaple-btn"
                      @click="hideModelQuickCheckout"
                    >
                      Shop for more Samples
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-5 col-md-5 free-cut-sample-detail">
            <div class="border-mobile"/>
            <div class="free-cut-sample-detail-inner">
              <h3>Delivery Details</h3>
              <form
                action=""
                method="POST"
                id="address-form"
                name="deliveryDetails"
              >
                <fieldset>
                  <p class="input-wrapper lg-half">
                    <input
                      type="text"
                      name="shipping-first-name"
                      id="shipping-first-name"
                      required
                      placeholder="First Name *"
                      v-model="deliveryDetails.firstName"
                    />
                  </p>
                  <p class="input-wrapper lg-half">
                    <input
                      type="text"
                      name="shipping-last-name"
                      id="shipping-last-name"
                      required
                      placeholder="Last Name *"
                      v-model="deliveryDetails.lastName"
                    />
                  </p>
                  <p class="input-wrapper lg-half postcode">
                    <input
                      type="text"
                      name="postcode"
                      id="search-bar"
                      required
                      placeholder="Postcode *"
                      @click="postalcodelookup()"
                      @input="postalcodelookup()"
                      v-model="deliveryDetails.postCode"
                    />
                  </p>
                  <p class="input-wrapper lg-half find-address">
                    <input
                      type="button"
                      required
                      id="find-address"
                      value="Find Address"
                      onclick="cp_obj_1.doLookup()"
                    />
                  </p>

                  <div
                    class="postcode-select"
                    id="crafty_postcode_result_display_1"
                  >
                    &nbsp;
                  </div>
                  <p class="input-wrapper lg-half">
                    <input
                      type="text"
                      name="company-name"
                      id="shipping-city"
                      placeholder="Company"
                      v-model="deliveryDetails.company"
                    />
                  </p>

                  <p class="input-wrapper lg-half">
                    <input
                      type="text"
                      id="address_1"
                      name="address_1"
                      required
                      placeholder="Address 1 *"
                      v-model="deliveryDetails.address1"
                    />
                  </p>
                  <p class="input-wrapper lg-half">
                    <input
                      type="text"
                      id="address_2"
                      name="address_2"
                      placeholder="Address 2"
                      v-model="deliveryDetails.address2"
                    />
                  </p>
                  <p class="input-wrapper lg-half">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      placeholder="Town / City *"
                      v-model="deliveryDetails.city"
                    />
                  </p>
                  <p class="input-wrapper lg-half">
                    <input
                      type="text"
                      id="email"
                      name="email"
                      required
                      placeholder="Email *"
                      v-model="deliveryDetails.email"
                    />
                  </p>
                  <p class="input-wrapper lg-half">
                    <input
                      type="text"
                      id="telephone"
                      name="shipping-country"
                      required
                      placeholder="Telephone *"
                      v-model="deliveryDetails.telephone"
                    />
                  </p>
                  <!-- <p class="input-wrapper lg-half">
                    <input
                      type="text"
                      id="mobile"
                      name="mobile"
                      placeholder="Mobile"
                      v-model="deliveryDetails.mobile"
                    />
                  </p> -->
                </fieldset>
                <div class="btn-sample-request-main">
                  <button
                    type="button"
                    class="btn-sample-request"
                    :disabled="!isEnabledReqSamples"
                    @click="requestSamples"
                  >
                    Request Samples
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalQuickCheckout>
</template>
<script>
// import ProductImage from "theme/components/core/ProductImage";
// import Product from 'theme/components/core/blocks/Microcart/Product';
import { mapGetters, mapActions } from 'vuex'
import { getThumbnailPath, isServer } from '@vue-storefront/core/helpers'
import Vue from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import Product from '@vue-storefront/core/compatibility/components/blocks/Microcart/Product'
import EditMode from '../Microcart/EditMode'
import { ProductOption } from '@vue-storefront/core/modules/catalog/components/ProductOption'
import config from 'config'
import i18n from '@vue-storefront/i18n'
import axios from 'axios'
import { notifications } from '@vue-storefront/core/modules/cart/helpers'
import ModalQuickCheckout from 'theme/components/core/blocks/QuickCheckout/ModalQuickCheckout'
import MyShippingDetails from '@vue-storefront/core/compatibility/components/blocks/MyAccount/MyShippingDetails'
import { hasOnlySampleTypeInCart } from 'src/modules/cut-full-sample/helpers/index'
import { constants } from 'buffer'

Vue.component('v-select', vSelect)

export default {
  name: 'QuickCheckoutModel',
  mixins: [Product, ProductOption, EditMode, MyShippingDetails],
  components: {
    ModalQuickCheckout
  },
  data () {
    return {
      componentLoaded: false,
      productImage: '',
      showp: false,
      showp1: false,
      sampleProducts: [],
      deliveryDetails: {
        firstName: null,
        lastName: null,
        postCode: null,
        company: null,
        address1: null,
        address2: null,
        city: null,
        email: null,
        telephone: null,
        mobile: null
      }
    }
  },
  props: {
    productsInCart: {
      required: true,
      type: [Object, Array]
    },
    cartId: {
      type: [Number, String],
      required: false,
      default: ''
    }
  },
  created () {
    // if (this.productsInCart && this.productsInCart.length > 0) {
    // const craftyplugin = document.createElement('script');
    // craftyplugin.setAttribute('src', '/assets/js/crafty_postcode.class.js');
    // document.head.appendChild(craftyplugin);
    // }
    axios.interceptors.request.use(
      (config) => {
        // this.showLoader();
        return config
      },
      (error) => {
        // trigger 'loading=false' event here
        this.hideLoader()
        return Promise.reject(error)
      }
    )

    axios.interceptors.response.use(
      (response) => {
        this.hideLoader()
        return response
      },
      (error) => {
        // trigger 'loading=false' event here
        this.hideLoader()
        return Promise.reject(error)
      }
    )
  },
  beforeMount () {
    const craftyplugin = document.createElement('script')
    craftyplugin.setAttribute('src', '/assets/js/crafty_postcode.class.js')
    document.head.appendChild(craftyplugin)
  },
  mounted () {
    this.$nextTick(() => {
      this.componentLoaded = true
      // this.$bus.$emit('modal-show', 'modal-quickcheckoutmodel');
    })
    // this.getProductDetails(this.product);
    this.updateSampleProducts()
    let localStorageSampleDeliveryDetails = localStorage.getItem(
      'sample-deliveryDetails'
    )
    if (localStorageSampleDeliveryDetails && !this.isUserLoggedIn) {
      this.deliveryDetails = JSON.parse(localStorageSampleDeliveryDetails)
    }

    this.autofillDetails()


  },
  methods: {
    autofillDetails () {
      let {
        city,
        country,
        firstName,
        lastName,
        phone,
        region,
        postcode,
        street,
        house
      } = this.shippingDetails
      this.deliveryDetails.firstName = firstName
      this.deliveryDetails.lastName = lastName
      this.deliveryDetails.telephone = phone
      this.deliveryDetails.city = city
      this.deliveryDetails.postCode = postcode
      this.deliveryDetails.address1 = street
      this.deliveryDetails.address2 = house
      // Email From Personal Details
      this.deliveryDetails.email = (this.currentUser && this.currentUser.email) ? this.currentUser.email : ''
      // if (this.getPersonalDetails && this.getPersonalDetails.emailAddress) {
      //   this.deliveryDetails.email = this.getPersonalDetails.emailAddress
      // }
    },
    async requestSamples () {
      this.hideModelQuickCheckout()
      this.showLoader()
      let orderUrl = config.api.url + config.sampleQuote.order

      if (!config.sampleQuote) {
        return false
      }

      if (!config.sampleQuote.order) {
        return false
      }

      let postData = {
        cartId: this.getCartToken,
        deliveryDetails: this.deliveryDetails
      }

      axios
        .post(orderUrl, postData, {
          headers: {
            'Content-type': 'application/json'
          }
        })
        .then(
          ({ data: { result: { increment_id, status, message } } }) => {
            // Clear Up the Cart
            this.clearCart()
              .then((r) => {
                console.log('cartSuccessfullyCleared')
              })
              .catch((err) => console.log('cartFailedToClear', err))
            let orderId = increment_id
            this.$router.push({ name: 'Success', params: { orderId: orderId } })
            // this.notifyUser(
            //   notifications.createNotification({
            //     type: "success",
            //     message:
            //       "Samples Have been Ordered Successfully, OrderID: " +
            //       increment_id,
            //   })
            // )
            this.$bus.$emit('samples-successfully-ordered', {
              message,
              status,
              increment_id
            })
          }
        )
        .catch((err) => {
          this.hideLoader()
          console.log('hasError', err)
        })
    },
    async clearCart () {
      // clear cart without sync, because after order cart will be already cleared on backend
      await this.$store.dispatch('cart/clear', { sync: false }, { root: true })
      // await this.$store.dispatch('dropPassword')
    },
    hideModelQuickCheckout () {
      this.$bus.$emit('dontShowValue', true)
      this.$bus.$emit('modal-hide', 'modal-quickcheckoutmodel')
    },
    getProductDetails (product) {
      this.productImage = getThumbnailPath(product.thumbnail || product.image)
    },
    addedtobasket () {
      this.showp = true
    },
    addedtobasket1 () {
      this.showp1 = true
    },
    updateSampleProducts () {
      this.sampleProducts = []
      for (let i = 0; i < 3; i++) {
        if (this.productsInCart[i]) {
          this.sampleProducts.push(this.productsInCart[i])
        } else {
          this.sampleProducts.push(null)
        }
      }
    },
    getThumbnail (image) {
      return getThumbnailPath(image, 186, 186)
    },
    removeSample (product) {
      // if (config.cart.askBeforeRemoveProduct) {
      //   this.$store.dispatch('notification/spawnNotification', {
      //     type: 'warning',
      //     item: product,
      //     message: i18n.t(
      //       'Are you sure you would like to remove this item from your basket?'
      //     ),
      //     action2: {
      //       label: i18n.t('Yes Please'),
      //       action: () => {
      //         this.removeFromCart(product)
      //       }
      //     },
      //     action1: { label: i18n.t('Cancel'), action: 'close' },
      //     hasNoTimeout: true
      //   })
      // } else {
      this.removeFromCart(product)
      // }
    },
    removeFromCart (product) {
      this.$store.dispatch('cart/removeItem', { product: product })
    },
    async postalcodelookup () {
      if (this.count++ > 1) {
      } else {
        const craftyplugin_args = document.createElement('script')
        craftyplugin_args.innerHTML = `var cp_access_token = "680e7-065c3-ecff5-06677";
          var cp_obj_1 = CraftyPostcodeCreate();
          cp_obj_1.set("access_token", cp_access_token);
          cp_obj_1.set("result_elem_id", "crafty_postcode_result_display_1");
          cp_obj_1.set("busy_img_url", "/assets/crafty_postcode_busy.gif");
          cp_obj_1.set("first_res_line", "----- Please Select Your Address ----");
          cp_obj_1.set("res_autoselect", "0");
          cp_obj_1.set("hide_result", 1);
          cp_obj_1.set("form", "deliveryDetails");
          cp_obj_1.set("elem_company"  , "company-name");
          cp_obj_1.set("elem_street1"  , "address_1");
          cp_obj_1.set("elem_street2"  , "address_2");
          cp_obj_1.set("elem_town"     , "city");
          cp_obj_1.set("elem_county"   , "state");
          cp_obj_1.set("elem_postcode" , "postcode");
          cp_obj_1.set("single_res_autoselect" , 1);
          cp_obj_1.set("hide_result", "1");
           cp_obj_1.set("on_result_ready", function(){
            document.getElementById('find-address').disabled = false;
            document.getElementById("crafty_postcode_result_display_1").style.display = "block";
            const crafty = document.querySelector("#crafty_postcode_result_display_1");
            const p = document.createElement('p');
            p.innerText = "Can't find your address? Enter manually below";
            crafty.append(p);
            });
           cp_obj_1.set("on_result_selected", function(){
           document.getElementById("crafty_postcode_result_display_1").style.display = "none";
           var ele1 = document.getElementsByName('city')[0];
           ele1vale = ele1.value;
           if (ele1vale !== ''){
                ele1.classList.remove('empty');
           }
           var ele2 = document.getElementsByName('postcode')[0];
           ele2vale = ele2.value;
           if (ele2vale !== '') {
                ele2.classList.remove('empty');
           }
           var ele3 = document.getElementsByName('address_1')[0];
           ele3vale = ele3.value;
           if (ele3vale !== ''){
                ele3.classList.remove('empty');
           }
           var ele4 = document.getElementsByName('address_2')[0];
           ele4vale = ele4.value;
           if(ele4vale !== '') {
                ele4.classList.remove('empty');
           }
           var ele6 = document.getElementsByName('company-name')[0];
           ele6vale = ele6.value;
           if (ele6vale !== '') {
                ele6.classList.remove('empty');
           }
           document.getElementById('search-bar').click();
           });`
        document.head.appendChild(craftyplugin_args)
      }
      var ele1 = document.getElementsByName('address_1')[0].value
      this.deliveryDetails.address1 = ele1
      var ele2 = document.getElementsByName('address_2')[0].value
      this.deliveryDetails.address2 = ele2
      var ele3 = document.getElementsByName('city')[0].value
      this.deliveryDetails.city = ele3
      var ele5 = document.getElementsByName('postcode')[0].value
      this.deliveryDetails.zipCode = ele5
      var ele6 = document.getElementsByName('company-name')[0].value
      this.deliveryDetails.company = ele6
      // await this.$store.commit('checkout/checkout/SAVE_SHIPPING_DETAILS', {
      //   apartmentNumber: ele2,
      //   city: ele3,
      //   streetAddress: ele1,
      //   company: ele6,
      //   state: ele4,
      //   zipCode: ele5
      // });
      // await this.updateShippingOptions();
    },
    notifyUser (notificationData) {
      this.$store.dispatch('notification/spawnNotification', notificationData, {
        root: true
      })
    },
    showLoader () {
      this.$bus.$emit('notification-progress-start', 'Processing order...')
    },
    hideLoader () {
      this.$bus.$emit('notification-progress-stop')
    },
  },
  watch: {
    productsInCart: function (newVal, oldVal) {
      this.updateSampleProducts()
      if (newVal !== oldVal) {
        if (this.productsInCart.length === 0) {
          this.hideModelQuickCheckout()
        }
      }
    },
    isUserLoggedIn: function (newVal, oldVal) {
      setTimeout(()=>{
        this.assignDetails()
        this.autofillDetails()
      }, 1000)
    },
    deliveryDetails: {
      handler: function (newVal) {
        // watch it
        if (!this.isUserLoggedIn) {
          localStorage.setItem(
            'sample-deliveryDetails',
            JSON.stringify(newVal)
          )
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      getCartToken: 'cart/getCartToken',
      appliedCoupon: 'cart/getCoupon',
      totals: 'cart/getTotals',
      getUserToken: 'user/getToken',
      getPersonalDetails: 'checkout/getPersonalDetails'
    }),

    isEnabledReqSamples () {
      let {
        firstName,
        lastName,
        postCode,
        company,
        address1,
        address2,
        city,
        email,
        telephone
      } = this.deliveryDetails
      return !(
        !firstName ||
        !lastName ||
        !postCode ||
        !address1 ||
        !city ||
        !email ||
        !telephone
      )
    },
    samplesMaxedOut () {
      let currentSamples = this.sampleProducts.filter((p) => !!p).length
      if (config.sampleQuote && config.sampleQuote.free_samples_limit) {
        return currentSamples >= config.sampleQuote.free_samples_limit
      }
      return currentSamples >= 3
    },
    isUserLoggedIn () {
      return !!this.getUserToken
    },
    hasFreeSampleWithZeroSubTotal () {
      if (
        this.productsInCart &&
        hasOnlySampleTypeInCart &&
        typeof hasOnlySampleTypeInCart === 'function'
      ) {
        let hasFreeSamplesOnlyInCart = hasOnlySampleTypeInCart({
          cartItems: this.productsInCart,
          sampleType: 'Cut Size',
          allowedEmpty: true
        })
        if (!hasFreeSamplesOnlyInCart) {
          return false
        }
        return (
          this.totals.filter((item, index) => {
            return (
              (item.code === 'subtotal' || item.code === 'subtotal_incl_tax') &&
              item.value === 0
            )
          }).length > 0 && hasFreeSamplesOnlyInCart
        )
      }
      return false
    }
  }
};
</script>
<style lang="scss" scoped>
@font-face {
  font-family: 'Oblik-regular';
  src: url('/assets/fonts/Oblik-Regular.otf');
}

@font-face {
  font-family: 'Oblik';
  src: url('/assets/fonts/Oblik_Bold.otf');
}

.cut-sample-image {
  max-width: 207px;
  padding: 0;
  margin-right: 9px;
  margin-left: 9px;
}

.quick-checkout-inner {
  padding-left: 30px;
  padding-right: 30px;
}

.cut-sample-img-div {
  padding-top: 9px;
  padding-left: 9px;
  padding-right: 9px;
  height: 100%;
  max-height: 186px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
  }
}

.mobile {
  display: none;
}

/*----form-ss--*/
.free-cut-sample-detail-inner form fieldset {
  border: none;
  padding: 0;
  // height: 365px;
}

/* input and labels */
.lg-half {
  width: 100%;
  max-width: 180px;
  margin-right: 24px;
  display: inline-block;
  margin-top: 0;
  margin-bottom: 9px;
}

.postcode {
  max-width: 140px !important;
  margin-bottom: 0px;
}

.find-address {
  margin-bottom: 24px;

  input {
    min-width: 140px;
    border: none;
    background-color: #29275b;
    color: #fff;
    border-radius: 3px;
    font-size: 14px;
    font-weight: bold;
    font-family: Arial;
    line-height: 37px;
    height: 37px;
    vertical-align: middle;
  }
}

label,
input,
button {
  outline: 0;
  border-radius: 0;
}

label,
button {
  cursor: pointer;
}

.lg-half input[type='text'] {
  width: 100%;
  height: 100%;
  min-height: 33px;
  border: 2px solid #d7d6d6;
  color: #4a4643;
  padding: 0 0 0 12px;
  -webkit-appearance: none;
}

.lg-half input[type='text']::-webkit-input-placeholder {
  /* Edge */
  color: #4a4643;
  font-size: 15px;
  font-family: Arial;
}

.lg-half input[type='text']:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #4a4643;
  font-size: 15px;
  font-family: Arial;
}

.lg-half input[type='text']::placeholder {
  color: #4a4643;
  font-size: 15px;
  font-family: Arial;
}

/* submit section */
.btn-sample-request-main {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 27px;
}

button.btn-sample-request {
  padding: 0;
  height: 100%;
  min-height: 50px;
  text-transform: capitalize;
  margin-bottom: 50px;
}

button.btn-sample-request:disabled {
  background-color: gray;
  margin-bottom: 50px;
}

/*---form-ss--*/
.free-cut-sample-detail-inner h3 {
  color: #2a285a;
  font-size: 18px;
  text-align: center;
  font-family: 'Oblik';
  margin: 18px 0;
}

.free-cut-sample-images-title-bottom {
  margin-top: 60px;
  margin-bottom: 56px;
}

.free-cut-sample-images-title-bottom h4 {
  font-size: 16px;
  color: #5c5c60;
  font-family: Arial;
  margin: 0;
  text-align: center;
  font-weight: normal;
}

.free-cut-sample-images-title-bottom h4 strong {
  color: #2a285a;
  margin: 0;
}

.free-cut-sample-add-another-text span {
  text-align: center;
  display: block;
  font-size: 12px;
  font-family: Arial;
  font-weight: bold;
  width: 100%;
  max-width: 120px;
  margin: 0 auto;
}

.free-cut-sample-plus-icon span {
  font-size: 32px;
  font-family: Arial;
}

.remove-icon-img {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

.remove-icon-img img {
  width: 16px;
  height: 16px;
}

.remove-text {
  padding-left: 4px;
  font-size: 12px;
  padding-top: 4px;
}

.free-cut-sample-remove-button span {
  // text-align: center;
  // display: block;
  // padding-top: 12px;
  // background: url('/assets/remove-icon.svg') no-repeat 20% 100%;
  // background-size: 20px;
  cursor: pointer;
}

.free-cut-sample-remove-button {
  margin-top: 21px;
  border-top: 2px solid #a3a1a1;
  width: 92%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-image-inner {
  justify-content: center;
}

.free-cut-sample-title {
  width: 100%;
  max-width: 98%;
  height: 100%;
  max-height: 47px;
}

.free-cut-sample-title h5 {
  font-size: 12px;
  text-align: center;
  color: #2a285a;
  font-family: Arial;
  font-weight: bold;
  margin-top: 11px;
  margin-bottom: 0;
  line-height: 1.5;
}

.cut-sample-image-inner {
  background-color: #eae9e9;
  height: 100%;
  min-height: 320px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.free-cut-sample-images h3 {
  color: #2a285a;
  font-size: 18px;
  text-align: center;
  font-family: 'Oblik';
  margin: 18px 0;
}

.quick-checkout-main {
  padding: 0;
}

.quick-checkout-title {
  background-color: #2a285a;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px 12px 0px 0;
}

.quick-checkout-title h2 {
  font-size: 24px;
  color: #fff;
  margin: 0;
  font-family: 'Oblik';
  background: url('/assets/free-cut-sample-img.svg') no-repeat 0 50%;
  padding-left: 60px;
  padding-top: 30px;
  padding-bottom: 30px;
  background-size: 39px;
}

.quick-checkout-title h1 span {
  padding-left: 7px;
}

.image-icon {
  width: 100%;
  margin: 36px;
}

.modal {
  position: fixed; /* Stay in place */
  z-index: 999; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
}

.modal-backdrop {
  position: fixed; /* Stay in place */
  z-index: 999; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: #ffffff;
  margin: auto;
  width: 100%;
  position: absolute;
  top: 50%;
  max-width: 1245px;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  height: 100%;
  max-height: 565px;
  z-index: 999;
}

/* The Close Button */
.close {
  color: #fff;
  font-size: 40px;
  position: absolute;
  right: -13px;
  background-color: #eb3679;
  width: 43px;
  height: 43px;
  border-radius: 50%;
  top: -15px;
  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: normal;
  font-family: Arial;
  cursor: pointer;
}

button {
  background-attachment: scroll;
  background-clip: border-box;
  background-color: #2aa897;
  background-origin: padding-box;
  background-position: 16% 45%;
  background-repeat: no-repeat;
  background-size: auto auto;
  border: none;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
  display: block;
  float: right;
  font-size: 14px;
  max-width: 260px;
  min-height: auto;
  position: relative;
  text-align: center;
  width: 100%;
  font-family: Arial;
  line-height: auto;
  font-weight: bold;
  padding: 15px 0px;
  text-transform: uppercase;
}

// .cut-sample-img-div img {
//   width: 100%;
//   height: 100%;
// }

.border-mobile {
  display: none;
}

.more-samples {
  .moresample-details {
    h2 {
      font-family: 'oblik';
      color: #29275b;
      font-size: 18px;
      margin-bottom: 0px;
    }

    p {
      font-family: Arial, Helvetica, sans-serif;
      margin-top: 5px;
      line-height: 20px;
      color: #4a4643;
      font-size: 13px;
    }
  }

  .moresample-close-button {
    button {
      background: #857fa3;
      font-family: Arial, Helvetica, sans-serif;
      margin-top: 40px;
      float: left;
      max-width: 219px;
      text-transform: inherit;
    }
  }
}

.postcode-select {
  display: none;
}

@media (min-width: 320px) and (max-width: 767px) {
  .modal-content {
    transform: translate(-50%, -50%);
    border-radius: 0;
    position: fixed;
    max-height: 440px;
  }
  .quick-checkout-title {
    justify-content: flex-start;
    padding-left: 22px;
  }
  .quick-checkout-title h1 {
    font-size: 3.963vw;
    padding-left: 35px;
    background-size: 22px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .quick-checkout-title h1 span {
    font-size: 2.033vw;
    display: block;
    padding-top: 5px;
    padding-left: 0;
  }
  .close {
    font-size: 26px;
    right: 10px;
    width: 35px;
    height: 35px;
    display: none;
  }
  .quick-checkout-inner {
    padding-left: 0;
    padding-right: 0;
    height: 100%;
    max-height: 510px;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-right: 5px;
  }
  .quick-checkout-inner::-webkit-scrollbar-track {
    // -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    // background-color: #dcdcdc;
    // border-radius: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .quick-checkout-inner::-webkit-scrollbar {
    width: 2px;
    background-color: transparent;
    // border-radius: 10px;
  }

  .quick-checkout-inner::-webkit-scrollbar-thumb {
    background-color: #636363;
    // border-radius: 5px;
  }
  .quick-checkout-inner::-webkit-scrollbar-button {
    height: 20px; //for vertical scrollbar
  }
  .free-cut-sample-images h3 {
    margin: 14px 0;
    font-size: 4.267vw;
    text-align: center;
  }
  .cut-sample-image {
    max-width: 100%;
    padding: 0 4px 0 4px;
    margin-right: 0;
    margin-left: 0;
  }
  .cut-sample-image-inner {
    min-height: 187px;
  }
  .cut-sample-img-div {
    padding-top: 4px;
    padding-left: 4px;
    padding-right: 4px;
    height: auto;
    max-height: 100%;
  }
  .free-cut-sample-title {
    max-height: 57px;
    width: 100%;
    max-width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
  .free-cut-sample-title h5 {
    font-size: 2.933vw;
    margin-top: 7px;
  }
  .free-cut-sample-remove-button {
    margin-top: 5px;
    border-top: 1px solid #a3a1a1;
  }
  .free-cut-sample-remove-button span {
    font-size: 2.651vw;
  }
  .free-cut-sample-add-another-text span {
    font-size: 2.933vw;
    line-height: 1.5;
    width: 100%;
    max-width: 85%;
  }
  .free-cut-sample-plus-icon span {
    font-size: 20px;
  }
  .free-cut-sample-images-title-bottom {
    margin-top: 16px;
    margin-bottom: 10px;
  }
  .free-cut-sample-images-title-bottom h4 {
    font-size: 3.2vw;
    width: 100%;
    max-width: 70%;
    margin: 0 auto;
  }
  .free-cut-sample-detail {
    position: relative;
    padding-left: 15px;
  }
  .border-mobile {
    border: 1px solid #e1e1e1;
    width: 100%;
    position: absolute;
    left: 0;
    top: 11px;
    display: block;
  }
  .free-cut-sample-detail-inner {
    margin-top: 10px;
    display: inline-block;
  }
  .free-cut-sample-detail-inner h3 {
    font-size: 4.267vw;
    text-align: center;
    margin: 22px 0 18px 0;
  }
  .lg-half {
    max-width: 46.5%;
    margin-right: 8px;
    margin-bottom: 6px;
  }
  .lg-half input[type='text'] {
    min-height: 25px;
    border: 1px solid #d7d6d6;
    max-width: 95%;
    -webkit-appearance: none;
    line-height: 23px;
    padding-top: 0;
    padding-bottom: 0;
    font-size: 12px;
    color: #4a4643;
    padding-left: 9px;
  }
  .postcode {
    max-width: 28.3% !important;
    margin-right: 7px;
  }
  .find-address input {
    min-width: 110px;
    border-radius: 2px;
    font-size: 7.75px;
    line-height: 0;
    height: 25px;
    -webkit-appearance: none;
  }
  .btn-sample-request-main {
    margin-top: 15px;
  }
  button.btn-sample-request {
    min-height: 30px;
    max-width: 138px;
    font-size: 8.53px;
    margin-bottom: 25px;
  }
  button.btn-sample-request:disabled {
    margin-bottom: 15px;
  }

  .lg-half input[type='text']::-webkit-input-placeholder {
    /* Edge */
    font-size: 9.08px;
  }

  .lg-half input[type='text']:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    font-size: 9.08px;
  }

  .lg-half input[type='text']::placeholder {
    font-size: 9.08px;
  }
  .more-samples .moresample-details p {
    font-size: 3.2vw;
    margin-bottom: 19px;
    margin-top: 8px;
  }
  .moresample-close-button {
    margin-bottom: 13px;
  }
  .more-samples .moresample-close-button button {
    margin-top: 10px;
    float: none;
    border-radius: 0px;
    font-size: 14px;
    margin: 0 auto;
  }
  .more-samples .moresample-details h2 {
    font-size: 3.733vw;
    margin-top: 22px;
  }
  /*----form-ss--*/
  .free-cut-sample-detail-inner form fieldset {
    height: 100%;
  }
  .find-address {
    margin-bottom: 16px !important;
  }
  .desktop {
    display: none;
  }
  .mobile {
    position: relative;
    width: 100%;
    display: block;
  }
  .mobile img {
    position: absolute;
    right: 15px;
    top: 15px;
  }
  .quick-checkout-title h2 {
    font-size: 3.963vw;
    padding-left: 29px;
    padding-top: 20px;
    padding-bottom: 20px;
    background-size: 20px;
  }
  .free-cut-sample-images {
    padding-left: 20px;
    padding-right: 24px;
  }
  .cut-sample-image:last-child {
    padding-right: 0;
  }
  .remove-icon-img img {
    width: 13px;
    height: 13px;
  }
  .remove-text {
    padding-top: 0;
  }
}

@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
  .quick-checkout-inner {
    max-height: 600px;
  }
}

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .quick-checkout-inner {
    max-height: 580px;
  }
}

@media (max-width: 500px) {
  .cut-sample-img-div img {
    width: 100%;
    // max-height: 80px;
  }
}

@media (min-width: 500px) and (max-width: 767px) {
  .cut-sample-img-div img {
    width: 100%;
    max-height: 135px;
  }
}

@media screen and (orientation: landscape) and (min-device-width: 568px) and (max-device-width: 767px) {
  .modal-container {
    max-height: 450px !important;
  }
  .modal-content {
    transform: translate(-50%, -40%);
  }
}

@media screen and (orientation: portrait) and (min-device-width: 320px) and (max-device-width: 320px) {
  .quick-checkout-inner {
    height: 100%;
    max-height: 400px !important;
    overflow-y: scroll;
  }
  .free-cut-sample-title {
    max-height: 48px;
  }
}

@media screen and (orientation: landscape) and (min-device-width: 320px) and (max-device-width: 568px) {
  .quick-checkout-inner {
    height: 100%;
    max-height: 365px !important;
    overflow-y: scroll;
  }
}

@media screen and (orientation: landscape) and (min-device-width: 568px) and (max-device-width: 568px) {
  .quick-checkout-inner {
    height: 100%;
    max-height: 215px;
    overflow-y: scroll;
  }
}

@media screen and (orientation: landscape) and (min-device-width: 667px) and (max-device-width: 667px) {
  .quick-checkout-inner {
    height: 100%;
    max-height: 265px;
    overflow-y: scroll;
  }
}

@media screen and (orientation: landscape) and (min-device-width: 736px) and (max-device-width: 736px) {
  .quick-checkout-inner {
    height: 100%;
    max-height: 300px;
    overflow-y: scroll;
  }
}

// @media only screen and (min-width: 568px) and (max-height: 767px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 2) {
//   .quick-checkout-inner {
//     height: 100%;
//     max-height: 215px;
//     overflow-y: scroll;
//   }
//   .modal-content {
//     transform: translate(-50%, -40%);
//   }
// }

@media (min-width: 768px) and (max-width: 1024px) {
  .close {
    right: 0;
  }
  .quick-checkout-inner {
    padding-left: 9px;
    padding-right: 9px;
  }
  .cut-sample-img-div img {
    width: 100%;
    max-height: 110px;
  }
  .cut-sample-image {
    max-width: 29%;
  }
  .lg-half {
    max-width: 41%;
  }
  .find-address input {
    min-width: 115px;
    -webkit-appearance: none;
  }
  .postcode {
    max-width: 35% !important;
  }
  .quick-checkout-title h1 {
    font-size: 17px;
  }
  .free-cut-sample-images-title-bottom h4 strong {
    color: #2a285a;
    margin: 0;
    font-size: 17px;
    line-height: 0;
  }
  .cut-sample-img-div img {
    width: 100%;
  }
  .cut-sample-img-div {
    height: auto;
    max-height: 100%;
  }
  .lg-half input[type='text'] {
    line-height: 1;
  }
}

@media (min-width: 1025px) and (max-width: 1200px) {
  .close {
    right: 0;
  }
  .quick-checkout-inner {
    padding-left: 9px;
    padding-right: 9px;
  }
  .cut-sample-image {
    max-width: 30.3%;
  }
  .lg-half {
    max-width: 43%;
  }
  .find-address input {
    min-width: 115px;
  }
  .postcode {
    max-width: 35% !important;
  }
  .quick-checkout-title h1 {
    font-size: 17px;
  }
  .free-cut-sample-images-title-bottom h4 strong {
    color: #2a285a;
    margin: 0;
    font-size: 17px;
    line-height: 0;
  }
  .cut-sample-img-div img {
    width: 100%;
  }
}

@media (min-width: 992px) and (max-width: 1024px) {
  .lg-half {
    max-width: 42.5%;
  }
  .quick-checkout-title h1 {
    font-size: 24px;
  }
}
</style>
<style lang="scss">
.free-cut-sample-detail .postcode-select p {
  padding: 7px 0px 16px 16px;
  font-size: 14px;
  font-style: italic;
  color: #e7008a;
  font-family: Arial;
  margin: 0;
}

.postcode-select select {
  width: 100% !important;
  height: 37px;
  border: 2px solid #d7d6d6;
  background: #fff;
  color: #4a4643;
  font-size: 15px;
  font-family: Arial;
  max-width: 410px;
  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  text-overflow: '';
  padding-left: 14px;
  line-height: 2;
}

@media (min-width: 320px) and (max-width: 767px) {
  .postcode-select select {
    width: 100% !important;
    height: 30px;
    border: 1px solid #d7d6d6;
    max-width: 335px;
    padding-left: 10px;
    font-size: 12px;
  }
  .free-cut-sample-detail .postcode-select p {
    font-size: 10px;
    padding: 7px 0px 13px 16px;
  }
}
</style>
