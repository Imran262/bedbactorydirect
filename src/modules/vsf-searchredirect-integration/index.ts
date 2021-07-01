/* eslint-disable no-empty-pattern */
import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { coreHooks } from '@vue-storefront/core/hooks';
import * as types from './store/mutation-types';
import { mutations } from './store/mutations'
import fetch from 'isomorphic-fetch';
import config from 'config';
const BASE_URL = config.api.url;
const SEARCH_URL = config.getSearchRedirectUrl.endpoint;

const searchRedirectModuleStore = {
  namespaced: true,
  state: {
    searchRedirectState: null
  },
  actions: {
    async searchRedirectFunction ({ commit }, formData) {
      try {
        const response = await fetch(
          `${SEARCH_URL}`,
          {
            method: 'post',
            mode: 'cors',
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          }
        );
        const jsonRes = await response.json();
        if (jsonRes.code === 200) {
          commit(types.SET_SEARCH_REDIRECT, { search_redirect: jsonRes.result })
          return jsonRes.result;
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  mutations
};

export const SearchRedirect: StorefrontModule = function ({
  app,
  store,
  router,
  moduleConfig,
  appConfig
}) {
  store.registerModule('searchredirect', searchRedirectModuleStore);
  coreHooks.afterAppInit(async () => {
    console.log('App HAVE BEEN initialized search');
  });
};
