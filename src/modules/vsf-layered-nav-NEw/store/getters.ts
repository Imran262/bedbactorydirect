import { ExtendedCatalogState } from '../types/ExtendedCatalogState'
import { GetterTree } from 'vuex'
import { _prepareCategoryPathIds } from '@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers';
import { getFiltersFromQuery } from '../helpers'
import { products } from 'config'

export const getters: GetterTree<ExtendedCatalogState, any> = {
  getPriceRange: state => state.priceRange,
  getCategoryRange: state => state.categoryRange,
  getListingRange: state => state.listingRange,
  getUpdatedPriceSliderRange: state => state.updatedPriceSliderRange,
  getStatsFields: state => state.stats_fields,
  getCurrentFiltersFrom: (state, getters, rootState) => (filters, categoryFilters) => {
    const currentQuery = filters || rootState.route[products.routerFiltersSource]
    const availableFilters = categoryFilters || getters.getAvailableFilters
    return getFiltersFromQuery({availableFilters, filtersQuery: currentQuery})
  }
}
