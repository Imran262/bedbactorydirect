import { Module } from 'vuex'
import { GoogleGtagState } from '../types/GoogleGtagState'
import { mutations } from './mutations'
import { state } from './state'
import { getters } from './getters'
import { actions } from './actions'

export const googleGTAGModule: Module<GoogleGtagState, any> = {
  namespaced: true,
  mutations,
  getters,
  state,
  actions
}
