import { MutationTree } from 'vuex'
import * as types from './mutation-types'

export const mutations: MutationTree<any> = {
  [types.SET_SEARCH_REDIRECT] (state, { search_redirect }) {
    state.searchRedirectState = search_redirect
  }
}
