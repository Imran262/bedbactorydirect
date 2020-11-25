<template>
  <div id="product" itemscope itemtype="http://schema.org/Product">
    <section class="product-top-section">
      <template v-if="reviewData">
        <div v-for="(review, count) in reviewData.reviews" :key="count">
          <div
            class
            itemprop="review"
            itemscope
            itemtype="http://schema.org/Review"
          >
            <meta itemprop="reviewBody" :content="review.content" />
            <meta itemprop="datePublished" :content="review.created_at" />
            <div
              class
              itemprop="reviewRating"
              itemscope
              itemtype="http://schema.org/Rating"
            >
              <meta itemprop="ratingValue" :content="review.score" />
            </div>
            <div
              class
              itemprop="author"
              itemscope
              itemtype="http://schema.org/Person"
            >
              <meta itemprop="name" :content="review.user.display_name" />
            </div>
          </div>
        </div>
        <div
          class
          itemprop="aggregateRating"
          itemscope
          itemtype="http://schema.org/AggregateRating"
        >
          <meta
            itemprop="ratingValue"
            :content="reviewData.bottomline.average_score"
          />
          <meta
            itemprop="ratingCount"
            :content="reviewData.bottomline.total_review"
          />
        </div>
      </template>
      <UspBar />
      <div class="container">
        <breadcrumbs class="pt40 pb20 hidden-xs" />

        <section class="row m0 between-xs product-detail-inner">
          <div class="col-xs-12 col-md-6 center-xs middle-xs image">
            <div v-if="getProductGallery.length === 0" class="onlyPlaceholder">
              <div class="product-cover bg-cl-secondary">
                <img src="/assets/placeholder.svg" />
              </div>
            </div>
            <div
              v-else-if="getProductGallery.length >= 1"
              class="bt-product-gallery"
            >
              <meta itemprop="image" :content="getProductGallery[0].src" />
              <product-gallery
                ref="getProductGallery"
                :offline="getOfflineImage"
                :gallery="getProductGallery"
                :configuration="getCurrentProductConfiguration"
                :product="getCurrentProduct"
                @page-change="(page) => (currentGalleryPage = page)"
              />
              <no-ssr>
                <carousel
                  class="prod-gallery-thumbnails-carousel"
                  v-if="getProductGallery.length > 1"
                  :per-page-custom="[
                    [480, 0],
                    [768, 2],
                    [1000, 3],
                    [1200, 4],
                  ]"
                  :navigation-enabled="true"
                  :pagination-enabled="false"
                  navigation-next-label="<i class='material-icons p15  pointer'>keyboard_arrow_right</i>"
                  navigation-prev-label="<i class='material-icons p15  pointer'>keyboard_arrow_left</i>"
                >
                  <slide
                    v-for="(images, key) in getProductGallery"
                    :key="images.src"
                    class="mb-1 bg-grey-lighter"
                  >
                    <img
                      :src="images.src"
                      ref="images"
                      @click="
                        $refs.getProductGallery.$refs.carousel.navigate(key)
                      "
                      :alt="getCurrentProduct.name"
                      class="block border cursor-pointer"
                      :class="
                        currentGalleryPage === key
                          ? 'border-green'
                          : 'border-grey-light'
                      "
                    />
                  </slide>
                </carousel>
              </no-ssr>
            </div>
          </div>
          <div class="col-xs-12 col-md-6 data bt-product-details">
            <h1
              class="mb20 mt0 cl-mine-shaft product-name"
              data-testid="productName"
              itemprop="name"
            >
              {{ getCurrentProduct.name.toLowerCase() | htmlDecode }}
              <web-share
                :title="getCurrentProduct.name | htmlDecode"
                text="Check this product!"
                class="web-share"
              />
            </h1>
            <div class="rating-top" @click="ProReviewShowFn">
              <a href="#uniqueReviews">
                <ReviewStars
                  :reviews="getReviews()"
                  :product="getCurrentProduct"
                />
              </a>
            </div>
            <div
              class="mb20 uppercase cl-secondary b-t-prod-sku"
              itemprop="sku"
              :content="getCurrentProduct.sku"
            >
              SKU:
              <!-- {{ $t("SKU: {sku}", { sku: getCurrentProduct.sku }) }}  -->
              {{ getCurrentProduct.sku }}
            </div>
            <div
              class="mb20 uppercase cl-secondary outofstock"
              v-if="!getCurrentProduct.stock.qty"
            >
              Out of Stock
            </div>
            <div
              class="mb20 uppercase cl-secondary inStock"
              v-if="getCurrentProduct.stock.qty"
            >
              In Stock
            </div>
            <div class="mb20 cl-secondary" v-if="!getCurrentProduct.stock.qty">
              <small>
                If you are happy to wait, continue with the order and our team
                will contact you when the item is in stock.
              </small>
            </div>
            <div itemprop="offers" itemscope itemtype="http://schema.org/Offer">
              <meta
                itemprop="priceCurrency"
                :content="$store.state.storeView.i18n.currencyCode"
              />
              <meta
                itemprop="price"
                :content="
                  parseFloat(getCurrentProduct.price_incl_tax).toFixed(2)
                "
              />
              <meta
                itemprop="availability"
                :content="structuredData.availability"
              />

              <meta
                itemprop="url"
                :content="urlProduct + getCurrentProduct.url_path"
              />
              <meta itemprop="priceValidUntil" content />
              <div
                class="price serif bt-price-main"
                v-if="getCurrentProduct.type_id !== 'grouped'"
              >
                <div
                  v-if="
                    getCurrentProduct.price_incl_tax &&
                    getCurrentProduct.original_price_incl_tax
                  "
                >
                  <!-- deltaproduct {{ productCurrentCustomOptions }} -->
                  <!-- {{productCurrentCustomOptions}}
                  <br /><br /><br />{{getCurrentCustomOptions}}
                  <br />
                  <br />
                  <br /> -->
                  {{productCurrentCustomOptions}}
                  <product-price
                    v-if="getCurrentProduct.type_id !== 'grouped'"
                    :product="getCurrentProduct"
                    :custom-options="productCurrentCustomOptions"
                    v-on:calculatedPrice="setPrice($event)"
                  />
                </div>
              </div>
              <div
                class="cl-primary variants"
                v-if="getCurrentProduct.type_id == 'configurable'"
              >
                <div
                  class="error"
                  v-if="
                    getCurrentProduct.errors &&
                    Object.keys(getCurrentProduct.errors).length > 0
                  "
                >
                  {{ getCurrentProduct.errors | formatProductMessages }}
                </div>
                <div
                  class="h5"
                  v-for="option in getProductOptions"
                  :key="option.id"
                >
                  <h4
                    class="variants-label basin-head"
                    data-testid="variantsLabel"
                  >
                    {{ option.label }}
                    <!-- <span class="weight-700">{{ getOptionLabel(option) }}</span> -->
                  </h4>
                  <div class="row top-xs m0 pt15 pb40 variants-wrapper">
                    <div
                      class="sizes basin_size"
                      v-if="option.label == 'Color'"
                    >
                      <select @change="changeFilterCustom($event)">
                        <option :value="null" :key="2378695843" selected>
                          Please select
                        </option>
                        <template
                          v-for="filter in getAvailableFilters[
                            option.attribute_code
                          ]"
                        >
                          <option
                            :key="filter.id"
                            :value="JSON.stringify(filter)"
                          >
                            {{ filter.label }}
                          </option>
                        </template>
                      </select>
                      <!-- <color-selector
                        v-for="filter in getAvailableFilters[option.attribute_code]"
                        :key="filter.id"
                        :variant="filter"
                        :selected-filters="getSelectedFilters"
                        @change="changeFilter"
                      />-->
                    </div>
                    <div
                      class="sizes basin_size"
                      v-else-if="option.label == 'Size'"
                    >
                      <select @change="changeFilterCustom($event)">
                        <option :value="null" :key="2378695843" selected>
                          Please select
                        </option>
                        <template
                          v-for="filter in getAvailableFilters[
                            option.attribute_code
                          ]"
                        >
                          <option
                            :key="filter.id"
                            :value="JSON.stringify(filter)"
                          >
                            {{ filter.label }}
                          </option>
                        </template>
                      </select>
                      <!-- <size-selector
                        class="mr10 mb10"
                        v-for="filter in getAvailableFilters[option.attribute_code]"
                        :key="filter.id"
                        :variant="filter"
                        :selected-filters="getSelectedFilters"
                        @change="changeFilter"
                      />-->
                    </div>

                    <div
                      class="basin_size"
                      :class="option.attribute_code"
                      v-else
                    >
                      <select @change="changeFilterCustom($event)">
                        <option :value="null" :key="2378695843" selected>
                          Please select
                        </option>
                        <template
                          v-for="filter in getAvailableFilters[
                            option.attribute_code
                          ]"
                        >
                          <option
                            :key="filter.id"
                            :value="JSON.stringify(filter)"
                          >
                            {{ filter.label }}
                          </option>
                        </template>
                      </select>
                      <!-- <generic-selector
                        class="mr10 mb10"
                        v-for="filter in getAvailableFilters[option.attribute_code]"
                        :key="filter.id"
                        :variant="filter"
                        :selected-filters="getSelectedFilters"
                        @change="changeFilter"
                      />-->
                    </div>
                    <!-- <span
                      v-if="option.label == 'Size'"
                      @click="openSizeGuide"
                      class="p0 ml30 inline-flex middle-xs no-underline h5 action size-guide pointer cl-secondary"
                    >
                      <i class="pr5 material-icons">accessibility</i>
                      <span>{{ $t('Size guide') }}</span>
                    </span>-->
                  </div>
                </div>
              </div>
            </div>

            <meta itemprop="url" :content="structuredData.contentUrl" />

            <meta itemprop="aggregateRating" content />
            <meta itemprop="brand" content="`bedfactorydirect`" />
            <meta
              v-if="
                getCurrentProduct.description ||
                getCurrentProduct.short_description
              "
              itemprop="description"
              :content="
                getCurrentProduct.description ||
                getCurrentProduct.short_description.replace(/(<([^>]+)>)/gi, '')
              "
            />
            <meta v-else itemprop="description" :content="' '" />

            <meta itemprop="image" :content="structuredData.imageUrl" />

            <meta itemprop="gtin8" :content="getCurrentProduct.sku" />
            <product-links
              v-if="getCurrentProduct.type_id == 'grouped'"
              :products="getCurrentProduct.product_links"
            />
            <!-- {{getCurrentProduct}} -->
            <!-- Value OF is FABRIC {{getCurrentProduct.isFabric}} -->
            <!-- In parent product is {{$store.state.product.current.name}} -->
            <product-bundle-options
              v-if="
                getCurrentProduct.bundle_options &&
                getCurrentProduct.bundle_options.length > 0
              "
              :product="getCurrentProduct"
            />
            <!-- <product-custom-options
              v-else-if="
                getCurrentProduct.custom_options &&
                getCurrentProduct.custom_options.length > 0
              "
              :currProduct="getCurrentProduct"
              :product="getCurrentProduct"
              @option-added="addCustomOption($event)"
              :color="false"
            /> -->
            <!-- Here {{getCurrentProduct.custom_options && getCurrentProduct.custom_options.length > 0}} -->
            <product-custom-options
              v-if="
                getCurrentProduct.custom_options &&
                getCurrentProduct.custom_options.length > 0
              "
              :currProduct="getCurrentProduct.sku"
              :product="getCurrentProduct"
              @option-added="addCustomOption($event)"
              :color="false"
            />
            <div
              v-if="
                getCurrentProduct.custom_options &&
                getCurrentProduct.custom_options.length > 0
              "
            >
              <div
                v-if="
                  getCurrentProduct.isFabric !== 0 &&
                  getCurrentProduct.isFabric !== '0' &&
                  getCurrentProduct.isFabric !== ' ' &&
                  getCurrentProduct.isFabric !== false
                "
              >
                <button
                  class="select-color-button"
                  type="button"
                  @click="showColorPicker"
                >
                  {{ getColorName() }}
                  <i
                    class="material-icons p15 cl-bg-tertiary pointer select-color-icon"
                    >keyboard_arrow_right</i
                  >
                </button>
                <div
                  id="overlay"
                  @click="hideColorPicker"
                  v-if="colorPickerCheck"
                />
                <!-- {{getCurrentProduct.custom_options[2]}} -->
                <color-picker
                  :colors="getCurrentProduct"
                  v-show="colorPickerCheck"
                  @closeColorPickerModal="hideColorPicker"
                  @selectedColor="setColorName($event)"
                />
              </div>
            </div>
            <div class="product-qty-and-add-to-cart">
              <product-quantity
                class="product-quantity bt-product-qty row m0 mb35"
                v-if="
                  getCurrentProduct.type_id !== 'grouped' &&
                  getCurrentProduct.type_id !== 'bundle'
                "
                v-model="getCurrentProduct.qty"
                :max-quantity="maxQuantity"
                input-type="text"
                :loading="isStockInfoLoading"
                :is-simple-or-configurable="isSimpleOrConfigurable"
                show-quantity
                @error="handleQuantityError"
              />
              <div class="row m0 bt-product-addtocartbtn">
                <add-to-cart
                  :product-options="sendProductCustomOptions"
                  :product="getCurrentProduct"
                  :custom-options="productCurrentCustomOptions"
                  class="col-xs-12 col-sm-4 col-md-6"
                  :product-calculated-price="calculatedProductPrice"
                />
              </div>
            </div>

            <!-- <div class="row py40 add-to-buttons">
              <div class="col-xs-6 col-sm-3 col-md-6">
                <AddToWishlist :product="getCurrentProduct" />
              </div>
              <div class="col-xs-6 col-sm-3 col-md-6">
                <AddToCompare :product="getCurrentProduct" />
              </div>
            </div>-->
          </div>
        </section>
      </div>
    </section>
    <!-- <section class="container pt50 pb35 cl-accent details">
      <h2 class="h3 m0 mb10 serif lh20 details-title">{{ $t('Product details') }}</h2>
      <div class="h4 details-wrapper" :class="{'details-wrapper--open': detailsOpen}">
        <div class="row between-md m0">
          <div class="col-xs-12 col-sm-6">
            <div class="lh30 h5" itemprop="description" v-html="getCurrentProduct.description" />
          </div>
          <div class="col-xs-12 col-sm-5">
            <ul class="attributes p0 pt5 m0">
              <product-attribute
                :key="attr.attribute_code"
                v-for="attr in getCustomAttributes"
                :product="getCurrentProduct"
                :attribute="attr"
                empty-placeholder="N/A"
              />
            </ul>
          </div>
          <div class="details-overlay" @click="showDetails" />
        </div>
      </div>
    </section>-->
    <!-- <lazy-hydrate when-idle>
      <reviews
        :product-name="getOriginalProduct.name"
        :product-id="getOriginalProduct.id"
        v-show="isOnline"
      />
    </lazy-hydrate>-->

    <section
      class="container pt50 pb35 cl-accent details product-description-main"
    >
      <div class="row">
        <div
          class="col-lg-7 col-md-7 col-sm-12 col-xs-12 product-description-left"
        >
          <h2
            class="h3 m0 mb10 serif lh20 details-dimension"
            @click="ProDimensionShowFn"
          >
            {{ $t("Description") }}
            <i
              data-v-d65c5c7c
              class="material-icons p15 cl-bg-tertiary pointer product-detail-icon icon-rotate"
              id="product-dimension-icon-id"
              >keyboard_arrow_right</i
            >
          </h2>
          <div
            v-if="ProDimensionShow"
            class="h4 dimension-wrapper bt-dimension-wrapper-show-close dimension-wrapper-show"
            :class="{ 'dimension-wrapper--open': detailsOpen }"
          >
            <div class="row between-md m0">
              <div class="col-xs-12 col-sm-12 long-description">
                <!-- <h2 class="m0 serif details-title">{{ $t('Product details') }}</h2> -->
                <div
                  class="h4 details-wrapper"
                  :class="{ 'details-wrapper--open': detailsOpen }"
                >
                  <div class="row between-md m0">
                    <div class="col-xs-12 col-sm-12">
                      <div
                        class="lh30 h5"
                        itemprop="description"
                        v-html="getCurrentProduct.description"
                      />
                    </div>
                    <!-- <div class="col-xs-12 col-sm-5">
                      <ul class="attributes p0 pt5 m0">
                        <product-attribute
                          :key="attr.attribute_code"
                          v-for="attr in getCustomAttributes"
                          :product="getCurrentProduct"
                          :attribute="attr"
                          empty-placeholder="N/A"
                        />
                      </ul>
                    </div>-->
                    <!-- <div class="details-overlay" @click="showDetails" /> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h2
            class="h3 m0 mb10 serif lh20 details-Delivery"
            @click="ProSpecificationsShowFn"
          >
            {{ $t("Specifications") }}
            <i
              data-v-d65c5c7c
              class="material-icons p15 cl-bg-tertiary pointer product-detail-icon"
              id="product-Specifications-icon-id"
              >keyboard_arrow_right</i
            >
          </h2>
          <div
            v-if="ProDeliveryShow"
            class="h4 Delivery-wrapper bt-Specifications-wrapper-show-close"
          >
            <div class="row between-md m0">
              <div class="col-xs-12 col-sm-12">
                <div class="Specifications-main">
                  <div v-html="getCurrentProduct.specs" />
                </div>
              </div>
            </div>
          </div>
          <!-- <reviews
              :product-name="getOriginalProduct.name"
              :product-id="getOriginalProduct.id"
              v-show="isOnline"
          />-->

          <h2
            class="h3 m0 mb10 serif lh20 details-Delivery"
            @click="ProDeliveryShowFn"
          >
            {{ $t("Delivery Information") }}
            <i
              data-v-d65c5c7c
              class="material-icons p15 cl-bg-tertiary pointer product-detail-icon"
              id="product-Delivery-icon-id"
              >keyboard_arrow_right</i
            >
          </h2>
          <div
            v-if="ProDeliveryShow"
            class="h4 Delivery-wrapper bt-Delivery-wrapper-show-close"
          >
            <div class="row between-md m0">
              <div class="col-xs-12 col-sm-12">
                <div class="delivery-main">
                  <!--<img src="/assets/free-delivery-icon.png" />
                  <span>
                    Order before 12pm for
                    <router-link to="/i/deliveryinfo">
                      <span class="purple">next working day delivery</span>
                    </router-link>
                  </span>-->
                  <!-- BLock is {{getCurrentProduct.delivery_cms_block}} block -->
                  <!-- <br /> -->
                  <cms-block
                    :identifier="
                      getCurrentProduct.delivery_cms_block
                        ? getCurrentProduct.delivery_cms_block
                        : 'delivery_Info'
                    "
                  />
                  <!--<router-link to="/i/deliveryinfo">
                    <span class="purple">delivery page</span>
                  </router-link>-->
                </div>
              </div>
            </div>
          </div>
          <h2
            id="uniqueReviews"
            class="h3 m0 mb10 serif lh20 details-need"
            @click="ProReviewShowFn"
          >
            {{ $t("Reviews") }}
            <ReviewStars :reviews="getReviews()" :product="getCurrentProduct" />
            <i
              data-v-d65c5c7c
              class="material-icons p15 cl-bg-tertiary pointer product-detail-icon"
              id="product-review-icon-id"
              >keyboard_arrow_right</i
            >
          </h2>
          <div
            v-if="ProReviewShow"
            class="h4 dimension-wrapper bt-review-wrapper-show-close"
          >
            <div class="row between-md m0">
              <div class="col-xs-12 col-sm-12">
                <ReviewWidget
                  :reviewsList="getReviews()"
                  :product="getCurrentProduct"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-lg-5 col-md-5 col-sm-12 col-xs-12 product-description-right"
        >
          <div
            class="bt-new-description-main"
            v-if="getCurrentProduct.short_description"
          >
            <!-- <ProdReadmore :shortdesc="getCurrentProduct.short_description" /> -->

            <div v-html="getShortDescription" />
          </div>
        </div>
      </div>
    </section>
    <lazy-hydrate when-idle>
      <related-products
        type="upsell"
        :heading="$t('We found other products you might like')"
      />
    </lazy-hydrate>
    <!-- <lazy-hydrate when-idle>
      <promoted-offers single-banner />
    </lazy-hydrate>-->
    <!-- <lazy-hydrate when-idle>
      <related-products type="related" />
    </lazy-hydrate>-->

    <div class="recently-viewed-items-contain container">
      <h4 class="recent-heading">Recently Viewed Items</h4>
      <div class="row">
        <div class="recently-inner-container">
          <no-ssr>
            <RecentlyViewedItems />
          </no-ssr>
        </div>
      </div>
    </div>
    <SizeGuide />
  </div>
</template>

<script>
import i18n from "@vue-storefront/i18n"
import Product from "@vue-storefront/core/pages/Product"
import VueOfflineMixin from "vue-offline/mixin"
import config from "config"
import RelatedProducts from "theme/components/core/blocks/Product/Related.vue"
import Reviews from "theme/components/core/blocks/Reviews/Reviews.vue"
import AddToCart from "theme/components/core/AddToCart.vue"
import GenericSelector from "theme/components/core/GenericSelector"
import ColorSelector from "theme/components/core/ColorSelector.vue"
import SizeSelector from "theme/components/core/SizeSelector.vue"
import Breadcrumbs from "theme/components/core/Breadcrumbs.vue"
import ProductAttribute from "theme/components/core/ProductAttribute.vue"
import ProductQuantity from "theme/components/core/ProductQuantity.vue"
import ProductLinks from "theme/components/core/ProductLinks.vue"
import ProductCustomOptions from "theme/components/core/ProductCustomOptions.vue"
import ProductBundleOptions from "theme/components/core/ProductBundleOptions.vue"
import ProductGallery from "theme/components/core/ProductGallery"
import Spinner from "theme/components/core/Spinner"
import PromotedOffers from "theme/components/theme/blocks/PromotedOffers/PromotedOffers"
import focusClean from "theme/components/theme/directives/focusClean"
import WebShare from "theme/components/theme/WebShare"
import BaseInputNumber from "theme/components/core/blocks/Form/BaseInputNumber"
import SizeGuide from "theme/components/core/blocks/Product/SizeGuide"
import AddToWishlist from "theme/components/core/blocks/Wishlist/AddToWishlist"
import AddToCompare from "theme/components/core/blocks/Compare/AddToCompare"
import { mapGetters } from "vuex"
import LazyHydrate from "vue-lazy-hydration"
import { ProductOption } from "@vue-storefront/core/modules/catalog/components/ProductOption.ts"
import {
  getAvailableFiltersByProduct,
  getSelectedFiltersByProduct,
} from "@vue-storefront/core/modules/catalog/helpers/filters"
import { isOptionAvailableAsync } from "@vue-storefront/core/modules/catalog/helpers/index"
import {
  localizedRoute,
  currentStoreView,
} from "@vue-storefront/core/lib/multistore"
import { htmlDecode } from "@vue-storefront/core/filters"
import { ReviewModule } from "@vue-storefront/core/modules/review"
import { RecentlyViewedModule } from "@vue-storefront/core/modules/recently-viewed"
import {
  registerModule,
  isModuleRegistered,
} from "@vue-storefront/core/lib/modules"
import { onlineHelper, isServer } from "@vue-storefront/core/helpers"
import { catalogHooksExecutors } from "@vue-storefront/core/modules/catalog-next/hooks"
import UspBar from "theme/components/theme/blocks/UspBar/UspBar"
import NoSSR from "vue-no-ssr"
import ProductSimilarListingCarousel from "theme/components/ProductSimilarListingCarousel"
import RecentlyViewedItems from "theme/components/RecentlyViewedItems"
//import DimensionGallery from "theme/components/core/DimensionGallery";
import CmsBlock from "theme/components/core/blocks/Cms/Block"
import ReviewStars from "../../../modules/reviews-module/components/ReviewStars"
import ReviewWidget from "../../../modules/reviews-module/components/ReviewWidget"
import ProductPrice from "theme/components/core/ProductPrice.vue"
import axios from "axios"
import ColorPicker from "theme/components/core/blocks/ColorPIcker/ColorPicker"
export default {
  components: {
    ColorPicker,
    AddToCart,
    AddToCompare,
    AddToWishlist,
    Breadcrumbs,
    ColorSelector,
    GenericSelector,
    ProductAttribute,
    ProductBundleOptions,
    ProductCustomOptions,
    ProductGallery,
    ProductLinks,
    PromotedOffers,
    RelatedProducts,
    Reviews,
    SizeSelector,
    WebShare,
    SizeGuide,
    LazyHydrate,
    RecentlyViewedItems,
    ProductQuantity,
    //DimensionGallery,
    UspBar,
    CmsBlock,
    ReviewStars,
    ReviewWidget,
    ProductSimilarListingCarousel,
    ProductPrice,
    Carousel: () => import("vue-carousel").then((Slider) => Slider.Carousel),
    Slide: () => import("vue-carousel").then((Slider) => Slider.Slide),
    "no-ssr": NoSSR,
  },
  mixins: [ProductOption],
  directives: { focusClean },
  beforeCreate() {
    registerModule(ReviewModule)
    registerModule(RecentlyViewedModule)
  },
  data() {
    return {
      detailsOpen: false,
      maxQuantity: 0,
      quantityError: false,
      isStockInfoLoading: false,
      hasAttributesLoaded: false,
      currentGalleryPage: 0,
      ProDeliveryShow: true,
      ProReviewShow: true,
      ProDimensionShow: true,
      reviewData: null,
      sendProductCustomOptions: [],
      colorPickerCheck: false,
      colorName: "",
      breadcrumbs: [],
      urlProduct:config.baseUrl.url,
      calculatedProductPrice: {},
      productCurrentCustomOptions : {},
      deltaproduct: this.$store.state.product.current_custom_options
    };
  },
  computed: {
    ...mapGetters({
      getCurrentCategory: "category-next/getCurrentCategory",
      getCurrentProduct: "product/getCurrentProduct",
      getProductGallery: "product/getProductGallery",
      getCurrentProductConfiguration: "product/getCurrentProductConfiguration",
      getOriginalProduct: "product/getOriginalProduct",
      getCurrentCustomOptions: "product/getCurrentCustomOptions",
      attributesByCode: "attribute/attributeListByCode",
      getBreadcrumbsCurrent: "breadcrumbs/getBreadcrumbsCurrent",
      getBreadcrumbsRoutes: "breadcrumbs/getBreadcrumbsRoutes",
    }),
    getOptionLabel() {
      return (option) => {
        const configName = option.attribute_code
          ? option.attribute_code
          : option.label.toLowerCase()
        return this.getCurrentProductConfiguration[configName]
          ? this.getCurrentProductConfiguration[configName].label
          : configName
      }
    },
    isOnline(value) {
      return onlineHelper.isOnline
    },
    structuredData() {
      return {
        availability:
          this.getCurrentProduct.stock &&
            this.getCurrentProduct.stock.is_in_stock
            ? "InStock"
            : "OutOfStock",
        contentUrl: this.validateUrl(this.getCurrentProduct.url_path)
          ? this.getCurrentProduct.url_path
          : this.attachBaseUrl(this.getCurrentProduct.url_path),
        imageUrl: this.getImageUrl(this.getCurrentProduct.image),
      }
    },
    getProductOptions() {
      if (
        this.getCurrentProduct.errors &&
        Object.keys(this.getCurrentProduct.errors).length &&
        Object.keys(this.getCurrentProductConfiguration).length
      ) {
        return []
      }
      return this.getCurrentProduct.configurable_options
    },
    getOfflineImage() {
      return {
        src: this.getThumbnail(
          this.getCurrentProduct.image,
          config.products.thumbnails.width,
          config.products.thumbnails.height
        ),
        error: this.getThumbnail(
          this.getCurrentProduct.image,
          config.products.thumbnails.width,
          config.products.thumbnails.height
        ),
        loading: this.getThumbnail(
          this.getCurrentProduct.image,
          config.products.thumbnails.width,
          config.products.thumbnails.height
        ),
      }
    },
    getCustomAttributes() {
      return Object.values(this.attributesByCode)
        .filter((a) => {
          return (
            a.is_visible &&
            a.is_user_defined &&
            (parseInt(a.is_visible_on_front) ||
              a.is_visible_on_front === true) &&
            this.getCurrentProduct[a.attribute_code]
          )
        })
        .sort((a, b) => {
          return a.attribute_id > b.attribute_id
        })
    },
    getAvailableFilters() {
      return getAvailableFiltersByProduct(this.getCurrentProduct)
    },
    getSelectedFilters() {
      return getSelectedFiltersByProduct(
        this.getCurrentProduct,
        this.getCurrentProductConfiguration
      )
    },
    isSimpleOrConfigurable() {
      return ["simple", "configurable"].includes(
        this.getCurrentProduct.type_id
      )
    },
    isAddToCartDisabled() {
      console.log('testingIt', this.quantityError, this.isStockInfoLoading, this.isSimpleOrConfigurable, this.isOnline)
      return (
        this.quantityError ||
        this.isStockInfoLoading ||
        (this.isOnline && this.isSimpleOrConfigurable)
      )
    },
    getShortDescription() {
      const formatShortDesc = this.getCurrentProduct.short_description
      let formatShortDescUlInc = ""
      if (formatShortDesc.includes("<ul") === true) {
        formatShortDescUlInc = formatShortDesc
      } else {
        formatShortDescUlInc = "<ul>" + formatShortDesc + "</ul>"
      }
      return formatShortDescUlInc
    },
  },
  serverPrefetch() {
    // return this.getCurrentProductCustomOptions();
  },
  async mounted() {
    await this.$store.dispatch(
      "recently-viewed/addItem",
      this.getCurrentProduct
    )
    try {
      const URL =
        config.reviews.getReviews_endpoint + this.getCurrentProduct.id
      axios
        .get(URL)
        .then((res) => {
          const response = res
          if (response.status !== 200 && !review.data.length) {
            throw ("Error:", response.data[0].message)
          } else {
            this.reviewData = response.data[1]
          }
        })
        .catch((err) => {
          throw ("Error:", err)
        })
    } catch (err) {
      console.error("error message", err)
    }
    console.log(
        "112266 Route changes",
        this.$route,
        "\nSTATE is \n\n",
        this.$store.state.product
      );
   this.getCurrentProductCustomOptions();
  },
  async asyncData({ store, route }) {
    const product = await store.dispatch("product/loadProduct", {
      parentSku: route.params.parentSku,
      childSku:
        route && route.params && route.params.childSku
          ? route.params.childSku
          : null,
    })
    const loadBreadcrumbsPromise = store.dispatch(
      "product/loadProductBreadcrumbs",
      { product }
    )
    if (isServer) await loadBreadcrumbsPromise
    catalogHooksExecutors.productPageVisited(product)
  },
  beforeRouteEnter(to, from, next) {
    if (isServer) {
      next()
    } else {
      next((vm) => {
        vm.getQuantity()
      })
    }
  },
  watch: {
    isOnline: {
      handler(isOnline) {
        if (isOnline) {
          this.getQuantity()
        }
      },
      
    },
    "$route.name": function () {
      console.log(
        "112277 Route changes",
        this.$route,
        "\nSTATE is \n\n",
        this.$store.state.product
      );

      console.log('routeGotUpdated', this.sendProductCustomOptions,this.productCurrentCustomOptions, this.getCurrentProduct, this.getCurrentCustomOptions)
      console.log('calculatedProductPrice', this.calculatedProductPrice)

        this.checkRoute();
      },
    getCurrentCustomOptions : {
      handler(){
        console.log("112255 state changed");
        this.getCurrentProductCustomOptions()
      }
    }
  },
  methods: {
    checkRoute() {
      console.log(
        "11226677 Route changes",
        this.$route,
        "\nSTATE is \n\n",
        this.$store.state.product
      );
     this.getCurrentProductCustomOptions();
      this.$store.state.product.current_custom_options=this.productCurrentCustomOptions;
      console.log(
        "\n112266 After STATE is \n\n",
        this.$store.state.product
      );
      //  this.$store.dispatch('product/setCustomOptions', { product: this.getCurrentProduct, customOptions: {} });
    },
   getCurrentProductCustomOptions() {
      let cOptions = this.$store.state.product;
      let currentOptions = {};
      let listOptions = [];
      console.log(
        "Current custom Options are ",
        this.getCurrentCustomOptions,
        "\n1122 State is ",
        this.$store.state.product,
        "\n COptions:",
        cOptions,
        typeof this.getCurrentProduct,
        typeof this.getCurrentProduct.custom_options 
      );
      console.log(
        "1122 custom options ",
        this.getCurrentProduct.custom_options
      );
      if (this.getCurrentProduct.custom_options) {
        if (this.getCurrentProduct.custom_options.length > 0) {
          this.getCurrentProduct.custom_options.forEach((option, index) => {
            // console.log("1122 title", option.option_id);
            // console.log(
            //   "1122 title",
            //   cOptions.current_custom_options[option.option_id]
            // );
            let obj2 = {
              [option.option_id]: {
                option_id: option.option_id,
                // option_value:
                //   cOptions.current_custom_options[option.option_id].option_value,
              },
            };
            //  currentOptions.push(obj2);
            // currentOptions[index] = obj2;
            let value = null;
            if (this.$store.state.product.current_custom_options) {
              // console.log("yes this.$store.state.product.current_custom_options");
              if (
                this.$store.state.product.current_custom_options[
                  option.option_id
                ]
              ) {
                // console.log(
                //   "yes current_custom_options",
                //   this.$store.state.product.current_custom_options[
                //     option.option_id
                //   ].option_value
                // );
                value = this.$store.state.product.current_custom_options[
                  option.option_id
                ].option_value;
              }
            }
            // this.$store.state.product.current_custom_options[option.option_id].option_value,
            currentOptions[option.option_id] = {
              option_id: option.option_id,
              option_value: value,
            };
            //   console.log("1122 option is ", obj2, listOptions, currentOptions);
          });
          this.productCurrentCustomOptions = currentOptions;
          console.log("112233 productCurrentCustomOptions", currentOptions);
          return currentOptions;
        } else {
          return {};
        }
      } else {
        return {};
      }
    },
    setPrice(data){
    //  console.log(data);
      this.calculatedProductPrice=data;
    },
    setColorName(name) {
      this.colorName = name
    },
    getColorName() {
      if (this.colorName == "") {
        this.getCurrentProduct.custom_options.forEach((option) => {
          if (
            option.iscolor == 1 ||
            option.iscolor == "1" ||
            option.iscolor == true
          ) {
            this.colorName = "Please Select " + option.title
          }
        })
      } else {
        return this.colorName
      }
    },
    addCustomOption(option) {
      let prodFlag = true
      if (this.sendProductCustomOptions.length == 0) {
        this.sendProductCustomOptions.push(option)
        // console.log("11226610 ", this.sendProductCustomOptions);
      } else {
        this.sendProductCustomOptions.forEach((prodOption, index) => {
          // console.log(
          //   "\n",
          //   "prodOption.title",
          //   prodOption,
          //   "\n",
          //   " option.title",
          //   option,
          //   "\n",
          //   index,
          //   "\n",
          //   this.sendProductCustomOptions.length
          // );
          if (prodOption.title === option.title) {
            prodOption = option
            this.sendProductCustomOptions[index] = option
            this.sendProductCustomOptions[index]
            prodFlag = false
            // console.log(
            //   "1122669 indexer",
            //   index,
            //   this.sendProductCustomOptions[index]
            // );
          } else {
            if (index == this.sendProductCustomOptions.length - 1) {
              if (!prodFlag) {
                this.sendProductCustomOptions.push(option)
                //   console.log("1122667 ", this.sendProductCustomOptions);
              } else {
                //   console.log("1122668 ", this.sendProductCustomOptions);
              }
            }
          }
        })
      }
    },
    validateUrl(str) {
      let pattern = /^((http|https):\/\/)/
      return pattern.test(str)
    },
    attachBaseUrl(str) {
      if (config.server.baseUrl) {
        return config.server.baseUrl + "/" + str
      }
      return str
    },
    getImageUrl(img) {
      if (!img) {
        return ""
      }
      let subPathImg = "img/250/250/resize/catalog/product"
      if (!this.validateUrl(img)) {
        return subPathImg + img
      }
    },
    showColorPicker() {
      this.colorPickerCheck = true
      //  document.body.style.overflow("hidden");
      //  let scrollDisable = document.getElementsByTagName("body");
      //  scrollDisable.style.overflow("hidden");
      //    console.log( "  document.body",scrollDisable);
      document.body.style.overflow = "hidden"
    },
    hideColorPicker() {
      this.colorPickerCheck = false
      document.body.style.overflow = "scroll"
    },
    showDetails(event) {
      this.detailsOpen = true
      event.target.classList.add("hidden")
    },
    notifyOutStock() {
      this.$store.dispatch("notification/spawnNotification", {
        type: "error",
        message: this.$t(
          "The product is out of stock and cannot be added to the cart!"
        ),
        action1: { label: this.$t("OK") },
      })
    },
    notifyWrongAttributes() {
      this.$store.dispatch("notification/spawnNotification", {
        type: "warning",
        message: this.$t(
          "No such configuration for the product. Please do choose another combination of attributes."
        ),
        action1: { label: this.$t("OK") },
      })
    },
    changeFilter(variant) {
      this.$bus.$emit(
        "filter-changed-product",
        Object.assign({ attribute_code: variant.type }, variant)
      )
      this.getQuantity()
    },
    changeFilterCustom(event) {
      let variant = JSON.parse(event.target.value)
      this.$bus.$emit(
        "filter-changed-product",
        Object.assign({ attribute_code: variant.type }, variant)
      )
      this.getQuantity()
    },
    openSizeGuide() {
      this.$bus.$emit("modal-show", "modal-sizeguide")
    },
    isOptionAvailable(option) {
      // check if the option is available
      const currentConfig = Object.assign(
        {},
        this.getCurrentProductConfiguration
      )
      currentConfig[option.type] = option
      return isOptionAvailableAsync(this.$store, {
        product: this.getCurrentProduct,
        configuration: currentConfig,
      })
    },
    async getQuantity() {
      if (this.isStockInfoLoading) return // stock info is already loading
      this.isStockInfoLoading = true
      try {
        const res = await this.$store.dispatch("stock/check", {
          product: this.getCurrentProduct,
          qty: this.getCurrentProduct.qty,
        })
        console.log("res ", res)
        this.maxQuantity = res.qty
      } finally {
        this.isStockInfoLoading = false
      }
    },
    handleQuantityError(error) {
      this.quantityError = error
    },
    ProDeliveryShowFn() {
      var details_element = document.getElementsByClassName(
        "bt-Delivery-wrapper-show-close"
      )[0]
      details_element.classList.toggle("Delivery-wrapper-show")
      document
        .getElementById("product-Delivery-icon-id")
        .classList.toggle("icon-rotate")
    },
    ProSpecificationsShowFn() {
      var details_element = document.getElementsByClassName(
        "bt-Specifications-wrapper-show-close"
      )[0]
      details_element.classList.toggle("Specifications-wrapper-show")
      document
        .getElementById("product-Specifications-icon-id")
        .classList.toggle("icon-rotate")
    },
    ProReviewShowFn() {
      var details_element = document.getElementsByClassName(
        "bt-review-wrapper-show-close"
      )[0]
      details_element.classList.toggle("review-wrapper-show")
      document
        .getElementById("product-review-icon-id")
        .classList.toggle("icon-rotate")
    },
    ProDimensionShowFn() {
      var details_element = document.getElementsByClassName(
        "bt-dimension-wrapper-show-close"
      )[0]
      details_element.classList.toggle("dimension-wrapper-show")
      document
        .getElementById("product-dimension-icon-id")
        .classList.toggle("icon-rotate")
      if (document.getElementById("comes-with-main") !== null) {
        // console.log('sasa');
        const slider2 = document
          .getElementById("comes-with-main")
          .querySelector(".VueCarousel-inner")
        slider2.style.transform =
          "translate3d(" + "-" + slider2.style.flexBasis + ", 0px, 0px)"
      }
    },
    getReviews() {
      return this.reviewData
    },
  },
  metaInfo() {
    const storeView = currentStoreView()
    return {
      link: [
        {
          rel: "amphtml",
          href: this.$router.resolve(
            localizedRoute(
              {
                name: this.getCurrentProduct.type_id + "-product-amp",
                params: {
                  parentSku: this.getCurrentProduct.parentSku
                    ? this.getCurrentProduct.parentSku
                    : this.getCurrentProduct.sku,
                  slug: this.getCurrentProduct.slug,
                  childSku: this.getCurrentProduct.sku,
                },
              },
              storeView.storeCode
            )
          ).href,
        },
      ],
      title: htmlDecode(
        this.getCurrentProduct.meta_title || this.getCurrentProduct.name
      ),
      meta: this.getCurrentProduct.meta_description
        ? [
          {
            vmid: "description",
            name: "description",
            content: htmlDecode(this.getCurrentProduct.meta_description),
          },
        ]
        : [],
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$color-primary: color(primary);
$color-tertiary: color(tertiary);
$color-secondary: color(secondary);
$color-white: color(white);
$bg-secondary: color(secondary, $colors-background);
#overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  cursor: pointer;
}
.product {
  &__add-to-compare {
    display: none;
    @media (min-width: 767px) {
      display: block;
    }
  }
}
.breadcrumbs {
  @media (max-width: 767px) {
    margin: 15px 0;
    padding: 15px 0 0 15px;
  }
}
.error {
  color: red;
  font-weight: bold;
  padding-bottom: 15px;
}
.data {
  @media (max-width: 767px) {
    border-bottom: 1px solid $bg-secondary;
  }
}
.image {
  @media (max-width: 1023px) {
    margin-bottom: 20px;
  }
  @media (max-width: 767px) {
    margin-bottom: 0;
  }
}
.product-name {
  @media (max-width: 767px) {
    font-size: 36px;
  }
}
.price {
  @media (max-width: 767px) {
    color: $color-primary;
  }
}
.variants-label {
  @media (max-width: 767px) {
    font-size: 14px;
  }
}
.variants-wrapper {
  @media (max-width: 767px) {
    padding-bottom: 30px;
  }
  .sizes {
    @media (max-width: 767px) {
      width: 100%;
    }
  }
  .size-guide {
    height: 40px;
    @media (max-width: 767px) {
      width: 100%;
      margin-left: 0;
    }
  }
}
.product-top-section {
  @media (max-width: 767px) {
    padding: 0;
    background-color: $color-white;
  }
}
.add-to-buttons {
  @media (max-width: 767px) {
    padding-top: 30px;
    margin-bottom: 40px;
  }
}
.details {
  @media (max-width: 767px) {
    padding: 50px 15px 15px;
  }
}
.details-title {
  padding: 0 8px;
  @media (max-width: 767px) {
    font-size: 18px;
    margin: 0;
  }
}
.details-wrapper {
  @media (max-width: 767px) {
    position: relative;
    // max-height: 140px;
    overflow: hidden;
    transition: all 0.3s ease;
    font-size: 14px;
  }
  &--open {
    max-height: none;
  }
}
.details-overlay {
  @media (max-width: 767px) {
    position: absolute;
    height: 75%;
    bottom: 0;
    left: 0;
    width: 100%;
    margin: 0;
    cursor: pointer;
    background: linear-gradient(rgba($color-white, 0), rgba($color-white, 1));
    &.hidden {
      display: none;
    }
  }
}
.price-original {
  text-decoration: line-through;
}
.action {
  &:hover {
    color: $color-tertiary;
  }
}
.attributes {
  list-style-type: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.product-image {
  mix-blend-mode: multiply;
  width: 460px;
}
.web-share {
  float: right;
}
/*Custom Css*/
h1.product-name {
  font-size: 28px;
  font-family: "Poppins", sans-serif;
  color: #54575b;
  margin: 10px 0px 10px 0px;
  text-transform: capitalize;
}
.b-t-prod-sku {
  font-weight: 600;
  margin: 25px 0px 0px 0px;
  padding-bottom: 15px;
  color: #54575b;
}
.outofstock {
  font-weight: 600;
  margin: 0px 0px 10px 0px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f1f2;
  color: #d10000b8;
}
.inStock {
  font-weight: 600;
  margin: 0px 0px 10px 0px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f1f2;
  color: #26988a;
}
.bt-price-main .h2.cl-mine-shaft.weight-700 {
  color: #d10000b8;
  display: inline-block;
  margin-top: 15px;
}

.bt-product-gallery {
  padding-right: 30px;
}

.bt-product-details {
  padding-left: 30px;
}
.saving-price-detail-div {
  display: inline-block;
  padding-left: 15px;
  font-size: 17px;
  color: #54575b;
}
.product-detail-inner {
  padding-bottom: 30px;
  border-bottom: 1px solid #f0f1f2;
}
span.save-amount {
  padding-left: 15px;
  color: #d10000b8;
}

.bt-price-main {
  margin-bottom: 10px;
}
.row.m0.bt-product-addtocartbtn {
  display: inline-block;
}

.bt-product-qty {
  display: inline-block;
  padding-right: 15px;
  margin-bottom: 0;
}

.row.m0.bt-product-addtocartbtn button {
  padding: 8.5px 15px;
  border-bottom-left-radius: 6px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  background: #00998c;
  text-transform: uppercase;
  font-weight: bold;
}
.border-bottom-custom-class {
  border-bottom: 1px solid #f0f1f2;
  margin-top: 25px;
}
.stock-main img {
  width: 25px;
  float: left;
}

.bt-new-stock-main {
  padding: 15px 0px;
}
.stock-main span {
  vertical-align: sub;
  padding-left: 15px;
  color: #54575b;
  font-weight: 600;
  font-size: 15px;
}
.delivery-main {
  display: inline-flex;
}
.delivery-main img {
  width: 30px;
  float: left;
  height: 20px;
}

.bt-new-delivery-main {
  padding: 5px 0px 20px 0px;
  border-bottom: 1px solid #f0f1f2;
}
.delivery-main span {
  padding-left: 15px;
  color: #54575b;
  font-weight: 600;
}
span.purple {
  padding-left: 0px;
  // color: #8678a9;
}

.bt-AddToWishlist button {
  font-size: 17px;
  border: 2px solid;
  padding: 5px 35px;
  border-radius: 5px;
  font-weight: 700;
  margin-right: 20px;
  &:hover {
    color: #54575b;
  }
}

.description-main ul {
  padding: 0;
  display: block;
  color: #54575b;
  list-style: none;
  position: relative;
  margin-bottom: 0px;
}

.description-main ul li:before {
  content: "";
  position: absolute;
  left: 0;
  top: 10px;
  width: 8px;
  border-top: 1px solid #54575b;
}

.description-main ul li {
  position: relative;
  padding-left: 25px;
}
.description-main ul li:not(:last-child) {
  padding-bottom: 10px;
}
span.readmore-product-description {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-style: italic;
  color: #8678a9;
  float: right;
}
section.product-description-main {
  margin-top: 0;
  border-bottom: 0px !important;
  padding-top: 5px;
}

.brdr-cl-secondary {
  border: 0px;
}

h2.h3 {
  font-size: 18px;
  font-family: "Poppins", sans-serif;
  color: #54575b;
  padding: 0px 0px 0px 0px;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  margin: 35px 0px 25px 0px;
  cursor: pointer;
}
.details-dimension {
  margin: 5px 0px 25px 0px !important;
}
h2.h3:after {
  border-bottom: 1px solid #f0f1f2;
  content: "";
  width: 100%;
  position: absolute;
  left: 0;
  bottom: -10px;
}
i.product-detail-icon {
  padding: 0;
  float: right;
  color: #9aa09c;
  font-size: 35px;
  position: absolute;
  right: 0;
  top: -4px;
}
.bt-details-wrapper-show-close {
  display: none;
}

.bt-details-wrapper-show-close.details-wrapper-show {
  display: block;
}
.bt-dimension-wrapper-show-close {
  display: none;
}

.bt-dimension-wrapper-show-close.dimension-wrapper-show {
  display: block;
}
i.icon-rotate {
  transform: rotate(90deg);
}
.h5 {
  color: #54575b;
  font-family: "Poppins", sans-serif;
}
.bt-need-wrapper-show-close {
  display: none;
}
.bt-review-wrapper-show-close {
  display: none;
}
.bt-need-wrapper-show-close.need-wrapper-show {
  display: block;
}
.bt-review-wrapper-show-close.review-wrapper-show {
  display: block;
}
.bt-need-wrapper-show-close.need-wrapper-show .lh30 {
  font-size: 16px !important;
}
.bt-Delivery-wrapper-show-close .lh30 {
  font-size: 16px !important;
}

.bt-Delivery-wrapper-show-close {
  display: none;
}

.bt-Delivery-wrapper-show-close.Delivery-wrapper-show {
  display: block;
}
.bt-Specifications-wrapper-show-close .lh30 {
  font-size: 16px !important;
}
.bt-Specifications-wrapper-show-close {
  display: none;
}
.bt-Specifications-wrapper-show-close.Specifications-wrapper-show {
  display: block;
}
.recently-inner-container {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
}
.recently-viewed-items-container.container {
  background: #fff;
  margin: 35px auto;
}

.recently-viewed-items-container.container {
  text-align: center;
  margin: 20px auto 0px auto;
  background: #fff;
  padding: 0px 0px 20px 0px;
  border: 2px solid #f0f1f2;
}

div.mainProduct {
  padding-bottom: 35px;
  background: #ffffff;
  margin-top: -8px;
}

h4.recent-heading {
  font-family: "Poppins", sans-serif;
  color: #fff;
  padding: 15px 0px;
  margin-bottom: 25px;
  text-align: center;
  margin-top: 0;
  background: #54575b;
}
.sb-bt-AddToWishlist-mobile {
  display: none !important;
}
.long-description h2 {
  font-size: 24px;
  font-weight: 500;
}
.bt-new-description-main {
  background-color: #f6f6f6;
  -webkit-box-shadow: 0px 0px 5px -1px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 5px -1px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 5px -1px rgba(0, 0, 0, 0.75);
}
@media (max-width: 767px) {
  .product-description-main {
    padding: 0px 30px !important;
  }

  .recently-inner-container {
    padding: 0px 0px !important;
  }
  .VueCarousel.prod-gallery-thumbnails-carousel {
    display: none;
  }
  .sb-bt-AddToWishlist-desktop {
    display: none !important;
  }
  .sb-bt-AddToWishlist-mobile {
    display: flex !important;
    width: 100%;
  }
}
span.readmore-product-description {
  display: none;
}
/*Custom Css*/
/*Mobile Custom Css */
@media (max-width: 767px) {
  .saving-price-detail-div {
    display: block !important;
    padding-left: 0px !important;
  }
  .bt-product-details {
    padding-left: 0px !important;
  }
  // .product-qty-and-add-to-cart {
  //   position: relative;
  // }
  .bt-AddToWishlist button {
    float: none;
    margin-right: 0px;
  }
  h1.product-name {
    font-size: 18px;
  }
  h2.h3 {
    font-size: 16px;
  }
  .bt-product-qty {
    position: relative !important;
    right: 0;
    top: 0px;
    padding-right: 0px !important;
  }
  .product-quantity,
  .bt-product-addtocartbtn {
    display: inline-block !important;
  }
  .bt-product-addtocartbtn {
    width: 75% !important;
  }
}
/*Mobile Custom Css */
/*Dynamic Page Css */
span.price-original.h3.ori-price-custom {
  display: inline-block;
  padding-left: 15px;
  font-size: 17px;
  color: #54575b;
  text-decoration: none;
}
span.was-price {
  text-decoration: line-through;
}
/*Dynamic Page Css */
@media (max-width: 767px) {
  span.price-original.h3.ori-price-custom {
    display: block !important;
    padding-left: 0px !important;
    padding-top: 10px;
  }
}

/* FLOR-19 */
.product-top-section {
  background: #ffffff;
}
/* FLOR-19  */
/* Come With  */
p.c_pro_price span {
  font-weight: 400 !important;
}
.c_pro_price {
  font-size: 15px;
  margin-bottom: 0px;
}
p.c_pro_title {
  color: #000;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 16px;
  margin: 5px 0px;
}
.basin_size select {
  width: 350px;
  background: #ffffff;
  font-family: "Poppins", sans-serif;
  color: #000;
  font-size: 16px;
  border: 3px solid #f0f1f2;
}
.basin_size select:focus {
  outline: 0;
}
.variants-label.basin-head {
  margin-bottom: 0;
  margin-top: 0;
}
@media (max-width: 767px) {
  #comes-with-main .VueCarousel.prod-gallery-thumbnails-carousel {
    display: flex !important;
  }
  #comes-with-main .product-image {
    padding-bottom: 70% !important;
  }
  #comes-with-main .product-image img {
    width: 150px;
    height: 150px;
  }
  .details-wrapper {
    max-height: auto !important;
  }
  .bt-AddToWishlist {
    margin-top: 25px !important;
  }
  .product-description-right {
    order: 1;
    -webkit-order: 1;
  }
  .product-description-left {
    order: 2;
    -webkit-order: 2;
  }
}
.product-reviews {
  float: right;
}
.product-reviews:hover {
  text-decoration: none;
}

/* Come With  */
/* FLOR-92  */
.bt-AddToWishlist {
  margin-top: 15px;
  z-index: 2;
  position: relative;
  display: flex;
  justify-content: center;
}
.onlyPlaceholder img {
  width: 350px;
}
/* FLOR-92  */
/* FLOR-206  */
span.come-due-in {
  color: #54575b;
  font-weight: 500;
  font-size: 15px;
  padding-left: 0px;
  vertical-align: baseline;
}
/* FLOR-206  */
</style>
<style>
/* extra-info-main  */
.bt-new-description-main ul {
  padding: 18px 0px 18px 18px;
  list-style: none;
}

.bt-new-description-main ul li {
  color: #54575b;
  margin-bottom: 5px;
  position: relative;
  margin-left: 15px;
}

.bt-new-description-main ul li:before {
  content: "-";
  margin-right: 15px;
  position: absolute;
  left: -15px;
}

.delivery-main .cms-content p {
  margin: 0;
}
.delivery-main .cms-content ul {
  margin-top: 10px;
  margin-bottom: 10px;
}
.delivery-main .cms-content p a {
  color: #0f988b;
}
.majority-uk {
  margin-bottom: 20px !important;
}
/* extra-info-main  */
/* comeswith carousel  */
.slideElementimage .product-image.product-image--height {
  margin: 0 auto;
  padding: 0 0px;
  width: 100%;
}
.border_purple {
  border-bottom: 4px solid #000;
}

.comes-with-main button {
  background: #ddd !important;
  border-radius: 50%;
}
/* comeswith carousel  */
.specification.field {
  margin-bottom: 20px;
}

.field-val-div {
  padding: 11px 15px;
  background: #f6f6f6;
  border-top: 1px solid #e2e2e2;
  border-right: 1px solid #e2e2e2;
  border-left: 1px solid #e2e2e2;
}

.field-val-div:nth-of-type(1) {
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}
.field-val-div:last-child {
  border-bottom: 1px solid #e2e2e2;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
}

.field-val-div span.field-text {
  font-weight: 600 !important;
  font-size: 14px !important;
  margin: 0px 0 0px !important;
  color: #333;
  font-family: "Poppins", sans-serif;
}

span.field-value {
  font-weight: 500 !important;
  font-size: 14px !important;
  margin: 0px 0 0px !important;
  color: #333;
  float: right;
  font-family: "Poppins", sans-serif;
  text-transform: capitalize;
}
.rating-top .vue-star-rating span svg {
  width: 20px;
  height: 20px;
}
.vue-star-rating {
  float: left;
}
.vue-star-rating-rating-text {
  margin-top: 0 !important;
}
.select-color-button {
  width: 350px;
  background: #ffffff;
  font-family: "Poppins", sans-serif;
  color: #000;
  font-size: 16px;
  border: 3px solid #f0f1f2;
  height: 44px;
  text-align: left;
  margin-bottom: 20px;
  position: relative;
}
.select-color-button .select-color-icon {
  padding: 0;
  float: right;
  color: #000;
  font-size: 20px;
  position: absolute;
  right: 0;
  top: 10px;
  font-weight: 500;
  transform: rotate(90deg);
}
@media only screen and (min-device-width: 320px) and (max-device-width: 767px) {
  .field-val-div {
    display: grid;
  }
  .field-val-div span.field-text {
    width: 50%;
    display: inline-block;
    font-size: 13px !important;
  }
  span.field-value {
    width: 50%;
    text-align: right !important;
    font-size: 13px !important;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 992px) {
  .field-val-div {
    display: grid;
  }
  .field-val-div span.field-text {
    width: 50%;
    display: inline-block;
    font-size: 13px !important;
  }
  span.field-value {
    width: 50%;
    text-align: right !important;
    font-size: 13px !important;
  }
}
</style>