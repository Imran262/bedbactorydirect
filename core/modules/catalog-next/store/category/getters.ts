import { nonReactiveState } from './index';
import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CategoryState from './CategoryState'
import { compareByLabel } from '../../helpers/categoryHelpers'
import { products } from 'config'
import FilterVariant from '../../types/FilterVariant'
import { optionLabel } from '@vue-storefront/core/modules/catalog/helpers'
import trim from 'lodash-es/trim'
import toString from 'lodash-es/toString'
import forEach from 'lodash-es/forEach'
import get from 'lodash-es/get'
import { getFiltersFromQuery } from '../../helpers/filterHelpers'
import { Category } from '../../types/Category'
import { parseCategoryPath } from '@vue-storefront/core/modules/breadcrumbs/helpers'
import { _prepareCategoryPathIds, getSearchOptionsFromRouteParams } from '../../helpers/categoryHelpers';
import { currentStoreView, removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'
import cloneDeep from 'lodash-es/cloneDeep'
import config from 'config';

function mapCategoryProducts (productsFromState, productsData) {
  return productsFromState.map(prodState => {
    if (typeof prodState === 'string') {
      const product = productsData.find(prodData => prodData.sku === prodState)
      return cloneDeep(product)
    }
    return prodState
  })
}

const getters: GetterTree<CategoryState, RootState> = {
  getCategories: (state): Category[] => Object.values(state.categoriesMap),
  getCategoriesMap: (state): { [id: string]: Category} => state.categoriesMap,
  getNotFoundCategoryIds: (state): string[] => state.notFoundCategoryIds,
  getCategoryProducts: (state) => mapCategoryProducts(state.products, nonReactiveState.products),
  getCategoryFrom: (state, getters) => (path: string = '') => {
    return getters.getCategories.find(category => (removeStoreCodeFromRoute(path) as string).replace(/^(\/)/gm, '') === category.url_path)
  },
  getCategoryByParams: (state, getters, rootState) => (
    params: { [key: string]: string } = {}
  ) => {
    const mathchedUrlCat = 
      getters.getCategories.find(category => {
        // let valueCheck = [];
        // const searchOptions = getSearchOptionsFromRouteParams(params);
        let newCatUrl = rootState.route.path.replace("/", "");
        // console.log('newCatUrl', newCatUrl)
        if(category.url_path === newCatUrl){
          return category
        }
        // forEach(searchOptions, (value, key) =>
        //   valueCheck.push(
        //     category[key] && category[key] === category[key].constructor(value)
        //   )
        // );
        // return (
        //   valueCheck.filter(check => check === true).length ===
        //   Object.keys(searchOptions).length
        // );
      }) || {};
    // console.log('hellowwwMain', hellowww)
    return mathchedUrlCat
  },
  getCurrentCategory: (state, getters, rootState, rootGetters) => {
    // console.log('Hellowww Ali', rootState.route.fullPath)
    return getters.getCategoryByParams(rootState.route.params)
  },
  getAvailableFiltersFrom: (state, getters, rootState) => (aggregations) => {
    const filters = {}
    if (aggregations) { // populate filter aggregates
      for (let attrToFilter of products.defaultFilters) { // fill out the filter options
        let filterOptions: FilterVariant[] = []

        let uniqueFilterValues = new Set<string>()
        if (attrToFilter !== 'price') {
          if (aggregations['agg_terms_' + attrToFilter]) {
            let buckets = aggregations['agg_terms_' + attrToFilter].buckets
            if (aggregations['agg_terms_' + attrToFilter + '_options']) {
              buckets = buckets.concat(aggregations['agg_terms_' + attrToFilter + '_options'].buckets)
            }

            for (let option of buckets) {
              uniqueFilterValues.add(toString(option.key + '::' + option.doc_count))
            }
          }

          uniqueFilterValues.forEach(key => {
            const filterCount = key.split('::');
            const filterCountIndex = filterCount[1];
            const filterKeyIndex = filterCount[0];

            const label = optionLabel(rootState.attribute, {attributeKey: attrToFilter, optionId: filterKeyIndex})
            if (trim(label) !== '') { // is there any situation when label could be empty and we should still support it?
              filterOptions.push({
                id: filterKeyIndex,
                label: label,
                type: attrToFilter,
                count: filterCountIndex
              })
            }
          });
          filters[attrToFilter] = filterOptions.sort(compareByLabel)
        } else { // special case is range filter for prices
          const currencySign = currentStoreView().i18n.currencySign

          if (aggregations['agg_range_' + attrToFilter]) {
            let index = 0
            let count = aggregations['agg_range_' + attrToFilter].buckets.length
            for (let option of aggregations['agg_range_' + attrToFilter].buckets) {
              filterOptions.push({
                id: option.key,
                type: attrToFilter,
                count: '',
                from: option.from,
                to: option.to,
                label: (index === 0 || (index === count - 1)) ? (option.to ? '< ' + currencySign + option.to : '> ' + currencySign + option.from) : currencySign + option.from + (option.to ? ' - ' + option.to : ''), // TODO: add better way for formatting, extract currency sign
                single: true
              })
              index++
            }
            filters[attrToFilter] = filterOptions
          }
        }
      }
      // Add sort to available filters
      let variants = []
      Object.keys(products.sortByAttributes).map(label => {
        variants.push({
          label: label,
          id: products.sortByAttributes[label],
          type: 'sort'
        })
      })
      filters['sort'] = variants
    }
    return filters
  },
  getFiltersMap: state => state.filtersMap,
  getAvailableFilters: (state, getters) => {
    const categoryId = get(getters.getCurrentCategory, 'id', null)
    const availableFiltersCustom = state.filtersMap[categoryId];
    for (var filterProperty in availableFiltersCustom) {
      if(filterProperty === 'filter_size.keyword'){
        var reference_array = ["S", "M", "L", "XL", "XXL"];
        availableFiltersCustom[filterProperty].sort(function(a, b) {
          return reference_array.indexOf(a.id) - reference_array.indexOf(b.id);
        });
      } else if(filterProperty === 'filter_thickness.keyword'){
        var reference_thickness_array = ["2-4", "4-6", "6-8", "8-10", "10-12", "other"];
        availableFiltersCustom[filterProperty].sort(function(a, b) {
          return reference_thickness_array.indexOf(a.id) - reference_thickness_array.indexOf(b.id);
        });
      }
    }
    return availableFiltersCustom || {}
  },
  getCurrentFiltersFrom: (state, getters, rootState) => (filters, categoryFilters) => {
    const currentQuery = filters || rootState.route[products.routerFiltersSource]
    const availableFilters = categoryFilters || getters.getAvailableFilters
    return getFiltersFromQuery({ availableFilters, filtersQuery: currentQuery })
  },
  getCurrentSearchQuery: (state, getters, rootState) => getters.getCurrentFiltersFrom(rootState.route[products.routerFiltersSource]),
  getCurrentFilters: (state, getters) => getters.getCurrentSearchQuery.filters,
  hasActiveFilters: (state, getters) => !!Object.keys(getters.getCurrentFilters).length,
  getSystemFilterNames: () => products.systemFilterNames,
  getBreadcrumbs: (state, getters) => getters.getBreadcrumbsFor(getters.getCurrentCategory),
  getBreadcrumbsFor: (state, getters) => category => {
    if (!category) return []
    const categoryHierarchyIds = _prepareCategoryPathIds(category)
    let resultCategoryList = categoryHierarchyIds.map(categoryId => {
      return getters.getCategoriesMap[categoryId]
    }).filter(c => !!c)
    return parseCategoryPath(resultCategoryList)
  },
  getCategorySearchProductsStats: state => state.searchProductsStats || {},
  getCategoryProductsTotal: (state, getters) => {
    const { total } = getters.getCategorySearchProductsStats
    const totalValue = typeof total === 'object' ? total.value : total

    return totalValue || 0
  },
  getMenuCategories (state, getters, rootState, rootGetters) {
    return state.menuCategories || rootGetters['category/getCategories']
  }
}

export default getters
