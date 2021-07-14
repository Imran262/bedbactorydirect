<template>
  <div>
    <div class="pt20 billing-details" v-if="!fromCart">
      <div class="row pl30 pr30">
        <div class="col-xs-12 col-sm-12 col-md-12">
          <form method="post" name="address" class="form-row row">
            <div class="crafty-postcodelookup req-label">
              <label>Postcode</label>
              <input
                type="text"
                id="search-bar"
                name="postcode"
                class="postalcode-lookup"
                :class="{
                  empty: shipping.zipCode === '' && postcodelookup_blur === 1,
                }"
                placeholder=""
                v-model="shipping.zipCode"
                @click="postalcodelookup()"
                @input="postalcodelookup()"
                @blur="updateShippingOptions"
              />
              <button
                type="button"
                class="find-address"
                id="find-address"
                onclick="cp_obj_1.doLookup()"
                @touchenter="activateFindAddress"
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
                    $v.shipping.lastName.$error &&
                    !$v.shipping.lastName.required,
                  text: $t('Field is required'),
                },
              ]"
            />
            <base-input
              class="col-xs-12 mb10 street-name company-input"
              type="text"
              name="company-name"
              :placeholder="$t('Company')"
              v-model.trim="shipping.company"
              autocomplete="company-name"
            />

            <base-select
              class="
                col-xs-12 col-sm-12 col-md-6
                mb20
                req-label
                country-req-label
              "
              name="countries"
              :options="countryOptions"
              :selected="shipping.country"
              :placeholder="$t('Country')"
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
              class="col-xs-12 mb10 street-name req-label"
              type="text"
              name="street-address"
              :placeholder="$t('Address')"
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
              class="col-xs-12 mb10 second-address"
              type="text"
              name="apartment-number"
              :placeholder="$t('')"
              v-model.trim="shipping.apartmentNumber"
              @blur="$v.shipping.apartmentNumber.$touch()"
              autocomplete="address-line3"
            />

            <base-input
              class="col-xs-12 col-sm-12 col-md-12 mb10 req-label city-label"
              type="text"
              name="city"
              :placeholder="$t('City')"
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
                  condition:
                    $v.shipping.city.$error && $v.shipping.city.required,
                  text: $t('Please provide valid city name'),
                },
              ]"
            />

            <base-input
              class="col-xs-12 col-sm-12 col-md-6 mb10 hidden"
              type="text"
              name="state"
              :placeholder="$t('County')"
              v-model.trim="shipping.state"
              autocomplete="address-level1"
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
              class="
                col-xs-12 col-sm-12 col-md-6
                mb0
                shipping-phone-number
                req-label
              "
              type="tel"
              onkeydown="return event.keyCode !== 69"
              inputmode="numeric"
              pattern="[0-9]*"
              name="phone-number"
              :placeholder="$t('Telephone')"
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
            <base-input
              class="col-xs-12 col-sm-12 col-md-6 mb0 mobile-number"
              type="tel"
              onkeydown="return event.keyCode !== 69"
              inputmode="numeric"
              pattern="[0-9]*"
              name="phone-number"
              :placeholder="$t('Mobile')"
              v-model.trim="shipping.mobile"
              @blur="$v.shipping.mobile.$touch()"
              autocomplete="tel"
            />
            <p class="col-xs-12 col-sm-12 col-md-6 phone-text empty" />
            <!-- <div class="detail-checkbox">
              <input
                type="checkbox"
                :value="shipping.newsLetter"
                name="newsLetter1"
                v-model="shipping.newsLetter"
                id="newsLetter1"
                :checked="shipping.newsLetter ? 'checked': ''"
              >
              <label for="newsLetter1"> Yes, I want to be kept up to date with offers, discounts, and all manner of
                useful tiling related content.</label>
            </div> -->
          </form>
        </div>
      </div>
    </div>
    <div class="pl30 pr30 billing-details-cart" v-else>
      <div class="row">
        <div class="col-xs-5 col-md-6 col-lg-6">
          <h3 class="shipping-edit1">Shipping</h3>
        </div>
        <div class="col-xs-7 col-md-6 col-lg-6">
          <div class="lh30 flex end-lg shiping-edit">
            <a href="#" class="cl-tertiary flex" @click="editShipping">
              <span class="pr5">
                {{ $t("Edit shipping") }}
              </span>
              <i class="material-icons cl-tertiary">edit</i>
            </a>
          </div>
        </div>
      </div>
      <div class="row pl20">
        <div class="col-xs-12 col-sm-9 col-md-11">
          <div class="row fs16 mb35 mobile-text">
            <div
              class="col-xs-12 h4"
              data-testid="shippingAddressSummary"
              v-if="shippingData.firstname"
            >
              <p>{{ shippingData.firstname }} {{ shippingData.lastname }}</p>
              <p>
                {{ shippingData.street }}
                {{
                  shippingData.apartment ? " ," + shippingData.apartment : ""
                }}
              </p>
              <p>{{ shippingData.city }} , {{ shippingData.zip }}</p>
              <p>
                {{ shippingData.country }}
              </p>
              <p v-if="shippingData.phone">T: {{ shippingData.phone }}</p>
              <base-input
                v-if="!shippingData.phone"
                class="
                  col-xs-12 col-sm-12 col-md-6
                  mb0
                  shipping-phone-number
                  req-label
                  paypalPhone
                "
                type="tel"
                onkeydown="return event.keyCode !== 69"
                inputmode="numeric"
                pattern="[0-9]*"
                name="phone-number"
                :placeholder="$t('Telephone')"
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
              <!-- <p>
              <span v-if="shipping.state">{{ shipping.state }}, </span>
              <span>{{ getCountryName() }}</span>
            </p>
            <div v-if="shipping.phoneNumber">
              <span class="pr15">{{ shipping.phoneNumber }}</span>
              <tooltip>{{ $t('Phone number may be needed by carrier') }}</tooltip>
            </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pt20 delivery-methods-detail">
      <div class="delivery-method-boxes pl30 pr30">
        
        <div class="row delivery-method">
          <div class="col-md-6 col-xs-12">
            <label class="radioStyled">
              Home Delivery:
              <input
                type="radio"
                name="choose-date"
                ref="chooseDate"
                checked="checked"
                @click="handleChooseDateClick"
              />
              <span
                class="checkmark black-border-checkmark"
                :class="isCalendarSelected ? 'customselectedclass' : ''"
              />
            </label>
          </div>
          <div class="col-md-6 col-xs-12"></div>
        </div>
      </div>
      <div class="home-delivery-box">
        {{ showAvailableMethod() }}
        <h3 class="pl30 pr30">Delivery Date/Method</h3>
        <div class="free-des" v-if="isBFDContact">
          <label class="radioStyled">
            Free Standard Delivery
            <!-- {{shipping}} -->
            <input
              type="radio"
              :value="'is_bfd_contact'"
              name="shipping-method"
              ref="shippingMethodRef"
              v-model="shipping.shippingMethod"
              @change="
                $v.shipping.shippingMethod.$touch();
                changeShippingMethod(true);
                selectedMethod = 'is_bfd_contact';
              "
            />
          </label>
          <span> {{ methodMessage }}</span>
        </div>
        <div v-else-if="canNotDeliver">
          <div class="not deliver">
            {{ methodMessage }}
          </div>
        </div>

        <div v-else-if="noMethodsFound">No Delivery Methods Found</div>
        <div v-else>
          <template
            v-if="
              getShippingMethodsWithRoyalMail.length !== 0 &&
              getShippingMethodsWithOOS.length == 0
            "
          >
            <h3
              class="pl30 pr30"
              v-if="
                selectedDeliveryMethod === 'homedelivery' &&
                getSortedDates.length !== 1
              "
            >
              Delivery Date 1
            </h3>
            <label
              class="pl30 pr30"
              v-if="
                getShippingMethodsWithOOS.length == 0 &&
                selectedDeliveryMethod === 'homedelivery' &&
                getSortedDates.length !== 1
              "
            >
              Your order will be posted through the letterbox, no signature
              required
            </label>
          </template>
          <template v-if="getShippingMethodsWithOOS.length > 0">
            <h3
              class="pl30 pr30"
              v-if="
                selectedDeliveryMethod === 'homedelivery' &&
                getSortedDates.length !== 1
              "
            >
              Delivery Date 2
            </h3>
          </template>
          <template
            v-if="getShippingMethodsWithOOS.length > 0 && outOfStockCode()"
          >
            <div
              class="OutOfstockItem"
              v-if="
                getShippingMethodsWithOOS.length > 0 &&
                selectedDeliveryMethod === 'homedelivery' &&
                getSortedDates.length !== 1
              "
            >
              <span>Out of Stock Item</span>
              <p>
                Delivery Date currently unavailable. We will contact you when
                the goods are ready to ship.
              </p>
            </div>
          </template>
          <template
            v-if="
              getShippingMethodsWithOOS.length == 0 &&
              getShippingMethodsWithRoyalMail.length == 0
            "
          >
            <h3
              class="pl30 pr30"
              v-if="
                selectedDeliveryMethod === 'homedelivery' &&
                getSortedDates.length !== 1
              "
            >
              Select your prefered delivery day
            </h3>
          </template>
          <!-- <template v-else>
          <h3 class="pl30 pr30" v-if="getShippingMethodsWithOOS.length !== 0 && selectedDeliveryMethod === 'homedelivery' && getSortedDates.length !== 1">
            Delivery Date
          </h3>
        </template> -->
          <h3
            class="pl30 pr30 hidden"
            v-if="selectedDeliveryMethod === 'warehouse'"
          >
            Choose Collection Date
          </h3>
          <h3
            class="pl30 pr30"
            v-if="
              selectedDeliveryMethod === 'homedelivery' &&
              getSortedDates.length === 1
            "
          >
            Shipping Date
          </h3>
          <div
            class="cal-txt"
            id="deliveryMethods"
            :class="
              getShippingMethodsWithRoyalMail.length === 0
                ? 'showDelSection'
                : 'hideDelSection'
            "
            v-if="
              selectedDeliveryMethod === 'homedelivery' &&
              getSortedDates.length === 0
            "
          >
            <p
              class="pl30 pr30"
              v-for="method in getShippingMethods"
              :key="method.method_code"
            >
              <label class="radioStyled">
                <span>{{ method.method_title }}</span>
                <input
                  type="radio"
                  @click="handleShippingMethodAll"
                  :value="method.method_code"
                  ref="shippingMethodWithoutDateAll"
                  name="shipping-method"
                  v-model="shipping.shippingMethod"
                  @change="
                    $v.shipping.shippingMethod.$touch();
                    changeShippingMethod('fromInput');
                  "
                />
                <span
                  class="checkmark black-border-checkmark shippingMethodAll"
                  :class="!radioCheckedFlag ? 'allunchecked' : ''"
                />
              </label>
            </p>
          </div>
          <div
            v-if="
              getSortedDates.length === 1 &&
              selectedDeliveryMethod === 'homedelivery'
            "
          >
            <h5
              class="pl30 pr30 mb10 delivery-msg-date"
              v-if="!$v.shipping.$invalid || fromCart"
            >
              We currently have limited availability for
              {{ calenderHasSingleDate }}. Order now to secure your delivery
              slot.
            </h5>
            <div class="row singleDateRowData">
              <div class="col-md-6 col-xs-12 pl30 pr30 instruction one">
                <h3 v-if="selectedDeliveryMethod === 'homedelivery'">
                  Special Delivery Instructions
                </h3>
                <textarea
                  row="20"
                  cols="10"
                  name="delivery-note"
                  placeholder="Enter instructions"
                  v-model.trim="shipping.deliveryNote"
                />
                <input
                  type="hidden"
                  name="delivery-note-hidden"
                  placeholder="Enter instructions"
                  v-model.trim="shipping.deliveryNoteHidden"
                />
              </div>
              <div class="col-md-6 col-xs-12 pl30 pr30 instruction two">
                <h3 v-if="selectedDeliveryMethod === 'homedelivery'">
                  If no one is in:
                </h3>
                <base-select
                  class="
                    col-xs-12 col-sm-12 col-md-12
                    mb20
                    req-label
                    NOone-req-label
                  "
                  name="noOneField"
                  :options="noOneField"
                  :selected="shipping.noOneField ? shipping.noOneField : ''"
                  v-model="shipping.noOneField"
                  autocomplete="noOneField"
                />
              </div>
            </div>
            <template v-for="slotData in shippingSlotsData">
              <div
                v-if="
                  slotData &&
                  slotData.customData &&
                  slotData.customData.method_code
                "
                :key="slotData.customData.method_code"
                class="calendar-right-inner hidden"
              >
                <label class="label">
                  <template
                    v-if="
                      (slotData.customData.method_code.indexOf('Kerbside') !==
                        -1) ==
                      true
                    "
                    ><span
                      v-html="
                        parseTitle(
                          slotData.customData.method_title,
                          slotData.customData.price_incl_tax
                        )
                      "
                    />
                  </template>
                  <template
                    v-if="
                      (slotData.customData.method_code.indexOf('DPD') !== -1) ==
                      true
                    "
                    ><span
                      v-html="
                        parseTitle(
                          slotData.customData.method_title,
                          slotData.customData.price_incl_tax
                        )
                      "
                    />
                  </template>
                  <template
                    v-if="
                      ((slotData.customData.method_code.indexOf(
                        'Royal Mail'
                      ) !==
                        -1) ==
                        true ||
                        (slotData.customData.method_code.indexOf(
                          'Royal_Mail'
                        ) !==
                          -1) ==
                          true) &&
                      getSortedDates.length !== 1
                    "
                    ><span
                      v-html="
                        parseTitle(
                          slotData.customData.method_title,
                          slotData.customData.price_incl_tax
                        )
                      "
                    />
                  </template>
                  <template
                    v-if="
                      (slotData.customData.method_code.indexOf('Samples') !==
                        -1) ==
                      true
                    "
                    ><span
                      v-html="
                        parseTitle(
                          slotData.customData.method_title,
                          slotData.customData.price_incl_tax
                        )
                      "
                    />
                  </template>
                  <input
                    type="radio"
                    :value="slotData.customData.method_code"
                    name="single-shipping-method"
                    ref="singleShippingMethodRef"
                    v-model="shipping.shippingMethod"
                    @change="
                      $v.shipping.shippingMethod.$touch();
                      changeShippingMethod();
                      selectedMethod = slotData.customData.method_code;
                    "
                    @click="dateAndTimeUpdate(slotData.customData.method_title)"
                  />
                  <span class="checkmarkbox" />
                </label>
              </div>
            </template>
          </div>
          <div
            class="row pl30 pr30 calendar-area"
            :class="
              getShippingMethodsWithRoyalMail.length === 0
                ? 'showDelSection'
                : 'hideDelSection'
            "
            v-else
          >
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
              <label class="radioStyled pre-del">
                Select your preferred delivery day
                <input
                  type="radio"
                  name="choose-date"
                  ref="chooseDate"
                  @click="handleChooseDateClick"
                />
                <span
                  class="checkmark black-border-checkmark pre-del-check"
                  :class="isCalendarSelected ? 'customselectedclass' : ''"
                />
              </label>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 calendar-box">
              <no-ssr>
                <v-calendar
                  v-if="
                    getMinDate &&
                    getMaxDate &&
                    disabledDateFn &&
                    attributes &&
                    isCalendarSelected
                  "
                  class="calendar col-md-6"
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
                  :first-day-of-week="0"
                  :masks="masksObj"
                />
              </no-ssr>
              <div
                class="calendar-right col-lg-6 col-md-6 col-xs-12"
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
                      <label class="radioStyled pre-del">
                        <template
                          v-if="
                            (slotData.customData.method_code.indexOf(
                              'Kerbside'
                            ) !==
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
                          v-if="
                            selectedMethod == slotData.customData.method_code
                          "
                        >
                        <!-- slotData.customdata {{slotData.customData}} -->
                          {{
                            slotData.customData.amount === 0
                              ? "Free Delivery"
                              : calendarPriceCurrency +
                                slotData.customData.amount
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
                        <span
                          class="free-del"
                          v-if="slotData.customData.carrier_title"
                        >
                          <p class="free-del-p">
                            {{ slotData.customData.carrier_title }}
                          </p>
                        </span>
                        <span
                          class="checkmark black-border-checkmark pre-del-check"
                        />
                      </label>
                    </div>
                  </template>
                </div>
              </div>
              <div
                class="cal-checkbox"
                v-if="
                  selectedDeliveryMethod === 'homedelivery' &&
                  getKerbsideShppingMethods.length > 0
                "
              >
                <input
                  type="checkbox"
                  name="vehicle"
                  id="vehicle"
                  v-model="shipping.narrowRoad"
                  @click="narrowCheckedFn"
                />
                <label for="vehicle">
                  Narrow Road - Smaller Vehicle Advisable</label
                >
              </div>
            </div>
            
            <template v-if="getShippingMethodsWithoutDates.length > 0">
              <div
                class="col-md-12 col-xs-12"
                v-for="method in getShippingMethodsWithoutDates"
                :key="method.method_code"
              >
                <StoreLocation v-if="selectedDeliveryMethod === 'warehouse'" />
                <!--<ShippingMethod
                :identifier="method.method_code"
                :current-method="shipping.shippingMethod"
                :is-calendar-selected="isCalendarSelected"
              />-->
              </div>
            </template>
            <span
              class="validation-error"
              v-if="
                $v.shipping.shippingMethod.$error &&
                !$v.shipping.shippingMethod.required
              "
              >{{ $t("Field is required") }}</span
            >
          </div>
          <div
            class="col-xs-12 col-sm-12 col-md-12 pl30 pr30"
            v-if="$v.shipping.$invalid && !fromCart"
          >
            <div class="mb8 cl-error" v-if="$v.shipping.$invalid">
              Please Enter All required fields*
            </div>
          </div>
        </div>
        <!-- //button start
        {{ getSortedDates.length > 1 }}
        selectedDeliveryMethod === 'homedelivery'
        {{ selectedDeliveryMethod === "homedelivery" }} homeDeliverySelected
        {{ homeDeliverySelected }} deliveryBtnClicked{{ deliveryBtnClicked }} -->
        <template v-if="!canNotDeliver && !noMethodsFound && isBFDContact">
          <div
            class="delivery-btn"
            :class="
              getShippingMethodsWithRoyalMail.length === 0
                ? 'showDeliBtnSection'
                : 'hideDeliBtnSection'
            "
          >
            <div class="row" v-if="!fromCart">
              <div class="col-xs-12 col-md-6 my30 pl40 pr30">
                <button-full
                  data-testid="shippingSubmit"
                  ref="referenceShippingSubmit"
                  id="shippingSubmitBtnId"
                  v-if="homeDeliverySelected && !(deliveryBtnClicked == true)"
                  :class="
                    deliveryBtnClicked ? 'newdateSelected' : 'noNewdateSelected'
                  "
                  @click.native="
                    sendDataToCheckout();
                    dateSelected();
                  "
                  :disabled="$v.shipping.$invalid"
                >
                  <!-- <span v-if="deliveryBtnClicked == true">
                  {{ $t('Delivery: ') }}
                  <span class="date-span" v-if="deliveryTimeDate"
                    >{{ deliveryTimeDate }}
                  </span>
                </span> -->
                  <span v-if="!(deliveryBtnClicked == true)">
                    {{ $t("Continue to Payment here") }}
                    <span class="date-span" v-if="deliveryTimeDate"
                      >{{ deliveryTimeDate }}
                    </span>
                  </span>
                </button-full>
              </div>
              <!-- <div class="col-xs-12 col-md-6">
              <div
                class="editdate"
                v-if="displayEditButton && homeDeliverySelected"
              >
                <span @click="resetForm">Edit Delivery Date</span>
              </div>
            </div> -->
            </div>
          </div>
        </template>
        <template v-else>
          <div
            class="delivery-btn"
            :class="
              getShippingMethodsWithRoyalMail.length === 0
                ? 'showDeliBtnSection'
                : 'hideDeliBtnSection'
            "
            v-if="
              selectedDeliveryMethod === 'homedelivery' &&
              getSortedDates.length > 1
            "
          >
            <div class="row" v-if="!fromCart">
              <div class="col-xs-12 col-md-6 my30 pl40 pr30">
                <button-full
                  data-testid="shippingSubmit"
                  ref="referenceShippingSubmit"
                  id="shippingSubmitBtnId"
                  v-if="homeDeliverySelected && !(deliveryBtnClicked == true)"
                  :class="
                    deliveryBtnClicked ? 'newdateSelected' : 'noNewdateSelected'
                  "
                  @click.native="
                    sendDataToCheckout();
                    dateSelected();
                  "
                  :disabled="
                    $v.shipping.$invalid ||
                    getShippingMethods.length === 0 ||
                    (isCalendarSelected && shippingSlotsData.length === 0)
                  "
                >
                  <!-- <span v-if="deliveryBtnClicked == true">
                  {{ $t('Delivery: ') }}
                  <span class="date-span" v-if="deliveryTimeDate"
                    >{{ deliveryTimeDate }}
                  </span>
                </span> -->
                  <span v-if="!(deliveryBtnClicked == true)">
                    {{ $t("Continue to Payment") }}
                    <span class="date-span" v-if="deliveryTimeDate"
                      >{{ deliveryTimeDate }}
                    </span>
                  </span>
                </button-full>
              </div>
              <!-- <div class="col-xs-12 col-md-6">
              <div
                class="editdate"
                v-if="displayEditButton && homeDeliverySelected"
              >
                <span @click="resetForm">Edit Delivery Date</span>
              </div>
            </div> -->
            </div>
          </div>
        </template>
        <NarrowModal :date-prop="narrowDateProp" />
      </div>
    </div>
  </div>
</template>

<script>
import {required,minLength,maxLength} from 'vuelidate/lib/validators'
import {
  unicodeAlpha,
  unicodeAlphaNum
} from '@vue-storefront/core/helpers/validators'
import {Shipping} from '@vue-storefront/core/modules/checkout/components/Shipping'
import DeliveryMethods from 'theme/components/core/blocks/Checkout/DeliveryMethods'
import StoreLocation from 'theme/components/core/blocks/Checkout/StoreLocation'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import BaseTextarea from 'theme/components/core/blocks/Form/BaseTextarea'
import ShippingMethod from 'theme/components/theme/blocks/ShippingMethod/ShippingMethodBlock'
import ButtonFull from 'theme/components/theme/ButtonFull'
import Tooltip from 'theme/components/core/Tooltip'
import NoSSR from 'vue-no-ssr'
import {mapGetters,mapActions} from 'vuex'
import {CartService} from '@vue-storefront/core/data-resolver'
import NarrowModal from 'theme/components/core/blocks/Checkout/NarrowModal'
import config from 'config'
import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInMonths,
  parseISO
} from 'date-fns'

export default {
  inheritAttrs: false,
  data () {
    return {
      date: this.getMinDate,
      radioCheckedFlag: false,
      shippingSlotsData: [],
      count: 0,
      postcodelookup_blur: 0,
      isCalendarSelected: true,
      shouldShowChooseDate: true,
      selectedMethod: null,
      isDaySelected: null,
      calendarPriceCurrency: '£',
      selectedDeliveryMethod: 'homedelivery',
      displayEditButton: false,
      isDateSelected: true,
      homeDeliverySelected: true,
      deliveryBtnClicked: false,
      deliveryTimeDate: '',
      deliveryBtnEnable: false,
      narrowChecked: false,
      narrowDateProp: '',
      narrowDateMatch: '',
      noOneField: config.checkoutNoOneField,
      getProductFromCart: this.productsInCart,
      masksObj: {weekdays: 'WW'},
      isBFDContact : false,
      canNotDeliver : false,
      showCalender : false,
      noMethodsFound : false,
      methodMessage : ""
    }
  },
  components: {
    ButtonFull,
    Tooltip,
    BaseCheckbox,
    BaseInput,
    BaseSelect,
    BaseTextarea,
    'no-ssr': NoSSR,
    'v-calendar': () => import('v-calendar/lib/components/date-picker.umd'),
    ShippingMethod,
    DeliveryMethods,
    StoreLocation,
    NarrowModal
  },
  props: {
    shippingData: {
      type: Object,
      required: false,
    },
  },
  methods: {
    showAvailableMethod() {
      let methodCheckFlag = false;
      this.isDateSelected =false
     // console.log("3216 In Available Method Function", this.getShippingMethods);
      this.getShippingMethods.forEach((method, index) => {
        // console.log("3216 Methods code ", method.method_code, method);
        // console.log(
        //   "3216 total length : ",
        //   this.getShippingMethods.length,
        //   "\t Current iteration :",
        //   index
        // );
        if (method.method_code === "is_bfd_contact") {
          // console.log("3216 is_bfd_contact");
          methodCheckFlag = true;
          this.isBFDContact = true;
          this.canNotDeliver = false;
          this.showCalender = false;
          this.noMethodsFound = false;
          this.methodMessage = method.carrier_title;
          this.isDateSelected =false;
          // console.log("3216", this.$refs['shippingMethodRef'],this.$refs);
          setTimeout(() => {
            this.$refs["shippingMethodRef"].click();
            // console.log("3216 After", this.$refs['shippingMethodRef'].click(),this.$refs);
          }, 100);
        } 
        else if (method.method_code === "cannot_deliver") {
          // console.log("3216 cannot_deliver");
          methodCheckFlag = true;
          this.isBFDContact = false;
          this.canNotDeliver = true;
          this.showCalender = false;
          this.noMethodsFound = false;
          this.methodMessage = method.carrier_title;
          this.isDateSelected =false;
        }
        if (methodCheckFlag) {
          // console.log("3216 Yes the flag is ", methodCheckFlag);
        } else {
          if (this.getShippingMethods.length === index + 1) {
            if (this.getShippingMethods.length > 2) {
              // console.log("3216 we ll show the dates");
              this.isBFDContact = false;
              this.canNotDeliver = false;
              this.showCalender = true;
              this.noMethodsFound = false;
            } else {
              // console.log("3216 No delivery methods found");
              this.isBFDContact = false;
              this.canNotDeliver = false;
              this.showCalender = false;
              this.noMethodsFound = true;
              this.isDateSelected =false
            }
          }
        }
      });
    },
    editShipping () {
      let token=this.$route.query.token
      if (config.paypalManual.mode==="sandbox") {
        window.location.href=`https://${config.paypalManual.approvalUrl.sandbox}/cgi-bin/webscr?cmd=_express-checkout&token=${token}`
      } else {
        window.location.href=`https://${config.paypalManual.approvalUrl.live}/cgi-bin/webscr?cmd=_express-checkout&token=${token}`
      }
    },
    async checkOutOfStockClass () {
      const outOfStockText=await document.getElementsByClassName('table.cart-summary-product-table.product_out_of_stock')
      if (outOfStockText&&outOfStockText.length>0) {
        return true
      } else {
        return false
      }
    },
    outOfStockCode () {
      if (this.productsInCart&&this.productsInCart[0].custom_stock_status) {
        let getAllStockStatus=config.customStockStatus
        let convertStockCodeToArray=Object.keys(getAllStockStatus).map((key) => getAllStockStatus[key])
        const comapreCustomStockCode=this.productsInCart[0].custom_stock_status
        let checkAllStockCode=convertStockCodeToArray.includes(String(comapreCustomStockCode))
        if (checkAllStockCode) {
          let kerbsidePalletDeliveryClass=document.getElementsByClassName("showDelSection")[0]
          if (kerbsidePalletDeliveryClass) {
            kerbsidePalletDeliveryClass.style.display="none"
          }
          this.handleShippingMethodAll()
          return checkAllStockCode
        } else {
          return false
        }
      }

    },
    narrowCheckedFn () {
      if (!this.narrowChecked) {
        const resultArr=this.getSortedDates.filter((data,index) => {
          return this.getSortedDates.indexOf(data)===index
        })
        let narrowDate=new Date(resultArr[1])
        this.narrowDateMatch=narrowDate
        if (!(this.convertDateToMatch(narrowDate)<=this.convertDateToMatch(this.date))) {
          this.$bus.$emit('modal-show','modal-narrowroad')
          this.date=narrowDate
          this.narrowCheckedAction(narrowDate)
        } else {
          this.narrowCheckedAction(this.date)
        }
        this.shipping.deliveryNoteHidden=config.narrowRoad&&config.narrowRoad.text? config.narrowRoad.text:'Narrow Lane - Smaller 7.5 toned lorry advisable'
        if (this.$refs.referenceShippingSubmit) {
          setTimeout(() => {
            this.$refs.referenceShippingSubmit.$el.click()
          },500)
        }
      } else {
        const resultArr=this.getSortedDates.filter((data,index) => {
          return this.getSortedDates.indexOf(data)===index
        })
        let narrowDate=new Date(resultArr[0])
        this.date=narrowDate
        this.narrowCheckedAction(narrowDate)
        this.shipping.deliveryNote=''
        this.shipping.deliveryNoteHidden=''
        if (this.$refs.referenceShippingSubmit) {
          setTimeout(() => {
            this.$refs.referenceShippingSubmit.$el.click()
          },500)
        }
      }
      this.narrowChecked=!this.narrowChecked
    },
    narrowCheckedAction (narrowDate) {
      let narrowDateFormat=this.convertDateToMatch(narrowDate)
      let narrowDate4mat=narrowDateFormat.split('-')
      let newnarrowDateFormat=narrowDate4mat[2]+'-'+narrowDate4mat[1]+'-'+narrowDate4mat[0]
      this.narrowDateProp=newnarrowDateFormat
      const thirdDateData=[
        ...this.getShippingMethods.map((shippingMethod,index) => ({
          dates: new Date(
            this.changeDateOrder(
              this.getDateFromMethodCode(shippingMethod.method_code)
            )
          ),
          customData: shippingMethod
        }))
      ]
      const thirdDateDataArrayPush=[]
      const thirdDateDataArray=thirdDateData.find(date => {
        let thirdDateFormat=this.convertDateToMatch(date.dates)
        if (narrowDateFormat===thirdDateFormat) {
          thirdDateDataArrayPush.push({customData: date.customData})
        }
      })||{}
      const attributes=thirdDateDataArrayPush.sort((a,b) => {
        const first=a.customData.method_code.charAt(
          a.customData.method_code.length-1
        )
        const second=b.customData.method_code.charAt(
          b.customData.method_code.length-1
        )
        return first-second
      })
      this.isDateSelected=true
      this.shippingSlotsData=attributes
      this.selectedMethod=thirdDateDataArrayPush[0].customData.method_code
      this.shipping.methodCode=thirdDateDataArrayPush[0].customData.method_code
      this.manuallySetDateShippingMethod()
      this.changeShippingMethod('handleOnClick')
      this.calendarPriceCurrency=config.i18n.currencySign
    },
    dateAndTimeUpdate (dateTime) {
      const regexDate=/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g
      const regexTime=/((0?[0-9]|1[012])([:.][0-9]{2})?(\s?[ap]m)|([01]?[0-9]|2[0-3])([:.][0-9]{2})?)/g
      let DateFormat=''
      if (dateTime&&dateTime.match(regexDate)) {
        DateFormat=dateTime.match(regexDate)[0]
      }
      let date=DateFormat.split('-')
      let newDateFormat=date[0]+'/'+date[1]+'/'+date[2]
      let timeFormat=''
      let timeFormat1=''
      let timeFormat2=''
      if (dateTime&&dateTime.match(regexTime)) {
        timeFormat1=dateTime.match(regexTime).slice(-2)[0]
        timeFormat2=dateTime.match(regexTime).slice(-2)[1]
      }
      timeFormat=timeFormat1+'-'+timeFormat2
      // this.deliveryTimeDate = timeFormat + ' ' + newDateFormat;
      this.deliveryTimeDate=newDateFormat
      this.deliveryBtnEnable=true
    },
    parseTitle (data,price) {
      let priceWithCurrency=price
      if (priceWithCurrency-Math.floor(priceWithCurrency)!==0) {
        priceWithCurrency='£'+priceWithCurrency
      } else {
        priceWithCurrency='£'+priceWithCurrency+'.00'
      }
      const regexDate=/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g
      const regexTime=/((0?[0-9]|1[012])([:.][0-9]{2})?(\s?[ap]m)|([01]?[0-9]|2[0-3])([:.][0-9]{2})?)/g
      let DateFormat=''
      if (data&&data.match(regexDate)) {
        DateFormat=data.match(regexDate)[0]
      }
      let date=DateFormat.split('-')
      let newDateFormat=date[0]+'/'+date[1]+'/'+date[2]
      let timeFormat=''
      let timeFormat1=''
      let timeFormat2=''
      if (data&&data.match(regexTime)) {
        timeFormat1=data.match(regexTime).slice(-2)[0]
        timeFormat2=data.match(regexTime).slice(-2)[1]
      }
      timeFormat=timeFormat1+' - '+timeFormat2
      let newTitle='<span class="timeClass">'+timeFormat+'</span><span class="dateClass"> '+priceWithCurrency+'</span>'
      return newTitle
    },
    resetForm () {
      if (this.date) {
        this.$refs.shippingMethodRef.forEach((single) => {
          if (single.checked) {
            single.checked=!single.checked
            single.checked=false
          }
        })
        this.shippingSlotsData=[]
        this.date=''
        this.dateSelectButtonText='Confirm Delivery'
        this.isDateSelected=false
        this.displayEditButton=false
        this.deliveryBtnClicked=false
        this.deliveryTimeDate=''
        this.$emit('date-selected',this.isDateSelected)
      }
    },
    checkIfFieldsAreFilled () {
      if (!this.$v.shipping.$invalid) {
        this.sendDataToCheckout()
      }
    },
    handleShippingMethodWithoutDateClick () {
      if (this.isCalendarSelected) {
        this.isCalendarSelected=false
        this.$refs.chooseDate.checked=false
      }
      this.selectedDeliveryMethod='warehouse'
      this.homeDeliverySelected=false
      this.isDateSelected=true
      this.$emit('date-selected',this.isDateSelected)
      this.checkIfFieldsAreFilled()
      var wareHuuseSelected=document.getElementById('noChecked')
      wareHuuseSelected.classList.remove('no-checked')
    },
    handleShippingMethodAll () {
      this.radioCheckedFlag=true
      this.isDateSelected=true
      this.isCalendarSelected=true
      this.$emit('date-selected',this.isDateSelected)
      this.checkIfFieldsAreFilled()
    },
    async handleChooseDateClick () {
      if (
        this.$refs.shippingMethodWithoutDate&&
        this.$refs.shippingMethodWithoutDate.length>0
      ) {
        this.$refs.shippingMethodWithoutDate.forEach(option => {
          if (option) option.checked=false
        })
      }
      this.homeDeliverySelected=true
      this.isCalendarSelected=true
      // const methodChecked = this.$refs.shippingMethodRef;
      this.manuallySetDateShippingMethod()
      this.selectedDeliveryMethod='homedelivery'
      if (this.isDateSelected&&!this.$v.shipping.$invalid) {
        this.$emit('date-selected',this.isDateSelected)
      } else {
        this.$emit('date-selected',false)
      }
      var wareHuuseSelected=document.getElementById('noChecked')
      wareHuuseSelected.classList.add('no-checked')
    },
    handleOnClick (e) {
      if (this.narrowDateMatch&&e.attributes[0].dates[0].date) {
        if (this.narrowDateMatch>e.attributes[0].dates[0].date) {
          document.getElementById('vehicle').click()
        }
      }
      if (
        e.attributes&&
        e.attributes[0]&&
        e.attributes[0].customData&&
        e.attributes[0].customData.method_code
      ) {
        const attributes=e.attributes.sort((a,b) => {
          const first=a.customData.method_code.charAt(
            a.customData.method_code.length-1
          )
          const second=b.customData.method_code.charAt(
            b.customData.method_code.length-1
          )
          return first-second
        })
        this.isDateSelected=true
        this.shippingSlotsData=attributes
        this.selectedMethod=e.attributes[0].customData.method_code
        this.shipping.methodCode=e.attributes[0].customData.method_code
        this.manuallySetDateShippingMethod()
        this.changeShippingMethod('handleOnClick')
        this.calendarPriceCurrency=config.i18n.currencySign
        // this.checkIfFieldsAreFilled();
      }
    },
    manuallySetDateShippingMethod () {
      setTimeout(() => {
        let methodChecked=this.$refs.shippingMethodRef
        if (methodChecked&&methodChecked[0]) {
          methodChecked[0].click()
        }
      },500)
    },
    async updateShippingOptions (setDefault=false) {
      this.postcodelookup_blur=1
      try {
        await this.changeCountry()
        const address={
          country_id: this.shipping.country,
          postcode: this.shipping.zipCode
        }
        this.date=''
        this.shippingSlotsData=[]
        const {result}=await CartService.getShippingMethods(address)
        await this.$store.commit(
          'checkout/checkout/SET_SHIPPING_METHOD',
          result
        )
        if (
          this.getShippingMethodsWithDates.length>0&&
          this.getShippingMethodsWithoutDates.length>=0
        ) {
          // this.selectFirstShippingMethod();
        }
      } catch (error) {
        console.error(error)
      }
    },
    selectFirstShippingMethod () {
      if (this.isCalendarSelected&&this.getSortedDates[0]) {
        setTimeout(async () => {
          const selectionDate=this.getSortedDates[0].split('/')
          const month=selectionDate[0]
          const day=selectionDate[1]
          const year=selectionDate[2]
          const finalDate=[year,month,day].join('-')
          const dayObject=await document.querySelector(`.id-${finalDate}`)
            .firstChild.firstChild
          await dayObject.click()
        },200)
      }
    },
    changeDateOrder (date) {
      if (date) {
        const dateArray=date.split('/')
        const month=dateArray[0]
        const day=dateArray[1]
        const year=dateArray[2]

        const changedArray=[year,month,day]
        return changedArray.join('-')
      } else {
        // To make sure it doesnt return undefined values. In reference to FLOR-253
        return false
      }
    },
    getDateFromMethodCode (shippingMethod) {
      const regex=/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g
      if (shippingMethod&&shippingMethod.match(regex)) {
        return shippingMethod.match(regex)[0]
      } else {
        // console.log('Else', shippingMethod);
      }
    },
    getAllDates (startDate,endDate,interval='DAY') {
      if (interval==='DAY') {
        const days=differenceInDays(endDate,startDate)

        return [...Array(days+1).keys()]
          .map(i => addDays(startDate,i))
          .map(item => {
            return item.toISOString().slice(0,10)
          })
      }

      if (interval==='MONTH') {
        const months=differenceInMonths(endDate,startDate)

        return [...Array(months+1).keys()]
          .map(i => addMonths(startDate,i))
          .map(item => item.toISOString().slice(0,10))
      }
    },
    activateFindAddress () {
      this.postalcodelookup()
    },
    async postalcodelookup () {
      if (this.count++<1) {
        const craftyplugin_args=document.createElement('script')
        craftyplugin_args.innerHTML=`var cp_access_token = "0408b-db3a6-cc0af-02842";
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
              console.log('sasasasasassasasasasasasasa')
              document.getElementsByName('countries')[0].value == 'JE'
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
           });`
        document.head.appendChild(craftyplugin_args)
      }
      var ele1=document.getElementsByName('street-address')[0].value
      this.shipping.streetAddress=ele1
      var ele2=document.getElementsByName('apartment-number')[0].value
      this.shipping.apartmentNumber=ele2
      var ele3=document.getElementsByName('city')[0].value
      this.shipping.city=ele3
      if (this.shipping.city==='JERSEY'||this.shipping.city==='Jersey'||this.shipping.city==='jersey') {
        this.shipping.country='JE'
      } else if (this.shipping.city==='GUERNSEY'||this.shipping.city==='Guernsey'||this.shipping.city==='guernsey') {
        this.shipping.country='GG'
      } else {
        this.shipping.country='GB'
      }
      var ele4=document.getElementsByName('state')[0].value
      this.shipping.state=ele4
      var ele5=document.getElementsByName('postcode')[0].value
      this.shipping.zipCode=ele5
      var ele6=document.getElementsByName('company-name')[0].value
      this.shipping.company=ele6
      await this.$store.commit('checkout/checkout/SAVE_SHIPPING_DETAILS',{
        apartmentNumber: ele2,
        city: ele3,
        streetAddress: ele1,
        company: ele6,
        state: ele4,
        zipCode: ele5
      })
      await this.updateShippingOptions()
      await this.checkIfFieldsAreFilled()
    },
    dateSelected: function () {
      this.$emit('date-selected',true)
      this.deliveryBtnClicked=true
      this.displayEditButton=false
    },
    selectRenderedDate () {
      setTimeout(() => {
        const singleShippingMethod=this.$refs.singleShippingMethodRef
        if (singleShippingMethod[0]) {
          singleShippingMethod[0].click()
        }
      },2000)
    },
    convertDateToMatch (d) {
      let dateParts=d.toString().split(' ')
      let dateMonths={
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12'
      }
      return dateParts[3]+'-'+dateMonths[dateParts[1]]+'-'+dateParts[2]
    }
  },
  mounted () {
    // For Crafty Plugin
    // const craftyPlugin = document.createElement('script')
    // craftyPlugin.setAttribute('src', '/assets/js/crafty_postcode.class.js')
    // document.head.appendChild(craftyPlugin)

    setTimeout(() => {
      this.useMyAddress()
      let minimumDateSort=[]
      if (this.getShippingMethods) {
        minimumDateSort=this.getShippingMethods
          .map((shippingMethod) =>
            this.getDateFromMethodCode(shippingMethod.method_code)
          )
          .filter((dateStr) => dateStr!==undefined)
          .sort((a,b) => {
            var c=new Date(a)
            var d=new Date(b)
            return c-d
          })
      }
      if (minimumDateSort[0]&&!this.shipping.narrowRoad) {
        const minDateMount=this.getSortedDates[0].split('/')
        const monthMount=minDateMount[0]
        const dayMount=minDateMount[1]
        const yearMount=minDateMount[2]
        const finalDate=[yearMount,monthMount,dayMount].join('-')
        this.date=new Date(finalDate)
        this.narrowCheckedAction(this.date)
        this.manuallySetDateShippingMethod()
      }
      if (minimumDateSort[3]&&this.shipping.narrowRoad) {
        const minDateMount=this.getDateFromMethodCode(this.shipping.shippingMethod).split('/')
        const monthMount=minDateMount[0]
        const dayMount=minDateMount[1]
        const yearMount=minDateMount[2]
        const finalDate=[yearMount,monthMount,dayMount].join('-')
        this.date=new Date(finalDate)
        this.narrowCheckedAction(this.date)
        this.manuallySetDateShippingMethod()
        this.narrowChecked=true
      }
      if (this.getSortedDates&&this.getSortedDates.length===1) {
        this.shipping.deliveryNote=''
        this.shipping.deliveryNoteHidden=''
        this.shipping.narrowRoad=false
      }
      this.shipping.noOneField=''
      if (!this.shipping.narrowRoad) {
        this.shipping.deliveryNote=''
        this.shipping.deliveryNoteHidden=''
      }
    },1000)
  },
  created () {
    // this.shipping.country = 'GB';
    this.shipping.noOneField=''
    if (this.shipping.narrowRoad&&!this.shipping.narrowRoad) {
      this.shipping.deliveryNote=''
      this.shipping.deliveryNoteHidden=''
    }
  },
  mixins: [Shipping],
  computed: {
    ...mapGetters({
      getShippingMethods: 'shipping/getShippingMethods',
      getPersonalDetails: 'checkout/getPersonalDetails',
      getShippingDetails: 'checkout/getShippingDetails',
      getCartToken: 'cart/getCartToken',
      productsInCart: 'cart/getCartItems'
    }),
    fromCart () {
      return this.fullPath.includes('PayerID')? true:false

    },
    fullPath () {
      return this.$route.fullPath
    },
    calenderHasSingleDate () {
      if (this.getSortedDates.length===1) {
        let date=this.getSortedDates
        this.isDateSelected=true
        this.shippingSlotsData=this.filterSingleMethodAttribute
        let shippingSlot=this.filterSingleMethodAttribute
        this.selectedMethod=shippingSlot[0].customData.method_code
        this.shipping.methodCode=shippingSlot[0].customData.method_code
        this.selectRenderedDate()
        this.checkIfFieldsAreFilled()
        this.dateSelected()
        this.deliveryBtnEnable=true
        this.isCalendarSelected=true
        const singleDate=date[0].split('/')
        const sngmonth=singleDate[0]
        const sngday=singleDate[1]
        const sngyear=singleDate[2]
        return [sngday,sngmonth,sngyear].join('-')
      }
    },
    filterSingleMethodAttribute () {
      if (this.attributes&&this.attributes.length>0) {
        return this.attributes.filter((attribute,index) => {
          return attribute.customData&&attribute.customData.carrier_code==='customshipping'
        })
      }
    },
    returnShippingMethod () {
      let selectedMethod=null
      this.$bus.$on('delivery-method',data => {
        this.selectedDeliveryMethod=data
        // console.log(this.selectedDeliveryMethod);
      })
    },
    getShippingMethodsWithoutDates () {
      const regex=/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g
      const regexString=/^collection/g
      let shippingArrayWithoutDate=this.getShippingMethods.filter(
        shippingMethod =>
          regex.test(shippingMethod.method_code)!==
          !regex.test(shippingMethod.method_code)
      )
      const shippingArrayWithoutDates=shippingArrayWithoutDate.filter(
        shippingMethod =>
          regexString.test(shippingMethod.carrier_title)===
          !regexString.test(shippingMethod.carrier_title)
      )
      return shippingArrayWithoutDates
    },
    getShippingMethodsWithRoyalMail () {
      const regexStringRoyal=/^Royal/g
      let shippingArrayWithRoyal=this.getShippingMethods.filter(
        shippingMethod =>
          regexStringRoyal.test(shippingMethod.method_title)===
          !regexStringRoyal.test(shippingMethod.method_title)
      )
      if (shippingArrayWithRoyal.length>0) {
        if (document.getElementsByClassName('hideDelSection')&&document.getElementsByClassName('hideDelSection').length>0&&document.getElementsByClassName('hideDelSection')!==null&&document.getElementsByClassName('hideDelSection')!=='') {
          document.getElementsByClassName('hideDelSection')[0].style.display='none'
        }
        if (!this.fromCart&&this.$refs.shippingMethodWithoutDateAll&&this.$refs.shippingMethodWithoutDateAll[0]) {
          this.$refs.shippingMethodWithoutDateAll[0].click()
        }
        this.manuallySetDateShippingMethod()
        if (this.$refs.referenceShippingSubmit&&document.getElementsByClassName('hideDeliBtnSection')[0]&&!this.fromCart) {
          document.getElementsByClassName('hideDeliBtnSection')[0].style.display='none'
          this.$refs.referenceShippingSubmit.$el.click()
        }
      }
      return shippingArrayWithRoyal
    },
    getShippingMethodsWithOOS () {
      const regexStringOOS=/^Back/g
      let shippingArrayWithOOS=this.getShippingMethods.filter(
        shippingMethod =>
          regexStringOOS.test(shippingMethod.carrier_title)===
          !regexStringOOS.test(shippingMethod.carrier_title)
      )
      return shippingArrayWithOOS
    },
    getShippingMethodsWithDates () {
      const regex=/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g
      const shippingArrayWithDates=this.getShippingMethods.filter(
        shippingMethod => regex.test(shippingMethod.method_title)
      )
      return shippingArrayWithDates
    },
    countryOptions () {
      this.shipping.firstName=this.getPersonalDetails&&this.getPersonalDetails.firstName? this.getPersonalDetails.firstName.trim():''
      this.shipping.lastName=this.getPersonalDetails&&this.getPersonalDetails.lastName? this.getPersonalDetails.lastName.trim():''
      return this.countries.map(item => {
        return {
          value: item.code,
          label: item.name
        }
      })
    },
    getKerbsideShppingMethods () {
      const regexNewString=/^Kerbside/g
      let shippingArrayWithKerbside=[]
      shippingArrayWithKerbside=this.getShippingMethods.filter(
        shippingMethod => shippingMethod.method_code.match(regexNewString)
      )
      return shippingArrayWithKerbside
    },
    attributes () {
      return [
        // Attributes for dates
        ...this.getShippingMethods.map((shippingMethod,index) => ({
          dates: new Date(
            this.changeDateOrder(
              this.getDateFromMethodCode(shippingMethod.method_code)
            )
          ),
          // popover: {
          //   label: `The price is ${shippingMethod.price_incl_tax}`,
          //   hideIndicator: true
          // },
          customData: shippingMethod
        }))
      ]
    },
    disabledDateFn () {
      const dotteddates=this.getSortedDates.map(item =>
        this.changeDateOrder(item)
      )
      const allDatesArr=this.getAllDates(this.getMinDate,this.getMaxDate)
      const finalDateArray=allDatesArr.filter(
        singleDate => !dotteddates.includes(singleDate)
      )
      return finalDateArray
    },
    getMinDate () {
      if (this.getSortedDates[0]) {
        const minDate=this.getSortedDates[0].split('/')
        const month=minDate[0]
        const day=minDate[1]
        const year=minDate[2]
        const finalDate=[year,month,day].join('-')
        return new Date(finalDate)
      }
    },
    getMaxDate () {
      if (this.getSortedDates[0]) {
        const maxDate=this.getSortedDates[
          this.getSortedDates.length-1
        ].split('/')
        const month=maxDate[0]
        const day=maxDate[1]
        const year=maxDate[2]
        const finalDate=[year,month,day].join('-')
        return new Date(finalDate)
      }
    },
    getSortedDates () {
      return this.getShippingMethods
        .map((shippingMethod) =>
          this.getDateFromMethodCode(shippingMethod.method_code)
        )
        .filter((dateStr) => dateStr!==undefined)
        .sort((a,b) => {
          var c=new Date(a)
          var d=new Date(b)
          return c-d
          // return a > b ? 1 : a < b ? -1 : 0;
        })
    }
  },
  watch: {
    getShippingMethodsWithoutDates () {
      if (
        this.getShippingMethodsWithDates.length>0&&
        this.getShippingMethodsWithoutDates.length===0
      ) {
        this.isCalendarSelected=true
        this.shouldShowChooseDate=false
      }
    },
    isCalendarSelected () {
      // this.selectFirstShippingMethod();
    },
    getShippingMethodsWithRoyalMail (value) {
      if (value.length!==0) {
        this.dateSelected()
        this.sendDataToCheckout()
      }
    },
    returnShippingMethod (value) {
      let selectedMethod=null
      this.$bus.$on('delivery-method',data => {
        this.selectedDeliveryMethod=data
      })
    }
  },
  destroyed () {
    this.radioCheckedFlag=false
  },
  validations: {
    shipping: {
      firstName: {
        required,
        minLength: minLength(2),
        unicodeAlpha
      },
      lastName: {
        required,
        unicodeAlpha
      },
      country: {
        required
      },
      streetAddress: {
        required,
        unicodeAlphaNum
      },
      shippingMethod: {
        required
      },
      zipCode: {
        required,
        minLength: minLength(3),
        unicodeAlphaNum
      },
      city: {
        required,
        unicodeAlpha
      },
      phoneNumber: {
        required,
        maxLength: maxLength(11)
      },
      mobile: {
        maxLength: maxLength(11)
      },
      newsLetter: {
        maxLength: maxLength(11)
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.shiping-edit {
  float: right;
}
.billing-details-cart {
  background: #fff;
  padding-top: 20px;
  padding-bottom: 15px;
  position: relative;
  border-bottom: 1px solid #bdbdbd;
  border-left: 1px solid #bdbdbd;
  border-right: 1px solid #bdbdbd;
  border-top: 1px solid #bdbdbd;
  margin-top: 38px;

  h3 {
    color: #3a3e3d;
    font-size: 22px;
    width: 100%;
    font-weight: 600;
    font-family: oblik;
    margin: 0px 0 25px 0;
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

  .date-span {
    color: #ffffff;
  }

  label {
    color: #676767;
    font-size: 16px;
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

  .checkmark {
    &:after {
      background: #00998c !important;
    }
  }

  button {
    background-color: red;
    border-radius: 5px;
    font-size: 15px;
    font-weight: 600;
    margin-left: 5px;
    padding: 15px;

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

      color: #676767;
      font-size: 15px;
    }
  }

  .editdate {
    padding-left: 16px;
    padding-top: 40px;

    span {
      opacity: 1;
      color: #ed0f8b;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      text-align: left;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
input.empty {
  background-color: #faebe7 !important;
}
input:focus {
  background-color: #edf7fd !important;
}

.delivery-method {
  display: flex;
}

.shipping-first-name {
  display: none;
}

.shipping-last-name {
  display: none;
}

.crafty-postcodelookup input.postalcode-lookup {
  border: 0px;
  padding: 0 10px;
  border-bottom: 1px solid;
  border-color: #bdbdbd;
  float: left;
  border: 1px solid #bdbdbd;
  border-radius: 3px;
  margin-top: 19px;
  width: 100px;
}

.crafty-postcodelookup {
  padding: 0px 10px 5px 10px;
  position: relative;
  width: 100%;
  margin-bottom: 0px;
}

.crafty-postcodelookup input.postalcode-lookup:focus {
  outline: none;
}

div#crafty_postcode_result_display_1 {
  width: 100%;
  padding: 0px 0px 10px 0px;
  margin-top: 15px;
  display: none;
}

.delivery-msg-date {
  font-family: Arial, Helvetica, sans-serif;
  text-align: left;
  display: block;
  padding-bottom: 30px;
  color: #eb008b;
  font-size: 16px;
  font-weight: 500;
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

.detail-checkbox {
  position: relative;

  input {
    margin-left: 9px !important;
    height: auto !important;
  }

  label {
    position: relative !important;
    float: none !important;
    top: 0px !important;
    color: #54575b !important;
    font-weight: 400 !important;
  }
}

.cal-checkbox {
  position: relative;
  margin-bottom: 25px;

  input {
    margin-left: 9px !important;
    height: auto !important;
    border-radius: 0px;
    border-radius: 0px;
    position: relative !important;
    opacity: 1 !important;
    width: auto !important;
    transform: scale(2);
  }

  label {
    position: relative !important;
    float: none !important;
    top: 0px !important;
    color: #5c5c5c !important;
    font-weight: 700 !important;
    font-family: Arial, Helvetica, sans-serif;
    margin-left: 10px;
    font-size: 14px;
  }
}

.delivery-methods-detail {
  .delivery-method-boxes {
    background: #fff;
    padding-top: 20px;
    padding-bottom: 15px;
    margin-bottom: 20px;
    border: 1px solid #bdbdbd;
    display: none;

    h3 {
      color: #3a3e3d;
      font-size: 22px;
      width: 100%;
      font-weight: 600;
      font-family: oblik;
      margin: 0px 0 25px 0;
    }
  }
}

.home-delivery-box {
  background: #fff;
  padding-top: 20px;
  border: 1px solid #bdbdbd;

  h3 {
    color: #3a3e3d;
    font-size: 22px;
    width: 100%;
    font-weight: 600;
    margin-top: 10px;
    font-family: oblik;
  }

  .cal-txt {
    border-top: 1px solid #bdbdbd;
    border-bottom: 1px solid #bdbdbd;

    p {
      color: #ed008c;
      font-weight: 600;
      font-size: 15px;
    }
  }
  .OutOfstockItem {
    padding-left: 30px;
    padding-top: 17px;
    span {
      color: #ed008c;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 15.66px;
      font-weight: bold;
    }
    p {
      color: #484647;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 15.66px;
      font-weight: normal;
      margin-top: 13px;
    }
    @media (max-width: 767px) {
      padding-left: 16px;
      padding-top: 9px;
      span {
        font-size: 12px;
      }
      p {
        padding-left: 0 !important;
      }
    }
  }
  .cl-error {
    font-size: 12px;
    margin-top: 0px;
    position: relative;
    top: -10px;
  }

  .calendar {
    width: 100%;
    border: none;
    margin-top: 20px;
    z-index: 0;

    .vc-title {
      font-size: 16px !important;
    }
  }
}

.delivery-btn {
  border-top: 1px solid #bdbdbd;

  button {
    background: #57c9c0;
    color: #fff;
    padding: 15px;
    display: block;
    text-align: center;
    font-weight: 600;
    border-radius: 4px;
  }

  .newdateSelected {
    background: #1d1b4a;
  }

  .editdate {
    margin-top: 43px;
    text-decoration: underline;
    color: #ed008c;
    font-size: 14px;
    cursor: pointer;
  }
}

.billing-details {
  background: #fff;
  padding: 12px 0px 20px 0px;
  position: relative;
  border-bottom: 1px solid #bdbdbd;
  border-left: 1px solid #bdbdbd;
  border-right: 1px solid #bdbdbd;

  h3 {
    color: #676767;
    font-size: 22px;
    width: 100%;
    padding-bottom: 10px;
    font-weight: 600;
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

  .date-span {
    color: #ffffff;
  }

  label {
    color: #676767;
    font-size: 16px;
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

  .checkmark {
    &:after {
      background: #00998c !important;
    }
  }

  button {
    background-color: #071a44;
    border-radius: 5px;
    font-size: 15px;
    font-weight: 600;
    margin-left: 5px;
    padding: 15px;

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

      color: #676767;
      font-size: 15px;
    }
  }

  .editdate {
    padding-left: 16px;
    padding-top: 40px;

    span {
      opacity: 1;
      color: #ed0f8b;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      text-align: left;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}

.selected-collection-time {
  .selected-collection-time-inner {
    height: auto;
    overflow-y: auto;
  }
  .selected-collection-time-inner::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
    border-radius: 5px;
  }
  .selected-collection-time-inner::-webkit-scrollbar {
    width: 5px;
    background-color: #f5f5f5;
    border-radius: 5px;
  }
  .selected-collection-time-inner::-webkit-scrollbar-thumb {
    background-color: #676566;
    border-radius: 5px;
  }
  h3 {
    color: #3a3e3d;
    font-size: 16px;
    width: 100%;
    font-weight: 600;
    margin-top: 10px;
    font-family: Arial, Helvetica, sans-serif;
  }

  .label {
    display: block;
    position: relative;
    cursor: pointer;
    font-size: 16px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-weight: 500;
    padding: 15px 20px 15px 60px;
    border: 1px solid #bdbdbd;
    margin: 0px 0px 10px 0px;
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  .checkmarkbox {
    position: absolute;
    top: 17px !important;
    left: 20px !important;
    height: 18px !important;
    width: 18px !important;
    border-radius: 50%;
    border: 1px solid #ed008c !important;
    margin-left: 0px !important;
  }

  input:checked ~ .checkmarkbox {
    background-color: transparent;
  }

  .checkmarkbox:after {
    content: "";
    position: absolute;
    display: none;
  }

  input:checked ~ .checkmarkbox:after {
    display: block;
  }

  .checkmarkbox:after {
    content: "" !important;
    position: absolute;
    display: none;
    top: 3.5px !important;
    left: 3.82px !important;
    width: 10px !important;
    height: 10px !important;
    border-radius: 50% !important;
    background: #ed008c !important;
    border: none !important;
    border-width: none !important;
  }
}

.instruction {
  margin-top: 20px;
  h3 {
    color: #3a3e3d;
    font-size: 16px;
    width: 100%;
    font-weight: 600;
    margin-top: 0px;
    font-family: Arial, Helvetica, sans-serif;
  }
  textarea {
    width: 93%;
    height: 26px;
    border-radius: 0px;
    padding: 10px;
    border: 1px solid #bdbdbd;
    outline: none;
    resize: none;
    color: #9b9b9b;
    font-size: 14px;
  }
}

@media (min-width: 991px) and (max-width: 1200px) {
  .cal-checkbox label {
    font-size: 11px;
  }
}

@media (min-width: 320px) and (max-width: 767px) {
  .billing-details button {
    margin-left: 0;
    width: 29%;
    display: inline-block;
    margin-top: 0px;
    border-radius: 3px;
    font-size: 12px;
    padding-right: 0;
    padding-left: 0;
    margin-left: 16px;
    margin-top: 17px;
    padding: 12px 0px;
    height: 48px;
  }
  button#shippingSubmitBtnId {
    font-size: 17px;
  }
  .crafty-postcodelookup {
    padding: 0px 0px 5px 8px;
  }
  .crafty-postcodelookup input.postalcode-lookup {
    width: 100%;
    display: block;
    padding-left: 10px;
    padding-right: 10px;
    margin-left: 0px;
    margin-bottom: 10px;
    border-radius: 0px;
    width: 45%;
    line-height: 1;
  }
  div#crafty_postcode_result_display_1 {
    margin-top: -22px;
    padding: 0px 8px 10px 8px;
  }
  .home-delivery-box .cal-txt {
    border: none;
  }
  .delivery-methods-detail {
    .delivery-method-boxes {
      padding-right: 20px;
      padding-left: 20px;
    }
    h3 {
      color: #2a275c !important;
      font-size: 20.44px !important;
    }
  }
  .home-delivery-box h3 {
    padding-right: 15px;
    padding-left: 15px;
  }
  .home-delivery-box .cal-txt p {
    padding-right: 15px;
    padding-left: 15px;
    font-size: 12px;
  }

  .delivery-btn .pl40,
  .delivery-btn .pr30 {
    padding-right: 25px;
    padding-left: 25px;
  }
  .selected-collection-time h3 {
    padding: 0px !important;
    font-size: 16px !important;
    text-align: left;
    margin-bottom: 10px;
    color: #3a3e3d !important;
  }
  .instruction h3 {
    padding: 0px !important;
    font-size: 16px !important;
    text-align: left;
    margin-bottom: 10px;
    color: #3a3e3d !important;
  }
  .cal-checkbox label {
    font-size: 12px;
  }
  .not.deliver {
    margin: 30px 15px 30px 15px !important;
  }
  .not-delivery {
    // padding-left: 15px !important;
  }
  .mb8.cl-error {
    margin-left: 5px;
  }
}

/*Phone NUmber Text box */
p.phone-text {
  margin: 0;
}

.billing-details {
  .street-name.company-input {
    margin-top: 50px;
  }

  input {
    border: 1px solid #bdbdbd;
    border-radius: 3px;
    padding: 0px 10px;
    color: #9b9b9b;
    font-size: 14px;
    margin-left: -65px;
    height: 48px;
  }

  label {
    top: -9px;
    color: #3a3e3d;
    float: left;
    position: relative;
    font-size: 14px;
    font-weight: 600;
  }

  .req-label label:after {
    content: "*";
    color: #ef0b0b;
    position: absolute;
    right: -10px;
    bottom: 3px;
  }

  .second-address {
    margin-top: -9px;
  }
}

/*Phone NUmber Text box */
span.checkmark.black-border-checkmark.no-checked:after {
  display: none !important;
}

.selected-collection-time.hide {
  display: none;
}
.col-md-6.col-xs-12.pl30.pr30.instruction h3 {
  color: #3a3e3d;
  font-size: 22px;
  width: 100%;
  font-weight: 600;
  margin-top: 10px;
  font-family: oblik;
}
.NOone-req-label {
  padding: 0px 0px 0px 0px;
}
.NOone-req-label:after {
  display: none;
}
.row.singleDateRowData {
  margin: 0 0 0 0 !important;
}

.instruction.two h3 {
  color: #3a3e3d;
  font-size: 14px !important;
  width: 100%;
  font-weight: 400 !important;
  margin-top: 28px !important;
  font-family: oblik;
}

#checkout
  .delivery-methods-detail
  input:checked
  ~ span.checkmark.black-border-checkmark.shippingMethodAll {
  border: 1px solid #eb008b !important;
  height: 19px;
  width: 19px;
  top: 5px;
  left: 0 !important;
  margin-left: 0;
  padding: 0 !important;
}

#checkout .delivery-methods-detail .radioStyled span {
  /* padding-left: 30px; */
      margin-left: 30px;
}

#checkout
  .delivery-methods-detail
  input:checked
  ~ .checkmark.shippingMethodAll:after {
  top: 3.5px !important;
  left: 4.82px !important;
  width: 10px !important;
  height: 10px !important;
  border-radius: 50% !important;
  background: #eb008b !important;
  margin: 0 !important;
  border: #eb008b;
}

#checkout
  .delivery-methods-detail
  input:checked
  ~ .checkmark.shippingMethodAll.allunchecked:after {
  display: none !important;
}
@media (min-width: 320px) and (max-width: 480px) {
  #checkout .delivery-methods-detail .radioStyled span[data-v-0267c926] {
    padding-left: 0px;
  }
}
</style>
<style lang="scss">
// .shippingAddressSummary {
//   .paypalPhone {
//     input {
//       border: 1px solid;
//     }
//   }
// }
.billing-details-cart {
  .mobile-text {
    .shipping-phone-number {
      padding-top: 18px;
      padding-left: 0;
      input {
        border: 1px solid #bdbdbd;
        border-radius: 3px;
        padding: 0px 10px;
        color: #9b9b9b;
        font-size: 14px;
        height: 48px;
        line-height: 1;
      }
      label {
        top: -19px;
        color: #3a3e3d;
        font-weight: 600;
        font-size: 14px;
        &::after {
          content: "*";
          color: #ef0b0b;
          position: absolute;
          right: -10px;
          bottom: 3px;
        }
      }

      input:focus ~ label[data-v-4a2c8848],
      input:not(.empty) ~ label {
        top: -19px;
      }
    }
  }
}
.shippingAddressSummary .paypalPhone input {
  border: 1px solid;
}
.line.relative .billing-details .second-address input {
  background-color: #edf7fd !important;
}
.selected-collection-time .label {
  height: 25px;
}
.selected-collection-time .label .timeClass {
  float: left;
  margin-top: 4px;
}
.selected-collection-time .label .dateClass {
  float: right;
  margin-top: 4px;
}
.postcode-select select {
  width: 98% !important;
  background-color: transparent;
  border-radius: 5px;
  margin-bottom: 10px;
  color: #676767;
  font-size: 15px;
  padding-left: 5px;
  border: 1px solid #bdbdbd;
  margin-left: 10px;
  height: 48px;
}

.postcode-select p {
  font-style: italic;
  margin: -5px 0px 0px 10px;
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
  padding-top: 15px;
  padding-bottom: 15px;
  width: 100%;
}

.calendar {
  border-radius: 0;
  margin-bottom: 12px;
  width: 100%;
  border: none;
  margin-top: 20px;

  .vc-title {
    font-size: 16px !important;
  }

  .vc-weekday {
    color: #9b9b9b;
  }

  .vc-day-content {
    border-radius: 0px;
  }

  .vc-highlights {
    background: #57c9c0;

    .vc-day-layer {
      border: none;
    }

    .vc-highlight {
      background: transparent;
      border-radius: 0px;

      &:hover {
        background: transparent;
      }
    }

    &:hover {
      background: #ed008c;
    }
  }

  .vc-day-content:focus {
    background-color: transparent !important;
  }

  .vc-day-content:hover {
    background-color: transparent !important;
  }

  .vc-day-box-center-center {
    border: 1px solid #dddddd;
    padding: 5px;
  }

  .vc-grid-cell-col-1 {
    .vc-day-box-center-center {
      border-right: 1px solid transparent;
      border-bottom: 1px solid transparent;
    }
  }

  .vc-grid-cell-col-7 {
    .vc-day-box-center-center {
      border-right: 1px solid #dddddd;
    }
  }

  .vc-grid-cell-row-7 {
    .vc-day-box-center-center {
      border-bottom: 1px solid #dddddd;
    }
  }
}

@media (min-width: 320px) and (max-width: 767px) {
   .free-des {
    margin: 30px 15px 30px 15px !important;
  }
  .shiping-edit {
    float: right;
    padding: 15px;
  }
  .shipping-edit1 {
    padding: 15px;
  }
  .mobile-text {
    margin-top: -29px;
  }
  .calendar-ineer-main {
    border-left: 0;
    margin-left: 0;
    padding-left: 0;
    margin-top: 10px;
  }
  .billing-details {
    padding: 0px 0px 20px 0px !important;
  }
  .billing-details label {
    top: 7px !important;
  }
  .postcode-select p {
    font-style: italic;
    margin: 5px 0 0 0px;
    font-size: 12px;
  }
  .delivery-btn .pr30 {
    padding-right: 40px;
  }
  .delivery-btn .editdate {
    margin-top: -15px !important;
    margin-bottom: 20px;
    text-align: left;
    display: block;
    margin-left: 20px;
  }
  /* div#crafty_postcode_result_display_1 {
    margin-top: 65px !important;
  } */
  .postcode-select select {
    margin-bottom: 0;
    margin-top: 20px;
    border-radius: 0px;
    margin-left: auto;
    width: 100% !important;
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
  .vc-day-box-center-center {
    padding: 0px !important;
  }
  .billing-details .crafty-postcodelookup label {
    width: 100%;
  }
  .billing-details .crafty-postcodelookup label:after {
    left: 68px;
  }
  .billing-details input {
    border-radius: 0px !important;
  }
  .billing-details .base-input {
    min-height: auto;
  }
  .billing-details .pl30,
  .billing-details .pr30 {
    padding-right: 15px;
    padding-left: 15px;
  }
  .billing-details .street-name.company-input {
    margin-top: 7px !important;
  }
  .billing-details .street-name.company-input label {
    top: -8px !important;
  }
  .billing-details select {
    border-radius: 0px !important;
  }
  .billing-details .country-req-label label {
    top: -25px !important;
  }
  .billing-details .street-name label,
  .billing-details .shipping-phone-number label,
  .billing-details .city-label label,
  .billing-details .mobile-number label {
    top: -12px !important;
  }
  .billing-details .second-address {
    margin-top: -15px !important;
  }
  .detail-checkbox {
    display: none;
  }
  .calendar-area {
    padding-right: 15px;
    padding-left: 15px;
  }
  .calendar-area .calendar-box {
    padding-right: 0px;
    padding-left: 0px;
  }
label.radioStyled.pre-del span{
    margin-left: 50px !important;
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

@media (min-width: 991px) and (max-width: 1200px) {
  .vc-day-box-center-center {
    padding: 3px !important;
  }
  .selected-collection-time .label[data-v-8fa66812] {
    font-size: 12px;
  }
  .selected-collection-time .label .timeClass {
    font-size: 12px;
  }
  .selected-collection-time .label .dateClass {
    font-size: 12px;
  }
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

.vc-arrows-container {
  z-index: 1 !important;
}

.customselectedclass:after {
  display: block !important;
}

.hideDelSection {
  display: none;
}
#checkout .radioStyled {
  display: block;
  position: relative;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 16px;
  line-height: 30px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
label.radioStyled.pre-del {
  color: #333333 !important;
}
button#shippingSubmitBtnId {
  width: auto;
}
p.free-del-p {
  border: 1px solid #858585;
  background: #f2f2f2;
  margin-right: 10px;
  padding: 40px 15px 40px 15px;
  line-height: 30px;
  border-radius: 5px;
    width: 100%;
    max-width: 230px;
}
span.free-del {
  padding-left: 40px;
  @media (min-width: 480px) and (max-width: 767px) {
    padding-left: 45px;
  }
  @media (min-width: 320px) and (max-width: 479px) {
    padding-left: 22px !important;
  }
}
span.delivery-date {
  padding-left: 50px;
  @media (min-width: 480px) and (max-width: 767px) {
    padding-left: 35px;
  }
  @media (min-width: 320px) and (max-width: 479px) {
    padding-left: 15px !important;
  }
}
.free-des {
  border: 1px solid #858585;
  background: #f2f2f2;
  margin: 30px;
  padding: 15px 15px 30px 15px;
  line-height: 20px;
  border-radius: 5px;
}
.free-des span {
  color: #333333;
}
.not.deliver {
  border: 1px solid #858585;
  background: #f2f2f2;
  margin: 30px;
  padding: 30px 15px 30px 15px;
  line-height: 25px;
  border-radius: 5px;
}
.home-delivery-box button {
  background: #57c9c0;
  color: #fff;
  padding: 15px;
  display: block;
  text-align: center;
  font-weight: 600;
  border-radius: 4px;
  margin-bottom: 20px;
  margin-top: 20px;
}
.not-delivery {
  border-top: 1px solid #bdbdbd;
  // margin-top: 35px;
  // padding-left: 30px;
}
.button-extra {
  display: none;
}
.mb8.cl-error {
  display: none;
}
@media (min-width: 480px) {
  .home-delivery-box {
    padding: 0 30px 0 30px;
  }
}
@media (max-width: 479px) {
  .home-delivery-box {
    padding: 0 15px 0 15px;
  }
}
@media (min-width: 768px){
.calendar-box {
    display: flex;
    justify-content: space-between;
}
}
</style>
