<template>
  <div
    class="product-similar-listing-carousel"
    v-if="getCurrentRelatedProducts.length"
  >
    <h4 class="recommendation-heading">
      {{ heading }}
    </h4>
    <prodlisting-carousel columns="3" :products="getCurrentRelatedProducts" />
  </div>
</template>
<script>
import ProdlistingCarousel from 'theme/components/ProdlistingCarousel';
import { mapGetters } from 'vuex';
import { prepareRelatedQuery } from '@vue-storefront/core/modules/catalog/queries/related';
import i18n from '@vue-storefront/i18n';
import config from 'config';
export default {
  name: 'ProductSimilarListingCarousel',
  props: {
    type: {
      type: String,
      required: true
    },
    heading: {
      type: String,
      required: false,
      default: i18n.t('Similar products')
    }
  },
  components: {
    ProdlistingCarousel
  },
  beforeMount() {
    this.$bus.$on('product-after-load', this.refreshList);

    if (config.usePriceTiers) {
      this.$bus.$on('user-after-loggedin', this.refreshList);
      this.$bus.$on('user-after-logout', this.refreshList);
    }

    this.refreshList();
  },
  beforeDestroy() {
    if (config.usePriceTiers) {
      this.$bus.$off('user-after-loggedin', this.refreshList);
      this.$bus.$off('user-after-logout', this.refreshList);
    }
  },
  destroyed() {
    this.$bus.$off('product-after-load', this.refreshList);
  },
  methods: {
    async refreshList() {
      let sku = this.productLinks
        ? this.productLinks
            .filter(pl => pl.link_type === this.type)
            .map(pl => pl.linked_product_sku)
        : null;

      let key = 'sku';
      if (sku === null || sku.length === 0) {
        sku = this.getCurrentProduct.category_ids;
        key = 'category_ids';
      }
      let relatedProductsQuery = prepareRelatedQuery(key, sku);

      const response = await this.$store.dispatch('product/list', {
        query: relatedProductsQuery,
        size: 8,
        prefetchGroupProducts: false,
        updateState: false
      });
      if (response) {
        this.$store.dispatch('product/related', {
          key: this.type,
          items: response.items
        });
        this.$forceUpdate();
      }
    }
  },
  computed: {
    ...mapGetters({
      getProductRelated: 'product/getProductRelated',
      getCurrentProduct: 'product/getCurrentProduct'
    }),
    getCurrentRelatedProducts() {
      return this.getProductRelated[this.type] || [];
    },
    productLinks() {
      return this.getCurrentProduct.product_links;
    }
  }
};
</script>
<style scoped>
.product-similar-listing-carousel {
  margin-bottom: 15px;
  border: 2px solid #f0f1f2;
}
.cart-popup .product-similar-listing-carousel {
  margin-bottom: 0px;
}

h4.recommendation-heading {
  font-family: 'Poppins', sans-serif;
  color: #fff;
  padding: 12px 20px;
  text-align: left;
  margin-bottom: 10px;
  background: #54575b;
  margin-top: 0px;
}
#pupupid h4.recommendation-heading {
  text-align: center;
}
.popup-sliders .VueCarousel {
  background: #f4f8fb !important;
}
.cart-popup .popup-sliders h4 {
  text-align: left !important;
  border-top: 2px solid #eaebec;
  padding-top: 10px;
  padding-bottom: 5px;
  background: transparent;
}
.cart-popup .popup-sliders .product-similar-listing-carousel {
  border: none;
}

/*Mobile Custom Css */
@media (max-width: 767px) {
  h4.recommendation-heading {
    padding-left: 0px !important;
    text-align: center !important;
  }
}
/*Mobile Custom Css */
</style>
