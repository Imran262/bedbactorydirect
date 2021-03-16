<template>
  <div id="category" ref="categoryPage">
    BEdssssssssss
    <header class="bg-cl-secondary py35 pl20 mobileheader">
      <div class="container">
        <!-- <breadcrumbs  class="breadcrumb"/> -->
        <div class="category-info">
          <div class="row middle-sm">
            <h1 class="col-sm-12 category-title mb10">
              {{ getCurrentCategory.name }}
            </h1>
            <!-- <div class="sorting col-sm-2 align-right mt50"></div> -->
          </div>
        </div>
      </div>
      <div class="under-catergory-filter">
        <div class="container">
          <div class="row m0images catrow" v-if="!listingPageCompute">
            <button
              v-if="pageLayout !== '1column'"
              class="col-xs-5 mr15filters1 mobile-filters-button1 brdr-none cl-white"
              @click="
                openFilters();
                overlayshow();
                buttonshow();
              "
            >
              <img src="/assets/images/filter.svg" alt="filter" />
              <p>{{ $t('Filter') }}</p>
            </button>
          </div>

          <div
            class="row m0 prodrow"
            v-show="listingPageCompute"
          >
            <button
              class="col-xs-2 col-sm-2 mr15filters mobile-filters-button brdr-none cl-white"
              @click="
                openFilters();
                overlayshow();
                buttonshow();
              "
            >
              <img src="/assets/images/filter.svg" alt="filter" />
              <p>{{ $t('Filter') }}</p>
            </button>
            <span
              class="weight-400 sidebar__header__clear pointer sans-serif flex lh37 sortbycleartxt col-sm-4 col-xs-2"
            >
              <p
                class="clearallp clearAllClass"
                @click="resetAllFilters"
              >
                {{ $t('Clear All') }}
              </p>
            </span>
            <div class="sorting1 sot col-sm-6 col-md-2 col-xs-8 p0">
              <div class="sortp1">
                <p>Sort by:</p>
              </div>
              <div class="dropd1">
                <sort-by
                  :has-label="true"
                  @change="changeFilterSort"
                  :value="getCurrentSearchQuery.sort"
                />
              </div>
              <div class="mobile-sorting p0">
                <p>{{ apiTotalsNums }} Results</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <header class="desktopheader">
      <div class="container">
        <router-link
          :to="localizedRoute(product_link ? '/' + product_link : '')"
        >
          <div class="firstcol title-box sb-category-tile-text" v-if="getCurrentCategory.overlay_on_banner === 1 || getCurrentCategory.overlay_on_banner === '1'">
            <div class="sb-left-text">
              <h1>{{ getCurrentCategory.name }}</h1>
              <p v-html="getCurrentCategory.cat_banner_desp" />
            </div>
          </div>
          <div class="secondcol img-box">
            <img
              :src="
                getCurrentCategory.cat_banner
                  ? `${baseUrlImage}img/1280/298/resize/catalog/category/${getCurrentCategory.cat_banner}`
                  : `/assets/category-images/header.png`
              "
              :alt="getCurrentCategory.name"
              class="headerimg"
            />
          </div>
        </router-link>
      </div>
      <div class="container">
        <div class="row m0">
          <button
            class="col-xs-4 mt25 mr15 p15 mobile-filters-button bg-cl-th-accent brdr-none cl-white h5 sans-serif fs-medium-small"
            @click="openFilters"
          >
            {{ $t('Filters') }}
          </button>
          <div class="mobile-sorting col-xs-4 mt25">
            <sort-by
              @change="changeFilter"
              :value="getCurrentSearchQuery.sort"
            />
          </div>
        </div>
      </div>
    </header>
    <!-- <header v-else> </header> -->
    <div itemscope itemtype="http://schema.org/Organization">
      <meta itemprop="name" content="Tile Mountain" />
      <meta itemprop="url" content="https://www.tilemountain.co.uk/" />
      <meta
        v-for="socialLink in socialLinksSchema"
        :key="socialLink"
        itemprop="sameAs"
        :content="socialLink"
      />
    </div>
    <div itemscope itemtype="http://schema.org/WebSite">
      <meta itemprop="name" content="Tile Mountain" />
      <meta itemprop="url" content="https://www.tilemountain.co.uk/" />
    </div>
    <div class="container pb60">
      <breadcrumbs class="pt40 pb20 hidden-xs breadcrumb" />
      <div
        class="row middle-sm secondhead"
        ref="secondHead"
        v-if="listingPageCompute"
      >
        <span class="col-sm-2 side-filter sorting pl0">
          <img
            src="/assets/images/filter.svg"
            alt="filter"
            class="filtericon"
          />
          <p class="filterp">{{ $t('Refine by') }}</p>
        </span>
        <div class="col-md-10 sotby">
          <div class="sorting sot p0">
            <div class="sortp">
              <p>Sort by:</p>
            </div>
            <div class="dropd">
              <sort-by
                :has-label="true"
                @change="changeFilterSort"
                :value="getCurrentSearchQuery.sort"
              />
            </div>
          </div>
          <div class="sorting droppy col-sm-4">
            <div class="textForTab">
              <p class="totalprods">{{ apiTotalsNums }} Results</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row pt10">
        <div
          v-if="pageLayout !== '1column'"
          class="col-md-2 start-xs category-filters p0 pr0"
        >
          <span class="weight-400 sidebar__header__clearAll pointer sans-serif flex lh25 clearAllClass hideClearAllClass" @click="resetAllFilters">
            {{ $t('Clear All') }}
          </span>
          <template v-for="(filter, index) in apiFacetCompute">
            <div
              class="index-div"
              :data-filter="index"
              :data-filter-key="index"
              :data-filter-type="(index === 'filter_type' && index === 'Type') ? 'checkbox' : ''"
              :key="index"
              v-if="filter.length > 0 && index !== 'colors' && index !== 'sizes' && index !== 'qty_per_sqm' && index !== 'category' && index !== 'crumbs_id'"
            >
              <h4
                @click="filterRef"
                class="filter-heading"
                :class="(index !== 'filter_type' && index !== 'Type') ? '' : 'toggleIcon'"
                :style="index === 'filter_type' && index !== 'Type' ? `background:none;` : ``"
              >
                {{ index }}
              </h4>
              <div
                class="filter-div"
                :class="(index !== 'filter_type') && index !== 'Type' ? '' : 'filter-open'"
              >
                <label
                  class="container1"
                  id="container1"
                  v-for="(filterSingle, indexSingle) in filter"
                  :key="indexSingle"
                >
                  <template>
                    <input type="checkbox" :code="index" :value="filterSingle.name" :codeSingle="filterSingle.name" @click="updateAppliedFilters($event)" :checked="isFilterActive({ index, filterSingle })" :class="isFilterActive({ index, filterSingle }) ? `active-filter` : `not-active`"/>
                    <span>{{ filterSingle.name }}</span>
                    <span class="checkmark1" />
                    <span v-if="filterSingle.count" class="product-counter">({{ filterSingle.count }})</span>
                  </template>
                </label>
              </div>
            </div>
          </template>
        </div>
        <div
          class="full-overlay"
          v-if="isOverlayShowing"
          @click="
            closeFilters();
            buttonclose();
          "
        />
        <div
          class="close-button"
          this.sorted="false"
          @click="buttonclose"
          v-if="closeButtonShowing"
        >
          <div class="close-container absolute w-100">
            <i
              class="material-icons p15 close cl-accent"
              @click="
                closeFilters();
                overlayclose();
              "
            >
              close
            </i>
          </div>
        </div>
        <div class="col-md-3 start-xs mobile-filters" v-show="mobileFilters">
          <h4 data-v-2b3298de="" class="sidebar__header  mb20 flex">
            <span  class="side-filter">
              <img  src="/assets/images/filter.svg" alt="filter" class="filtericon1">
              <p class="filterp">Refine by</p> <p class="filterp1">Filter</p>
              </span>
              <span  class="weight-400 sidebar__header__clear1 pointer sans-serif flex lh25 clearAllClass" @click="resetAllFilters">
                {{ $t('Clear All') }}
              </span>
          </h4>
          <template v-for="(filter, index) in apiFacetCompute">
            <div
              class="index-div"
              :data-filter="index"
              :data-filter-key="index"
              :data-filter-type="(index === 'filter_type' && index === 'Type') ? 'checkbox' : ''"
              :key="index"
              v-if="filter.length > 0 && index !== 'colors' && index !== 'sizes' && index !== 'qty_per_sqm' && index !== 'category' && index !== 'crumbs_id'"
            >
              <h4
                @click="filterRef"
                class="filter-heading"
                :class="(index !== 'filter_type' && index !== 'Type') ? '' : 'toggleIcon'"
                :style="index === 'filter_type' && index !== 'Type' ? `background:none;` : ``"
              >
                {{ index }}
              </h4>
              <div
                class="filter-div"
                :class="(index !== 'filter_type') && index !== 'Type' ? '' : 'filter-open'"
              >
                <label
                  class="container1"
                  id="container2"
                  v-for="(filterSingle, indexSingle) in filter"
                  :key="indexSingle"
                >
                  <template>
                    <input type="checkbox" :code="index" :value="filterSingle.name" :codeSingle="filterSingle.name" @click="updateAppliedFilters($event)" :checked="isFilterActive({ index, filterSingle })" :class="isFilterActive({ index, filterSingle }) ? `active-filter` : `not-active`"/>
                    <span>{{ filterSingle.name }}</span>
                    <span class="checkmark1" />
                    <span v-if="filterSingle.count" class="product-counter">({{ filterSingle.count }})</span>
                  </template>
                </label>
              </div>
            </div>
          </template>
          <div class="sticky pb10">
            <button-full
              class="mb20 btn__filter applyFilterBtnBR"
              @click.native="
                closeFilters();
                buttonclose();
              "
            >
              View
              {{ apiTotalsNums }}
              Products
            </button-full>
          </div>
        </div>
        <div
          class="border-box products-list"
          :class="[pageLayout !== '1column' ? 'col-md-10' : 'col-md-12']"
        >
          <div v-if="isCategoryEmpty" class="hidden-xs">
            <h4 data-testid="noProductsInfo">
              {{ $t('No products found!') }}
            </h4>
            <p>
              {{
                $t(
                  'Please change Your search criteria and try again. If still not finding anything relevant, please visit the Home page and try out some of our bestsellers!'
                )
              }}
            </p>
          </div>
          <div
            class="container pt0"
            id="subcategory-list"
            v-if="!listingPageCompute"
          >
            <div
              class="category-listing row m0 start-md"
              :class="getCurrentCategory.display_mode"
            >
              <!-- CategoryList -->
              <template v-for="(childrenCategory, index) in getCurrentCategoryBrResponseGetters">
                <div
                  class="col-sm-6 flex col-lg-3 col-md-3 col-xs-6 sb-item"
                  :class="isChildCategorySlug(childrenCategory.title)"
                  :key="childrenCategory.pid"
                  v-if="childrenCategory.pid != brCategoryChildId"
                >
                  <CategoryTile
                    :category="childrenCategory"
                    :category-index="index"
                    :category-type="
                      categoryTileTypeUnitCheck(childrenCategory)
                    "
                  />
                </div>
              </template>
            </div>
          </div>
          <div
            class="product-lisitng-inner"
            id="products-list-new"
            v-if="listingPage ||
              getCurrentCategory.display_mode === 'PRODUCTS' ||
              getCurrentCategory.display_mode === 'PRODUCTS_AND_PAGE'
            "
          >
            <lazy-hydrate
              :trigger-hydration="!loading"
              v-if="isLazyHydrateEnabled"
            >
              <product-listing
                :columns="defaultColumn"
                :products="apiProductsApi"
                @showPagination="showbottompage"
              />
            </lazy-hydrate>
            <product-listing
              v-else
              @showPagination="showbottompage"
              :columns="defaultColumn"
              :products="apiProductsApi"
            />
          </div>
          <div
            class="bottom-pagination"
            :class="bottompagination ? 'bordertop' : ''"
            v-if="listingPageCompute"
          >
            <ProductListingPagination
              v-if="bottompagination"
              :items="pagination.currentPageItems"
              :total-items="getCategoryProductsTotal"
              :page-size="pagination.pageSize"
              :category-id="getCurrentCategory.id"
              :initial-page="pagination.selectedPage"
              :scroll="true"
              @changePage="pageChanged"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration'
import ActiveFilters from 'src/modules/vsf-layered-nav/components/ActiveFilters.vue'
import Sidebar from 'src/modules/vsf-layered-nav/components/Sidebar'
import ProductListing from '../components/core/ProductListingCustom.vue'
import Breadcrumbs from '../components/core/Breadcrumbs.vue'
import SortBy from '../components/core/SortByCustom.vue'
import { getThumbnailPath, isServer } from '@vue-storefront/core/helpers'
import { getSearchOptionsFromRouteParams } from '@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers'
import config from 'config'
import Columns from '../components/core/Columns.vue'
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import { mapGetters } from 'vuex'
import { GTAGCategory } from 'src/modules/google-gtag/mixins/GTAGCategory'
import sortBy from 'lodash.sortby'
import CategoryTile from 'theme/components/core/blocks/CategoryTile/CategoryTile'
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks'
import { findAncestor } from '../helpers'
import {
  localizedRoute,
  currentStoreView
} from '@vue-storefront/core/lib/multistore'
import { htmlDecode } from '@vue-storefront/core/filters'
import { CategoryService } from '@vue-storefront/core/data-resolver'
import ProductListingPagination from '../components/core/blocks/ProductListingPagination'
import _ from 'lodash'
import { products, entities } from 'config'
import onBottomScroll from '@vue-storefront/core/mixins/onBottomScroll'

const THEME_PAGE_SIZE = (config && config.filterShowItems && config.filterShowItems.selectedOption) ? config.filterShowItems.selectedOption : 12

const composeInitialPageState = async (store, route, forceLoad = false) => {
  try {
    let filters = getSearchOptionsFromRouteParams(route.params)
    let customFilter = {
      url_path: route.fullPath.substring(1).replace(/\?.*/, '')
    }
    filters = { ...filters, ...customFilter }
    const cachedCategory = store.getters['category-next/getCategoryFrom'](
      route.path
    )
    const currentCategory =
      cachedCategory && !forceLoad
        ? cachedCategory
        : await store.dispatch('category-next/loadCategory', { filters })
    await store.dispatch('category-next/loadCategoryProducts', {
      route,
      category: currentCategory,
      pageSize: THEME_PAGE_SIZE,
      startIndex: route.query.page || 0
    })
    const breadCrumbsLoader = store.dispatch(
      'category-next/loadCategoryBreadcrumbs',
      {
        category: currentCategory,
        currentRouteName: currentCategory.name,
        omitCurrent: true
      }
    )

    if (isServer) await breadCrumbsLoader
    catalogHooksExecutors.categoryPageVisited(currentCategory)
  } catch (e) {
    console.error('Problem with setting Category initial data!', e)
  }
}

export default {
  name: 'CategoryPage',
  components: {
    LazyHydrate,
    ButtonFull,
    ProductListing,
    Breadcrumbs,
    ActiveFilters,
    Sidebar,
    SortBy,
    CategoryTile,
    Columns,
    ProductListingPagination
  },
  mixins: [GTAGCategory, onBottomScroll],
  data () {
    return {
      bottompagination: false,
      product_link: '',
      mobileFilters: false,
      totalCategoryItemsCustom: 0,
      defaultColumn: 3,
      loadingProducts: false,
      loading: true,
      children: [],
      isOverlayShowing: false,
      closeButtonShowing: false,
      sorted: false,
      hasActiveFilters: false,
      windowWidth: 0,

      // bannerUrl: null,
      // For Pagination
      pagination: {
        startIndex: 0,
        currentPageItems: [],
        pageSize: THEME_PAGE_SIZE,
        selectedPage: 1,
        hasFired: false
      },
      cateRoute: [],
      lengthOfProductArray: config.filterShowItems.selectedOption,
      baseUrlImage: '',
      apiFacets: [],
      apiTotalsNums: 0,
      apiProductsApi: 0,
      apiRangesApi: [],
      appliedFilters: [],
      listingPage: null,
      loaded: false,
      selectedFiltersValues: {}
    }
  },
  async serverPrefetch () {
    if (!this.children || this.children.length === 0) {
      // this.children = await this.fetchCategoriesAndSubCategories();
    }
  },
  watch: {
    async getCurrentCategoryId (to, from) {
      if (to !== from) {
        this.appliedFilters = []
        this.children = await this.fetchCategoriesAndSubCategories()
        this.listingPage = null
        this.apiFacets = [];
        this.apiTotalsNums = 0
        this.apiProductsApi = 0
        this.apiRangesApi = []
        this.selectedFiltersValues = {}
        this.BRCategoryRanges()
        this.setGtagProductsList({ isListingProducts: false }, 'watch of getCurrentCategoryId Category.vue')
        this.resetFilterTextShowFn()
      }
    },
    getCurrentCategoryBrProductsResponseGetters (newData, oldData) {
      if (newData !== oldData) {
        if (this.listingPageCompute) {
          this.setGtagProductsList({ isListingProducts: this.listingPageCompute }, 'fromWatchCategory')
        }
      }
    },
    apiFacetCompute (to, fromFacet) {
      if (to !== fromFacet) {
        // console.log('apiFacetTo', to)
        // console.log('apiFacetFrom', fromFacet)
      }
    },
    apiProductsApiCompute (to, fromFacet) {
      if (to !== fromFacet) {
        if (to.length && fromFacet.length && to.length > fromFacet.length) {
          let mappedIds = fromFacet?.map(p => p.pid);
          let filteredData = to.filter(p => !mappedIds.includes(p.pid));
          this.setGtagProductsList({
            isListingProducts: this.listingPageCompute,
            products: filteredData
          }, 'fromWatchCategory')
        }
      }
    },
    listingPageCompute (to, fromFacet) {
      // console.log('to>FacetIs', to);
      if (to !== fromFacet) {
        if (to === true) {
          this.setGtagProductsList({
            isListingProducts: this.listingPageCompute,
            products: this.apiProductsApiCompute
          }, 'fromWatchCategory')
        }
        // console.log('listingPageCompute', to)
        // console.log('listingPageComputeFrom', fromFacet)
      }
    },
    getBreadcrumbsRoutes (newval, old) {
      if (newval.length > 0 && !this.hasFired) {
        this.hasFired = true
        this.addBloom()
      }
    },
    async $route (to, from) {
      if (!this.asFired) {
        this.hasFired = true
        this.addBloom()
      }
      this.getCatproduct(this.getCurrentCategory.cat_banner_sku)
      if (from.fullPath !== to.fullPath && from.name === to.name) {
        await this.searchResultCall({
          count: this.pagination.pageSize,
          selectedPage: this.pagination.selectedPage,
          filtersArray: this.appliedFilters,
          sort: this.sortingStoreObj
        }).then((r) => {
          this.listingPage = true
        });
      }
      if (from.path !== to.path) {
        if (localStorage.getItem('topLevelCategoryPosition')) {
          setTimeout(() => {
            var localCatName = localStorage.getItem('topLevelCategoryPosition')
            // console.log('localCatName', localCatName)
            var customScrollPos = document.getElementsByClassName(localCatName)
            if (customScrollPos) {
              if (customScrollPos.length > 0) {
                var customScrollPosValue = document.getElementsByClassName(localCatName)[0].offsetTop
                if (customScrollPosValue) {
                  var customScrollPosValueFinal = customScrollPosValue - 500
                  window.scrollTo(0, customScrollPosValueFinal)
                }
              }
            }
          }, 1500)
        }
        this.clearSorting()
        // this.bannerUrlLink()
        setTimeout(() => {
          if (this.$store.getters['url/isBackRoute']) {
            let getScrollPosition = this.$store.getters['url/getCurrentRoute'] && this.$store.getters['url/getCurrentRoute'].scrollPosition ? this.$store.getters['url/getCurrentRoute'].scrollPosition.y : 0
            window.scrollTo(0, getScrollPosition)
          }
        }, 1000)
        // As Route Changes, send category event again.
        this.sendCategoryView();
      }
    },
    hasActiveFiltersOnPage (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal === true) {
          this.sorted = true
          this.hasActiveFilters = true
        } else {
          this.sorted = false
          this.hasActiveFilters = false
        }
      }
    }
  },
  created () {
    var self = this;
    self.$nextTick(function () {
      self.loaded = true;
    })
    this.baseUrlImage = config.server.baseUrl
    if (this.$route.query && this.$route.query.page && !isNaN(this.$route.query.page)) {
      this.pagination.selectedPage = parseInt(this.$route.query.page)
    }
  },
  beforeMount () {
    this.BRCategoryRanges();
    // this.apiFacets = this.getCurrentCategoryBrProductsFiltersResponseGetters
    // this.apiTotalsNums = this.getCurrentCategoryBrProductsTotalResponseGetters
    // this.apiProductsApi = this.getCurrentCategoryBrProductsResponseGetters
    // this.emptyResults = this.getCurrentCategoryBrProductsResponseGetters.length <= 0 ? true : !true
    // this.apiRangesApi = this.getCurrentCategoryBrResponseGetters
    window.addEventListener('load', (event) => {
      history.scrollRestoration = 'auto'
    })
    this.$bus.$on('gotop', this.gototop)
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  async mounted () {
    // console.log('MOun  call')
    if (this.$route && this.$route.params) {
      delete this.$route.params.slug
      let attributeCodesKey = Object.keys(this.$route.params)
      let newObjSelectedFiltersValues = {}
      let newObjSelectedFiltersAppliedValues = []
      for (let index = 0; index < attributeCodesKey.length; index++) {
        const attributeCodesKeyElement = attributeCodesKey[index];
        let paramsKeyValueSplit = this.$route.params[attributeCodesKeyElement].split(',')
        newObjSelectedFiltersValues = {
          [attributeCodesKeyElement]: paramsKeyValueSplit
        }
        newObjSelectedFiltersAppliedValues[attributeCodesKeyElement] = {
          filters: paramsKeyValueSplit,
          key: attributeCodesKeyElement
        }
      }
      this.selectedFiltersValues = newObjSelectedFiltersValues
      this.appliedFilters = newObjSelectedFiltersAppliedValues
    }
    this.getCatproduct(this.getCurrentCategory.cat_banner_sku)
    window.addEventListener('resize', this.myEventHandler)
    this.children = await this.fetchCategoriesAndSubCategories()
    // For Pagination
    this.pagination.currentPageItems = this.getCategoryProducts
    this.totalCategoryItemsCustom = this.getCategoryProductsTotal
    if (this.getBreadcrumbsRoutes.length > 0 && typeof BrTrk !== 'undefined') {
      this.addBloom()
    }

    // ForGtag
    if (!isServer) {
      // this.sendCategoryView();
      this.setGtagProductsList({ isListingProducts: this.listingPageCompute }, 'fromMounted')
    }
    this.resetFilterTextShowFn()
  },
  computed: {
    ...mapGetters({
      getCurrentSearchQuery: 'category-next/getCurrentSearchQuery',
      getCategoryProducts: 'category-next/getCategoryProducts',
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCurrentCategoryBrResponseGetters: 'category-next/getCurrentCategoryBrResponseGetters',
      getCurrentCategoryBrProductsResponseGetters: 'category-next/getCurrentCategoryBrProductsResponseGetters',
      getCurrentCategoryBrProductsTotalResponseGetters: 'category-next/getCurrentCategoryBrProductsTotalResponseGetters',
      getCurrentCategoryBrProductsFiltersResponseGetters: 'category-next/getCurrentCategoryBrProductsFiltersResponseGetters',
      getCategoryProductsTotal: 'category-next/getCategoryProductsTotal',
      getAvailableFilters: 'category-next/getAvailableFilters',
      getBreadcrumbsRoutes: 'breadcrumbs/getBreadcrumbsRoutes',
      getBreadcrumbsCurrent: 'breadcrumbs/getBreadcrumbsCurrent'
    }),
    apiFacetCompute () {
      if (!this.apiFacets || !this.apiFacets.length) {
        return this.getCurrentCategoryBrProductsFiltersResponseGetters
      }
      return this.apiFacets;
    },
    listingPageCompute () {
      if (this.listingPage === null) {
        return !(this.getCurrentCategoryBrResponseGetters && this.getCurrentCategoryBrResponseGetters.length > 0 && !this.$route.fullPath.includes('?'));
      }
      return this.listingPage;
    },
    apiProductsApiCompute () {
      if (this.apiProductsApi === 0) {
        return this.getCurrentCategoryBrProductsResponseGetters;
      }
      return this.apiProductsApi;
    },
    socialLinksSchema () {
      return config.socialUrlsForSchema ? config.socialUrlsForSchema : ''
    },
    brCategoryChildId () {
      return config.bloomreach.prefix && this.getCurrentCategory && this.getCurrentCategory.id ? config.bloomreach.prefix + this.getCurrentCategory.id : 0;
    },
    pageLayout () {
      return this.getCurrentCategory.page_layout ? this.getCurrentCategory.page_layout : ''
    },
    categoryTileType () {
      return config.tileTypes
    },
    currRoute () {
      // this.routeUrl
      return this.$route.name
    },
    isListingProducts () {
      if (isServer && !this.children) {
        return false
      }

      if (this.getCurrentCategory && this.getCurrentCategory.display_mode && this.getCurrentCategory.display_mode !== 'PAGE') {
        return true
      }

      if (this.getCurrentCategory && !this.getCurrentCategory.display_mode && this.children.length === 0) {
        return true
      }
      return (
        // this.children.length === 0 ||
        this.hasActiveFiltersOnPage === true ||
        this.sorted
      )
    },
    hasActiveFilters1 () {
      return this.$store.getters['category-next/hasActiveFilters']
    },
    isLazyHydrateEnabled () {
      return config.ssr.lazyHydrateFor.includes('category-next.products')
    },
    bannerImage () {
      if (
        this.getCurrentCategory.image === '' ||
        this.getCurrentCategory.image === 'null' ||
        this.getCurrentCategory.image === null
      ) {
        return '/assets/category-images/header.png'
      }
      return getThumbnailPath(
        `/${(this.getCurrentCategory, this.getCurrentCategory.image)}`,
        955,
        277,
        'category'
      )
    },
    getIncludeFieldsForRequest () {
      return config.entities.category.includeFields
    },
    isFilterActive () {
      return ({ index, filterSingle }) => {
        if (this.$route && this.$route.params && this.$route.params[index]) {
          // console.log('Hereeeee', this.$route.params[index], typeof this.$route.params[index]);
          // console.log('Hereeeee', filterSingle.name, ' is include ', this.$route.params[index].includes(filterSingle.name), this.appliedFilters[index]);
          let paramsArrayonKey = this.$route.params[index].split(',')
          // console.log('Hereeeee paramsArrayonKey', paramsArrayonKey, typeof paramsArrayonKey);
          if (paramsArrayonKey.includes(filterSingle.name) && !!this.appliedFilters[index] && this.appliedFilters[index].filters.includes(filterSingle.name)) {
            return true
          }
        }
        // if (typeof filterSingle.name === 'number') {
        //   return !!this.appliedFilters[index] && this.appliedFilters[index].filters.map(n => Number(n)).includes(filterSingle.name)
        // }
        // return !!this.appliedFilters[index] && this.appliedFilters[index].filters.includes(filterSingle.name)
      }
    },
    getExcludeFieldsForRequest () {
      return ['sgn']
    },
    isCategoryEmpty () {
      return this.getCurrentCategoryBrProductsTotalResponseGetters === 0
    },
    isCategoryChildrenEmpty () {
      return parseInt(this.getCurrentCategory.children_count) === 0
    },
    childrenData () {
      return sortBy(this.getCurrentCategory.children_data, 'position')
    },
    getCurrentCategoryId () {
      return this.getCurrentCategory.id
    },
    hasActiveFiltersOnPage () {
      if (!this.$route || !this.$route.query || _.isEmpty(this.$route.query)) {
        return false
      }
      if (!config || !config.products.defaultFilters) {
        return false
      }
      let defaultFilters = config.products.defaultFilters
      for (let key in this.$route.query) {
        if (this.$route.query.hasOwnProperty(key) && defaultFilters.includes(key)) {
          return true
        }
      }
    }
  },
  async asyncData ({ store, route }) {
    // this is for SSR purposes to prefetch data - and it's always executed before parent component methods
    await composeInitialPageState(store, route)
  },
  async beforeRouteEnter (to, from, next) {
    if (isServer) {
      next()
      // eslint-disable-next-line brace-style
    } // SSR no need to invoke SW caching here
    else if (!from.name) {
      // SSR but client side invocation, we need to cache products and invoke requests from asyncData for offline support
      next(async (vm) => {
        vm.loading = true
        await composeInitialPageState(vm.$store, to, true)
        await vm.$store.dispatch('category-next/cacheProducts', { route: to }) // await here is because we must wait for the hydration
        vm.loading = false
      })
    } else {
      // Pure CSR, with no initial category state
      next(async (vm) => {
        vm.loading = true
        vm.$store.dispatch('category-next/cacheProducts', { route: to })
        vm.loading = false
      })
    }
  },
  methods: {
    isChildCategorySlug (slug) {
      let slugModify = ''
      if (slug) {
        slugModify = slug.toLowerCase();
        slugModify = slugModify.replace(/\s+/g, '-');
        return slugModify
      }
      return slugModify
    },
    async onBottomScroll () {
      if (this.loadingProducts) return
      this.loadingProducts = true
      if (this.apiTotalsNums >= this.pagination.pageSize * this.pagination.selectedPage) {
        try {
          await this.searchResultonBottomCall({
            count: this.pagination.pageSize,
            selectedPage: this.pagination.selectedPage,
            filtersArray: this.appliedFilters,
            sort: this.sortingStoreObj
          });
        } catch (e) {
          console.log('Error is caught : ', e)
        } finally {
          this.loadingProducts = false
          this.pagination.selectedPage++;
        }
      }
    },
    async searchResultonSort (obj) {
      console.log('Chaneg Sort Fn')
      let domain_prefix = config && config.bloomreach && config.bloomreach.prefix ? config.bloomreach.prefix : 0
      let searchCategory_id = domain_prefix + this.getCurrentCategory.id;
      const searchRes = await this.$store.dispatch(
        'brautosuggest/brAutosuggestFunction',
        {
          searchWord: this.getCurrentCategory.id,
          count: obj && obj.count ? obj.count : 12,
          pageNumber: obj && obj.selectedPage ? obj.selectedPage : 0,
          filtersArr: obj && obj.filtersArray ? obj.filtersArray : [],
          sortObj: obj && obj.sort ? obj.sort : {},
          searchQuery: 'category'
        }
      );
      let brAutoSUggests = this.$store.state.brautosuggest
      let notActiveFiltersChecked = document.querySelectorAll('.not-active');
      [].forEach.call(notActiveFiltersChecked, (el) => {
        if (el && el.classList.contains('active-filter')) {
          el.classList.remove('active-filter')
        }
      });
      if (brAutoSUggests && brAutoSUggests.brAutosuggestState) {
        let categoryRangeFacetsArray = brAutoSUggests.brAutosuggestState.facet_counts && brAutoSUggests.brAutosuggestState.facet_counts.facet_fields ? brAutoSUggests.brAutosuggestState.facet_counts.facet_fields : []
        if (categoryRangeFacetsArray) {
          for (let keyFacets in categoryRangeFacetsArray) {
            if (!categoryRangeFacetsArray.hasOwnProperty(keyFacets)) continue;
            if (keyFacets !== 'Size' && keyFacets !== 'Thickness' && keyFacets !== 'category' && keyFacets !== 'crumbs_id') {
              let keyFacetsArray = categoryRangeFacetsArray[keyFacets];
              keyFacetsArray = keyFacetsArray.sort((a, b) => a.name.localeCompare(b.name));
            } else if (keyFacets === 'Size') {
              let reference_sizes_array = ['S', 'M', 'L', 'XL', 'XXL'];
              categoryRangeFacetsArray['Size'].sort((a, b) => {
                return reference_sizes_array.indexOf(a.name) - reference_sizes_array.indexOf(b.name);
              });
            } else if (keyFacets === 'Thickness') {
              let reference_thickness_array = ['2-4', '4-6', '6-8', '8-10', '10-12', 'other'];
              categoryRangeFacetsArray['Thickness'].sort((a, b) => {
                return reference_thickness_array.indexOf(a.name) - reference_thickness_array.indexOf(b.name);
              });
            }
          }
        }
        this.apiFacets = categoryRangeFacetsArray
        const apiTotalsNumsVar = brAutoSUggests.brAutosuggestState.response && brAutoSUggests.brAutosuggestState.response.numFound ? brAutoSUggests.brAutosuggestState.response.numFound : 0
        this.apiTotalsNums = apiTotalsNumsVar
        if (brAutoSUggests.brAutosuggestState.response && brAutoSUggests.brAutosuggestState.response.docs) {
          this.apiProductsApi = brAutoSUggests.brAutosuggestState.response.docs
        } else {
          this.apiProductsApi = []
        }
        this.emptyResults = brAutoSUggests.brAutosuggestState.response && brAutoSUggests.brAutosuggestState.response.docs && brAutoSUggests.brAutosuggestState.response.docs.length <= 0 ? true : !true
        this.pagination.currentPageItems = brAutoSUggests.brAutosuggestState.response && brAutoSUggests.brAutosuggestState.response.docs && brAutoSUggests.brAutosuggestState.response.docs.length > 0 ? brAutoSUggests.brAutosuggestState.response.docs : []
      }
    },
    async searchResultonBottomCall (obj) {
      let domain_prefix = config && config.bloomreach && config.bloomreach.prefix ? config.bloomreach.prefix : 0
      let searchCategory_id = domain_prefix + this.getCurrentCategory.id;
      const searchRes = await this.$store.dispatch(
        'brautosuggest/brAutosuggestFunction',
        {
          searchWord: this.getCurrentCategory.id,
          count: obj && obj.count ? obj.count : 12,
          pageNumber: obj && obj.selectedPage ? obj.selectedPage : 0,
          filtersArr: obj && obj.filtersArray ? obj.filtersArray : [],
          sortObj: obj && obj.sort ? obj.sort : {},
          searchQuery: 'category'
        }
      );
      let brAutoSUggests = this.$store.state.brautosuggest
      let notActiveFiltersChecked = document.querySelectorAll('.not-active');
      [].forEach.call(notActiveFiltersChecked, (el) => {
        if (el && el.classList.contains('active-filter')) {
          el.classList.remove('active-filter')
        }
      });
      if (brAutoSUggests && brAutoSUggests.brAutosuggestState) {
        let categoryRangeFacetsArray = brAutoSUggests.brAutosuggestState.facet_counts && brAutoSUggests.brAutosuggestState.facet_counts.facet_fields ? brAutoSUggests.brAutosuggestState.facet_counts.facet_fields : []
        if (categoryRangeFacetsArray) {
          for (let keyFacets in categoryRangeFacetsArray) {
            if (!categoryRangeFacetsArray.hasOwnProperty(keyFacets)) continue;
            if (keyFacets !== 'Size' && keyFacets !== 'Thickness' && keyFacets !== 'category' && keyFacets !== 'crumbs_id') {
              let keyFacetsArray = categoryRangeFacetsArray[keyFacets];
              keyFacetsArray = keyFacetsArray.sort((a, b) => a.name.localeCompare(b.name));
            } else if (keyFacets === 'Size') {
              let reference_sizes_array = ['S', 'M', 'L', 'XL', 'XXL'];
              categoryRangeFacetsArray['Size'].sort((a, b) => {
                return reference_sizes_array.indexOf(a.name) - reference_sizes_array.indexOf(b.name);
              });
            } else if (keyFacets === 'Thickness') {
              let reference_thickness_array = ['2-4', '4-6', '6-8', '8-10', '10-12', 'other'];
              categoryRangeFacetsArray['Thickness'].sort((a, b) => {
                return reference_thickness_array.indexOf(a.name) - reference_thickness_array.indexOf(b.name);
              });
            }
          }
        }
        this.apiFacets = categoryRangeFacetsArray
        const apiTotalsNumsVar = brAutoSUggests.brAutosuggestState.response && brAutoSUggests.brAutosuggestState.response.numFound ? brAutoSUggests.brAutosuggestState.response.numFound : 0
        this.apiTotalsNums = apiTotalsNumsVar
        if (brAutoSUggests.brAutosuggestState.response && brAutoSUggests.brAutosuggestState.response.docs) {
          this.apiProductsApi = this.apiProductsApi.concat(brAutoSUggests.brAutosuggestState.response.docs)
        } else {
          this.apiProductsApi = []
        }
        this.emptyResults = brAutoSUggests.brAutosuggestState.response && brAutoSUggests.brAutosuggestState.response.docs && brAutoSUggests.brAutosuggestState.response.docs.length <= 0 ? true : !true
        this.pagination.currentPageItems = brAutoSUggests.brAutosuggestState.response && brAutoSUggests.brAutosuggestState.response.docs && brAutoSUggests.brAutosuggestState.response.docs.length > 0 ? brAutoSUggests.brAutosuggestState.response.docs : []
      }
    },
    async searchResultCall (obj) {
      let domain_prefix = config && config.bloomreach && config.bloomreach.prefix ? config.bloomreach.prefix : 0
      let searchCategory_id = domain_prefix + this.getCurrentCategory.id;
      let brAutoSUggests = this.$store.state && this.$store.state['category-next'] ? this.$store.state['category-next'] : {}
      let notActiveFiltersChecked = document.querySelectorAll('.not-active');
      [].forEach.call(notActiveFiltersChecked, (el) => {
        if (el && el.classList.contains('active-filter')) {
          el.classList.remove('active-filter')
        }
      });
      if (brAutoSUggests && brAutoSUggests.listingRange) {
        let categoryRangeFacetsArray = brAutoSUggests.listingRange.facet_counts && brAutoSUggests.listingRange.facet_counts.facet_fields ? brAutoSUggests.listingRange.facet_counts.facet_fields : []
        if (categoryRangeFacetsArray) {
          for (let keyFacets in categoryRangeFacetsArray) {
            if (!categoryRangeFacetsArray.hasOwnProperty(keyFacets)) continue;
            if (keyFacets !== 'Size' && keyFacets !== 'Thickness' && keyFacets !== 'category' && keyFacets !== 'crumbs_id') {
              let keyFacetsArray = categoryRangeFacetsArray[keyFacets];
              keyFacetsArray = keyFacetsArray.sort((a, b) => a.name.localeCompare(b.name));
            } else if (keyFacets === 'Size') {
              let reference_sizes_array = ['S', 'M', 'L', 'XL', 'XXL'];
              categoryRangeFacetsArray['Size'].sort((a, b) => {
                return reference_sizes_array.indexOf(a.name) - reference_sizes_array.indexOf(b.name);
              });
            } else if (keyFacets === 'Thickness') {
              let reference_thickness_array = ['2-4', '4-6', '6-8', '8-10', '10-12', 'other'];
              categoryRangeFacetsArray['Thickness'].sort((a, b) => {
                return reference_thickness_array.indexOf(a.name) - reference_thickness_array.indexOf(b.name);
              });
            }
          }
        }
        this.apiFacets = categoryRangeFacetsArray
        const apiTotalsNumsVar = brAutoSUggests.listingRange.response && brAutoSUggests.listingRange.response.numFound ? brAutoSUggests.listingRange.response.numFound : 0
        this.apiTotalsNums = apiTotalsNumsVar
        this.apiProductsApi = brAutoSUggests.listingRange.response && brAutoSUggests.listingRange.response.docs ? brAutoSUggests.listingRange.response.docs : []
        this.emptyResults = brAutoSUggests.listingRange.response && brAutoSUggests.listingRange.response.docs && brAutoSUggests.listingRange.response.docs.length <= 0 ? true : !true
        this.pagination.currentPageItems = brAutoSUggests.listingRange.response && brAutoSUggests.listingRange.response.docs && brAutoSUggests.listingRange.response.docs.length > 0 ? brAutoSUggests.listingRange.response.docs : []
      }
    },
    async updateAppliedFilters (e) {
      let selectedFilterElement = e.target
      let selectedFilterCode = findAncestor(selectedFilterElement, 'div[data-filter]').getAttribute('data-filter')
      let selectedFilter = selectedFilterElement.getAttribute('codeSingle')
      let selectedFilterStatus = selectedFilterElement.classList.toggle('active-filter')
      // let selectedFilterCodeIndex = this.selectedFiltersValues[selectedFilterCode].indexOf(selectedFilter)
      // Selected Filter if unchecked, Remove it from the Applied Filters
      this.pagination.selectedPage = 1
      this.loadingProducts = false
      if (!selectedFilterStatus) {
        let selectedFilterCode = findAncestor(selectedFilterElement, 'div[data-filter]').getAttribute('data-filter')
        let selectedFilter = selectedFilterElement.getAttribute('codeSingle')

        let selectedFilterIndex = this.appliedFilters[selectedFilterCode].filters.indexOf(selectedFilter)
        let selectedFilterIndexMy = this.selectedFiltersValues[selectedFilterCode]?.indexOf(selectedFilter)
        if (this.selectedFiltersValues[selectedFilterCode] && selectedFilterIndexMy > -1) {
          let splicedResponse = this.appliedFilters[selectedFilterCode].filters.splice(selectedFilterIndex, 1)
          let splicedResponseParams = this.selectedFiltersValues[selectedFilterCode]?.splice(selectedFilterIndexMy, 1)
          let filteredSelectedFiltersValues = Object.keys(this.selectedFiltersValues);
          await this.updatePathParams(this.$router, { [selectedFilterCode]: this.selectedFiltersValues[selectedFilterCode].join(',') }, selectedFilterCode)
          this.resetFilterTextShowFn()
          return splicedResponseParams.length > 0
        }
        return false
      }
      if (!this.selectedFiltersValues[selectedFilterCode]) {
        this.selectedFiltersValues[selectedFilterCode] = [selectedFilter]
      }
      if (!this.selectedFiltersValues[selectedFilterCode].includes(selectedFilter)) {
        this.selectedFiltersValues[selectedFilterCode].push(selectedFilter);
      }
      await this.updatePathParams(this.$router, { [selectedFilterCode]: this.selectedFiltersValues[selectedFilterCode].join(',') }, selectedFilterCode)
      let activeFilters = document.querySelectorAll('.active-filter')
      activeFilters.forEach(activeFilter => {
        let filterAncestor = findAncestor(activeFilter, 'div[data-filter]')
        let filterCode = filterAncestor.getAttribute('data-filter')
        let filterKey = filterAncestor.getAttribute('data-filter-key')
        let filter = activeFilter.getAttribute('codeSingle')
        if (!this.appliedFilters[filterCode]) {
          this.appliedFilters[filterCode] = {
            filters: [],
            key: filterKey
          }
        }
        if (!this.appliedFilters[filterCode].filters.includes(filter)) {
          this.appliedFilters[filterCode].filters.push(filter)
        }
      })
      let search = this.$route.query.q;
      this.resetFilterTextShowFn()
    },
    resetFilterTextShowFn () {
      let activeFiltersTotal = [];
      let keyOffappliedFilters = Object.keys(this.appliedFilters);
      if (window.innerWidth <= 767) {
        activeFiltersTotal = document.getElementsByClassName('mobile-filters') && document.getElementsByClassName('mobile-filters').length > 0 ? document.getElementsByClassName('mobile-filters')[0].querySelectorAll('.active-filter') : []
        if (activeFiltersTotal.length > 0) {
          if (document.getElementsByClassName('clearAllClass') && document.getElementsByClassName('clearAllClass').length > 0) {
            document.getElementsByClassName('clearAllClass')[0].style.display = 'block'
            document.getElementsByClassName('clearAllClass')[1].style.display = 'block'
          }
        } else {
          if (document.getElementsByClassName('clearAllClass') && document.getElementsByClassName('clearAllClass').length > 0) {
            document.getElementsByClassName('clearAllClass')[0].style.display = 'none'
            document.getElementsByClassName('clearAllClass')[1].style.display = 'none'
          }
        }
      } else {
        activeFiltersTotal = document.getElementsByClassName('category-filters') && document.getElementsByClassName('category-filters').length > 0 ? document.getElementsByClassName('category-filters')[0].querySelectorAll('.active-filter') : []
        // console.log('clearAllClass', activeFiltersTotal)
        if (activeFiltersTotal.length > 0) {
          if (document.getElementsByClassName('clearAllClass') && document.getElementsByClassName('clearAllClass').length > 0) {
            document.getElementsByClassName('clearAllClass')[0].style.display = 'block'
            document.getElementsByClassName('clearAllClass')[1].style.display = 'block'
          }
        } else {
          // console.log('clearAllClassclearAllClass')
          if (document.getElementsByClassName('clearAllClass') && document.getElementsByClassName('clearAllClass').length > 0) {
            document.getElementsByClassName('clearAllClass')[0].style.display = 'none'
            document.getElementsByClassName('clearAllClass')[1].style.display = 'none'
          }
        }
      }
    },
    filterRef (event) {
      event.target.classList.toggle('toggleIcon')
      event.target.nextElementSibling.classList.toggle('filter-open')
    },
    async BRCategoryRanges () {
      // console.log('BRCategoryRanges Call Inits', this.getCurrentCategory.id, this.getCurrentCategoryBrResponseGetters)
      if (this.getCurrentCategory && this.getCurrentCategory.id) {
        this.apiFacets = this.getCurrentCategoryBrProductsFiltersResponseGetters
        this.apiTotalsNums = this.getCurrentCategoryBrProductsTotalResponseGetters
        this.apiProductsApi = this.getCurrentCategoryBrProductsResponseGetters
        this.emptyResults = this.getCurrentCategoryBrProductsResponseGetters.length <= 0 ? true : !true
        if (this.getCurrentCategoryBrResponseGetters && this.getCurrentCategoryBrResponseGetters.length > 0 && !this.$route.fullPath.includes('?')) {
          this.apiRangesApi = this.getCurrentCategoryBrResponseGetters
          this.listingPage = false
        } else {
          this.listingPage = true
        }
        // console.log('BRCategoryRanges Call Inist', this.getCurrentCategory.id)
        // const categoryResponse = await this.$store.dispatch(
        //   'brautosuggest/brAutosuggestCategoryFunction',
        //   {
        //     categoryId: this.getCurrentCategory.id
        //   }
        // );
        // let brRangesSUggests = this.$store.state.brautosuggest
        // console.log('brRangesSUggests', brRangesSUggests)
        // if (brRangesSUggests && brRangesSUggests.brRangesState && brRangesSUggests.brRangesState.response && brRangesSUggests.brRangesState.response.docs.length > 1) {
        //   // this.apiRangesApi = brRangesSUggests.brRangesState.response && brRangesSUggests.brRangesState.response.docs ? brRangesSUggests.brRangesState.response.docs : []
        //   this.listingPage = false
        // } else {
        //   this.listingPage = true
        // }
        // this.searchResultCall({ count: this.pagination.pageSize, selectedPage: this.pagination.selectedPage, filtersArray: this.appliedFilters, sort: this.sortingStoreObj });
      }
    },
    gototop () {
      setTimeout(() => {
        localStorage.setItem('topLevelCategoryPosition', '');
        window.scrollTo(0, 0)
      }, 500)
    },
    handleResize () {
      this.windowWidth = window.innerWidth
    },
    async addBloom () {
      let cat_name = ''
      let crubms = this.getBreadcrumbsRoutes.map((crumb) => {
        return crumb.name
      })
      for (let x of crubms) {
        cat_name += x + '|'
      }
      cat_name = cat_name + this.getBreadcrumbsCurrent

      if (config && config.bloomreach) {
        let categoryName = this.getCurrentCategory.path
        categoryName = categoryName ? categoryName.replace(/[/]/g, '|') : ''
        let res = categoryName.split('|')
        var br_data = br_data || {}
        br_data.acct_id = config.bloomreach.accountID
        br_data.ptype = 'category'
        br_data.view_id = config.bloomreach.viewId
        br_data.test_data = config.bloomreach.testData
        br_data.title = this.getCurrentCategory.meta_title || this.getCurrentCategory.name
        br_data.domain_key = config.bloomreach.domainKey
        br_data.cat_id = this.getCurrentCategory.id
        br_data.cat = cat_name
        if (typeof BrTrk === 'undefined') {
          var brtrk = document.createElement('script')
          brtrk.type = 'text/javascript'
          brtrk.async = true
          brtrk.src = `//cdn.brcdn.com/v1/br-trk-${config.bloomreach.accountID}.js`
          var s = document.getElementsByTagName('script')[0]
          s.parentNode.insertBefore(brtrk, s)
        } else {
          BrTrk.getTracker().updateBrData(br_data)
          BrTrk.getTracker().logPageView()
        }
      }
    },
    async getCatproduct (sku) {
      this.product_link = ''
      if (sku) {
        let prodlink = await this.getProduct(sku)
        if (prodlink) {
          this.product_link = prodlink.url_path
        }
      }
    },
    showbottompage () {
      this.bottompagination = true
    },
    async getCrumbs () {
      return this.getBreadcrumbsRoutes
    },
    async getProduct (psku) {
      return this.$store.dispatch('product/single', {
        options: { sku: psku },
        setCurrentProduct: false,
        setCurrentCategoryPath: false,
        selectDefaultVariant: false
      })
    },
    async fetchCategoriesAndSubCategories () {
      try {
        return await CategoryService.getCategories({
          parentId: this.getCurrentCategoryId,
          includeFields: this.getIncludeFieldsForRequest,
          excludeFields: this.getExcludeFieldsForRequest
        })
      } catch (error) {
        console.log('GotIntoAnError', error)
      }
    },
    categoryTileTypeUnitCheck (category) {
      let categoryUnit = ''
      if (category.category_price_type) {
        categoryUnit = category.category_price_type.length > 0 && Array.isArray(category.category_price_type) ? category.category_price_type[0] : category.category_price_type
        // if (this.categoryTileType[category.category_price_type] === 'sqm') {
        //   categoryUnit = 'm<sup>2</sup>'
        // } else if (this.categoryTileType[category.category_price_type]) {
        //   categoryUnit = this.categoryTileType[category.category_price_type]
        // } else {
        //   categoryUnit = 'm<sup>2</sup>'
        // }
      } else {
        categoryUnit = 'm<sup>2</sup>'
      }
      return categoryUnit
    },
    overlayshow () {
      this.isOverlayShowing = true
      let scrollOff = document.getElementsByTagName('body')[0]
      if (this.isOverlayShowing === true) {
        scrollOff.style.overflow = 'hidden'
        scrollOff.style.position = 'fixed'
      } else {
        scrollOff.style.overflow = 'scroll'
      }
    },
    resetAllFilters () {
      // console.log('resetAllFilters', window.innerWidth)
      let activeFilters = []
      if (window.innerWidth <= 767) {
        // console.log(document.getElementsByClassName('mobile-filters'))
        activeFilters = document.getElementsByClassName('mobile-filters') && document.getElementsByClassName('mobile-filters').length > 0 ? document.getElementsByClassName('mobile-filters')[0].querySelectorAll('.active-filter') : []
        // console.log('activeFilters', activeFilters)
        if (activeFilters.length > 0) {
          this.appliedFilters = []
          this.selectedFiltersValues = {}
          event.toElement.style.display = 'none'
          this.$router.push('/' + this.getCurrentCategory.url_path)
        }
      } else {
        activeFilters = document.getElementsByClassName('category-filters') && document.getElementsByClassName('category-filters').length > 0 ? document.getElementsByClassName('category-filters')[0].querySelectorAll('.active-filter') : []
        if (activeFilters.length > 0) {
          this.appliedFilters = []
          this.selectedFiltersValues = {}
          event.toElement.style.display = 'none'
          this.$router.push('/' + this.getCurrentCategory.url_path)
        }
      }
      // this.$store.dispatch('category-next/resetSearchFilters')
    },
    clearSorting () {
      this.sorted = false
    },
    myEventHandler (e) {
      let scrollOff = document.getElementsByTagName('body')[0]
      scrollOff.style.overflow = 'scroll'
      scrollOff.style.position = 'unset'
      this.closeButtonShowing = false
      this.mobileFilters = false
      this.isOverlayShowing = false
    },
    overlayclose () {
      this.isOverlayShowing = false
      let scrollOff = document.getElementsByTagName('body')[0]
      scrollOff.style.overflow = 'scroll'
      scrollOff.style.position = 'unset'
    },
    buttonshow () {
      this.closeButtonShowing = true
    },
    buttonclose () {
      this.closeButtonShowing = false
      let scrollOff = document.getElementsByTagName('body')[0]
      scrollOff.style.overflow = 'scroll'
      scrollOff.style.position = 'unset'
    },
    openFilters () {
      this.mobileFilters = true
      this.closeButtonShowing = true
    },
    closeFilters () {
      this.mobileFilters = false
      this.isOverlayShowing = false
      let scrollOff = document.getElementsByTagName('body')[0]
      scrollOff.style.overflow = 'scroll'
    },
    async changeFilter (filterVariant) {
      if (filterVariant && filterVariant.type && this.sorted === false) {
        this.sorted = true
      }

      this.$store.dispatch('category-next/switchSearchFilters', [
        filterVariant
      ])
    },
    async changeFilterSort (filterVariant) {
      // console.log('changeFilterSort', filterVariant)
      this.pagination.selectedPage = 1
      this.loadingProducts = false
      this.sortingStoreObj = filterVariant
      this.searchResultonSort({
        count: this.pagination.pageSize,
        selectedPage: 0,
        filtersArray: this.appliedFilters,
        sort: filterVariant
      });
    },
    async pageChanged ({ pageOfItems, startIndex, endIndex, selectedPage }) {
      this.pagination.startIndex = startIndex
      this.pagination.selectedPage = selectedPage
      await this.getProducts()
      if (this.pagination.selectedPage !== 1) {
        // this.updatePathParams(this.$router, { page: this.pagination.selectedPage })
      }
    },
    async getProducts () {
      await this.$store.dispatch('category-next/loadCategoryProducts', {
        route: this.$route,
        category: this.getCurrentCategory,
        pageSize: this.pagination.pageSize,
        startIndex: this.pagination.startIndex
      })
      this.pagination.currentPageItems = this.getCategoryProducts
    },
    updatePathParams ($router, newParams, selectedFilterCode) {
      if (newParams.page && newParams.page === 1) {
        return false
      }
      const currentQueryParams = $router.currentRoute.query
      console.log('currentQueryParams', currentQueryParams, newParams)
      let mergeQueryParams = { ...currentQueryParams, ...newParams };
      if (newParams[selectedFilterCode] === '') {
        delete mergeQueryParams[selectedFilterCode]
      }
      this.$router.push({ path: $router.currentRoute.path, query: mergeQueryParams })
      // let queryD = { Type: ['Modular', 'Flor'], Colour: ['black', 'red'] }
      // let query = 'query'
      // this.$router.push({ [query]: queryD })
    }
  },
  metaInfo () {
    const storeView = currentStoreView()
    const {
      meta_title,
      meta_description,
      description,
      cat_banner_desp,
      name,
      slug
    } = this.getCurrentCategory
    let metaDescriptionCat = this.getCurrentCategory.cat_banner_desp ? this.getCurrentCategory.cat_banner_desp.replace(/<\/?[^>]+(>|$)/g, '') : ''
    let metaLengthCat = 233
    if (metaDescriptionCat) {
      metaDescriptionCat = metaDescriptionCat.length > metaLengthCat ? metaDescriptionCat.substring(0, metaLengthCat - 3) + '...' : metaDescriptionCat
    }

    const meta_descriptionHtml = htmlDecode(meta_description)
    const meta_descriptionHtmlAfter = meta_descriptionHtml.replace(/<\/?[^>]+(>|$)/g, '')
    const categoryLocaliedLink = localizedRoute(
      {
        name: 'category-amp',
        params: { slug }
      },
      storeView.storeCode
    )
    const ampCategoryLink = this.$router.resolve(categoryLocaliedLink).href
    const canonicalCategoryLink = this.getCurrentCategory.canonical_url ? this.getCurrentCategory.canonical_url : '/' + this.getCurrentCategory.url_path
    let metaData = [
      {
        property: 'og:url',
        content: (config.ogtagsBaseUrl ? config.ogtagsBaseUrl : '') + canonicalCategoryLink
      },
      {
        property: 'og:title',
        content: htmlDecode(meta_title || name)
      },
      {
        property: 'og:type',
        content: 'website'
      },
      {
        property: 'og:description',
        content: meta_description ? meta_descriptionHtmlAfter : ''
      },
      {
        property: 'og:image',
        content: config.images.baseUrl + '1200/630/resize/catalog/category/' + (this.getCurrentCategory.google_feed_img ? this.getCurrentCategory.google_feed_img : this.getCurrentCategory.image)
      }
    ]
    if (meta_description) {
      metaData.push({
        vmid: 'description',
        name: 'description',
        content: meta_descriptionHtmlAfter
      })
    } else {
      metaData.push({
        vmid: 'description',
        name: 'description',
        content: metaDescriptionCat
      })
    }
    // const meta = meta_description
    //   ? [
    //     {
    //       vmid: 'description',
    //       name: 'description',
    //       content: meta_descriptionHtmlAfter
    //     }
    //   ]
    //   : []

    return {
      link: [{ rel: 'canonical', href: canonicalCategoryLink }],
      title: htmlDecode(meta_title || name),
      titleTemplate: '%s',
      meta: metaData
    }
  }
};
</script>

<style lang="scss" scoped>

@font-face {
  font-family: 'Oblik';
  src: url('/assets/fonts/Oblik_Bold.otf');
}

@media screen and (min-width: 1901px) {
  div#category {
    padding-top: 14.5%;
    position: relative;
  }
}

@media screen and (min-width: 1501px) and (max-width: 1900px) {
  div#category {
    padding-top: 18%;
    position: relative;
  }
}

@media screen and (min-width: 1301px) and (max-width: 1500px) {
  div#category {
    padding-top: 20.8%;
    position: relative;
  }
}

@media screen and (min-width: 1200px) and (max-width: 1300px) {
  div#category {
    padding-top: 23%;
    position: relative;
  }
}

@media screen and (min-width: 768px) and (max-width: 1199px) {
  div#category {
    padding-top: 21.4%;
    position: relative;
  }
}

$border-color: #3d315b;
$background-color: #266dd3;
$list-background-color: #444b6e;
$active-list-background-color: #9ab87a;
$border-radius: 5px;
@media screen and (max-width: 767px) {
  .breadcrumbs {
    display: none;
  }
  .collabel {
    display: none;
  }
}

.sidebar__header__clear1 {
  line-height: 37px;
  color: #c7c7c7;
  font-size: 0.8em;
  min-width: 102px;
  text-decoration: underline;
  @media screen and (max-width: 767px) {
    line-height: 50px;
  }
  @media screen and (min-width: 320px) and (max-width: 374px) {
    padding: 0px 0px 0px 12px;
  }
}

@media screen and (min-width: 768px) {
  .breadcrumbrow {
    padding-top: 22px;
    padding-right: 10px;
  }
}

.btn {
  &__filter {
    min-width: 100px;
  }
}

.divider {
  width: calc(100vw - 8px);
  bottom: 20px;
  left: -36px;
}

.category-filters {
  width: 242px;
}

.mobile-filters {
  display: none;
  overflow: auto;
}

.mobile-filters-button {
  display: block;
}

.mobile-sorting {
  display: none;
}

.breadcrumb {
  padding: 21px 0;
}

.sorting {
  label {
    margin-right: 10px;
  }
}

.bottom-pagination {
  display: flex;
  justify-content: flex-end;
  // border-top: 1px solid #b2b2b1;
}

.bordertop {
  border-top: 1px solid #b2b2b1;
}

.bottom-pagination .pages {
  margin-top: 10px;
  margin-right: 20px;
}

@media (min-width: 767px) and (max-width: 1200px) {
  .main-pagination {
    display: none;
  }
}

@media (min-width: 1200px) {
  .main-pagination {
    display: none;
    max-width: 45.666667%;
  }
}

@media (max-width: 767px) {
  .bottom-pagination {
    margin-right: 20px;
    border: none;
  }
  .bottom-pagination .pages {
    margin-right: 0;
  }
}

@media (max-width: 767px) {
  .mobileheader {
    .container {
      padding-right: 0px;
      padding-left: 0px;
    }

    .mr15filters1 {
      margin-right: 19px;
    }

    .mobile-filters-button1 {
      height: 45px;
      display: -ms-flexbox;
      display: flex;
      padding: 6px 0px;
      margin-top: 3px;
      background-color: #fff;
    }

    .mobile-filters-button1 img {
      margin-top: 4px;
      margin-left: 11px;
      width: 25px;
      height: 25px;
    }

    .mobile-filters-button1 p {
      margin: 8px 0px 0px 8px;
      color: #29275b;
      font-weight: bold;
      font-size: 3.733vw;
      font-family: 'Arial';
    }

    .mobile-sorting1 p {
      font-family: Arial;
      font-weight: bold;
      text-align: end;
      margin-top: 17px;
      color: #434343;
      font-size: 3.733vw;
    }
  }
  .full-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1;
    cursor: pointer;
  }
  header {
    padding: 0px;
    background-color: #fff;

    .breadcrumb {
      display: none;
    }

    .mobile-image {
      max-width: 100%;
    }

    .mobile-sorting p {
      font-family: Arial, Helvetica, sans-serif;
      font-weight: bold;
      margin-top: 9px;
      color: #434343;
      font-size: 14px;
      margin-left: 12px;
      @media screen and (max-width: 767px) {
        font-size: 12px;
      }
      @media screen and (max-width: 380px) {
        margin-left: 3px;
      }
    }
  }
  .under-catergory-filter {
    border-bottom: 2px solid #ebebeb;
    height: 48px;

    .row {
      margin-top: 0px;
      padding-left: 10px;
      @media (max-width: 380px) {
        padding-left: 0;
      }
    }
  }
  .products-upper {
    border-top: 2px solid #b2b2b0;
    padding: 0px;
  }
  .category-info {
    position: relative;
    border-bottom: 2px solid #ebebeb;
    height: 42px;

    .category-title {
      font-size: 4.5vw;
      line-height: 40px;
      text-align: center;
      width: 100%;
      font-family: 'Oblik';
      color: #2a2857;
      margin-top: 0px;
    }
  }
  .products-list {
    width: 100%;
    max-width: none;
  }
  .close-button {
    position: fixed;
    right: 0px;
    top: 83px;
    width: 10%;
    height: 53px;
    background-color: #29275b;
    z-index: 10;

    .close-container {
      height: 52px;
      width: 100%;
      text-align: center;
      position: relative;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-pack: center;
      justify-content: center;
      background-color: #29275b;
    }

    i {
      color: #fff;
      font-weight: bold;
      padding: 14px;
    }
  }
  .mobile-filters {
    display: block;
  }
  .mobile-filters-button {
    height: 45px;
    display: flex !important;
    padding: 6px 0px;
    margin-top: 3px;
    background-color: #fff;

    img {
      margin-top: 0px;
      margin-left: 27px;
      width: 28px;
      height: 33px;
      @media screen and (max-width: 625px) {
        margin-left: 6px !important;
      }
    }

    p {
      margin: 8px 0px 0px 8px;
      color: #434343;
      font-weight: bold;
      font-size: 14px;
      font-family: 'Arial';
      @media screen and (max-width: 625px) {
        margin: 8px 0px 0px 3px !important;
      }
    }
  }
  .sorting {
    display: none;
  }
  @media screen and (max-width: 767px) {
    .sorting1 {
      display: block;
      line-height: 33px;
    }
    .dropd1 {
      line-height: 47px;
    }
    .filtericon1 {
      width: 35px;
      height: 35px;
      margin-top: -2px;
    }
    .filterp1 {
      display: block;
      margin-top: 7px;
      padding-left: 8px;
      font-size: 17px;
      color: #2a285a;
      font-family: "Arial";
    }
  }
  .mobile-sorting {
    display: block;
  }
  .category-filters {
    display: none;
  }
  .product-listing {
    justify-content: flex-start;
  }
  .mobile-filters {
    position: fixed;
    background-color: #fff;
    z-index: 9999;
    left: 0;
    width: 90%;
    height: 100vh;
    top: 82px;
    box-sizing: border-box;
    padding: 0px;
  }
  .sticky {
    position: -webkit-sticky;
    position: sticky;
    bottom: 0px;
    height: calc(43% - 71px);
    margin: 0px;
    z-index: 100;
    width: 100%;
    background-color: #fff;

    .sticky-inner {
      padding-bottom: 5px;
    }

    button {
      left: 15%;
      top: -4px;
      width: 70%;
      margin-right: 0px;
      margin-left: 0px;
      padding-right: 0px;
      padding-left: 0px;
      padding-top: 15px;
      padding-bottom: 15px;
      font-weight: bold;
      background-color: #29275b;
      border-radius: 10px;
    }
  }
  #subcategory-list {
    padding: 0;
  }
}

@media screen and (min-width: 320px) and (max-width: 480px) {
  .mobile-filters {
    top: 58px !important;
  }
  .close-button {
    top: 58px !important;
    height: 54px !important;
  }
}

@media (min-width: 768px) {
  .mobile-image {
    display: none;
  }
}

.filtericon {
  width: 35px;
  height: 35px;
  margin-top: -2px;
}

.filterp {
  margin: 7px 0px 0px 0px;
  padding-left: 8px;
  font-size: 17px;
  color: #2a285a;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  @media screen and (max-width: 1278px) and (min-width: 1024px) {
    font-size: 15px;
  }
  @media screen and (max-width: 1023px) and (min-width: 768px) {
    font-size: 13px;
  }
}

.side-filter {
  display: inline-flex;
}

.product-image {
  max-height: unset !important;
}

.maindiv {
  display: inline-flex;
  width: 100%;
}

.firstcol {
  position: absolute;
  top: 6px;
  background: #fff;
  height: 270px;
  margin-left: 16px;
  opacity: 0.75;
  padding: 0px 15px;
  z-index: 1;
  width: 378px;
}

@media screen and (max-width: 1700px) {
  .firstcol {
    overflow-y: auto;
  }
}

.firstcol::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
  border-radius: 5px;
}

.firstcol::-webkit-scrollbar {
  width: 5px;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.firstcol::-webkit-scrollbar-thumb {
  background-color: #676566;
  border-radius: 5px;
}

.firstcol p {
  color: #2a285a;
  font-size: 14px;
  font-family: 'Arial';
  line-height: 19px;
  margin: 8px 0 9px 0;
}

.firstcol h1 {
  color: #2a285a;
  font-family: 'Oblik';
  color: #2a285a;
  font-size: 32px;
  margin: 5px 0 0 0;
}

.secondcol.img-box {
  margin-top: 5px;
}

.category-description {
  color: #fff;
  position: absolute;
  top: 12%;
  width: 20%;
  padding-left: 35px;
}

.headerimg {
  width: 100%;
}

@media screen and (max-width: 767px) {
  .headerimg {
    display: none;
  }
  .clearallp {
    padding: 0 0 0px 10px;
    margin: 0px 0;
    font-size: 9px !important;
    color: #f20d7c;
    font-weight: 600;
    font-family: Arial;
  }
}

@media screen and (max-width: 413px) and (min-width: 375px) {
  .clearallp {
    padding: 0 0 0px 8px !important;
  }
}

@media screen and (max-width: 767px) {
  .category-filters {
    display: none;
  }
}

@media screen and (min-width: 993px) and (max-width: 1199px) {
  .firstcol {
    h1 {
      font-size: 17;
    }
  }
}

@media screen and (min-width: 768px) and (max-width: 992px) {
  .firstcol {
    h1 {
      font-size: 17px;
    }
  }
}

@media screen and (min-width: 768px) {
  .mobileheader {
    display: none;
  }
  .desktopheader {
    display: block;
    height: 291px;
    overflow: hidden;
    position: absolute;
    transform: translate(-50%, 0%);
    top: 0%;
    left: 50%;
  }
  .totolprodno {
    display: block !important;
  }
}

@media screen and (max-width: 767px) {
  .mobileheader {
    display: block;
  }
  .desktopheader {
    display: none;
  }
  .totolprodno {
    display: none !important;
  }
}

p.col-xs-12.end-md.m0.pb20.cl-secondary.totolprodno {
  color: #434343;
  font-family: Arial;
  font-weight: bold;
  font-size: 14px;
}

#pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

#pagination ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;

  li {
    color: #fff;
    display: flex;

    a {
      background-color: white;
      padding: 5px 10px;
      border: 1px solid #7d7d7d;
      border-right: 0;
      cursor: pointer;
      font-weight: 600;
    }
  }

  li.active a {
    background-color: #dcd9d9;
  }

  li:first-child a {
    border-radius: 5px 0 0 5px;
    border: none;
  }

  li:last-child a {
    border-radius: 0 5px 5px 0;
    border-right: 1px solid $border-color;
  }
}

.sot {
  display: inline-flex;
}

.sorting label {
  color: #29275b;
  font-weight: bold;
  margin: 7px 9px 0px 15px;
  font-size: 17px;
  font-family: Arial;
  @media screen and (max-width: 991px) and (min-width: 768px) {
    margin: 9px 2px 0px 0px;
  }
  @media screen and (max-width: 1278px) and (min-width: 1024px) {
    font-size: 15px;
    margin: 7px 9px 0px 15px;
  }
  @media screen and (max-width: 1023px) and (min-width: 768px) {
    font-size: 13px;
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .textForTab {
    width: 50%;
  }
}

.totalprods {
  color: #29275b;
  font-weight: bold;
  padding-right: 10px;
  margin: 7px 0px 0px 22px;
  font-size: 17px;
  font-family: Arial;
  @media screen and (max-width: 1278px) and (min-width: 1024px) {
    font-size: 15px;
    margin: 7px 0px 0px 20px;
  }
  @media screen and (max-width: 1023px) and (min-width: 768px) {
    font-size: 13px;
    margin: 10px 0px 0px 27px;
    padding: 0;
  }
}

.sortp {
  width: 80px;
  @media screen and (max-width: 1023px) and (min-width: 768px) {
    width: auto;
  }

  p {
    color: #29275b;
    font-weight: bold;
    padding-right: 6px;
    margin: 7px 0px 0px 0px;
    margin-left: 5px;
    font-family: 'Arial';
    font-size: 17px;
    @media screen and (max-width: 1278px) and (min-width: 1024px) {
      font-size: 15px;
    }
    @media screen and (max-width: 1023px) and (min-width: 768px) {
      font-size: 13px;
      margin: 9px 0px 0px 0px;
    }
  }
}

.sortp1 p {
  color: #434343;
  font-weight: bold;
  padding-right: 10px;
  margin: 9px 0px 0px 0px;
  margin-left: 5px;
  font-family: 'Arial';
  font-size: 16px;
  @media (min-width: 900px) and (max-width: 1278px) {
    font-size: 14px;
  }
  @media screen and (max-width: 1278px) and (min-width: 1024px) {
    font-size: 15px;
  }
  @media screen and (max-width: 1023px) and (min-width: 768px) {
    font-size: 13px;
  }
}

.paging {
  display: inline-flex;
  float: right;

  p {
    padding: 0px;
    margin: 7px 4px 0px 0px;
    font-size: 16px;
    font-weight: bold;
    color: #2a285a;
  }
}

.secondhead {
  border-bottom: 1px solid #c7c7c7;
  padding-bottom: 8px;
  margin: 0px 0px 0px -8px;
  @media screen and (max-width: 767px) {
    display: none;
  }
}

p {
  font-size: 12px;
}

.droppy {
  display: inline-flex;
  padding-left: 17px;
  @media screen and (min-width: 768px) and (max-width: 991px) {
    padding-left: 4px;
  }
}

.floatright {
  float: right;
}

.sb-left-text {
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto;
  overflow-x: hidden;
  overflow-y: hidden;
}

@media (max-width: 1200px) and (min-width: 992px) {
  .firstcol {
    height: 195px;
  }
}

@media (min-width: 767px) and (max-width: 991px) {
  .firstcol {
    height: 142px;
  }
}

@media (max-width: 584px) and (min-width: 443px) {
  header .mobile-sorting p {
    font-size: 14px;
    margin-left: 11px;
    margin-top: 7px;
  }
  .sortp1 p {
    font-size: 12px;
    color: #434343;
  }
}

@media (max-width: 374px) and (min-width: 320px) {
  .sot {
    flex-basis: 68.1%;
    max-width: 75%;
    padding-top: 2px;
  }
  .sidebar__header__clear {
    padding: 0;
    margin-left: 8px !important;
    margin-top: -2px !important;
  }
  .mobile-filters-button {
    padding: 14.3px 0;
    margin: 0;

    p {
      font-size: 11px;
      z-index: 1;
      margin-left: 1px !important;
    }

    img {
      width: 25px;
      height: 25px;
      margin-left: 6px !important;
    }
  }
  header {
    .mobile-sorting p {
      font-size: 11px;
      margin-bottom: 0px;
      margin-top: 10px;
      margin-left: 0;
    }

    .mobile-sorting1 p {
      font-family: Arial, Helvetica, sans-serif;
      font-weight: bold;
      text-align: end;
      margin-top: 20px;
      color: #434343;
    }
  }
  .sortp1 {
    width: 20%;
  }
  .sortp1 p {
    font-size: 10px;
    padding-right: 0px;
    margin-left: 0;
    margin-right: 0px;
    color: #434343;
    margin-top: 9.5px;
    //padding-left: 11px;
  }
  .clearallp {
    margin: 5px 0 !important;
    padding: 0 !important;
  }
  .dropd1 {
    width: 52%;
  }
  .sort-by {
    width: 86% !important;

    select {
      padding-left: 2.5px;
    }
  }
  .mobile-sorting {
    width: 30%;
  }
  header .mobile-sorting p {
    font-size: 10px;
  }
  .sortbycleartxt.col-sm-4.col-xs-2 {
    flex-basis: 12.66667% !important;
    max-width: 16.66666667% !important;
  }
}

@media screen and (min-width: 375px) and (max-width: 767px) {
  .sortp1 {
    p {
      font-size: 12px !important;
      padding-right: 4px !important;
    }
  }
}

@media screen and (min-width: 320px) and (max-width: 374px) {
  .under-catergory-filter {
    .row {
      margin-top: 0px;
      padding-left: 0 !important;
    }
  }
}

@media screen and (min-width: 320px) and (max-width: 330px) {
  .mobile-filters {
    height: 87vh !important;
  }
}

@media (max-width: 320px) {
  .clearallp {
    margin: 5px 0 !important;
    padding: 0 !important;
  }
  .mobile-filters-button p {
    margin: 7px 0px 0px 1px !important;
  }
}

@media (max-width: 440px) and (min-width: 320px) {
  .mobile-filters-button {
    p {
      z-index: 1;
      //margin-top: 6px !important;
      //margin-bottom: 6px !important;
    }
  }
}

@media screen and (min-width: 320px) and (max-width: 475px) {
  .category-info .category-title {
    font-size: 4.5vw;
    letter-spacing: 0px;
  }
}

@media screen and (min-width: 767px) {
  .products-list {
    margin-top: 1%;
    padding-left: 46px;
    padding-right: 0px;
  }
  .sotby {
    padding-left: 49px;
    display: inline-flex;
  }
}

.sort-by1 {
  display: inline-flex;
}

.sidebar__header__clearAll {
  color: #c7c7c7;
  text-decoration: underline;
  font-size: 13px;
  float: right;
  margin-top: -8px;
}

.index-div:nth-child(2) .container1 input:checked ~ .checkmark1 {
  background: #fff !important;
  border-color: #da2f89 !important;
}

.index-div:nth-child(2) .checkmark1 {
  height: 20px !important;
  width: 20px !important;
  border-radius: 50%;
  border: 1px solid black !important;
}

.index-div:nth-child(2) .container1 .checkmark1:after {
  left: 0px !important;
  top: 0px !important;
  width: 4px;
  height: 8px;
  color: #da2f89;
  border: 1px solid #da2f89;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

p.filterp {
  margin-top: 5px;
  padding-left: 11px;
  font-size: 17px;
}

.sort-by1 select {
  font-size: 12px;
  width: 132px;
  color: #606063;
  font-family: 'Arial';
  font-weight: bold;
  margin-right: 0;
  border-radius: 3px;
  border: 1px solid #7d7d7d;
  height: 33px;
  background: transparent url(/assets/arrows.svg) no-repeat right;
  background-position-x: 92px;
  -webkit-appearance: none;
  line-height: 33px;
  padding-left: 5px;
  @media (max-width: px) and (min-width: 320px) {
    width: 93px;
    background-position-x: 75px;
    font-size: 9px;
    height: 29px;
    line-height: 29px;
    margin-left: 5px;
    margin-top: 10px;
  }
}

.sort-by1 h3 {
  color: #29275b;
  font-weight: bold;
  padding-right: 6px;
  margin: 9px 0px 0px 5px;
  font-family: 'Arial';
  font-size: 16px;
  @media (max-width: 584px) and (min-width: 443px) {
    font-size: 14px;
    color: #434343;
  }
  @media (max-width: 442px) and (min-width: 320px) {
    font-size: 11px;
    padding-right: 0px;
    margin-left: 0px;
    margin-right: 0px;
    color: #434343;
    margin-top: 20px;
  }
}

.border {
  border-bottom: 1px solid #c7c7c7;
}

.mobile-filters-button1 {
  display: none;
}

.mobile-filters-button11 {
  display: none;
}

.mobile-filters-button {
  display: none;
}

.search-page-main.container .row.upper-row {
  padding: 10px 0px;
  display: flex;
  -ms-flex-pack: end;
  justify-content: flex-end;
  -ms-flex-align: center;
  align-items: center;
}

// .sort-by {
//   border-bottom: 1px solid #afafaf;
// }

.sort-by select {
  font-size: 0.9325rem;
  color: #808898;
  font-family: 'open sans';
  border: none;
  width: 100%;
  border-radius: 0;
  margin-right: 0;
  -webkit-appearance: none;
  background: transparent url(/assets/category-images/filter-down-arrow.png) no-repeat 100% 75%;
  padding-left: 0.55rem;
  height: 100%;
  line-height: 2;
}

img.home-breadcrumb-icon-img {
  width: 15px;
  float: left;
  margin: 0 2.5px 0 0;
}

.totalItems {
  color: #2a285a;
  font-size: 0.9325rem;
  // font-family: "open sans";
  padding-right: 8px;
  padding-left: 8px;
  font-weight: bold;
  text-align: right;
  @media screen and (max-width: 767px) {
    padding-top: 15px;
  }
  @media (max-width: 401px) and (min-width: 320px) {
    font-size: 11px;
  }
}

.col-md-3.search-SideBar {
  padding-right: 17px;
}

.col-md-9.search-listing {
  padding: 0;
}

.seemore-search {
  padding: 7.5px 15px;
  border-bottom-left-radius: 6px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  background: #d5de28;
  text-transform: uppercase;
  font-weight: bold;
}

.breadcrumbs {
  padding-top: 1rem;

  span {
    color: #808898;

    a {
      color: #808898;
      padding: 0px 2.5px;
    }
  }
}

.filter-section-main {
  // border-top: 1px solid #e7e7e7;
}

h4.filter-heading {
  font-size: 14px;
  color: #2a285a;
  font-weight: bold;
  font-family: Arial;
  margin-bottom: 0px;
  margin-top: 4px;
  cursor: pointer;
  text-transform: capitalize;
  background: url('/assets/category-images/plus.png') no-repeat 100% 16%;
  height: 25px;
  user-select: none;
  @media (max-width: 480px) {
    width: 90%;
  }
}

h4.toggleIcon {
  background: url('/assets/category-images/minus.png') no-repeat 100% 16%;
}

h3.filter-heading {
  font-size: 0.875rem;
  color: #54575b;
  font-weight: bold;
  text-transform: uppercase;
  height: 25px;
  @media (max-width: 480px) {
    width: 90%;
  }
}

span.filter-label {
  line-height: 30px;
  font-size: 16px;
  opacity: 1;
  -webkit-transition: opacity 0.2s;
  -o-transition: opacity 0.2s;
  transition: opacity 0.2s;
  cursor: pointer;
  position: relative;
  user-select: none;
}

span.filter-label span:before {
  content: '';
  position: relative;
  top: 1px;
  margin-right: 10px;
  display: inline-block;
  vertical-align: text-top;
  width: 14px;
  height: 14px;
  background: #fff;
  border: 1px solid #e0e0e0;
}

.filter-div {
  display: none;
}

.filter-div.filter-open {
  display: block;
  margin-top: 13px;
}

.filter-div {
  display: none;
}

.filter-div.filter-open {
  display: block;
}

span.filter-label span.active-filter:before {
  background: #4f4f4f;
  border-color: #4f4f4f;
}

input.active-filter + span {
  color: #da2f89;
  font-weight: bold;
}

span.filter-label span.active-filter:after {
  content: '';
  position: absolute;
  left: 3px;
  top: 8px;
  background: white;
  width: 2px;
  height: 2px;
  -webkit-box-shadow: 2px 0 0 white, 4px 0 0 white, 4px -2px 0 white,
  4px -4px 0 white, 4px -6px 0 white, 4px -8px 0 white;
  box-shadow: 2px 0 0 white, 4px 0 0 white, 4px -2px 0 white, 4px -4px 0 white,
  4px -6px 0 white, 4px -8px 0 white;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

@media (max-width: 767px) {
  .col-md-3.search-SideBar {
    padding: 0 20px;
  }
  .sidebar__header {
    min-height: 50px;
    border-top: 2px solid #c7c7c7;
    border-bottom: 1px solid #c7c7c7;
    justify-content: space-between;
  }
}

@media screen and (max-width: 767px) {
  .mobile-filters-button1 {
    display: inline-flex;
    background-color: #fff;
    padding: 3px 0px;
  }
  .mobile-filters-button11 {
    display: inline-flex;
    background-color: #fff;
    padding: 3px 0px;
  }
  .mobile-filters-button1 img {
    margin-top: 7px;
    width: 28px;
    height: 27px;
  }
  .mobile-filters-button11 img {
    margin-top: 7px;
    width: 28px;
    height: 27px;
  }
  .filtericon1 .filterp {
    margin: 13px 0px 0px 8px;
  }
  .filterp {
    // /padding-bottom: 0px;
    margin: 5px 0px 0px 8px;
    font-size: 15px;
    font-weight: bold;
    z-index: 1;
    font-family: Arial;
  }
  .mobile-filters {
    position: fixed;
    background-color: #fff;
    z-index: 99999;
    left: 0;
    width: 90%;
    height: 100vh;
    top: 123px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0px;
  }
  .close-button {
    position: fixed;
    right: 0px;
    top: 123px;
    width: 10%;
    height: 52px;
    background-color: #29275b;
    z-index: 10;

    .close-container {
      height: 52px;
      width: 100%;
      text-align: center;
      position: relative;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-pack: center;
      justify-content: center;
      background-color: #29275b;
    }

    i {
      // margin-top: 20px;
      color: #fff;
      font-weight: bold;
      padding: 14px;
    }
  }
  .category-filters {
    display: none;
  }
  .filter-section-main {
    width: 88%;
    padding-left: 39px;
  }
  .mobile-filters-button1 {
    display: inline-flex;
  }
  .mobile-filters-button11 {
    display: inline-flex;
  }
  .search-page-main.container .row.upper-row {
    justify-content: space-between;
    border-bottom: 2px solid #dfdfdf;
    border-top: 2px solid #dfdfdf;
    margin-bottom: 0px;
    padding-top: 0px;
  }
  .full-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1;
    cursor: pointer;
  }
  .sticky {
    position: static;
    bottom: 0px;
    background-color: #fff;
    margin: 0px;
    z-index: 100;
    width: 90%;
    // border-top: 2px solid #dfdfdf;
    padding-bottom: 32px;

    .sticky-inner {
      padding-bottom: 5px;
    }

    button {
      left: 15%;
      top: -4px;
      width: 70%;
      margin-right: 0px;
      margin-left: 0px;
      padding-right: 0px;
      padding-left: 0px;
      padding-top: 15px;
      padding-bottom: 15px;
      font-weight: bold;
      background-color: #29275b;
      border-radius: 10px;
    }
  }
  .filter-section-main {
    border: none;
  }
}

.container1 {
  display: block;
  position: relative;
  padding-left: 29px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 16px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container1 input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark1 {
  position: absolute;
  top: 0;
  left: 0;
  height: 14px;
  width: 14px;
  background: #fff;
  border: 1px solid #e0e0e0;
}

.container1:hover input ~ .checkmark1 {
  background-color: #ccc;
}

.container1 input.active-filter:checked ~ .checkmark1 {
  background: #da2f89;
  border-color: #da2f89;
}

.checkmark1:after {
  content: '';
  position: absolute;
  display: none;
}

.container1 input.active-filter:checked ~ .checkmark1:after {
  display: block;
}

.container1 .checkmark1:after {
  left: -3px !important;
  top: -3px !important;
  border: none !important;
  -webkit-transform: none !important;
  -ms-transform: none !important;
  transform: none !important;
  border-radius: 50%;
  font-family: 'FontAwesome';
  content: '\F00C';
  color: #fff;
  line-height: 21px;
  font-size: 19px;
  font-weight: 100;
}

.container2 {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 17px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default radio button */
.container2 input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom radio button */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  border-radius: 50%;
}

/* On mouse-over, add a grey background color */
.container2:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the radio button is checked, add a blue background */
.container2 input:checked ~ .checkmark {
  background-color: #2196f3;
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.container2 input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.container2 .checkmark:after {
  top: 9px;
  left: 9px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.radiobuttons {
  border-bottom: 1px solid #dfdfdf;
}

.sort-by h3 {
  font-size: 14px;
}

.sortSelected span.checkmark {
  background: #4e4e4e;
}

.sortSelected span.checkmark::after {
  top: 9px;
  left: 9px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  display: block !important;
}

.index-div {
  // padding-left: 37px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #afafaf;
  width: 100%;
}

[data-filter='price'] .toggleIcon {
  background: none !important;
}

[data-filter='price'] {
  border: none !important;
}

[data-filter='color'] .filter-div {
  max-height: 200px;
  -ms-flex-flow: column wrap;
  flex-flow: column wrap;
  -webkit-column-count: 2;
  -moz-column-count: 2;
  column-count: 2;
}

[data-filter='price'] .filter-heading {
  background: none;
  cursor: default;
}

[data-filter='price'] .filter-div {
  display: block;
  margin-top: 13px;
}

@media screen and (max-width: 767px) {
  .filtericon {
    // border-bottom: 1px solid #e7e7e7;
    padding-bottom: 1px;
  }
  .index-div {
    padding-left: 37px;
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #afafaf;
    width: 88%;
  }
}

.side-filter {
  display: inline-flex;
  margin-left: -11px;
  @media screen and (max-width: 767px) {
    margin-left: 32px;
    margin-top: 7px;
  }
}

.filtericon {
  width: 28px;
  height: 27px;
}

@media screen and (min-width: 768px) and (max-width: 1023px) {
  .side-filter {
    display: inline-flex;
  }
  .filtericon {
    width: 28px;
    height: 27px;
  }
  p.filterp {
    margin-top: 5px;
    padding-left: 11px;
    font-size: 13px;
  }

  .sortp p {
    font-size: 13px !important;
    margin: 9px 0 0 -21px !important;
  }
  .sorting label {
    font-size: 13px;
  }
  .totalProducts {
    font-size: 13px !important;
  }
}

.filt {
  height: calc(100% - 39%);
  overflow-y: scroll;
  overflow-x: hidden;
}

.filterp {
  font-family: Arial;
  color: #2a285a;
}

.sort-by h3 {
  font-family: Arial;
  margin-top: 0px;
  color: #2a285a;
}

@media screen and (max-width: 767px) {
  .mobile-filters-button1 {
    padding-left: 27px;
    padding-top: 0px;
  }
  .filtericon1 {
    // border-bottom: 1px solid #e7e7e7;
    padding-bottom: 11px;
    // border-top: 1px solid #e7e7e7;
  }
}

//Custom Styling
p.noResultsHeading,
div.SearchText p {
  color: #2a285a;
  font-size: 41px;
  font-family: 'oblik';
  margin-top: 70px;
  margin-bottom: 30px;
}

p.noResultsDescription {
  margin-top: 0px;
  margin-bottom: 30px;
  font-size: 18px;
  font-family: Arial, Helvetica, sans-serif;
  color: #6b6b6c;
}

div.SearchText p {
  font-weight: bold;

  span {
    //color: grey
  }
}

//From Category.vue
.sot {
  display: inline-flex;
}

.sorting label {
  color: #29275b;
  font-weight: bold;
  margin: 9px 9px 0px 15px;
  font-size: 17px;
}

.totalProducts {
  color: #29275b;
  font-weight: bold;
  padding-right: 10px;
  margin: 9px 0px 0px 11px;
  font-size: 17px;
  @media screen and (max-width: 991px) and (min-width: 768px) {
    font-size: 12px;
    margin: 12px 0px 0px 4px;
  }
}

@media screen and (max-width: 991px) and (min-width: 768px) {
  .sorting label {
    color: #29275b;
    font-weight: bold;
    margin: 9px 7px 0px 21px;
    font-size: 13px;
  }
}

.droppy {
  display: inline-flex;
  margin-left: -23px;
}

.sortp p {
  color: #29275b;
  font-weight: bold;
  padding-right: 6px;
  margin: 9px 0 0 5px;
  font-family: 'Arial', serif;
  font-size: 17px;
}

.paging {
  display: inline-flex;
  float: right;

  p {
    padding: 0;
    margin: 7px 4px 0 0;
    font-size: 16px;
    font-weight: bold;
    color: #2a285a;
  }
}

.mobile-hide2 {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #b2b2b1;
  width: 100%;
  padding-right: 20px;
  padding-top: 10px;
}

@media (max-width: 767px) {
  p.noResultsHeading,
  div.SearchText p {
    color: #2a285a;
    font-size: 5.067vw;
    font-family: 'oblik';
    margin-top: 23px;
    margin-bottom: 16px;
    padding: 0px 20px 0px 20px;
  }
  p.noResultsDescription {
    margin-top: 10px;
    margin-bottom: 0px;
    font-size: 11px;
    font-family: Arial, Helvetica, sans-serif;
    color: #6b6b6c;
    padding: 0px 20px 0px 20px;
  }
  .mobile-hide1 {
    display: none;
  }
  .mobile-hide2 {
    padding: 17px;
  }
  .sort-by {
    border-bottom: none;
  }
  .sorting label {
    display: none;
  }
  .filterp {
    font-size: 3.2vw;
    display: none;
  }
  .sortp p {
    font-size: 3.2vw;
    margin: 15px 0 0 0px;
    white-space: nowrap;
    color: #434343;
    font-family: Arial;
  }
  .sot {
    display: -ms-inline-flexbox;
    display: inline-flex;
    margin-right: 0px;
  }
  .sort-by {
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 9px;
    width: 88%;
  }
  .sort-by-hideMob {
    display: none;
  }
  .totalProducts {
    font-size: 3.2vw;
    color: #434343;
    margin-top: 16px;
    font-family: Arial;
    margin-left: 21px;
    padding: 0;
  }
  .filterq {
    font-family: Arial;
    color: #434343;
    font-size: 3.2vw;
    margin: 6px 0px 0px 3px !important;
  }
  .pt15 {
    padding-top: 0px;
  }
  .sidebar__header__clear {
    color: #f20d7c;
    text-decoration: underline;
    font-size: 2.4vw;
    margin: 1px 0px 0px 0px;
    font-weight: 600;
    line-height: 50px;
  }
  .mobile-hide2 {
    border: none;
  }
}

@media (min-width: 767px) {
  .filterq {
    display: none;
  }
  .sidebar__header__clear {
    display: none !important;
  }
  .products-list {
    margin-top: 1%;
    padding-left: 46px;
    padding-right: 0px;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .sidebar__header__clear {
    color: #f20d7c;
    text-decoration: underline;
    font-size: 2.4vw;
    margin: 14px 0 0px -4px;
    font-weight: 600;
  }
  .sortp p {
    font-size: 3.2vw;
    margin: 15px 8px 0 50px;
    white-space: nowrap;
    color: #434343;
    margin-top: 16px;
  }
  .totalProducts {
    font-size: 3.2vw;
    color: #434343;
    margin-top: 16px;
    font-family: Arial;
  }
  .totalProducts {
    font-size: 14px !important;
    color: #434343;
    margin-top: 16px;
  }
  .sortp p {
    font-size: 15px !important;
  }
  .filterq {
    font-size: 15px !important;
  }
  .sort-by select {
    width: 95px !important;
    background-position-x: 72px !important;
  }
}

@media (max-width: 1200px) and (min-width: 767px) {
  .mobile-hide1 {
    display: none;
  }
}

@media (min-width: 1200px) {
  .droppy {
    display: inline-flex;
    //margin-left: -40px;
  }
  .sot {
    margin-left: 34px;
  }
}

@media (min-width: 1023px) and (max-width: 1200px) {
  .sort-by select {
    width: 136px;
    background-position-x: 116px;
  }
  .sot {
    display: -ms-inline-flexbox;
    display: inline-flex;
    margin-left: 56px;
  }
  .sortp p {
    color: #29275b;
    font-weight: bold;
    padding-right: 6px;
    margin: 9px 0px 0 -19px;
    font-family: 'Arial', serif;
    font-size: 17px;
  }
}

@media (max-width: 575px) and (min-width: 320px) {
  .sortp p {
    font-size: 3.2vw;
    margin: 15px 0 0 -14px;
    white-space: nowrap;
    color: #434343;
    font-family: Arial;
  }
}

.applyFilterBtnBR {
  margin-top: 20px;
}
</style>
