import { Module } from 'vuex'
import NotificationItem from '../types/NotificationItem'
import NotificationState from '../types/NotificationState'

export const notificationStore: Module<NotificationState, any> = {
  namespaced: true,
  state: {
    notifications: [],
    basketNotifications:[]
  },
  getters: {
    notifications: state => state.notifications,
    basketNotifications: state => state.basketNotifications
  },
  mutations: {
    add (state, payload) {
      state.notifications.push(payload)
    },
    remove (state, index) {
      state.notifications.splice(index, 1)
    },
    basketadd (state, payload) {
      state.basketNotifications.push(payload)
    },
    basketremove (state, index) {
      state.basketNotifications.splice(index, 1)
    }

  },
  actions: {
    spawnNotification ({ commit, state, dispatch }, notification: NotificationItem): NotificationItem {
      if (state.notifications.length > 0 &&
        state.notifications[state.notifications.length - 1].message === notification.message
      ) {
        return
      }

      const id = Math.floor(Math.random() * 100000)
      const newNotification = { id, ...notification }

      commit('add', newNotification)

      if (!newNotification.hasNoTimeout) {
        setTimeout(() => {
          dispatch('removeNotificationById', id)
        }, newNotification.timeToLive || 5000)
      }

      return newNotification
    },
    removeNotification ({ commit, state }, index?: number) {
      if (!index) {
        commit('remove', state.notifications.length - 1)
      } else {
        commit('remove', index)
      }
    },
    removeNotificationById ({ commit, state }, id: number) {
      const index = state.notifications.findIndex(notification => notification.id === id)

      if (index !== -1) {
        commit('remove', index)
      }
    },
       //// new basket 
       NewBasketNotification ({ commit, state, dispatch }, notification: NotificationItem): NotificationItem {
        if (state.basketNotifications.length > 0 &&
          state.basketNotifications[state.basketNotifications.length - 1].message === notification.message
        ) {
          return
        }
  
        const id = Math.floor(Math.random() * 100000)
        const BasketnewNotification1 = { id, ...notification }
  
        commit('basketadd', BasketnewNotification1)
  
        if (!BasketnewNotification1.hasNoTimeout) {
          setTimeout(() => {
            dispatch('removeBasketNotificationById', id)
          }, BasketnewNotification1.timeToLive || 5000)
        }
  
        return BasketnewNotification1
      },
      removeBasketNotification ({ commit, state }, index?: number) {
        if (!index) {
          commit('basketremove', state.basketNotifications.length - 1)
        } else {
          commit('basketremove', index)
        }
      },
      removeBasketNotificationById ({ commit, state }, id: number) {
        const index = state.basketNotifications.findIndex(notification => notification.id === id)
  
        if (index !== -1) {
          commit('basketremove', index)
        }
      }
  }
}
