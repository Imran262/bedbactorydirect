import Product from '@vue-storefront/core/modules/catalog/types/Product'
import { ProductConfiguration } from '@vue-storefront/core/modules/catalog/types/ProductConfiguration'

const getAvailableFiltersByProduct = (product: Product) => {
  let filtersMap = {}
  console.log('Final console', product.configurable_options)
  if (product && product.configurable_options) {
    product.configurable_options.forEach(configurableOption => {
      const type = configurableOption.attribute_code
      const filterVariants = configurableOption.values.map(({ value_index, label }) => {
        return { id: value_index, label, type }
      })
      filtersMap[type] = filterVariants
    })
  }
  return filtersMap
}
const getAvailableFiltersByProductCustom = (product) => {
  let filtersMap = {}
  // console.log('filter Final console', product,'filtersMap',filtersMap)
  if (product) {
    product.forEach(configurableOption => {
      const type = configurableOption.attribute_code
      const filterVariants = configurableOption.values.map(({ value_index, label }) => {
        // console.log('filterVariants',filterVariants)
        return { id: value_index, label, type }
      })
      filtersMap[type] = filterVariants
      // console.log('filtersMap',filtersMap);
    })
  }
  return filtersMap
}

const getSelectedFiltersByProduct = (product: Product, configuration: ProductConfiguration) => {
  if (!configuration) {
    return null
  }

  let selectedFilters = {}
  if (configuration && product) {
    Object.keys(configuration).map(filterType => {
      const filter = configuration[filterType]
      selectedFilters[filterType] = {
        id: filter.id,
        label: filter.label,
        type: filterType
      }
    })
  }
  return selectedFilters
}

export { getAvailableFiltersByProduct, getSelectedFiltersByProduct, getAvailableFiltersByProductCustom }
