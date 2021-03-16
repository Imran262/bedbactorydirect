import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import UrlRewritesState from '../types/UrlRewritesState'

const mutations: MutationTree<UrlRewritesState> = {
  [types.UPDATE_URL_REWRITES] (state, items) {
    items.forEach(item => {
      state.urlRewrites[item.request_path] = item
    })
  },
  [types.ADD_URL_REWRITE] (state, data) {
    state.urlRewrites[data.path] = data.value
  }
}

export default mutations
