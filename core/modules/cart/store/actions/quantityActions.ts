import * as types from '@vue-storefront/core/modules/cart/store/mutation-types'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { Logger } from '@vue-storefront/core/lib/logger'
import { createDiffLog } from '@vue-storefront/core/modules/cart/helpers'

const quantityActions = {
  async restoreQuantity ({ dispatch }, { product }) {
    const currentCartItem = await dispatch('getItem', { product })
    if (currentCartItem) {
      Logger.log('Restoring qty after error' + product.sku + currentCartItem.prev_qty, 'cart')()
      if (currentCartItem.prev_qty > 0) {
        await dispatch('updateItem', {
          product: {
            ...product,
            qty: currentCartItem.prev_qty
          }
        })
        EventBus.$emit('cart-after-itemchanged', { item: currentCartItem })
      } else {
        await dispatch('removeItem', { product: currentCartItem, removeByParentSku: false })
      }
    }
  },
  async updateQuantity ({ commit, dispatch, getters }, { product, qty, itemId = null, forceServerSilence = false }) {

    commit(types.CART_UPD_ITEM, { product, qty, itemId })

    if (!product.server_item_id && itemId != null) {
      product.server_item_id = itemId
    }
    console.log('getters.isCartSyncEnabled', getters.isCartSyncEnabled, product.server_item_id, !forceServerSilence)
    if (getters.isCartSyncEnabled && (product.server_item_id || parseInt(itemId)) && !forceServerSilence) {
      console.log('whyNotInIfCondition', product, {
        id: product.id,
        totals: product.totals,
        item_id: product.totals ? product.totals.item_id : false,
        sku: product.sku,
        customItemId: itemId,
        server_item_id: product.server_item_id,
        product
      });
      return dispatch('sync', { forceClientState: true })
    }

    return createDiffLog()
      .pushClientParty({ status: 'wrong-qty', sku: product.sku, 'client-qty': qty })
  }
}

export default quantityActions
