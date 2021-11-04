import { GoogleGtagState } from '../types/GoogleGtagState'
import { GetterTree } from 'vuex'

export const getters: GetterTree<GoogleGtagState, any> = {
  product_list: state => state.product_list,
  product_current: state => state.product_current,
  product_click: state => state.product_click,
  home_click: state => state.home_click,
  product_wishlist: state => state.product_wishlist,
  product_compare: state => state.product_compare,
  cart: state => state.cart,
  other: state => state.other,
  checkout: state => state.checkout,
  checkout_option: state => state.checkout_option,
  order_details: state => state.order_details,
  promo_click: state => state.promo_click,
  promo_view: state => state.promo_view,
  success_purchase: state => state.success_purchase,
  checkout_page: state => state.checkout_page
}
