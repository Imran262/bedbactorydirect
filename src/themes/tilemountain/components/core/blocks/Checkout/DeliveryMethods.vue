<template>
  <div class="pt20 billing-details">
    <div class="row pl20 pr20 m0">
      <div class="col-xs-12 col-sm-12 col-md-12">
        <form method="post" name="address" class="form-row row">
          <div class="radiobutton-row  w-100">
            <div class="billing-selection flex">
              <div class="bill-check col-md-4" v-if="getShippingMethodsWithDates">
                <label class="radioStyled">
                  Home Delivery:
                  <input type="radio" name="choose-method" v-model="deliveryMethod" value="homedelivery"
                  />
                  <span class="checkmark black-border-checkmark"/>
                </label>
              </div>
              <div class="bill-check col-md-8" v-if="getShippingMethodsWithoutDates">
                <label class="radioStyled">
                  Collection From Stoke Warehouse:
                  <input type="radio" name="choose-method" v-model="deliveryMethod" value="warehouse"
                  />
                  <span class="checkmark stoke-checkmark black-border-checkmark"/>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {Shipping} from '@vue-storefront/core/modules/checkout/components/Shipping';
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox';
import BaseInput from 'theme/components/core/blocks/Form/BaseInput';
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect';
import ShippingMethod from 'theme/components/theme/blocks/ShippingMethod/ShippingMethodBlock';
import ButtonFull from 'theme/components/theme/ButtonFull';
import Tooltip from 'theme/components/core/Tooltip';
import NoSSR from 'vue-no-ssr';
import {mapGetters, mapActions} from 'vuex';

export default {
  inheritAttrs: false,
  mixins: [Shipping],
  data () {
    return {
      deliveryMethod: 'homedelivery',
    };
  },
  mounted () {
    this.$bus.$emit('delivery-method', this.deliveryMethod);
  },
  methods: {},
  components: {
    ButtonFull,
    Tooltip,
    BaseCheckbox,
    BaseInput,
    BaseSelect,
    'no-ssr': NoSSR,
    'v-calendar': () => import('v-calendar/lib/components/date-picker.umd'),
    ShippingMethod
  },
  created () {
    const craftyplugin = document.createElement('script');
    craftyplugin.setAttribute('src', '/assets/js/crafty_postcode.class.js');
    document.head.appendChild(craftyplugin);
    this.shipping.country = 'GB';
    this.deliveryMethod = 'homedelivery';
  },
  computed: {
    ...mapGetters({
      getShippingMethods: 'shipping/getShippingMethods',
      getPersonalDetails: 'checkout/getPersonalDetails',
      getShippingDetails: 'checkout/getShippingDetails',
      getCartToken: 'cart/getCartToken',
    }),
    getShippingMethodsWithoutDates () {
      const regex = /(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g;
      const shippingArrayWithoutDates = this.getShippingMethods.filter(
        (shippingMethod) =>
          regex.test(shippingMethod.method_code) !==
          !regex.test(shippingMethod.method_code)
      );
      return shippingArrayWithoutDates;
    },
    getShippingMethodsWithDates () {
      const regex = /(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g;
      const shippingArrayWithDates = this.getShippingMethods.filter(
        (shippingMethod) => regex.test(shippingMethod.method_code)
      );
      return shippingArrayWithDates;
    },
    countryOptions () {
      // this.shipping.firstName = document.getElementsByClassName(
      //   'firstName-text'
      // )[0].innerHTML;
      // this.shipping.lastName = document.getElementsByClassName(
      //   'lastName-text'
      // )[0].innerHTML;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.shipping.firstName = this.getPersonalDetails.firstName.trim();
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.shipping.lastName = this.getPersonalDetails.lastName.trim();
      return this.countries.map((item) => {
        return {
          value: item.code,
          label: item.name,
        };
      });
    },
    attributes () {
      return [
        // Attributes for dates
        ...this.getShippingMethods.map((shippingMethod, index) => ({
          dates: new Date(
            this.changeDateOrder(
              this.getDateFromMethodCode(shippingMethod.method_code)
            )
          ),
          popover: {
            label: `The price is ${shippingMethod.price_incl_tax}`,
            hideIndicator: true,
          },
          customData: shippingMethod,
        })),
      ];
    },
    disabledDateFn () {
      const dotteddates = this.getSortedDates.map((item) =>
        this.changeDateOrder(item)
      );
      const allDatesArr = this.getAllDates(this.getMinDate, this.getMaxDate);
      const finalDateArray = allDatesArr.filter(
        (singleDate) => !dotteddates.includes(singleDate)
      );
      return finalDateArray;
    },
    // eslint-disable-next-line vue/return-in-computed-property
    getMinDate () {
      if (this.getSortedDates[0]) {
        const minDate = this.getSortedDates[0].split('/');
        const month = minDate[0];
        const day = minDate[1];
        const year = minDate[2];
        const finalDate = [year, month, day].join('-');
        return new Date(finalDate);
      }
    },
    // eslint-disable-next-line vue/return-in-computed-property
    getMaxDate () {
      if (this.getSortedDates[0]) {
        const maxDate = this.getSortedDates[
        this.getSortedDates.length - 1
          ].split('/');
        const month = maxDate[0];
        const day = maxDate[1];
        const year = maxDate[2];
        const finalDate = [year, month, day].join('-');
        return new Date(finalDate);
      }
    },
    getSortedDates () {
      return this.getShippingMethods
        .map((shippingMethod) =>
          this.getDateFromMethodCode(shippingMethod.method_code)
        )
        .filter((dateStr) => dateStr !== undefined)
        .sort((a, b) => {
          return a > b ? 1 : a < b ? -1 : 0;
        });
    }
  },
  watch: {
    deliveryMethod: {
      handler () {
        if (this.deliveryMethod === 'homedelivery' && this.getShippingMethodsWithDates) {
          this.$bus.$emit('delivery-method', this.deliveryMethod);
        }
        if (this.deliveryMethod === 'warehouse' && this.getShippingMethodsWithoutDates) {
          this.$bus.$emit('delivery-method', this.deliveryMethod);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.shipping-first-name {
  display: none;
}

.shipping-last-name {
  display: none;
}

.crafty-postcodelookup input.postalcode-lookup {
  border: 0px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid;
  border-color: #bdbdbd;
  margin-bottom: 10px;
  float: left;
}

.crafty-postcodelookup {
  padding: 0px 10px 5px 10px;
  position: relative;
  width: 100%;
}

.crafty-postcodelookup input.postalcode-lookup:focus {
  outline: none;
  border-color: #4dba87;
}

div#crafty_postcode_result_display_1 {
  width: 100%;
  padding: 0px 0px 10px 0px;
  margin-top: 15px;
}

button.find-address {
  background: #54575b;
  border: none;
  padding: 15px 35px;
  color: #fff;
  float: left;
  margin-top: 20px;
  margin-left: 15px;
}

.billing-details {
  background: #fff;
  padding: 12px 0px 0px 0px;
  font-family: 'Poppins', sans-serif;
  margin: 25px 0px;

  h3 {
    color: #676767;
    font-size: 22px;
    width: 100%;
    padding-bottom: 10px;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
  }

  .border-top {
    border-top: 1px solid #bdbdbd;
  }

  .select-wrapper {
    select {
      color: #676767;
    }
  }

  h4 {
    color: #676767;
    font-weight: 600;
  }

  input {
    font-size: 16px;
  }

  input:focus ~ label,
  input:not(.empty) ~ label {
    top: -15px;
    font-size: 14px;
    color: #00998c;
  }

  p {
    color: #676767;
  }

  span {
    color: #676767;
  }

  label {
    color: #00a997;
    font-weight: 600;
    font-size: 15px !important;
  }

  input:checked + label {
    &:before {
      background-color: #00998c;
      border-color: #00998c;
      cursor: pointer;
    }

    &:after {
      background-color: #00998c;
    }
  }

  .radioStyled {
    padding-left: 0px !important;
  }

  .radioStyled .stoke-checkmark {
    /* left: 24%; */
    position: absolute;
    top: 0;
    /* right: -41px !important; */
    left: 62% !important;
  }

  .checkmark {
    top: 3px !important;
    left: 59% !important;
    height: 20px !important;
    width: 20px !important;

    &:after {
      content: '';
      position: absolute;
      display: none;
      top: -1px !important;
      left: -1px !important;
      width: 20px !important;
      height: 20px !important;
      background: url(/assets/checkmark.svg) !important;
      background-color: #54575b !important;
      background-size: 15px !important;
      background-repeat: no-repeat !important;
      background-position: 40% 50% !important;
      border: 1px solid #54575b;
      @media (min-width: 992px) and (max-width: 1200px) {
        top: 1px !important;
        left: 2px !important;
        width: 11px !important;
        height: 10px !important;
      }
    }
  }

  button {
    background-color: #00bfb3;
    border-radius: 5px;
    font-size: 16px;
    padding-top: 12px;
    padding-bottom: 12px;

    :hover {
      border-radius: 5px;
      background-color: #00998c;
    }
  }

  .postcode-select {
    select {
      width: 100% !important;
      background-color: transparent;
      border-radius: 5px;
      margin-bottom: 10px;
      font-family: 'Poppins', sans-serif;
      color: #676767;
      font-size: 15px;
    }
  }
}

@media (min-width: 320px) and (max-width: 767px) {
  .billing-details button {
    margin-left: 0;
    width: 100%;
    display: inline-block;
    margin-top: 0px;
  }
  .crafty-postcodelookup input.postalcode-lookup {
    width: 100%;
    display: block;
    padding-left: 0;
    padding-right: 0;
  }
}

/*Phone NUmber Text box */
p.phone-text {
  margin: 0;
}

/*Phone NUmber Text box */
</style>
<style>
.postcode-select select {
  width: 100% !important;
  background-color: transparent;
  border-radius: 5px;
  margin-bottom: 10px;
  font-family: 'Poppins', sans-serif;
  color: #676767;
  font-size: 15px;
  padding-left: 5px;
}

.postcode-select p {
  font-style: italic;
  margin: -5px 0px 0px 0px;
}

.postcode-select p:nth-of-type(2) {
  display: none;
}

.non-selected-tick {
  background: url(/assets/checkout-non-selected-tick.png) no-repeat 100% 100%;
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 30px;
}

.tick-active {
  background: url(/assets/checkout-selectd-tick.png) no-repeat 100% 100% !important;
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 30px;
}

.top-detail-active {
  background: url(/assets/checkout-top-detail-img.png) no-repeat !important;
}

.top-detail-active span {
  color: #01998c !important;
}

.calendar-right {
  display: flex;
}

.calendar-ineer-main {
  border-left: 1px solid #dddddd;
  margin-left: 10px;
  padding-left: 30px;
}

.calendar {
  border-radius: 0;
  margin-bottom: 12px;
}

@media (min-width: 320px) and (max-width: 767px) {
  .calendar-ineer-main {
    border-left: 0;
    margin-left: 0;
    padding-left: 0;
    margin-top: 10px;
  }

  .postcode-select p {
    font-style: italic;
    margin: 0px;
  }

  /* div#crafty_postcode_result_display_1 {
    margin-top: 65px !important;
  } */
  .postcode-select select {
    margin-bottom: 0;
    margin-top: 20px;
  }

  .billing-payment .postcode-select select {
    margin-top: 40px !important;
  }

  .billing-payment input {
    margin-top: 10px;
  }

  #crafty_postcode_result_display_1 img {
    margin-top: 5px !important;
  }
}

.black-border-checkmark {
  border: 1px solid #979797 !important;
}

span.postcodelookup-required {
  font-size: 12px;
  color: #eb5757 !important;
  margin-top: 2px;
  display: block;
  width: 100%;
  float: left;
}

@media (min-width: 320px) and (max-width: 574px) {
  .billing-details input {
    margin-top: 16px !important;
  }

  .apartment-no input {
    margin-top: 20px;
  }
}

@media (min-width: 575px) and (max-width: 767px) {
  .billing-details input {
    margin-top: 15px !important;
  }

  .apartment-no input {
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .billing-details label {
    font-size: 14px !important;
  }
}

@media (min-width: 767px) and (max-width: 991px) {
  .vc-title {
    margin-right: 70px;
  }
}

/* .vc-day-content.vc-text-white{
  background: #009fe3 !important;
}

.vc-day-content.vc-text-sm{
  background: #009fe3 !important;
} */
.vc-arrows-container {
  z-index: 1 !important;
}

.customselectedclass:after {
  display: block !important;
}
</style>
