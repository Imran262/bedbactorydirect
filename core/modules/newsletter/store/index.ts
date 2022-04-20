import * as types from './mutation-types'
import { Module } from 'vuex'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { NewsletterState } from '../types/NewsletterState'
import { NewsletterService } from '@vue-storefront/core/data-resolver'

export const newsletterStore: Module<NewsletterState, any> = {
  namespaced: true,
  state: {
    isSubscribed: null,
    email: null
  },
  getters: {
    isSubscribed: state => state.isSubscribed,
    email: state => state.email
  },
  mutations: {
    [types.NEWSLETTER_SUBSCRIBE] (state) {
      state.isSubscribed = true
    },
    [types.NEWSLETTER_UNSUBSCRIBE] (state) {
      state.isSubscribed = false
    },
    [types.SET_EMAIL] (state, payload) {
      state.email = payload
    }
  },
  actions: {
    async status ({ commit }, email): Promise<boolean> {
      const isSubscribed = await NewsletterService.isSubscribed(email)

      if (isSubscribed) {
        commit(types.SET_EMAIL, email)
        commit(types.NEWSLETTER_SUBSCRIBE)
        console.log('subscribe',isSubscribed);
        
      } else {
        commit(types.NEWSLETTER_UNSUBSCRIBE)
        console.log('un subscribe');
      }
      console.log('return subscribe',isSubscribed)
      return isSubscribed
      
    },
    // 1st
    async subscribe ({ commit, getters, dispatch }, email): Promise<boolean> {
      console.log('Imran is here')
      // if (getters.isSubscribed){
      //   console.log('getters isSubscribed');
      //   return 
      // } 

      // 2nd subscribeResponse  is true
      const subscribeResponse = await NewsletterService.subscribe(email)
      console.log('subscribeResponse',subscribeResponse);
      
      commit(types.NEWSLETTER_SUBSCRIBE)
      commit(types.SET_EMAIL, email)
      await dispatch('storeToCache', { email })
      return subscribeResponse
    },
    async unsubscribe ({ commit, getters }, email): Promise<boolean> {
      if (!getters.isSubscribed)
      {
        console.log('!getters.isSubscribed');
        
        return
      } 

      const unsubscribeResponse = await NewsletterService.unsubscribe(email)
      commit(types.NEWSLETTER_UNSUBSCRIBE)
      console.log('unsubscribeResponse',unsubscribeResponse);
      

      return unsubscribeResponse
    },
    // 3rd email is here
    async storeToCache (context, { email }) {
      const newsletterStorage = StorageManager.get('newsletter')
      await newsletterStorage.setItem('email', email)
      console.log('newsletterStorage',newsletterStorage);
      
    }
  }
}
