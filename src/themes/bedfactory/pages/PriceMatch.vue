<template>
  <div class="main-top">
    <div class="container">
      <div class="breadcrumbs h5 cl-gray">
        <span class="home-breadcrumb-icon product-page-home-breadcrumb-icon">
          <router-link :to="localizedRoute('/')" class="cl-tertiary links">
           Home </router-link
          >/
        </span>
        <strong class="cl-mine-shaft">Price Match</strong>
      </div>
      <div class="mobile-view">
        <div class="row">
          <div
            class="col-lg-8 col-md-8 col-sm-12 col-xs-12"
            ref="quickCheckoutInner"
          >
            <div class="MainpriceMatch">
              <h1>Price Match</h1>
              <p>
                We try our best to offer products at prices that are
                competitive. To make sure our customers are always getting the
                best products at the best possible price, we also offer a price
                match service.
              </p>
              <strong> Price Match Conditions</strong>
              <ul>
                <li>
                  It has to be the same product with the same specification
                </li>
                <li>It has to be a new product in it’s original packaging</li>
                <li>It has to be available to buy</li>
                <li>We will consider any delivery charges</li>
              </ul>
            </div>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <div class="main-table">
              <h4 class="title">Submit A Request</h4>
              <p class="peragrapgh">
                Complete our simple price match form and we'll aim to reply
                within 1 working day
              </p>
              <p class="your-details">Your Details</p>
              <form
                id="orderForm"
                @submit.prevent="submitForm"
                method="post"
                novalidate
              >
                <div class="row mainFormRow marginBottom15">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <label for="first-name"> First Name <span>*</span></label>
                    <div class="input-field">
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
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <label for="last-name">
                      Last Name
                      <span>*</span>
                    </label>
                    <div class="input-field">
                      <base-input
                        type="text"
                        name="last-name"
                        autocomplete="family-name"
                        v-model="user.lastName"
                        @blur="$v.user.lastName.$touch()"
                        :validations="[
                          {
                            condition:
                              !$v.user.lastName.required &&
                              $v.user.lastName.$error,
                            text: $t('Field is required.')
                          }
                        ]"
                      />
                    </div>
                  </div>
                </div>

                <div class="row mainFormRow marginBottom15">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <label for="phone-number"> Phone <span>*</span></label>
                    <div class="input-field">
                      <base-input
                        type="tel"
                        name="phone-number"
                        autocomplete="on"
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
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <label for="email-name">
                      Email
                      <span>*</span>
                    </label>
                    <div class="input-field">
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
                            condition:
                              !$v.user.email.email && $v.user.email.$error,
                            text: $t('Please provide valid e-mail address.')
                          }
                        ]"
                      />
                    </div>
                  </div>
                </div>

                <div class="mainFormRow">
                  <div class="field full-width">
                    <label for="Postcode-name"> Address Finder </label>
                    <div class="input-field">
                      <base-input
                        type="text"
                        name="postcode"
                        autocomplete="postal-code"
                        v-model="user.postCode"
                      />
                    </div>
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
                    removeMinHeight
                  "
                >
                  <p
                    style="display: none"
                    class="input-wrapper lg-half address-postcode"
                  >
                    <label>Address</label>
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
                    <p class="input-wrapper lg-half address-postcode">
                      <label class="size1"
                        >Address line 1 <span class="star">*</span></label
                      >
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
                    </p>
                    <p class="input-wrapper lg-half address-postcode">
                      <label class="size1">Address line 2 </label>
                      <input
                        type="text"
                        id="address_2"
                        name="street-address"
                        placeholder=""
                        v-model="user.addressLine2"
                      />
                    </p>
                    <p
                      class="input-wrapper lg-half address-line"
                      style="display: none"
                    >
                      <input
                        type="text"
                        id="address_2"
                        name="apartment-number"
                        placeholder="Line 2"
                        v-model="user.addressLine2"
                      />
                    </p>

                    <p class="input-wrapper lg-half city-lg-half">
                      <label class="size1"
                        >Town <span class="star">*</span></label
                      >
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
                    </p>
                    <p class="input-wrapper lg-half find-address-type">
                      <label class="size1"
                        >Postcode <span class="star">*</span></label
                      >
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
                    </p>
                  </div>
                </div>
                <div class="producr-history mt-4 remove-height removeMinHeight">
                  <h5>Product Details</h5>
                  <div class="field-full marginBottom15">
                    <label for="address_line1"> Product <span>*</span> </label>
                    <div class="input-field">
                      <base-input
                        type="text"
                        name="city"
                        autocomplete="address-level2"
                        v-model="user.product"
                        @blur="$v.user.product.$touch()"
                        :validations="[
                          {
                            condition:
                              !$v.user.product.required &&
                              $v.user.product.$error,
                            text: $t('Field is required.')
                          }
                        ]"
                      />
                    </div>
                  </div>

                  <div class="field-full">
                    <label for="address_line1" class="size1">
                      Competitors Website Link <span>*</span>
                    </label>
                    <div class="input-field">
                      <base-input
                        type="text"
                        name="city"
                        autocomplete="address-level2"
                        v-model="user.websitelink"
                        @blur="$v.user.websitelink.$touch()"
                        :validations="[
                          {
                            condition:
                              !$v.user.websitelink.required &&
                              $v.user.websitelink.$error,
                            text: $t('Field is required.')
                          }
                        ]"
                      />
                    </div>
                  </div>
                </div>

                <div class="bottom-button">
                  <button class="btn" type="submit">Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BaseInput from "src/themes/tilemountain/components/core/blocks/Form/BaseInput.vue";
import BaseSelect from "src/themes/tilemountain/components/core/blocks/Form/BaseSelect.vue";
import {
  required,
  email,
  minLength,
  sameAs,
  maxLength,
  url
} from "vuelidate/lib/validators";
import axios from "axios";
import config from "config";
import i18n from "@vue-storefront/i18n";
import AddressLookupMixin from "src/themes/bedfactory/mixins/addressLookupMixin";
function isValidURL(string) {
  console.log("url validate function");
  if (string.length > 0) {
    var res = string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    return res !== null;
  } else {
    return true;
  }
}
export default {
  name: "PriceMatch",
  components: { BaseInput, BaseSelect },
  mixins: [AddressLookupMixin],

  data() {
    return {
      title: "Price Match Service | Bed Factory Direct",
      postCode: "",
      user: {
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        postCode: "",
        postCode2: "",
        product: "",
        websitelink: ""
      }
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
      },
      product: {
        required
      },
      websitelink: {
        required
      }
    }
  },
  methods: {
    assignAddressValues() {
      console.log("wel");
      var ele1 = document.getElementById("address_manuall_1").value;
      console.log("wel2", ele1);
      this.user.addressLine1 = ele1;
      var ele2 = document.getElementById("address_2").value;
      this.user.addressLine2 = ele2;
      var ele3 = document.getElementById("city").value;
      this.user.city = ele3;
      // var ele4 = document.getElementById("shipping-company").value;
      // this.user.company = ele4;
      var ele5 = document.getElementById("find_address_manuall").value;
      this.user.postCode = "";
      this.user.postCode2 = ele5;
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
        street,
        house,
        postcode,
        email
      } = this.shippingDetails;
      this.user.firstName = firstName;
      this.user.lastName = lastName;
      this.user.phone = phone;
      this.user.city = city;
      this.user.postCode = "";
      this.user.postCode2 = postcode;
      this.user.addressLine1 = street;
      this.user.addressLine2 = house;
      this.user.email = email;
    },
    retrunFullName() {
      //     console.log("2211 in return full name function", this);
      const fullName = this.user.firstName + this.user.lastName;
      //   console.log("Full name is ", fullName);
      return fullName;
    },
    submitForm(event) {
      console.log("In submit form function", this.$v.$invalid, this.$v);
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.$bus.$emit(
        "notification-progress-start",
        this.$t("Processing order...")
      );
      const payload = {
        param: {
          first_name: this.user.firstName,
          last_name: this.user.lastName,
          email: this.user.email,
          phone: this.user.phone,
          postcode: this.user.postCode2,
          addressline_1: this.user.addressLine1,
          addressline_2: this.user.addressLine2,
          town: this.user.city,
          country: "GB",
          country_code: "UK",
          product: this.user.product,
          competitior_link: this.user.websitelink
          // country_code: "US",
          // country: "US",
        }
      };
      // const URL = config.api.url + config.swatches.endpoint + "/placeorder";
      let paramsToken = {
        username: "kamran",
        password: "tajveez@123"
      };
      const tokenURL = config.api.url + config.pricematch.getToken;
      console.log("4125 URL for getting token is", tokenURL);
      axios
        .post(tokenURL, paramsToken)
        .then(res => {
          if (res.status !== 200) {
            this.$bus.$emit("notification-progress-stop", {});
            this.$store.dispatch("notification/spawnNotification", {
              type: "error",
              message: i18n.t(`${res.result}`),
              action1: { label: i18n.t("OK") }
            });
            throw new Error(res.result);
          } else {
            console.log(
              "4125 token received is ",
              res.data.result,
              res.data && res.data.result && res.data.result.length > 1
            );
            if (res.data && res.data.result && res.data.result.length > 1) {
              const applicationSubmitURL =
                config.api.url + config.pricematch.submitApplication;
              console.log(
                "4125 URL for submitting Application is",
                applicationSubmitURL
              );
              axios
                .post(applicationSubmitURL, { payload, token: res.data.result })
                .then(res => {
                  if (res.status !== 200) {
                    this.$bus.$emit("notification-progress-stop", {});
                    this.$store.dispatch("notification/spawnNotification", {
                      type: "error",
                      message: i18n.t(`${res.result}`),
                      action1: { label: i18n.t("OK") }
                    });
                    throw new Error(res.result);
                  } else {
                    console.log("4125 token received is ", res.data.result);
                    // this.swatchBasket = [];
                    this.$bus.$emit("notification-progress-stop", {});
                    // this.$store.dispatch('notification/spawnNotification', {
                    //   type: 'success',
                    //   message: i18n.t(`Order placed successfully`),
                    //   action1: { label: i18n.t('OK') }
                    // });
                    this.$router.replace("/price-match-success");
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
            } else {
              this.$bus.$emit("notification-progress-stop", {});
              this.$store.dispatch("notification/spawnNotification", {
                type: "error",
                message: i18n.t(`${res.result}`),
                action1: { label: i18n.t("OK") }
              });
              throw new Error(res.result);
            }
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
    },
    onChanged(text) {
      this.user.phone = text.replace(/[^0-9]/g, "");
    },
    isValidURL() {
      console.log("url validate function");
      var res = this.user.websitelink.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
      return res !== null;
    }
  },
  beforeMount() {
    const craftyplugin = document.createElement("script");
    craftyplugin.setAttribute("src", "/assets/js/crafty_postcode.class.js");
    document.head.appendChild(craftyplugin);
    const craftAddressLookUpplugin = document.createElement("script");
    craftAddressLookUpplugin.setAttribute("src", "/assets/js/cc_c2a.min.js");
    document.head.appendChild(craftAddressLookUpplugin);
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
  },
  metaInfo() {
    return {
      title: this.title || "Price Match Service | Bed Factory Direct",
      meta: [
        {
          vmid: "description",
          description:
            "Pay the very best prices for your new bed, mattress or headboard with our Price Match Service at Bed Factory Direct!"
        }
      ]
    };
  }
};
</script>
<style lang="scss">
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input:hover,
input:focus {
  border: 2px solid #747474 !important;
  outline: none !important;
  box-sizing: border-box;
}
.size1 {
  color: #747474;
  font-size: 14px;
  margin-bottom: 8px;
}
label {
  color: #747474;
}
.star {
  color: red;
}
.full-width {
  width: 100% !important;
}

.manually-added-fields {
  .input-wrapper {
    display: flex;
    flex-direction: column;
    input {
      display: block;
      border-radius: 4px;
      border: 1px solid #dfdfdf;
      height: unset !important;
      line-height: 30px;
      padding: 0 5px;
      font-size: 15px;
      font-family: Roboto, sans-serif;
      background: #fff;
      color: #747474;
      outline-color: #747474;
    }
  }
  p {
    margin-top: 0;
    margin-bottom: 15px;
  }
}
#orderForm > .mainFormRow .base-input,
#orderForm > .removeMinHeight .base-input {
  min-height: unset !important;
}
.marginBottom15 {
  margin-bottom: 15px !important;
}
.changeMargin {
  margin-right: -17px !important;
  margin-left: -17px !important;
}
</style>
<style>
/* .breadcrumbs span {
  color: #54575b;
  padding: 0px 2.5px;
} */
/* .cl-gray {
  margin-top: 2rem;
} */
.cl-mine-shaft{
  font-weight: 500;
  margin-left: 5px;
}

/* img.home-breadcrumb-icon-img {
  width: 15px;
  float: left;
  margin: 1px 2.5px 0 0;
} */
.main-top {
  overflow: hidden;
}
.MainpriceMatch {
  text-align: left;
}
.MainpriceMatch h1 {
  font-size: 35px;
  margin: 10px 0;
}
.MainpriceMatch strong {
  font-family: oblik;
  color: #343434;
}
.MainpriceMatch p {
  color: #333;
  font-family: Roboto, sans-serif;
}
.MainpriceMatch ul li {
  color: #333;
  font-family: Roboto, sans-serif;
}
.MainpriceMatch .price-peragrpgh {
  color: #333;
  font-family: Roboto, sans-serif;
}
.underlineHere {
  text-decoration: underline;
}
.main-table {
  margin-top: 2rem;
  background-color: #eeeeee;
  border-radius: 4px;
  flex-wrap: wrap;
  padding: 0.8rem 0.8rem 3rem 0.8rem;
  text-align: left;
}
.title {
  margin: 0;
  padding-bottom: 0.8rem;
}
.peragrapgh {
  margin: 0;
  font-size: 14px;
  color: #333;
  font-family: Roboto, sans-serif;
}
.your-details {
  color: #333;
  font-family: Roboto, sans-serif;
  font-weight: 700;
}
.mainFormRow {
  justify-content: center;
  flex-wrap: wrap;
}
.rightMargin {
  margin-right: 0.5rem;
}
.main-table form .field {
  padding: 0;
  margin-bottom: 15px;
  width: 46%;
  display: inline-block;
}
.main-table form label {
  display: block;
  margin-bottom: 8px;
  text-align: left;
  cursor: pointer;
  /* color: #747474; */
  font-size: 14px;
}
.main-table form label > span {
  color: red;
  display: inline;
}
.main-table form input {
  display: block;
  border-radius: 4px;
  border: 1px solid #dfdfdf;
  height: unset !important;
  line-height: 30px;
  padding: 0 5px;
  font-size: 15px;
  font-family: Roboto, sans-serif;
  background: #fff;
  color: #747474;
  outline-color: #747474;
}
.main-table > form input:focus,
.main-table > form input:hover {
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
.btn {
  margin-top: 1.6rem;
  padding: 0.5rem 0.1rem;
  background-color: #071a44;
  color: #fff;
  border: none;
  border-radius: 3px;
}
.find-btn {
  width: 88%;
  font-weight: 800;
  padding: 5px;
  margin-top: 1.62rem;
}
.button-disabled {
  opacity: 0.3;
  pointer-events: none;
}
.single-input {
  text-align: left;
}
.single-input .field-full {
  padding: 0;
  width: 100%;
  display: inline-block;
  margin-bottom: 10px;
}
.single-input .field-full label {
  display: block;
  margin-bottom: 8px;
  text-align: left;
  cursor: pointer;
  color: #747474;
  font-size: 14px;
}
.single-input .field-full label > span {
  display: inline;
  color: red;
}
.single-input .field-full input {
  display: block;
  border-radius: 4px;
  border: 1px solid #dfdfdf;
  background: #fff;
  width: 100%;
  height: 30px;
  padding: 0;
  font-size: 18px;
  font-family: Roboto, sans-serif;
  /* outline: none; */
}
.producr-history {
  margin-top: 35px;
}
.producr-history h5 {
  font-weight: 700;
  text-align: left;
}
.producr-history .field-full {
  padding: 0;
  width: 100%;
  display: inline-block;
  margin-bottom: 10px;
}
.producr-history .field-full label {
  display: block;
  margin-bottom: 8px;
  text-align: left;
  cursor: pointer;
  color: #747474;
  font-size: 14px;
}
.producr-history .field-full label > span {
  display: inline;
  color: red;
}
.producr-history .field-full input {
  display: block;
  border-radius: 4px;
  border: 1px solid #dfdfdf;
  height: unset !important;
  line-height: 30px;
  padding: 0 5px;
  font-size: 15px;
  font-family: Roboto, sans-serif;
  background: #fff;
  color: #747474;
  outline-color: #747474;
}

.bottom-button {
  text-align: center;
  justify-content: center;
}
.bottom-button .btn {
  background-color: #071a44;
  color: #fff;
  padding: 0.9rem 2rem;
  margin-top: 0.8rem;
  text-transform: uppercase;
  font-weight: 700;
  border: none;
  border-radius: 4px;
}
.bottom-button .btn:hover {
  background-color: #071a44;
  color: rgb(155, 132, 132);
  padding: 0.9rem 2rem;
  margin-top: 0.8rem;
  text-transform: uppercase;
  font-weight: 700;
  border: none;
  border-radius: 4px;
}
.breadcrumbs {
  display: flex;
  align-items: center;
  background-color: transparent;
  padding: 15px 0;
  /* float: left; */
  width: 100%;
}
.breadcrumbs a{
color: #333;
}
.breadcrumbs a:hover{
  color: #ca0413;
}
@media (max-width: 767px) {
  .breadcrumbs {
    display: none;
  }
  .mobile-view {
    margin-top: 1rem;
  }
}
</style>
