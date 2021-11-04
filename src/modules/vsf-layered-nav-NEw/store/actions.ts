import { ActionTree } from 'vuex'
import { ExtendedCatalogState } from '../types/ExtendedCatalogState'
import FilterVariant from '../types/FilterVariant'
import { quickSearchByQuery } from '@vue-storefront/core/lib/search'
import { buildFilterProductsQuery, changeFilterQuery } from '../helpers'
import omit from 'lodash-es/omit'
import isEmpty from 'lodash-es/isEmpty'
import cloneDeep from 'lodash-es/cloneDeep'
import { products, entities } from 'config'
import config from 'config'
import has from 'lodash-es/has'
import * as types from './mutation-types'
import fetch from 'isomorphic-fetch';
import * as coretypes from '@vue-storefront/core/modules/catalog-next/store/category/mutation-types'
import { router } from '@vue-storefront/core/app'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { isServer } from '@vue-storefront/core/helpers'

const BR_AUTO_SUGGEST_API_URL = config.bloomreach.brAutosuggest.endpoint ? config.bloomreach.brAutosuggest.endpoint : '';
const account_id = config.bloomreach.brAutosuggest.parameters.account_id ? config.bloomreach.brAutosuggest.parameters.account_id : '';
const auth_key = config.bloomreach.brAutosuggest.parameters.auth_key ? config.bloomreach.brAutosuggest.parameters.auth_key : '';
const domain_key = config.bloomreach.brAutosuggest.parameters.domain_key ? config.bloomreach.brAutosuggest.parameters.domain_key : '';
const domain_key_category = config.bloomreach.brAutosuggest.categoryParams.domain_key ? config.bloomreach.brAutosuggest.categoryParams.domain_key : '';
const view_id = config.bloomreach.viewId ? config.bloomreach.viewId : '';
const request_id = config.bloomreach.brAutosuggest.parameters.request_id ? config.bloomreach.brAutosuggest.parameters.request_id : '';
const _br_uid_2 = config.bloomreach.brAutosuggest.parameters._br_uid_2 ? config.bloomreach.brAutosuggest.parameters._br_uid_2 : '';
const url = config.bloomreach.brAutosuggest.parameters.url ? config.bloomreach.brAutosuggest.parameters.url : '';
const ref_url = config.bloomreach.brAutosuggest.parameters.ref_url ? config.bloomreach.brAutosuggest.parameters.ref_url : '';
const request_type = config.bloomreach.brAutosuggest.parameters.request_type ? config.bloomreach.brAutosuggest.parameters.request_type : '';
const rows = config.bloomreach.brAutosuggest.parameters.rows ? config.bloomreach.brAutosuggest.parameters.rows : '';
const rows_category = config.bloomreach.brAutosuggest.categoryParams.rows ? config.bloomreach.brAutosuggest.categoryParams.rows : '';
const startv = config.bloomreach.brAutosuggest.parameters.start ? config.bloomreach.brAutosuggest.parameters.start : 0;
const fl = config.bloomreach.brAutosuggest.parameters.fl ? config.bloomreach.brAutosuggest.parameters.fl : '';
const search_type = config.bloomreach.brAutosuggest.parameters.search_type ? config.bloomreach.brAutosuggest.parameters.search_type : '';
const search_type_category = config.bloomreach.brAutosuggest.categoryParams.search_type ? config.bloomreach.brAutosuggest.categoryParams.search_type : '';
const domain_prefix = config.bloomreach.prefix ? config.bloomreach.prefix : 0
const facetsFieldsArray = config.bloomreach.brAutosuggest.facetsFields ? config.bloomreach.brAutosuggest.facetsFields : ['price', 'Colour', 'Finish', 'Material', 'Size', 'Special Features', 'Stock Status', 'Type', 'Height', 'thickness', 'Width']
export const actions: ActionTree<ExtendedCatalogState, any> = {
  async loadCategoryProducts ({ commit, getters, rootGetters, dispatch }, {
    route,
    category,
    pageSize = 50,
    startIndex = 0
  } = {}) {
    const searchCategory = category || getters.getCategoryFrom(route.path) || {}
    const categoryMappedFilters = getters.getFiltersMap[searchCategory.id]
    const areFiltersInQuery = !!Object.keys(route[products.routerFiltersSource]).length
    if (!categoryMappedFilters && areFiltersInQuery) { // loading all filters only when some filters are currently chosen and category has no available filters yet
      await dispatch('loadCategoryFilters', searchCategory)
    }
    let filterQueryStringDyn = '';
    let keyOffiltersArrayManage = [];
    let filtersArrayManage = route.query;
    if (filtersArrayManage) {
      keyOffiltersArrayManage = Object.keys(filtersArrayManage);
    }
    let getScrollPosition = rootGetters && rootGetters['url/getCurrentRoute'] && rootGetters['url/getCurrentRoute'].scrollPosition && rootGetters['url/getCurrentRoute'].scrollPosition.y ? rootGetters['url/getCurrentRoute'].scrollPosition.y : 0

    // console.log('searchCategory - searchCategory', searchCategory)
    // console.log('topLevelCategoryPosition', localStorage.getItem('topLevelCategoryPosition'))
    // console.log('scrolledUptoPage', localStorage.getItem('scrolledUptoPage'))
    // console.log('getScrollPosition - getScrollPosition', getScrollPosition)
    let newRows = rows;
    if (getScrollPosition === undefined || getScrollPosition === 'undefined' || getScrollPosition !== 0) {
      // console.log('First COnsole')
      newRows = rows * parseInt(localStorage.getItem('scrolledUptoPage'))
    } else if (!isServer && localStorage.getItem('topLevelCategoryPosition') && localStorage.getItem('topLevelCategoryPosition') !== 'null' && localStorage.getItem('topLevelCategoryPosition') === searchCategory.slug) {
      // console.log('Second COnsole')
      newRows = rows * parseInt(localStorage.getItem('scrolledUptoPage'))
    } else {
      // console.log('else COnsole')
      newRows = rows
    }
    // console.log('newRowsnewRows', newRows)
    if (isNaN(newRows)) {
      newRows = 12
    }
    let sortStringDyn = '';
    let sortStringObjId = '';
    if (filtersArrayManage && filtersArrayManage.sort && filtersArrayManage.sort !== 'total_revenue:desc') {
      if (!(filtersArrayManage.sort.includes(':'))) {
        sortStringObjId = filtersArrayManage.sort + ':asc'
      } else {
        sortStringObjId = filtersArrayManage.sort
      }
      sortStringDyn = '&sort=' + sortStringObjId.replace(':', '+')
    }
    // console.log('sortStringDyn', sortStringDyn)
    if (keyOffiltersArrayManage.length > 0) {
      for (var key in filtersArrayManage) {
        if (facetsFieldsArray.includes(key) && key !== 'sort') {
          filterQueryStringDyn = filterQueryStringDyn + '&fq=' + key + ':';
          if (!filtersArrayManage.hasOwnProperty(key)) continue;
          let obj = filtersArrayManage[key];
          let objaRRAY = []
          if ((key === 'Width' || key === 'Height') && Array.isArray(obj)) {
            objaRRAY = obj[0].split(',')
          } else {
            objaRRAY = obj.split(',')
          }
          objaRRAY.forEach((element, index) => {
            if (index > 0) {
              filterQueryStringDyn = filterQueryStringDyn + 'OR"' + element + '"'
            } else {
              if (key === 'price' || key === 'Width' || key === 'Height') {
                element = element.split('-').join(' TO ')
                filterQueryStringDyn = filterQueryStringDyn + '[' + element + ']'
              } else {
                filterQueryStringDyn = filterQueryStringDyn + '"' + encodeURIComponent(element) + '"'
              }
            }
          });
        }
      }
    } else {
      filterQueryStringDyn = '';
    }
    let searchCategory_id = domain_prefix + searchCategory.id;
    let filteredFacetINtersectionArray = []
    filteredFacetINtersectionArray = Object.keys(route.query).filter(value => facetsFieldsArray.includes(value));
    if (route && route.fullPath && filteredFacetINtersectionArray.length === 0) {
      let BR_AUTO_SUGGEST_API_Dynamic = BR_AUTO_SUGGEST_API_URL + 'account_id=' + account_id + '&auth_key=' + auth_key + '&view_id=' + view_id + '&domain_key=' + domain_key_category + '&request_id=' + request_id + '&_br_uid_2=' + _br_uid_2 + '&url=' + url + '&ref_url=' + ref_url + '&request_type=' + request_type + '&rows=' + rows_category + '&start=' + startv + '&fl=' + fl + '&q=' + searchCategory.id + '&search_type=' + search_type_category + sortStringDyn
      const response = await fetch(
        `${BR_AUTO_SUGGEST_API_Dynamic}`,
        {
          method: 'get',
          mode: 'cors',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        }
      );
      const jsonRes = await response.json();
      if (jsonRes && jsonRes !== '') {
        commit(types.SET_CATEGORY_RANGE_CURRENT_CATEGORY, { category_range: jsonRes })
      }
    }

    let BR_CATEGORY_PRODUCTS_API_Dynamic = BR_AUTO_SUGGEST_API_URL + 'account_id=' + account_id + '&auth_key=' + auth_key + '&domain_key=' + domain_key + '&request_id=' + request_id + '&_br_uid_2=' + _br_uid_2 + '&url=' + url + '&ref_url=' + ref_url + '&view_id=' + view_id + '&request_type=' + request_type + '&rows=' + newRows + '&start=' + startv + '&fl=' + fl + '&q=' + searchCategory.id + '&search_type=category' + filterQueryStringDyn + sortStringDyn + '&stats.field=price,width,height'

    const catProductsResponse = await fetch(
      `${BR_CATEGORY_PRODUCTS_API_Dynamic}`,
      {
        method: 'get',
        mode: 'cors',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      }
    );
    const jsoncatProductsResponse = await catProductsResponse.json();
    if (jsoncatProductsResponse && jsoncatProductsResponse !== '') {
      commit(types.SET_LISTING_RANGE_CURRENT_CATEGORY, { listing_range: jsoncatProductsResponse })
      if (!Object.keys(route.query).includes('price')) {
        commit(types.SET_UPDATED_PRICE_SLIDER_RANGE_CURRENT_CATEGORY, {
          category: searchCategory,
          updatedPriceSliderRange: jsoncatProductsResponse.stats.stats_fields.price
        })
      }
    }
    if (route.query && Object.keys(route.query).includes('price') && (getters.getUpdatedPriceSliderRange.length == 0)) {
      let newArr = Object.keys(route.query)
      let newArr2 = newArr.filter((value, index) => value !== 'price')
      let newFiltersArrayManage = route.query
      let newFilterQueryStringDyn = ''
      if (newArr2.length > 0) {
        for (var key in newFiltersArrayManage) {
          if (facetsFieldsArray.includes(key) && key !== 'price' && key !== 'sort') {
            newFilterQueryStringDyn = newFilterQueryStringDyn + '&fq=' + key + ':';
            if (!newFiltersArrayManage.hasOwnProperty(key)) continue;
            let obj = newFiltersArrayManage[key];
            let objaRRAY = obj.split(',')
            objaRRAY.forEach((element, index) => {
              if (index > 0) {
                newFilterQueryStringDyn = newFilterQueryStringDyn + 'OR"' + element + '"'
              } else {
                if (key === 'Width' || key === 'Height') {
                  element = element.split('-').join(' TO ')
                  filterQueryStringDyn = filterQueryStringDyn + '[' + element + ']'
                } else {
                  filterQueryStringDyn = filterQueryStringDyn + '"' + element + '"'
                }
              }
            });
          }
        }

        let NEW_BR_CATEGORY_PRODUCTS_API_Dynamic = BR_AUTO_SUGGEST_API_URL + 'account_id=' + account_id + '&auth_key=' + auth_key + '&domain_key=' + domain_key + '&request_id=' + request_id + '&_br_uid_2=' + _br_uid_2 + '&url=' + url + '&ref_url=' + ref_url + '&view_id=' + view_id + '&request_type=' + request_type + '&rows=' + newRows + '&start=' + startv + '&fl=' + fl + '&q=' + searchCategory.id + '&search_type=category' + newFilterQueryStringDyn + '&stats.field=price'

        const newCatProductsResponse = await fetch(
          `${NEW_BR_CATEGORY_PRODUCTS_API_Dynamic}`,
          {
            method: 'get',
            mode: 'cors',
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          }
        );
        const newJsoncatProductsResponse = await newCatProductsResponse.json();
        if (newJsoncatProductsResponse && newJsoncatProductsResponse !== '') {
          commit(types.SET_UPDATED_PRICE_SLIDER_RANGE_CURRENT_CATEGORY, {
            category: searchCategory,
            updatedPriceSliderRange: newJsoncatProductsResponse.stats.stats_fields.price
          })
        }
      }
    }
    if (Object.keys(route.query).includes('price') && Object.keys(route.query).length === 1) {
      let NEW_BR_CATEGORY_PRODUCTS_API_Dynamic = BR_AUTO_SUGGEST_API_URL + 'account_id=' + account_id + '&auth_key=' + auth_key + '&domain_key=' + domain_key + '&request_id=' + request_id + '&_br_uid_2=' + _br_uid_2 + '&url=' + url + '&ref_url=' + ref_url + '&view_id=' + view_id + '&request_type=' + request_type + '&rows=' + rows + '&start=' + startv + '&fl=' + fl + '&q=' + searchCategory.id + '&search_type=category' + '&stats.field=price'
      const newCatProductsResponse = await fetch(
        `${NEW_BR_CATEGORY_PRODUCTS_API_Dynamic}`,
        {
          method: 'get',
          mode: 'cors',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        }
      );
      const newJsoncatProductsResponse = await newCatProductsResponse.json();
      if (newJsoncatProductsResponse && newJsoncatProductsResponse !== '') {
        commit(types.SET_UPDATED_PRICE_SLIDER_RANGE_CURRENT_CATEGORY, {
          category: searchCategory,
          updatedPriceSliderRange: newJsoncatProductsResponse.stats.stats_fields.price
        })
      }
    }
    const searchQuery = getters.getCurrentFiltersFrom(route[products.routerFiltersSource], categoryMappedFilters)
    let filterQr = buildFilterProductsQuery(searchCategory, searchQuery.filters)
    const { items, perPage, start, total, aggregations } = await quickSearchByQuery({
      query: filterQr,
      sort: searchQuery.sort || `${products.defaultSortBy.attribute}:${products.defaultSortBy.order}`,
      includeFields: entities.productList.includeFields,
      excludeFields: entities.productList.excludeFields,
      size: pageSize,
      start: startIndex
    })
    if (!getters.getStatsFields || (getters.getStatsFields && !getters.getStatsFields[searchCategory.id])) {
      let BR_CATEGORY_STATS_API_Dynamic = BR_AUTO_SUGGEST_API_URL + 'account_id=' + account_id + '&auth_key=' + auth_key + '&domain_key=' + domain_key + '&request_id=' + request_id + '&_br_uid_2=' + _br_uid_2 + '&url=' + url + '&ref_url=' + ref_url + '&view_id=' + view_id + '&request_type=' + request_type + '&rows=' + newRows + '&start=' + startv + '&fl=' + fl + '&q=' + searchCategory.id + '&search_type=category' + '&stats.field=price,width,height'
      const catStatsResponse = await fetch(
        `${BR_CATEGORY_STATS_API_Dynamic}`,
        {
          method: 'get',
          mode: 'cors',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        }
      );
      const jsoncatStatsResponse = await catStatsResponse.json();
      if (jsoncatStatsResponse && jsoncatStatsResponse !== '') {
        commit(types.SET_STATS_RANGE_CURRENT_CATEGORY, {
          category: searchCategory,
          stats_fields: jsoncatStatsResponse.stats.stats_fields
        })
      }
    }
    const allItemsFOrPrice = await quickSearchByQuery({
      query: filterQr,
      sort:
        searchQuery.sort ||
        `${products.defaultSortBy.attribute}:${products.defaultSortBy.order}`,
      includeFields: entities.productList.includeFields,
      excludeFields: entities.productList.excludeFields,
      size: 5000
    });

    const categoryPriceRange = getters.getPriceRange
    let price_range
    if (!has(categoryPriceRange, searchCategory.id)) {
      let BR_CATEGORY_PRICE_API_Dynamic = BR_AUTO_SUGGEST_API_URL + 'account_id=' + account_id + '&auth_key=' + auth_key + '&domain_key=' + domain_key + '&request_id=' + request_id + '&_br_uid_2=' + _br_uid_2 + '&url=' + url + '&ref_url=' + ref_url + '&view_id=' + view_id + '&request_type=' + request_type + '&rows=' + newRows + '&start=' + startv + '&fl=' + fl + '&q=' + searchCategory.id + '&search_type=category' + '&stats.field=price'

      const catPriceResponse = await fetch(
        `${BR_CATEGORY_PRICE_API_Dynamic}`,
        {
          method: 'get',
          mode: 'cors',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        }
      );
      const jsoncatPriceResponse = await catPriceResponse.json();
      if (jsoncatPriceResponse && jsoncatPriceResponse !== '') {
        price_range = [Math.floor(jsoncatPriceResponse.stats.stats_fields.price['min']), Math.ceil(jsoncatPriceResponse.stats.stats_fields.price['max'])]
        commit(types.SET_PRICE_RANGE_CURRENT_CATEGORY, { category: searchCategory, price_range: price_range })
      }
    } else {
      const categoryPriceRangeState = getters.getPriceRange[searchCategory.id]
      price_range = [Math.min(categoryPriceRangeState[0]), Math.max(categoryPriceRangeState[1])]
    }

    await dispatch('loadAvailableFiltersFrom', {
      aggregations,
      category: searchCategory,
      price_range,
      filters: searchQuery.filters
    })
    commit(coretypes.CATEGORY_SET_SEARCH_PRODUCTS_STATS, { perPage, start, total })
    const configuredProducts = await dispatch('processCategoryProducts', {
      products: items,
      filters: searchQuery.filters
    })
    commit(coretypes.CATEGORY_SET_PRODUCTS, configuredProducts)

    return items
  },
  async loadAvailableFiltersFrom ({ commit, getters }, { aggregations, category, price_range, filters = {} }) {
    const aggregationFilters = getters.getAvailableFiltersFrom(aggregations)
    const currentCategory = category || getters.getCurrentCategory
    const categoryMappedFilters = getters.getFiltersMap[currentCategory.id]
    let resultFilters = aggregationFilters
    const filtersKeys = Object.keys(filters)
    if (categoryMappedFilters && filtersKeys.length) {
      resultFilters = Object.assign(cloneDeep(categoryMappedFilters), cloneDeep(omit(aggregationFilters, filtersKeys)))
    }
    if (resultFilters.hasOwnProperty('price')) {
      resultFilters.price = price_range
    }
    commit(coretypes.CATEGORY_SET_CATEGORY_FILTERS, { category, filters: resultFilters })
  },
  async switchSearchFilters ({ dispatch }, filterVariants: FilterVariant[] = []) {
    let currentQuery = router.currentRoute[products.routerFiltersSource]
    const filterVariantsCustom = [];
    filterVariants.forEach(filterVariant => {
      if (filterVariant.id === 'Floor' || filterVariant.id === 'Wall') {
        filterVariantsCustom.push(filterVariant);
        filterVariantsCustom.push({ count: '286', id: 'Both', label: 'Both', type: 'filter_type.keyword' });
      } else {
        filterVariantsCustom.push(filterVariant);
      }
    })
    filterVariantsCustom.forEach(filterVariant => {
      currentQuery = changeFilterQuery({ currentQuery, filterVariant })
    })

    await dispatch('changeRouterFilterParameters', currentQuery)
  },
  async resetSearchFilters ({ dispatch }) {
    await dispatch('changeRouterFilterParameters', {})
    EventBus.$emit('reset-filters')
  }
}
