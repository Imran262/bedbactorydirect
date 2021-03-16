import { MutationTree } from 'vuex'
import * as types from './mutation-types'

export const mutations: MutationTree<any> = {
  [types.SET_PRODUCT_LIST] (state, payload) {
    state.product_list = payload
  },
  [types.SET_PRODUCT_CURRENT] (state, payload) {
    state.product_current = payload
  },
  [types.SET_PRODUCT_CLICK] (state, payload) {
    state.product_click = payload
  },
  [types.ADD_PRODUCT_WISHLIST] (state, payload) {
    state.product_wishlist = payload
  },
  [types.ADD_PRODUCT_COMPARE] (state, payload) {
    state.product_compare = payload
  },
  [types.SET_CART] (state, payload) {
    state.cart = payload
  },
  [types.SET_BEGIN_CHECKOUT] (state, payload) {
    state.checkout_begin = payload
  },
  [types.SET_CHECKOUT_STEP] (state, payload) {
    state.checkout = payload
  },
  [types.SET_CHECKOUT_OPTION] (state, payload) {
    state.checkout_option = payload
  },
  [types.SET_ORDER_DETAILS] (state, payload) {
    state.order_details = payload
  },
  [types.SET_PROMO_CLICK] (state, payload) {
    state.promo_click = payload
  },
  [types.SET_PROMO_VIEW] (state, payload) {
    state.promo_view = payload
  },
  [types.SET_SUCCESS_PURCHASE] (state, payload) {
    state.success_purchase = payload
  },
  [types.SET_HOME_CLICK] (state, payload) {
    state.home_click = payload
  },
  [types.SET_ADD_PRODUCT] (state, payload) {
    state.home_add_product = payload
  },
  [types.SET_REMOVE_PRODUCT] (state, payload) {
    state.home_remove_product = payload
  },
  [types.SET_OTHER] (state, payload) {
    state.other = payload
  },
  [types.SET_CHECKOUT_PAGE] (state, payload) {
    state.checkout_page = payload
  }
}
