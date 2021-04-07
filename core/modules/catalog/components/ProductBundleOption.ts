import config from 'config'
import { getThumbnailPath } from '@vue-storefront/core/helpers'

export const ProductBundleOption = {
  name: 'ProductBundleOption',
  props: {
    option: {
      type: Object,
      required: true
    },
    errorMessages: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      productOptionId: null,
      quantity: 1
    }
  },
  computed: {
    productBundleOption () {
      return `bundleOption_${this.option.option_id}`
    },
    bundleOptionName () {
      return `bundleOption_${this._uid}_${this.option.option_id}_`
    },
    quantityName () {
      return `bundleOptionQty_${this.option.option_id}`
    },
    value () {
      const { product_links } = this.option
      if (Array.isArray(product_links)) {
        return product_links.find(product => {
          return product.id === ((typeof this.productOptionId === 'object') ? this.productOptionId.id : this.productOptionId)
        })
      }
      return product_links
    },
    errorMessage () {
      return this.errorMessages ? this.errorMessages[this.quantityName] : ''
    },
    vSelectBundleOptions () {
      return this.option.product_links.filter(link => typeof link.product !== 'undefined').map(({ product, id, is_default, price, sku, qty }, index) => {
        return {
          id,
          sku,
          is_default,
          qty,
          title: product?.name,
          cardImage: getThumbnailPath(product?.thumbnail, 62, 62),
          price: product?.price_incl_tax
        }
      }).sort((a, b) => { return a.price - b.price })
    }
  },
  mounted () {
    this.setDefaultValues()
    if (config.usePriceTiers) {
      this.$bus.$on('product-after-setup-associated', this.setDefaultValues)
    }
  },
  beforeDestroy () {
    if (config.usePriceTiers) {
      this.$bus.$off('product-after-setup-associated', this.setDefaultValues)
    }
  },
  watch: {
    productOptionId (value) {
      this.bundleOptionChanged()
    },
    quantity (value) {
      this.bundleOptionChanged()
    }
  },
  methods: {
    setDefaultValues () {
      const { product_links } = this.option

      let defaultOption = null;

      if (product_links) {
        if (this.option && this.option.type === 'select') {
          defaultOption = Array.isArray(product_links)
            ? this.vSelectBundleOptions.find(item => item.is_default)
            : product_links
          this.productOptionId = defaultOption || this.vSelectBundleOptions[0]
        } else {
          defaultOption = Array.isArray(product_links)
            ? product_links.find(pl => pl.is_default)
            : product_links
          this.productOptionId = defaultOption ? defaultOption.id : product_links[0].id
        }
        this.quantity = defaultOption ? defaultOption.qty : 1
      }
    },
    bundleOptionChanged () {
      this.$emit('option-changed', {
        option: this.option,
        fieldName: this.productBundleOption,
        qty: this.quantity,
        value: this.value
      })
    }
  }
}
