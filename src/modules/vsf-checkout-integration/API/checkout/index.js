import { apiStatus } from '../../../lib/util';
import { Router } from 'express';
import axios from 'axios';

module.exports = ({ config, db }) => {
  const Magento2Client = require('magento2-rest-client').Magento2Client;
  const mage2Client = Magento2Client(config.magento2.api)

  // eslint-disable-next-line prefer-arrow-callback
  mage2Client.addMethods('cart', function (restClient) {
    let module = {};
    module.setPaymentInformation = function (customerToken, cartId, body, adminRequest = false) {
      if (adminRequest) {
        return restClient.post('/carts/' + cartId + '/set-payment-information', body);
      } else {
        if (customerToken && cartId) {
          return restClient.post('/carts/mine/set-payment-information', body, customerToken);
        } else {
          return restClient.post('/guest-carts/' + cartId + '/set-payment-information', body);
        }
      }
    }
    module.updateEmail = function (body) {
      return restClient.put('/vueStoreservices/update-quote', body)
    }
    module.checkoutPlaceOrder = function (customerToken, cartId, body, adminRequest = false) {
      if (adminRequest) {
        return restClient.put('/vueStoreservices/checkout-api', body, customerToken);
      } else {
        if (customerToken && cartId) {
          return restClient.put('/vueStoreservices/checkout-api', body, customerToken);
        } else {
          return restClient.put('/vueStoreservices/checkout-api-guest', body);
        }
      }
    }

    return module
  })
  let api = Router();

  api.post('/do-payment', async (req, res) => {
    try {
      const { token, cartId } = await req.query
      console.log(req.body)
      const body = req.body
      const transactionProcessResponse = await mage2Client.cart.checkoutPlaceOrder(token, cartId, body)
      apiStatus(res, transactionProcessResponse, 200)
    } catch (error) {
      apiStatus(res, 'Some Error Occurred while processing payment', 500)
      console.error(error)
    }
  });

  api.post('/setBillingAddress', async (req, res) => {
    const { token, cartId } = await req.query
    const { address } = req.body
    console.log(address)
    // console.log(req.params)
    // console.log(order)
    try {
      const result = await mage2Client.cart.billingAddress(token, cartId, { address })
      apiStatus(res, result, 200)
    } catch (error) {
      console.error(error)
      apiStatus(res, error, 500)
    }
  })

  api.post('/shippingInformation', async (req, res) => {
    const { token, cartId } = await req.query
    console.log(req.body)
    // console.log(req.params)
    // console.log(order)
    try {
      const result = await mage2Client.cart.shippingInformation(token, cartId, req.body)
      apiStatus(res, result, 200)
    } catch (error) {
      console.error(error)
      apiStatus(res, error, 500)
    }
  })

  api.put('/updateCartEmail', async (req, res) => {
    try {
      const result = await mage2Client.cart.updateEmail(req.body)
      apiStatus(res, result, 200)
    } catch (error) {
      console.error(error)
      apiStatus(res, error, 500)
    }
  })

  api.post('/setPaymentInformation', async (req, res) => {
    const { token, cartId } = await req.query
    const body = req.body
    try {
      const result = await mage2Client.cart.setPaymentInformation(token, cartId, body)
      apiStatus(res, result, 200)
    } catch (error) {
      console.error(error)
      apiStatus(res, error, 500)
    }
  })

  return api;
}
