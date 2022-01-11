<template>
  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
    <div class="container">
      <div class="breadcrumbs mt10 h5 cl-gray">
        <span class="home-breadcrumb-icon product-page-home-breadcrumb-icon">
          <router-link :to="localizedRoute('/')" class="cl-tertiary links">
            <img
              class="home-breadcrumb-icon-img"
              src="/assets/home-breadcrumb-icon.svg"
            /> </router-link
          >|
        </span>
        <span class="cl-mine-shaft">Swatches Page</span>
      </div>
      <div class="row">
        <div
          class="main_fabric col-lg-8 col-md-8 col-sm-12 col-xs-12"
          ref="quickCheckoutInner"
        >
          <div class="fabrics-detail">
            <div class="boxes" v-for="item of swatches" :key="item.name">
              <h2>{{ item.name }}</h2>
              <ul>
                <li
                  v-for="product of item.products"
                  :key="product.sku"
                  @click="addToCart(product)"
                >
                  <div class="not-selected" v-bind:id="product.sku">
                    <div class="fabric-tile__tile">
                      <swatch-product :product="product" />
                      <div class="fabric-tile__trigger"></div>
                    </div>
                    <div class="heading">
                      <h3>{{ product.name }}</h3>
                    </div>
                  </div>
                  <div class="overlay-hover">
                    <div class="overlay-styling">
                      <swatch-product :product="product" />
                      <h3>{{ product.name }}</h3>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="swatch-basket col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <h2>Your swatch basket</h2>
          <div class="selected-boxes">
            <ul id="swatchBox">
              <li>
                <div class="fabric-tile-empty" v-if="!swatchBasket[0]"></div>
                <div
                  class="not-selected"
                  v-bind:id="swatchBasket[0].sku"
                  v-if="swatchBasket[0]"
                  @click="removeFromCart(swatchBasket[0])"
                >
                  <div class="fabric-tile__tile">
                    <swatch-product :product="swatchBasket[0]" />
                    <div class="fabric-tile__trigger"></div>
                  </div>
                  <div class="heading">
                    <h3>{{ swatchBasket[0].name }}</h3>
                  </div>
                </div>
              </li>
              <li>
                <div class="fabric-tile-empty" v-if="!swatchBasket[1]"></div>
                <div
                  class="not-selected"
                  v-bind:id="swatchBasket[1].sku"
                  v-if="swatchBasket[1]"
                  @click="removeFromCart(swatchBasket[1])"
                >
                  <div class="fabric-tile__tile">
                    <swatch-product :product="swatchBasket[1]" />
                    <div class="fabric-tile__trigger"></div>
                  </div>
                  <div class="heading">
                    <h3>{{ swatchBasket[1].name }}</h3>
                  </div>
                </div>
              </li>
              <li>
                <div class="fabric-tile-empty" v-if="!swatchBasket[2]"></div>
                <div
                  class="not-selected"
                  v-bind:id="swatchBasket[2].sku"
                  v-if="swatchBasket[2]"
                  @click="removeFromCart(swatchBasket[2])"
                >
                  <div class="fabric-tile__tile">
                    <swatch-product :product="swatchBasket[2]" />
                    <div class="fabric-tile__trigger"></div>
                  </div>
                  <div class="heading">
                    <h3>{{ swatchBasket[2].name }}</h3>
                  </div>
                </div>
              </li>
              <li>
                <div class="fabric-tile-empty" v-if="!swatchBasket[3]"></div>
                <div
                  class="not-selected"
                  v-bind:id="swatchBasket[3].sku"
                  v-if="swatchBasket[3]"
                  @click="removeFromCart(swatchBasket[3])"
                >
                  <div class="fabric-tile__tile">
                    <swatch-product :product="swatchBasket[3]" />
                    <div class="fabric-tile__trigger"></div>
                  </div>
                  <div class="heading">
                    <h3>{{ swatchBasket[3].name }}</h3>
                  </div>
                </div>
              </li>
              <li>
                <div class="fabric-tile-empty" v-if="!swatchBasket[4]"></div>
                <div
                  class="not-selected"
                  v-bind:id="swatchBasket[4].sku"
                  v-if="swatchBasket[4]"
                  @click="removeFromCart(swatchBasket[4])"
                >
                  <div class="fabric-tile__tile">
                    <swatch-product :product="swatchBasket[4]" />
                    <div class="fabric-tile__trigger"></div>
                  </div>
                  <div class="heading">
                    <h3>{{ swatchBasket[4].name }}</h3>
                  </div>
                </div>
              </li>
              <li>
                <div class="fabric-tile-empty" v-if="!swatchBasket[5]"></div>
                <div
                  class="not-selected"
                  v-bind:id="swatchBasket[5].sku"
                  v-if="swatchBasket[5]"
                  @click="removeFromCart(swatchBasket[5])"
                >
                  <div class="fabric-tile__tile">
                    <swatch-product :product="swatchBasket[5]" />
                    <div class="fabric-tile__trigger"></div>
                  </div>
                  <div class="heading">
                    <h3>{{ swatchBasket[5].name }}</h3>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <form
            id="orderForm"
            @submit.prevent="submitForm"
            method="post"
            novalidate
          >
            <div class="hidden" id="hidden_div"></div>

            <div class="row mainFormRow">
              <div
                class="required col-lg-6 col-md-6 col-sm-6 col-xs-6 paddingRightFour"
              >
                <label for="first-name">
                  First Name
                  <span>*</span>
                </label>
                <div class="ui-input-text">
                  <base-input
                    type="text"
                    name="first-name"
                    autocomplete="given-name"
                    v-model.trim="user.firstName"
                    @blur="$v.user.firstName.$touch()"
                    :validations="[
                      {
                        condition:
                          !$v.user.firstName.required &&
                          $v.user.firstName.$error,
                        text: $t('Field is required.')
                      },
                      {
                        condition: !$v.user.firstName.minLength,
                        text: $t('Name must have at least 2 letters.')
                      }
                    ]"
                  />
                </div>
              </div>
              <div
                class="required col-lg-6 col-md-6 col-sm-6 col-xs-6 paddingLeftFour"
              >
                <label for="last-name">
                  Last Name
                  <span>*</span>
                </label>
                <div class="ui-input-text">
                  <base-input
                    type="text"
                    name="last-name"
                    autocomplete="family-name"
                    v-model="user.lastName"
                    @blur="$v.user.lastName.$touch()"
                    :validations="[
                      {
                        condition:
                          !$v.user.lastName.required && $v.user.lastName.$error,
                        text: $t('Field is required.')
                      }
                    ]"
                  />
                </div>
              </div>
            </div>
            <div class="row mainFormRow marginTop">
              <div
                class="required col-lg-6 col-md-6 col-sm-6 col-xs-6 paddingRightFour"
              >
                <label for="phone-number">
                  Phone
                  <span>*</span>
                </label>
                <div class="ui-input-text">
                  <base-input
                    type="tel"
                    id="phone"
                    name="shipping-country"
                    required
                    v-model="user.phone"
                    @keyup="onChanged(user.phone)"
                    @blur="$v.user.phone.$touch()"
                    :validations="[
                      {
                        condition:
                          !$v.user.phone.required && $v.user.phone.$error,
                        text: $t('Field is required.')
                      }
                    ]"
                  />
                </div>
              </div>
              <div
                class="required col-lg-6 col-md-6 col-sm-6 col-xs-6 paddingLeftFour"
              >
                <label for="email-address">
                  Email
                  <span>*</span>
                </label>
                <div class="ui-input-text">
                  <base-input
                    type="email"
                    name="email-address"
                    autocomplete="email"
                    v-model="user.email"
                    @blur="$v.user.email.$touch()"
                    :validations="[
                      {
                        condition:
                          !$v.user.email.required && $v.user.email.$error,
                        text: $t('Field is required.')
                      },
                      {
                        condition: !$v.user.email.email && $v.user.email.$error,
                        text: $t('Please provide valid e-mail address.')
                      }
                    ]"
                  />
                </div>
              </div>
            </div>
            <div id="hide">
              <!-- <div class="field-full required">
                <label for="address_line1">
                  Address line 1
                  <span>*</span>
                </label>
                <div class="ui-input-text">
                  <base-input
                    type="text"
                    id="Addressline1"
                    autocomplete="'address_line1' +'address_line2'"
                    v-model="user.addressLine1"
                    @blur="$v.user.addressLine1.$touch()"
                    :validations="[
                      {
                        condition:
                          !$v.user.addressLine1.required &&
                          $v.user.addressLine1.$error,
                        text: $t('Field is required.'),
                      },
                    ]"
                  />
                </div>
              </div>
              <div class="field-full required">
                <label for="address_line2">Address line 2</label>
                <div class="ui-input-text">
                  <base-input
                    type="text"
                    name="address_line2"
                    v-model="user.addressLine2"
                  />
                </div>
              </div>
              <div class="field-full required">
                <label for="address_line2">Company</label>
                <div class="ui-input-text">
                  <base-input
                    type="text"
                    name="address_line2"
                    v-model="user.company"
                  />
                </div>
              </div>
              <div class="field-full required">
                <label for="city">
                  Town
                  <span>*</span>
                </label>
                <div class="ui-input-text">
                  <base-input
                    type="text"
                    name="city"
                    autocomplete="address-level2"
                    v-model="user.city"
                    @blur="$v.user.city.$touch()"
                    :validations="[
                      {
                        condition:
                          !$v.user.city.required &&
                          $v.user.city.$error,
                        text: $t('Field is required.'),
                      },
                    ]"
                  />
                </div>
              </div> -->

              <div class="field-full required marginTop">
                <label for="order_postcode"> Address Finder </label>
                <div class="ui-input-text">
                  <base-input
                    type="text"
                    name="postcode"
                    autocomplete="postal-code"
                    v-model="user.postCode"
                  />
                </div>
              </div>
              <div
                class="
                  field-full
                  required
                  POST
                  Code
                  from
                  wallsandfloors
                  walls
                  and
                  floors
                  
                "
              >
                <p
                  style="display: none"
                  class="input-wrapper lg-half address-postcode"
                >
                  <label>Address <span class="star">*</span></label>
                  <span @click="enterAddressManually()" id="enter-address"
                    >&nbsp;</span
                  >
                  <span
                    @click="enterAddressFullManually()"
                    id="enter-addressLine1"
                    >Enter Address Manually</span
                  >
                  <input
                    type="text"
                    id="address_1"
                    name="postcode"
                    required
                    placeholder="Start typing your address or postcode..."
                    v-model="user.addressLine1"
                    @focus="overflowHide"
                    @keyup="overflowHide"
                    @blur="resetOverflowHide"
                  />
                </p>

                <div class="manually-added-fields">
                  <div class="row">
                    <div
                      class="col-lg-12 col-md-12 col-sm-12 col-xs-12 minHeight0  address-postcode"
                    >
                      <label>Address line 1 <span class="star">*</span></label>
                      <!-- <span @click="enterPostCode()">Enter Postcode</span> -->
                      <base-input
                        type="text"
                        id="address_manuall_1"
                        name="street-address"
                        required
                        placeholder=""
                        v-model="user.addressLine1"
                        @blur="$v.user.addressLine1.$touch()"
                        :validations="[
                          {
                            condition:
                              !$v.user.addressLine1.required &&
                              $v.user.addressLine1.$error,
                            text: $t('Field is required.')
                          }
                        ]"
                      />
                    </div>
                    <div
                      class="col-lg-12 col-md-12 col-sm-12 col-xs-12 minHeight0  address-postcode"
                    >
                      <label>Address line 2</label>
                      <!-- <span @click="enterPostCode()">Enter Postcode</span> -->
                      <input
                        type="text"
                        id="address_2"
                        name="street-address"
                        placeholder=""
                        v-model="user.addressLine2"
                      />
                    </div>
                    <div
                      class="col-lg-12 col-md-12 col-sm-12 col-xs-12 minHeight0 address-line"
                      style="display: none"
                    >
                      <input
                        type="text"
                        id="address_2"
                        name="apartment-number"
                        placeholder="Line 2"
                        v-model="user.addressLine2"
                      />
                    </div>
                    <div
                      class="col-lg-12 col-md-12 col-sm-12 col-xs-12 minHeight0 city-lg-half"
                    >
                      <label>Town <span class="star">*</span></label>
                      <base-input
                        type="text"
                        id="city"
                        name="city"
                        required
                        placeholder=""
                        v-model="user.city"
                        @blur="$v.user.city.$touch()"
                        :validations="[
                          {
                            condition:
                              !$v.user.city.required && $v.user.city.$error,
                            text: $t('Field is required.')
                          }
                        ]"
                      />
                    </div>
                    <div
                      class="col-lg-12 col-md-12 col-sm-12 col-xs-12 minHeight0  find-address-type"
                    >
                      <label>Postcode <span class="star">*</span></label>
                      <base-input
                        type="text"
                        required
                        id="find_address_manuall"
                        placeholder=""
                        v-model="user.postCode2"
                        @blur="$v.user.postCode2.$touch()"
                        :validations="[
                          {
                            condition:
                              !$v.user.postCode2.required &&
                              $v.user.postCode2.$error,
                            text: $t('Field is required.')
                          }
                        ]"
                      />
                    </div>
                  </div>

                  <p class="input-wrapper lg-half find-address-type"></p>
                </div>
                <label
                  class="address-summary-label"
                  id="address-summary-label"
                  style="display: none"
                  >Address</label
                >
                <!-- <div
                  class="address-summary"
                  id="address-summary"
                  style="display: none"
                >
                  <div class="non-edited-text">
                    <template v-if="user.company">
                      {{ user.company }}<br />
                    </template>
                    <template v-if="user.addressLine1">
                      {{ user.addressLine1 }}<br />
                    </template>
                    <template v-if="user.addressLine2">
                      {{ user.addressLine2 }}<br />
                    </template>
                    <template v-if="user.city">
                      {{ user.city }} <br />
                    </template>
                    <template v-if="user.postCode">
                      {{ user.postCode }}
                    </template>
                  </div>
                </div>
                <span
                  @click="enterEditAddressManuallyFunc()"
                  id="edit-address-again"
                  class="EditAddressAgain"
                  style="display: none"
                  >Edit Address</span
                >  -->
              </div>
            </div>
            <p class="swatches-term-condition">
              Read our full
              <a href="/terms" class="ui-link" data-ajax="false"
                >terms and conditions</a
              >
              and
              <a href="/privacy-policy" class="ui-link" data-ajax="false"
                >privacy policy</a
              >
            </p>
            <button
              type="submit"
              class="btn-order ui-btn ui-shadow ui-corner-all"
            >
              Order Now
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Breadcrumbs from "../components/core/Breadcrumbs.vue";
// import BaseInput from "src/theme/components/core/blocks/Form/BaseInput.vue";
import BaseInput from "src/themes/tilemountain/components/core/blocks/Form/BaseInput.vue";
import BaseSelect from "src/themes/tilemountain/components/core/blocks/Form/BaseSelect.vue";
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";
import axios from "axios";
import SwatchProduct from "theme/components/core/blocks/swatches/SwatchProduct.vue";
// /home/ejaz/vsf/BEDFACTORY/newBFD/bfdvuestore/src/themes/tilemountain/components/core/blocks/swatches/SwatchProduct.vue
import i18n from "@vue-storefront/i18n";
// import { htmlDecode } from '@vue-storefront/core/lib/store/filters';
import config from "config";
import AddressLookupMixin from "src/themes/bedfactory/mixins/addressLookupMixin";

export default {
  components: { Breadcrumbs, BaseInput, BaseSelect, SwatchProduct },
  mixins: [AddressLookupMixin],
  data() {
    return {
      user: {
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        postCode2: "",
        postCode: ""
      },
      swatches: [],
      swatchBasket: []
    };
  },
  validations: {
    user: {
      email: {
        required,
        email
      },
      firstName: {
        minLength: minLength(2),
        required
      },
      lastName: {
        required
      },
      phone: {
        required
      },
      addressLine1: {
        required
      },
      city: {
        required
      },
      postCode2: {
        required
      }
    }
  },
  methods: {
    onChanged(text) {
      this.user.phone = text.replace(/[^0-9]/g, "");
    },
    assignAddressValues() {
      var ele1 = document.getElementById("address_manuall_1").value;
      this.user.addressLine1 = ele1;
      var ele2 = document.getElementById("address_2").value;
      this.user.addressLine2 = ele2;
      var ele3 = document.getElementById("city").value;
      console.log("hurreeee", ele3);
      this.user.city = ele3;
      // var ele4 = document.getElementById('shipping-company').value
      // this.user.company = ele4
      var ele5 = document.getElementById("find_address_manuall").value;
      console.log("hurrr222", ele5);
      this.user.postCode2 = ele5;
      console.log("hurr333", ele5);
      this.user.postCode = ele5;

      console.log("741254 user", this.user);
    },
    overflowHide() {
      this.$refs.quickCheckoutInner.style.overflowY = "hidden";
    },
    resetOverflowHide() {
      this.$refs.quickCheckoutInner.style.overflowY = "auto";
    },
    enterAddressManually() {
      console.log("enterAddressManually");
      let autoFillField = document.getElementsByClassName("address-postcode");
      if (autoFillField) {
        autoFillField[0].style.display = "none";
        // document.getElementsByClassName('manually-added-fields')[0].style.display = 'block'
        // setTimeout(()=>{
        this.assignAddressValues();
        // document.getElementById('address-summary-label').style.display = 'block'
        // document.getElementById('address-summary').style.display = 'block'
        // document.getElementById('edit-address-again').style.display = 'block'
        let fieldHeight = document.getElementById("fieldset-inner");
        if (fieldHeight) fieldHeight.classList.add("expandfield");
        // }, 500)
      }
    },
    enterAddressFullManually() {
      console.log("enterAddressFullManually");
      let autoFillField = document.getElementsByClassName("address-postcode");
      if (autoFillField) {
        autoFillField[0].style.display = "none";
        document.getElementsByClassName(
          "manually-added-fields"
        )[0].style.display = "block";
        document.getElementById("address-summary-label").style.display = "none";
        document.getElementById("address-summary").style.display = "none";
        document.getElementById("edit-address-again").style.display = "none";
        let fieldHeight = document.getElementById("fieldset-inner");
        fieldHeight.classList.add("expandfield");
        setTimeout(() => {
          this.assignAddressValues();
        }, 500);
      }
    },
    enterEditAddressManuallyFunc() {
      this.enterPostCode();
    },
    enterPostCode() {
      document.getElementsByClassName(
        "manually-added-fields"
      )[0].style.display = "none";
      document.getElementById("address_1").value = "";
      document.getElementById("address-summary-label").style.display = "none";
      document.getElementById("address-summary").style.display = "none";
      document.getElementById("edit-address-again").style.display = "none";
      let autoFillField = document.getElementsByClassName("address-postcode");
      autoFillField[0].style.display = "block";
    },
    autofillDetails() {
      let {
        city,
        country,
        firstName,
        lastName,
        phone,
        region,
        postcode,
        street,
        house,
        email
      } = this.shippingDetails;
      this.user.firstName = firstName;
      this.user.lastName = lastName;
      this.user.phone = phone;
      this.user.city = city;
      this.user.postCode = "";
      this.user.postCode2 = postcode;
      this.user.addressLine1 = street;
      this.user.addressLine2 = house ? house : " ";
      this.user.email =
        this.currentUser && this.currentUser.email
          ? this.currentUser.email
          : "";
    },
    retrunFullName() {
      //     console.log("2211 in return full name function", this);
      const fullName = this.user.firstName + this.user.lastName;
      //   console.log("Full name is ", fullName);
      return fullName;
    },
    submitForm(event) {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      if (this.swatchBasket.length === 0) {
        this.$store.dispatch("notification/spawnNotification", {
          type: "error",
          message: i18n.t("Swatch basket is empty."),
          action1: { label: i18n.t("OK") }
        });
      } else {
        this.$bus.$emit(
          "notification-progress-start",
          this.$t("Processing order...")
        );
        const swatchesInOrder = this.swatchBasket.map(
          element => element.entity_id
        );
        const payload = {
          id: swatchesInOrder,
          address: {
            firstname: this.user.firstName,
            email: this.user.email,
            city: this.user.city,
            lastname: this.user.lastName,
            phone: this.user.phone,
            address_line1: this.user.addressLine1,
            town: this.user.city,
            postcode: this.user.postCode2,
            country: "GB",
            street: this.user.addressLine1,
            country_code: "UK"
            // country_code: "US",
            // country: "US",
          }
        };
        const URL = config.api.url + config.swatches.endpoint + "/placeorder";
        axios
          .post(URL, payload)
          .then(res => {
            if (res.status !== 200) {
              this.$bus.$emit("notification-progress-stop", {});
              console.log("78945614 notificationData", notificationData);
              this.$store.dispatch("notification/spawnNotification", {
                type: "error",
                message: i18n.t(`${res.result}`),
                action1: { label: i18n.t("OK") }
              });
              throw new Error(res.result);
            } else {
              this.swatchBasket = [];
              this.$bus.$emit("notification-progress-stop", {});
              this.$store.dispatch("notification/spawnNotification", {
                type: "success",
                message: i18n.t(`Order placed successfully`),
                action1: { label: i18n.t("OK") }
              });
              // console.log(
              //   "2211 success for swatch place order",
              //   this.retrunFullName()
              // );
              this.$bus.$emit(
                "get-swatch-customer-fullname",
                this.retrunFullName()
              );
              this.$router.replace("/swatches-success");
            }
          })
          .catch(err => {
            console.log("78945623 in catch", err);
            this.$bus.$emit("notification-progress-stop", {});
            this.$store.dispatch(
              "notification/spawnNotification",
              {
                type: "error",
                message: i18n.t(`${err}`),
                action1: { label: i18n.t("OK") }
              },
              { root: true }
            );
          });
      }
    },
    addToCart(value) {
      if (this.swatchBasket.indexOf(value) === -1) {
        this.cartItemsChecker();
      }

      if (
        this.swatchBasket.length <= 5 &&
        this.swatchBasket.indexOf(value) === -1
      ) {
        this.swatchBasket.push(value);
        const element = document.getElementById(value.sku);
        element.classList.add("selected");
      } else if (
        this.swatchBasket.length > 0 &&
        this.swatchBasket.indexOf(value) !== -1
      ) {
        this.swatchBasket.splice(this.swatchBasket.indexOf(value), 1);
        const element = document.getElementById(value.sku);
        element.classList.remove("selected");
      }
    },
    cartItemsChecker() {
      if (this.swatchBasket.length === 6) {
        this.$store.dispatch("notification/spawnNotification", {
          type: "error",
          message: i18n.t("You have already added six items  in cart."),
          action1: { label: i18n.t("OK") }
        });
      }
    },
    removeFromCart(value) {
      this.swatchBasket.splice(this.swatchBasket.indexOf(value), 1);
      const element = document.getElementById(value.sku);
      element.classList.remove("selected");
    }
  },
  mounted() {
    const scriptList = document.querySelectorAll(
      "script[type='text/javascript']"
    );
    const convertedNodeList = Array.from(scriptList);
    const cc_c2aScript = convertedNodeList.find(
      script => script.id === "clickToAddressId"
    );
    cc_c2aScript?.parentNode.removeChild(cc_c2aScript);
    if (document.getElementById("cc_c2a") !== null) {
      document.getElementById("cc_c2a").remove();
    }
    setTimeout(() => {
      this.addressLookUpFinder();
    }, 1000);
    const URL = config.api.url + config.swatches.endpoint + "/getSwatches";
    //   const URL =  "https:/bfd.bedfactorydirect.co.uk/api/ext/swatches/getSwatches"
    axios
      .get(URL)
      .then(resp => {
        const { data } = resp;
        if (data.code !== 200) {
          throw new Error("An Error occured");
        } else {
          this.swatches = [...data.meta];
        }
      })
      .catch(err => {
        console.error("Error is ===============> ", err);
      });
  },
  computed: {
    // retrunFullName () {
    //   console.log("2211 in return full name function",this);
    //   const fullName = this.user.firstName + this.user.lastName;
    //   console.log("Full name is ",fullName);
    //   return fullName;
    // },
  },
  beforeMount() {
    const craftyplugin = document.createElement("script");
    craftyplugin.setAttribute("src", "/assets/js/crafty_postcode.class.js");
    document.head.appendChild(craftyplugin);
    const craftAddressLookUpplugin = document.createElement("script");
    craftAddressLookUpplugin.setAttribute("src", "/assets/js/cc_c2a.min.js");
    document.head.appendChild(craftAddressLookUpplugin);
  }
};
</script>

<style>
.mainFormRow {
  justify-content: center;
  flex-wrap: wrap;
}
/* .manually-added-fields .address-postcode .base-input {
  min-height: 3rem;
}
.manually-added-fields .city-lg-half .base-input {
  min-height: 2rem;
}
.manually-added-fields .find-address-type .base-input {
  min-height: 2rem;
} */
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
input[type="text"] {
  /* width: 100%;
   padding: 12px 20px;
   margin: 8px 0; */
  box-sizing: border-box;
  /* // border: 3px solid #ccc;
  // -webkit-transition: 0.5s;
  // transition: 0.5s; */
  outline: none;
}
input[type="text"]:focus {
  border: 2px solid #747474 !important;
}

/* for number */
input[type="number"] {
  box-sizing: border-box;
  outline: none;
}
input[type="number"]:focus {
  border: 2px solid #747474 !important;
}

/* /// for Email */
input[type="email"] {
  box-sizing: border-box;
  outline: none;
}
input[type="email"]:focus {
  border: 2px solid #747474 !important;
}

.fabrics-detail {
  margin-top: 40px;
}
.fabrics-detail h2 {
  display: block;
  text-transform: uppercase;
  color: #747474;
  line-height: 1.2;
  letter-spacing: 0.05em;
  font-size: 16px;
  margin-bottom: 10px;
  font-family: "Raleway", sans-serif;
  font-weight: 400;
}
.fabrics-detail ul {
  padding: 0px;
}
.fabrics-detail ul li {
  list-style: none;
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 15px;
  position: relative;
}
.fabrics-detail .boxes ul li .not-selected {
  display: block;
  cursor: pointer;
}
.fabrics-detail .boxes ul li .fabric-tile__tile {
  height: 113px;
  width: 113px;
  background-color: #eee;
  background-size: 100%;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
}
.fabrics-detail .boxes ul li .php-category_11 img {
  width: 100%;
}
.ui-input-text .relative {
  min-height: 0rem !important;
}
.fabric-tile__trigger {
  position: absolute;
  display: block;
  font-size: 0;
  top: 5px;
  right: 5px;
  background: rgba(115, 192, 193, 0.95);
  border-radius: 2px;
  padding: 13px;
}
.fabric-tile__trigger::before {
  content: " ";
  position: absolute;
  display: block;
  background-color: #fff;
  width: 2px;
  margin-left: -5px;
  left: 62%;
  top: 7px;
  bottom: 7px;
}
.fabric-tile__trigger::after {
  content: " ";
  position: absolute;
  display: block;
  background-color: #fff;
  height: 2px;
  margin-top: -5px;
  top: 65.4%;
  left: 6px;
  right: 8px;
}
.fabrics-detail .boxes ul li .heading {
  display: none;
}
.fabrics-detail .boxes ul li .overlay-hover {
  display: none;
  position: absolute;
  background: #fff;
  border: 1px solid #dfdfdf;
  margin-bottom: 50px;
  margin-left: -40px;
  z-index: 999;
  padding: 14px 9px 9px 9px;
  top: -255px;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
}
.fabrics-detail .boxes ul li .overlay-hover .overlay-styling {
  position: relative;
  width: 180px;
  z-index: 210;
  bottom: 100%;
  left: 50%;
  transform: translate(-50%, -5px);
  pointer-events: none;
  text-align: center;
  background: transparent;
}
.fabrics-detail .boxes ul li .overlay-hover .overlay-styling img {
  width: 100%;
}
.fabrics-detail .boxes ul li .overlay-hover .overlay-styling h3 {
  color: #747474;
  font-weight: 400;
  font-family: "Raleway", sans-serif;
  font-size: 14px;
  margin-bottom: 0px;
  padding: 0px 10px;
  /* height: 30px; */
  margin: 0;
  line-height: 2;
}
.fabrics-detail .boxes ul li .not-selected {
  display: block;
  cursor: pointer;
}
.fabrics-detail .boxes ul li:hover .overlay-hover {
  display: block;
}
.fabrics-detail .boxes ul li .overlay-hover::before {
  bottom: -10px;
  border-bottom: 1px solid #dfdfdf;
  transform: translateX(-50%) rotate(45deg);
  content: "";
  position: absolute;
  left: 50%;
  width: 20px;
  height: 20px;
  background: #fff;
  z-index: -1;
}
.breadcrumbs {
  padding-top: 1rem;
}

.breadcrumbs span {
  color: #54575b;
  padding: 0px 2.5px;
}

img.home-breadcrumb-icon-img {
  width: 15px;
  float: left;
  margin: 1px 2.5px 0 0;
}
.swatch-basket {
  background: #eee;
  border-radius: 4px;
  text-align: left;
  position: relative;
  padding: 15px;
}
.swatch-basket h2 {
  text-transform: uppercase;
  color: #73c0c1;
  line-height: 1.2;
  letter-spacing: 0.05em;
  font-size: 16px;
  margin-bottom: 20px;
  font-weight: 400;
}
.swatch-basket .selected-boxes ul {
  padding: 0px;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-flow: row wrap;
  flex-flow: row wrap;
  justify-content: space-around;
}
.swatch-basket ul li {
  list-style: none;
  width: 32%;
  padding-right: 5px;
  margin-bottom: 5px;
}
.swatch-basket ul li:nth-child(3n + 3) {
  padding-right: 0;
}
.swatch-basket .selected-boxes ul li .fabric-tile-empty {
  background: 0 0;
  border: 1px dashed #c6c6c6;
  min-height: 110px;
  cursor: pointer;
}
.swatch-basket > form .field {
  padding: 0px;
  margin-bottom: 15px;
  width: 46%;
  margin-right: 8px;
  display: inline-block;
}
.swatch-basket > form label {
  display: block;
  margin-bottom: 8px;
  text-align: left;
  cursor: pointer;
  color: #747474;
  font-size: 14px;
}
.swatch-basket > form label > span {
  display: inline;
  color: #ef0b0b;
}
.swatch-basket > form input {
  display: block;
  border-radius: 4px;
  border: 1px solid #dfdfdf;
  background: #fff;
  height: unset !important;
  width: 100%;
  line-height: 28px;
  font-size: 14px;
  padding: 0 3px;
  color: #747474;
}
.swatch-basket > form input:focus,
.swatch-basket > form input:hover {
  border: 1px solid #747474 !important;
}
input:-webkit-autofill {
  -webkit-text-fill-color: #747474 !important;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
}
.swatch-basket form .field-full {
  padding: 0px;
  margin-bottom: 15px;
  width: 100%;
  display: inline-block;
}
.swatch-basket form .field-full label {
  display: block;
  margin-bottom: 8px;
  text-align: left;
  cursor: pointer;
  color: #747474;
  font-size: 14px;
}
.swatch-basket form .field-full.required label > span {
  display: inline;
  color: #e92171;
}

.swatch-basket form .field-full input {
  display: block;
  border-radius: 4px;
  border: 1px solid #dfdfdf;
  background: #fff;
  width: 100%;
  height: unset !important;
  line-height: 2;
  outline: none;
  font-size: 14px;
  padding: 0 8px;
  color: #747474;
}
.swatch-basket form p {
  text-align: left;
  font-size: 14px;
  margin: 5px 0px 20px 0px;
  font-family: Arial, Helvetica, sans-serif;
  color: #5e5e61;
  line-height: 17px;
}
a.ui-link {
  color: #ed008c;
}
.swatch-basket form .btn-order {
  display: block;
  /* width: 100%; */
  outline: 0;
  border: none !important;
  white-space: nowrap;
  vertical-align: baseline;
  font-size: 14px;
  letter-spacing: 0.05em;
  background: #071a44;
  color: #fff;
  line-height: normal;
  box-shadow: none;
  text-align: center;
  text-transform: uppercase;
  transition: all 250ms ease-in-out;
  line-height: normal;
  white-space: normal;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  font-weight: 800;
  /* height: 32px; */
  padding: 1em 3em;
  margin: 0px auto;
}
.swatch-basket .selected-boxes .not-selected {
  border: 1px dashed #c6c6c6;
  min-height: 110px;
  display: block;
  border-radius: 2px;
  cursor: pointer;
}
.swatch-basket .selected-boxes ul li .product-image {
  background-color: #eee;
  background-size: 100%;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
}
.swatch-basket .selected-boxes ul li .product-image {
  height: 100px;
  width: 100%;
  overflow: hidden;
  margin-bottom: -6px;
}
.swatch-basket .selected-boxes ul li .product-image img {
  height: 100px;
}
.swatch-basket .selected-boxes ul li .heading {
  display: block;
  width: 100%;
  overflow: hidden;
  height: 70px;
  background: #fff;
}
.swatch-basket .selected-boxes ul li .heading h3 {
  color: #747474;
  font-weight: 400;
  font-family: "Raleway", sans-serif;
  font-size: 12px;
  margin-bottom: 0px;
  text-align: center;
  margin-bottom: 50px;
  text-align: center;
  line-height: 16px;
  margin-top: 15px;
}
.fabrics-detail .boxes ul li .selected {
  display: block;
  box-shadow: 0 0 0 3px #fbbe63;
  z-index: 999;
  cursor: pointer;
}
.fabrics-detail .boxes ul li .selected .fabric-tile__trigger::after {
  content: " ";
  position: absolute;
  display: block;
  background-color: #fff;
  height: 2px;
  margin-top: -5px;
  top: 65%;
  left: 6px;
  right: 8px;
  z-index: 9;
}
.fabrics-detail .boxes ul li .selected .fabric-tile__trigger {
  position: absolute;
  display: block;
  font-size: 0;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  padding: 13px;
}
.fabrics-detail .boxes ul li .selected .fabric-tile__trigger::before {
  content: " ";
  position: absolute;
  display: block;
  background-color: #fff;
  width: 0px;
  margin-left: -5px;
  top: 62%;
  left: 7px;
  right: 7px;
  z-index: 9;
}
.fabric-tile__tile {
  position: relative;
}
.swatch-basket .selected-boxes .fabric-tile__trigger::before {
  content: " ";
  position: absolute;
  display: block;
  background-color: #fff;
  width: 0px;
  margin-left: -5px;
  left: 60%;
  top: 7px;
  bottom: 7px;
  z-index: 9;
}
.swatch-basket .selected-boxes .fabric-tile__trigger::after {
  content: " ";
  position: absolute;
  display: block;
  background-color: #fff;
  height: 2px;
  margin-top: -5px;
  top: 65%;
  left: 7px;
  right: 8px;
  z-index: 9;
}
/* .swatch-basket form .row {
  margin-left: 0;
} */
@media (max-width: 767px) {
  .fabrics-detail .boxes ul li .heading {
    display: block;
    overflow: hidden;
    height: 75px;
    width: 88px;
    margin: 0 auto;
  }
  .fabrics-detail .boxes ul li .heading h3 {
    color: #747474;
    font-weight: 400;
    font-family: "Raleway", sans-serif;
    font-size: 2.2vw;
    margin-bottom: 0px;
    text-align: center;
    margin-bottom: 50px;
    text-align: center;
  }
  .fabrics-detail .boxes ul li {
    border: 1px solid #dfdfdf;
    border-radius: 2px;
  }
  .fabrics-detail ul li {
    margin-right: 5px;
  }
  .fabrics-detail h2 {
    text-align: center;
  }
  .fabrics-detail .boxes ul li:hover .overlay-hover {
    display: none;
  }
  .popupproduct-image-component[data-v-c768601e] {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .fabrics-detail .boxes ul li .fabric-tile__tile {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  .fabrics-detail .boxes ul li .fabric-tile__tile {
    height: 89px;
    width: 89px;
  }
  .fabrics-detail ul li:nth-child(3n + 3) {
    /* margin-right: 0; */
  }
}
/* @media only screen and (min-device-width: 481px) and (max-device-width: 767px) {
  .fabrics-detail .boxes ul li .fabric-tile__tile {
    height: 104px;
    width: 104px;
  }
} */
@media only screen and (min-device-width: 768px) and (max-device-width: 992px) {
  .fabrics-detail .boxes ul li .fabric-tile__tile {
    height: 140px;
    width: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .swatch-basket ul li {
    width: 45%;
    padding-right: 0;
  }
}
.tempClass {
  background: tomato;
}
.paddingLeftFour {
  padding-left: 4px !important;
}
.paddingRightFour {
  padding-right: 4px !important;
}
.minHeight0 > .base-input {
  min-height: 0 !important;
}
.minHeight0,
.marginBottom {
  margin-bottom: 15px;
}
.marginTop {
  margin-top: 15px;
}
</style>
