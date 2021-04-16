<template>
  <div
    itemscope
    itemtype="http://schema.org/Product"
    class="product-page-detail"
  >
    <section>
      <div class="container">
        <div class="row">
          <breadcrumbs
            class="pt40 pb20 hidden-xs breadcrumb"
            :product="getCurrentProduct"
          />
        </div>
      </div>
    </section>
    <section class="bg-cl-secondary px20 product-top-section">
      <div class="container">
        <section class="row m0 between-xs">
          <!-- schema review -->
          <template v-if="reviewData.bottomline">
            <template v-if="reviewData.bottomline.average_score">
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
              <meta itemprop="image" :content="getSchemaImageUrl" />
            </template>
          </template>
          <!-- Product Gallery -->
          <div
            class="col-xs-12 col-md-12 col-lg-6 center-xs middle-xs image product-image-box product-slider"
          >
            <div v-if="getProductGallery.length === 0" class="onlyPlaceholder">
              <div class="product-cover bg-cl-secondary">
                <img src="/assets/placeholder.svg" alt="placeholder" />
              </div>
            </div>
            <div
              v-else-if="getProductGallery.length >= 1"
              class="bt-product-gallery"
            >
              <product-gallery
                ref="getProductGallery"
                :gallery="getProductGallery"
                :gallery-zoom="getProductGalleryCustom"
                :customer-gallery="customerPhotosGallery"
                :offline="getOfflineImage"
                :configuration="getCurrentProductConfiguration"
                :product="getCurrentProduct"
                @page-change="(page) => (currentGalleryPage = page)"
                :imagelength="getProductGallery.length"
              />
              <div
                class="productGalleryMain"
                v-if="getProductGallery.length > 1"
              >
                <no-ssr>
                  <div class="col-md-9 productGallery">
                    <carousel
                      class="prod-gallery-thumbnails-carousel"
                      id="prod-gallery-thumbnails-carousel"
                      :per-page-custom="[
                        [480, 0],
                        [768, 4],
                        [1000, 3],
                        [1200, 4],
                      ]"
                      :mouse-drag="false"
                      :loop="true"
                      @page-change="pageChange"
                      :min-swipe-distance="20"
                      :navigation-enabled="true"
                      :pagination-enabled="false"
                      navigation-next-label="<i class='material-icons p15  pointer rightArrow'>keyboard_arrow_right</i>"
                      navigation-prev-label="<i class='material-icons p15  pointer leftArrow'>keyboard_arrow_left</i>"
                      ref="carousel"
                    >
                      <slide
                        v-for="(images, key) in getProductGallery"
                        :key="images.src"
                        class="mb-1 bg-grey-lighter mob-flex"
                      >
                        <div
                          class="youtubeIcon"
                          @click="
                            $refs.getProductGallery.$refs.carousel.navigate(key)
                          "
                          v-if="images.video"
                        />
                        <img
                          :src="images.src"
                          ref="images"
                          @click="
                            $refs.getProductGallery.$refs.carousel.navigate(key)
                          "
                          :alt="getCurrentProduct.name"
                          class="block border cursor-pointer"
                          :class="[
                            currentGalleryPage === key
                              ? 'border-blue'
                              : 'border-grey-light',
                          ]"
                        />
                      </slide>
                    </carousel>
                  </div>
                </no-ssr>
                <div class="Viewgallery col-md-3">
                  <a @click="openFigureGallery()">View Gallery +</a>
                </div>
              </div>
            </div>
          </div>
          <!-- upper section  -->
          <div class="col-xs-12 col-md-12 col-lg-6 data product-detail">
            <div class="product-detail-inner">
              <div
                class="product-head"
                :class="
                  !getCurrentProduct.qty_per_sqm
                    ? 'adhesive-product-head'
                    : 'simple-product-head'
                "
              >
                <h1
                  class="mb20 mt0 cl-mine-shaft product-name"
                  data-testid="productName"
                  itemprop="name"
                >
                  {{ getCurrentProduct.name | htmlDecode }}
                </h1>
                <meta itemprop="sku" :content="getCurrentProduct.sku" />
                <meta
                  itemprop="color"
                  :content="
                    getSingleAttributeLabel('color', getCurrentProduct.color)
                  "
                />
                <meta
                  itemprop="material"
                  :content="getCurrentProduct.filter_material"
                />
                <meta
                  itemprop="size"
                  v-if="getCurrentProduct.size"
                  :content="getCurrentProduct.size"
                />
                <meta itemprop="mpn" :content="getCurrentProduct.sku" />
                <meta itemprop="url" :content="getProductUrl" />
                <meta itemprop="aggregateRating" content />
                <meta itemprop="brand" :content="`Bed Factory Direct`" />
                <div
                  itemprop="manufacturer"
                  itemscope
                  itemtype="http://schema.org/Organization"
                >
                  <meta
                    itemprop="name"
                    :content="
                      getSingleAttributeLabel(
                        'manufacturer',
                        getCurrentProduct.manufacturer
                      )
                    "
                  />
                </div>
                <div class="rating" v-if="reviewData.bottomline">
                  <rating
                    :ul-class="`cursor-pointer`"
                    @starsClicked="navigateToReviews"
                    :score="
                      reviewData.bottomline.average_score
                        ? parseFloat(reviewData.bottomline.average_score)
                        : 0
                    "
                  />
                  <span class="reviews" @click="navigateToReviews">
                    {{
                      reviewData.bottomline.total_review
                        ? reviewData.bottomline.total_review
                        : 0
                    }}
                    Reviews</span
                  >
                  <a class="qa" @click="navigateToQA">
                    View Questions & Answers ({{ totalAvailableQA }})
                  </a>
                </div>
                <div class="row">
                  <div
                    class="col-xs-6 col-md-6 col-lg-6 col-xl-7 product-size-sku"
                  >
                    <div
                      :class="!getCurrentProduct.qty_per_sqm ? 'no-size' : ''"
                      itemprop="offers"
                      itemscope
                      itemtype="http://schema.org/Offer"
                      class="mb20 uppercase cl-secondary sku-value-top"
                      :content="getCurrentProduct.sku"
                    >
                      <meta
                        itemprop="priceCurrency"
                        :content="$store.state.storeView.i18n.currencyCode"
                      />
                      <meta
                        itemprop="itemcondition"
                        content="http://schema.org/NewCondition"
                      />
                      <meta
                        itemprop="price"
                        :content="
                          parseFloat(
                            getCurrentProduct.calculated_sqm_price
                          ).toFixed(2)
                        "
                      />
                      <meta
                        itemprop="availability"
                        :content="structuredData.availability"
                      />
                      <meta itemprop="url" :content="getProductUrl" />
                      <meta
                        itemprop="image"
                        v-if="getCurrentProduct.image"
                        :content="getSchemaImageUrl"
                      />
                      <span class="sku-value"
                        >{{ $t("SKU:") }} {{ getCurrentProduct.sku }}
                      </span>
                    </div>
                  </div>
                  <!-- Stock level -->
                  <!-- <div class="col-xs-6 col-md-6 col-lg-6 col-xl-5 product-stock">
                    <span
                      v-html="getCurrentProduct.stock_level_text"
                      class="sqm"
                    />
                  </div> -->
                </div>
              </div>
              <!-- Price Section Start-->
              <div
                v-if="!getCurrentProduct.bundle_options"
                class="product-pricing"
                :class="
                  !getCurrentProduct.qty_per_sqm
                    ? 'adhesive-product-pricing'
                    : 'simple-pricing'
                "
              >
                <div class="row">
                  <div
                    :class="
                      !getCurrentProduct.qty_per_sqm
                        ? 'col-lg-12'
                        : 'col-lg-9 col-md-9'
                    "
                  >
                    <div class="row">
                      <div
                        class="col-lg-12 col-md-12 col-xs-12 border-tile-bottom first-child"
                      > 
                        <div
                          class="price serif price-infos"
                          :class="
                            (!getCurrentProduct.qty_per_sqm
                              ? 'price-infos-adhesive'
                              : 'price-infos-simple') +
                            (getCurrentProduct.qty_per_sqm
                              ? ' hidden-tiles-price '
                              : '')
                          "
                        >
                          <div
                            class="old-price"
                            v-if="!getCurrentProduct.special_price"
                          >
                            <span class="sale-info">
                              <span
                                class="h2 cl-mine-shaft weight-700 this tile_price"
                                >£{{ getPerTilePrice }}
                              </span>
                            </span>
                          </div>
                          <div class="sale-price" v-else>
                            <div class="salepriceshow">
                              <span class="sale-title">
                                {{ $t("sale price") }}
                              </span>
                              <span class="specialprice">{{
                                getCurrentProduct.special_price | price
                              }}</span>
                            </div>

                            <span class="sale-info-special">
                              <span class="salelineprice">{{
                                getCurrentProduct.original_price | price
                              }}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--  Price Section  End -->
              <!--  -->
              <product-bundle-options
                v-if="
                  getCurrentProduct.bundle_options &&
                  getCurrentProduct.bundle_options.length > 0
                "
                :product="getCurrentProduct"
              />

              <div
                v-if="
                  getCurrentProduct.custom_options &&
                  getCurrentProduct.custom_options.length > 0
                "
              >
                <product-custom-options
                  :currProduct="getCurrentProduct.sku"
                  :product="getCurrentProduct"
                  @option-added="addCustomOption($event)"
                  :color="false"
                />
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
              <div class="add-to-cart row m0">
                <div class="col-xs-12 col-md-6 col-lg-6 total-amount">
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
                </div>
                <addtobasket
                  v-if="showModal"
                  @closemodal="hidemodal"
                  :product="getCurrentProduct"
                  :check-grout-adhesive="sqmCheckForModelType"
                  :grout-adhesive-data="groutAdhesiveOptions"
                  :product-sqm-quantity="tileSqmQuantity"
                  :product-tile-quantity="tilesQuantity"
                  :fixing="fixing"
                  :made-of="madeOf"
                  :box-sqm="getCurrentProduct.qty"
                  :grout-joint="groutJoint"
                  :min-sqm-value="minSqmValue"
                  :vinyl-product-price="vinylProductPrice"
                  :vinyl-recommended-item-price="vinylRecommendedItemPrice"
                />
                <modal name="modal-clearancemodal" class="ClearanceModal">
                  <clearancemodal
                    :similar-products="similar_products"
                    :product="getCurrentProduct"
                    :current-user-tiles="tileSqmQuantity"
                  />
                </modal>
                <modal name="outofstock-modal" class="OFSModal">
                  <out-of-stock-modal :product="getCurrentProduct" />
                </modal>
                <div
                  class="col-xs-11 col-sm-12 col-md-6 col-lg-6 col-margin addtocartbuttonMobile"
                >
                  <add-to-cart
                    :product="getCurrentProduct"
                    :disabled="
                      isAddToCartDisabled || cartDisabledOnQuoteItemBased
                    "
                    class="add-btn"
                    @Modal="modalshow"
                    :sqm-val-updated="'0'"
                  />
                  <!-- <add-to-cart
                    :product="getCurrentProduct"
                    :disabled="
                      isAddToCartDisabled || cartDisabledOnQuoteItemBased
                    "
                    class="add-btn"
                    @Modal="modalshow"
                    :sqm-val-updated="tileSqmQuantity"
                    @update-sqm-qty="sqmQtyCheck"
                    @update-tile-qty="tileQtyCheck"
                    @atcPixel="atcPixel"
                  /> -->
                  <span
                    class="mobile-cal-btn"
                    @click="show"
                    v-if="getCurrentProduct.qty_per_sqm"
                  >
                    {{ $t("How many do I need?") }}
                  </span>
                </div>
                <!-- <p @click="clearancemodal()">hello</p> -->
              </div>
              <!-- <div class="row add-to-buttons">
                <div class="col-xs-6 col-sm-3 col-md-6">
                  <AddToWishlist :product="getCurrentProduct" />
                </div>
                <div class="col-xs-6 col-sm-3 col-md-6">
                  <AddToCompare :product="getCurrentProduct" />
                </div>
              </div>-->
            </div>
          </div>
        </section>
      </div>
    </section>
    <section class="container px15 pt20 pb35 cl-accent details product-desc">
      <div
        class="h4 details-wrapper"
        :class="[detailsOpen ? 'details-wrapper--open' : '']"
      >
        <div class="row between-md m0">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 productdetail-col">
            <h2
              class="row h3 m0 mb10 serif lh20 details-title hidden-xs"
              @click="productDetails()"
            >
              {{ $t("Product Details") }}
              <span id="right-icon" class="icon-rotate" />
            </h2>
            <h2
              class="row h3 m0 mb10 serif lh20 details-title hidden-lg hidden-md"
            >
              {{ $t("Product Info") }}
            </h2>
            <div
              class="lh20 h5 productdetail-close"
              itemprop="description"
              v-html="getCurrentProduct.description"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 infoprod-col">
            <div class="information-prod">
              <h2 class="info-break" @click="infoProd()">
                {{ $t("Information Breakdown") }}
                <span id="right-icon-info" class="icon-rotate-info" />
              </h2>
              <ul class="attributes p0 pt5 m0 infoprod-close">
                <product-attribute
                  :key="attr.attribute_code"
                  v-for="attr in getCustomAttributes"
                  :product="getCurrentProduct"
                  :attribute="attr"
                  empty-placeholder="N/A"
                />
              </ul>
            </div>
          </div>
          <div class="details-overlay" @click="showDetails" />
        </div>
      </div>
    </section>
    <div class="recently-viewed-items-contain container">
        <lazy-hydrate when-idle>
      <related-products
        type="upsell"
        :heading="$t('Customers also liked')"
      />
    </lazy-hydrate>
      <!-- similar_products {{similar_products}} -->

      <!-- Put data in similar products to see similar products -->
      <template
        v-if="similar_products.items && similar_products.items.length > 0"
      >
        <h4 class="recent-heading recent">Customers also liked</h4>
        <div class="recently-inner-container">
          <no-ssr>
            <lazy-hydrate when-visible>
              <RecentlyViewedItems :product="getCurrentProduct" />
            </lazy-hydrate>
          </no-ssr>
        </div>
      </template>
    </div>
    <template v-if="loaded">
      <reviews
      v-if="reviewData"
        :product-name="getCurrentProduct.name"
        :product-id="getCurrentProduct.id"
        v-show="isOnline"
        :product="getCurrentProduct"
        :finalReview ="reviewData"
        @hasTotalQA="updateReviewsTotals"
        ref="reviewsSection"
      />
    </template>
  </div>
</template>

<script>
// import i18n from '@vue-storefront/i18n';
// import VueOfflineMixin from 'vue-offline/mixin';
import config from 'config';
import RelatedProducts from 'src/themes/bedfactory/components/core/blocks/Product/Related.vue';
import Reviews from 'theme/components/core/blocks/Reviews/Reviews.vue';
import AddToCart from 'theme/components/core/AddToCart.vue';
import GenericSelector from 'theme/components/core/GenericSelector';
import ColorSelector from 'theme/components/core/ColorSelector.vue';
import SizeSelector from 'theme/components/core/SizeSelector.vue';
import Breadcrumbs from 'theme/components/core/Breadcrumbs.vue';
import ProductAttribute from 'theme/components/core/ProductAttribute.vue';
import ProductQuantity from 'theme/components/core/ProductQuantity.vue';
import addtobasket from 'theme/components/core/AddTobasketModal';
import clearancemodal from 'theme/components/core/ClearanceModal';
import OutOfStockModal from 'theme/components/core/OutOfStockModal';
import ProductQuantitySqm from 'theme/components/core/ProductQuantitySqm.vue';
// import ProductQuantitySqm from "/home/hamza/Desktop/Tilemountain/TmVuestore/src/themes/tilemountain/components/core/productQuantitySqm.vue"
import ProductLinks from 'theme/components/core/ProductLinks.vue';
// import ProductCustomOptions from '/home/ejaz/vsf/BEDFACTORY/newBFD/bfdvuestore/src/themes/bedfactory/components/core/ProductCustomOptions.vue';
import ProductCustomOptions from '../components/core/ProductCustomOptions';
import ProductBundleOptions from 'theme/components/core/ProductBundleOptions.vue';
import VinylRecommendedItems from 'theme/components/core/vinyl/VinylRecommendedItem';
import ProductGallery from 'theme/components/core/ProductGallery';
import Spinner from 'theme/components/core/Spinner';
import PromotedOffers from 'theme/components/theme/blocks/PromotedOffers/PromotedOffers';
import focusClean from 'theme/components/theme/directives/focusClean';
import WebShare from 'theme/components/theme/WebShare';
import CutSizeSample from 'src/modules/cut-full-sample/components/CutSizeSample';
import FullSizeSample from 'src/modules/cut-full-sample/components/FullSizeSample';
import HalfSizeSample from 'src/modules/cut-full-sample/components/HalfSizeSample';
import QSizeSample from 'src/modules/cut-full-sample/components/QSizeSample';
import AddedToBasket from 'src/modules/cut-full-sample/components/AddedToBasket';
import CalculatorModal from 'theme/components/core/CalculatorModal';
import CutSampleModal from 'theme/components/core/CutSampleModal';
import rating from 'theme/components/core/blocks/Reviews/Rating';
import { mapGetters } from 'vuex';
import NoSSR from 'vue-no-ssr';
import LazyHydrate from 'vue-lazy-hydration';
import { ProductOption } from '@vue-storefront/core/modules/catalog/components/ProductOption.ts';
import {
  getAvailableFiltersByProduct,
  getSelectedFiltersByProduct
} from '@vue-storefront/core/modules/catalog/helpers/filters';
import { isOptionAvailableAsync } from '@vue-storefront/core/modules/catalog/helpers/index';
import {
  localizedRoute,
  currentStoreView
} from '@vue-storefront/core/lib/multistore';
import { htmlDecode } from '@vue-storefront/core/filters';
import { ReviewModule } from '@vue-storefront/core/modules/review';
import { RecentlyViewedModule } from '@vue-storefront/core/modules/recently-viewed';
import {
  registerModule,
  isModuleRegistered
} from '@vue-storefront/core/lib/modules';
import {
  onlineHelper,
  isServer
  // productJsonLd,
} from '@vue-storefront/core/helpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import ProductPrice from 'theme/components/core/ProductPrice.vue';
import { doPlatformPricesSync } from '@vue-storefront/core/modules/catalog/helpers';
import { filterChangedProduct } from '@vue-storefront/core/modules/catalog/events';
import Modal from 'theme/components/core/Modal.vue';
import RecentlyViewedItems from 'theme/components/RecentlyViewedItems';
import axios from 'axios';
import WastePercentToggle from 'theme/components/core/WastePercentToggle';
import { CartService } from '@vue-storefront/core/data-resolver';
import { prepareRelatedQuery } from '@vue-storefront/core/modules/catalog/queries/related';
// import QuickCheckoutModel from 'theme/components/core/blocks/QuickCheckout/QuickCheckoutModel';
import { getThumbnailPath } from '@vue-storefront/core/helpers';
import ReviewItemImageModel from 'theme/components/core/blocks/Reviews/ReviewItemImageModel';
import ColorPicker from "src/themes/bedfactory/components/core/blocks/ColorPicker/ColorPicker"
                         //theme/components/core/blocks/ColorPicker/ColorPicker.vue
export default {
  name: 'ProductPage',
  components: {
      RelatedProducts,
    ColorPicker,
    VinylRecommendedItems,
    WastePercentToggle,
    AddToCart,
    Breadcrumbs,
    ColorSelector,
    GenericSelector,
    ProductAttribute,
    ProductBundleOptions,
    ProductCustomOptions,
    ProductGallery,
    ProductLinks,
    Reviews,
    SizeSelector,
    WebShare,
    LazyHydrate,
    clearancemodal,
    OutOfStockModal,
    RecentlyViewedItems,
    addtobasket,
    Carousel: () => import('vue-carousel').then(Slider => Slider.Carousel),
    Slide: () => import('vue-carousel').then(Slider => Slider.Slide),
    'no-ssr': NoSSR,
    ProductQuantity,
    ProductQuantitySqm,
    ProductPrice,
    Modal,
    CalculatorModal,
    CutSampleModal,
    rating,
    CutSizeSample,
    FullSizeSample,
    HalfSizeSample,
    QSizeSample,
    AddedToBasket,
    ReviewItemImageModel
  },
  mixins: [ProductOption],
  directives: { focusClean },
  beforeCreate() {
    registerModule(ReviewModule);
    registerModule(RecentlyViewedModule);
  },
  data() {
    return {
        sendProductCustomOptions: [],
        colorPickerCheck: false,
      loaded: false,
      reviewData: null,
      cartItems: 0,
      detailsOpen: false,
      maxQuantity: 0,
      quantityError: false,
      isStockInfoLoading: false,
      hasAttributesLoaded: false,
      manageQuantity: true,
      currentGalleryPage: 0,
      showModal: false,
      modalTwo: false,
      calculatorShow: false,
      totalAvailableQA: 0,
      fullSampleButtonDisable: false,
      cutSampleButtonDisable: false,
      halfSampleButtonDisable: false,
      qSampleButtonDisable: false,
      cutSamplePrice: 0,
      hasSamples: false,
      availableSamples: null,
      reviewData: [],
      tileSqmQuantity: 0,
      addWasteRadio: false,
      wastePercentage: 0,
      addWasteRadioCalculator: false,
      availableSamplesTypes: null,
      adhesiveSku: '5K70003',
      groutSku: '6011005A',
      cartDisabledOnQuoteItemBased: false,
      customerPhotosGallery: [],
      reverseSqm: null,
      boxSqm: null,
      reverseTileQty: null,
      similar_products: {
        skus: [],
        items: []
      },
      sqmCheckForModelType: true,
      payload: {
        data: {
          product_id: '',
          item_id: '',
          fixing_type: '',
          applied_material: '',
          grout_width: '',
          total_qty: '',
          sqm: ''
        }
      },
      currentUserTiles: '',
      groutAdhesiveOptions: [],
      tilesQuantity: 0,
      minSqmValue: 0,
      fixing: [],
      madeOf: [],
      groutJoint: [],
      vinylPayload: {
        productId: 0
      },
      vinylProducts: {
        recommend: [],
        skus: [],
        skuItems: [],
        recommendItems: []
      },
      vinylProductPrice: 0,
      vinylRecommendedItemPrice: 0
    };
  },
  computed: {
    ...mapGetters({
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCurrentProduct: 'product/getCurrentProduct',
      getProductGallery: 'product/getProductGallery',
      getCurrentProductConfiguration: 'product/getCurrentProductConfiguration',
      attributesByCode: 'attribute/attributeListByCode',
      getCurrentCustomOptions: 'product/getCurrentCustomOptions',
      productsInCart: 'cart/getCartItems',
      getCartToken: 'cart/getCartToken'
    }),
    perBox() {
      if (this.getCurrentProduct.box_coverage) {
        let box_coverage = this.getCurrentProduct.box_coverage;
        return box_coverage.replace('m2', '');
      } else {
        return this.roundTo(1 / this.getCurrentProduct.qty_per_sqm, 2);
      }
    },
    socialLinksSchema() {
      return config.socialUrlsForSchema ? config.socialUrlsForSchema : '';
    },
    getImageObjJsonLd() {
      return config.schemaUrl.baseUrl
        ? config.schemaUrl.baseUrl +
            this.getImageUrl(this.getCurrentProduct.thumbnail)
        : 'http://tilemountain.co.uk/' +
            this.getImageUrl(this.getCurrentProduct.thumbnail);
    },
    getProductUrl() {
      return config.schemaUrl.baseUrl
        ? config.schemaUrl.baseUrl + this.getCurrentProduct.url_path
        : 'http://tilemountain.co.uk/' + this.getCurrentProduct.url_path;
    },
    getSchemaImageUrl() {
      return config.schemaUrl.baseUrl
        ? config.schemaUrl.baseUrl +
            'img/600/744/resize/catalog/product' +
            this.getCurrentProduct.image
        : 'http://tilemountain.co.uk/' +
            'img/600/744/resize/catalog/product' +
            this.getCurrentProduct.image;
    },
    getVideoObjJsonLd() {
      let videoElement = [];
      if (this.getCurrentProduct.media_gallery) {
        videoElement = this.getCurrentProduct.media_gallery.filter(item => {
          return item.vid;
        });
        if (videoElement.length > 0) {
          return {
            thumbnailUrl: config.schemaUrl.baseUrl
              ? config.schemaUrl.baseUrl +
                this.getImageUrl(videoElement[0].image)
              : 'http://tilemountain.co.uk/' +
                this.getImageUrl(videoElement[0].image),
            contentUrl: videoElement[0].vid.url
          };
        } else {
          return '';
        }
      }
    },
    getWebPageObjJsonLd() {
      return config.schemaUrl.baseUrl
        ? config.schemaUrl.baseUrl +
            this.getImageUrl(this.getCurrentProduct.image)
        : 'http://tilemountain.co.uk/' +
            this.getImageUrl(this.getCurrentProduct.image);
    },
    getProductGalleryCustom() {
      let mediaGallery = [];
      let mediaGallerySame = [];
      if (this.getProductGallery.length > 0) {
        this.getProductGallery.forEach(imgFile => {
          let srcFromPath = imgFile.src.split('product')[1];
          mediaGallerySame.push({
            image: srcFromPath
          });
        });
      }
      return mediaGallerySame;
    },
    similarCutDisabled() {
      if (this.productsInCart && this.productsInCart.length > 0) {
        return (
          this.productsInCart.filter(product => {
            if (
              this.getCurrentProduct.cut_sample_location &&
              product.cut_sample_location &&
              this.getCurrentProduct.cut_sample_location ===
                product.cut_sample_location
            ) {
              return true;
            }
          }).length > 0
        );
      }
      return false;
    },
    getPerSqmPrice() {
      if (this.getCurrentProduct.calculated_sqm_price) {
        return this.roundTo(this.getCurrentProduct.calculated_sqm_price, 2);
      } else {
        return this.roundTo(
          Math.ceil(this.getCurrentProduct.qty_per_sqm) *
            this.getCurrentProduct.price
        );
      }
    },
    getPerSqmNormalPrice() {
      if (
        Math.ceil(this.getCurrentProduct.calculated_sqm_price) !==
        Math.ceil(this.getCurrentProduct.special_price)
      ) {
        return this.roundTo(
          this.getCurrentProduct.qty_per_sqm *
            this.getCurrentProduct.original_price,
          2
        );
      } else {
        return this.roundTo(this.getCurrentProduct.original_price, 2);
      }
    },
    isSampleSelected() {
      return (
        this.fullSampleButtonDisable ||
        this.cutSampleButtonDisable ||
        this.halfSampleButtonDisable ||
        this.qSampleButtonDisable
      );
    },
    currRoute() {
      return this.$route.name;
    },
    getPerTilePrice() {
      return this.roundTo(this.getCurrentProduct.price, 2);
    },
    getOptionLabel() {
      return option => {
        const configName = option.attribute_code
          ? option.attribute_code
          : option.label.toLowerCase();
        return this.getCurrentProductConfiguration[configName]
          ? this.getCurrentProductConfiguration[configName].label
          : configName;
      };
    },
    isOnline(value) {
      return onlineHelper.isOnline;
    },
    minSqmQuantity() {
      if (this.getCurrentProduct.qty_per_sqm) {
        return this.roundTo(1 / this.getCurrentProduct.qty_per_sqm, 2);
      }
    },
    structuredData() {
      const stockText = this.getCurrentProduct.stock_level_text
        ? this.getCurrentProduct.stock_level_text
        : '';
      let stockTextString = '';
      console.log('stockText', stockText, stockText.indexOf('More') !== -1);
      if (
        (stockText.indexOf('Available') !== -1) === true ||
        (stockText.indexOf('available') !== -1) === true ||
        (stockText.indexOf('In Stock') !== -1) === true ||
        (stockText.indexOf('in Stock') !== -1) === true ||
        (stockText.indexOf('in stock') !== -1) === true ||
        (stockText.indexOf('Please call') !== -1) === true
      ) {
        stockTextString = 'InStock';
      } else {
        stockTextString = 'OutOfStock';
      }
      console.log('stockTextString', stockTextString);
      return {
        availability: stockTextString,
        contentUrl: this.validateUrl(this.getCurrentProduct.url_path)
          ? this.getCurrentProduct.url_path
          : this.attachBaseUrl(this.getCurrentProduct.url_path),
        imageUrl: this.getImageUrl(this.getCurrentProduct.image)
      };
    },
    getProductOptions() {
      if (
        this.getCurrentProduct.errors &&
        Object.keys(this.getCurrentProduct.errors).length &&
        Object.keys(this.getCurrentProductConfiguration).length
      ) {
        return [];
      }
      return this.getCurrentProduct.configurable_options;
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
        )
      };
    },
    getCustomAttributes() {
      return Object.values(this.attributesByCode || [])
        .filter(
          a =>
            (parseInt(a.is_visible_on_front) ||
              a.is_visible_on_front === true) &&
            (this.getCurrentProduct[a.attribute_code] ||
              this.getCurrentProduct[a.attribute_code] === 0)
        )
        .sort((a, b) => {
          return a.attribute_id > b.attribute_id;
        });
    },
    getAvailableFilters() {
      return getAvailableFiltersByProduct(this.getCurrentProduct);
    },
    getSelectedFilters() {
      return getSelectedFiltersByProduct(
        this.getCurrentProduct,
        this.getCurrentProductConfiguration
      );
    },
    isSimpleOrConfigurable() {
      return ['simple', 'configurable'].includes(
        this.getCurrentProduct.type_id
      );
    },
    isAddToCartDisabled() {
      if (this.quantityError || this.isStockInfoLoading) {
        return false;
      }

      return (
        this.isOnline &&
        (this.maxQuantity == 0 ? false : !this.maxQuantity) &&
        this.manageQuantity &&
        this.isSimpleOrConfigurable
      );
    },
    storeView() {
      return currentStoreView();
    },
    productTileType() {
      return config.tileTypes;
    },
    getTotalAfterWasteAdded() {
      this.tileSqmQuantity =
        parseFloat(this.tileSqmQuantity) + parseFloat(this.wastePercentage);
    },
    getTotalAfterWasteRemoved() {
      this.tileSqmQuantity =
        parseFloat(this.tileSqmQuantity) - parseFloat(this.wastePercentage);
    }
  },
  async beforeMount() {
    this.vinylFullProductPrice();
    this.$bus.$on('cart-after-update', () => {
      this.disableSampleButton();
    });
    this.$bus.$on('cart-after-itemchanged', cartItem => {
      this.disableSampleButton();
    });
    this.$bus.$on('cart-after-delete', items => {
      // e.stopImmediatePropagation();
      this.disableSampleButton();
    });

    this.$bus.$on('show-samples-modal', bool => {
      this.modalTwo = bool;
    });
  },
  created() {
    var self = this;
    self.$nextTick(function() {
      self.loaded = true;
    });
  },
  async mounted() {
    this.setReviews();
    this.setProductPage();
    this.$bus.$on('sendvalueToCart', value => {
      this.cartItems = value;
    });
    this.tileSqmQuantity = '';
    this.calculateTenPercentwaste();
    await this.getVinylProductItem();
    await this.$store.dispatch(
      'recently-viewed/addItem',
      this.getCurrentProduct
    );
    this.addBloom();
    this.disabledQuoteAddtoCart();
    this.updateHasSamples(this.getCurrentProduct.id)
      .then(({ data }) => {
        if (
          data.code &&
          data.code === 200 &&
          data.result &&
          data.result.length &&
          data.result.length > 0
        ) {
          this.availableSamples = data.result.map(
            ({ sample_type, sample_price }, index) => {
              return { type: sample_type, price: sample_price };
            }
          );
          this.availableSamplesTypes = data.result.map(
            ({ sample_type, sample_price }, index) => {
              return sample_type;
            }
          );
          if (this.availableSamples.length > 0) {
            this.hasSamples = true;
            this.disableSampleButton();
          }
        } else {
          this.hasSamples = false;
          this.availableSamplesTypes = null;
        }
      })
      .catch(err => {
        this.hasSamples = false;
        this.availableSamples = null;
        console.log('hasAnError', err);
      });
    this.getCustomerPhotos();
    this.$bus.$on('samples-successfully-ordered', () => {
      this.disableSampleButton();
    });
    this.getSimilarTiles();

    this.$bus.$on('cartUpdated', payload => {
      // TODO: Update the Samples Button from here.
      if (this.getCartToken) {
        this.updateSampleButtons();
      }
    });
    if (
      this.$store.state.url.prevRoute &&
      this.$store.state.url.prevRoute.name &&
      this.$store.state.url.prevRoute.name.includes('.html') &&
      this.$store.state.url.prevRoute.params
    ) {
      localStorage.setItem(
        'topLevelCategoryPosition',
        this.$store.state.url.prevRoute.params.slug
      );
    }
    // For GTAG
    let primaryCategory = this.getProductPrimaryCategory();
    this.$store.commit('google-gtag/SET_PRODUCT_CURRENT', {
      product: this.getCurrentProduct,
      category: primaryCategory?.[0]?.name
    });
  },
  async asyncData({ store, route, context }) {
    if (context) context.output.cacheTags.add('product');
    const product = await store.dispatch('product/loadProduct', {
      parentSku: route.params.parentSku,
      childSku:
        route && route.params && route.params.childSku
          ? route.params.childSku
          : null
    });
    const loadBreadcrumbsPromise = store.dispatch(
      'product/loadProductBreadcrumbs',
      { product }
    );
    if (isServer) await loadBreadcrumbsPromise;
    catalogHooksExecutors.productPageVisited(product);
  },
  beforeRouteEnter(to, from, next) {
    if (isServer) {
      next();
    } else {
      next(vm => {
        vm.getQuantity();
      });
    }
  },
  watch: {
    isOnline: {
      handler(isOnline) {
        if (isOnline) {
          this.getQuantity();
        }
      }
    },
    currRoute(newVal, oldVal) {
      this.sqmChanged();
      this.addBloom();
      this.$refs.getProductGallery.$refs.carousel.navigate(0);
      if (document.getElementById('prod-gallery-thumbnails-carousel')) {
        const sliderThumb = document
          .getElementById('prod-gallery-thumbnails-carousel')
          .querySelector('.VueCarousel-inner');
        sliderThumb.style.transform = 'translate(0px, 0px)';
      }
      if (newVal !== oldVal) {
        this.$refs.reviewsSection.fetchReviews();
        this.$refs.reviewsSection.fetchQA();

        this.$bus.$emit('modal-hide', 'modal-cutsample');
        this.$bus.$emit('modal-hide', 'modal-clearancemodal');
        // For Quote Sample Buttons
        this.updateSampleButtons();
        this.disabledQuoteAddtoCart();
        this.getCustomerPhotos();
        this.similar_products = {
          skus: [],
          items: []
        };
        this.getSimilarTiles();
        this.tileSqmQuantity = '';

        // For GTAG
        this.setProductPage();
      }
    }
  },
  methods: {
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
    setReviews() {
      try {
        let product_Id = '';

        if ((this.getCurrentProduct.type_id = 'configurable')) {
          product_Id = this.getCurrentProduct.parentId;
        } else {
          product_Id = this.getCurrentProduct.id;
        }
        // const URL =config.reviews.getReviews_endpoint + product_Id
        const URL =
          'https://vue.bedfactorydirect.co.uk/vueapi/ext/reviews/getReview?id=454';
        axios
          .get(URL)
          .then(res => {
            const response = res;
            if (response.status !== 200 && !review.data.length) {
              throw ('Error:', response.data[0].message);
            } else {
              this.reviewData = response.data[1];
              // console.log(this.reviewData,"this.reviewData",this.reviewData.average_score, (parseFloat (this.reviewData.bottomline.average_score)).toFixed(2));
              let average = parseFloat(
                this.reviewData.bottomline.average_score
              ).toFixed(1);
              this.reviewData.bottomline.average_score = average;
              // console.log("this.reviewData",this.reviewData);
            }
          })
          .catch(err => {
            throw ('Error:', err);
          });
      } catch (err) {
        console.error('error message', err);
      }
    },
    getReviews() {
      return this.reviewData;
    },
    vinylFullProductPrice(vinylFullPrice) {
      if (vinylFullPrice) {
        this.vinylRecommendedItemPrice = parseFloat(vinylFullPrice);
        return this.vinylRecommendedItemPrice;
      }
    },
    showVinylPrice(vinylResult, sumTotal) {
      this.vinylProductPrice = parseFloat(vinylResult);
    },
    atcPixel() {
      if (config.bloomreach && BrTrk) {
        BrTrk.getTracker().logEvent('cart', 'click-add', {
          prod_id: config.bloomreach.prefix + this.getCurrentProduct.id,
          sku: this.getCurrentProduct.sku
        });
      }
    },
    addBloom() {
      if (config && config.bloomreach) {
        var br_data = br_data || {};
        br_data.acct_id = config.bloomreach.accountID;
        br_data.ptype = 'product';
        br_data.title =
          this.getCurrentProduct.meta_title || this.getCurrentProduct.name;
        br_data.domain_key = config.bloomreach.domainKey;
        br_data.view_id = config.bloomreach.viewId;
        br_data.test_data = config.bloomreach.testData;
        br_data.prod_id = config.bloomreach.prefix + this.getCurrentProduct.id;
        br_data.prod_name = this.getCurrentProduct.name;
        br_data.sku = this.getCurrentProduct.sku;
        if (typeof BrTrk === 'undefined') {
          var brtrk = document.createElement('script');
          brtrk.type = 'text/javascript';
          brtrk.async = true;
          brtrk.src = `//cdn.brcdn.com/v1/br-trk-${config.bloomreach.accountID}.js`;
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(brtrk, s);
        } else {
          BrTrk.getTracker().updateBrData(br_data);
          BrTrk.getTracker().logPageView();
        }
      }
    },
    sqmQtyCheck({ sqm, tileQty }) {
      this.tileSqmQuantity = sqm;
      this.getCurrentProduct.qty = tileQty;
      this.SqmValUpdated(sqm);
    },
    tileQtyCheck({ tileQty }) {
      this.tilesQuantity = tileQty;
      this.getCurrentProduct.qty = tileQty;
      this.updateTileQty(tileQty);
    },
    async getVinylProductItem() {
      if (
        this.getCurrentProduct &&
        this.getCurrentProduct.filter_type &&
        this.getCurrentProduct.filter_type === 'Pack'
      ) {
        this.vinylPayload.productId = this.getCurrentProduct.id;
        await this.$store
          .dispatch('vinyl/getVinylItems', this.vinylPayload)
          .then(res => {
            if (res.success) {
              if (res.vinyl.recommendations && res.vinyl.underlay) {
                res.vinyl.recommendations.forEach(singleSku => {
                  this.vinylProducts.recommend.push(singleSku);
                });
                res.vinyl.underlay.forEach(singleSku => {
                  this.vinylProducts.skus.push(singleSku);
                });
              }
              this.getVinylItemProducts();
            } else {
              console.log('getVinylProductItemFailed', res);
            }
          });
      }
    },
    async getVinylItemProducts() {
      if (this.vinylProducts.skus && this.vinylProducts.skus.length > 0) {
        let vinylItemsQuery = prepareRelatedQuery(
          'sku',
          this.vinylProducts.skus
        );
        await this.$store
          .dispatch('product/list', {
            query: vinylItemsQuery,
            size: 10,
            prefetchGroupProducts: false,
            updateState: false
          })
          .then(({ items }) => {
            this.vinylProducts.skuItems = items;
          })
          .catch(err => {
            console.log('FailedToFetch vinyl Item Products', err);
          });
      }
      if (
        this.vinylProducts.recommend &&
        this.vinylProducts.recommend.length > 0
      ) {
        let vinylRecommendItemsQuery = prepareRelatedQuery(
          'sku',
          this.vinylProducts.recommend
        );
        await this.$store
          .dispatch('product/list', {
            query: vinylRecommendItemsQuery,
            size: 10,
            prefetchGroupProducts: false,
            updateState: false
          })
          .then(({ items }) => {
            this.vinylProducts.recommendItems = items;
          })
          .catch(err => {
            console.log('FailedToFetch vinyl Recommend Products', err);
          });
      }
    },
    async disabledQuoteAddtoCart() {
      if (
        this.getCartToken &&
        this.getCartToken !== '' &&
        this.getCartToken !== null
      ) {
        const quoteItemData = await CartService.getItems();
        const currentProductSku = this.getCurrentProduct.sku;
        var quoteItem = [];
        if (
          quoteItemData &&
          quoteItemData.result &&
          quoteItemData.result.length > 0
        ) {
          quoteItem = quoteItemData.result.filter(quoteItemInside => {
            if (
              quoteItemInside.extension_attributes &&
              quoteItemInside.extension_attributes.is_vue_quote
            ) {
              return quoteItemInside.sku === currentProductSku;
            }
          });
        }
        this.cartDisabledOnQuoteItemBased = quoteItem && quoteItem.length > 0;
      }
    },
    async getSimilarTiles() {
      for (let attribute in this.getCurrentProduct) {
        if (/rt\d+_sku/.test(attribute) && this.getCurrentProduct[attribute]) {
          this.similar_products.skus.push(this.getCurrentProduct[attribute]);
        }
      }
      if (this.similar_products.skus && this.similar_products.skus.length > 0) {
        let relatedProductsQuery = prepareRelatedQuery(
          'sku',
          this.similar_products.skus
        );

        await this.$store
          .dispatch('product/list', {
            query: relatedProductsQuery,
            size: 10,
            prefetchGroupProducts: false,
            updateState: false
          })
          .then(({ items }) => {
            this.similar_products.items = items.filter(
              i => !i.product_banner_image?.includes('Out_of_Stock')
            );
            // Also update the skus, remove the ones not included in items.
            this.similar_products.skus = this.similar_products.items.filter(i =>
              this.similar_products.skus.includes(i.sku)
            );
          })
          .catch(err => {
            console.log('FailedToFetch Similar Products', err);
          });
      }
    },
    async updateSampleButtons() {
      this.updateHasSamples(this.getCurrentProduct.id)
        .then(({ data }) => {
          if (
            data.code &&
            data.code === 200 &&
            data.result &&
            data.result.length &&
            data.result.length > 0
          ) {
            this.hasSamples = true;
            this.availableSamples = data.result.map(
              ({ sample_type, sample_price }, index) => {
                return { type: sample_type, price: sample_price };
              }
            );
            this.availableSamplesTypes = data.result.map(
              ({ sample_type, sample_price }, index) => {
                return sample_type;
              }
            );
            if (this.availableSamples.length > 0) {
              this.hasSamples = true;
              this.disableSampleButton();
            }
          } else {
            this.hasSamples = false;
            this.availableSamplesTypes = null;
          }
        })
        .catch(err => {
          this.hasSamples = false;
          this.availableSamples = null;
          console.log('hasAnError', err);
        });
    },
    async getProduct() {
      this.product = await this.$store.dispatch('product/single', {
        options: { sku: this.sku },
        setCurrentProduct: false,
        setCurrentCategoryPath: false,
        selectDefaultVariant: false
      });
      this.img = this.product.image;
    },
    productTileTypeUnitCheck(product) {
      let productUnit = '';
      if (product.product_price_type) {
        if (this.productTileType[product.product_price_type] === 'sqm') {
          productUnit = 'm<sup>2</sup>';
        } else if (this.productTileType[product.product_price_type]) {
          productUnit = this.productTileType[product.product_price_type];
        } else {
          productUnit = 'm<sup>2</sup>';
        }
      } else {
        productUnit = 'm<sup>2</sup>';
      }
      return productUnit;
    },
    hideBasketModal() {
      this.showModal = false;
    },
    setProductPage() {
      let primaryCategory = this.getProductPrimaryCategory();
      let productPayload = {
        product: this.getCurrentProduct
      };
      if (primaryCategory && primaryCategory.length > 0 && primaryCategory[0]) {
        productPayload['category'] = primaryCategory[0].name;
      }
      this.$store.commit('google-gtag/SET_PRODUCT_CLICK', productPayload);
    },
    /**
     * will return objects in array with following attributes
     *  category_id: 0000
     *  name: ""
     *  position: 00
     * @returns {boolean|*[]}
     */
    getProductPrimaryCategory() {
      if (
        this.getCurrentProduct &&
        typeof this.getCurrentProduct !== 'undefined' &&
        this.getCurrentProduct.category &&
        typeof this.getCurrentProduct.category !== 'undefined' &&
        this.getCurrentProduct.primary_category
      ) {
        if (typeof this.getCurrentProduct.category === 'object') {
          return Object.keys(this.getCurrentProduct.category)
            .filter(c => {
              return (
                parseInt(this.getCurrentProduct.category[c].category_id) ===
                parseInt(this.getCurrentProduct.primary_category)
              );
            })
            .map(c => ({ ...this.getCurrentProduct.category[c] }));
        }
      }
      return false;
    },
    openFigureGallery() {
      this.$refs.getProductGallery.$refs.carousel.stopVideo();
      document.getElementsByTagName('figure')[0].click();
    },
    openGallery() {
      this.$refs.getProductGallery.$refs.carousel.openOverlay();
      setTimeout(() => {
        document.getElementById('custBtn').click();
      }, 100);
    },
    calculateTenPercentwaste() {
      let sqmQuantity = parseFloat(this.tileSqmQuantity);
      let percent =
        (this.getCurrentProduct.wastage / 100) * sqmQuantity.toFixed(2);
      this.wastePercentage = percent.toFixed(2);
      return percent.toFixed(2);
    },
    async updateHasSamples(productId) {
      let optionsPath = config.sampleQuote.options;
      let apiUrl = config.api.url;
      let cartId = null;
      await this.getCartId()
        .then(r => {
          cartId = r;
        })
        .catch(err => console.log('getCartIdHasErr', err));
      let reqUrl = apiUrl + optionsPath + productId + '/' + cartId;
      return axios.get(reqUrl);
    },
    async getCartId() {
      if (!this.getCartToken) {
        await this.$store.dispatch('cart/createCartId', {
          productToAdd: this.getCurrentProduct
        });
      }
      return this.getCartToken;
    },
    async disableSampleButton() {
      let cartProducts = this.productsInCart;
      if (
        this.getCurrentProduct &&
        this.productsInCart &&
        this.productsInCart.length > 0
      ) {
        let cartProductsSkus = cartProducts.map(
          (product, index) => product.sku
        );
        if (cartProductsSkus && cartProductsSkus.length > 0) {
          if (cartProductsSkus.includes(this.getCurrentProduct.sku)) {
            if (
              this.hasSampleType('cut_size') ||
              this.hasSampleType('full_size') ||
              this.hasSampleType('half_size') ||
              this.hasSampleType('quarter_size')
            ) {
              this.fullSampleButtonDisable = true;
              this.cutSampleButtonDisable = true;
              this.halfSampleButtonDisable = true;
              this.qSampleButtonDisable = true;
            } else {
              this.fullSampleButtonDisable = this.cutSampleButtonDisable = this.halfSampleButtonDisable = this.qSampleButtonDisable = false;
            }
          } else {
            this.fullSampleButtonDisable = this.cutSampleButtonDisable = this.halfSampleButtonDisable = this.qSampleButtonDisable = false;
          }
        } else {
          this.fullSampleButtonDisable = this.cutSampleButtonDisable = this.halfSampleButtonDisable = this.qSampleButtonDisable = false;
        }
      } else {
        this.fullSampleButtonDisable = this.cutSampleButtonDisable = this.halfSampleButtonDisable = this.qSampleButtonDisable = false;
      }
    },
    modalshow() {
      this.showModal = true;
      let x = document.getElementsByTagName('BODY')[0];
      x.style.overflow = 'hidden';
    },
    modalShowTwo() {
      this.modalTwo = true;
    },

    hasSampleType(sample) {
      if (sample && this.availableSamples) {
        let selectedSample = this.availableSamples.filter(
          e => e.type === sample
        );

        if (selectedSample.length === 0) {
          return false;
        }

        return {
          status: selectedSample.length > 0,
          price:
            selectedSample[0].price && selectedSample[0].price != 0
              ? parseFloat(selectedSample[0].price).toFixed(2)
              : null
        };
      }
      return false;
    },
    navigateToReviews() {
      let productReviews = this.$refs.reviewsSection.$refs.productReviews;
      const headerClass = document.getElementsByClassName('header')[0];
      const headerHeight = parseFloat(headerClass.offsetHeight);
      const elementPosition = productReviews.getBoundingClientRect().top;
      const offsetPosition = elementPosition - headerHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      if (screen.width < 991) {
        setTimeout(() => {
          const elementPosition = productReviews.offsetTop;
          const offsetPosition = elementPosition - headerHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 10);
      }
    },
    navigateToQA() {
      let productReviewsQas = this.$refs.reviewsSection.$refs.productQAS;
      const headerClass = document.getElementsByClassName('header')[0];
      const headerHeight = parseFloat(headerClass.offsetHeight);
      const elementPosition = productReviewsQas.getBoundingClientRect().top;
      const offsetPosition = elementPosition - headerHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      if (screen.width < 991) {
        setTimeout(() => {
          const elementPosition = productReviewsQas.offsetTop;
          const offsetPosition = elementPosition - headerHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 10);
      }
    },
    updateReviewsTotals(data) {
      if (data.qas) {
        this.totalAvailableQA = data.qas.length;
      }
    },
    hidemodal() {
      this.showModal = false;
    },
    hideModelQuickCheckout() {
      this.modalTwo = false;
    },
    showDetails(event) {
      this.detailsOpen = true;
      event.target.classList.add('hidden');
    },
    productDetails() {
      var desc = document.getElementsByClassName('productdetail-close')[0];
      desc.classList.toggle('productdetail-show');
      document.getElementById('right-icon').classList.toggle('icon-rotate');
    },
    infoProd() {
      var desc = document.getElementsByClassName('infoprod-close')[0];
      desc.classList.toggle('infoprod-show');
      document
        .getElementById('right-icon-info')
        .classList.toggle('icon-rotate-info');
    },
    show() {
      this.$bus.$emit('modal-show', 'modal-calculator');
      this.addWasteRadioCalculator = false;
    },
    updateSqmQuantity(productQuantity) {
      console.log(
        'productQuantity',
        productQuantity,
        this.getCurrentProduct.qty,
        this.tileSqmQuantity
      );
      this.tileSqmQuantity = this.roundTo(
        productQuantity / this.getCurrentProduct.qty_per_sqm,
        2
      );
      // console.log('neecheay', this.tileSqmQuantity)
     
    },
    forVinyl() {
      this.boxSqm = this.getCurrentProduct.qty;
    },
    notifyOutStock() {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t(
          'The product is out of stock and cannot be added to the cart!'
        ),
        action1: { label: this.$t('OK') }
      });
    },
    pageChange(index) {
      // this.switchCarouselSpeed()
      this.hideImageAtIndex = null;
    },
    addWasteCalculator() {
      this.addWasteRadioCalculator = !this.addWasteRadioCalculator;
      if (this.addWasteRadioCalculator) {
        document
          .getElementById('wastage wastage-btn')
          .classList.add('addWaste');
      } else {
        document
          .getElementById('wastage wastage-btn')
          .classList.remove('addWaste');
      }
      if (this.addWasteRadioCalculator) {
        this.getTotalAfterWasteAdded;
        this.SqmValUpdated(this.tileSqmQuantity.toFixed(2), false);
      }
      if (!this.addWasteRadioCalculator) {
        this.getTotalAfterWasteRemoved;
        this.SqmValUpdated(this.tileSqmQuantity.toFixed(2), false);
      }
    },
    UpdateSqmFromModal(sqmQuantity) {
      this.tileSqmQuantity = sqmQuantity;
      this.SqmValUpdated(sqmQuantity);
    },
    SqmValUpdated(sqmQuantity, wasteCheck = true) {
      if (sqmQuantity === '') {
        if (
          this.getCurrentProduct &&
          this.getCurrentProduct.filter_type &&
          this.getCurrentProduct.filter_type === 'Pack'
        ) {
          let vinylAccessories = document.getElementById(
            'vinyl-accessories-box'
          );
          if (vinylAccessories && vinylAccessories.classList) {
            vinylAccessories.classList.remove('transform-active-vinyl');
          }
        }
        let wasteArea = document.getElementById('wastage-main-box');
        if (wasteArea && wasteArea.classList) {
          wasteArea.classList.remove('transform-active');
        }
      } else {
        if (
          this.getCurrentProduct &&
          this.getCurrentProduct.filter_type &&
          this.getCurrentProduct.filter_type === 'Pack'
        ) {
          let vinylAccessories = document.getElementById(
            'vinyl-accessories-box'
          );
          if (vinylAccessories && vinylAccessories.classList) {
            vinylAccessories.classList.add('transform-active-vinyl');
          }
        }
        let wasteArea = document.getElementById('wastage-main-box');
        if (wasteArea && wasteArea.classList) {
          wasteArea.classList.add('transform-active');
        }
      }
      if (!sqmQuantity || parseFloat(sqmQuantity) === 0) {
        this.productQuantityFloat = 1;
        this.getCurrentProduct.qty = 1;
        return false;
      }
      let classCheckOnPrice1 = document.getElementById('hidePriceOnLoadPage');
      // if (classCheckOnPrice1) {
      //   classCheckOnPrice1.classList.contains('hide')
      // }
      if (classCheckOnPrice1) {
        classCheckOnPrice1.classList.remove('hide');
      }
      if (wasteCheck) {
        this.sqmChanged();
      }
      this.tileSqmQuantity = sqmQuantity;
      if (wasteCheck) {
        this.calculateTenPercentwaste();
      }
      this.updateTileQty(sqmQuantity);
      this.forVinyl();
    },
    sqmChanged() {
      if (document.getElementById('wastage wastage-btn')) {
        let classCheck = document
          .getElementById('wastage wastage-btn')
          .classList.contains('addWaste');
        if (classCheck && this.addWasteRadio) {
          document.getElementById('wastage wastage-btn').checked = false;
          document
            .getElementById('wastage wastage-btn')
            .classList.remove('addWaste');
          this.addWaste();
        }
      }
    },
    addWaste() {
      this.addWasteRadio = !this.addWasteRadio;
      if (this.addWasteRadio) {
        document
          .getElementById('wastage wastage-btn')
          .classList.add('addWaste');
      } else {
        document
          .getElementById('wastage wastage-btn')
          .classList.remove('addWaste');
      }

      if (this.addWasteRadio) {
        this.reverseSqm = this.tileSqmQuantity;
        this.reverseTileQty = this.getCurrentProduct.qty;
        this.getTotalAfterWasteAdded;
        this.SqmValUpdated(this.tileSqmQuantity.toFixed(2), false);
      }
      if (!this.addWasteRadio) {
        this.tileSqmQuantity = this.reverseSqm;
        this.getCurrentProduct.qty = this.reverseTileQty;
        // this.getTotalAfterWasteRemoved
        // this.SqmValUpdated(this.tileSqmQuantity.toFixed(2), false)
      }
    },
    updateTileQty(sqmQuantity) {
      if (isNaN(sqmQuantity)) {
        this.productQuantityFloat = 1;
        this.updateProductQuantityForFront();
        return;
      }
      this.productQuantityFloat =
        this.getCurrentProduct.qty_per_sqm * sqmQuantity;
      this.updateProductQuantityForFront();
    },
    updateProductQuantityForFront() {
      this.getCurrentProduct.qty = Math.ceil(this.productQuantityFloat);
      this.tilesQuantity = Math.ceil(this.productQuantityFloat);
    },
    tileQtyUpdated(event) {
      this.tilesQuantity = event;
      this.updateSqmQuantity(event);
      this.calculateTenPercentwaste();
      this.sqmChanged();
      let classCheckOnPrice = document
        .getElementById('hidePriceOnLoadPage')
        .classList.contains('hide');
      if (classCheckOnPrice) {
        document.getElementById('hidePriceOnLoadPage').classList.remove('hide');
      }
      if (this.tilesQuantity === '') {
        if (
          this.getCurrentProduct &&
          this.getCurrentProduct.filter_type &&
          this.getCurrentProduct.filter_type === 'Pack'
        ) {
          let vinylAccessories = document.getElementById(
            'vinyl-accessories-box'
          );
          if (vinylAccessories && vinylAccessories.classList) {
            vinylAccessories.classList.remove('transform-active-vinyl');
          }
        }
        let wasteArea = document.getElementById('wastage-main-box');
        if (wasteArea && wasteArea.classList) {
          wasteArea.classList.remove('transform-active');
        }
      } else {
        if (
          this.getCurrentProduct &&
          this.getCurrentProduct.filter_type &&
          this.getCurrentProduct.filter_type === 'Pack'
        ) {
          let vinylAccessories = document.getElementById(
            'vinyl-accessories-box'
          );
          if (vinylAccessories && vinylAccessories.classList) {
            vinylAccessories.classList.add('transform-active-vinyl');
          }
        }
        let wasteArea = document.getElementById('wastage-main-box');
        if (wasteArea && wasteArea.classList) {
          wasteArea.classList.add('transform-active');
        }
      }

      // wasteArea.style.display = "block"
    },
    roundTo(n, digits) {
      var negative = false;
      if (digits === undefined) {
        digits = 0;
      }
      if (n < 0) {
        negative = true;
        n = n * -1;
      }
      var multiplicator = Math.pow(10, digits);
      n = parseFloat((n * multiplicator).toFixed(11));
      n = (Math.round(n) / multiplicator).toFixed(2);
      if (negative) {
        n = (n * -1).toFixed(2);
      }
      return n;
    },
    notifyWrongAttributes() {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t(
          'No such configuration for the product. Please do choose another combination of attributes.'
        ),
        action1: { label: this.$t('OK') }
      });
    },
    getSingleAttributeLabel(code, val) {
      const attributName =
        this.attributesByCode && this.attributesByCode[code]
          ? this.attributesByCode[code].options
          : null;
      let attrFinalLabel;
      if (attributName) {
        attributName.map(attrFinal => {
          if (val === parseInt(attrFinal.value)) {
            attrFinalLabel = attrFinal.label;
          }
        });
      }
      return attrFinalLabel;
    },
    validateUrl(str) {
      let pattern = /^((http|https):\/\/)/;
      return pattern.test(str);
    },
    attachBaseUrl(str) {
      if (config.server.baseUrl) {
        return config.server.baseUrl + '/' + str;
      }
      return str;
    },
    getImageUrl(img) {
      if (!img) {
        return '';
      }

      let subPathImg = 'img/250/250/resize/catalog/product';
      if (!this.validateUrl(img)) {
        return subPathImg + img;
      }
    },
    async changeFilter(variant) {
      const selectedConfiguration = Object.assign(
        { attribute_code: variant.type },
        variant
      );
      await filterChangedProduct(
        selectedConfiguration,
        this.$store,
        this.$router
      );
      this.getQuantity();
    },
    openSizeGuide() {
      this.$bus.$emit('modal-show', 'modal-sizeguide');
    },
    isOptionAvailable(option) {
      // check if the option is available
      const currentConfig = Object.assign(
        {},
        this.getCurrentProductConfiguration
      );
      currentConfig[option.type] = option;
      return isOptionAvailableAsync(this.$store, {
        product: this.getCurrentProduct,
        configuration: currentConfig
      });
    },
    async getQuantity() {
      if (this.isStockInfoLoading) return; // stock info is already loading
      this.isStockInfoLoading = true;
      try {
        if (config.products.alwaysSyncPricesClientSide) {
          doPlatformPricesSync([this.getCurrentProduct]);
        }
        const res = await this.$store.dispatch('stock/check', {
          product: this.getCurrentProduct,
          qty: this.getCurrentProduct.qty
        });

        this.manageQuantity = res.isManageStock;
        this.maxQuantity =  res.qty ;
        this.maxSqmQuantity = this.getCurrentProduct.maxsqmquantity;
      } finally {
        this.isStockInfoLoading = false;
      }
    },
    handleQuantityError(error) {
      this.quantityError = error;
    },
    async getCustomerPhotos() {
      const customerPhotosRes = await this.$store.dispatch(
        'customerphotos/customerPhotosFunction',
        {
          product_id: this.getCurrentProduct.id
        }
      );
      if (
        customerPhotosRes &&
        customerPhotosRes.status === 200 &&
        customerPhotosRes.errors === false
      ) {
        const responseUrlObject = customerPhotosRes.urls.map(imgGallery => {
          return {
            src: imgGallery
            // src: this.getThumbnail(
            //   imgGallery,
            //   config.galleryZoomImageSize.width,
            //   config.galleryZoomImageSize.height
            // ),
            // error: this.getThumbnail(
            //   imgGallery,
            //   config.galleryZoomImageSize.width,
            //   config.galleryZoomImageSize.height
            // ),
            // loading: this.getThumbnail(
            //   imgGallery,
            //   config.galleryZoomImageSize.width,
            //   config.galleryZoomImageSize.height
            // )
          };
        });
        this.customerPhotosGallery = responseUrlObject;
      } else {
        this.customerPhotosGallery = [];
      }
    }
  },
  metaInfo() {
    const storeView = currentStoreView();
    let metaDescription = this.getCurrentProduct.description
      ? this.getCurrentProduct.description.replace(/<\/?[^>]+(>|$)/g, '')
      : '';
    let metaLength = 233;
    if (metaDescription) {
      metaDescription =
        metaDescription.length > metaLength
          ? metaDescription.substring(0, metaLength - 3) + '...'
          : metaDescription;
    }
    let metaData = [
      {
        property: 'og:url',
        content: this.getCurrentProduct.canonical_url
          ? this.getCurrentProduct.canonical_url
          : '/' + this.getCurrentProduct.url_path
      },
      {
        property: 'og:title',
        content: htmlDecode(
          this.getCurrentProduct.meta_title || this.getCurrentProduct.name
        )
      },
      {
        property: 'og:type',
        content: 'website'
      },
      {
        property: 'og:description',
        content: this.getCurrentProduct.meta_description
          ? this.getCurrentProduct.meta_description
          : metaDescription
      },
      {
        property: 'og:image',
        content:
          config.images.baseUrl +
          '1200/630/resize/catalog/product' +
          (this.getCurrentProduct.google_feed_img
            ? this.getCurrentProduct.google_feed_img
            : this.getCurrentProduct.image)
      }
    ];

    if (this.getCurrentProduct.meta_description) {
      metaData.push({
        vmid: 'description',
        name: 'description',
        content: this.getCurrentProduct.meta_description
      });
    } else {
      metaData.push({
        vmid: 'description',
        name: 'description',
        content: metaDescription
      });
    }

    return {
      link: [
        {
          rel: 'canonical',
          href: this.getCurrentProduct.canonical_url
            ? this.getCurrentProduct.canonical_url
            : '/' + this.getCurrentProduct.url_path
        }
      ],
      title: htmlDecode(
        this.getCurrentProduct.meta_title || this.getCurrentProduct.name
      ),
      titleTemplate: htmlDecode('%s'),
      meta: metaData
    };
  }
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
.abc {
  height: 50px;
  width: 50px;
  background-color: #ffffff;
}

.block {
  cursor: pointer;
}

.youtubeIcon {
  background: url(/assets/images/youtube.png) center center no-repeat;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  z-index: 2000;
  cursor: pointer;
}

.tile_price {
  font-size: 23px !important;
  color: #4a4a4a !important;
}

.transform {
  -webkit-transition: all 1s ease;
  -moz-transition: all 1s ease;
  -o-transition: all 1s ease;
  -ms-transition: all 1s ease;
  transition: all 1s ease;
  overflow: hidden;
}

.transform-active {
  height: 81px !important;
  @media (max-width: 767px) {
    height: 96px !important;
  }
}

.transform-active-vinyl {
  height: 215px !important;
  @media (max-width: 767px) {
    height: 96px !important;
  }
}

.wastage-main-box {
  padding: 0px;
  height: 0;
}

@media screen and (min-width: 768px) {
  .margan {
    margin-top: 146px !important;
  }
}

.product {
  &__add-to-compare {
    display: none;
    @media (min-width: 767px) {
      display: block;
    }
  }
}

.breadcrumb {
  padding: 23px 0;
  padding-left: 21px;
  @media (max-width: 991px) {
    padding-left: 44px;
  }
}

.breadcrumbs {
  @media (max-width: 767px) {
    margin: 15px 0;
    padding: 15px 0 0 15px;
  }
}

.productGalleryMain {
  display: flex;

  .productGallery {
    position: relative;
    flex-basis: 84%;
    max-width: 84%;
  }

  .Viewgallery {
    display: flex;

    a {
      padding-top: 55px;
      font-family: Arial;
      font-weight: bold;
      color: #29275b;
      cursor: pointer;
      font-size: 15px;
      text-decoration: underline;
    }
  }

  @media (max-width: 1199px) and(min-width: 992px) {
    .Viewgallery {
      a {
        font-size: 12px;
      }
    }
  }
  @media (max-width: 767px) {
    display: none;
  }
}

.error {
  color: red;
  font-weight: bold;
  padding-bottom: 15px;
  display: none;
}

.image {
  @media (max-width: 1023px) {
    margin-bottom: 20px;
  }
}

.product-name {
  @media (max-width: 767px) {
    font-size: 36px;
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
    max-height: 100%;
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
    position: relative;
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

.product-top-section {
  background: #fff;

  .product-detail {
    .product-detail-inner {
      margin: 0px -8px;
      border: 1px solid #cccccc;
      margin-top: 3px;
      border-radius: 10px;
    }
  }

  .product-image-box {
    padding: 0px 30px 0px 0px;
  }

  .product-head {
    padding: 20px 40px 15px 40px;

    .product-name {
      font-family: Oblik;
      color: #4a4a4a;
      font-size: 1.6rem;
      line-height: 1.3;
      width: 100%;
      margin-bottom: 10px;
    }

    .rating {
      margin-bottom: 10px;

      ul {
        padding: 0;
        list-style: none;
        margin: 0;

        li {
          display: inline-block;

          .fa {
            color: #FFD055;
            font-size: 20px;
          }
        }
      }

      ul,
      span,
      .qa {
        display: inline-block;
        cursor: pointer;
      }

      .reviews {
        margin: 0 10px 0 5px;
        font-family: Arial;
        font-size: 14px;
        color: #828282;
        cursor: pointer;
      }

      .qa {
        font-family: Arial;
        font-size: 14px;
        color: #dc2f89;

        :hover {
          text-decoration: none;
        }

        :after {
          background-color: transparent !important;
        }
      }
    }

    .size-value,
    .sku-value {
      color: #828282;
      display: inline-block;
      font-family: Arial;
      font-size: 0.815rem;
      font-weight: bold;
    }

    .sku-value-top,
    .size-value {
      display: inline-block;
    }

    .sku-value-top {
      margin-left: 20px;
      margin-bottom: 10px;
    }

    .sku-value-top.no-size {
      margin-left: 0px;
    }

    .sqm {
      color: #09a99d;
      font-weight: bold;
      font-family: Arial;
      font-size: 0.875rem;
      text-align: right;
      float: right;
    }
  }

  .sample-detail {
    padding: 30px 40px;
    border-bottom: 1px solid #cccccc;
  }

  .product-pricing {
    padding: 0px 40px 0px 40px;

    .mb40 {
      margin-bottom: 0px;
    }
  }

  .hidden-tiles-price {
    display: none;
  }
}

a:not(.no-underline):hover:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: transparent;
}

.product-desc {
  padding-bottom: 0;

  h2 {
    font-size: 1.75rem;
    color: #4a4a4a;
    font-family: Oblik;
    padding: 0px;
  }

  // .details-wrapper {
  //   margin-top: 50px;
  // }

  .lh30 {
    line-height: 25px;
    font-size: 13px !important;
    color: #4a4a4a;
    font-family: Arial;
    display: block;
  }
}

.base-input-number {
  &__input {
    border-style: solid;
    border-width: 0 0 1px 0;
    width: 50px;
    height: 1.4rem;
    line-height: 1.7rem;
    @media (min-width: 768px) {
      height: 1.7rem;
    }
  }

  &__label {
    font-size: 0.8rem;
    line-height: 1.2rem;
    @media (min-width: 768px) {
      font-size: 1rem;
      line-height: 1.4rem;
    }
  }
}

.tile-quantity {
  input {
    border: 3px solid #2a275c;
    background: #fff;
    width: 60px;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    height: 38px;
    border-radius: 10px;
  }

  .sqm-txt {
    margin-left: 10px;
    font-family: oblik;
    text-transform: uppercase;
    color: #4a4a4a;
    font-size: 16px;
  }
  .tile-txt {
    margin-left: 10px;
    font-family: oblik;
    color: #4a4a4a;
    font-size: 16px;
  }
}
.calculator {
  margin-top: 15px;
  float: right;
}

.cal-img {
  margin: 0 auto;
  display: table;
  cursor: pointer;
}

.calculateTxt {
  font-size: 10px;
  text-decoration: underline;
  font-family: Arial;
  text-align: center;
  display: block;
  margin-top: 5px;
  cursor: pointer;
}

// #wastage-main-box {
//   display: none;
// }

.add-to-cart {
  padding: 20px 30px;
}

.vinyl-products-detail {
  padding: 17px 40px 13px 40px;
  height: 100%;
  -webkit-transition: all 1s ease;
  -o-transition: all 1s ease;
  transition: all 1s ease;
  overflow: hidden;
  border-bottom: 1px solid #cccccc;
  //height: 0;
}

.vinyl-products-detail {
  padding: 17px 40px 13px 40px;
  border-bottom: 1px solid #cccccc;
}

.price-infos .cl-mine-shaft {
  color: #2a275c;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 2rem;
  line-height: 1.5;
}

.price-infos .old-price .sale-info {
  margin-top: 5px;
  display: block;
}

.price-infos {
  .sale-price {
    .sale-info-special {
      font-size: 14.88px;
      color: #484340;
      font-family: Arial;
      text-decoration: line-through;
      padding-top: 8px;
      padding-left: 20px;
    }

    .salelineprice {
      font-size: 14.88px;
      color: #484340;
      font-family: Arial;
    }

    .sale-title {
      font-size: 16px;
      color: #d20505;
      font-family: Arial;
      display: none;
    }

    .specialprice {
      font-size: 25px;
      color: #d20505;
      font-weight: bold;
      font-family: Arial;
    }

    .sqm-title-special {
      font-size: 16px;
      color: #d20505;
      font-family: Arial;
    }
  }
}

.price-infos .cl-mine-shaft,
.price-infos .sqm-title {
  display: inline-block;
  margin-bottom: 10px;
  width: 40%;
}

.price-infos .sqm-title {
  margin-left: 10px;
  font-family: Arial, Helvetica, sans-serif;
  //text-transform: uppercase;
  color: #4a4a4a;
  font-size: 16px;
  font-weight: 700;
}

.price-infos .tile-title {
  margin-left: 10px;
  font-family: oblik;
  color: #4a4a4a;
  font-size: 16px;
}

.add-to-cart .mb40 {
  margin-bottom: 0px;
}

.add-to-cart button {
  background-attachment: scroll;
  background-clip: border-box;
  background-color: #29275b;
  background-image: url(../assets/images/add-to-basket.jpg);
  background-origin: padding-box;
  background-position: 14% 45%;
  background-repeat: no-repeat;
  background-size: auto auto;
  border: 2px solid #29275b;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
  display: block;
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
  margin-top: 5px;
  float: right;
  @media (max-width: 767px) {
    background-position: 29% 45%;
    padding-bottom: 11px;
  }
  @media (max-width: 400px) {
    background-position: 27% 45%;
  }
  @media (max-width: 350px) {
    background-position: 22% 45%;
  }
}

.products-buttons {
  padding: 15px 0;
  padding-top: 26px;

  .customer-photos {
    display: none;
    background: #8c85c9 url(../assets/images/customer-photos.png) no-repeat
      scroll 15% 50%;
    -webkit-border-image: none;
    -o-border-image: none;
    border-image: none;
    color: #fff;
    font-family: Arial;
    font-size: 14px;
    position: relative;
    text-align: right;
    top: 10px;
    width: 95%;
    font-weight: bold;
    cursor: pointer;
    padding: 17px 20px 17px 0px;
    text-transform: uppercase;
    border-radius: 3px;
    float: left;
    border: none;
  }

  // .visualisetiles{
  //     flex-basis: 100%;
  //     max-width: 94%;
  // }
  .visualise-tiles {
    background: #29b0f1 url(/dist/visualise.png?d9770c1…) no-repeat scroll 24%
      50%;
    -webkit-border-image: none;
    -o-border-image: none;
    border-image: none;
    color: #fff;
    font-family: Arial;
    font-size: 14px;
    /* position: relative; */
    text-align: center;
    /* top: 10px; */
    width: 100%;
    max-width: 512px;
    font-weight: bold;
    cursor: pointer;
    padding: 17px 0 17px 0px;
    text-transform: uppercase;
    border-radius: 3px;
    /* float: right; */
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.information-prod {
  width: 70%;
  float: right;
  background: #ededed;
  padding-bottom: 5px;

  h2 {
    font-size: 20px;
    font-family: oblik;
    margin: 25px 20px;
  }

  ul {
    padding: 0px 5px;

    li {
      padding: 10px 15px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14px;

      .detail {
        float: right;
        font-weight: 500;
      }
    }

    li:nth-child(odd) {
      background: #fff;
    }
  }
}

.price-infos.sale {
  display: block;

  .old-price {
    margin-top: -5px;

    .sale-info {
      text-decoration: line-through;
      display: inline-table;

      .cl-mine-shaft {
        font-size: 14px;
        font-weight: 500;
        color: #4a4a4a;
      }

      .sqm-title {
        margin-left: 0px;
        text-transform: lowercase;
        font-size: 14px;
        font-weight: 100 !important;
        font-family: Oblik-regular;
        color: #4a4a4a;
      }
    }
  }

  .sale-price {
    margin-top: -8px;
    margin-bottom: 9px;

    .sale-title {
      font-family: Oblik-regular;
      color: #a1170c;
    }

    .cl-mine-shaft {
      font-size: 22px;
      font-weight: 700;
      color: #a1170c !important;
    }

    .sqm-title {
      margin-left: 0px;
      text-transform: lowercase;
      font-size: 16px;
      font-weight: 100 !important;
      font-family: Oblik-regular;
      color: #a1170c;
    }
  }
}

.price-infos.sale .cl-mine-shaft,
.price-infos.sale .sqm-title {
  display: inline;
}

.price-infos .sale-price {
  display: flex;
}

.price-infos.sale .sale-price {
  display: block;
}

.border-grey-light {
  border: 2px solid #2e525a6e;
}

.border-blue {
  border: 2px solid #29275b;
}

.product-quantity {
  padding-top: 7px;
 /* margin-left: 12px;*/
}

.recent {
  font-family: oblik;
  text-align: center;
  font-size: 1.75rem;
  color: #4a4a4a;
  margin-top: 84px;
  @media (max-width: 767px) {
    font-size: 18px;
    margin-top: 0;
  }
}

.recently-viewed-items-contain {
  padding-bottom: 50px;
}

.mobile-cal-btn {
  display: none;
}

.adhesive-qty {
  /*float: right;*/
}

.product-slider {
  .media-gallery {
    margin-bottom: 10px;
  }
}

.vinyl-product-support p {
  color: #c1c1c1;
  font-size: 14px;
  width: 230px;
  margin: 5px 0 0 0;
  display: block;
}

@media (min-width: 767px) {
  .price-infos .cl-mine-shaft .each {
    display: none;
  }
}

@media (min-width: 600px) and (max-width: 767px) {
  .product-desc h2 {
    background: #dedad9;
    font-size: 22px !important;
    padding: 20px 23px;
    padding: relative;
    border-bottom: 2px solid #ffffff;
  }
}

@media (max-width: 767px) {
  .product-top-section {
    .product-image-box {
      padding: 0px 25px;
      margin-bottom: 0px;
    }

    .prod-gallery-thumbnails-carousel {
      display: none;
    }
  }
  .product-slider .media-gallery {
    margin-bottom: 0px;
  }
  // .product-slider .bt-product-gallery {
  //   position: relative;
  //   padding-bottom: 100%;
  // }
  // .product-slider .media-gallery {
  // margin-bottom: 0px;
  // width: 100%;
  // height: auto;
  // position: absolute;
  // transform: translate(-50%, -50%);
  // top: 50%;
  // left: 50%;
  // }
  .product-top-section {
    padding: 0px;

    .container {
      padding: 0px;
    }

    .product-detail {
      padding: 0px;

      .product-detail-inner {
        margin: 10px 0 0 0;
        border: none;
      }

      .product-head {
        border: none;
        padding: 0px 24px;

        .product-name {
          font-size: 1.6rem;
        }

        .rating {
          display: none;
        }

        .sku-value-top {
          display: none;
        }

        .sku-value-top.no-size {
          display: block;
        }
      }
    }

    .sample-detail {
      padding: 20px 26px 30px 26px;

      .row {
        position: relative;

        .free-cut-sample {
          position: relative;
          width: 100%;
        }

        .full-size-sample {
          margin: 10px 0px 15px 0px;
          order: 1;
        }

        .order-sample-cut {
          width: 100%;
        }

        .order-sample-full {
          width: 100%;
        }
      }
    }

    .product-pricing {
      padding: 15px 0px 5px 0px;
    }

    .adhesive-product-pricing.product-pricing {
      border-top: 1px solid #cccccc;
    }

    .adhesive-product-pricing .price-infos .cl-mine-shaft {
      margin-top: 10px;
    }

    .price-infos {
      padding-left: 5px;

      .sqm-title {
        text-transform: lowercase;
        margin-left: 0px;
      }

      .old-price {
        margin-top: 7px;

        .sale-info {
          margin-top: 15px;
        }
      }
    }

    .price-infos {
      .sale-price {
        padding-left: 4px;

        .sale-info-special {
          font-size: 13px;
        }

        .salelineprice {
          font-size: 13px;
        }

        .sqm-titlespecial {
          font-size: 13px;
        }

        .salepriceshow {
          .sale-title {
            font-size: 13px;
          }

          .specialprice {
            font-size: 20.5px;
          }

          .sqm-title-special {
            font-size: 13px;
          }
        }
      }
    }

    .product-quantity {
      padding-top: 0px;
      float: right;
      margin-left: 0px;
    }

    .border-sqm-bottom.first-child {
      padding-right: 0px;
      padding-bottom: 0px;
    }

    .border-sqm-bottom {
      border-bottom: 1px solid #cccccc;
      margin-bottom: 15px;
      padding-bottom: 15px;
      padding-right: 25px;
      padding-left: 25px;

      .price-infos .cl-mine-shaft {
        font-size: 1.8rem;
      }
    }

    .border-tile-bottom.first-child {
      padding-right: 0px;
    }

    .border-tile-bottom {
      padding-right: 25px;
      padding-left: 25px;

      .price-infos .cl-mine-shaft {
        font-size: 1.6rem;
        color: #333;
      }
    }

    .products-buttons {
      display: none;
    }

    .add-to-cart {
      padding: 20px 18px;
      padding-top: 16px;
      padding-left: 0;
      padding-right: 0;

      .h3 {
        display: block;
        margin: auto;
        text-align: center;
      }

      button {
        max-width: 100%;
        border-radius: 8px;
        width: 100%;
      }

      .sqm-title {
        text-align: center;
        display: block;
      }

      .mobile-cal-btn {
        display: block;
        border-radius: 8px !important;
        background-color: transparent;
        border: 2px solid #29275b;
        border-radius: 3px;
        color: #29275b;
        cursor: pointer;
        font-size: 14px;
        text-align: center;
        width: 100%;
        font-family: Arial;
        line-height: auto;
        font-weight: bold;
        padding: 15px 0px;
        // text-transform: uppercase;
        margin-top: 67px;
      }
    }
  }
  .how-may-need {
    display: none;
  }
  .infoprod-col {
    padding: 0px;
  }
  .information-prod {
    width: 100%;
    background: transparent;
    padding-bottom: 0px;

    h2 {
      margin: 0px;
      padding: 18px 24px;
      background: #dedad9;
      font-size: 22px;
    }

    .infoprod-close {
      display: none;
    }

    .infoprod-show {
      display: block !important;
      padding: 20px;
    }

    #right-icon-info {
      background: url(/assets/images/up.png) no-repeat;
      width: 25px;
      float: right;
      margin-top: 5px;
      position: absolute;
      right: 23px;
      height: 25px;
    }

    .icon-rotate-info {
      background: url(/assets/images/down.png) no-repeat !important;
    }

    ul {
      padding: 10px 5px;
      background: #ededed;
    }
  }
  .price-infos.sale {
    .sale-price {
      .cl-mine-shaft {
        font-size: 16px;
      }
    }
  }
  .product-desc {
    padding: 20px 0px 0px 0px;
    margin: 0px;
    padding-top: 5px;

    h2 {
      background: #dedad9;
      font-size: 4.267vw;
      padding: 20px 23px;
      padding: relative;
      border-bottom: 2px solid #ffffff;
    }

    .productdetail-col {
      padding: 0px;
    }

    .productdetail-close {
      display: block;
      padding: 20px;
    }

    .productdetail-show {
      display: block !important;
      padding: 20px;
    }

    #right-icon {
      background: url(/assets/images/up.png) no-repeat;
      width: 25px;
      float: right;
      margin-top: 5px;
      position: absolute;
      right: 23px;
      height: 25px;
    }

    .icon-rotate {
      background: url(/assets/images/down.png) no-repeat !important;
    }
  }

  .product-page-detail {
    display: flex;
    flex-flow: column;
  }

  .product-reviews {
    -webkit-order: 1;
  }
  .recently-viewed-items-contain {
    -webkit-order: 2;
    min-width: 100%;
    max-width: 100%;
  }

  .product-reviews {
    order: 1;
  }
  .recently-viewed-items-contain {
    order: 2;
    min-width: 100%;
    max-width: 100%;
  }
  .total-amount {
    display: block;
    padding: 0;
    border-bottom: 1px solid #cccccc;
  }
  .add-to-cart .mb40 {
    margin-bottom: 0px;
    padding-bottom: 12px;
  }
  .addtocartbuttonMobile {
    padding-top: 17px;
  }
  .price-infos .cl-mine-shaft,
  .price-infos .sqm-title {
    width: auto;
  }
  .price-infos-adhesive {
    .sale-info {
      margin-top: 8px !important;
    }
  }
  .price-infos .cl-mine-shaft .each {
    font-size: 20px;
    font-weight: 500;
  }
  .q-size-sample {
    margin-top: 15px;
  }
  .half-size-sample {
    margin-top: 20px;
  }
  .vinyl-product-support {
    order: 2;
  }
  .vinyl-product-support p {
    width: 100%;
    margin-top: 15px;
    font-size: 2.78vw;
  }
}

@media (min-width: 767px) and (max-width: 991px) {
  .product-top-section .sample-detail .order-sample-cut {
    float: none;
    margin-top: 10px;
    min-height: 40px;
  }
  .adhesive-qty {
    float: none;
  }
  .product-top-section .product-head .product-name {
    font-size: 1.5rem;
  }
  .product-top-section .product-head .sqm {
    margin-bottom: 10px;
    display: block;
  }
  .wastage-detail .on,
  .wastage-detail .off {
    font-size: 12px;
    left: -87px;
    min-width: 275px;
    top: 50%;
  }
  .wastage-detail .slider:before {
    bottom: 2.7px;
  }
  .wastage-detail .wastage-amount {
    margin-left: 73px;
  }
  .wastage-detail .wastage {
    right: 36%;
  }
  .add-to-cart button {
    float: none;
    max-width: 100%;
  }
  .price-infos .cl-mine-shaft,
  .price-infos .sqm-title {
    width: auto;
  }
  .product-top-section .sample-detail .order-sample-full {
    width: 100%;
  }
  .product-top-section .sample-detail .order-sample-cut {
    width: 100%;
  }
  .add-to-cart .mb40 {
    text-align: center;
  }
  .add-to-cart .col-margin {
    margin: auto;
  }
  .border-sqm-bottom .price-infos {
    float: right;
    margin-right: 50px;
  }
  .border-tile-bottom .price-infos {
    float: right;
    margin-right: 50px;
  }
  .product-desc {
    .product-top-section .product-head .size-value,
    .product-top-section .product-head .sku-value {
      color: #4a4a4a;
      display: inline-block;
      font-family: Arial;
      font-size: 12px;
      font-weight: bold;
    }
  }
  .q-size-sample {
    margin-top: 20px;
  }
  .half-size-sample {
    margin-top: 25px;
  }
  .products-buttons {
    padding: 15px 45px;
  }
  .products-buttons .visualise-tiles {
    width: 95%;
    padding: 17px 18px 17px 0px;
  }
  .vinyl-product-support p {
    width: 100%;
  }
}

@media (min-width: 991px) and (max-width: 1200px) {
  .product-top-section .sample-detail .order-sample-full span {
    font-size: 11px;
  }
  .product-top-section .product-head .size-value,
  .product-top-section .product-head .sku-value {
    font-size: 12px;
  }
  .product-top-section .product-head .sqm {
    font-size: 12px;
    margin-top: 3px;
  }
  .product-top-section .sample-detail .order-sample-cut span {
    font-size: 11px;
  }
  .wastage-detail .on,
  .wastage-detail .off {
    left: -82px;
  }
  .wastage-detail .wastage {
    right: 20%;
  }
  .products-buttons .customer-photos {
    background: #8c85c9;
    padding: 17px 18px;
  }
  .products-buttons .visualise-tiles {
    background: #29b0f1;
    padding: 17px 10px;
  }
  .price-infos .cl-mine-shaft,
  .price-infos .sqm-title {
    width: auto;
  }
  .add-to-cart button {
    background-position: 3% 45%;
    width: 100%;
    min-width: 100%;
  }
  .vinyl-product-support p {
    width: 100%;
  }
}

@media (min-width: 1200px) and (max-width: 1350px) {
  .product-quantity .sqm-txt {
    font-size: 14px;
  }
  .product-top-section .product-head .size-value,
  .product-top-section .product-head .sku-value {
    font-size: 12px;
  }
  .product-top-section .product-head .sqm {
    font-size: 12px;
    margin-top: 3px;
  }
  .products-buttons .customer-photos {
    padding: 17px 17px 17px 0px;
    background: #8c85c9 url(../assets/images/customer-photos.png) no-repeat
      scroll 11% 50%;
    width: 89%;
  }
  .products-buttons .visualise-tiles {
    padding: 17px 16px 17px 0px;
    background: #29b0f1 url(../assets/images/visualise.png) no-repeat scroll 1%
      50%;
  }
  .wastage-detail .on,
  .wastage-detail .off {
    left: -140px;
  }
}
</style>
<style>
.sqm-titlespecial span sup {
  text-decoration: none;
  display: inline-block;
}

.productdetail-close p {
  font-family: Arial;
  font-size: 13px;
  text-align: justify;
  text-justify: inter-word;
}

.productdetail-close ul {
  text-decoration: none;
  list-style: none;
  padding-left: 12px;
}

.productdetail-close ul li {
  position: relative;
}

.productdetail-close ul li:before {
  content: ">";
  position: absolute;
  left: -12px;
}

.rightArrow {
  position: absolute;
  left: -8px;
}

.leftArrow {
  position: absolute;
  right: 26px;
}

.modalcalc .modal {
  background-color: rgba(0, 0, 0, 0.2);
}

.modalcalc .modal .modal-container {
  width: 100% !important;
  max-width: 569px !important;
  background: transparent;
}

.modalcalc .modal-container {
  top: 53% !important;
  left: 66.4% !important;
}

.modalcutsample-main .modal-container {
  background-color: transparent !important;
}

.product-desc a {
  color: #dc2f89;
}

@media only screen and (max-width: 767px) {
  .modalcalc .modal .modal-container {
    width: 100% !important;
    max-width: 767px !important;
    background: transparent;
    max-height: 90%;
  }

  .modal-header {
    border-top-right-radius: 0px !important;
    border-top-left-radius: 0px !important;
  }

  .modalcalc .modal-container {
    top: 70% !important;
    left: 50% !important;
  }

  /*
    h4.modal-title {
      padding-left: 15px !important;
      text-align: left !important;
    } */
  .first-label:after,
  .second-label:after,
  .first-label:before,
  .second-label:before {
    display: none;
  }

  .modal-buttons {
    border-bottom: 1px solid #ececec !important;
  }

  .tileWidth {
    height: 31px;
    border: 1px solid #ececec !important;
    background: white;
    width: 75px !important;
    text-align: center;
    display: block;
    margin-top: 9px !important;
    line-height: 0px !important;
    border-radius: 5px;
  }

  span.mutiply {
    float: left;
    padding-top: 32px;
    padding-left: 20px !important;
    padding-right: 20px !important;
    font-size: 17px;
    color: #48403d;
  }

  .tileHeight {
    height: 31px;
    border: 1px solid #ececec !important;
    background: white;
    width: 75px !important;
    text-align: center;
    display: block;
    margin-top: 9px !important;
    line-height: 0px !important;
    border-radius: 5px;
  }

  .third-label {
    padding-left: 30px !important;
    float: left;
    margin: 0 0 0 10px;
    position: relative;
    width: 15%;
  }

  .Totalarea {
    height: 31px;
    border: 1px solid #ececec !important;
    background: white;
    width: 100px !important;
    text-align: center;
    display: block;
    margin-top: 9px !important;
    line-height: 0px !important;
    border-radius: 5px;
  }

  .btnRemove {
    width: 29px !important;
    height: 29px !important;
    margin-left: 34px !important;
    border-radius: 21px !important;
  }

  i.fa.fa-plus {
    height: 29px !important;
    width: 29px !important;
    border-radius: 15px !important;
  }

  .fa-angle-down:before {
    margin-left: 7px !important;
    margin-top: 5px !important;
  }

  .fa-angle-right:before {
    margin-left: 11px !important;
    margin-top: 2px !important;
  }

  .icons {
    height: 29px !important;
    width: 29px !important;
    border-radius: 15px !important;
  }

  .main-Calculator .price {
    font-size: 23px;
    font-weight: bold;
  }
}

@media (max-width: 767px) {
  .first-label {
    width: 18% !important;
  }

  .second-label {
    width: 18% !important;
  }
}

@media (max-width: 991px) and (min-width: 768px) {
  .modalcalc .modal-container {
    left: 50% !important;
  }
}

@media only screen and (max-width: 767px) {
  .modalcalc .modal .modal-container {
    width: 100% !important;
    max-width: 767px !important;
    background: transparent;
  }

  .modal-header {
    border-top-right-radius: 0px !important;
    border-top-left-radius: 0px !important;
  }

  .modalcalc .modal-container {
    top: 70% !important;
    left: 50% !important;
  }

  .first-label:after,
  .second-label:after,
  .first-label:before,
  .second-label:before {
    display: none;
  }

  .modal-buttons {
    border-bottom: 1px solid #ececec !important;
  }

  span.mutiply {
    float: left;
    padding-top: 32px;
    padding-left: 20px !important;
    padding-right: 20px !important;
    font-size: 17px;
    color: #48403d;
  }

  .third-label {
    padding-left: 30px !important;
    float: left;
    margin: 0 0 0 10px;
    position: relative;
    width: 15%;
  }

  i.fa.fa-plus {
    height: 29px !important;
    width: 29px !important;
    border-radius: 15px !important;
  }

  .fa-angle-down:before {
    margin-left: 7px !important;
    margin-top: 5px !important;
  }

  .fa-angle-right:before {
    margin-left: 11px !important;
    margin-top: 2px !important;
  }

  .icons {
    height: 29px !important;
    width: 29px !important;
    border-radius: 15px !important;
  }

  .main-Calculator .price {
    font-size: 23px;
    font-weight: bold;
  }
}

@media (max-width: 767px) {
  .first-label {
    width: 18% !important;
  }

  .second-label {
    width: 18% !important;
  }
}

@media (max-width: 991px) and (min-width: 768px) {
  .modalcalc .modal-container {
    left: 50% !important;
  }
}

@media only screen and (max-width: 767px) {
  .tileWidth {
    width: 100% !important;
  }

  .tileHeight {
    width: 100% !important;
  }

  .Totalarea {
    width: 100% !important;
  }

  /*
  .modalcalc .modal {
    overflow: hidden;
  } */
  .modalcalc .modal-container {
    top: 42% !important;
    left: 50% !important;
  }

  i.fa.fa-plus {
    height: 23px !important;
    width: 23px !important;
    border-radius: 15px !important;
  }

  .btnadd {
    padding-right: 0 !important;
  }

  .total-area span {
    font-size: 15px !important;
  }

  .icons {
    height: 23px !important;
    width: 23px !important;
    border-radius: 15px !important;
  }

  .fa-angle-down:before {
    margin-left: 5px !important;
    margin-top: 3px !important;
  }

  .fa-angle-right:before {
    margin-left: 9px !important;
    margin-top: 1px !important;
  }

  .addToBasketBtn {
    margin-top: 0px !important;
  }

  .main-Calculator .price {
    font-size: 18px !important;
    font-size: 18px !important;
    font-weight: bold !important;
  }

  .btn {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }

  .checkout-button .button-full {
    min-width: 100px !important;
    font-size: 16px;
  }

  .recent {
    margin-top: 20px;
    margin-bottom: 6px;
  }

  .recently-viewed-items-contain {
    padding-bottom: 27px !important;
    padding-top: 26px;
  }

  .modalcalc .modal-body {
    /* overflow: scroll; */
    max-width: 100%;
    overflow-x: hidden;
  }

  .vinyl-products-detail {
    padding: 15px 25px 5px 25px !important;
  }
}

@media (max-width: 525px) {
  .modalcalc .modal-container {
    top: 45% !important;
  }
}

@media (max-width: 406px) {
  .main-Calculator .price {
    font-size: 12px !important;
  }

  .modalcalc .modal-container {
    top: 48% !important;
  }
}

@media (max-width: 357px) {
  .modal.ClearanceModal {
    overflow: hidden;
  }
}

.OFSModal .modal-container {
  width: 100% !important;
  max-width: 616px !important;
  height: 100% !important;
  max-height: 425px !important;
  border-radius: 15px;
}

.OFSModal .modal-backdrop {
  background-color: rgba(0, 0, 0, 0.25) !important;
}

@media (max-width: 767px) {
  .OFSModal .modal-container {
    width: 96% !important;
    max-width: 100% !important;
    height: 100% !important;
    max-height: 280px !important;
    border-radius: 3px;
    top: 32% !important;
  }
}
select.m0.no-outline {
  width: 350px;
  padding-left: 5px;
}
form.custom-options {
  padding-left: 40px;
}
@media (max-width: 400px) {
  select.m0.no-outline {
    width: 250px;
  }
}
</style>
