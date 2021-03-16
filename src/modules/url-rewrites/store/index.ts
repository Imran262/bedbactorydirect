import RootState from '@vue-storefront/core/types/RootState'
import UrlRewritesState from '../types/UrlRewritesState'
import { Module } from 'vuex'
import actions from './actions'
import mutations from './mutations'

export const module: Module<UrlRewritesState, RootState> = {
  namespaced: true,
  state: {
    urlRewrites: {}
  },
  actions,
  mutations
}