/* eslint-disable no-empty-pattern */
import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { coreHooks } from '@vue-storefront/core/hooks';
import * as types from './store/mutation-types';
import fetch from 'isomorphic-fetch';
import config from 'config';
import { mutations } from './store/mutations'
import { router } from '@vue-storefront/core/app'
// const BR_AUTO_SUGGEST_API_URL = 'http://staging-core.dxpapi.com/api/v1/core/?account_id=6492&auth_key=2r1danpt8136xoir&domain_key=tilemountain&request_id=630508109262&_br_uid_2=uid=8251458622613:v=11.8:ts=1605188804798:hc=301&url=www.bloomique.com&ref_url=www.bloomique.com&request_type=search&rows=10&start=0&fl=pid,title,brand,price,sale_price,promotions,thumb_image,sku_thumb_images,sku_swatch_images,sku_color_group,url,price_range,sale_price_range,description&q=*&search_type=keyword';
const BR_AUTO_SUGGEST_API_URL = config.bloomreach.brAutosuggest.endpoint ? config.bloomreach.brAutosuggest.endpoint : '';
const BR_AUTO_SUGGESTION_URL = config.bloomreach.brAutosuggest.suggestion_endpoint ? config.bloomreach.brAutosuggest.suggestion_endpoint : '';
const account_id = config.bloomreach.brAutosuggest.parameters.account_id ? config.bloomreach.brAutosuggest.parameters.account_id : '';
const auth_key = config.bloomreach.brAutosuggest.parameters.auth_key ? config.bloomreach.brAutosuggest.parameters.auth_key : '';
const domain_key = config.bloomreach.brAutosuggest.parameters.domain_key ? config.bloomreach.brAutosuggest.parameters.domain_key : '';
const domain_key_category = config.bloomreach.brAutosuggest.categoryParams.domain_key ? config.bloomreach.brAutosuggest.categoryParams.domain_key : '';
const view_id = config.bloomreach.viewId ? config.bloomreach.viewId : '';
const request_id = config.bloomreach.brAutosuggest.parameters.request_id ? config.bloomreach.brAutosuggest.parameters.request_id : '';
const _br_uid_2 = config.bloomreach.brAutosuggest.parameters._br_uid_2 ? config.bloomreach.brAutosuggest.parameters._br_uid_2 : '';
const url = config.bloomreach.brAutosuggest.parameters.url ? config.bloomreach.brAutosuggest.parameters.url : '';
const ref_url = config.bloomreach.brAutosuggest.parameters.ref_url ? config.bloomreach.brAutosuggest.parameters.ref_url : '';
const request_type = config.bloomreach.brAutosuggest.parameters.request_type ? config.bloomreach.brAutosuggest.parameters.request_type : '';
const rows = config.bloomreach.brAutosuggest.parameters.rows ? config.bloomreach.brAutosuggest.parameters.rows : '';
const rows_category = config.bloomreach.brAutosuggest.categoryParams.rows ? config.bloomreach.brAutosuggest.categoryParams.rows : '';
const start = config.bloomreach.brAutosuggest.parameters.start ? config.bloomreach.brAutosuggest.parameters.start : 0;
const fl = config.bloomreach.brAutosuggest.parameters.fl ? config.bloomreach.brAutosuggest.parameters.fl : '';
const search_type = config.bloomreach.brAutosuggest.parameters.search_type ? config.bloomreach.brAutosuggest.parameters.search_type : '';
const search_type_category = config.bloomreach.brAutosuggest.categoryParams.search_type ? config.bloomreach.brAutosuggest.categoryParams.search_type : '';
const facetsFieldsArray = config.bloomreach.brAutosuggest.facetsFields ? config.bloomreach.brAutosuggest.facetsFields : ['Colour', 'Finish', 'Material', 'Size', 'Special Features', 'Stock Status', 'Type', 'height', 'thickness', 'width']
const brAutosuggestModuleStore = {
  namespaced: true,
  state: {
    brAutosuggestState: null,
    brRangesState: null,
    brSuggestionState: null
  },
  actions: {
    async brAutosuggestFunction ({ commit }, searchKeyword) {
      console.log('Category Page Query', searchKeyword)
      let countNum = rows
      if (searchKeyword && searchKeyword.count) {
        countNum = searchKeyword.count
      } else {
        countNum = rows
      }
      let searchType = search_type
      if (searchKeyword && searchKeyword.searchQuery) {
        searchType = searchKeyword.searchQuery
      } else {
        searchType = search_type
      }
      let startNum = start
      if (searchKeyword && searchKeyword.pageNumber) {
        startNum = searchKeyword.pageNumber * countNum
      } else {
        startNum = start
      }
      // console.log('Category startNum', startNum)
      let sortStringDyn = '';
      let sortStringObjId = '';
      if (searchKeyword && searchKeyword.sortObj && searchKeyword.sortObj.id && searchKeyword.sortObj.id !== 'total_revenue:desc') {
        if (!(searchKeyword.sortObj.id.includes(':'))) {
          sortStringObjId = searchKeyword.sortObj.id + ':asc'
        } else {
          sortStringObjId = searchKeyword.sortObj.id
        }
        sortStringDyn = '&sort=' + sortStringObjId.replace(':', '+')
      }
      let filtersArrayManage = searchKeyword.filtersArr;
      let filterQueryStringDyn = '';
      let keyOffiltersArrayManage = [];
      if (filtersArrayManage) {
        keyOffiltersArrayManage = Object.keys(filtersArrayManage);
        console.log("I have it here keyOffiltersArrayManage",keyOffiltersArrayManage)
      }
      if (keyOffiltersArrayManage.length > 0) {
        for (var key in filtersArrayManage) {
          if (facetsFieldsArray.includes(key)) {
            filterQueryStringDyn = filterQueryStringDyn + '&fq=' + key + ':';
            if (!filtersArrayManage.hasOwnProperty(key)) continue;
            var obj = filtersArrayManage[key];
            if (key !== 'price' && key !== 'width' && key !== 'height') {
              obj.filters.forEach((element, index) => {
                if (index > 0) {
                  filterQueryStringDyn = filterQueryStringDyn + 'OR"' + element + '"'
                } else {
                  filterQueryStringDyn = filterQueryStringDyn + '"' + element + '"'
                }
              });
            }
          }
        }
      }
      if (router.currentRoute.fullPath.includes('width')) {
        filterQueryStringDyn = filterQueryStringDyn + "&fq=width:" + '[' + router.currentRoute.params["width"].split('-').join(' TO ') + ']'
      }
      if (router.currentRoute.fullPath.includes('height')) {
        filterQueryStringDyn = filterQueryStringDyn + "&fq=height:" + '[' + router.currentRoute.params["height"].split('-').join(' TO ') + ']'
      }
      if (router.currentRoute.fullPath.includes('price=')) {
        filterQueryStringDyn = filterQueryStringDyn + "&fq=price:" + '[' + router.currentRoute.params["price"].split('-').join(' TO ') + ']'
      }
      console.log("here it is our filterQueryStringDyn",filterQueryStringDyn)
      try {
        let BR_AUTO_SUGGEST_API_Dynamic = BR_AUTO_SUGGEST_API_URL + 'account_id=' + account_id + '&auth_key=' + auth_key + '&domain_key=' + domain_key + '&request_id=' + request_id + '&_br_uid_2=' + _br_uid_2 + '&url=' + url + '&ref_url=' + ref_url + '&view_id=' + view_id + '&request_type=' + request_type + '&rows=' + countNum + '&start=' + startNum + '&fl=' + fl + '&q=' + searchKeyword.searchWord + '&search_type=' + searchType + filterQueryStringDyn + sortStringDyn
        const response = await fetch(
          `${BR_AUTO_SUGGEST_API_Dynamic}`,
          {
            method: 'get',
            mode: 'cors',
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          }
        );
        const jsonRes = await response.json();
        if (jsonRes.response.numFound > 0) {
          commit(types.SET_BR_AUTOSUGGEST, { br_autosuggest: jsonRes })
          return jsonRes.response;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async brAutosuggestSuggestionFunction ({ commit }, searchKeyword) {
      try {
        let BR_SUGGESTION_API_Dynamic = BR_AUTO_SUGGESTION_URL + 'account_id=' + account_id + '&auth_key=' + auth_key + '&view_id=' + view_id + '&domain_key=' + domain_key + '&request_id=' + request_id + '&_br_uid_2=' + _br_uid_2 + '&url=' + url + '&ref_url=' + ref_url + '&rows=3&start=0&fl=' + fl + '&request_type=suggest&q=' + searchKeyword.searchWord
        const response = await fetch(
          `${BR_SUGGESTION_API_Dynamic}`,
          {
            method: 'get',
            mode: 'cors'
          }
        );
        const jsonRes = await response.json();
        if (jsonRes.response.numFound > 0) {
          commit(types.SET_BR_SUGGESTIONS, { br_suggestion: jsonRes })
          return jsonRes.response;
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  mutations
};

export const BrAutosuggest: StorefrontModule = function ({
  store
}) {
  console.log('BrAutosuggest Module Registered');
  store.registerModule('brautosuggest', brAutosuggestModuleStore);
  coreHooks.afterAppInit(async () => {
    console.log('BrAutosuggest working');
  });
};