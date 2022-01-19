import * as types from '@vue-storefront/core/modules/cart/store/mutation-types'
import { Logger } from '@vue-storefront/core/lib/logger'
import config from 'config'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import axios from 'axios';
import { CartService } from '@vue-storefront/core/data-resolver'
import {
  productsEquals,
  createDiffLog,
  notifications,
  createCartItemForUpdate
} from '@vue-storefront/core/modules/cart/helpers'
import CartItem from '@vue-storefront/core/modules/cart/types/CartItem';
import { cartHooksExecutors } from './../../hooks'

const mergeActions = {
  async updateClientItem({ dispatch }, { clientItem, serverItem }) {
    const cartItem = clientItem === null ? await dispatch('getItem', serverItem) : clientItem

    if (!cartItem || typeof serverItem.item_id === 'undefined') return

    const product = {
      server_item_id: serverItem.item_id,
      sku: cartItem.sku,
      server_cart_id: serverItem.quote_id,
      prev_qty: cartItem.qty,
      product_option: serverItem.product_option,
      type_id: serverItem.product_type
    }

    await dispatch('updateItem', { product })
    EventBus.$emit('cart-after-itemchanged', { item: cartItem })
  },
  async updateServerItem({ getters, rootGetters, commit, dispatch }, { clientItem, serverItem, updateIds, mergeQty }) {
    console.log('updateTheServerItem', clientItem, {
      id: clientItem.id,
      qty: clientItem.qty,
      name: clientItem.name,
      server_item_id: clientItem.server_item_id,
      totals: clientItem.totals
    }, serverItem);
    const diffLog = createDiffLog()
    const cartItem = createCartItemForUpdate(clientItem, serverItem, updateIds, mergeQty)
    console.log('updateTheServerItem', { id: cartItem, qty: cartItem.qty, server_item_id: cartItem.server_item_id });
    const event = await CartService.updateItem(getters.getCartToken, cartItem)
    const wasUpdatedSuccessfully = event.resultCode === 200
    Logger.debug('Cart item server sync' + event, 'cart')()
    diffLog.pushServerResponse({ status: event.resultCode, sku: clientItem.sku, result: event })

    if (!wasUpdatedSuccessfully && !serverItem) {
      commit(types.CART_DEL_ITEM, { product: clientItem, removeByParentSku: false })
      return diffLog
    }

    if (!wasUpdatedSuccessfully && (clientItem.server_item_id || clientItem.item_id)) {
      await dispatch('restoreQuantity', { product: clientItem })
      return diffLog
    }

    if (!wasUpdatedSuccessfully) {
      Logger.warn('Removing product from cart', 'cart', clientItem)()
      commit(types.CART_DEL_NON_CONFIRMED_ITEM, { product: clientItem })
      return diffLog
    }

    if (!rootGetters['checkout/isUserInCheckout']) {
      const isThisNewItemAddedToTheCart = (!clientItem || !clientItem.server_item_id)
      diffLog.pushNotification(
        isThisNewItemAddedToTheCart ? notifications.productAddedToCart() : notifications.productQuantityUpdated()
      )
    }

    await dispatch('updateClientItem', { clientItem, serverItem: event.result })

    return diffLog
  },
  async synchronizeServerItem({ dispatch }, { serverItem, clientItem, forceClientState, dryRun, mergeQty }) {
    const diffLog = createDiffLog()

    if (!serverItem) {
      console.log('NoServerItemHere');
      Logger.warn('No server item with sku ' + clientItem.sku + ' on stock.', 'cart')()
      diffLog.pushServerParty({ sku: clientItem.sku, status: 'no-item' })

      if (dryRun) return diffLog
      if (forceClientState || !config.cart.serverSyncCanRemoveLocalItems) {
        const updateServerItemDiffLog = await dispatch('updateServerItem', { clientItem, serverItem, updateIds: false })
        return diffLog.merge(updateServerItemDiffLog)
      }

      await dispatch('removeItem', { product: clientItem })
      return diffLog
    }

    if (serverItem.qty !== clientItem.qty || mergeQty) {
      console.log('iGotCalledInServerItem');
      Logger.log('Wrong qty for ' + clientItem.sku, clientItem.qty, serverItem.qty)()
      diffLog.pushServerParty({ sku: clientItem.sku, status: 'wrong-qty', 'client-qty': clientItem.qty, 'server-qty': serverItem.qty })
      if (dryRun) return diffLog
      if (forceClientState || !config.cart.serverSyncCanModifyLocalItems) {
        const updateServerItemDiffLog = await dispatch('updateServerItem', { clientItem, serverItem, updateIds: true, mergeQty })

        return diffLog.merge(updateServerItemDiffLog)
      }

      await dispatch('updateItem', { product: serverItem })
    }

    return diffLog
  },
  async mergeClientItem({ dispatch }, { clientItem, serverItems, forceClientState, dryRun, mergeQty }) {
    // console.log()
    const serverItem = serverItems.find(itm => {
      let equalProductServerItem = productsEquals(itm, clientItem)
      if (clientItem.sku === '005120' || itm.sku === '005120') {
        console.log('productItemEqualIsd', itm, clientItem, { id: clientItem.id, sku: clientItem.sku, name: clientItem.name, server_item_id: clientItem.server_item_id }, equalProductServerItem);
      }
      return equalProductServerItem;
    })

    const diffLog = await dispatch('synchronizeServerItem', { serverItem, clientItem, forceClientState, dryRun, mergeQty })

    if (!diffLog.isEmpty()) return diffLog

    Logger.info('Server and client item with SKU ' + clientItem.sku + ' synced. Updating cart.', 'cart', 'cart')()
    if (!dryRun) {
      const product = {
        sku: clientItem.sku,
        server_cart_id: serverItem.quote_id,
        server_item_id: serverItem.item_id,
        product_option: serverItem.product_option,
        type_id: serverItem.product_type
      }

      await dispatch('updateItem', { product })
    }

    return diffLog
  },
  async mergeClientItems({ dispatch }, { clientItems, serverItems, forceClientState, dryRun, mergeQty }) {
    const diffLog = createDiffLog()
    for (const clientItem of clientItems) {
      try {
        if (clientItem.sku && clientItem.sku === '005120') {
          console.log('givenClientItemIs', clientItem, {
            id: clientItem.id,
            name: clientItem.name,
            item_id: clientItem.totals ? clientItem.totals.item_id : clientItem.totals
          });
        }

        const mergeClientItemDiffLog = await dispatch('mergeClientItem', { clientItem, serverItems, forceClientState, dryRun, mergeQty })
        diffLog.merge(mergeClientItemDiffLog)
      } catch (e) {
        Logger.debug('Problem syncing clientItem', 'cart', clientItem)()
      }
    }
    return diffLog
  },
  async mergeServerItem({ dispatch, getters }, { clientItems, serverItem, forceClientState, dryRun }) {
    console.log("In 741256 Merge server Item ", clientItems, serverItem, forceClientState, dryRun);
    const diffLog = createDiffLog()
    const clientItem = clientItems.find(itm => {
      let isProductEq = productsEquals(itm, serverItem)
      let { id, sku, name } = itm;
      return isProductEq;
    })


    // TEMP WORK
    let lastClientItem = { name: null, sku: null, id: null }
    if (clientItems.length > 0 && clientItems[clientItems.length - 1]) {
      lastClientItem = clientItems[clientItems.length - 1];
    }

    // END of TEMP WORK

    if (clientItem) return diffLog
    Logger.info('No client item for' + serverItem.sku, 'cart')()
    diffLog.pushClientParty({ sku: serverItem.sku, status: 'no-item' })
    if (dryRun) return diffLog
    console.log('1456321 isItADryRun???', dryRun);
    if (forceClientState) {
      Logger.info('Removing product from cart', 'cart', serverItem)()
      Logger.log('Removing item' + serverItem.sku + serverItem.item_id, 'cart')()
      const cartItem = {
        sku: serverItem.sku,
        item_id: serverItem.item_id,
        quoteId: serverItem.quote_id
      } as any as CartItem

      const resp = await CartService.deleteItem(getters.getCartToken, cartItem)
      return diffLog.pushServerResponse({ status: resp.resultCode, sku: serverItem.sku, result: resp })
    }








    const productToAdd = await dispatch('getProductVariant', { serverItem })
    console.log('productToAdd', productToAdd, serverItem);
    if (serverItem.childSku)
    {
      console.log("741654 this is a configurable product", serverItem.childSku);
      let configurableOptions = [];
      productToAdd.configurable_options.forEach(option => {
        configurableOptions.push(option.attribute_code)
      });
      console.log("741654 Configurable options available are",configurableOptions);
      productToAdd.configurable_children.forEach(child => {
        console.log("741654 current child sku is ",child.sku , serverItem.childSku , child.sku ===  serverItem.childSku);
        if (child.sku ===  serverItem.childSku )
        {
          console.log("741654 Child found with sku " ,child.sku , serverItem.childSku ); 
          productToAdd.configurable_options.forEach(option => {
            console.log('741654 current option is ',typeof option.attribute_code,option.attribute_code,typeof productToAdd[option.attribute_code],typeof child[option.attribute_code], productToAdd[option.attribute_code],child[option.attribute_code]);
            productToAdd[option.attribute_code] = child[option.attribute_code]
            productToAdd.sku = serverItem.childSku
            
            productToAdd.finalPrice = child.finalPrice

            productToAdd.finalPriceInclTax = child.finalPriceInclTax
            
            productToAdd.finalPriceTax = child.finalPriceTax
            
            productToAdd.final_price = child.final_price
            
            productToAdd.final_price_incl_tax = child.final_price_incl_tax

            productToAdd.final_price_tax = child.final_price_tax



            productToAdd.originalPrice = child.originalPrice
            
            productToAdd.originalPriceInclTax = child.originalPriceInclTax
            
            productToAdd.originalPriceTax = child.originalPriceTax
            
            productToAdd.original_final_price = child.original_final_price

            productToAdd.original_price = child.original_price

            productToAdd.original_price_incl_tax = child.original_price_incl_tax
            
            productToAdd.original_price_tax = child.original_price_tax
            
            productToAdd.original_special_price = child.original_special_price
            
            productToAdd.price = child.price

            productToAdd.priceInclTax = child.priceInclTax

            productToAdd.priceTax = child.priceTax
            
            productToAdd.price_incl_tax = child.price_incl_tax
            
            productToAdd.price_tax = child.price_tax
            
            productToAdd.regular_price = child.regular_price



            productToAdd.specialPrice = child.specialPrice

            productToAdd.specialPriceInclTax = child.specialPriceInclTax
            
            productToAdd.specialPriceTax = child.specialPriceTax
            
            productToAdd.special_price = child.special_price

            productToAdd.special_price_incl_tax = child.special_price_incl_tax
            
            productToAdd.special_price_tax = child.special_price_tax
            
            productToAdd.stock = child.stock
            
            // productToAdd.sku = child.childSku
            
            // productToAdd.sku = child.childSku
            
            // productToAdd.sku = child.childSku
            
            // productToAdd.sku = child.childSku
            
            // productToAdd.sku = child.childSku
            
            // productToAdd.sku = child.childSku

            // productToAdd.sku = child.childSku
            
            // productToAdd.sku = child.childSku
            
            // productToAdd.sku = child.childSku

            
            productToAdd.id = child.id
            
            
            

            console.log('741654 product to add becomes ',option.attribute_code,productToAdd[option.attribute_code],child[option.attribute_code],productToAdd.sku,productToAdd);
          });
        }
      });
      
      
    }
    if (productToAdd) {
      dispatch('addItem', { productToAdd, forceServerSilence: true })
      Logger.debug('Product variant for given serverItem has not found', 'cart', serverItem)()
    }













    // const URL = "https://vue.bedfactorydirect.co.uk/vueapi/ext/V12Finance/getSku";
    // let order = {
    //   "item_id": serverItem.item_id,
    //   "quote_id": serverItem.quote_id
    // }
    // axios.post(URL, order, {
    //   headers: {
    //     "Content-type": "application/json"
    //   }
    // })
    //   .then( res => {
    //     // let v12Link = res.data.result.ApplicationFormUrl ;
    //     console.log("1456321 responseIs", res);
    //     serverItem.sku = res.data.result
    //     const productToAdd = dispatch('getProductVariant', { serverItem })
    //     console.log('1456321productToAdd', productToAdd, serverItem);
    //     if (productToAdd) {
    //       dispatch('addItem', { productToAdd, forceServerSilence: true })
    //       Logger.debug('Product variant for given serverItem has not found', 'cart', serverItem)()
    //     }
    //     return diffLog

    //   })
    //   .catch(error => {
    //     console.log("115599 Error", error);
    //     // return 'v12Link'
    //     return diffLog
    //   });
  },
  async mergeServerItems({ dispatch }, { serverItems, clientItems, forceClientState, dryRun }) {
    const diffLog = createDiffLog()
    const definedServerItems = serverItems.filter(serverItem => serverItem)
    console.log("74125 defined Server Items are ", definedServerItems);
    for (const serverItem of definedServerItems) {
      try {
        console.log("74125 About to call merge srever Item 1", clientItems, "\t\t\t2 ", serverItem, "\t\t\t3 ", forceClientState, "\t\t\t4 ", dryRun);
        const URL = config.baseUrl.url+"vueapi/ext/V12Finance/getSku";
        let order = {
          "item_id": serverItem.item_id,
          "quote_id": serverItem.quote_id
        }
        let quoteItemCheck = false
        let productSku2 = {
          childsku:'',
          sku:''
        };
      let productSku =  await axios.post(URL, order, {
          headers: {
            "Content-type": "application/json"
          }
        })
          .then(res => {
            // let v12Link = res.data.result.ApplicationFormUrl ;
            console.log("1456321 14521 ",serverItem.name, res ,"\n\n",JSON.stringify(res.data.result));
            if(res.data.result.length>0)
            {
              quoteItemCheck = true;
            }
            productSku2 = res.data.result[0];
            return res.data.result[0];

          })
          .catch(error => {
            console.log("115599 Error", error);
            return ''
            
          });
        
        if(quoteItemCheck){
          console.log("1456321 product sku is ",productSku2.childsku !== productSku2.sku,productSku2.childsku , productSku2.sku,productSku, "next ",productSku2);
          if (productSku2.childsku !== productSku2.sku){
          console.log("741654 Its a configurable product");
          serverItem['childSku'] = productSku2.childsku
          serverItem.sku = productSku2.sku;
          console.log("Now Server Item Becomes",serverItem );
          
          
        }
        else{
          console.log("741654 Its a simple product");
          serverItem.sku = productSku2.childsku;
        }
      }
        const mergeServerItemDiffLog = await dispatch('mergeServerItem', { clientItems, serverItem, forceClientState, dryRun })
        diffLog.merge(mergeServerItemDiffLog)
      } catch (e) {
        Logger.debug('Problem syncing serverItem', 'cart', serverItem)()
      }
    }
    return diffLog
  },
  async updateTotalsAfterMerge({ dispatch, getters, commit }, { clientItems, dryRun }) {
    if (dryRun) return
    // if (getters.isTotalsSyncRequired && clientItems.length > 0) {
    //   await dispatch('syncTotals')
    // }
    await dispatch('syncTotals')
    commit(types.CART_SET_ITEMS_HASH, getters.getCurrentCartHash)
  },
  async merge({ getters, dispatch }, { serverItems, clientItems, dryRun = false, forceClientState = false, mergeQty = false }) {


    const hookResult = cartHooksExecutors.beforeSync({ clientItems, serverItems })

    const diffLog = createDiffLog()
    const mergeParameters = {
      clientItems: hookResult.clientItems,
      serverItems: hookResult.serverItems,
      forceClientState,
      dryRun,
      mergeQty
    }
    const mergeClientItemsDiffLog = await dispatch('mergeClientItems', mergeParameters)
    console.log("74125 About to call merge server items parameters are", mergeParameters);
    const mergeServerItemsDiffLog = await dispatch('mergeServerItems', mergeParameters)

    await dispatch('updateTotalsAfterMerge', { clientItems, dryRun })

    diffLog
      .merge(mergeClientItemsDiffLog)
      .merge(mergeServerItemsDiffLog)
      .pushClientParty({ status: getters.isCartHashChanged ? 'update-required' : 'no-changes' })
      .pushServerParty({ status: getters.isTotalsSyncRequired ? 'update-required' : 'no-changes' })

    let diffLogData = { diffLog: diffLog, serverItems: hookResult.serverItems, clientItems: hookResult.clientItems, dryRun: dryRun }
    EventBus.$emit('servercart-after-diff', diffLogData)
    Logger.info('Client/Server cart synchronised ', 'cart', diffLog)()

    return diffLog
  }
}

export default mergeActions
