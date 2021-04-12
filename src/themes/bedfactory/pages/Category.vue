<template>
  <div id="category" ref="categoryPage">
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
          <div class="row m0images catrow" v-if="!isListingProducts">
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
            v-show="
              isListingProducts ||
              getCurrentCategory.display_mode === 'PRODUCTS' ||
              getCurrentCategory.display_mode === 'PRODUCTS_AND_PAGE'
            "
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
                class="clearallp"
                @click="resetAllFilters"
                v-show="hasActiveFilters1"
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
                <p>{{ getCategoryProductsTotal }} Results</p>
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
          <div class="firstcol title-box sb-category-tile-text">
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
        v-if="
          isListingProducts ||
          getCurrentCategory.display_mode === 'PRODUCTS' ||
          getCurrentCategory.display_mode === 'PRODUCTS_AND_PAGE'
        "
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
            <label class="mr10 collabel">{{ $t('Show') }}:</label>
            <columns @change-column="columnChange" />
            <p class="totalprods">{{ getCategoryProductsTotal }} Results</p>
          </div>
          <div class="pagination sorting main-pagination col-sm-8 col-md-8">
            <div class="paging">
              <ProductListingPagination
                :items="pagination.currentPageItems"
                :total-items="getCategoryProductsTotal"
                :page-size="pagination.pageSize"
                :category-id="getCurrentCategory.id"
                :initial-page="pagination.selectedPage"
                @changePage="pageChanged"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="row pt10">
        <div
          v-if="pageLayout !== '1column'"
          class="col-md-2 start-xs category-filters p0 pr0"
        >
          <sidebar
            :value="
              getCurrentSearchQuery.sort ? getCurrentSearchQuery.sort : ''
            "
            :filters="getAvailableFilters"
            @changeFilter="changeFilter"
            :prodlisting="
              isListingProducts ||
              getCurrentCategory.display_mode === 'PRODUCTS' ||
              getCurrentCategory.display_mode === 'PRODUCTS_AND_PAGE'
            "
          />
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
        <div class="col-md-3 start-xs mobile-filters" v-if="mobileFilters">
          <sidebar
            class="mobile-filters-body"
            :filters="getAvailableFilters"
            @changeFilter="changeFilter"
          />
          <div class="sticky pb10">
            <div class="relative pb20 pt15 sticky-inner">
              <div class="brdr-top-1 brdr-cl-primary absolute divider w-100" />
            </div>
            <button-full
              class="mb20 btn__filter"
              @click.native="
                closeFilters();
                buttonclose();
              "
            >
              View
              {{
                !hasActiveFilters1 &&
                getCategoryProductsTotal !== totalCategoryItemsCustom
                  ? totalCategoryItemsCustom
                  : getCategoryProductsTotal
              }}
              Products
            </button-full>
          </div>
        </div>
        <div
          class="border-box products-list"
          :class="[pageLayout !== '1column' ? 'col-md-10' : 'col-md-12']"
        >
         <!-- getCurrentCategory  {{getCurrentCategory}} -->
         


<!-- {{getCategoryProductsTotal}}
getCategoryProducts {{getCategoryProducts}} -->
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
          <!-- For categories -->
          <div
            class="container pt0"
            id="subcategory-list"
            v-show="!hasActiveFiltersOnPage && !sorted"
          >
          <!-- It wont come here -->
            <div
              class="category-listing row m0 start-md"
              v-if="getCurrentCategory.display_mode === 'PAGE'"
              :class="getCurrentCategory.display_mode"
            >
              <!-- CategoryList -->
              <template v-for="(childrenCategory, index) in childrenData">
                <template v-if="!childrenCategory.show_on_content">
                  <div
                    class="col-sm-6 flex col-lg-3 col-md-3 col-xs-6 sb-item"
                    :class="childrenCategory.slug"
                    :key="childrenCategory.id"
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
              </template>
            </div>
          </div>
          <!-- For Categories -->
          <div
            class="product-lisitng-inner"
            id="products-list-new"
            v-if="
              isListingProducts ||
              getCurrentCategory.display_mode === 'PRODUCTS' ||
              getCurrentCategory.display_mode === 'PRODUCTS_AND_PAGE'
            "
          >
          <product-listing
              @showPagination="showbottompage"
              :columns="defaultColumn"
              :products="pagination.currentPageItems || getCategoryProducts"
              :filters="getAvailableFilters"
            />
            <lazy-hydrate
              :trigger-hydration="!loading"
              v-if="
                isLazyHydrateEnabled &&
                getCategoryProductsTotal > lengthOfProductArray
              "
            >
            So we in here <br /> Total products {{getCategoryProductsTotal}}
              <product-listing
                @showPagination="showbottompage"
                :columns="defaultColumn"
                class="pagination-true"
                :filters="getAvailableFilters"
                :products="
                  pagination.currentPageItems &&
                  pagination.currentPageItems.length > 0
                    ? pagination.currentPageItems
                    : []
                "
              />
            </lazy-hydrate>
            <lazy-hydrate
              :trigger-hydration="!loading"
              v-else-if="
                isLazyHydrateEnabled &&
                getCategoryProductsTotal <= lengthOfProductArray
              "
            >
             So we not in there <br /> Total products {{getCategoryProductsTotal}}
              <product-listing
                :columns="defaultColumn"
                class="pagination-false"
                :products="getCategoryProducts"
                @showPagination="showbottompage"
                :filters="getAvailableFilters"
              />
            </lazy-hydrate>
            <product-listing
              v-else
              @showPagination="showbottompage"
              :columns="defaultColumn"
              :products="pagination.currentPageItems || getCategoryProducts"
              :filters="getAvailableFilters"
            />
            <!-- pagination.currentPageItems || getCategoryProducts <br /><br /><br />{{ getCategoryProducts}} -->
          </div>
          <div
            class="bottom-pagination"
            :class="bottompagination ? 'bordertop' : ''"
            v-if="isListingProducts"
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
import {
  localizedRoute,
  currentStoreView
} from '@vue-storefront/core/lib/multistore'
import { htmlDecode } from '@vue-storefront/core/filters'
import { CategoryService } from '@vue-storefront/core/data-resolver'
import ProductListingPagination from '../components/core/blocks/ProductListingPagination'
import _ from 'lodash'
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
  mixins: [GTAGCategory],
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
      baseUrlImage: ""
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
        this.children = await this.fetchCategoriesAndSubCategories()
        this.setGtagProductsList()
      }
    },
    getBreadcrumbsRoutes (newval, old) {
      if (newval.length > 0 && !this.hasFired) {
        this.hasFired = true
        this.addBloom()
      }

    },

    $route (to, from) {
      if (!this.asFired) {
        this.hasFired = true
        this.addBloom()
      }
      this.getCatproduct(this.getCurrentCategory.cat_banner_sku)
      if (from.path !== to.path) {
        if (localStorage.getItem('topLevelCategoryPosition')) {
          setTimeout(() => {
            var localCatName = localStorage.getItem('topLevelCategoryPosition')
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
    this.baseUrlImage = config.server.baseUrl
    if (this.$route.query && this.$route.query.page && !isNaN(this.$route.query.page)) {
      this.pagination.selectedPage = parseInt(this.$route.query.page)
    }

  },
  beforeMount () {
    window.addEventListener('scroll', (event) => {
      let scroll = window.scrollY
      localStorage.setItem("scrollloc", scroll)
    })
    window.addEventListener('load', (event) => {
      let loca = localStorage.getItem('scrollloc')
      window.scrollTo(0, loca)
    })
    this.$bus.$on('gotop', this.gototop)
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  async mounted () {
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
    this.setGtagProductsList()
  },
  computed: {
    ...mapGetters({
      getCurrentSearchQuery: 'category-next/getCurrentSearchQuery',
      getCategoryProducts: 'category-next/getCategoryProducts',
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCategoryProductsTotal: 'category-next/getCategoryProductsTotal',
      getAvailableFilters: 'category-next/getAvailableFilters',
      getBreadcrumbsRoutes: 'breadcrumbs/getBreadcrumbsRoutes',
      getBreadcrumbsCurrent: 'breadcrumbs/getBreadcrumbsCurrent'
    }),
    socialLinksSchema () {
      return config.socialUrlsForSchema ? config.socialUrlsForSchema : ''
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
    getExcludeFieldsForRequest () {
      return ['sgn']
    },
    isCategoryEmpty () {
      return this.getCategoryProductsTotal === 0
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
    gototop () {
      setTimeout(() => {
        localStorage.setItem("topLevelCategoryPosition", '')
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
        categoryName = categoryName.replace(/[/]/g, '|')
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
      return await this.getBreadcrumbsRoutes
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
    // async bannerUrlLink () {
    //   this.bannerUrl = await this.getCurrentCategory.cat_banner
    //   if (!this.bannerUrl || this.bannerUrl === 'null') {
    //     this.bannerUrl = config.server.baseUrl + 'assets/category-images/header.png'
    //     return this.bannerUrl
    //   }
    //   this.bannerUrl = getThumbnailPath(`/${this.bannerUrl}`, 1280, 298, 'category')
    //   return this.bannerUrl
    // },
    categoryTileTypeUnitCheck (category) {
      let categoryUnit = ''
      if (category.category_price_type) {
        if (this.categoryTileType[category.category_price_type] === 'sqm') {
          categoryUnit = 'm<sup>2</sup>'
        } else if (this.categoryTileType[category.category_price_type]) {
          categoryUnit = this.categoryTileType[category.category_price_type]
        } else {
          categoryUnit = 'm<sup>2</sup>'
        }
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
      this.$store.dispatch('category-next/resetSearchFilters')
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
      if (filterVariant && filterVariant.type && this.sorted === false) {
        this.sorted = true
      }
      this.$store.dispatch('category-next/switchSearchFilters', [
        filterVariant
      ])
      setTimeout(() => {
        this.getProducts()
      }, 500)
    },
    async columnChange (column) {
      this.pagination.pageSize = column
      await this.getProducts()
    },
    async pageChanged ({ pageOfItems, startIndex, endIndex, selectedPage }) {
      this.pagination.startIndex = startIndex
      this.pagination.selectedPage = selectedPage
      await this.getProducts()
      if (this.pagination.selectedPage !== 1) {
        this.updatePathParams(this.$router, { page: this.pagination.selectedPage })
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
    updatePathParams ($router, newParams) {
      if (newParams.page && newParams.page === 1) {
        return false
      }
      // Retrieve current params
      const currentQueryParams = $router.currentRoute.query
      // When router is not supplied path or name,
      // it simply tries to update current route with new params or query
      // Almost everything is optional.
      this.$router.push({ path: $router.currentRoute.path, query: { ...currentQueryParams, ...newParams } })
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
   // console.log('getCurrentCategory Meta', this.getCurrentCategory)
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
.sidebar__header__clear {
  line-height: 37px;
  color: #c7c7c7;
  text-decoration: underline;
  font-size: 9px;
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
  display: none;
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
    display: block;
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
    }
  }
  .under-catergory-filter {
    border-bottom: 2px solid #ebebeb;
    height: 48px;
    .row {
      margin-top: 0px;
      padding-left: 10px;
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
    display: flex;
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
  @media screen and (min-width: 320px) and (max-width: 480px) {
    .mobile-filters {
      top: 58px !important;
    }
    .close-button {
      top: 58px !important;
      height: 54px !important;
    }
  }
  @media screen and (max-width: 767px) {
    .sorting1 {
      display: block;
      line-height: 33px;
    }
    .dropd1 {
      line-height: 47px;
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
.totalprods {
  color: #29275b;
  font-weight: bold;
  padding-right: 10px;
  margin: 7px 0px 0px 11px;
  font-size: 17px;
  font-family: Arial;
  @media screen and (max-width: 1278px) and (min-width: 1024px) {
    font-size: 15px;
    margin: 7px 0px 0px 11px;
  }
  @media screen and (max-width: 1023px) and (min-width: 768px) {
    font-size: 13px;
    margin: 10px 0px 0px 8px;
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
  .mobile-filters-button {
    margin-top: 4px;
    p {
      font-size: 11px;
      z-index: 9999;
    }
    img {
      width: 25px;
      height: 25px;
    }
  }
  header {
    .mobile-sorting p {
      font-size: 11px;
      margin-bottom: 0px;
      margin-top: 10px;
      margin-left: 4px;
    }
    .mobile-sorting1 p {
      font-family: Arial, Helvetica, sans-serif;
      font-weight: bold;
      text-align: end;
      margin-top: 20px;
      color: #434343;
    }
  }
  .sortp1 p {
    font-size: 10px;
    padding-right: 0px;
    margin-left: 4px;
    margin-right: 0px;
    color: #434343;
  }
  .clearallp {
    margin: -2px 0 !important;
    padding: 0 0 0px 2px !important;
  }
  header .mobile-sorting p {
    font-size: 10px;
  }
}
@media screen and (min-width: 375px) and (max-width: 767px) {
  .sortp1 {
    p {
      font-size: 12px !important;
      padding-right: 1px !important;
    }
  }
}
@media screen and (min-width: 320px) and (max-width: 374px) {
  .under-catergory-filter {
    .row {
      margin-top: 0px;
      padding-left: 4px !important;
    }
  }
}
@media screen and (min-width: 320px) and (max-width: 330px) {
  .mobile-filters {
    height: 87vh !important;
  }
}
@media screen and (min-width: 320px) and (max-width: 324px) {
  .clearallp {
    margin: -0px 0 !important;
  }
}
@media (max-width: 440px) and (min-width: 320px) {
  .mobile-filters-button {
    p {
      z-index: 9999;
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
</style>
