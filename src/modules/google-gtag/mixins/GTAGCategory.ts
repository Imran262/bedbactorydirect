import { isServer } from '@vue-storefront/core/helpers'
import { mapGetters } from 'vuex'
import debounce from 'lodash-es/debounce';

export const GTAGCategory = {
  data () {
    return {
      currentPosL: 0,
      currentPosR: 0
    }
  },
  methods: {
    // sendCategoryView () {
    //   this.$store.commit('google-gtag/SET_PRODUCT_LIST', {
    //     list: 'Category',
    //     label: 'Category: ' + this.getCurrentCategory.name,
    //     catName: this.getCurrentCategory.name,
    //     category: this.list,
    //     isListingProducts: false
    //   })
    // }
  },
  created () {
    // If Category Page has Products listed
    this.setGtagProductsList = debounce(function ({ isListingProducts = false, products = null } = {}, from = null) {
      // console.log('getCurrentCategoryBrProductsResponseGetters', this.getCurrentCategoryBrProductsResponseGetters, isListingProducts);
      console.log('eventTriggeredFrom', from, products, 'getCurrentCategoryBrProductsResponseGetters', this.getCurrentCategoryBrProductsResponseGetters);
      if (this.getCurrentCategoryBrProductsResponseGetters && this.getCurrentCategoryBrProductsResponseGetters.length > 0) {
        this.$store.commit('google-gtag/SET_PRODUCT_LIST', {
          products: products || this.getCurrentCategoryBrProductsResponseGetters,
          list: 'Category',
          label: 'Category: ' + this.getCurrentCategory.name,
          catName: this.getCurrentCategory.name,
          category: this.list,
          isListingProducts
        })
      }
    }, 1000)

    // If Category page has only categories listing
    this.sendCategoryView = debounce(() => {
      console.log('shouldIBeExecuted');
      this.$store.commit('google-gtag/SET_CATEGORY', {
        list: 'Category',
        label: 'Category: ' + this.getCurrentCategory.name,
        catName: this.getCurrentCategory.name,
        category: this.list,
        isListingProducts: false
      })
    }, 1000);
  },
  computed: {
    ...mapGetters({
      getCategoryBreadcrumbs: 'category/getCategoryBreadcrumbs',
      getCurrentCategory: 'category/getCurrentCategory'
    }),
    list () {
      let routes = this.getCategoryBreadcrumbs.routes
      routes = routes.map((el) => { return el.name }).join('/')
      return routes ? routes + '/' + this.getCurrentCategory.name : this.getCurrentCategory.name
    }
  },
  watch: {
    getCurrentCategoryBrProductsResponseGetters: function (to, from) {
      if (!isServer && this.getCurrentCategoryBrProductsResponseGetters && this.getCurrentCategoryBrProductsResponseGetters.length > 0 && (to !== from)) {
        if (this.listingPageCompute) {
          this.setGtagProductsList({
            isListingProducts: this.listingPageCompute,
            products: this.getCurrentCategoryBrProductsResponseGetters
          }, 'watch getCategoryProducts GTAGCategory.ts')
        }
        /* this.currentPosR = this.getCategoryProducts.length
        let products = this.getCategoryProducts.slice(this.currentPosL, this.currentPosR)
        if (this.listingPage) {
          this.setGtagProductsList({ isListingProducts: this.listingPage, products }, 'watch getCategoryProducts GTAGCategory.ts')
        }
        // let products = this.getCategoryProducts.slice(this.currentPosL, this.currentPosR)
        // this.$store.commit('google-gtag/SET_PRODUCT_LIST', {
        //   products: products,
        //   list: 'Category',
        //   label: 'Category: ' + this.getCurrentCategory.name,
        //   category: this.list
        // })
        this.currentPosL = this.getCategoryProducts.length */
      }
    }
  }
}
