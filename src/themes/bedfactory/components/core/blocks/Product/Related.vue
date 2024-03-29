<template>
  <section
    class="py20 new-collection container px15"
    v-if="getCurrentRelatedProducts.length"
  >
    <div>
      <header class="col-md-12">
        <h2 class="align-center cl-accent">
          {{ heading }}
        </h2>
      </header>
    </div>
    <product-listing columns="4" :products="getCurrentRelatedProducts" :filters="{}" :searchPage="true" :isCategory="false"/>
  </section>
</template>

<script>
import ProductListing from "src/themes/bedfactory/components/core/ProductListingCustom";
import { mapGetters } from "vuex";
import { prepareRelatedQuery } from "@vue-storefront/core/modules/catalog/queries/related";
import i18n from "@vue-storefront/i18n";
import config from "config";

export default {
  name: "Related",
  props: {
    type: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: false,
      default: i18n.t("Similar products"),
    },
  },
  components: {
    ProductListing,
  },
  beforeMount() {
    this.$bus.$on("product-after-load", this.refreshList);

    if (config.usePriceTiers) {
      this.$bus.$on("user-after-loggedin", this.refreshList);
      this.$bus.$on("user-after-logout", this.refreshList);
    }

    this.refreshList();
  },
  beforeDestroy() {
    if (config.usePriceTiers) {
      this.$bus.$off("user-after-loggedin", this.refreshList);
      this.$bus.$off("user-after-logout", this.refreshList);
    }
  },
  destroyed() {
    this.$bus.$off("product-after-load", this.refreshList);
  },
  methods: {
    async refreshList() {
      let sku = this.productLinks
        ? this.productLinks
            .filter((pl) => pl.link_type === this.type)
            .map((pl) => pl.linked_product_sku)
        : null;

      let key = "sku";
      if (sku === null || sku.length === 0) {
        sku = this.getCurrentProduct.category_ids;
        key = "category_ids";
      }
      let relatedProductsQuery = prepareRelatedQuery(key, sku);

      const { items } = await this.$store.dispatch("product/findProducts", {
        query: relatedProductsQuery,
        size: 4,
        options: {
          populateRequestCacheTags: false,
          prefetchGroupProducts: false,
        },
      });
      if (items.length) {
        this.$store.dispatch("product/related", {
          key: this.type,
          items: items,
        });
        this.$forceUpdate();
      }
    },
  },
  computed: {
    ...mapGetters({
      getProductRelated: "product/getProductRelated",
      getCurrentProduct: "product/getCurrentProduct",
    }),
    getCurrentRelatedProducts() {
      return this.getProductRelated[this.type] || [];
    },
    productLinks() {
      return this.getCurrentProduct.product_links;
    },
  },
};
</script>
<style lang="scss" scoped>
h2.align-center.cl-accent {
    color: #071A44;
}
</style>