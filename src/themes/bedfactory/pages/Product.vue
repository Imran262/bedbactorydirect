<template>
  <div
    itemscope
    itemtype="http://schema.org/Product"
    class="product-page-detail"
  >
    <!-- here we are in 2  -->
    <div>
      <!-- get reviews {{getReviews}} -->
      <meta itemprop="image" :content="getSchemaImageUrl" />
      <div
        v-if="reviewData && reviewData.reviews && reviewData.reviews.length > 0"
      >
        <!-- Here we are {{reviewData.reviews[0]}} -->
        <div
          itemprop="review"
          itemscope
          itemtype="https://schema.org/Review"
        ></div>
        <!-- {{reviewData.reviews[0]}} here we loaded <area shape="" coords="" href="" alt=""> -->
        <meta
          itemprop="datePublished"
          :content="formatDate(reviewData.reviews[0].created_at)"
        />
        <meta itemprop="description" :content="reviewData.reviews[0].content" />
        <meta itemprop="name" :content="reviewData.reviews[0].title" />
        <div
          itemprop="reviewRating"
          itemscope
          itemtype="https://schema.org/Rating"
        >
          <meta itemprop="ratingValue" :content="reviewData.reviews[0].score" />
          <meta itemprop="bestRating" content="5" />
        </div>
        <div itemprop="author" itemscope itemtype="https://schema.org/Person">
          <meta
            itemprop="name"
            :content="reviewData.reviews[0].user.display_name"
          />
        </div>
      </div>
    </div>
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
            class="
              col-xs-12 col-md-12 col-lg-6
              center-xs
              middle-xs
              image
              product-image-box product-slider
            "
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
              <!-- <div
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
                        [1200, 4]
                      ]"
                      :mouse-drag="false"
                      :loop="true"
                      @page-change="pageChange"
                      :min-swipe-distance="20"
                      :navigation-enabled="true"
                      :pagination-enabled="false"
                      navigation-next-label=""
                      navigation-prev-label=""
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
                              : 'border-grey-light'
                          ]"
                        />
                      </slide>
                    </carousel>
                  </div>
                </no-ssr>
                <div class="Viewgallery col-md-3">
                  <a @click="openFigureGallery()">View Gallery +</a>
                </div>
              </div> -->
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
                <h1>
                  <div
                    class="mb20 mt0 cl-mine-shaft product-name"
                    data-testid="productName"
                    itemprop="name"
                  >
                    {{ getCurrentProduct.name | htmlDecode }}
                  </div>
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
                <meta
                  itemprop="aggregateRating"
                  :content="
                    reviewData.bottomline
                      ? reviewData.bottomline.average_score
                      : '0.0'
                  "
                />
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
                          parseFloat(getCurrentProduct.price_incl_tax).toFixed(
                            2
                          )
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
                  <!-- {{productCurrentCustomOptions}} -->
                  <!-- <br/>{{getCurrentProductConfiguration }}
                 <br/>
                 <br/>
                  {{ $store.state.product.current_options }}
                  <br/>
                 <br/>
                 <br/>
                 <br/>
                 <br/>
                 <br/> -->
                  <!-- getCurrentProduct.type_id {{getCurrentProduct.type_id}} -->
                  <product-price
                    v-if="getCurrentProduct.type_id !== 'grouped'"
                    :product="getCurrentProduct"
                    :custom-options="getCurrentProductCustomOptionsRedo"
                    :key="reRender"
                    v-on:calculatedPrice="setPrice($event)"
                  />
                </div>
                <div
                  class="cl-primary variants sizes basin_size"
                  v-if="getCurrentProduct.type_id == 'configurable'"
                >
                  <!-- It is a configurable product -->
                  <div
                    class="error"
                    v-if="
                      getCurrentProduct.errors &&
                      Object.keys(getCurrentProduct.errors).length > 0
                    "
                  >
                    <!-- {{ getCurrentProduct.errors | formatProductMessages }} -->
                  </div>
                  {{ getCurrentProduct.configurable_options }} imran
                  <div
                    class="h5"
                    v-for="option in getProductOptionsConfigurable"
                    :key="option.id"
                  >
                    <h4
                      class="variants-label basin-head"
                      data-testid="variantsLabel"
                      :key="cutomRerender"
                    >
                      {{ option.label }}
                      <!-- <span class="weight-700">{{ getOptionLabel(option) }}</span> -->
                    </h4>
                    <div class="row top-xs m0 variants-wrapper">
                      <div
                        class="sizes basin_size"
                        v-if="option.label == 'Color'"
                      >
                        <select
                          class="CustomSelectClass"
                          @change="changeFilterCustom($event)"
                        >
                          <option disabled value="" :key="2378695843" selected>
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
                        <!-- Size -->
                        <!-- Here we are -->
                        <select
                          class="chevron-down-icon CustomSelectClass"
                          @change="changeFilterCustom($event)"
                        >
                          <option disabled value="" :key="2378695843" selected>
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
                        <!-- {{option.attribute_code}}
                          <br/> else -->
                        <select
                          class="chevron-down-icon CustomSelectClass"
                          @change="changeFilterCustom($event)"
                        >
                          <option disabled value="" :key="2378695843" selected>
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
                        <!-- <span v-if="colorValidation" class="error1"
                                    >Field is required</span
                                  > -->
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
                  <!-- <span class="error5" v-if="isFabricText">
                    This product is not available!
                  </span> -->
                </div>
              </div>

              <!-- <div
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
              </div> -->
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
                  :key="reRender"
                />
                <div class="fabric-btn-responsive">
                  <div
                    class="fabric-button-design"
                    v-if="
                      getCurrentProduct.isFabric !== 0 &&
                      getCurrentProduct.isFabric !== '0' &&
                      getCurrentProduct.isFabric !== ' ' &&
                      getCurrentProduct.isFabric !== false
                    "
                  >
                    <button
                      class="select-color-button chevron-down"
                      type="button"
                      @click="showColorPicker"
                    >
                      {{ getColorName() }}
                      <!-- <i
                      class="material-icons cl-bg-tertiary pointer select-color-icon"
                      >keyboard_arrow_right</i
                    > -->
                    </button>
                    <span class="error1" v-if="isFabrics"
                      >Field is required</span
                    >
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
              </div>

              <!-- ////////   add to Basket button //////    -->
              <div class="add-to-cart row m0">
                <div class="cart-items">
                  <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 total-amount">
                    <!-- maxQuantity {{maxQuantity}}  -->
                    <product-quantity
                      class="product-quantity bt-product-qty row m0"
                      v-model="getCurrentProduct.qty"
                      :max-quantity="maxQuantity"
                      input-type="text"
                      :loading="isStockInfoLoading"
                      :is-simple-or-configurable="isSimpleOrConfigurable"
                      show-quantity
                      @error="handleQuantityError"
                    />
                    <!-- <add-to-cart
                      :product="getCurrentProduct"
                      :custom-options="getCurrentProductCustomOptionsRedo"
                      class="col-xs-12 col-sm-4 col-md-6 float-right"
                      :product-calculated-price="calculatedProductPrice"
                      :disableProduct="false"
                      :disableProductFlag="false"
                      :outofStock="getStockStatus"
                    /> -->
                  </div>
                  <!-- <addtobasket
                    v-if="showModal"
                    @closemodal="hidemodal"
                    :priceToShow="calculatedProductPrice"
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
                  /> -->
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
                    class="
                      col-xs-6 col-sm-6 col-md-6 col-lg-6 col-margin
                      addtocartbuttonMobile
                    "
                  >
                    <!-- <add-to-cart
                    :product="getCurrentProduct"
                    :disabled="
                      isAddToCartDisabled || cartDisabledOnQuoteItemBased
                    "
                    class="add-btn"
                    @Modal="modalshow"
                    :sqm-val-updated="'0'"
                  /> -->
                    <!-- cart should be {{!cartFlag}}<br/><br/><br/><br/> -->
                    <template
                      v-if="
                        getCurrentProduct.custom_options &&
                        getCurrentProduct.custom_options.length > 0
                      "
                    >
                      <!-- simple product button  -->
                      <add-to-cart
                        :product-options="sendProductCustomOptions"
                        :product="getCurrentProduct"
                        :custom-options="getCurrentProductCustomOptionsRedo"
                        class="col-xs-12 col-sm-4 col-md-6 float-right"
                        :product-calculated-price="calculatedProductPrice"
                        :disableProduct="false"
                        :disableProductFlag="false"
                        :outofStock="getStockStatus"
                      />
                    </template>
                    <template
                      v-else-if="
                        !(
                          getCurrentProduct.configurable_options &&
                          getCurrentProduct.configurable_options.length > 0
                        )
                      "
                    >
                      <!-- no field here  -->
                      <add-to-cart
                        :product-options="sendProductCustomOptions"
                        :product="getCurrentProduct"
                        :custom-options="getCurrentProductCustomOptionsRedo"
                        class="col-xs-12 col-sm-4 col-md-6 float-right"
                        :product-calculated-price="calculatedProductPrice"
                        :disableProduct="false"
                        :disableProductFlag="false"
                        :outofStock="getStockStatus"
                      />
                    </template>
                    <template v-else>
                      <add-to-cart
                        :product-options="sendProductCustomOptions"
                        :product="getCurrentProduct"
                        :custom-options="getCurrentProductCustomOptionsRedo"
                        class="col-xs-12 col-sm-4 col-md-6 float-right"
                        :product-calculated-price="calculatedProductPrice"
                        :disableProduct="cartFlag"
                        :disableProductFlag="cartFlag"
                        :outofStock="getStockStatus"
                      />
                    </template>

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
              <Retailfinancev12
                :currentPrice="updatedPrice"
                :key="updatedPrice"
              />
            </div>
          </div>
        </section>
      </div>
    </section>

    <section
      class="container pt50 pb35 cl-accent details product-description-main"
    >
      <div class="row">
        <div
          class="col-lg-6 col-md-7 col-sm-12 col-xs-12 product-description-left"
        >
          <h2
            v-if="
              getCurrentProduct.description &&
              getCurrentProduct.description.length > 0
            "
            id="product-dimension-icon-id"
            class="
              h3
              m0
              mb10
              serif
              lh20
              details-dimension
              Icon-update
              icon-rotate
            "
            @click="ProDimensionShowFn"
          >
            {{ $t("Description") }}
            <!-- <span
              id="product-dimension-icon-id"
              class="Icon-update delivery-info-icon2"
            ></span> -->
          </h2>
          <div
            v-if="ProDimensionShow"
            class="
              h4
              dimension-wrapper
              bt-dimension-wrapper-show-close
              dimension-wrapper-show
            "
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
            v-if="getCurrentProduct.specs && getCurrentProduct.specs.length > 0"
            id="product-Specifications-icon-id"
            class="h3 m0 mb10 serif lh20 details-Delivery Icon-update"
            @click="ProSpecificationsShowFn"
          >
            {{ $t("Specifications") }}
            <!-- <span
              id="product-Specifications-icon-id"
              class="Icon-update icon-rotate delivery-info-icon1"
            ></span> -->
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
          <h2
            id="product-Delivery-icon-id"
            class="h3 m0 mb10 serif lh20 details-Delivery Icon-update"
            @click="ProDeliveryShowFn"
          >
            {{ $t("Delivery Information") }}
            <!-- <span
              id="product-Delivery-icon-id"
              class="Icon-update icon-rotate delivery-info-icon"
            ></span> -->
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
        </div>
        <div
          class="
            col-lg-6 col-md-5 col-sm-12 col-xs-12
            product-description-right
          "
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

    <div class="recently-viewed-items-contain container">
      <lazy-hydrate when-idle>
        <related-products type="upsell" :heading="$t('Customers also liked')" />
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
        :finalReview="reviewData"
        @hasTotalQA="updateReviewsTotals"
        ref="reviewsSection"
      />
    </template>
  </div>
</template>

<script>
// import i18n from '@vue-storefront/i18n';
// import VueOfflineMixin from 'vue-offline/mixin';
import Retailfinancev12 from "src/themes/bedfactory/components/core/V12Calculator/Retailfinancev12.vue";
import V12calculator from "src/themes/bedfactory/components/core/V12Calculator/CalculatorV12.vue";
import CmsBlock from "src/themes/bedfactory/components/core/blocks/Cms/DeliveryBlock";
import config from "config";
import RelatedProducts from "src/themes/bedfactory/components/core/blocks/Product/Related.vue";
import Reviews from "theme/components/core/blocks/Reviews/Reviews.vue";
import AddToCart from "theme/components/core/AddToCart.vue";
import GenericSelector from "theme/components/core/GenericSelector";
import ColorSelector from "theme/components/core/ColorSelector.vue";
import SizeSelector from "theme/components/core/SizeSelector.vue";
import Breadcrumbs from "theme/components/core/Breadcrumbs.vue";
import ProductAttribute from "theme/components/core/ProductAttribute.vue";
import ProductQuantity from "theme/components/core/ProductQuantity.vue";
import addtobasket from "theme/components/core/AddTobasketModal";
import clearancemodal from "theme/components/core/ClearanceModal";
import OutOfStockModal from "theme/components/core/OutOfStockModal";
import ProductQuantitySqm from "theme/components/core/ProductQuantitySqm.vue";
import ProductLinks from "theme/components/core/ProductLinks.vue";
// import ProductCustomOptions from '/home/ejaz/vsf/BEDFACTORY/newBFD/bfdvuestore/src/themes/bedfactory/components/core/ProductCustomOptions.vue';
import ProductCustomOptions from "../components/core/ProductCustomOptions";
import ProductBundleOptions from "theme/components/core/ProductBundleOptions.vue";
import VinylRecommendedItems from "theme/components/core/vinyl/VinylRecommendedItem";
import ProductGallery from "theme/components/core/ProductGallery";
import Spinner from "theme/components/core/Spinner";
import PromotedOffers from "theme/components/theme/blocks/PromotedOffers/PromotedOffers";
import focusClean from "theme/components/theme/directives/focusClean";
import WebShare from "theme/components/theme/WebShare";
import CutSizeSample from "src/modules/cut-full-sample/components/CutSizeSample";
import FullSizeSample from "src/modules/cut-full-sample/components/FullSizeSample";
import HalfSizeSample from "src/modules/cut-full-sample/components/HalfSizeSample";
import QSizeSample from "src/modules/cut-full-sample/components/QSizeSample";
import AddedToBasket from "src/modules/cut-full-sample/components/AddedToBasket";
import CalculatorModal from "theme/components/core/CalculatorModal";
import CutSampleModal from "theme/components/core/CutSampleModal";
import rating from "theme/components/core/blocks/Reviews/Rating";
import { mapGetters } from "vuex";
import NoSSR from "vue-no-ssr";
import LazyHydrate from "vue-lazy-hydration";
import { ProductOption } from "@vue-storefront/core/modules/catalog/components/ProductOption.ts";
import {
  getAvailableFiltersByProduct,
  getSelectedFiltersByProduct
} from "@vue-storefront/core/modules/catalog/helpers/filters";
import { isOptionAvailableAsync } from "@vue-storefront/core/modules/catalog/helpers/index";
import {
  localizedRoute,
  currentStoreView
} from "@vue-storefront/core/lib/multistore";
import { htmlDecode } from "@vue-storefront/core/filters";
import { ReviewModule } from "@vue-storefront/core/modules/review";
import { RecentlyViewedModule } from "@vue-storefront/core/modules/recently-viewed";
import {
  registerModule,
  isModuleRegistered
} from "@vue-storefront/core/lib/modules";
import {
  onlineHelper,
  isServer
  // productJsonLd,
} from "@vue-storefront/core/helpers";
import { catalogHooksExecutors } from "@vue-storefront/core/modules/catalog-next/hooks";
import { doPlatformPricesSync } from "@vue-storefront/core/modules/catalog/helpers";
import { filterChangedProduct } from "@vue-storefront/core/modules/catalog/events";
import Modal from "theme/components/core/Modal.vue";
import RecentlyViewedItems from "theme/components/RecentlyViewedItems";
import axios from "axios";
import WastePercentToggle from "theme/components/core/WastePercentToggle";
import { CartService } from "@vue-storefront/core/data-resolver";
import { prepareRelatedQuery } from "@vue-storefront/core/modules/catalog/queries/related";
// import QuickCheckoutModel from 'theme/components/core/blocks/QuickCheckout/QuickCheckoutModel';
import { getThumbnailPath } from "@vue-storefront/core/helpers";
import ReviewItemImageModel from "theme/components/core/blocks/Reviews/ReviewItemImageModel";
import ColorPicker from "src/themes/bedfactory/components/core/blocks/ColorPicker/ColorPicker";
import ProductPrice from "src/themes/bedfactory/components/core/ProductPrice.vue";
import dateFormat from "dateformat";
//theme/components/core/blocks/ColorPicker/ColorPicker.vue
export default {
  name: "ProductPage",
  components: {
    Retailfinancev12,
    V12calculator,
    ProductPrice,
    CmsBlock,
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
    Carousel: () => import("vue-carousel").then(Slider => Slider.Carousel),
    Slide: () => import("vue-carousel").then(Slider => Slider.Slide),
    "no-ssr": NoSSR,
    ProductQuantity,
    ProductQuantitySqm,
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
      customImran: [],
      cutomRerender: 1,
      SelectedOptions: [],
      unCheckfabrics: false,
      v12Data: {},
      minimumMonthlyPayment: 0,
      minProductPrice: 335,
      monthly_text: " ",
      showCalculator: false,
      updatedPrice: 0,
      cartFlag: true,
      ViewCalculatorCheck: false,
      currentConfiguration: {},
      isFabrics: false,
      // isFabricText: false,
      // colorValidation: false,
      detailsOpen: false,
      ProDeliveryShow: true,
      ProReviewShow: true,
      ProDimensionShow: true,
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
      adhesiveSku: "5K70003",
      groutSku: "6011005A",
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
          product_id: "",
          item_id: "",
          fixing_type: "",
          applied_material: "",
          grout_width: "",
          total_qty: "",
          sqm: ""
        }
      },
      currentUserTiles: "",
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
      vinylRecommendedItemPrice: 0,
      reRender: 0,
      calculatedProductPrice: {},
      configurableChildren: {},
      colorName: ""
    };
  },
  computed: {
    ...mapGetters({
      getCurrentCategory: "category-next/getCurrentCategory",
      getCurrentProduct: "product/getCurrentProduct",
      getProductGallery: "product/getProductGallery",
      getCurrentProductConfiguration: "product/getCurrentProductConfiguration",
      attributesByCode: "attribute/attributeListByCode",
      getCurrentCustomOptions: "product/getCurrentCustomOptions",
      productsInCart: "cart/getCartItems",
      getCartToken: "cart/getCartToken"
    }),
    getStockStatus() {
      return 1;
      console.log(
        "14521 stock is ",
        this.getCurrentProduct.stock.stock_status,
        this.getCurrentProduct.stock
      );
      if (
        this.getCurrentProduct.stock.stock_status
          ? this.getCurrentProduct.stock.stock_status
          : this.getCurrentProduct.stock.stock_status === 0
          ? 0
          : 1
      ) {
        //for 1
        console.log("14521 123 in 1");
        if (this.getCurrentProduct.stock.qty > 0) {
          return 1;
        } else {
          return 0;
        }
      } else {
        //for 0
        console.log("14521 123 in 0");
        return 0;
      }
      //  return this.getCurrentProduct.stock.stock_status? this.getCurrentProduct.stock.stock_status : this.getCurrentProduct.stock.stock_status === 0 ? 0:1
    },
    getCurrentProductCustomOptionsRedo() {
      // let cOptions = this.$store.state.product;
      let currentOptions = {};
      let listOptions = [];

      if (this.getCurrentProduct.custom_options) {
        if (this.getCurrentProduct.custom_options.length > 0) {
          this.getCurrentProduct.custom_options.forEach((option, index) => {
            let obj2 = {
              [option.option_id]: {
                option_id: option.option_id
              }
            };
            let value = null;
            if (this.$store.state.product.current_custom_options) {
              if (
                this.$store.state.product.current_custom_options[
                  option.option_id
                ]
              ) {
                value = this.$store.state.product.current_custom_options[
                  option.option_id
                ].option_value;
              }
            }
            currentOptions[option.option_id] = {
              option_id: option.option_id,
              option_value: value
            };
          });
          // this.productCurrentCustomOptions = currentOptions;
          return currentOptions;
        } else {
          return {};
        }
      } else {
        return {};
      }
    },
    getShortDescription() {
      const formatShortDesc = this.getCurrentProduct.short_description;
      let formatShortDescUlInc = "";
      if (formatShortDesc.includes("<ul") === true) {
        formatShortDescUlInc = formatShortDesc;
      } else {
        formatShortDescUlInc = "<ul>" + formatShortDesc + "</ul>";
      }
      return formatShortDescUlInc;
    },
    perBox() {
      if (this.getCurrentProduct.box_coverage) {
        let box_coverage = this.getCurrentProduct.box_coverage;
        return box_coverage.replace("m2", "");
      } else {
        return this.roundTo(1 / this.getCurrentProduct.qty_per_sqm, 2);
      }
    },
    socialLinksSchema() {
      return config.socialUrlsForSchema ? config.socialUrlsForSchema : "";
    },
    getImageObjJsonLd() {
      return config.schemaUrl.baseUrl
        ? config.schemaUrl.baseUrl +
            this.getImageUrl(this.getCurrentProduct.thumbnail)
        : config.baseUrl.live +
            this.getImageUrl(this.getCurrentProduct.thumbnail);
    },
    getProductUrl() {
      return config.schemaUrl.baseUrl
        ? config.schemaUrl.baseUrl + this.getCurrentProduct.url_path
        : config.baseUrl.live + this.getCurrentProduct.url_path;
    },
    getSchemaImageUrl() {
      return config.schemaUrl.baseUrl
        ? config.schemaUrl.baseUrl +
            "img/600/744/resize" +
            this.getCurrentProduct.image
        : config.baseUrl.live +
            "img/600/744/resize/" +
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
              : config.baseUrl.live + this.getImageUrl(videoElement[0].image),
            contentUrl: videoElement[0].vid.url
          };
        } else {
          return "";
        }
      }
    },
    getWebPageObjJsonLd() {
      return config.schemaUrl.baseUrl
        ? config.schemaUrl.baseUrl +
            this.getImageUrl(this.getCurrentProduct.image)
        : config.baseUrl.live + this.getImageUrl(this.getCurrentProduct.image);
    },
    getProductGalleryCustom() {
      let mediaGallery = [];
      let mediaGallerySame = [];
      if (this.getProductGallery.length > 0) {
        this.getProductGallery.forEach(imgFile => {
          let srcFromPath = imgFile.src.split("product")[1];
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
    structuredDataTM() {
      const stockText = this.getCurrentProduct.stock_level_text
        ? this.getCurrentProduct.stock_level_text
        : "";
      let stockTextString = "";
      // console.log("stockText", stockText, stockText.indexOf("More") !== -1);
      if (
        (stockText.indexOf("Available") !== -1) === true ||
        (stockText.indexOf("available") !== -1) === true ||
        (stockText.indexOf("In Stock") !== -1) === true ||
        (stockText.indexOf("in Stock") !== -1) === true ||
        (stockText.indexOf("in stock") !== -1) === true ||
        (stockText.indexOf("Please call") !== -1) === true
      ) {
        // stockTextString = "InStock";
      } else {
        stockTextString = "OutOfStock";
      }
      // console.log("stockTextString", stockTextString);
      // return {
      //   availability: stockTextString,
      //   contentUrl: this.validateUrl(this.getCurrentProduct.url_path)
      //     ? this.getCurrentProduct.url_path
      //     : this.attachBaseUrl(this.getCurrentProduct.url_path),
      //   imageUrl: this.getImageUrl(this.getCurrentProduct.image),
      // };
      return true;
    },
    structuredData() {
        let flag = false;
         if (this.getCurrentProduct.type_id === "configurable")
          {
           if (
              this.getCurrentProduct.configurable_children &&
              this.getCurrentProduct.configurable_children.length > 0
            ) {
                 this.getCurrentProduct.configurable_children.forEach(
                 (child, index) => {
                 if (child.stock.is_in_stock)
                  {
                     flag = true; 
                    } 
                  });
               } else {
                 if ( this.getCurrentProduct.stock && this.getCurrentProduct.stock.is_in_stock) 
                {
                 flag = true;
               }
        }
       } else {
        if (
          this.getCurrentProduct.stock &&
          this.getCurrentProduct.stock.is_in_stock
        ) {
          flag = true;
        }
      }
      console.log("9878 result is ", flag);
      // return {
      //   availability:
      //     flag
      //       ? "InStock"
      //       : "OutOfStock",
      //   contentUrl: this.validateUrl(this.getCurrentProduct.url_path)
      //     ? this.getCurrentProduct.url_path
      //     : this.attachBaseUrl(this.getCurrentProduct.url_path),
      //   imageUrl: this.getImageUrl(this.getCurrentProduct.image),
      // }
      return {
        availability: "InStock",
        // flag
        //   ? "InStock"
        //   : "OutOfStock",
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
    getProductOptionsConfigurable() {
      if (this.getProductOptions) {
        console.log('Yaaraaaaa', this.customImran, this.getProductOptions[1].values, this.getProductOptions)
        let productValuesIndex = 0
        if ( this.getCurrentProduct.configurable_options.length == 2 && this.SelectedOptions.length == 1) {
          let customOptionsfiltered = this.getProductOptions.filter((option, index) => {
            if (option.attribute_code === this.customImran[0].attribute_code) {
              productValuesIndex = index
            }
            return option.attribute_code === this.customImran[0].attribute_code
          })
          console.log('Imran is here',customOptionsfiltered, customOptionsfiltered[0].values )
          // let customOptions2=
          customOptionsfiltered[0].values = customOptionsfiltered[0].values.filter((customOption, index) => {
            let newFlag = false
            this.customImran.forEach((optionTo) => {
              if (optionTo.id == customOption.value_index) {
                newFlag = true
              }
            })
            return newFlag
          })
          // let finalfilteredVar = [...this.getProductOptions]
          let finalfilteredVar = Object.create(this.getProductOptions);
          console.log("customOptionsfiltered[0].values",customOptionsfiltered[0].values);
          finalfilteredVar[productValuesIndex].values = [...customOptionsfiltered[0].values]
          console.log('this print krwate',this.getProductOptions)
          return finalfilteredVar
        }
        else {
          return this.getProductOptions
        }
      }
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
        console.log('select items', getAvailableFiltersByProduct(this.getCurrentProduct));
      return getAvailableFiltersByProduct(this.getCurrentProduct);
    
    },
    getSelectedFilters() {
      return getSelectedFiltersByProduct(
        this.getCurrentProduct,
        this.getCurrentProductConfiguration
      );
    },
    isSimpleOrConfigurable() {
      return ["simple", "configurable"].includes(
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
    this.$bus.$on("cart-after-update", () => {
      this.disableSampleButton();
    });
    this.$bus.$on("cart-after-itemchanged", cartItem => {
      this.disableSampleButton();
    });
    this.$bus.$on("cart-after-delete", items => {
      // e.stopImmediatePropagation();
      this.disableSampleButton();
    });

    this.$bus.$on("show-samples-modal", bool => {
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
    if (
      this.getCurrentProduct.custom_options &&
      this.getCurrentProduct.custom_options.length > 0
    ) {
      this.getCurrentProductCustomOptions();
    } else {
      
      this.setConfigurableOption();
      console.log(" setConfigurableOption  998877 It is a a configurable product");
    }
    this.setReviews();
    this.setProductPage();
    this.$bus.$on("sendvalueToCart", value => {
      this.cartItems = value;
    });
    this.tileSqmQuantity = "";
    await this.$store.dispatch(
      "recently-viewed/addItem",
      this.getCurrentProduct
    );

    this.$bus.$on("cartUpdated", payload => {
      // TODO: Update the Samples Button from here.
      if (this.getCartToken) {
        // this.updateSampleButtons();
      }
    });
    if (
      this.$store.state.url.prevRoute &&
      this.$store.state.url.prevRoute.name &&
      this.$store.state.url.prevRoute.name.includes(".html") &&
      this.$store.state.url.prevRoute.params
    ) {
      localStorage.setItem(
        "topLevelCategoryPosition",
        this.$store.state.url.prevRoute.params.slug
      );
    }
    // For GTAG
    let primaryCategory = this.getProductPrimaryCategory();
    this.$store.commit("google-gtag/SET_PRODUCT_CURRENT", {
      product: this.getCurrentProduct,
      category: primaryCategory?.[0]?.name
    });
  },
  async asyncData({ store, route, context }) {
    if (context) context.output.cacheTags.add("product");
    const product = await store.dispatch("product/loadProduct", {
      parentSku: route.params.parentSku,
      childSku:
        route && route.params && route.params.childSku
          ? route.params.childSku
          : null
    });
    const loadBreadcrumbsPromise = store.dispatch(
      "product/loadProductBreadcrumbs",
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
    "$route.name": function() {
      this.reRender++;
      this.setReviews();
      console.log(
        "routeGotUpdated",
        this.sendProductCustomOptions,
        this.getCurrentProductCustomOptionsRedo,
        this.getCurrentProduct,
        this.getCurrentCustomOptions
      );
      console.log("calculatedProductPrice", this.calculatedProductPrice);
      // console.log("114455", this.getColorName(), this.colorName);
      //  this.colorName = "Please Select"
      if (
        this.getCurrentProduct.custom_options &&
        this.getCurrentProduct.custom_options.length > 0
      ) {
        this.getCurrentProduct.custom_options.forEach(option => {
          if (
            option.iscolor == 1 ||
            option.iscolor == "1" ||
            option.iscolor == true
          ) {
            this.colorName = "Please Select " + option.title;
          }
        });
      }
      this.checkRoute();
      // console.log("114455",this.getColorName(), this.colorName);
    },
    $route(to, from) {
      if (from.path !== to.path) {
        if (this.SelectedOptions.length) {
          let Selects = document.getElementsByClassName('CustomSelectClass')
          Selects.forEach((select, index) => {
            select.firstChild.disabled = false
            select.firstChild.selected = true
            select.firstChild.disabled = true
          })
        }
        this.SelectedOptions = [];
        this.cartFlag = true;
        this.cutomRerender++
        // this.isFabricText= false
      
      }
    },
    getCurrentCustomOptions: {
      handler() {
        //   console.log("112255 state changed");
        if (
          this.getCurrentProduct.custom_options &&
          this.getCurrentProduct.custom_options.length > 0
        ) {
          this.getCurrentProductCustomOptions();
        } else {
          this.setConfigurableOption();
          // console.log("setConfigurableOption2")
        }
      }
    },
    currRoute(newVal, oldVal) {
      this.$refs.getProductGallery.$refs.carousel.navigate(0);
      if (document.getElementById("prod-gallery-thumbnails-carousel")) {
        const sliderThumb = document
          .getElementById("prod-gallery-thumbnails-carousel")
          .querySelector(".VueCarousel-inner");
        sliderThumb.style.transform = "translate(0px, 0px)";
      }
      if (newVal !== oldVal) {
        this.$refs.reviewsSection.fetchReviews();
        this.$refs.reviewsSection.fetchQA();

        this.$bus.$emit("modal-hide", "modal-cutsample");
        this.$bus.$emit("modal-hide", "modal-clearancemodal");
        // For Quote Sample Buttons
        // this.updateSampleButtons();
        this.disabledQuoteAddtoCart();
        this.getCustomerPhotos();
        this.similar_products = {
          skus: [],
          items: []
        };
        this.getSimilarTiles();
        this.tileSqmQuantity = "";

        // For GTAG
        this.setProductPage();
      }
    }
  },
  methods: {
    formatDate(date) {
      let formattedDate = date.replace(" ", "T");
      let d = new Date(formattedDate);
      return dateFormat(d, "yyyy-mm-dd");
    },
    checkRoute() {
      // console.log(
      //   "11226677 Route changes in check route function",
      //   this.$route,
      //   "\nSTATE is \n\n",
      //   this.$store.state.product
      // );
      this.getCurrentProductCustomOptions();
      this.$store.state.product.current_custom_options = this.getCurrentProductCustomOptionsRedo;
      // console.log("\n112266 After STATE is \n\n", this.$store.state.product);
      //  this.$store.dispatch('product/setCustomOptions', { product: this.getCurrentProduct, customOptions: {} });
    },
    HandleOnClickV12() {
      this.ViewCalculatorCheck = true;
    },
    HandleOnCloseV12() {
      this.ViewCalculatorCheck = false;
    },
    getCurrentProductCustomOptions() {
      // let cOptions = this.$store.state.product;
      let currentOptions = {};
      let listOptions = [];
      // console.log(
      //   "Current custom Options are ",
      //   this.getCurrentCustomOptions,
      //   typeof this.getCurrentProduct,
      //   typeof this.getCurrentProduct.custom_options
      // );
      // console.log(
      //   "1122 custom options ",
      //   this.getCurrentProduct.custom_options
      // );
      if (this.getCurrentProduct.custom_options) {
        if (this.getCurrentProduct.custom_options.length > 0) {
          this.getCurrentProduct.custom_options.forEach((option, index) => {
            let obj2 = {
              [option.option_id]: {
                option_id: option.option_id
              }
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
              option_value: value
            };
            //   console.log("1122 option is ", obj2, listOptions, currentOptions);
          });
          this.productCurrentCustomOptions = currentOptions;
          // console.log("112233 productCurrentCustomOptions", currentOptions);
          // console.log(
          //   "112233 productCurrentCustomOptionsTest",
          //   this.productCurrentCustomOptions
          // );
          return currentOptions;
        } else {
          return {};
        }
      } else {
        return {};
      }
    },
    setConfigurableOption() {
      // console.log('setConfigurableOption')
      const _ = require("lodash");
      let newObjList = [];
      let products = this.getCurrentProduct.configurable_children;
      // console.log("885522 Products", products);
      let val = 10;
      let sampleObject = this.getCurrentProductConfiguration;
      let sampleObject2 = _.clone(sampleObject);
      //  console.log("Current Configuration", sampleObject);
      if (products && products.length > 0) {
        // console.log("Length of Children is greater than zero");
        products.forEach((product, productIndex) => {
          var currentVariant = Object.create(sampleObject);
          var newVariant = Object.assign({}, sampleObject);
          const newCurrent = { ...sampleObject };
          var newCur = JSON.parse(JSON.stringify(sampleObject));
          // console.log(currentVariant);
          var newObj = {};
          for (let i in sampleObject) {
            val++;
            newObj[i] = { ...sampleObject[i] };
            //  sampleObject[i].id=product[i];
            newObj[i].id = product[i];
            newObj[i].label = product[i];
            // sampleObject[i].id= 100
            //  currentVariant[i].id= 50
            //   newVariant[i].id= 30 +val
            // console.log(
            //   "78889",
            //   i,
            //   sampleObject[i].id,
            //   currentVariant[i].id,
            //   newVariant[i].id,
            //   newCurrent[i].id,
            //   "this ",
            //   newCur[i].id,
            //   product[i],
            //   "id ",
            //   newObj[i].id,
            //   "new 2",
            //   sampleObject2[i].id
            // );
          }
          // console.log("newObj",newObj['size'].id);
          newObjList.push(newObj);
        });
      } else {
        // console.log("Length of Children is greater than zero");
      }
      //  console.log("After All", newObjList);
      this.configurableChildren = newObjList;
    },
    changeFilterCustom(event) {
      // this.colorValidation = true;
      // console.log(" SelectedOptions 112233 change filter custom 1", event);
      let variant = JSON.parse(event.target.value);
      // console.log(" SelectedOptions 112233 change filter custommm 12",variant);
      let newOptionSelected = true;
      if (this.SelectedOptions.length) {
        this.SelectedOptions.forEach((option, index) => {
          if (this.SelectedOptions[index] === variant.type) {
            // console.log("SelectedOptions variant type 123 ");
            newOptionSelected = false;
            // this.isFabricText= false
          }
        });
      }
      if (newOptionSelected) {
        this.SelectedOptions.push(variant.type);
        // console.log("SelectedOptions push variant type 1234", variant);
      }
      if (
        this.getCurrentProduct.configurable_options.length ===
        this.SelectedOptions.length
      ) {
        // console.log(" SelectedOptions two input is select then button enable");
        this.cartFlag = false;
      }
      let filterOption = Object.assign(
        { attribute_code: variant.type },
        variant
      );
      delete filterOption.type;
      // console.log(
      //   " SelectedOptions VariantIS",
      //   variant,
      //   " SelectedOptions filter option is ",
      //   filterOption,
      //   " SelectedOptions variant.type",
      //   variant.type
      // );
      let configuration = this.getCurrentProductConfiguration;
      // console.log(" SelectedOptions currentProductConfiguration", configuration);
      // const changedConfig = Object.assign({}, configuration, { [filterOption.attribute_code]: filterOption })
      let changedConfig = Object.assign({}, configuration);
      changedConfig[variant.type].id = variant.id;
      changedConfig[variant.type].label = variant.id;
      let i = 0;
      for (let i in changedConfig) {
        // this.cartFlag = false;
        // console.log("Current is ", changedConfig[i]);
        changedConfig[i].id = parseInt(changedConfig[i].id);
        changedConfig[i].label = parseInt(changedConfig[i].id);
      }
      // console.log(
      //   "changedConfig",
      //   changedConfig[variant.type].id,
      //   changedConfig
      // );
      for (let i in configuration) {
        configuration[i].id = parseInt(configuration[i].id);
        configuration[i].label = parseInt(configuration[i].label);
      }
      // for (let childIndex=0 ;childIndex<=this.configurableChildren.length;childIndex++){
      //   let child = this.configurableChildren[0];
      // console.log("child is ",child);
      // }
      let flag = false;
      delete changedConfig.label;
      let customImranNew = []
      this.configurableChildren.forEach((child, childIndex) => {
        // console.log("7788");
        // console.log("7788 Child is ",child['size'].id,child['colour'].id, "Current Configuration",changedConfig['size'].id,changedConfig['colour'].id ,"\n",JSON.stringify(child)==JSON.stringify(changedConfig),"\n",child ,changedConfig);
        // console.log(
        //   "7788 Child is edit ",'child edit',child, 'child index',childIndex,
        //   "\n",
        //   JSON.stringify(child) == JSON.stringify(changedConfig),
        //   "\n",
        //   this.configurableChildren,
        //   child,
        //   changedConfig,
        //   variant.type
        // );
        // if()
        this.currentConfiguration = changedConfig;
        this.option = false;


        // kjsabfd;kjsaf;lksafd
        if ( this.getCurrentProduct.configurable_options.length == 2 && this.SelectedOptions.length == 1) {
          console.log("Imran is always coming in hereee")
          if (child[variant.type].id == variant.id) {
            
            let newArr = Object.entries(child).filter((childOption, index) => {
              // console.log('childOption', childOption, index)
              return childOption[index] !== variant.type
            })
            customImranNew.push(newArr[0][1])
            // console.log('I am custom imran', this.customImran)
          }
          // if (child[variant.type])
        }

        // kjsabfd;kjsaf;lksafd


        if (JSON.stringify(child) == JSON.stringify(changedConfig)) {
          //  let variant = JSON.parse(event.target.value)
          // console.log("774455", "child matched will emit ", child.stock);
          // this.colorValidation = false;
          this.$bus.$emit(
            "filter-changed-product",
            Object.assign({ attribute_code: variant.type }, variant)
          );
          //   this.manageQuantity = false;
          // this.maxQuantity = child.stock.qty;
          // this.maxSqmQuantity = this.getCurrentProduct.maxsqmquantity;
          this.getQuantity();
          flag = true;
        } else {
          if (childIndex + 1 == this.configurableChildren.length) {
            // console.log('At the end of children',this.configurableChildren)
            // this.colorValidation = false;
            // this.colorValidation2 = false;
            // this.colorValidation = false;
            // console.log("At the end of children 1234", flag);
            if ( this.getCurrentProduct.configurable_options.length == 2 && this.SelectedOptions.length == 1) {
                this.customImran = [...customImranNew]
              }
            if (flag) {
              // console.log('At the end of children 1234567',flag)
              // this.getQuantity();
            } else {
                       if (
                          this.getCurrentProduct.configurable_options.length ===
                          this.SelectedOptions.length
                        ) {
                          // console.log(" SelectedOptions two input is select then button disablable 12345");
                          this.cartFlag = true;
                          //  this.isFabricText= true;
                        }
                          // disable cart//
                          // console.log( " SelectedOption this variant was not found", this.currentConfiguration);
                          // this.cartFlag = true;
                          // console.log(" SelectedOptionthis variant was not found 3030 cart flag is ", this.cartFlag);
                          // this.isFabricText= true;
            }
          }
        }
      });
    },
    setPrice(data) {
      // console.log("7778855 Current price is ", data);
      let price = data.special
        ? data.original - data.special === 0
          ? data.original
          : data.special
        : data.original;
      this.updatedPrice = price;
      this.calculatedProductPrice = data;
    },
    showDetails(event) {
      this.detailsOpen = true;
      event.target.classList.add("hidden");
    },
    ProSpecificationsShowFn() {
      var details_element = document.getElementsByClassName(
        "bt-Specifications-wrapper-show-close"
      )[0];
      details_element.classList.toggle("Specifications-wrapper-show");
      document
        .getElementById("product-Specifications-icon-id")
        .classList.toggle("icon-rotate");
    },
    ProReviewShowFn() {
      var details_element = document.getElementsByClassName(
        "bt-review-wrapper-show-close"
      )[0];
      details_element.classList.toggle("review-wrapper-show");
      document
        .getElementById("product-review-icon-id")
        .classList.toggle("icon-rotate");
    },
    ProDimensionShowFn() {
      // document.getElementById('product-dimension-icon-id').classList.toggle('icon-rotate')
      var details_element = document.getElementsByClassName(
        "bt-dimension-wrapper-show-close"
      )[0];
      details_element.classList.toggle("dimension-wrapper-show");
      document
        .getElementById("product-dimension-icon-id")
        .classList.toggle("icon-rotate");
      if (document.getElementById("comes-with-main") !== null) {
        // console.log('sasa');
        const slider2 = document
          .getElementById("comes-with-main")
          .querySelector(".VueCarousel-inner");
        slider2.style.transform =
          "translate3d(" + "-" + slider2.style.flexBasis + ", 0px, 0px)";
      }
    },
    ProDeliveryShowFn() {
      var details_element = document.getElementsByClassName(
        "bt-Delivery-wrapper-show-close"
      )[0];
      details_element.classList.toggle("Delivery-wrapper-show");
      document
        .getElementById("product-Delivery-icon-id")
        .classList.toggle("icon-rotate");
    },
    addCustomOption(option) {
      // console.log(
      //   "235689 In  addCustomOption Funtion \ncustom options are ",
      //   this.sendProductCustomOptions
      // );
      let prodFlag = true;
      if (this.sendProductCustomOptions.length === 0) {
        this.sendProductCustomOptions.push(option);
        // console.log("11226610 ", this.sendProductCustomOptions);
      } else {
        this.sendProductCustomOptions.forEach((prodOption, index) => {
          // console.log(
          //   "235689 \n",
          //   "prodOption.title",
          //   prodOption,
          //   "\n",
          //   " option.title",
          //   option,
          //   "\n",
          //   index,
          //   "\n",
          //   this.sendProductCustomOptions.length,"prodOption.title === option.title" ,prodOption.title === option.title,"\n index === this.sendProductCustomOptions.length - 1",index === this.sendProductCustomOptions.length - 1
          // );
          if (prodOption.title === option.title) {
            // console.log("235689 Updating the custom option");
            prodOption = option;
            this.sendProductCustomOptions[index] = option;
            this.sendProductCustomOptions[index];
            prodFlag = false;
            // console.log(
            //   "1122669 indexer",
            //   index,
            //   this.sendProductCustomOptions[index]
            // );
          } else {
            if (index === this.sendProductCustomOptions.length - 1) {
              // console.log("235689 Loop ended");
              if (!prodFlag) {
                // console.log("235689 Adding new custom option");
                this.sendProductCustomOptions.push(option);
                //   console.log("1122667 ", this.sendProductCustomOptions);
              } else {
                // console.log("235689 Already Updated the custom option");
                //   console.log("1122668 ", this.sendProductCustomOptions);
              }
            } else {
              // console.log("235689 Loop not ended");
            }
          }
        });
      }
    },
    setColorName(name) {
      this.colorName = name;
      this.isFabrics = false;
      this.unCheckfabrics = true;
    },
    getColorName() {
      // console.log("741258 in get color name",this.colorName);
      if (this.colorName == "") {
        this.getCurrentProduct.custom_options.forEach(option => {
          // console.log("741258 ",option);
          if (
            option.iscolor == 1 ||
            option.iscolor == "1" ||
            option.iscolor == true
          ) {
            this.colorName = "Please Select ";
          }
        });
      } else {
        return this.colorName;
      }
    },
    showColorPicker() {
      this.colorPickerCheck = true;
      //  document.body.style.overflow("hidden");
      //  let scrollDisable = document.getElementsByTagName("body");
      //  scrollDisable.style.overflow("hidden");
      //    console.log( "  document.body",scrollDisable);
      document.body.style.overflow = "hidden";
    },
    hideColorPicker() {
      this.colorPickerCheck = false;
      if (this.unCheckfabrics) {
      } else {
        this.isFabrics = true;
        this.unCheckfabrics = false;
      }
      document.body.style.overflowY = "scroll";
    },
    setReviews() {
      try {
        let product_Id = "";

        if ((this.getCurrentProduct.type_id = "configurable")) {
          product_Id = this.getCurrentProduct.parentId;
        } else {
          product_Id = this.getCurrentProduct.id;
        }
        const URL =
          config.api.url + config.reviews.getReviews_endpoint + product_Id;
        // const URL = 'http://46.101.17.57/' + config.reviews.getReviews_endpoint + product_Id;
        // console.log("1234654321 URL in products is ",URL);
        // const URL =
        //   'https://vue.bedfactorydirect.co.uk/vueapi/ext/reviews/getReview?id=454';
        axios
          .get(URL)
          .then(res => {
            const response = res;
            if (response.status !== 200 && !review.data.length) {
              throw ("Error Occured while requesting for reviews:",
              response.data[0].message);
            } else {
              this.reviewData = response.data[1];
              // console.log("1234654321 Reviews are: ",this.reviewData);
              // console.log(this.reviewData,"this.reviewData",this.reviewData.average_score, (parseFloat (this.reviewData.bottomline.average_score)).toFixed(2));
              let average = parseFloat(
                this.reviewData.bottomline.average_score
              ).toFixed(1);
              this.reviewData.bottomline.average_score = average;
              // console.log("this.reviewData",this.reviewData);
            }
          })
          .catch(err => {
            throw ("Error:", err);
          });
      } catch (err) {
        console.error("error message", err);
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
        this.getCurrentProduct.filter_type === "Pack"
      ) {
        this.vinylPayload.productId = this.getCurrentProduct.id;
        await this.$store
          .dispatch("vinyl/getVinylItems", this.vinylPayload)
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
              // console.log("getVinylProductItemFailed", res);
            }
          });
      }
    },
    async getVinylItemProducts() {
      if (this.vinylProducts.skus && this.vinylProducts.skus.length > 0) {
        let vinylItemsQuery = prepareRelatedQuery(
          "sku",
          this.vinylProducts.skus
        );
        await this.$store
          .dispatch("product/list", {
            query: vinylItemsQuery,
            size: 10,
            prefetchGroupProducts: false,
            updateState: false
          })
          .then(({ items }) => {
            this.vinylProducts.skuItems = items;
          })
          .catch(err => {
            // console.log("FailedToFetch vinyl Item Products", err);
          });
      }
      if (
        this.vinylProducts.recommend &&
        this.vinylProducts.recommend.length > 0
      ) {
        let vinylRecommendItemsQuery = prepareRelatedQuery(
          "sku",
          this.vinylProducts.recommend
        );
        await this.$store
          .dispatch("product/list", {
            query: vinylRecommendItemsQuery,
            size: 10,
            prefetchGroupProducts: false,
            updateState: false
          })
          .then(({ items }) => {
            this.vinylProducts.recommendItems = items;
          })
          .catch(err => {
            // console.log("FailedToFetch vinyl Recommend Products", err);
          });
      }
    },
    async disabledQuoteAddtoCart() {
      if (
        this.getCartToken &&
        this.getCartToken !== "" &&
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
          "sku",
          this.similar_products.skus
        );

        await this.$store
          .dispatch("product/list", {
            query: relatedProductsQuery,
            size: 10,
            prefetchGroupProducts: false,
            updateState: false
          })
          .then(({ items }) => {
            this.similar_products.items = items.filter(
              i => !i.product_banner_image?.includes("Out_of_Stock")
            );
            // Also update the skus, remove the ones not included in items.
            this.similar_products.skus = this.similar_products.items.filter(i =>
              this.similar_products.skus.includes(i.sku)
            );
          })
          .catch(err => {
            // console.log("FailedToFetch Similar Products", err);
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
          console.log("hasAnError", err);
        });
    },
    async getProduct() {
      this.product = await this.$store.dispatch("product/single", {
        options: { sku: this.sku },
        setCurrentProduct: false,
        setCurrentCategoryPath: false,
        selectDefaultVariant: false
      });
      this.img = this.product.image;
    },
    productTileTypeUnitCheck(product) {
      let productUnit = "";
      if (product.product_price_type) {
        if (this.productTileType[product.product_price_type] === "sqm") {
          productUnit = "m<sup>2</sup>";
        } else if (this.productTileType[product.product_price_type]) {
          productUnit = this.productTileType[product.product_price_type];
        } else {
          productUnit = "m<sup>2</sup>";
        }
      } else {
        productUnit = "m<sup>2</sup>";
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
        productPayload["category"] = primaryCategory[0].name;
      }
      this.$store.commit("google-gtag/SET_PRODUCT_CLICK", productPayload);
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
        typeof this.getCurrentProduct !== "undefined" &&
        this.getCurrentProduct.category &&
        typeof this.getCurrentProduct.category !== "undefined" &&
        this.getCurrentProduct.primary_category &&
        this.getCurrentProduct.primary_category !== "null"
      ) {
        if (typeof this.getCurrentProduct.category === "object") {
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
      // this.$refs.getProductGallery.$refs.carousel.stopVideo();
      document.getElementsByTagName("figure")[0].click();
    },
    openGallery() {
      this.$refs.getProductGallery.$refs.carousel.openOverlay();
      setTimeout(() => {
        document.getElementById("custBtn").click();
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
        .catch(err => console.log("getCartIdHasErr", err));
      let reqUrl = apiUrl + optionsPath + productId + "/" + cartId;
      return axios.get(reqUrl);
    },
    async getCartId() {
      if (!this.getCartToken) {
        await this.$store.dispatch("cart/createCartId", {
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
              this.hasSampleType("cut_size") ||
              this.hasSampleType("full_size") ||
              this.hasSampleType("half_size") ||
              this.hasSampleType("quarter_size")
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
      let x = document.getElementsByTagName("BODY")[0];
      x.style.overflow = "hidden";
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
      const headerClass = document.getElementsByClassName("header")[0];
      const headerHeight = parseFloat(headerClass.offsetHeight);
      const elementPosition = productReviews.getBoundingClientRect().top;
      const offsetPosition = elementPosition - headerHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      if (screen.width < 991) {
        setTimeout(() => {
          const elementPosition = productReviews.offsetTop;
          const offsetPosition = elementPosition - headerHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }, 10);
      }
    },
    navigateToQA() {
      let productReviewsQas = this.$refs.reviewsSection.$refs.productQAS;
      const headerClass = document.getElementsByClassName("header")[0];
      const headerHeight = parseFloat(headerClass.offsetHeight);
      const elementPosition = productReviewsQas.getBoundingClientRect().top;
      const offsetPosition = elementPosition - headerHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      if (screen.width < 991) {
        setTimeout(() => {
          const elementPosition = productReviewsQas.offsetTop;
          const offsetPosition = elementPosition - headerHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
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
      event.target.classList.add("hidden");
    },
    productDetails() {
      var desc = document.getElementsByClassName("productdetail-close")[0];
      desc.classList.toggle("productdetail-show");
      document.getElementById("right-icon").classList.toggle("icon-rotate");
    },
    infoProd() {
      var desc = document.getElementsByClassName("infoprod-close")[0];
      desc.classList.toggle("infoprod-show");
      document
        .getElementById("right-icon-info")
        .classList.toggle("icon-rotate-info");
    },
    show() {
      this.$bus.$emit("modal-show", "modal-calculator");
      this.addWasteRadioCalculator = false;
    },
    updateSqmQuantity(productQuantity) {
      console.log(
        "productQuantity",
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
      console.log("7894562 notificationData", notificationData);
      this.$store.dispatch("notification/spawnNotification", {
        type: "error",
        message: this.$t(
          "The product is out of stock and cannot be added to the cart!"
        ),
        action1: { label: this.$t("OK") }
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
          .getElementById("wastage wastage-btn")
          .classList.add("addWaste");
      } else {
        document
          .getElementById("wastage wastage-btn")
          .classList.remove("addWaste");
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
      if (sqmQuantity === "") {
        if (
          this.getCurrentProduct &&
          this.getCurrentProduct.filter_type &&
          this.getCurrentProduct.filter_type === "Pack"
        ) {
          let vinylAccessories = document.getElementById(
            "vinyl-accessories-box"
          );
          if (vinylAccessories && vinylAccessories.classList) {
            vinylAccessories.classList.remove("transform-active-vinyl");
          }
        }
        let wasteArea = document.getElementById("wastage-main-box");
        if (wasteArea && wasteArea.classList) {
          wasteArea.classList.remove("transform-active");
        }
      } else {
        if (
          this.getCurrentProduct &&
          this.getCurrentProduct.filter_type &&
          this.getCurrentProduct.filter_type === "Pack"
        ) {
          let vinylAccessories = document.getElementById(
            "vinyl-accessories-box"
          );
          if (vinylAccessories && vinylAccessories.classList) {
            vinylAccessories.classList.add("transform-active-vinyl");
          }
        }
        let wasteArea = document.getElementById("wastage-main-box");
        if (wasteArea && wasteArea.classList) {
          wasteArea.classList.add("transform-active");
        }
      }
      if (!sqmQuantity || parseFloat(sqmQuantity) === 0) {
        this.productQuantityFloat = 1;
        this.getCurrentProduct.qty = 1;
        return false;
      }
      let classCheckOnPrice1 = document.getElementById("hidePriceOnLoadPage");
      // if (classCheckOnPrice1) {
      //   classCheckOnPrice1.classList.contains('hide')
      // }
      if (classCheckOnPrice1) {
        classCheckOnPrice1.classList.remove("hide");
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
      if (document.getElementById("wastage wastage-btn")) {
        let classCheck = document
          .getElementById("wastage wastage-btn")
          .classList.contains("addWaste");
        if (classCheck && this.addWasteRadio) {
          document.getElementById("wastage wastage-btn").checked = false;
          document
            .getElementById("wastage wastage-btn")
            .classList.remove("addWaste");
          // this.addWaste();
        }
      }
    },
    addWaste() {
      this.addWasteRadio = !this.addWasteRadio;
      if (this.addWasteRadio) {
        document
          .getElementById("wastage wastage-btn")
          .classList.add("addWaste");
      } else {
        document
          .getElementById("wastage wastage-btn")
          .classList.remove("addWaste");
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

      let classCheckOnPrice = document
        .getElementById("hidePriceOnLoadPage")
        .classList.contains("hide");
      if (classCheckOnPrice) {
        document.getElementById("hidePriceOnLoadPage").classList.remove("hide");
      }
      if (this.tilesQuantity === "") {
        if (
          this.getCurrentProduct &&
          this.getCurrentProduct.filter_type &&
          this.getCurrentProduct.filter_type === "Pack"
        ) {
          let vinylAccessories = document.getElementById(
            "vinyl-accessories-box"
          );
          if (vinylAccessories && vinylAccessories.classList) {
            vinylAccessories.classList.remove("transform-active-vinyl");
          }
        }
        let wasteArea = document.getElementById("wastage-main-box");
        if (wasteArea && wasteArea.classList) {
          wasteArea.classList.remove("transform-active");
        }
      } else {
        if (
          this.getCurrentProduct &&
          this.getCurrentProduct.filter_type &&
          this.getCurrentProduct.filter_type === "Pack"
        ) {
          let vinylAccessories = document.getElementById(
            "vinyl-accessories-box"
          );
          if (vinylAccessories && vinylAccessories.classList) {
            vinylAccessories.classList.add("transform-active-vinyl");
          }
        }
        let wasteArea = document.getElementById("wastage-main-box");
        if (wasteArea && wasteArea.classList) {
          wasteArea.classList.add("transform-active");
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
      console.log("7894567 notificationData", notificationData);
      this.$store.dispatch("notification/spawnNotification", {
        type: "warning",
        message: this.$t(
          "No such configuration for the product. Please do choose another combination of attributes."
        ),
        action1: { label: this.$t("OK") }
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
        return config.server.baseUrl + "/" + str;
      }
      return str;
    },
    getImageUrl(img) {
      if (!img) {
        return "";
      }

      let subPathImg = "img/250/250/resize/catalog/product";
      if (!this.validateUrl(img)) {
        return subPathImg + img;
      }
    },

    // change filter variant
    async changeFilter(variant) {
      console.log('changeFilter variant',variant)
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
      this.$bus.$emit("modal-show", "modal-sizeguide");
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
        if (
          this.getCurrentProduct.configurable_options &&
          this.getCurrentProduct.configurable_options.length > 0
        ) {
          let flag = true;
          let count = 0;
          let totalOption = 0;
          // console.log("74132", this.currentConfiguration);
          for (let i in this.currentConfiguration) {
            totalOption++;
            // console.log("74132 total option ", totalOption);
            //console.log("i = ",i , this.currentConfiguration[i],"\n\n\n",this.currentConfiguration[i].id === child[i],this.currentConfiguration[i].id , child[i]);
          }
          this.getCurrentProduct.configurable_children.forEach(
            (child, index) => {
              // console.log(
              //   "child ",
              //   child,
              //   child.stock.qty,
              //   this.currentConfiguration,
              //   this.getCurrentProduct.configurable_children.length,
              //   index + 1
              // );
              for (let i in this.currentConfiguration) {
                // console.log(
                //   "i = ",
                //   this.currentConfiguration,
                //   i,
                //   this.currentConfiguration[i],
                //   "\n\n\n",
                //   this.currentConfiguration[i].id === child[i],
                //   this.currentConfiguration[i].id,
                //   child[i]
                // );
                if (this.currentConfiguration[i].id === child[i]) {
                  // console.log(i, " matched");
                  count++;
                } else {
                  flag = false;
                }
              }
              // console.log("count is ", count, totalOption);
              if (count === totalOption) {
                // console.log("Options matched ");
                this.manageQuantity = false;
                this.maxQuantity = child.stock.qty;
                // console.log("Options matched hereeeee", this.maxQuantity);
              }
              count = 0;
              if (
                this.getCurrentProduct.configurable_children.length ===
                index + 1
              ) {
                if (flag) {
                  console.log('check flag property',flag)
                  this.manageQuantity = false;
                  this.maxQuantity = child.stock.qty;
                }
              }
            }
          );
          // console.log("12345654321 current product is configurable ",this.getCurrentProduct.stock.qty,JSON.stringify(this.getCurrentProduct),this.getCurrentProduct.colour,"       ",this.getCurrentProduct.size);
          // this.manageQuantity = false;
          // this.maxQuantity = this.getCurrentProduct.stock.qty;
          // this.maxSqmQuantity = this.getCurrentProduct.maxsqmquantity;
          // console.log("max is ",this.maxQuantity , this.getCurrentProduct.stock.qty);
        } else {
          const res = await this.$store.dispatch("stock/check", {
            product: this.getCurrentProduct,
            qty: this.getCurrentProduct.qty
          });
          // console.log(
          //   "12345654321 current product is ",
          //   JSON.stringify(this.getCurrentProduct),
          //   this.getCurrentProduct.colour,
          //   "       ",
          //   this.getCurrentProduct.size,
          //   " stock is ",
          //   res
          // );
          this.manageQuantity = res.isManageStock;
          this.maxQuantity = res.qty;
          this.maxSqmQuantity = this.getCurrentProduct.maxsqmquantity;
        }
      } finally {
        this.isStockInfoLoading = false;
      }
    },
    handleQuantityError(error) {
      this.quantityError = error;
    },
    async getCustomerPhotos() {
      const customerPhotosRes = await this.$store.dispatch(
        "customerphotos/customerPhotosFunction",
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
      ? this.getCurrentProduct.description.replace(/<\/?[^>]+(>|$)/g, "")
      : "";
    let metaLength = 233;
    if (metaDescription) {
      metaDescription =
        metaDescription.length > metaLength
          ? metaDescription.substring(0, metaLength - 3) + "..."
          : metaDescription;
    }
    let metaData = [
      {
        property: "og:url",
        content: this.getCurrentProduct.canonical_url
          ? this.getCurrentProduct.canonical_url
          : "/" + this.getCurrentProduct.url_path
      },
      {
        property: "og:title",
        content: htmlDecode(
          this.getCurrentProduct.meta_title || this.getCurrentProduct.name
        )
      },
      {
        property: "og:type",
        content: "website"
      },
      {
        property: "og:description",
        content: this.getCurrentProduct.meta_description
          ? this.getCurrentProduct.meta_description
          : metaDescription
      },
      {
        property: "og:image",
        content:
          config.images.baseUrl +
          "1200/630/resize/catalog/product" +
          (this.getCurrentProduct.google_feed_img
            ? this.getCurrentProduct.google_feed_img
            : this.getCurrentProduct.image)
      }
    ];

    if (this.getCurrentProduct.meta_description) {
      metaData.push({
        vmid: "description",
        name: "description",
        content: this.getCurrentProduct.meta_description
      });
    } else {
      metaData.push({
        vmid: "description",
        name: "description",
        content: metaDescription
      });
    }

    return {
      link: [
        {
          rel: "canonical",
          href: this.getCurrentProduct.canonical_url
            ? this.getCurrentProduct.canonical_url
            : "/" + this.getCurrentProduct.url_path
        }
      ],
      title: htmlDecode(
        this.getCurrentProduct.meta_title || this.getCurrentProduct.name
      ),
      titleTemplate: htmlDecode("%s"),
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
.chevron-down {
  background: url(/assets/icons/rightarrow.png) no-repeat 99% 53% !important;
  background-size: 17px !important;
}
.chevron-down-icon {
  background: url(/assets/icons/downarrow.png) no-repeat 99% 53% !important;
  background-size: 17px !important;
  appearance: none;
}
.bt-new-description-main {
  background-color: #f6f6f6;
  -webkit-box-shadow: 0px 0px 5px -1px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 5px -1px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 5px -1px rgba(0, 0, 0, 0.75);
}
.product-description-right {
  order: 1;
  -webkit-order: 1;
}
table {
  border: 1px solid #ccc;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  width: 100%;
  table-layout: fixed;
}
table tr {
  border: 1px solid red;
  padding: 0.35em;
}

table td {
  border: 1px solid red;
  padding: 0.625em;
  text-align: left;
}
h2.h3 {
  font-size: 26px;
  font-family: "Oblik";
  color: #071a44;
  padding: 0px 0px 0px 0px;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  margin: 35px 0px 25px 0px;
  cursor: pointer;
}
h2.h3:after {
  border-bottom: 1px solid #f0f1f2;
  content: "";
  width: 100%;
  position: absolute;
  left: 0;
  bottom: -10px;
}
.details-dimension {
  margin: 5px 0px 25px 0px !important;
}
.bt-dimension-wrapper-show-close {
  display: none;
}

.bt-dimension-wrapper-show-close.dimension-wrapper-show {
  display: block;
}
.Icon-update {
  background: url(/assets/icons/rightarrow.png) no-repeat 100% 46% !important;
  background-size: 17px !important;
  // position: relative;
  // float: right;
  // height: 10px;
  // width: 300px;
}
.icon-rotate {
  background: url(/assets/icons/downarrow.png) no-repeat 100% 46% !important;
  background-size: 17px !important;
}
// @media (max-width: 991px) and (min-width: 768px) {
//   .delivery-info-icon {
//     margin-top: -18px;
//   }
// }
// @media (max-width: 504px) {
//   .delivery-info-icon {
//     margin-top: -14px;
//   }
// }
// @media (max-width: 452px) {
//   .delivery-info-icon1 {
//     margin-top: -14px;
//   }
// }
// @media (max-width: 429px) {
//   .delivery-info-icon2 {
//     margin-top: -14px;
//   }
// }
i.icon-rotate {
  transform: rotate(90deg);
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
.delivery-main .cms-content p {
  margin: 0;
}
.delivery-main .cms-content ul {
  margin-top: 10px;
  margin-bottom: 10px;
}
.delivery-main .cms-content p a {
  color: #4dba87;
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
.error1 {
  color: #eb5757;
  padding-top: 10px;
  display: block;
  width: auto;
  font-family: "Roboto", sans-serif !important;
}
.error5 {
  color: gray;
  padding-top: 6px;
  font-weight: 600;
  display: block;
  font-family: "Roboto", sans-serif !important;
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
    padding: 20px 15px 15px;
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
      color: #071a44;
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
            color: #ffd055;
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
        color: #333333;
        cursor: pointer;
      }

      .qa {
        font-family: Arial;
        font-size: 14px;
        color: #071a44;

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
      color: #333333;
      display: inline-block;
      font-family: Arial;
      font-size: 0.815rem;
      -webkit-text-size-adjust: 100% !important;
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
.vinyl-products-detail {
  padding: 17px 40px 13px 40px;
  height: 100%;
  -webkit-transition: all 1s ease;
  -o-transition: all 1s ease;
  transition: all 1s ease;
  overflow: hidden;
  border-bottom: 1px solid #cccccc;
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
      font-size: 2rem;
      color: #d20505;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
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

// .add-to-cart button {
//   background-attachment: scroll;
//   background-clip: border-box;
//   background-color: #071a44;
//   background-image: url(../assets/images/add-to-basket.jpg);
//   background-origin: padding-box;
//   background-position: 14% 45%;
//   background-repeat: no-repeat;
//   background-size: auto auto;
//   border: 2px solid #071a44;
//   border-radius: 3px;
//   color: #fff;
//   cursor: pointer;
//   display: block;
//   font-size: 14px;
//   max-width: 260px;
//   min-height: auto;
//   position: relative;
//   text-align: center;
//   width: 100%;
//   font-family: Arial;
//   line-height: auto;
//   font-weight: bold;
//   padding: 15px 0px;
//   text-transform: uppercase;
//   margin-top: 5px;
//   float: right;
//   @media (max-width: 767px) {
//     background-position: 15% 45%;
//   }
// }

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

  .visualise-tiles {
    background: #29b0f1 url(/dist/visualise.png?d9770c1…) no-repeat scroll 24%
      50%;
    -webkit-border-image: none;
    -o-border-image: none;
    border-image: none;
    color: #fff;
    font-family: Arial;
    font-size: 14px;
    text-align: center;
    width: 100%;
    max-width: 512px;
    font-weight: bold;
    cursor: pointer;
    padding: 17px 0 17px 0px;
    text-transform: uppercase;
    border-radius: 3px;
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
  .product-top-section {
    padding: 0px;

    .container {
      padding: 0px;
    }

    .product-detail {
      padding: 0px;
      margin-top: 1rem;

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

        /* .rating {
          display: none;
        } */

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
      padding: 20px 0px 20px 40px;
      width: 100%;
      .h3 {
        display: block;
        margin: auto;
        text-align: center;
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
  }
  .add-to-cart .mb40 {
    margin-bottom: 0px;
    padding-bottom: 12px;
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
.product-detail-inner .add-to-cart {
  padding: 20px 0px 20px 40px;
}
.bt-new-description-main ul {
  padding: 18px 0px 18px 18px;
  list-style: none;
}

.bt-new-description-main ul li {
  color: #333333;
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

.Specifications-main table {
  border: 1px solid #ccc;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  table-layout: fixed;
}
@media only screen and (max-width: 700px) and (min-width: 320px) {
  .Specifications-main table {
    width: 100%;
  }
}
.Specifications-main table tr {
  border: 1px solid red;
  padding: 0.35em;
}

.Specifications-main table td {
  border: 1px solid black;
  padding: 0.625em;
  text-align: left;
  font-size: 14px !important;
}

@media only screen and (max-width: 767px) and (min-width: 320px) {
  .Specifications-main table td {
    font-size: 1.5vw !important;
  }
  .Specifications-main td strong {
    font-size: 1.4vw !important;
  }
  .Specifications-main p {
    font-size: 1.5vw !important;
  }
  .Specifications-main p strong {
    font-size: 14px !important;
  }
}
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
  form.custom-options {
    padding-left: 25px !important;
  }
  .fabric-btn-responsive {
    padding-left: 25px !important;
  }
}
select.m0.no-outline {
  width: 350px;
  padding-left: 5px;
}
form.custom-options {
  padding-left: 40px;
}
.fabric-btn-responsive {
  padding-left: 40px;
}
.fabric-button-design {
  width: 95%;
}
button.select-color-button {
  width: 100%;
  border: 2px solid #071a44;
  height: 44px;
  background: #fff;
  text-align: left;
  color: #071a44;
  font-size: 16px;
}
.cl-white {
  float: right;
  color: #ffff !important;
}
label.base-input-number__label.cl-primary.flex {
  display: none !important;
}
.base-input-numberz {
  margin-top: -2px !important;
}

.base-input-number__input {
  border: 2px solid #071a44 !important;
  text-align: center !important;
  height: 45px !important;
  width: 45px !important;
  border-radius: 7px;
}
.addtocartbuttonMobile {
  padding-right: 0px !important;
}
@media (min-width: 992px) {
  .bt-product-qty {
    margin-bottom: 35px !important;
  }
}
@media (max-width: 400px) {
  .add-to-cart button {
    background-position: 10% 45% !important;
  }
}
.product-head.adhesive-product-head h1 {
  margin: 5px 0px 10px 0px;
}
@media only screen and (max-width: 767px) {
  .product-description-left {
    order: 2;
  }
}
.lh30.h5 p {
  color: #333333;
  font-size: 14px;
  line-height: 30px;
}
.Specifications-main p {
  color: #333333;
  font-size: 14px;
  line-height: 30px;
}
.Specifications-main ul {
  color: #333333;
  font-size: 14px;
  line-height: 30px;
}
.cms-content p {
  color: #333333;
  font-size: 14px;
  line-height: 30px;
}
.cms-content h3 {
  color: #333333;
  font-size: 14px;
  line-height: 30px;
}
.cms-content a {
  color: #333333;
  font-size: 14px;
  line-height: 30px;
}
.cms-content strong {
  color: #57c9c0;
  font-size: 14px;
  line-height: 30px;
}
.cl-primary.variants {
  padding-left: 40px;
}
@media (max-width: 767px) {
  .cl-primary.variants {
    padding-left: 25px !important;
  }
  .V-12-retail-Finance {
    margin-left: 27px !important;
    width: 91% !important;
  }
}
h4.variants-label.basin-head {
  color: #071a44 !important;
  margin-bottom: 5px;
}
.basin_size {
  width: 95%;
}
.sizes.basin_size select {
  width: 100%;
  font-size: 16px;
  border: 2px solid #071a44;
  padding-left: 4px !important;
  cursor: pointer;
  outline: none;
}
.cart-items {
  width: 95%;
  display: flex;
}
.float-right {
  float: right;
}
.add-to-cart button {
  background-attachment: scroll;
  background-clip: border-box;
  background-image: url("/assets/add-to-basket.jpg");
  background-origin: padding-box;
  background-position: 14% 45%;
  background-repeat: no-repeat;
  background-size: auto auto;
  border: 2px solid #071a44;
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
  font-weight: bold;
  padding: 15px 0px;
  text-transform: uppercase;
  margin-top: 5px;
  float: right;
  background: #071a44;
}
.disabled {
  background-color: #071a44 !important;
}
.\:bg-cl-th-secondary:hover {
  background-color: #071a44 !important;
}
.basin_size.colour {
  width: 95%;
}

button.VueCarousel-navigation-button.VueCarousel-navigation-prev {
  background: url(/assets/icons/rightarrow.png) no-repeat 99% 53% !important;
  background-size: 18px !important;
  transform: rotate(180deg);
  position: absolute;
  left: -17px;
}
button.VueCarousel-navigation-button.VueCarousel-navigation-next {
  background: url(/assets/icons/rightarrow.png) no-repeat 99% 53% !important;
  background-size: 17px !important;
}
</style>
