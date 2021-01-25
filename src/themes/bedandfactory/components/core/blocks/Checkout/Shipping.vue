<template>
  <div class="pt20 billing-details">
    <div class="non-selected-tick" />
    <div class="row pl20 pr20">
      <div class="col-xs-12 col-sm-9 col-md-12">
        <div class="row">
          <div
            class="col-xs-12 col-md-12"
            :class="{ 'cl-bg-tertiary': !isFilled && !isActive }"
          >
            <h3 class="m0 mb5">
              {{ $t("Delivery Address") }}
            </h3>
          </div>
          <div class="col-xs-12 col-md-4">
            <div class="lh30 flex" v-if="isFilled && !isActive">
              <a href="#" class="cl-tertiary flex" @click.prevent="edit">
                <span class="pr5 pl45">{{ $t("Edit Delivery Detail") }}</span>
                <i class="material-icons cl-tertiary">edit</i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row pl20 pr20" v-if="isActive">
      <!-- <div class="hidden-xs col-sm-2 col-md-1" /> -->
      <div class="col-xs-12 col-sm-12 col-md-12">
        <div class="mb30">
          <div class="border-top" />
        </div>
        <form method="post" name="address" class="form-row row">
          <div class="crafty-postcodelookup">
            <input
              type="text"
              autofocus
              id="search-bar"
              name="postcode"
              class="postalcode-lookup"
              placeholder="Post Code *"
              v-model="shipping.zipCode"
              @click="postalcodelookup()"
              @input="postalcodelookup()"
              @blur="updateShippingOptions"
            />
            <button
              type="button"
              class="find-address"
              onclick="cp_obj_1.doLookup()"
              @click="resetCurrentShippingMethodFromTS"
            >
              Find Address
            </button>
            <span
              v-if="shipping.zipCode === '' && postcodelookup_blur === 1"
              class="postcodelookup-required"
              >Field is required</span
            >
          </div>
          <div class="postcode-select" id="crafty_postcode_result_display_1">
            &nbsp;
          </div>

          <base-checkbox
            v-if="currentUser && hasShippingDetails()"
            class="col-xs-12 mb10"
            id="shipToMyAddressCheckbox"
            v-model="shipToMyAddress"
          >
            {{ $t("Ship to my default address") }}
          </base-checkbox>
          <base-input
            class="col-xs-12 col-sm-6 mb10 shipping-first-name"
            type="text"
            name="first-name"
            :placeholder="$t('First name *')"
            v-model.trim="shipping.firstName"
            @blur="$v.shipping.firstName.$touch()"
            autocomplete="given-name"
            :validations="[
              {
                condition:
                  $v.shipping.firstName.$error &&
                  !$v.shipping.firstName.required,
                text: $t('Field is required'),
              },
              {
                condition: !$v.shipping.firstName.minLength,
                text: $t('Name must have at least 2 letters.'),
              },
            ]"
          />

          <base-input
            class="col-xs-12 col-sm-6 mb10 shipping-last-name"
            type="text"
            name="last-name"
            :placeholder="$t('Last name *')"
            v-model.trim="shipping.lastName"
            @blur="$v.shipping.lastName.$touch()"
            autocomplete="family-name"
            :validations="[
              {
                condition:
                  $v.shipping.lastName.$error && !$v.shipping.lastName.required,
                text: $t('Field is required'),
              },
            ]"
          />
          <base-input
            class="col-xs-12 mb10 street-name"
            type="text"
            name="company-name"
            :placeholder="$t('Company')"
            v-model.trim="shipping.company"
            autocomplete="company-name"
          />
          <base-input
            class="col-xs-12 mb10 street-name"
            type="text"
            name="street-address"
            :placeholder="$t('Street name and House/Apartment number*')"
            v-model.trim="shipping.streetAddress"
            @blur="$v.shipping.streetAddress.$touch()"
            autocomplete="address-line2"
            :validations="[
              {
                condition:
                  $v.shipping.streetAddress.$error &&
                  !$v.shipping.streetAddress.required,
                text: $t('Field is required'),
              },
            ]"
          />

          <base-input
            class="col-xs-12 mb10"
            type="text"
            name="apartment-number"
            :placeholder="$t('')"
            v-model.trim="shipping.apartmentNumber"
            @blur="$v.shipping.apartmentNumber.$touch()"
            autocomplete="address-line3"
          />

          <base-input
            class="col-xs-12 col-sm-12 col-md-6 mb10"
            type="text"
            name="city"
            :placeholder="$t('City *')"
            v-model.trim="shipping.city"
            @blur="$v.shipping.city.$touch()"
            autocomplete="address-level2"
            :validations="[
              {
                condition:
                  $v.shipping.city.$error && !$v.shipping.city.required,
                text: $t('Field is required'),
              },
              {
                condition: $v.shipping.city.$error && $v.shipping.city.required,
                text: $t('Please provide valid city name'),
              },
            ]"
          />

          <base-input
            class="col-xs-12 col-sm-12 col-md-6 mb10"
            type="text"
            name="state"
            :placeholder="$t('County')"
            v-model.trim="shipping.state"
            autocomplete="address-level1"
          />

          <base-select
            class="col-xs-12 col-sm-12 col-md-6 mb10"
            name="countries"
            :options="countryOptions"
            selected="GB"
            :placeholder="$t('Country *')"
            :validations="[
              {
                condition:
                  $v.shipping.country.$error && !$v.shipping.country.required,
                text: $t('Field is required'),
              },
            ]"
            v-model="shipping.country"
            autocomplete="country-name"
            @blur="$v.shipping.country.$touch()"
            @change.native="updateShippingOptions()"
          />
          <base-input
            class="col-xs-12 col-sm-12 col-md-6 mb10 hidden"
            type="text"
            name="zip-code"
            :placeholder="$t('Zip-code *')"
            v-model.trim="shipping.zipCode"
            @blur="$v.shipping.zipCode.$touch()"
            autocomplete="postal-code"
          />
          <base-input
            class="col-xs-12 col-sm-12 col-md-6 mb0 shipping-phone-number"
            type="tel"
            onkeydown="return event.keyCode !== 69"
            inputmode="numeric"
            pattern="[0-9]*"
            name="phone-number"
            :placeholder="$t('Phone Number *')"
            v-model.trim="shipping.phoneNumber"
            @blur="$v.shipping.phoneNumber.$touch()"
            autocomplete="tel"
            :validations="[
              {
                condition:
                  $v.shipping.phoneNumber.$error &&
                  !$v.shipping.phoneNumber.required,

                text: $t('Field is required'),
              },
              {
                condition: !$v.shipping.phoneNumber.maxLength,

                text: $t('Phone number maximum length is 11 digits'),
              },
            ]"
          />
          <p class="col-xs-12 col-sm-12 col-md-6 phone-text empty" />
          <p class="col-xs-12 col-sm-12 col-md-6 phone-text">
            Phone number will only be used to give delivery updates via text
            message.
          </p>
          <h4 class="col-xs-12">
            {{ $t("Delivery method") }}
          </h4>
          <div v-if="getShippingMethods.length === 0">
            No Delivery Methods Found
          </div>

          <div
            class="col-md-12 col-xs-12"
            v-if="
              getMinDate &&
              getMaxDate &&
              disabledDateFn &&
              attributes &&
              shouldShowChooseDate
            "
          >
            <label class="radioStyled">
              Select your preferred delivery day
              <input
                type="radio"
                name="choose-date"
                ref="chooseDate"
                @click="handleChooseDateClick"
              />
              <span
                class="checkmark black-border-checkmark"
                :class="isCalendarSelected ? 'customselectedclass' : ''"
              />
            </label>
          </div>
          <no-ssr>
            <v-calendar
              v-if="
                getMinDate &&
                getMaxDate &&
                disabledDateFn &&
                attributes &&
                isCalendarSelected
              "
              class="calendar col-md-6 col-xs-12"
              v-model="date"
              is-required
              color="blue"
              ref="vCalendarRef"
              @dayclick="handleOnClick"
              :min-date="getMinDate"
              :max-date="getMaxDate"
              is-inline
              :attributes="attributes"
              :disabled-dates="disabledDateFn"
            />
          </no-ssr>
          <div
            class="calendar-right col-md-6 col-xs-12"
            v-if="
              shippingSlotsData &&
              shippingSlotsData.length > 0 &&
              isCalendarSelected
            "
          >
            <div class="calendar-ineer-main">
              <template v-for="slotData in shippingSlotsData">
                <div
                  v-if="
                    slotData &&
                    slotData.customData &&
                    slotData.customData.method_code
                  "
                  :key="slotData.customData.method_code"
                  class="calendar-right-inner"
                >
                  <label class="radioStyled">
                    <template
                      v-if="
                        (slotData.customData.method_code.indexOf('Kerbside') !==
                          -1) ==
                        true
                      "
                      >Pallet</template
                    >
                    <template
                      v-if="
                        (slotData.customData.method_code.indexOf('DPD') !==
                          -1) ==
                        true
                      "
                      >DPD parcel</template
                    >
                    <span
                      v-if="selectedMethod == slotData.customData.method_code"
                    >
                    
                      {{
                        slotData.customData.amount === 0
                          ? "Free Delivery"
                          : calendarPriceCurrency + slotData.customData.amount
                      }}
                    </span>
                    <input
                      type="radio"
                      :value="slotData.customData.method_code"
                      name="shipping-method"
                      ref="shippingMethodRef"
                      v-model="shipping.shippingMethod"
                      @change="
                        $v.shipping.shippingMethod.$touch();
                        changeShippingMethod('fromInput0');
                        selectedMethod = slotData.customData.method_code;
                      "
                    />
                    <span class="checkmark black-border-checkmark" />
                  </label>
                </div>
              </template>
            </div>
          </div>
          <div v-else class="pl20">
            <p v-if="getMinDate && getMaxDate && isCalendarSelected">
              <strong>Please select delivery date</strong>
            </p>
          </div>
          <!-- <template v-if="getShippingMethodsWithoutDates.length > 0">
            <div
              class="col-md-12 col-xs-12"
              v-for="method in getShippingMethodsWithoutDates"
              :key="method.method_code"
            >
              <label class="radioStyled">
              Hello  {{ method.method_title }}
                {{
                  method.amount === 0 && method.method_code === 'collection'
                    ? ''
                    : method.amount === 0
                      ? ' | Free Delivery'
                      : ` | ${method.amount}`
                }}
                <input
                  type="radio"
                  :value="method.method_code"
                  @click="handleShippingMethodWithoutDateClick"
                  ref="shippingMethodWithoutDate"
                  name="shipping-method"
                  v-model="shipping.shippingMethod"
                  @change="
                    $v.shipping.shippingMethod.$touch();
                    changeShippingMethod('fromInput');
                  "
                >
                <span class="checkmark black-border-checkmark" />
              </label>
              <ShippingMethod
                :identifier="method.method_code"
                :current-method="shipping.shippingMethod"
                :is-calendar-selected="isCalendarSelected"
              />
            </div>
          </template> -->
          <!-- <div v-for="(method, index) in shippingMethods" :key="index" class="col-md-6">
            <label class="radioStyled">
              {{ method.method_title }} | {{ method.amount | price }}
              <input
                type="radio"
                :value="method.method_code"
                name="shipping-method"
                v-model="shipping.shippingMethod"
                @change="
                  $v.shipping.shippingMethod.$touch();
                  changeShippingMethod();
                "
              >
              <span class="checkmark" />
            </label>
          </div>-->
          <span
            class="validation-error"
            v-if="
              $v.shipping.shippingMethod.$error &&
              !$v.shipping.shippingMethod.required
            "
            >{{ $t("Field is required") }}</span
          >
        </form>
      </div>
      <div
        class="col-xs-12 col-sm-12 col-md-12"
        v-if="
          $v.shipping.$invalid ||
          (isCalendarSelected && shippingSlotsData.length === 0)
        "
      >
        <div
          class="mb8 cl-error"
          v-if="
            $v.shipping.$invalid ||
            (isCalendarSelected && shippingSlotsData.length === 0)
          "
        >
          Please Enter All required fields*
        </div>
      </div>

      <div class="row" v-if="isActive">
        <!-- <div class="hidden-xs col-sm-2 col-md-1" /> -->
        <div class="col-xs-12 col-sm-9 col-md-12">
          <div class="row">
            <div class="col-xs-12 col-md-5 my30 pl30">
              <button-full
                data-testid="shippingSubmit"
                @click.native="
                  sendDataToCheckout();
                  shipcheckedFn();
                "
                :disabled="
                  $v.shipping.$invalid ||
                  getShippingMethods.length === 0 ||
                  (isCalendarSelected && shippingSlotsData.length === 0)
                "
              >
                {{ $t("Continue to payment") }}
              </button-full>
            </div>
          </div>
        </div>
      </div>
      <div class="row pl20" v-if="!isActive && isFilled">
        <!-- <div class="hidden-xs col-sm-2 col-md-1" /> -->
        <div class="col-xs-12 col-sm-9 col-md-11">
          <div class="row fs16 mb35">
            <div class="col-xs-12 h4" data-testid="shippingAddressSummary">
              <p>{{ shipping.firstName }} {{ shipping.lastName }}</p>
              <p>
                {{ shipping.company }} {{ shipping.streetAddress }}
                {{ shipping.apartmentNumber }}
              </p>
              <p>{{ shipping.city }} {{ shipping.zipCode }}</p>
              <p>
                <span v-if="shipping.state">{{ shipping.state }},</span>
                <span>{{ getCountryName() }}</span>
              </p>
              <div v-if="shipping.phoneNumber">
                <span class="pr15">{{ shipping.phoneNumber }}</span>
                <tooltip>{{
                  $t("Phone number may be needed by carrier")
                }}</tooltip>
              </div>
              <div class="col-xs-12">
                <h4>{{ $t("Shipping method") }}</h4>
              </div>
              <div class="col-md-6 mb15">
                <label class="radioStyled">
                  {{ getShippingMethod().method_title }} |
                  {{ getShippingMethod().amount }}
                  <input
                    type="radio"
                    value
                    checked
                    disabled
                    name="chosen-shipping-method"
                  />
                  <span class="checkmark black-border-checkmark" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import {
  unicodeAlpha,
  unicodeAlphaNum,
} from "@vue-storefront/core/helpers/validators";
import { Shipping } from "@vue-storefront/core/modules/checkout/components/Shipping";

import BaseCheckbox from "theme/components/core/blocks/Form/BaseCheckbox";
import BaseInput from "theme/components/core/blocks/Form/BaseInput";
import BaseSelect from "theme/components/core/blocks/Form/BaseSelect";
import ShippingMethod from "theme/components/theme/blocks/ShippingMethod/ShippingMethodBlock";
import ButtonFull from "theme/components/theme/ButtonFull";
import Tooltip from "theme/components/core/Tooltip";
// import VCalendar from 'v-calendar/lib/components/date-picker.umd';
import NoSSR from "vue-no-ssr";
import { mapGetters, mapActions } from "vuex";
import { CartService } from "@vue-storefront/core/data-resolver";
import config from "config";
import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInMonths,
  parseISO,
} from "date-fns";

export default {
  inheritAttrs: false,
  data() {
    return {
      date: this.getMinDate,
      shippingSlotsData: [],
      count: 0,
      postcodelookup_blur: 0,
      isCalendarSelected: true,
      shouldShowChooseDate: true,
      selectedMethod: null,
      isDaySelected: null,
      calendarPriceCurrency: "£",
    };
  },
  methods: {
    resetCurrentShippingMethodFromTS() {
      this.resetCurrentShippingMethod();
    },
    handleShippingMethodWithoutDateClick() {
      if (this.isCalendarSelected) {
        this.isCalendarSelected = false;
        this.$refs.chooseDate.checked = false;
      }
    },
    async handleChooseDateClick() {
      if (
        this.$refs.shippingMethodWithoutDate &&
        this.$refs.shippingMethodWithoutDate.length > 0
      ) {
        this.$refs.shippingMethodWithoutDate.forEach((option) => {
          if (option) option.checked = false;
        });
      }
      this.isCalendarSelected = true;
      const methodChecked = this.$refs.shippingMethodRef;
      // this.manuallySetDateShippingMethod();
      this.manuallySetDateShippingMethod();
    },
    handleOnClick(e) {
      if (
        e.attributes &&
        e.attributes[0] &&
        e.attributes[0].customData &&
        e.attributes[0].customData.method_code
      ) {
        const attributes = e.attributes.sort((a, b) => {
          const first = a.customData.method_code.charAt(
            a.customData.method_code.length - 1
          );
          const second = b.customData.method_code.charAt(
            b.customData.method_code.length - 1
          );
          return first - second;
        });
        this.shippingSlotsData = attributes;
        this.selectedMethod = e.attributes[0].customData.method_code;
        this.shipping.methodCode = e.attributes[0].customData.method_code;
        this.manuallySetDateShippingMethod();
        this.changeShippingMethod("handleOnClick");
        this.calendarPriceCurrency = config.i18n.currencySign;
      }
    },
    manuallySetDateShippingMethod() {
      console.log("shippingMethodRef", this.$refs.shippingMethodRef);
      setTimeout(() => {
        const methodChecked = this.$refs.shippingMethodRef;
        console.log("methodChecked ", methodChecked);
        if (methodChecked[0]) {
          console.log("methodCheckedTrue ", methodChecked[0]);
          methodChecked[0].click();
        }
      }, 100);
    },
    async updateShippingOptions(setDefault = false) {
      this.postcodelookup_blur = 1;
      try {
        await this.changeCountry();
        const address = {
          country_id: this.shipping.country,
          postcode: this.shipping.zipCode,
        };
        this.date = "";
        this.shippingSlotsData = [];
        const { result } = await CartService.getShippingMethods(address);
        console.log(result);
        await this.$store.commit(
          "checkout/checkout/SET_SHIPPING_METHOD",
          result
        );
        if (
          this.getShippingMethodsWithDates.length > 0 &&
          this.getShippingMethodsWithoutDates.length >= 0
        ) {
          // this.selectFirstShippingMethod();
        }
      } catch (error) {
        console.error(error);
      }
    },
    selectFirstShippingMethod() {
      if (this.isCalendarSelected && this.getSortedDates[0]) {
        setTimeout(async () => {
          const selectionDate = this.getSortedDates[0].split("/");
          const month = selectionDate[0];
          const day = selectionDate[1];
          const year = selectionDate[2];
          const finalDate = [year, month, day].join("-");
          const dayObject = await document.querySelector(`.id-${finalDate}`)
            .firstChild.firstChild;
          console.log(dayObject);
          await dayObject.click();
        }, 200);
      }
    },
    changeDateOrder(date) {
      if (date) {
        const dateArray = date.split("/");
        const month = dateArray[0];
        const day = dateArray[1];
        const year = dateArray[2];

        const changedArray = [year, month, day];
        return changedArray.join("-");
      } else {
        // To make sure it doesnt return undefined values. In reference to FLOR-253
        return false;
      }
    },
    getDateFromMethodCode(shippingMethod) {
      const regex = /(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g;
      if (shippingMethod && shippingMethod.match(regex)) {
        return shippingMethod.match(regex)[0];
      } else {
        console.log("Else", shippingMethod);
      }
    },
    getAllDates(startDate, endDate, interval = "DAY") {
      if (interval === "DAY") {
        const days = differenceInDays(endDate, startDate);

        return [...Array(days + 1).keys()]
          .map((i) => addDays(startDate, i))
          .map((item) => {
            return item.toISOString().slice(0, 10);
          });
      }

      if (interval === "MONTH") {
        const months = differenceInMonths(endDate, startDate);

        return [...Array(months + 1).keys()]
          .map((i) => addMonths(startDate, i))
          .map((item) => item.toISOString().slice(0, 10));
      }
    },
    async postalcodelookup() {
      console.log("Here " + this.count++);
      if (this.count++ > 1) {
        console.log("gree");
      } else {
        console.log("less");
        const craftyplugin_args = document.createElement("script");
        craftyplugin_args.innerHTML = `var cp_access_token = "0408b-db3a6-cc0af-02842";
          var cp_obj_1 = CraftyPostcodeCreate();
          cp_obj_1.set("access_token", cp_access_token);
          cp_obj_1.set("result_elem_id", "crafty_postcode_result_display_1");
          cp_obj_1.set("busy_img_url", "/assets/crafty_postcode_busy.gif");
          cp_obj_1.set("first_res_line", "----- Please Select Your Address ----");
          cp_obj_1.set("res_autoselect", "0");
          cp_obj_1.set("hide_result", 1);
          cp_obj_1.set("form", "address");
          cp_obj_1.set("elem_company"  , "company-name");
          cp_obj_1.set("elem_street1"  , "street-address");
          cp_obj_1.set("elem_street2"  , "apartment-number");
          cp_obj_1.set("elem_town"     , "city");cp_obj_1.set("elem_county"   , "state");
          cp_obj_1.set("elem_postcode" , "postcode");cp_obj_1.set("single_res_autoselect" , 1);
          cp_obj_1.set("hide_result", "1");
           cp_obj_1.set("on_result_ready", function(){
            document.getElementById("crafty_postcode_result_display_1").style.display = "block";
            const crafty = document.querySelector("#crafty_postcode_result_display_1");
            const p = document.createElement('p');
            p.innerText = "Can't find your address? Enter manually below";
            crafty.append(p);
            });
           cp_obj_1.set("on_result_selected", function(){console.log("ssa");
           document.getElementById("crafty_postcode_result_display_1").style.display = "none";
           var ele1 = document.getElementsByName('city')[0];
           ele1vale = ele1.value;
           if (ele1vale !== ''){
                ele1.classList.remove('empty');
           }
           var ele2 = document.getElementsByName('zip-code')[0];
           ele2vale = ele2.value;
           if (ele2vale !== '') {
                ele2.classList.remove('empty');
           }
           var ele3 = document.getElementsByName('street-address')[0];
           ele3vale = ele3.value;
           if (ele3vale !== ''){
                ele3.classList.remove('empty');
           }
           var ele4 = document.getElementsByName('apartment-number')[0];
           ele4vale = ele4.value;
           if(ele4vale !== '') {
                ele4.classList.remove('empty');
           }
           var ele5 = document.getElementsByName('state')[0];
           ele5vale = ele5.value;
           if(ele5vale !== '') {
                ele5.classList.remove('empty');
           }
           var ele6 = document.getElementsByName('company-name')[0];
           ele6vale = ele6.value;
           if (ele6vale !== '') {
                ele6.classList.remove('empty');
           }
           document.getElementById('search-bar').click();
           });`;
        document.head.appendChild(craftyplugin_args);
      }
      var ele1 = document.getElementsByName("street-address")[0].value;
      this.shipping.streetAddress = ele1;
      var ele2 = document.getElementsByName("apartment-number")[0].value;
      this.shipping.apartmentNumber = ele2;
      var ele3 = document.getElementsByName("city")[0].value;
      this.shipping.city = ele3;
      var ele4 = document.getElementsByName("state")[0].value;
      this.shipping.state = ele4;
      var ele5 = document.getElementsByName("postcode")[0].value;
      this.shipping.zipCode = ele5;
      var ele6 = document.getElementsByName("company-name")[0].value;
      this.shipping.company = ele6;
      await this.$store.commit("checkout/checkout/SAVE_SHIPPING_DETAILS", {
        apartmentNumber: ele2,
        city: ele3,
        streetAddress: ele1,
        company: ele6,
        state: ele4,
        zipCode: ele5,
      });
      await this.updateShippingOptions();
    },
    shipcheckedFn: function () {
      var tick_elem = document.getElementsByClassName("non-selected-tick")[1];
      tick_elem.classList.add("tick-active");
      setTimeout(() => {
        const headerClass = document.getElementsByClassName('header')[0];
        const headerHeight = parseFloat(headerClass.offsetHeight);
        const scrollToPayment = document.getElementById('scrollToPayment')
        const elementPosition = scrollToPayment.offsetTop;
        const offsetPosition = elementPosition - headerHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 10);
    },
  },
  components: {
    ButtonFull,
    Tooltip,
    BaseCheckbox,
    BaseInput,
    BaseSelect,
    "no-ssr": NoSSR,
    "v-calendar": () => import("v-calendar/lib/components/date-picker.umd"),
    ShippingMethod,
  },
  created() {
    const craftyplugin = document.createElement("script");
    craftyplugin.setAttribute("src", "/assets/js/crafty_postcode.class.js");
    document.head.appendChild(craftyplugin);
    this.shipping.country = "GB";
  },
  mixins: [Shipping],
  computed: {
    ...mapGetters({
      getShippingMethods: "shipping/getShippingMethods",
      getPersonalDetails: "checkout/getPersonalDetails",
      getShippingDetails: "checkout/getShippingDetails",
      getCartToken: "cart/getCartToken",
    }),
    getShippingMethodsWithoutDates() {
      const regex = /(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g;
      const shippingArrayWithoutDates = this.getShippingMethods.filter(
        (shippingMethod) =>
          regex.test(shippingMethod.method_code) !==
          !regex.test(shippingMethod.method_code)
      );
      console.log("", shippingArrayWithoutDates);
      return shippingArrayWithoutDates;
    },
    getShippingMethodsWithDates() {
      const regex = /(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g;
      const shippingArrayWithDates = this.getShippingMethods.filter(
        (shippingMethod) => regex.test(shippingMethod.method_code)
      );
      console.log("", shippingArrayWithDates);
      return shippingArrayWithDates;
    },
    countryOptions() {
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
    attributes() {
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
    disabledDateFn() {
      const dotteddates = this.getSortedDates.map((item) =>
        this.changeDateOrder(item)
      );
      const allDatesArr = this.getAllDates(this.getMinDate, this.getMaxDate);
      console.log("allDatesArr", allDatesArr);
      const finalDateArray = allDatesArr.filter(
        (singleDate) => !dotteddates.includes(singleDate)
      );
      console.log("finalDateArray", finalDateArray);
      return finalDateArray;
    },
    // eslint-disable-next-line vue/return-in-computed-property
    getMinDate() {
      if (this.getSortedDates[0]) {
        const minDate = this.getSortedDates[0].split("/");
        const month = minDate[0];
        const day = minDate[1];
        const year = minDate[2];
        const finalDate = [year, month, day].join("-");
        return new Date(finalDate);
      }
    },
    // eslint-disable-next-line vue/return-in-computed-property
    getMaxDate() {
      if (this.getSortedDates[0]) {
        const maxDate = this.getSortedDates[
          this.getSortedDates.length - 1
        ].split("/");
        const month = maxDate[0];
        const day = maxDate[1];
        const year = maxDate[2];
        const finalDate = [year, month, day].join("-");
        return new Date(finalDate);
      }
    },
    getSortedDates() {
      return this.getShippingMethods
        .map((shippingMethod) =>
          this.getDateFromMethodCode(shippingMethod.method_code)
        )
        .filter((dateStr) => dateStr !== undefined)
        .sort((a, b) => {
          var c = new Date(a);
          var d = new Date(b);
          return c - d;
          // return a > b ? 1 : a < b ? -1 : 0;
        });
    },
  },
  watch: {
    getShippingMethodsWithoutDates() {
      if (
        this.getShippingMethodsWithDates.length > 0 &&
        this.getShippingMethodsWithoutDates.length === 0
      ) {
        this.isCalendarSelected = true;
        this.shouldShowChooseDate = false;
      }
    },
    isCalendarSelected() {
      // this.selectFirstShippingMethod();
    },
  },
  validations: {
    shipping: {
      firstName: {
        required,
        minLength: minLength(2),
        unicodeAlpha,
      },
      lastName: {
        required,
        unicodeAlpha,
      },
      country: {
        required,
      },
      streetAddress: {
        required,
        unicodeAlphaNum,
      },
      shippingMethod: {
        required,
      },
      zipCode: {
        required,
        minLength: minLength(3),
        unicodeAlphaNum,
      },
      city: {
        required,
        unicodeAlpha,
      },
      phoneNumber: {
        required,
        maxLength: maxLength(11),
      },
    },
  },
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
  font-family: "Poppins", sans-serif;
  margin: 25px 0px;
  -webkit-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  position: relative;
  h3 {
    color: #676767;
    font-size: 22px;
    width: 100%;
    padding-bottom: 10px;
    font-weight: 600;
    font-family: "Poppins", sans-serif;
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
    color: #4dba87;
  }
  p {
    color: #676767;
  }
  span {
    color: #676767;
  }
  label {
    color: #676767;
    font-size: 16px;
  }
  input:checked + label {
    &:before {
      background-color: #4dba87;
      border-color: #4dba87;
      cursor: pointer;
    }
    &:after {
      background-color: #4dba87;
    }
  }
  .checkmark {
    &:after {
      background: #4dba87 !important;
    }
  }
  button {
    background-color: #4DBA87;
    border-radius: 5px;
    font-size: 16px;
    padding-top: 12px;
    padding-bottom: 12px;
    :hover {
      border-radius: 5px;
      background-color: #4dba87;
    }
  }
  .postcode-select {
    select {
      width: 100% !important;
      background-color: transparent;
      border-radius: 5px;
      margin-bottom: 10px;
      font-family: "Poppins", sans-serif;
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
  font-family: "Poppins", sans-serif;
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
  color: #4DBA87 !important;
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
