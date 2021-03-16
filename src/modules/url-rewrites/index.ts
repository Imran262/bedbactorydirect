import { module } from './store'
import { extendStore, isServer } from '@vue-storefront/core/helpers'
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { getSearchAdapter } from '@vue-storefront/core/lib/search/adapter/searchAdapterFactory'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { AsyncDataLoader } from '@vue-storefront/core/lib/async-data-loader'
import { removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'

export const STORAGE_KEY = 'url-rewrite'

export const UrlRewrites: StorefrontModule = function ({ router, store }) {
  StorageManager.init(STORAGE_KEY)

  extendStore('url', module)

  router.beforeEach(async (from, to, next) => {
    if (isServer) {
      AsyncDataLoader.push({
        execute: async ({ route, context }) => {
          if (context && route) {
            const fromUrl = (removeStoreCodeFromRoute(route.fullPath) as string).replace(/\.*\/?$/, '').replace(/^\//, '')
            const redirect = await store.dispatch('url/getRewrite', fromUrl)

            if (redirect) {
              context.server.response.redirect(`/${redirect.target_path}`, redirect.redirect_type)
            }
          }
        }
      })
    }

    next()
  })

  getSearchAdapter().then((searchAdapter) => {
    searchAdapter.registerEntityType('url_rewrite', {
      queryProcessor: query => query,
      resultProcessor: (resp, start, size) => {
        return searchAdapter.handleResult(resp, 'url_rewrite', start, size)
      }
    })
  })
}