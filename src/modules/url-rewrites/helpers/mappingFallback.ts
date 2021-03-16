import { Logger } from '@vue-storefront/core/lib/logger'
import { removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'
// import SearchQuery from '@vue-storefront/core/lib/search/searchQuery'
import { SearchQuery } from 'storefront-query-builder'

async function handleProductRewrite ({ dispatch }, rewrite) {
  const match = rewrite.target_path.match(/catalog\/product\/view\/id\/([0-9]+)/)

  if (match) {
    const productId = match[1]

    const productQuery = new SearchQuery()
    productQuery.applyFilter({key: 'id', value: { 'eq': productId }})

    const products = await dispatch('product/list', { query: productQuery }, { root: true })

    if (products && products.items && products.items.length) {
      Logger.info('Matched product url fallback', 'url-rewrites')()

      const product = products.items[0]
      return {
        name: product.type_id + '-product',
        params: {
          slug: product.slug,
          parentSku: product.sku,
          childSku: product.sku
        }
      }
    }
  }

  return false
}

async function handleCategoryRewrite ({ dispatch }, rewrite) {
  const match = rewrite.target_path.match(/catalog\/category\/view\/id\/([0-9]+)/)

  if (match) {
    const categoryId = match[1]

    const category = await dispatch('category/single', { key: 'id', value: categoryId }, { root: true })

    if (category) {
      Logger.info('Matched category url fallback', 'url-rewrites')()

      return {
        name: 'category',
        params: {
          slug: category.slug
        }
      }
    }
  }

  return false
}

async function handleCmsPageRewrite ({ dispatch }, rewrite) {
  const match = rewrite.target_path.match(/cms\/page\/view\/page_id\/([0-9]+)/)

  if (match) {
    const pageId = match[1]

    const page = await dispatch('cmsPage/single', { key: 'id', value: pageId }, { root: true })

    if (page) {
      Logger.info('Matched cms-page url fallback', 'url-rewrites')()

      return {
        name: 'cms-page',
        params: {
          slug: page.identifier
        }
      }
    }
  }

  return false
}

export default async function (context, { url }) {
  url = (removeStoreCodeFromRoute(url) as string).replace(/\.*\/?$/, '').replace(/^\//, '')

  const rewrites = await context.dispatch('url/fetchRewrites', { requestPath: [ url ] }, { root: true })
  if (rewrites && rewrites.items && rewrites.items.length > 0) {
    const rewrite = rewrites.items[0];
    if (rewrite.redirect_type === 0) {
      switch (rewrite.entity_type) {
        case 'product': {
          return handleProductRewrite(context, rewrite)
        }
        case 'category': {
          return handleCategoryRewrite(context, rewrite)
        }
        case 'cms-page': {
          return handleCmsPageRewrite(context, rewrite)
        }
      }
    }
  }

  return false
}
