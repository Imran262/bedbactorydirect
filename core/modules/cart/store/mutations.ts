import Vue from 'vue'
import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import CartState from '../types/CartState'
import config from 'config'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import productsEquals from './../helpers/productsEquals'

const mutations: MutationTree<CartState> = {
  /**
   * Add product to cart
   * @param {Object} product data format for products is described in /doc/ElasticSearch data formats.md
   */
  [types.CART_ADD_ITEM] (state, { product }) {
    const record = state.cartItems.find(p => {
      return productsEquals(p, product);
    })
    console.log('AddItemsToCart_CART_ADD_ITEM', state.cartItems, record, { id: product.id, sku: product.sku, name: product.name })
    if (!record) {
      let item = {
        ...product,
        qty: parseInt(product.qty ? product.qty : 1)
      }
      EventBus.$emit('cart-before-add', { product: item })
      state.cartItems.push(item)
    } else {
      EventBus.$emit('cart-before-update', { product: record })
      //A small fix for CutSample, If any of the Sample is replaced no need to merge up the quantity.
      if (record.totals && record.totals.options && record.totals.options.length > 0 && record.totals.options[0].label && record.totals.options[0].label === 'Sample') {
        record.totals.options = [];
        if (product.qty && product.qty === 1) {
          record.qty = -1;
        } else {
          record.qty = parseInt((product.qty ? product.qty : 1));
        }
      } else {
        record.qty += parseInt((product.qty ? product.qty : 1))
      }
    }
  },
  [types.CART_SET_ITEMS_HASH] (state, hash = null) {
    state.cartItemsHash = hash
  },
  [types.CART_SET_SYNC] (state) {
    state.cartServerLastSyncDate = new Date().getTime()
  },
  [types.CART_SET_TOTALS_SYNC] (state) {
    state.cartServerLastTotalsSyncDate = new Date().getTime()
  },
  [types.CART_DEL_ITEM] (state, { product, removeByParentSku = true, cartItemId= false }) {
    EventBus.$emit('cart-before-delete', { items: state.cartItems })

    console.log('providedCartItemIdIs', cartItemId);

    state.cartItems = state.cartItems.filter(p => {
      if(cartItemId){
        let hasCartItemIdAndMatched = cartItemId && p.totals && p.totals.item_id ? parseInt(p.totals.item_id) === parseInt(cartItemId) : false;
        console.log('canRemoveItem', (p.parentSku !== product.sku || removeByParentSku === false) && hasCartItemIdAndMatched)
        return (p.parentSku !== product.sku || removeByParentSku === false) && !hasCartItemIdAndMatched
      }

      let isProductEqual = productsEquals(p, product)

      console.log('isProductEqual', {
        p1: p.id,
        p2: product.id
      }, isProductEqual, (p.parentSku !== product.sku || removeByParentSku === false))

      return !isProductEqual && (p.parentSku !== product.sku || removeByParentSku === false)
      // console.log('isProductEqual', {
      //   p1: p.id,
      //   p2: product.id
      // }, isProductEqual, hasCartItemIdAndMatched, (p.parentSku !== product.sku || removeByParentSku === false), result)
      // console.log('p.parentSku !== product.sku', p.parentSku !== product.sku, p.parentSku, product.sku, removeByParentSku)
      // console.log('productToRemoveFromCart', { id: product.id, name: product.name, sku: product.sku }, result)
      // console.log('hasCartItemIdAndMatched', hasCartItemIdAndMatched, parseInt(cartItemId), p.totals.item_id, cartItemId === p.item_id, p);
      // console.log('responseFromProductEquals', productsEquals(p, product));
      // console.log('finalRemoveItemResponse', !productsEquals(p, product) && (p.parentSku !== product.sku || removeByParentSku === false) && hasCartItemIdAndMatched);
      // return result
    })
    EventBus.$emit('cart-after-delete', { items: state.cartItems })
  },
  [types.CART_DEL_NON_CONFIRMED_ITEM] (state, { product, removeByParentSku = true }) {
    EventBus.$emit('cart-before-delete', { items: state.cartItems })
    console.log('deleteTheNonConfirmedItem', { id: product.id, name: product.name })
    state.cartItems = state.cartItems.filter(p => (!productsEquals(p, product) && (p.parentSku !== product.sku || removeByParentSku === false)) || p.server_item_id/* it's confirmed if server_item_id is set */)
    EventBus.$emit('cart-after-delete', { items: state.cartItems })
  },
  [types.CART_UPD_ITEM] (state, { product, qty, itemId = null }) {
    if (itemId) {
      itemId = parseInt(itemId)
    }
    console.log('cartItemsCurrentlyAre', state.cartItems.map(i=>{
      return { id: i.id, name: i.name, sku: i.sku, item_id: i.totals ? i.totals.item_id : i.totals }
    }), { id: product.id, name: product.name, sku: product.sku, totals: product.totals })

    const record = state.cartItems.find(p => {
      // If we get the itemID, means we need to check for cart ItemID instead of only sku.
      if (itemId && (!product.totals || !product.totals.item_id)) {
        console.log('itemIdShouldBe', itemId);
        return itemId && p.totals && p.totals.item_id ? parseInt(p.totals.item_id) === itemId : false;
      }
      let equalEd = productsEquals(p, product)
      console.log('equaliedPr', equalEd);
      return equalEd;
    })

    if (record && itemId && record.totals && record.totals.item_id && itemId !== record.totals.item_id) {
      record.totals.item_id = itemId;
      if (record.server_item_id && record.server_item_id !== itemId) {
        record.server_item_id = itemId
      }
    }

    console.log('selectedRecordIs', record, { id: record.id, name: record.name, item_id: record.totals?.item_id });

    if (record) {
      EventBus.$emit('cart-before-update', { product: record })
      record.qty = parseInt(qty)
      EventBus.$emit('cart-after-update', { product: record })
    }
  },
  [types.CART_UPD_ITEM_PROPS] (state, { product }) {
    let record = state.cartItems.find(p => (productsEquals(p, product) || (p.server_item_id && p.server_item_id === product.server_item_id)))
    if (record) {
      EventBus.$emit('cart-before-itemchanged', { item: record })
      Object.entries(product).forEach(([key, value]) => {
        return Vue.set(record, key, value)
      })
      EventBus.$emit('cart-after-itemchanged', { item: record })
    }
  },
  [types.CART_UPD_SHIPPING] (state, shippingMethod) {
    state.shipping = shippingMethod
  },
  [types.CART_LOAD_CART] (state, storedItems) {
    state.cartItems = storedItems || []
    state.cartIsLoaded = true

    // EventBus.$emit('order/PROCESS_QUEUE', { config: config }) // process checkout queue
    EventBus.$emit('sync/PROCESS_QUEUE', { config }) // process checkout queue
    EventBus.$emit('application-after-loaded')
    EventBus.$emit('cart-after-loaded')
  },
  [types.CART_LOAD_CART_SERVER_TOKEN] (state, token) {
    state.cartServerToken = token
  },
  [types.CART_UPD_TOTALS] (state, { itemsAfterTotals, totals, platformTotalSegments }) {
    state.itemsAfterPlatformTotals = itemsAfterTotals
    state.platformTotals = totals
    state.platformTotalSegments = platformTotalSegments
    EventBus.$emit('cart-after-updatetotals', { platformTotals: totals, platformTotalSegments: platformTotalSegments })
  },
  [types.CART_UPD_PAYMENT] (state, paymentMethod) {
    state.payment = paymentMethod
  },
  [types.CART_TOGGLE_MICROCART] (state) {
    state.isMicrocartOpen = !state.isMicrocartOpen
  },
  [types.CART_UPDATE_BYPASS_COUNTER] (state, { counter }) {
    state.connectBypassCount = state.connectBypassCount + counter
  },
  [types.CART_ADDING_ITEM] (state, { isAdding }) {
    state.isAddingToCart = isAdding
  }
}

export default mutations
