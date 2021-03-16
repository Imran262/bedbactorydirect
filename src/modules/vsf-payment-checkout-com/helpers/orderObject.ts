function createOrderData (store) {
  const shippingAddress = store.getters['checkout/getShippingDetails']
  const paymentDetails = store.getters['checkout/getPaymentDetails']
  const personalDetails = store.getters['checkout/getPersonalDetails']
  console.log('shippingAddress', shippingAddress)
  return {
    billingAddress: {
      region: paymentDetails.state,
      region_id: paymentDetails.region_id ? paymentDetails.region_id : 0,
      country_id: paymentDetails.country,
      street: [paymentDetails.streetAddress, paymentDetails.apartmentNumber],
      company: paymentDetails.company,
      telephone: paymentDetails.phoneNumber,
      postcode: paymentDetails.zipCode,
      city: paymentDetails.city,
      firstname: paymentDetails.firstName,
      lastname: paymentDetails.lastName,
      email: personalDetails.emailAddress,
      region_code: paymentDetails.region_code ? paymentDetails.region_code : '',
      vat_id: paymentDetails.taxId
    },
    shippingAddress: {
      region: shippingAddress.state,
      region_id: shippingAddress.region_id ? shippingAddress.region_id : 0,
      country_id: shippingAddress.country,
      street: [shippingAddress.streetAddress, shippingAddress.apartmentNumber],
      company: shippingAddress.company,
      telephone: shippingAddress.phoneNumber,
      postcode: shippingAddress.zipCode,
      city: shippingAddress.city,
      firstname: shippingAddress.firstName,
      lastname: shippingAddress.lastName,
      email: personalDetails.emailAddress,
      region_code: shippingAddress.region_code ? shippingAddress.region_code : '',
      vat_id: shippingAddress.taxId
    },
    // extension_attributes: {
    //   delivery_note: (shippingAddress.narrowRoad) ? shippingAddress.deliveryNoteHidden + '<br/>' + shippingAddress.deliveryNote : shippingAddress.deliveryNote + '<br/>' + shippingAddress.noOneField
    // },
    shipping_method_code: shippingAddress.shippingMethod,
    shipping_carrier_code: shippingAddress.shippingCarrier
  }
}

export {
  createOrderData
}
