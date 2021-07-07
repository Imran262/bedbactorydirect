import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { coreHooks } from '@vue-storefront/core/hooks';
import * as types from './store/mutation-types';
import fetch from 'isomorphic-fetch';
import config from 'config';
const GETVINYLITEMS_URL = config.getVinyl.endpoint;

const vinylModuleStore = {
  namespaced: true,
  state: {
    vinylState: null
  },
  actions: {
    async getVinylItems ({}, systemData) {
      try {
        const response = await fetch(
          `${GETVINYLITEMS_URL}`,
          {
            method: 'post',
            mode: 'cors',
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(systemData)
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
    [types.vinyl] (state, vinyl) {
      state.vinyl = 'vinyl';
    }
  }
};

export const Vinyl: StorefrontModule = function ({ store}) {
  console.log('vinyl Module Registered');
  store.registerModule('vinyl', vinylModuleStore);
  coreHooks.afterAppInit(async () => {
    console.log('App HAVE BEEN initialized vinyl');
  });
};
