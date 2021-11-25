<template>
  <div col="lg-12" col-md-12 col-sm-12 col-xl-12>
    <div class="container">
      <div class="breadcrumbs mt-5">
        <div class="row">
          <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
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
              <!-- <p>
                For our full price match terms and conditions view our
                <span class="underlineHere">price match t&c</span>
              </p> -->
            </div>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <div class="main-table">
              <h4 class="title">Submit A Request</h4>
              <p class="peragrapgh">
                Complete our simple price match form and we'll aim to reply
                within 1 working day
              </p>
              <p  class="your-details">Your Details</p>
              <form id="orderForm" @submit.prevent="submitForm" method="post">
                <div class="row mainFormRow">
                  <div class="field rightMargin">
                    <label for="first-name"> First Name <span>*</span></label>
                    <div class="input-field">
                      <base-input
                        type="text"
                        :autofocus="true"
                        name="first-name"
                        autocomplete="given-name"
                        v-model.trim="user.firstName"
                        @blur="$v.user.firstName.$touch()"
                        :validations="[
                          {
                            condition:
                              !$v.user.firstName.required &&
                              $v.user.firstName.$error,
                            text: $t('Field is required.'),
                          },
                          {
                            condition: !$v.user.firstName.minLength,
                            text: $t('Name must have at least 2 letters.'),
                          },
                        ]"
                      />
                    </div>
                  </div>
                  <div class="field">
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
                            text: $t('Field is required.'),
                          },
                        ]"
                      />
                    </div>
                  </div>
                </div>

                <div class="row mainFormRow">
                  <div class="field rightMargin">
                    <label for="phone-number"> Phone <span>*</span></label>
                    <div class="input-field">
                      <base-input
                        type="number"
                        name="phone-number"
                        autocomplete="tel"
                        v-model="user.phone"
                        @blur="$v.user.phone.$touch()"
                        :validations="[
                          {
                            condition:
                              !$v.user.phone.required && $v.user.phone.$error,
                            text: $t('Field is required.'),
                          },
                        ]"
                      />
                    </div>
                  </div>
                  <div class="field">
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
                            text: $t('Field is required.'),
                          },
                          {
                            condition:
                              !$v.user.email.email && $v.user.email.$error,
                            text: $t('Please provide valid e-mail address.'),
                          },
                        ]"
                      />
                    </div>
                  </div>
                </div>

                <div class="row mainFormRow">
                  <div class="field rightMargin">
                    <label for="Postcode-name"> Postcode <span>*</span></label>
                    <div class="input-field">
                      <base-input
                        type="text"
                        name="postcode"
                        autocomplete="postal-code"
                        v-model="user.postCode"
                        @blur="$v.user.postCode.$touch()"
                        :validations="[
                          {
                            condition:
                              !$v.user.postCode.required &&
                              $v.user.postCode.$error,
                            text: $t('Field is required.'),
                          },
                        ]"
                      />
                    </div>
                  </div>
                  <div class="field">
                    <div class="input-field">
                      <button
                        class="find-btn btn"
                        :class="postCode === '' ? 'button-disabled' : ''"
                        name="submit-button"
                      >
                        Find Address
                      </button>
                    </div>
                  </div>
                </div>

                <div class="single-input remove-height">
                  <div class="field-full remove-height">
                    <label for="address_line1">
                      Address line 1 <span>*</span>
                    </label>
                    <div class="input-field">
                      <base-input
                        type="text"
                        name="'address_line1' +'address_line2'"
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
                </div>
                <div class="single-input remove-height">
                  <div class="field-full">
                    <label for="address_line1">
                      Address line 2 <span>*</span>
                    </label>
                    <div class="input-field">
                      <base-input
                        type="text"
                        name="address_line2"
                        v-model="user.addressLine2"
                      />
                    </div>
                  </div>
                </div>
                <div class="single-input remove-height">
                  <div class="field-full">
                    <label for="address_line1"> Town <span>*</span> </label>
                    <div class="input-field">
                      <base-input
                        type="text"
                        name="city"
                        autocomplete="address-level2"
                        v-model="user.orderTown"
                        @blur="$v.user.orderTown.$touch()"
                        :validations="[
                          {
                            condition:
                              !$v.user.orderTown.required &&
                              $v.user.orderTown.$error,
                            text: $t('Field is required.'),
                          },
                        ]"
                      />
                    </div>
                  </div>
                </div>
                <div class="producr-history mt-4 remove-height">
                  <h5>Product Details</h5>
                  <div class="field-full">
                    <label for="address_line1"> Product <span>*</span> </label>
                    <div class="input-field">
                      <base-input
                        type="text"
                        name="city"
                        autocomplete="address-level2"
                        v-model="user.orderTown"
                        @blur="$v.user.orderTown.$touch()"
                        :validations="[
                          {
                            condition:
                              !$v.user.orderTown.required &&
                              $v.user.orderTown.$error,
                            text: $t('Field is required.'),
                          },
                        ]"
                      />
                    </div>
                  </div>

                  <div class="field-full">
                    <label for="address_line1">
                      Competitors Website Link <span>*</span>
                    </label>
                    <div class="input-field">
                      <base-input
                        type="text"
                        name="city"
                        autocomplete="address-level2"
                        v-model="user.orderTown"
                        @blur="$v.user.orderTown.$touch()"
                        :validations="[
                          {
                            condition:
                              !$v.user.orderTown.required &&
                              $v.user.orderTown.$error,
                            text: $t('Field is required.'),
                          },
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
import BaseInput from 'src/themes/tilemountain/components/core/blocks/Form/BaseInput.vue';
import BaseSelect from 'src/themes/tilemountain/components/core/blocks/Form/BaseSelect.vue';
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';
import axios from 'axios';
import config from 'config';
import i18n from '@vue-storefront/i18n';
export default {
  name: 'PriceMatch',
  components: { BaseInput, BaseSelect },
  data() {
    return {
      title:'Price Match Service | Bed Factory Direct',
      postCode: '',
      user: {
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        orderTown: '',
        postCode: ''
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
      orderTown: {
        required
      },
      postCode: {
        required
      }
    }
  },
  methods: {
    retrunFullName() {
      //     console.log("2211 in return full name function", this);
      const fullName = this.user.firstName + this.user.lastName;
      //   console.log("Full name is ", fullName);
      return fullName;
    },
    submitForm(event) {
      console.log('In submit form function', this.$v.$invalid, this.$v);
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.$bus.$emit(
        'notification-progress-start',
        this.$t('Processing order...')
      );
      const payload = {
        param: {
          first_name: this.user.firstName,
          last_name: this.user.lastName,
          email: this.user.email,
          phone: this.user.phone,
          postcode: this.user.postCode,
          addressline_1: this.user.addressLine1,
          addressline_2: this.user.addressLine2,
          town: this.user.orderTown,
          country: 'GB',
          country_code: 'UK',
          product: 'laptop',
          competitior_link: '/dream'
          // country_code: "US",
          // country: "US",
        }
      };
      {
        let params = {
          param: {
            first_name: 'Pro-3',
            last_name: 'squid 2',
            phone: 246544,
            email: 'kamranzafar@ki5.co.uk',
            postcode: 141,
            addressline_1: 'Attock',
            addressline_2: '',
            town: 'kamra cantt',
            product: 'laptop',
            competitior_link: '/dream'
          }
        };
      }
      // const URL = config.api.url + config.swatches.endpoint + "/placeorder";
      let paramsToken = {
        username: 'kamran',
        password: 'tajveez@123'
      };
      const tokenURL = config.api.url + config.pricematch.getToken;
      console.log('4125 URL for getting token is', tokenURL);
      axios
        .post(tokenURL, paramsToken)
        .then(res => {
          if (res.status !== 200) {
            this.$bus.$emit('notification-progress-stop', {});
            this.$store.dispatch('notification/spawnNotification', {
              type: 'error',
              message: i18n.t(`${res.result}`),
              action1: { label: i18n.t('OK') }
            });
            throw new Error(res.result);
          } else {
            console.log('4125 token received is ', res.data.result , res.data && res.data.result && res.data.result.length > 1);
            if (res.data && res.data.result && res.data.result.length > 1)
            {
              const applicationSubmitURL = config.api.url + config.pricematch.submitApplication;
              console.log('4125 URL for submitting Application is', applicationSubmitURL);
              axios
                .post(applicationSubmitURL, {payload,'token':res.data.result})
                .then(res => {
                  if (res.status !== 200) {
                    this.$bus.$emit('notification-progress-stop', {});
                    this.$store.dispatch('notification/spawnNotification', {
                      type: 'error',
                      message: i18n.t(`${res.result}`),
                      action1: { label: i18n.t('OK') }
                    });
                    throw new Error(res.result);
                  } else {
                    console.log('4125 token received is ', res.data.result);
                    // this.swatchBasket = [];
                    this.$bus.$emit('notification-progress-stop', {});
                    this.$store.dispatch('notification/spawnNotification', {
                      type: 'success',
                      message: i18n.t(`Order placed successfully`),
                      action1: { label: i18n.t('OK') }
                    });
                  }
                })
                .catch(err => {
                  console.log('78945623 in catch', err);
                  this.$bus.$emit('notification-progress-stop', {});
                  this.$store.dispatch(
                    'notification/spawnNotification',
                    {
                      type: 'error',
                      message: i18n.t(`${err}`),
                      action1: { label: i18n.t('OK') }
                    },
                    { root: true }
                  );
                });
            }
            else{
              this.$bus.$emit('notification-progress-stop', {});
            this.$store.dispatch('notification/spawnNotification', {
              type: 'error',
              message: i18n.t(`${res.result}`),
              action1: { label: i18n.t('OK') }
            });
            throw new Error(res.result);
            }
          }
        })
        .catch(err => {
          console.log('78945623 in catch', err);
          this.$bus.$emit('notification-progress-stop', {});
          this.$store.dispatch(
            'notification/spawnNotification',
            {
              type: 'error',
              message: i18n.t(`${err}`),
              action1: { label: i18n.t('OK') }
            },
            { root: true }
          );
        });
    }
  },
  metaInfo () {
    return {
      title: this.title || 'Price Match Service | Bed Factory Direct' ,
      meta: [{ vmid: 'description', description: 'Pay the very best prices for your new bed, mattress or headboard with our Price Match Service at Bed Factory Direct!' }]
    }
  }
};
</script>
<style lang="scss">
.mainFormRow {
  .base-input{
    min-height: 1rem !important;
  }
}
.remove-height{
  .base-input{
    min-height: 1rem !important;
  }
}
</style>
<style>
.MainpriceMatch {
  text-align: left;
  margin-top: 1rem;
}
.MainpriceMatch strong{
      font-family: oblik;
    color: #343434;
}
.MainpriceMatch p{
  color: #333;
  font-family: Roboto,sans-serif;
}
.MainpriceMatch ul li{
  color: #333;
  font-family: Roboto,sans-serif;

}
.MainpriceMatch .price-peragrpgh{
    color: #333;
  font-family: Roboto,sans-serif;

}
.underlineHere {
  text-decoration: underline;
}
.main-table {
  margin-top: 3rem;
  background-color: rgb(241 236 236);
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
  font-family: Roboto,sans-serif;
}
.your-details{
   color: #333;
  font-family: Roboto,sans-serif;
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
.main-table form .field label {
  display: block;
  margin-bottom: 8px;
  text-align: left;
  cursor: pointer;
  color: #747474;
  font-size: 14px;
}
.main-table form .field label > span {
  color: red;
  display: inline;
}
.main-table form .field input {
  display: block;
  border-radius: 4px;
  border: 1px solid #dfdfdf;
  height: 30px;
  padding: 0;
  font-size: 18px;
  font-family: Roboto,sans-serif;
  outline: none;
  background: #fff;
}
.btn {
  margin-top: 1.6rem;
  padding: 0.5rem 0.1rem;
  background-color: #071a44;
  color: #fff;
  border: none;
  border-radius: 3px;
}
.find-btn{
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
  font-family: Roboto,sans-serif;
  outline: none;
}
.producr-history {
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
  background: #fff;
  width: 100%;
  height: 30px;
  padding: 0;
  font-size: 18px;
  font-family: Roboto,sans-serif;
  outline: none;
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
</style>