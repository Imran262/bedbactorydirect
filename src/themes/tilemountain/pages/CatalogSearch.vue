<template>
  <div class="search-page-main container">
    <div class="breadcrumbs mt10 h5 cl-gray" v-if="search !== ''">
      <span class="home-breadcrumb-icon product-page-home-breadcrumb-icon">
        <router-link :to="localizedRoute('/')" class="cl-tertiary links">
          <!-- <img
            class="home-breadcrumb-icon-img"
            src="/assets/home-breadcrumb-icon.svg"
          /> -->
          <span>Home</span>
        </router-link>
        |
      </span>
      <span class="cl-mine-shaft">Search results for: {{ searchUrl }}</span>
    </div>
    <div class="SearchText mt50" v-if="!emptyResults">
      <p class="cl-mine-shaft">
        Search results
        <template v-if="searchUrl">
          for ’<span class="cl-gray">{{ searchUrl }}</span
          >’
        </template>
        returned <span class="cl-gray">{{ totalResults }}</span> results.
      </p>
    </div>
    <div class="row upper-row border" v-if="!emptyResults">
      <h4 class="sidebar__header mt10 mb0 flex col-md-3 col-xs-2 col-lg-2 pl0">
        <span
          class="side-filter"
          @click="
            openFilters();
            overlayShow();
            buttonShow();
          "
        >
          <img src="/assets/category-images/filters.svg" class="filtericon" />
          <p class="filterp">Refine by</p>
          <p class="filterq">Filter</p>
        </span>
      </h4>
      <span
        @click="resetAllCatalogFilters"
        class="weight-400 sidebar__header__clear pointer sans-serif flex lh25 col-xs-2 clearAllClass"
      >
        Clear All
      </span>
      <div class="col-md-9 col-xs-8 col-lg-10 row p0">
        <div class="sorting sot col-xs-6 col-sm-8 col-md-4 col-lg-3">
          <div class="sortp">
            <p>Sort by:</p>
          </div>
          <div class="dropd">
            <sort-by :has-label="true" @change="changeFilterSort" />
          </div>
        </div>
        <div class="sorting droppy col-xs-6 col-sm-4 col-md-5 col-lg-6">
          <label class="mr10 collabel">{{ $t('Show') }}:</label>
          <columns @change-column="columnChange" />
          <p class="totalProducts">{{ totalResults }} Results</p>
        </div>
        <div class="pagination sorting main-pagination col-sm-3 col-md-3 desk">
          <div class="paging mobile-hide1">
            <!-- <div>
              <p>Page:</p>
            </div> -->
            <search-pagination
              :items="pagination.currentPageItems"
              :total-items="totalResults"
              :page-size="pagination.pageSize"
              :initial-page="pagination.selectedPage"
              :sort="pagination.sort"
              @changePage="pageChanged"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row pt15" v-if="!emptyResults">
      <div class="col-md-2 search-SideBar">
        <div class="start-xs category-filters">
          <span
            class="weight-400 sidebar__header__clearAll pointer sans-serif flex lh25 clearAllClass"
            @click="resetAllCatalogFilters"
          >
            Clear All
          </span>
          <template
            v-for="(
              { filter, style, key, filterType = `checkbox` }, index
            ) in allFilters"
          >
            <div
              class="index-div"
              :data-filter="index"
              :data-filter-key="key || index"
              :data-filter-type="filterType"
              :key="index"
              v-if="filter.length > 0"
            >
              <h4
                @click="filterRef"
                class="filter-heading"
                :class="style === 'close' ? '' : 'toggleIcon'"
                :style="index === 'type' ? `background:none;` : ``"
              >
                {{ index }}
              </h4>

              <!-- _______________________________________________________ -->
              <div
                class="filter-div"
                :class="style === 'close' ? '' : 'filter-open'"
              >
                <template v-if="filterType === `checkbox`">
                  <label
                    class="container1"
                    id="container1"
                    v-for="({ code, title }, indexSingle) in filter"
                    :key="indexSingle"
                  >
                    <template>
                      <input
                        type="checkbox"
                        :code="index"
                        :value="code"
                        :codeSingle="code"
                        @click="updateAppliedFilters($event)"
                        :checked="isFilterActive({ index, code })"
                        :class="
                          isFilterActive({ index, code }) ? `active-filter` : ``
                        "
                      />
                      <span>{{ title || code }}</span>
                      <span class="checkmark1" />
                    </template>
                  </label>
                </template>
                <template v-else-if="filterType === `range`">
                  <range-filter
                    :code="index"
                    :price-range="[filter[0], filter[1]]"
                    @change="changeRangeFilter($event, { filterType })"
                  />
                </template>
              </div>
            </div>
          </template>
          <div
            class="filter-section-main filter-price-main"
            v-if="!getNoResultsMessage"
          >
            <div
              class="filter-div filter-open"
              v-if="updateFilter"
              ref="priceMain"
            />
          </div>
        </div>
        <div class="under-catergory-filter">
          <div class="container">
            <div class="row m0">
              <button
                class="col-xs-5 mr15filters mobile-filters-button brdr-none"
                @click="openFilters"
              >
                <img src="/assets/category-images/filters.svg" alt="filter" />
                <p class="filterp">
                  {{ $t('Filters') }}
                </p>
              </button>
            </div>
          </div>
        </div>
        <div
          class="full-overlay"
          v-if="isOverlayShowing"
          @click="
            closeFilters();
            buttonClose();
          "
        />
        <div
          class="close-button"
          @click="buttonClose"
          v-if="closeButtonShowing"
        >
          <div class="close-container absolute w-100">
            <i
              class="material-icons p15 close cl-accent"
              @click="
                closeFilters();
                overlayClose();
              "
            >
              close
            </i>
          </div>
        </div>
        <div class="col-md-3 start-xs mobile-filters" v-show="mobileFilters">
          <div class="container filtericon1">
            <div class="row m0">
              <button
                class="col-xs-5 mr15filters mobile-filters-button1 brdr-none"
              >
                <img src="/assets/category-images/filters.svg" alt="filter" />
                <p class="filterp">
                  {{ $t('Filters') }}
                </p>
              </button>
            </div>
          </div>
          <div class="filt">
            <div class="sort-by sort-by-hideMob">
              <h3>Sort By:</h3>
              <div class="radio radio-primary">
                <label class="container2">
                  Latest
                  <input
                    type="radio"
                    value="updated_at:desc"
                    checked="checked"
                    @change="sortOnChange('updated_at:desc')"
                    name="radio"
                  />
                  <span class="checkmark" />
                </label>
                <label class="container2">
                  Price-Low to High
                  <input
                    type="radio"
                    value="final_price"
                    @change="sortOnChange('final_price')"
                    name="radio"
                  />
                  <span class="checkmark" />
                </label>
                <label class="container2">
                  price-High to Low
                  <input
                    type="radio"
                    value="final_price:desc"
                    @change="sortOnChange('final_price:desc')"
                    name="radio"
                  />
                  <span class="checkmark" />
                </label>
              </div>
            </div>
            <template
              v-for="(
                { filter, style, key, filterType = `checkbox` }, index
              ) in allFilters"
            >
              <div
                class="index-div"
                :data-filter="index"
                :data-filter-key="key || index"
                :data-filter-type="filterType"
                :key="index"
                v-if="filter.length > 0"
              >
                <h4 @click="filterRef" class="toggleIcon filter-heading">
                  {{ index }}
                </h4>
                <div
                  class="filter-div"
                  :class="style === 'close' ? '' : 'filter-open'"
                >
                  <template v-if="filterType === `checkbox`">
                    <label
                      class="container1"
                      v-for="({ code, title }, indexSingle) in filter"
                      :key="indexSingle"
                    >
                      {{ title || code }}
                      <input
                        type="checkbox"
                        :code="index"
                        :value="code"
                        :codeSingle="code"
                        @click="updateAppliedFilters($event)"
                        :checked="isFilterActive({ index, code })"
                        :class="
                          isFilterActive({ index, code }) ? `active-filter` : ``
                        "
                      />
                      <span class="checkmark1" />
                    </label>
                  </template>
                  <template v-else-if="filterType === `range`">
                    <range-filter
                      :code="index"
                      :price-range="[filter[0], filter[1]]"
                      @change="changeRangeFilter($event, { filterType })"
                    />
                  </template>
                </div>
              </div>
            </template>

            <div
              class="filter-section-main filter-price-main"
              v-if="!getNoResultsMessage"
            >
              <div
                class="filter-div filter-open"
                v-if="updateFilter"
                ref="priceMain"
              />
            </div>
          </div>
          <div class="sticky pb10">
            <div class="relative pb20 pt15 sticky-inner" />
            <button-full
              class="mb20 btn__filter"
              @click.native="
                closeFilters();
                buttonClose();
              "
            >
              View {{ totalResults }} Products
            </button-full>
          </div>
        </div>
      </div>
      <div class="col-md-10 search-listing products-list">
        <product-listing
          :columns="defaultColumn"
          :products="pagination.currentPageProducts"
        />
      </div>
      <div
        class="pagination sorting main-pagination col-sm-12 col-xs-12 col-md-12"
      >
        <div class="paging mobile-hide2">
          
          <search-pagination
            :items="pagination.currentPageItems"
            :total-items="totalResults"
            :page-size="pagination.pageSize"
            :initial-page="pagination.selectedPage"
            :sort="pagination.sort"
            @changePage="pageChanged"
          />
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="getNoResultsMessage"
        class="no-results relative h4 col-md-12 mt-50"
      >
        <template v-if="emptyResults">
          <p class="noResultsHeading">Sorry, no product results were found.</p>
          <p class="noResultsDescription cl-gray">
            We're sorry, no product results were found. Please use our advance
            filters or search below to help find exactly what you would like.
          </p>
          <no-result-filters
            :filters="allFilters"
            @apply-filters="updateSearch"
          />
        </template>
      </div>
    </transition>
  </div>
</template>
<script>
import ProductListing from '../components/core/ProductListingCustom.vue'
import { Logger } from '@vue-storefront/core/lib/logger'
import { SearchQuery } from 'storefront-query-builder'
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import { mapGetters } from 'vuex'
import RangeFilter from 'src/modules/vsf-layered-nav/components/FilterTypes/RangeFilter'
import Columns from '../components/core/ColumnsCustom.vue'
import SortBy from '../components/core/SortByCustom.vue'
import SearchPagination from '../components/custom/search/SearchPagination'
import NoResultFilters from '../components/custom/search/NoResultFilters'
import { findAncestor } from '../helpers'
import { currentPage } from '@vue-storefront/core/modules/user/test/unit/store/data'
import { MeasureProductClick } from 'src/modules/google-gtag/mixins/MeasureProductClick'
import config from 'config'

const THEME_PAGE_SIZE = (config && config.filterShowItems && config.filterShowItems.selectedOption) ? config.filterShowItems.selectedOption : 12

export default {
  name: 'SearchResultPage',
  mixins: [MeasureProductClick],
  data () {
    return {
      mobileFilters: false,
      loadingProducts: false,
      loading: true,
      children: [],
      isOverlayShowing: false,
      closeButtonShowing: false,
      defaultColumn: 4,
      products: [],
      filterProducts: [],
      search: '',
      size: 10000,
      start: 0,
      emptyResults: false,
      componentLoaded: false,
      totalResults: 0,
      urlQuery: null,
      selectSortBy: '',
      minPriceVal: 0,
      maxPriceVal: 0,
      styleArray: [],
      styleArrayOri: [],
      colorArray: [],
      colorArrayOri: [],
      newStyleInsideBuild: [],
      newColorInsideBuild: [],
      updateFilter: false,
      filterApplied: [],
      minPriceValOri: 0,
      maxPriceValOri: 0,
      allFilterFinalArray: [],
      emptyResultsOptions: {
        allProducts: []
      },
      // Screen Size
      col: false,
      colWidth: false,
      colWidth1: false,
      window: {
        width: 0
      },
      // For Pagination
      pagination: {
        startIndex: 0,
        currentPageItems: [],
        pageSize: THEME_PAGE_SIZE,
        selectedPage: 1,
        currentPageProducts: [],
        sort: ''
      },
      // Filters
      appliedFilters: [],
      productsForFilters: [],
      fromFiltersOnlyView: false
    }
  },
  components: {
    NoResultFilters,
    ProductListing,
    RangeFilter,
    Columns,
    SortBy,
    ButtonFull,
    SearchPagination
  },
  computed: {
    hasActiveFilters () {
      return this.$store.getters['category-next/hasActiveFilters']
    },
    ...mapGetters({
      attributesByCode: 'attribute/attributeListByCode'
    }),
    searchUrl () {
      return this.$route.query.s
    },
    getNoResultsMessage () {
      let msg = ''
      if (this.emptyResults) {
        msg = 'No results were found.'
      }
      if (this.search === '') {
        msg = 'Please enter the search text.'
      }
      return msg
    },
    isFilterActive () {
      return ({ index, code }) => {
        if (typeof code === 'number') {
          return !!this.appliedFilters[index] && this.appliedFilters[index].filters.map(n => Number(n)).includes(code)
        }
        return !!this.appliedFilters[index] && this.appliedFilters[index].filters.includes(code)
      }
    },
    /**
     * available filter types are `checkbox` and `range`
     * @returns {{special_features: {filter: [], arrayFinal: [], style: string, key: string}, color: {filter: [], arrayFinal: [], style: string, key: string}, material: {filter: [], arrayFinal: [], style: string, key: string}, size: {filter: [], arrayFinal: [], style: string, key: string}, thickness: {filter: [], arrayFinal: [], style: string, key: string}, price: {filter: [], arrayFinal: [], style: string, filterType: string}, finish: {filter: [], arrayFinal: [], style: string, key: string}, type: {filter: [], arrayFinal: [], filterType: string, key: string}}}
     */
    allFilters () {
      let filters = {
        type: {
          arrayFinal: [],
          filter: [],
          key: 'filter_type.keyword',
          filterType: 'checkbox' // Optional parameter
        },
        color: {
          arrayFinal: [],
          filter: [],
          style: 'close',
          key: 'filter_colour.keyword'
        },
        finish: {
          arrayFinal: [],
          filter: [],
          style: 'close',
          key: 'finish' // Not Required if key is same.
        },
        material: {
          arrayFinal: [],
          filter: [],
          style: 'close',
          key: 'filter_material.keyword'
        },
        size: {
          arrayFinal: [],
          filter: [],
          style: 'close',
          key: 'filter_size.keyword'
        },
        thickness: {
          arrayFinal: [],
          filter: [],
          style: 'close',
          key: 'filter_thickness.keyword'
        },
        special_features: {
          arrayFinal: [],
          filter: [],
          style: 'close',
          key: 'special_features'
        },
        price: {
          arrayFinal: [],
          filter: [],
          style: 'open',
          filterType: 'range'
        }
      }

      // Price Filter with Sort Option
      filters.price.arrayFinal = this.productsForFilters ? this.productsForFilters
        .map(p => p.price)
        .filter(priceActual => !!priceActual)
        .sort((priceA, priceB) => priceA - priceB) : []

      if (filters.price.arrayFinal.length > 0) {
        filters.price.filter[0] = parseInt(filters.price.arrayFinal[0])
        filters.price.filter[1] = parseInt(filters.price.arrayFinal[filters.price.arrayFinal.length - 1])
      }

      // Type Filter
      filters.type.arrayFinal = this.productsForFilters ? this.productsForFilters
        .filter(({ filter_type }) => !!filter_type)
        .map(({ filter_type }) => filter_type)
        .filter((v, i, a) => a.indexOf(v) === i) : []

      filters.type.arrayFinal.forEach((attrCodeVal) => {
        filters.type.filter.push({
          code: attrCodeVal,
          title: attrCodeVal
        })
      })

      // Size Filter
      let sizeSortingRefArr = ['S', 'M', 'L', 'XL', 'XXL']
      filters.size.arrayFinal = this.productsForFilters ? this.productsForFilters
        .filter(({ filter_size }) => !!filter_size)
        .map(({ filter_size }) => filter_size)
        .filter((v, i, a) => a.indexOf(v) === i) : []

      filters.size.arrayFinal.forEach((attrCodeVal) => {
        filters.size.filter.push({
          code: attrCodeVal,
          title: attrCodeVal
        })
      })

      filters.size.filter = filters.size.filter.sort((a, b) => {
        return sizeSortingRefArr.indexOf(a.code) - sizeSortingRefArr.indexOf(b.code)
      })

      // Color Filter
      filters.color.arrayFinal = this.productsForFilters ? this.productsForFilters
        .filter(({ filter_colour }) => !!filter_colour)
        .map(({ filter_colour }) => filter_colour)
        .filter((v, i, a) => a.indexOf(v) === i) : []

      filters.color.arrayFinal.forEach((attrCodeVal) => {
        filters.color.filter.push({
          code: attrCodeVal,
          title: attrCodeVal
        })
      })

      // Material Filter
      filters.material.arrayFinal = this.productsForFilters ? this.productsForFilters
        .filter(({ filter_material }) => !!filter_material)
        .map(({ filter_material }) => filter_material)
        .filter((v, i, a) => a.indexOf(v) === i) : []

      filters.material.arrayFinal.forEach((attrCodeVal) => {
        filters.material.filter.push({
          code: attrCodeVal,
          title: attrCodeVal
        })
      })

      // Thickness Filter
      let reference_thickness_array = ['2-4', '4-6', '6-8', '8-10', '10-12', 'other']
      filters.thickness.arrayFinal = this.productsForFilters ? this.productsForFilters
        .filter(({ filter_thickness }) => !!filter_thickness)
        .map(({ filter_thickness }) => filter_thickness)
        .filter((v, i, a) => a.indexOf(v) === i) : []

      filters.thickness.arrayFinal.forEach((attrCodeVal) => {
        filters.thickness.filter.push({
          code: attrCodeVal,
          title: attrCodeVal
        })
      })

      // Sort Out the Custom Array
      filters.thickness.filter = filters.thickness.filter.sort((a, b) => {
        return reference_thickness_array.indexOf(a.code) - reference_thickness_array.indexOf(b.code)
      })

      // Finish Filter
      filters.finish.arrayFinal = this.productsForFilters ? this.productsForFilters
        .filter(({ finish }) => !!finish)
        .map(({ finish }) => finish)
        .filter((v, i, a) => a.indexOf(v) === i) : []

      filters.finish.arrayFinal.forEach((attrCodeVal) => {
        filters.finish.filter.push({
          code: attrCodeVal,
          title: this.attributesByCodeLabel(
            'finish',
            attrCodeVal
          )
        })
      })

      // Special Features Filter
      filters.special_features.arrayFinal = this.productsForFilters ? this.productsForFilters
        .filter(({ special_features }) => !!special_features)
        .map(({ special_features }) => special_features) : []
      filters.special_features.arrayFinal = this.flatten(filters.special_features.arrayFinal)
        .filter((v, i, a) => a.indexOf(v) === i)
      filters.special_features.arrayFinal.forEach((attrCodeVal) => {
        filters.special_features.filter.push({
          code: attrCodeVal,
          title: this.attributesByCodeLabel(
            'special_features',
            attrCodeVal
          )
        })
      })
      return filters
    }
  },
  methods: {
    addBloom () {
      if (config && config.bloomreach) {
        var br_data = br_data || {}
        br_data.acct_id = config.bloomreach.accountID
        br_data.ptype = 'search'
        br_data.title = this.searchUrl ? `Search results for:  ${this.searchUrl}` : 'Search Results Page'
        br_data.search_term = this.searchUrl ? this.searchUrl : ''
        br_data.domain_key = config.bloomreach.domainKey
        br_data.test_data = 'true'
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
    resetAllCatalogFilters () {
      let activeFilters = []
      if (window.innerWidth <= 767) {
        activeFilters = document.getElementsByClassName('mobile-filters') && document.getElementsByClassName('mobile-filters').length > 0 ? document.getElementsByClassName('mobile-filters')[0].querySelectorAll('.active-filter') : []
        if (activeFilters.length > 0) {
          this.appliedFilters = []
          this.doSearch()
          event.toElement.style.display = 'none'
        }
      } else {
        activeFilters = document.getElementsByClassName('category-filters') && document.getElementsByClassName('category-filters').length > 0 ? document.getElementsByClassName('category-filters')[0].querySelectorAll('.active-filter') : []
        if (activeFilters.length > 0) {
          this.appliedFilters = []
          this.doSearch()
          event.toElement.style.display = 'none'
        }
      }
    },
    resetAllFilters () {
      this.$store.dispatch('category-next/resetSearchFilters')
    },
    handleResize () {
      this.window.width = window.innerWidth
      if (this.window.width <= 1199 && this.window.width >= 992) {
        this.col = true
        this.colWidth = false
      } else if (this.window.width <= 991 && this.window.width >= 768) {
        this.colWidth = true
        this.col = false
      } else if (this.window.width <= 1278 && this.window.width >= 1200) {
        this.colWidth = false
        this.col = false
        this.colWidth1 = true
      } else {
        this.col = false
        this.colWidth = false
        this.colWidth1 = false
      }
    },
    flatten (arr) {
      return arr.reduce((flat, toFlatten) => {
        return flat.concat(Array.isArray(toFlatten) ? this.flatten(toFlatten) : toFlatten)
      }, [])
    },
    changeFilterSort (value) {
      if (value.id) {
        this.selectSortBy = value.id
      }
      this.doSearch()
    },
    sortOnChange () {
      console.log('sortTheProductsPlease')
    },
    updateSearch ({ selectedFilters, searchText = '' }) {
      // TODO: ReSearch with Applied Filters
      this.appliedFilters = selectedFilters
      this.fromFiltersOnlyView = true
      // this.search = searchText
      this.$router.push({
        path: '/catalog-search',
        query: { s: searchText }
      })
      this.updateTheCheckBoxesFromAppliedFilters({ appliedFilters: this.appliedFilters })
    },
    updateTheCheckBoxesFromAppliedFilters ({ appliedFilters }) {
      let currentPageFilter = []
      for (let key in appliedFilters) {
        if (appliedFilters.hasOwnProperty(key)) {
          let appFilter = appliedFilters[key]
          let currentPageFilter = document.querySelectorAll('[data-filter-key="' + appFilter.key + '"]')
          if (currentPageFilter.length > 0) {
            currentPageFilter = currentPageFilter[0]
            // Now the Selected Filters in Current Filter, such as Color filter can have selected black and white both or even red as well etc.
            appFilter.filters.forEach(filterSingle => {
              // check the checkbox
              let singleCheckBoxItem = document.querySelector('[data-filter-key="' + appFilter.key + '"] input[codesingle="' + filterSingle + '"]')
              // singleCheckBoxItem.checked = true;
              // singleCheckBoxItem.classList.add('active-filter');
            })
          }
        }
      }
    },
    overlayShow () {
      this.isOverlayShowing = true
      let scrollOff = document.getElementsByTagName('body')[0]
      if (this.isOverlayShowing === true) {
        scrollOff.style.overflow = 'hidden'
      } else {
        scrollOff.style.overflow = 'scroll'
      }
    },
    overlayClose () {
      this.isOverlayShowing = false
      let scrollOff = document.getElementsByTagName('body')[0]
      scrollOff.style.overflow = 'scroll'
    },
    buttonShow () {
      this.closeButtonShowing = true
      this.isOverlayShowing = true
    },
    buttonClose () {
      this.closeButtonShowing = false
    },
    openFilters () {
      this.mobileFilters = true
    },
    closeFilters () {
      this.mobileFilters = false
      this.isOverlayShowing = false
      let scrollOff = document.getElementsByTagName('body')[0]
      scrollOff.style.overflow = 'scroll'
    },
    filterRef (event) {
      event.target.classList.toggle('toggleIcon')
      event.target.nextElementSibling.classList.toggle('filter-open')
    },
    filter_array_values (arr) {
      arr = arr.filter(this.isEligible)
      return arr
    },
    isEligible (value) {
      return value
    },
    buildSearchQuery (queryText = this.search) {
      let searchQuery = new SearchQuery()
      searchQuery = searchQuery
        .setSearchText(queryText || '')
        .applyFilter({ key: 'visibility', value: { in: [3, 4] } })
        .applyFilter({
          key: 'status',
          value: { in: [0, 1] }
        })

      for (const [index, { filters, key, filterType }] of Object.entries(this.appliedFilters)) {
        if (filters.length > 0) {
          switch (filterType) {
            case 'range':
              searchQuery = searchQuery.applyFilter({
                key,
                value: { 'gte': filters[0], 'lte': filters[1] },
                scope: 'catalog'
              })
              break
            default:
              searchQuery = searchQuery.applyFilter({
                key,
                value: { in: filters }
              })
          }
        }
      }
      return searchQuery
    },
    async allProducts () {
      let searchQuery = new SearchQuery()
      searchQuery = searchQuery
        .setSearchText('')
        .applyFilter({ key: 'visibility', value: { in: [3, 4] } })
        .applyFilter({
          key: 'status',
          value: { in: [0, 1] }
        })
      return this.$store
        .dispatch('product/findProducts', {
          query: searchQuery,
          start: 0,
          configuration: {},
          size: 10000,
          // sort: this.selectSortBy,
          updateState: false
        })
    },
    async doSearch ({ searchSize = this.size, start = this.start, resetFilters = false } = {}) {
      let searchPayload = {
        query: this.buildSearchQuery(this.search),
        start: start,
        configuration: {},
        size: searchSize,
        updateState: false
      }

      if (this.selectSortBy) {
        searchPayload.sort = this.selectSortBy
      }

      await this.$store.dispatch('product/findProducts', searchPayload)
        .then(async ({ items }) => {
          this.products = items
          this.pagination.currentPageItems = this.products
          this.emptyResults = items.length < 1
          this.totalResults = items.length
          if (!this.emptyResults) {
            // For Filters, So that filters should not be re-evaluated on page.
            if (resetFilters || this.productsForFilters.length === 0) {
              this.productsForFilters = items
            }
          } else {
            let { items } = await this.allProducts()
            this.productsForFilters = items
          }
        })
        .catch((err) => {
          Logger.error(err, 'components-search')()
        })

      // Update the View info
      this.fromFiltersOnlyView = false
    },
    updateAppliedFilters (e) {
      let selectedFilterElement = e.target
      let selectedFilterStatus = selectedFilterElement.classList.toggle('active-filter')
      this.resetFilterTextShowFn()

      // Selected Filter if unchecked, Remove it from the Applied Filters
      if (!selectedFilterStatus) {
        let selectedFilterCode = findAncestor(selectedFilterElement, 'div[data-filter]').getAttribute('data-filter')
        let selectedFilter = selectedFilterElement.getAttribute('codeSingle')

        let selectedFilterIndex = this.appliedFilters[selectedFilterCode].filters.indexOf(selectedFilter)
        if (this.appliedFilters[selectedFilterCode] && selectedFilterIndex > -1) {
          let splicedResponse = this.appliedFilters[selectedFilterCode].filters.splice(selectedFilterIndex, 1)
          this.doSearch()
          return splicedResponse.length > 0
        }

        return false
      }

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
      this.doSearch()
      return true
    },
    changeRangeFilter ({ code, from, to, remove }, { filterType }) {
      this.appliedFilters[code] = {
        filters: [from, to],
        key: (this.allFilters[code] && this.allFilters[code].key) ? this.allFilters[code].key : code,
        filterType
      }
      this.doSearch()
    },
    resetFilterTextShowFn () {
      let activeFiltersTotal = []
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
      }
    },
    attributesByCodeLabel (attrCode, attrCodeInput) {
      if (attrCodeInput) {
        const attributeName = this.attributesByCode[attrCode].options
        let attribute = attributeName.filter(attr => attrCodeInput === parseInt(attr.value))
        return attribute.length > 0 ? attribute[0].label : attrCodeInput
      }
    },

    // Pagination and Sorting
    columnChange (column) {
      this.pagination.pageSize = column
    },
    async pageChanged ({ pageOfItems, startIndex, endIndex, selectedPage }) {
      this.pagination.startIndex = startIndex
      this.pagination.selectedPage = selectedPage
      this.pagination.currentPageProducts = pageOfItems
    }
  },
  async mounted () {
    this.addBloom()
    this.search = this.$route.query.s
    await this.doSearch()
    this.sendOtherClick();
    this.resetFilterTextShowFn()
  },
  watch: {
    searchUrl (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.addBloom()
        this.search = this.$route.query.s
      }
    },
    search (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (!this.fromFiltersOnlyView) {
          this.allFilterFinalArray = []
        }
        this.updateFilter = false
        this.doSearch()
      }
    },
    products (newData, oldData) {
      if (newData !== oldData) {
        this.pagination.currentPageItems = this.products
        this.pagination.sort = this.selectSortBy
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.sort-by1 {
  display: inline-flex;
}

.sidebar__header__clearAll {
  color: #c7c7c7;
  text-decoration: underline;
  font-size: 13px;
  float: right;
  margin-top: 11px;
}

.index-div:first-child .container1 input:checked ~ .checkmark1 {
  background: #fff !important;
  border-color: #da2f89 !important;
}

.index-div:first-child .checkmark1 {
  height: 20px !important;
  width: 20px !important;
  border-radius: 50%;
  border: 1px solid black !important;
}

.index-div:first-child .container1 .checkmark1:after {
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
  background: transparent url(/assets/category-images/filter-down-arrow.png)
    no-repeat 100% 75%;
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
    z-index: 5;
    left: 0;
    width: 90%;
    height: 100vh;
    top: 75px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0px;
  }
  .close-button {
    position: fixed;
    right: 0px;
    top: 75px;
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
    border-top: 2px solid #dfdfdf;
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

.container1 input:checked ~ .checkmark1 {
  background: #da2f89;
  border-color: #da2f89;
}

.checkmark1:after {
  content: '';
  position: absolute;
  display: none;
}

.container1 input:checked ~ .checkmark1:after {
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
    margin-left: 9px;
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
    border-bottom: 1px solid #e7e7e7;
    padding-bottom: 11px;
    border-top: 1px solid #e7e7e7;
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
    margin: 9px 9px 0px 15px;
    font-size: 13px;
  }
}
.droppy {
  display: inline-flex;
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
    margin-left: -40px;
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
</style>
