import { ActionTree } from 'vuex'
import { quickSearchByQuery } from '@vue-storefront/core/lib/search'
import RootState from '@vue-storefront/core/types/RootState'
import UrlRewritesState from '../types/UrlRewritesState'
import * as types from './mutation-types'
import { createLoadUrlRewritesQuery } from '../helpers'
import { Logger } from '@vue-storefront/core/lib/logger'
import { STORAGE_KEY } from '..'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import config from 'config'

const actions: ActionTree<UrlRewritesState, RootState> = {
  async fetchRewrites ({ commit }, {
    requestPath,
    start = 0,
    size = 50,
    entityType = 'url_rewrite',
    rewriteEntities = config.urlRewrites.entities,
    excludeFields = null,
    includeFields = ['entity_type', 'entity', 'redirect_type', 'request_path', 'target_path']
  }) {
    let modifiedRequestPath = null;
    if (Array.isArray(requestPath) && requestPath.length > 0) {
      modifiedRequestPath = requestPath.map(rPath => {
        return rPath.replace(/\?.*/, '');
      });
    } else {
      modifiedRequestPath = requestPath.replace(/\?.*/, '');
    }

    const query = createLoadUrlRewritesQuery({
      requestPath: modifiedRequestPath || requestPath,
      entities: rewriteEntities
    })
    const response = await quickSearchByQuery({ query, start, size, entityType, excludeFields, includeFields })
    if (response.items) {
      commit(types.UPDATE_URL_REWRITES, response.items)
    }
    return response
  },

  async getRewrite ({ state, dispatch, commit }, urls) {
    const cacheStorage = StorageManager.get(STORAGE_KEY)

    if (!Array.isArray(urls)) {
      urls = [urls]
    }

    for (const url of urls) {
      const cacheItem = await cacheStorage.getItem(url)

      if (cacheItem !== null) {
        Logger.info(`Cache hit for url redirect rewrites '${url}' -> '${cacheItem.target_url || cacheItem}'`, 'url-rewrites')()
        return cacheItem
      }

      if (state.urlRewrites[url] && [301, 302].indexOf(state.urlRewrites[url].redirect_type) >= 0) {
        return state.urlRewrites[url]
      }
    }

    const rewrites = await dispatch('fetchRewrites', { requestPath: urls })

    if (rewrites && rewrites.items && rewrites.items.length > 0) {
      const rewrite = rewrites.items[0]

      if ([301, 302].indexOf(rewrite.redirect_type) >= 0) {
        Logger.info(`Saving redirect rewrite for url '${rewrite.request_path}' -> '${rewrite.target_path}'`, 'url-rewrites')()
        cacheStorage.setItem(rewrite.request_path, rewrite)
        return rewrite
      }
    }

    for (const url of urls) {
      Logger.info(`Saving redirect rewrite for url '${url}' -> 'false'`, 'url-rewrites')()
      cacheStorage.setItem(url, false)
      commit(types.ADD_URL_REWRITE, {
        path: url,
        value: false
      })
    }

    return false
  }

}

export default actions
