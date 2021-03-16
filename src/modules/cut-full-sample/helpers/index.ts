import config from 'config'
const freeSamplesLimit = config.sampleQuote.free_samples_limit || 3

export const hasOnlySampleTypeInCart = ({ cartItems = [], sampleType, allowedEmpty = false }: { cartItems?: any, sampleType: string, allowedEmpty: boolean }) => {
  let filteredItemsOtherThanSampleType = cartItems.filter((item, index) => {
    return item.totals && (!item.totals.options || item.totals.options.length === 0 || (item.totals.options && item.totals.options.length > 0 && item.totals.options[0].value !== sampleType));
  });

  let filteredOnlyProvidedSampleTypes = cartItems.filter((item, index) => {
    return item.totals && item.totals.options && item.totals.options.length > 0 && item.totals.options[0].value === sampleType
  });

  switch (sampleType) {
    case 'Cut Size':
      if (allowedEmpty) {
        return !(filteredItemsOtherThanSampleType.length > 0) && (filteredOnlyProvidedSampleTypes.length <= freeSamplesLimit)
      } else {
        return !(filteredItemsOtherThanSampleType.length > 0) && (filteredOnlyProvidedSampleTypes.length > 0 && filteredOnlyProvidedSampleTypes.length <= freeSamplesLimit)
      }
    default:
      return !(filteredItemsOtherThanSampleType.length > 0) && (filteredOnlyProvidedSampleTypes.length > 0)
  }
}

export const hasOnlySelectedSampleTypesInCart = ({ cartItems = [], sampleTypes, compulsorySamples }: { cartItems?: any, sampleTypes: any[], compulsorySamples: any[] }) => {
  let filteredItemsOtherThanSampleType = cartItems.filter((item, index) => {
    return item.totals && (!item.totals.options || item.totals.options.length === 0 || (item.totals.options && item.totals.options.length > 0 && !sampleTypes.includes(item.totals.options[0].value)));
  });

  if (filteredItemsOtherThanSampleType.length > 0) {
    return false
  }

  let filteredOnlyProvidedSampleTypes = cartItems.filter((item, index) => {
    if (compulsorySamples.length > 0) {
      return item.totals && item.totals.options && item.totals.options.length > 0 && item.totals.options[0].value && compulsorySamples.includes(item.totals.options[0].value)
    } else if (compulsorySamples.length === 0) {
      return item.totals && item.totals.options && item.totals.options.length > 0 && item.totals.options[0].value && sampleTypes.includes(item.totals.options[0].value)
    }
  });

  if (filteredOnlyProvidedSampleTypes.length > 0) {
    return true;
  }

  return false;
}

// export const hasFreeSamplesOnlyInCart = ({ cartItems = [] }: { cartItems?: any }) => {
//   if (!cartItems || cartItems.length === 0) {
//     return false
//   }
//   let itemsOtherThanCutSize = cartItems.filter((item, index) => {
//     return item.totals && item.totals.options && item.totals.options.length > 0 && item.totals.options[0].value !== 'Cut Size'
//   });
//   let onlyCutSizeSample = cartItems.filter((item, index) => {
//     return item.totals && item.totals.options && item.totals.options.length > 0 && item.totals.options[0].value === 'Cut Size'
//   });
//   return !(itemsOtherThanCutSize.length > 0) && (onlyCutSizeSample.length > 0 && onlyCutSizeSample.length <= freeSamplesLimit)
// }

export const pullCartSync = async (cThis) => {
  await cThis.$store.dispatch('cart/sync', {
    forceClientState: false,
    forceSync: true
  });
  await cThis.$store.dispatch('cart/syncTotals', { forceServerSync: true });
  await cThis.$store.dispatch('cart-after-itemchanged', {
    forceClientState: false
  });

  // cThis.$bus.$emit('cart-after-itemchanged', { item: cThis.product })
  cThis.$forceUpdate();
}

// TODO: Remove/Update this below method, if task TMVS2-116 testing is successful
export const updateLocalStorageCurrentCartItem = async ({ payment_methods, totals }) => {
  // console.log('removingItemFrom LocalStorage');
  // localStorage.removeItem('shop/cart/current-cart');
  // return true;
  const storedItems = JSON.parse(localStorage['shop/cart/current-cart']);
  if (!storedItems) {
    return false;
  }

  if (!totals || !totals.items || totals.items.length === 0) {
    return false
  }

  let updatedStoredItems = storedItems.map(si => {
    let filteredItem = totals.items.filter(tItem => {
      return tItem.name === si.totals.name
    });
    if (filteredItem && filteredItem.length > 0) {
      si.totals.base_price = filteredItem[0].base_price;
      si.totals.base_price_incl_tax = filteredItem[0].base_price_incl_tax;
      si.totals.base_row_total = filteredItem[0].base_row_total;
      si.totals.base_row_total_incl_tax = filteredItem[0].base_row_total_incl_tax;
      si.totals.price = filteredItem[0].price;
      si.discount_amount = filteredItem[0].discount_amount;
      si.discount_percent = filteredItem[0].discount_percent;
      si.row_total = filteredItem[0].row_total;
      si.row_total_incl_tax = filteredItem[0].row_total_incl_tax;
      si.row_total_with_discount = filteredItem[0].row_total_with_discount;
      si.tax_amount = filteredItem[0].tax_amount;
      si.base_tax_amount = filteredItem[0].base_tax_amoun;
      si.options = filteredItem[0].options;
      return si;
    }
  });

  // Update the LocalStorage Now
  localStorage.setItem('shop/cart/current-cart', JSON.stringify(updatedStoredItems))

  console.log('updatedSortedItemComparison', updatedStoredItems, storedItems);

  console.log('resultData', totals.items, storedItems);

  // if (this.totals && this.totals.items && this.totals.items.length > 0) {
  //   console.log('imInsideIf');
  //   this.totals.items.forEach(tItem => {
  //     // Update this total item in localstorage for cart as well.
  //
  //   });
  // }
  //
  // console.log('storedItemsAre', storedItems);
}
