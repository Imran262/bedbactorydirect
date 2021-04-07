import { MutationTree } from 'vuex'
import * as types from './mutation-types'

export const mutations: MutationTree<any> = {
  [types.SET_PRICE_RANGE_CURRENT_CATEGORY] (state, {category, price_range}) {
    state.priceRange[category.id] = price_range
  },
  [types.SET_CATEGORY_RANGE_CURRENT_CATEGORY] (state, {category, category_range}) {
    state.categoryRange = category_range
  },
  [types.SET_LISTING_RANGE_CURRENT_CATEGORY] (state, {category, listing_range}) {
    state.listingRange = listing_range
  },
  [types.SET_STATS_RANGE_CURRENT_CATEGORY] (state, {category, stats_fields}) {
    state.stats_fields[category.id] = stats_fields
  }
}
