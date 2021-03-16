import { Module } from 'vuex'
import GoogleTagManagerState from '../types/GoogleTagManagerState'
import { mutations } from './mutations';
import { getters } from './getters';
import { state } from './state';
// import { actions } from './actions';

export const googleTagManagerModule: Module<GoogleTagManagerState, any> = {
  namespaced: true,
  mutations,
  getters,
  state
}
