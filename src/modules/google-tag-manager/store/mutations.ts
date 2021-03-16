import { MutationTree } from 'vuex'
import * as types from './mutation-types'

export const mutations: MutationTree<any> = {
  [types.SET_HOME_PAGE] (state, payload) {
    state.home_set = payload
  },
  [types.SET_REMOVE_PRODUCT] (state, payload) {
    state.remove_product = payload
  }
}
