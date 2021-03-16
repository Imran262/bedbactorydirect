
// import SearchQuery from '@vue-storefront/core/lib/search/searchQuery'
import { SearchQuery } from 'storefront-query-builder'
export const createLoadUrlRewritesQuery = ({ requestPath, entities }) => {
  let query = new SearchQuery()

  if (entities) {
    query = query.applyFilter({
      key: 'entity_type',
      value: { in: entities }
    })
  }

  if (requestPath) {
    query = query.applyFilter({
      key: 'request_path.keyword',
      value: { [Array.isArray(requestPath) ? 'in' : 'eq']: requestPath }
    })
  }

  return query
}