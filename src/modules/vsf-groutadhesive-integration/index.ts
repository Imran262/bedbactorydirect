import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { coreHooks } from '@vue-storefront/core/hooks';
import * as types from './store/mutation-types';
import fetch from 'isomorphic-fetch';
import config from 'config';
const GROUTADHESIVE_URL = config.groutAdhesiveSystem.endpoint;
const GROUTADHESIVEADDRECOMMENDATIONS_URL = config.groutAdhesiveSystem.recommendationEndpoint;
const GROUTADHESIVEGETRECOMMENDATIONS_URL = config.groutAdhesiveSystem.getRecommendationEndpoint;

const groutAdhesiveModuleStore = {
  namespaced: true,
  state: {
    groutAdhesiveState: null
  },
  actions: {
    async groutAdhesiveFunction({}, systemData) {
      try {
        const response = await fetch(
          `${GROUTADHESIVE_URL}`,
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
    },
    async groutAdhesiveAddRecommendationsFunction ({}, systemData) {
      try {
        console.log('GROUTADHESIVEADDRECOMMENDATIONS_URL', GROUTADHESIVEADDRECOMMENDATIONS_URL);
        const response = await fetch(
          `${GROUTADHESIVEADDRECOMMENDATIONS_URL}`,
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
    },
    async groutAdhesiveGetRecommendations ({}, systemData) {
      try {
        const response = await fetch(
          `${GROUTADHESIVEGETRECOMMENDATIONS_URL}`,
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
    [types.groutAdhesive](state, groutAdhesive) {
      state.groutAdhesive = 'groutAdhesive';
    }
  }
};

export const GroutAdhesive: StorefrontModule = function ({ store}) {
  console.log('GroutAdhesive Module Registered');
  store.registerModule('groutadhesive', groutAdhesiveModuleStore);
  coreHooks.afterAppInit(async () => {
    console.log('App HAVE BEEN initialized grout');
  });
};
