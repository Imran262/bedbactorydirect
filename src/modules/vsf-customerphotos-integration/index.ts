/* eslint-disable no-empty-pattern */
import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { coreHooks } from '@vue-storefront/core/hooks';
import * as types from './store/mutation-types';
import fetch from 'isomorphic-fetch';
import config from 'config';
const BASE_URL = config.api.url;
const CUSTOMER_PHOTOS_URL = config.customerPhotos.endpoint;

const customerPhotosModuleStore = {
  namespaced: true,
  state: {
    customerPhotosState: null
  },
  actions: {
    async customerPhotosFunction({}, photoData) {
      try {
        const response = await fetch(
          `${CUSTOMER_PHOTOS_URL}`,
          {
            method: 'post',
            mode: 'cors',
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(photoData)
          }
        );
        const jsonRes = await response.json();
        if (jsonRes.code === 200) {
          return jsonRes.result;
        }
        console.log(jsonRes);
      } catch (error) {
        console.log(error);
      }
    }
  },
  mutations: {
    [types.customerPhotos](state, customerPhotos) {
      state.customerPhotos = 'customerPhotos';
    }
  }
};

export const CustomerPhotos: StorefrontModule = function({
  store
}) {
  console.log('customerPhotos Module Registered');
  store.registerModule('customerphotos', customerPhotosModuleStore);
  coreHooks.afterAppInit(async () => {
    console.log('Customer Photos registered');
  });
};
