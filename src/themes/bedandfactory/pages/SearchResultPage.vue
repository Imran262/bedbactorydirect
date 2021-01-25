<template>
  <div class="search-page-main container">
    <div class="breadcrumbs mt10 h5 cl-gray">
      <span class="home-breadcrumb-icon product-page-home-breadcrumb-icon">
        <router-link :to="localizedRoute('/')" class="cl-tertiary links">
          <img
            class="home-breadcrumb-icon-img"
            src="/assets/home-breadcrumb-icon.svg"
          /> </router-link
        >|
      </span>
      <span class="cl-mine-shaft">You are searching {{ searchUrl }}</span>
    </div>
    <div class="container">
      <div class="row upper-row desktop-upper-row">
        <div class="col-xs-6 filter-mobile-div">
          <button class="mobile-filters-button" @click="openFilters">
            Filters
          </button>
        </div>
        <div class="sort-by col-xs-6">
          <select
            name="sortby"
            @change="sortOnChange($event)"
            class="selectSortBy"
            v-model="selectSortBy"
          >
            <option value>Sort</option>
            <option value="updated_at:desc">Latest</option>
            <option value="final_price">Price: Low to high</option>
            <option value="final_price:desc">Price: High to low</option>
          </select>
        </div>
        <span class="totalItems">{{ totalResults }} Items</span>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div
          class="col-md-3 search-SideBar start-xs mobile-filters"
          ref="mobileFiltersRef"
        >
          <div class="close-px15 absolute w-100">
            <i class="material-icons p15 close cl-accent" @click="closeFilters"
            >close</i
            >
          </div>
          <h4
            class="sidebar__header relative mt35 mb0 flex"
            v-if="
              products.length &&
                (selectedCategoryIds.length > 0 ||
                  (minPriceVal !== minPriceValOri ||
                    maxPriceVal !== maxPriceValOri))
            "
          >
            <!-- <span> {{ $t('Filter') }} </span> -->
            <span
              class="weight-400 sidebar__header__clear pointer sans-serif flex lh25"
              @click="resetAllFilters"
            >
              <i class="material-icons cl-accent mr5">cancel</i>
              {{ $t('Clear filters') }}
            </span>
          </h4>

          <div class="filter-section-main">
            <h4
              class="filter-heading toggleIcon"
              v-if="products.length && categories.length > 1"
              @click="filterRef"
            >
              Categories
            </h4>
            <div
              v-if="products.length && categories.length > 1"
              class="filter-div filter-open categories"
              :class="[
                {
                  'filter-options': showFilterExpander(),
                  'filter-expanded': filterExpand
                }
              ]"
              :style="{ 'max-height': setMaxHeight }"
            >
              <div
                context="category"
                class="filter-label"
                v-for="(single, indexSingle) in categories"
                :key="indexSingle"
              >
                <span
                  class="filter-label"
                  @click="toggleCategory(single.category_id)"
                >
                  <span
                    :code="single.category_id"
                    :codeSingle="single.category_id"
                  >{{ single.name }}</span
                  >
                </span>
              </div>
              <div class="filter-expander" v-show="showFilterExpander()">
                <span class="filter-expand" @click="filterExpander()">
                  <div class="plus-minus">
                    <div class="horizontal" />
                    <div class="vertical" />
                  </div>
                  <span class="label">{{ filterExpanderMessage }}</span>
                </span>
              </div>
            </div>
          </div>
          <div
            class="filter-section-main filter-price-main"
            v-if="!getNoResultsMessage"
          >
            <h4
              class="filter-heading price-filter-heading toggleIcon"
              @click="priceRefMobile"
            >
              Price
            </h4>
            <div
              class="filter-div filter-open"
              v-if="updateFilter"
              ref="priceMainMobile"
            >
              <price-slider
                context="category"
                code="price"
                id="price"
                ref="priceRefMobile"
                :price-range="[minPriceValOri, maxPriceValOri]"
                content="Price "
                label="Price Label"
                @change="changePriceFilter"
              />
            </div>
          </div>

          <div class="sticky pb10">
            <div class="relative pb20">
              <div class="brdr-top-1 brdr-cl-primary absolute divider w-100" />
            </div>
            <button-full class="mb20 btn__filter" @click.native="closeFilters">
              {{ $t('Apply and Close') }}
            </button-full>
          </div>
        </div>
        <div class="col-md-3 search-SideBar desktop-SideBar-col">
          <h4
            class="sidebar__header relative mt35 mb20 flex"
            v-if="
              products.length &&
                (selectedCategoryIds.length > 0 ||
                  (minPriceVal !== minPriceValOri ||
                    maxPriceVal !== maxPriceValOri))
            "
          >
            <!-- <span> {{ $t('Filter') }} </span> -->
            <span
              class="weight-400 sidebar__header__clear pointer sans-serif flex lh25"
              @click="resetAllFilters"
            >
              <i class="material-icons cl-accent mr5">cancel</i>
              {{ $t('Clear filters') }}
            </span>
          </h4>
          <div class="filter-section-main">
            <h4
              class="filter-heading toggleIcon"
              v-if="products.length && categories.length > 1"
              @click="filterRef"
            >
              Categories
            </h4>
            <div
              v-if="products.length && categories.length > 1"
              class="filter-div filter-open categories"
              :class="[
                {
                  'filter-options': showFilterExpander(),
                  'filter-expanded': filterExpand
                }
              ]"
              :style="{ 'max-height': setMaxHeight }"
            >
              <div
                context="category"
                class="filter-label"
                v-for="(single, indexSingle) in categories"
                :key="indexSingle"
              >
                <span
                  class="filter-label"
                  @click="toggleCategory(single.category_id)"
                >
                  <span
                    :code="single.category_id"
                    :codeSingle="single.category_id"
                  >{{ single.name }}</span
                  >
                </span>
              </div>
              <div class="filter-expander" v-show="showFilterExpander()">
                <span class="filter-expand" @click="filterExpander()">
                  <div class="plus-minus">
                    <div class="horizontal" />
                    <div class="vertical" />
                  </div>
                  <span class="label">{{ filterExpanderMessage }}</span>
                </span>
              </div>
            </div>
          </div>
          <div
            class="filter-section-main filter-price-main"
            v-if="!getNoResultsMessage"
          >
            <h4
              class="filter-heading price-filter-heading toggleIcon"
              @click="priceRef"
            >
              Price
            </h4>
            <div
              class="filter-div filter-open"
              v-if="updateFilter"
              ref="priceMain"
            >
              <price-slider
                context="category"
                code="price"
                id="price"
                ref="priceRef"
                :price-range="[minPriceValOri, maxPriceValOri]"
                content="Price "
                label="Price Label"
                @change="changePriceFilter"
              />
            </div>
          </div>
        </div>
        <div class="col-md-9 search-listing">
          <product-listing :columns="defaultColumn" :products="products" />
        </div>
      </div>
    </div>
    <transition name="fade">
      <div
        v-if="getNoResultsMessage"
        class="no-results relative center-xs h4 col-md-12"
      >
        {{ $t(getNoResultsMessage) }}
      </div>
    </transition>
    <div
      v-if="products.length >= 52"
      class="buttons-set align-center py35 mt20 px40"
    >
      <button
        @click="seeMore"
        v-if="readMore"
        class="no-outline brdr-none py15 px20 bg-cl-mine-shaft :bg-cl-th-secondary cl-white fs-medium-small seemore-search"
        type="button"
      >
        {{ $t('Load more') }}
      </button>
    </div>
  </div>
</template>
<script>
import ProductListing from '../components/core/ProductListing.vue';
import { Logger } from '@vue-storefront/core/lib/logger';
import PriceSlider from 'src/modules/vsf-l-navigation/components/FilterTypes/PriceSlider';
import { SearchQuery } from 'storefront-query-builder'
import i18n from '@vue-storefront/i18n';
import ButtonFull from 'theme/components/theme/ButtonFull.vue';
export default {
  name: 'SearchResultPage',
  data() {
    return {
      defaultColumn: 4,
      mobileFilters: false,
      selectedCategoryIds: [],
      allProducts: [],
      products: [],
      categories: [],
      limit: 10,
      filterProducts: [],
      search: '',
      size: 52,
      start: 0,
      emptyResults: false,
      readMore: true,
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
      newCategoryInsideBuild: [],
      updateFilter: false,
      filterApplied: [],
      minPriceValOri: 0,
      maxPriceValOri: 0,
      allFiterFinalArray: [],
      filterExpand: false
    };
  },
  components: {
    ProductListing,
    PriceSlider,
    ButtonFull
  },
  computed: {
    searchUrl() {
      const urlQueryConst = this.$route.query.s;
      return urlQueryConst;
    },
    getNoResultsMessage() {
      let msg = '';
      if (this.emptyResults) {
        msg = 'No results were found.';
      }
      if (this.search === '') {
        msg = 'Please enter the search text.';
      }
      return msg;
    },
    remainingFilterOptions() {
      return this.categories.length - this.limit;
    },
    filterExpanderMessage() {
      return this.filterExpand
        ? i18n.t('Show less filter options')
        : i18n.t('Show more filter options', {
          remainingFilterOptions: this.remainingFilterOptions
        });
    },
    setMaxHeight() {
      return !this.filterExpand
        ? 30 * this.limit + 'px'
        : 30 * this.categories.length + 'px';
    }
  },
  methods: {
    showFilterExpander() {
      return this.categories.length > this.limit;
    },
    filterExpander() {
      this.filterExpand = !this.filterExpand;
    },
    filterRef(event) {
      event.target.classList.toggle('toggleIcon');
      event.target.nextElementSibling.classList.toggle('filter-open');
    },
    priceRef() {
      event.target.classList.toggle('toggleIcon');
      this.$refs.priceMain.classList.toggle('filter-open');
    },
    priceRefMobile() {
      event.target.classList.toggle('toggleIcon');
      this.$refs.priceMainMobile.classList.toggle('filter-open');
    },
    filter_array_values(arr) {
      arr = arr.filter(this.isEligible);
      return arr;
    },
    openFilters() {
      this.$refs.mobileFiltersRef.classList.add('openMobileFilters');
      this.updateFilter = false;
      setTimeout(() => {
        this.updateFilter = true;
      }, 100);
    },
    closeFilters() {
      this.$refs.mobileFiltersRef.classList.remove('openMobileFilters');
    },
    resetAllFilters() {
      console.log('resetAllFilters');
      this.selectedCategoryIds = [];
      this.styleArray = [];
      this.colorArray = [];
      this.minPriceVal = this.minPriceValOri;
      this.maxPriceVal = this.maxPriceValOri;
      this.updateFilter = false;
      this.customSearch();
      var activeFilters = document.querySelectorAll('.active-filter');
      if (activeFilters.length > 0) {
        [].forEach.call(activeFilters, activeFilter => {
          activeFilter.classList.remove('active-filter');
          console.log('activeFilter', activeFilter.classList);
        });
      }
      setTimeout(() => {
        this.updateFilter = true;
      }, 100);
    },

    isEligible(value) {
      return value;
    },
    buildSearchQuery(
      queryText,
      styleFilterArray = [],
      colorFilterArray = [],
      minPriceAvailable = 0,
      maxPriceAvailable = 0,
      selectedCategoryIds = []
    ) {
      if (maxPriceAvailable > 0) {
        console.log('Inside buildSearchQuery', selectedCategoryIds);
        const rangeqr = {};
        rangeqr['gte'] = minPriceAvailable - 1;
        rangeqr['lte'] = maxPriceAvailable + 1;
        let searchQuery = new SearchQuery();
        searchQuery = searchQuery
          .setSearchText(queryText)
          .applyFilter({ key: 'visibility', value: { in: [3, 4] } })
          .applyFilter({
            key: 'status',
            value: { in: [0, 1] }
          });
        if (styleFilterArray.length > 0) {
          console.log('Ifi');
          const newStyleArray = styleFilterArray.filter(item => item);
          this.newStyleInsideBuild = newStyleArray;
          searchQuery = searchQuery.applyFilter({
            key: 'style',
            value: { in: this.newStyleInsideBuild }
          });
        }
        if (colorFilterArray.length > 0) {
          const newColorArray = colorFilterArray.filter(item => item);
          this.newColorInsideBuild = newColorArray;
          searchQuery = searchQuery.applyFilter({
            key: 'color',
            value: { in: this.newColorInsideBuild }
          });
        }
        if (selectedCategoryIds.length > 0) {
          const newCategoriesArray = selectedCategoryIds.filter(item => item);
          this.newCategoryInsideBuild = newCategoriesArray;
          searchQuery = searchQuery.applyFilter({
            key: 'category_ids',
            value: { in: this.newCategoryInsideBuild }
          });
        }

        searchQuery = searchQuery.applyFilter({
          key: 'price',
          value: rangeqr,
          scope: 'catalog'
        });
        return searchQuery;
      } else {
        console.log('buildSearchQuery', selectedCategoryIds);
        let searchQuery = new SearchQuery();
        searchQuery = searchQuery
          .setSearchText(queryText)
          .applyFilter({ key: 'visibility', value: { in: [3, 4] } })
          .applyFilter({
            key: 'status',
            value: { in: [0, 1] }
          });
        return searchQuery;
      }
    },
    searchFilterQuery() {
      if (this.search !== '' && this.search !== undefined) {
        let query = this.buildSearchQuery(this.search);
        let startValue = 0;
        let priceArray = [];
        this.start = startValue;
        this.readMore = true;
        this.$store
          .dispatch('product/list', {
            query,
            start: 0,
            configuration: {},
            size: 10000,
            updateState: false
          })
          .then(resp => {
            this.allProducts = resp.items;
            const categories = resp.items
              .filter(p => p.category)
              .map(p => p.category)
              .flat();
            const discinctCategories = Array.from(
              new Set(categories.map(c => c.category_id))
            ).map(catId => categories.find(c => c.category_id === catId));

            this.categories = discinctCategories;
            const priceArray = resp.items.map(priceItem => {
              return priceItem.final_price_incl_tax;
            });
            const priceArrayFinal = priceArray.filter(priceActual => {
              return priceActual !== undefined;
            });
            const styleArrayConst = resp.items.map(styleItem => {
              return styleItem.style;
            });
            const uniqueStyle = styleArrayConst.filter(
              (v, i, a) => a.indexOf(v) === i
            );
            const uniqueStyleFinal = uniqueStyle.filter(style => {
              return style !== undefined;
            });
            const colorArrayConst = resp.items.map(colorItem => {
              return colorItem.color;
            });
            const uniqueColor = colorArrayConst.filter(
              (v, i, a) => a.indexOf(v) === i
            );
            const uniqueColorFinal = uniqueColor.filter(color => {
              return color !== undefined;
            });
            priceArrayFinal.sort((priceA, priceB) => {
              return priceA - priceB;
            });
            this.minPriceVal = parseInt(priceArrayFinal[0].toFixed());
            this.maxPriceVal = parseInt(
              priceArrayFinal[priceArrayFinal.length - 1].toFixed()
            );
            this.minPriceValOri = parseInt(priceArrayFinal[0].toFixed());
            this.maxPriceValOri = parseInt(
              priceArrayFinal[priceArrayFinal.length - 1].toFixed()
            );
            setTimeout(() => {
              this.updateFilter = true;
            }, 1000);
            this.styleArray = uniqueStyleFinal;
            this.styleArrayOri = uniqueStyleFinal;
            this.colorArray = uniqueColorFinal;
            this.colorArrayOri = uniqueColorFinal;
            this.filterProducts = resp.items;
            const allFiterFinalArrayConst = {};
            let uniqueStyleFullFinal = [];
            var i = 0;
            [].forEach.call(uniqueStyleFinal, uniqueStyleFinalSingle => {
              if (
                uniqueStyleFinalSingle != null &&
                uniqueStyleFinalSingle != undefined &&
                uniqueStyleFinalSingle != 0
              ) {
                uniqueStyleFullFinal[i] = uniqueStyleFinalSingle;
              }
              i++;
            });
            allFiterFinalArrayConst['style'] = uniqueStyleFullFinal;
            allFiterFinalArrayConst['color'] = uniqueColorFinal;

            this.allFiterFinalArray = allFiterFinalArrayConst;
          })
          .catch(err => {
            Logger.error(err, 'components-search')();
          });
        return this.filterProducts;
      } else {
        this.filterProducts = [];
        return this.filterProducts;
      }
    },
    customSearch() {
      if (this.search !== '' && this.search !== undefined) {
        let query = this.buildSearchQuery(
          this.search.toUpperCase(),
          this.styleArray,
          this.colorArray,
          this.minPriceVal,
          this.maxPriceVal,
          this.selectedCategoryIds
        );
        console.log('queryquery', query);
        let startValue = 0;
        this.start = startValue;
        this.readMore = true;
        this.$store
          .dispatch('product/list', {
            query,
            start: this.start,
            configuration: {},
            size: this.size,
            sort: this.selectSortBy,
            updateState: false
          })
          .then(resp => {
            this.products = resp.items;
            this.start = startValue + this.size;
            this.emptyResults = resp.items.length < 1;
            this.totalResults = resp.total;
          })
          .catch(err => {
            Logger.error(err, 'components-search')();
          });
      } else {
        this.products = [];
        this.emptyResults = true;
      }
    },
    seeMore() {
      if (this.search !== '' && this.search !== undefined) {
        const loadedState = document.querySelectorAll('.active-filter');

        if (loadedState.length === 0) {
          this.styleArray = [];
          this.colorArray = [];
        }
        let query = this.buildSearchQuery(
          this.search,
          this.styleArray,
          this.colorArray,
          this.minPriceVal,
          this.maxPriceVal,
          this.selectedCategoryIds
        );

        let startValue = this.start;
        this.$store
          .dispatch('product/list', {
            query,
            start: startValue,
            size: this.size,
            sort: this.selectSortBy,
            updateState: false
          })
          .then(resp => {
            let page = Math.floor(resp.total / this.size);
            let exceeed = resp.total - this.size * page;
            if (resp.start === resp.total - exceeed) {
              this.readMore = false;
            }
            this.products = this.products.concat(resp.items);
            this.start = startValue + this.size;
            this.emptyResults = this.products.length < 1;
          })
          .catch(err => {
            Logger.error(err, 'components-search')();
          });
      } else {
        this.products = [];
        this.emptyResults = 0;
      }
    },
    sortOnChange(event) {
      const loadedState = document.querySelectorAll('.active-filter');

      if (loadedState.length === 0) {
        this.styleArray = [];
        this.colorArray = [];
      }
      this.customSearch();
    },
    filterLabel() {
      event.target.classList.toggle('active-filter');
      const appliedStyleArray = [];
      const appliedColorArray = [];
      const allFilterArray = [];
      var activeFilters = document.querySelectorAll('.active-filter');

      if (activeFilters.length > 0) {
        [].forEach.call(activeFilters, activeFilter => {
          const fiterCode = activeFilter.getAttribute('code');

          if (fiterCode === 'style') {
            appliedStyleArray.push(
              parseInt(activeFilter.getAttribute('codesingle'))
            );
          } else if (fiterCode === 'color') {
            appliedColorArray.push(
              parseInt(activeFilter.getAttribute('codesingle'))
            );
          }
        });
        this.styleArray = appliedStyleArray;
        this.colorArray = appliedColorArray;
      } else {
        this.styleArray = [];
        this.colorArray = [];
      }
      this.customSearch();
    },
    toggleCategory(category) {
      event.target.classList.toggle('active-filter');
      const isCatInArray = this.selectedCategoryIds.includes(category);
      if (isCatInArray) {
        this.selectedCategoryIds = this.selectedCategoryIds.filter(
          item => item !== category
        );
      } else {
        this.selectedCategoryIds.push(category);
      }
      if (this.selectedCategoryIds.length > 0) {
        this.styleArray = [];
        this.colorArray = [];
        this.customSearch();
      } else {
        this.styleArray = [];
        this.colorArray = [];
        this.customSearch();
      }
    },
    changePriceFilter(event) {
      const priceGte = parseInt(event.from.toFixed());
      const priceLte = parseInt(event.to.toFixed());
      this.minPriceVal = priceGte;
      this.maxPriceVal = priceLte;
      this.customSearch();
    }
  },
  mounted() {
    this.search = this.$route.query.s;
    if (this.search) {
      this.customSearch();
      this.searchFilterQuery();
    }
  },
  watch: {
    searchUrl() {
      this.search = this.$route.query.s;
      this.styleArray = [];
      this.colorArray = [];
      this.allFiterFinalArray = [];
      this.minPriceVal = 0;
      this.maxPriceVal = 0;
      this.updateFilter = false;
      this.customSearch();
      this.searchFilterQuery();
    }
  }
};
</script>
<style lang="scss" scoped>
.search-page-main.container .row {
  padding: 5px 0px;
}
.search-page-main.container .row.upper-row {
  padding: 10px 0px;
  display: flex;
  -ms-flex-pack: end;
  justify-content: flex-end;
  -ms-flex-align: center;
  align-items: center;
}
.sort-by {
  display: -ms-inline-flexbox;
  display: inline-flex;
  position: relative;
  border: 1px solid #eaeaea;
  background-color: #f5f7fa;
  border-radius: 5px;
  height: 35px;
  margin-right: 1rem;
  width: 160px;
}

.sort-by select {
  font-size: 0.9325rem;
  color: #808898;
  font-family: 'open sans';
  border: none;
  width: 100%;
  border-radius: 0;
  background-color: transparent;
  margin-right: 0;
  -webkit-appearance: none;
  background: url(/assets/category-images/filter-down-arrow.png) no-repeat 100%
  100%;
  padding-left: 0.55rem;
  height: 100%;
  line-height: 2;
}
img.home-breadcrumb-icon-img {
  width: 15px;
  margin: 2.5px 2.5px 0 0;
}

.totalItems {
  color: #808898;
  font-size: 0.9325rem;
  font-family: 'open sans';
  padding-right: 8px;
  padding-left: 8px;
}
.col-md-3.search-SideBar {
  padding: 5px 0 0 0;
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
  background: #4dba87;
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
      vertical-align: text-top;
    }
  }
}
.filter-section-main {
}

h4.filter-heading {
  user-select: none;
  font-size: 0.875rem;
  color: #606060;
  font-family: 'open sans';
  font-weight: bold;
  text-transform: uppercase;
  background: url(/assets/category-images/filter-up-arrow.png) no-repeat 100%
  100%;
  height: 25px;
  border-top: 1px solid #e7e7e7;
  margin-top: 0px;
  padding-top: 20px;
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
  top: 5px;
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
}
.filter-div {
  display: none;
}

.filter-div.filter-open {
  display: block;
}
span.active-filter {
  vertical-align: text-top;
}
span.filter-label span.active-filter:before {
  background: #4f4f4f;
  border-color: #4f4f4f;
}

span.filter-label span.active-filter:after {
  content: '';
  position: absolute;
  left: 3px;
  top: 16px;
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
h4.toggleIcon {
  background: url(/assets/category-images/filter-down-arrow.png) no-repeat 100%
  100%;
}
@media (min-width: 768px) {
  .col-xs-6.filter-mobile-div {
    display: none;
  }
  .sort-by.col-xs-6 {
    width: 180px !important;
    max-width: 180px !important;
  }
}
@media (max-width: 767px) {
  .col-md-3.search-SideBar {
    padding: 0 0px;
  }
  .close-px15.absolute.w-100 {
    padding: 0 20px 0 20px !important;
  }

  .breadcrumbs span a {
    vertical-align: bottom !important;
  }
  img.home-breadcrumb-icon-img {
    float: none !important;
  }
  .col-md-3.search-SideBar.desktop-SideBar-col {
    display: none;
  }
  .totalItems {
    display: none;
  }
  .mobile-filters-button {
    display: block;
    border: 2px solid #e7e7e7;

    height: 35px;
    border-radius: 5px;
    color: #54575b;
    font-size: 0.8rem;
    font-family: 'Poppins', sans-serif;
    background: #f5f7fa
    url('/assets/category-images/category-filer-mobile-icon.png') no-repeat
    95% 55%;
    text-align: left;
    width: 100%;
    float: right;
  }
  h4.filter-heading {
    border-top: 0px solid #e7e7e7 !important;
  }
  .sort-by {
    display: block;
    border: 2px solid #e7e7e7;
    height: 35px;
    border-radius: 5px;
    color: #54575b;
    font-size: 0.8rem;
    font-family: 'Poppins', sans-serif;
    background: #f5f7fa
    url('/assets/category-images/category-filer-mobile-icon.png') no-repeat
    95% 55%;
    text-align: left;
    width: 95%;
    float: right;
    margin-right: 0;
  }
  .sort-by select {
    background: none;
  }

  .mobile-filters {
    position: fixed;
    background-color: #f2f2f2;
    z-index: 5;
    padding: 0 40px;
    left: 0;
    width: 100vw;
    height: 100vh;
    top: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: none;
    overflow: auto;
  }

  .mobile-filters.openMobileFilters {
    display: block !important;
  }

  .close-px15 {
    left: 0;
  }
  .filter-section-main {
    margin-top: 55px;
  }

  .filter-section-main.filter-price-main {
    margin-top: 0;
  }
  .filter-section-main {
    margin-top: 25px;
    padding: 0 20px 0 20px !important;
  }

  .filter-section-main.filter-price-main {
    margin-top: 0;
  }

  .sticky {
    position: sticky;
    bottom: 0;
    background-color: #f2f2f2;
    z-index: 100;
    width: 100%;
  }

  .filter-expander {
    background-color: #f2f2f2 !important;
  }
}

.filter-options {
  max-height: 300px;
  -webkit-transition: max-height 0.3s ease-in;
  -o-transition: max-height 0.3s ease-in;
  transition: max-height 0.3s ease-in;
  overflow: hidden;
  padding-bottom: 30px;
  position: relative;
}

.filter-options .filter-expander {
  height: 30px;
  width: 100%;
  position: absolute;
  bottom: 0;
  background-color: #fff;
}

.filter-options .filter-expander span {
  line-height: 30px;
  cursor: pointer;
}

.plus-minus {
  position: relative;
  display: inline-block;
  width: 10px;
  height: 10px;
  top: 0;
}

.filter-options .filter-expander span.label {
  padding-left: 5px;
  text-decoration: underline;
  font-weight: 700;
  font-size: 14px;
  color: #4dba87;
}
.plus-minus .horizontal {
  position: absolute;
  background-color: #4dba87;
  width: 10px;
  height: 2px;
  left: 50%;
  margin-left: -5px;
  top: 50%;
  margin-top: -1px;
}

.plus-minus .vertical {
  position: absolute;
  background-color: #4dba87;
  width: 2px;
  height: 10px;
  left: 50%;
  margin-left: -1px;
  top: 50%;
  margin-top: -5px;
}
.plus-minus .horizontal {
  -webkit-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  -webkit-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  transform: rotate(-90deg);
  opacity: 1;
}
.plus-minus .vertical {
  -webkit-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  -webkit-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  transform: rotate(-90deg);
}
.mobile-filters.openMobileFilters {
  display: none;
}
.mobile-filters {
  display: none;
}
.filter-expanded .horizontal {
  -webkit-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
  opacity: 0;
}

.filter-expanded .vertical {
  -webkit-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
}
.sidebar__header__clear {
  font-size: 0.8em;
  min-width: 102px;
}
</style>
