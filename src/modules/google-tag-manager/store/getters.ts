import GoogleTagManagerState from '../types/GoogleTagManagerState'
import { GetterTree } from 'vuex'

export const getters: GetterTree<GoogleTagManagerState, any> = {
  home_set: state => state.home_set,
  remove_product: state => state.remove_product
}
