<template>
<div v-if="loaded">
  <div id="category">
    <UspBar />
    <header>
      <div class="container">
        <breadcrumbs />
        <div
          class
          itemprop="review"
          itemscope
          itemtype="http://schema.org/Organization"
        >
          <meta itemprop="url" :content="webUrl" />
          <meta itemprop="name" :content="title" />
          <meta itemprop="logo" :content="webUrl + logo" />
        </div>
          <!-- <div class="row middle-sm">
          <h1 class="col-sm-8 category-title mb10">{{ getCurrentCategory.name }}</h1>
          <div class="sorting col-sm-2 align-right mt50">
            <label class="mr10">{{ $t('Columns') }}:</label>
            <columns @change-column="columnChange" />
          </div>
          <div class="sorting col-sm-2 align-right mt50">
            <sort-by :has-label="true" @change="changeFilter" :value="getCurrentSearchQuery.sort" />
          </div>
        </div>-->
      </div>
      <div class="container pb10">
        <div class="col-md-12 px10 border-box products-list">
          <div class="category-page-banner-text">
            <h1>{{ getCurrentCategory.name }}</h1>
          </div>
        </div>
        <div class="category-description category-description-top">
          <CategoryDescriptionTop v-if="getCmsBlockTopId" :id="getCmsBlockTopId" />
        </div>
      </div>
      <div class="container">
         <div class="sort-by-mobile"> {{ getCategoryProductsTotal }} Items</div>
        <div class="row m0">
          <div class="mobile-filter col-xs-6 mt25">
            <button class="mobile-filters-button" @click="openFilters">
              {{ $t("Filters") }}
            </button>
          </div>
          <div class="mobile-sorting col-xs-6 mt25">
            <sort-by
              @change="changeFilter"
              :value="getCurrentSearchQuery.sort"
            />
          </div>
        </div>
      </div>
    </header>
    <div class="container pb60">
      <div class="row m0 pt15">
        <div class="col-md-3 start-xs category-filters">
          <sidebar
            :filters="getSortedFilters"
            @changeFilter="changeFilter"
          />
        </div>
        <div class="col-md-3 start-xs mobile-filters" v-show="mobileFilters">
          <div class="close-container absolute w-100">
            <i class="material-icons p15 close cl-accent" @click="closeFilters"
              >close</i
            >
          </div>
          <sidebar
            class="mobile-filters-body"
            :filters="getSortedFilters"
            @changeFilter="changeFilter"
          />
          <div class="relative pb20 pt15">
            <div class="brdr-top-1 brdr-cl-primary absolute divider w-100" />
          </div>
          <button-full class="mb20 btn__filter" @click.native="closeFilters">{{
            $t("Filter")
          }}</button-full>
        </div>
        <div class="col-md-9 px10 border-box products-list">
          <div
            class="col-xs-12 end-md m0 pb20 hidden-xs sb-item-number start-end"
          >
            <h1 class="hidden only-h1-tag">{{ getCurrentCategory.name }}</h1>
            <div class="sort-by-desktop">
              <sort-by
                :has-label="true"
                @change="changeFilter"
                :value="getCurrentSearchQuery.sort"
              />
              {{ getCategoryProductsTotal }} Items
              <!-- {{ $t("{count} items", { count: getCategoryProductsTotal }) }} -->
            </div>
          </div>
          <!-- <p
            class="col-xs-12 end-md m0 pb20 cl-secondary"
          >{{ $t('{count} items', { count: getCategoryProductsTotal }) }}</p>-->
          <div v-if="isCategoryEmpty" class="hidden-xs">
            <h4 data-testid="noProductsInfo">{{ $t("No products found!") }}</h4>
            <p>
              {{
                $t(
                  "Please change Your search criteria and try again. If still not finding anything relevant, please visit the Home page and try out some of our bestsellers!"
                )
              }}
            </p>
          </div>
          <lazy-hydrate
            :trigger-hydration="!loading"
            v-if="isLazyHydrateEnabled"
          >
            <product-listing
              :columns="defaultColumn"
              :products="getCategoryProducts"
              :filters="getAvailableFilters"
              :searchPage="false"
            /> 
          </lazy-hydrate>
          <product-listing
            v-else
            :columns="defaultColumn"
            :products="getCategoryProducts"
            :filters="getAvailableFilters"
            :searchPage="false"
          />
          <!-- v-if"getCategoryProducts.length < getCategoryProductsTotal"
          {{getCategoryProducts.length}}
          {{getCategoryProductsTotal}}
          {{getCategoryProducts.length < getCategoryProductsTotal}}
          {{getCategoryProducts.length === getCategoryProductsTotal}}
          {{!(getCategoryProducts.length === getCategoryProductsTotal)}} -->
         <!-- <product-listing
         :columns="defaultColumn"
         :products="getCategoryProducts"
         :filters="getAvailableFilters"
         :seeMore="!(getCategoryProducts.length === getCategoryProductsTotal)"
         @loadMore="onLoadMore()"
          /> -->
          <div class="align-center" v-if="!(getCategoryProducts.length === getCategoryProductsTotal)
          ">
          <button class="load-btn" @click="onLoadMore()">Load More</button>
    </div>
        </div>
      </div>
    </div>
    <div class="category-description">
      <CategoryDescription v-if="getCmsBlockId" :id="getCmsBlockId" />
    </div>
  </template>
  </div>
</div>
</template>
<script>
import LazyHydrate from "vue-lazy-hydration";
//import Sidebar from '../components/core/blocks/Category/Sidebar.vue'
import ProductListing from "../components/core/ProductListing.vue";
import Breadcrumbs from "../components/core/Breadcrumbs.vue";
import SortBy from "../components/core/SortBy.vue";
import { isServer } from "@vue-storefront/core/helpers";
import { Logger } from "@vue-storefront/core/lib/logger";
import { getSearchOptionsFromRouteParams } from "@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers";
import config from "config";
import Columns from "../components/core/Columns.vue";
import ButtonFull from "theme/components/theme/ButtonFull.vue";
import { mapGetters } from "vuex";
import onBottomScroll from "@vue-storefront/core/mixins/onBottomScroll";
import rootStore from "@vue-storefront/core/store";
import { catalogHooksExecutors } from "@vue-storefront/core/modules/catalog-next/hooks";
import {
  localizedRoute,
  currentStoreView,
} from "@vue-storefront/core/lib/multistore";
import { htmlDecode } from "@vue-storefront/core/filters";
import ActiveFilters from "src/modules/vsf-l-navigation/components/ActiveFilters.vue";
import Sidebar from "src/modules/vsf-l-navigation/components/Sidebar";
import UspBar from "theme/components/theme/blocks/UspBar/UspBar";
import CmsBlock from "theme/components/core/blocks/Cms/Block";
import CategoryDescription from "theme/components/core/blocks/CategoryDescription/CategoryDescription";
import CategoryDescriptionTop from "theme/components/core/blocks/CategoryDescription/CategoryDescriptionTop";
import { GTAGCategory } from "src/modules/google-gtag/mixins/GTAGCategory";
const THEME_PAGE_SIZE = 50;
const composeInitialPageState = async (store, route, forceLoad = false) => {
  try {
    const filters = getSearchOptionsFromRouteParams(route.params);
    const cachedCategory = store.getters["category-next/getCategoryFrom"](
      route.path
    );
    const currentCategory =
      cachedCategory && !forceLoad
        ? cachedCategory
        : await store.dispatch("category-next/loadCategory", { filters });
    const pageSize = store.getters["url/isBackRoute"]
      ? store.getters["url/getCurrentRoute"].categoryPageSize
      : THEME_PAGE_SIZE;
    await store.dispatch("category-next/loadCategoryProducts", {
      route,
      category: currentCategory,
      pageSize,
    });
    const breadCrumbsLoader = store.dispatch(
      "category-next/loadCategoryBreadcrumbs",
      {
        category: currentCategory,
        currentRouteName: currentCategory.name,
        omitCurrent: true,
      }
    );

    if (isServer) await breadCrumbsLoader;
    catalogHooksExecutors.categoryPageVisited(currentCategory);
  } catch (e) {
    Logger.error(
      "Problem with setting Category initial data!",
      "category",
      e
    )();
  }
};

export default {
  components: {
    LazyHydrate,
    ButtonFull,
    ProductListing,
    Breadcrumbs,
    Sidebar,
    SortBy,
    Columns,
    ActiveFilters,
    UspBar,
    CmsBlock,
    CategoryDescription,
    CategoryDescriptionTop,
  },
  mixins: [ GTAGCategory],
  data() {
    return {
      mobileFilters: false,
      defaultColumn: 3,
      loadingProducts: false,
      loading: true,
      webUrl: "bedfactorydirect.co.uk",
      logo: "assets/logo.svg",
      title: "heyy",
      breadcrumbs: [],
      loaded: false,
    };
  },
  created(){
  var self = this;
  self.$nextTick(function() {
  self.loaded = true;
  // console.log("1122336655 Helloo its created" ,this.getSortedFilters);
  })
  },
  watch: {
    "$route.name": function () {
      // console.log("1122336655 route changes ",this.getSortedFilters);
      },
  },
  computed: {
    ...mapGetters({
      getCurrentSearchQuery: "category-next/getCurrentSearchQuery",
      getCategoryProducts: "category-next/getCategoryProducts",
      getCurrentCategory: "category-next/getCurrentCategory",
      getCategoryProductsTotal: "category-next/getCategoryProductsTotal",
      getAvailableFilters: "category-next/getAvailableFilters",
      getBreadcrumbsCurrent: "breadcrumbs/getBreadcrumbsCurrent",
      getBreadcrumbsRoutes: "breadcrumbs/getBreadcrumbsRoutes",
    }),
    isLazyHydrateEnabled() {
      return config.ssr.lazyHydrateFor.includes("category-next.products");
    },
    isCategoryEmpty() {
      return this.getCategoryProductsTotal === 0;
    },
    getCmsBlockId() {
      return this.getCurrentCategory.landing_page;
    },
    getCmsBlockTopId() {
      return this.getCurrentCategory.cms_block;
    },
    getSortedFilters() {
     // let catFilters = Object.assign({}, this.getAvailableFilters);
       let catFilters = this.getAvailableFilters;
       if (catFilters && catFilters.filter_size){
      let size = catFilters["filter_size"];
      // console.log(
      //   "1122336655 in sort filter function ", this.getAvailableFilters,catFilters,
      //   typeof catFilters,
      //   catFilters["filter_size"],"\n\n\n 23456789 ",size
      // );
      
      // catFilters.filter_size.forEach(() => {});
      // for (let a in catFilters.filter_size) {
      //   for (let b in catFilters.filter_size) {
      //     console.log("a is ", catFilters.filter_size[a].id, "\n b is ", catFilters.filter_size[b].id);
      //      let keyA = catFilters.filter_size[a].id,
      //      keyB = catFilters.filter_size[b].id;
      //   }
      // }
      let newcat={};
      
        catFilters.filter_size.sort(function (a, b) {
        console.log("\n\n\n\n");
        for (let c in catFilters.filter_size) {
          console.log("id at ",c," is ", catFilters.filter_size[c].id );
        }
        for (let c in newcat) {
          if(newcat[c])
          if(newcat[c].id)
          console.log("\n\n\n\nNEW id at ",c," is ", newcat[c].id);
        }
        console.log("\n\n\n\n");
        
      
        console.log("a is ", a, "\n b is ", b);
        var keyA = parseInt (a.id),
          keyB = parseInt(b.id);
        console.log(
          "keys are \n key A : ",
          keyA, typeof keyA,
          "\tkey B:  ",
          keyB,
          "keyA < keyB : ",
          keyA < keyB,
          "keyA > keyB : ",
          keyA > keyB
        );
        if (keyA < keyB) {
          console.log("A is less than b ");
          newcat[a] = catFilters.filter_size[a]
          return -1;
        }
        if (keyA > keyB) {
          console.log("A is greater than b ");
          newcat[a] = catFilters.filter_size[b]
          return 1;
          
        }
         
       
      });
      // console.log("1122336655 ",catFilters);
      // console.log("112233665577 mattress filters ",catFilters.mattress_type && catFilters.mattress_type.length>0);
      }
      // if (catFilters && catFilters.mattress_type && catFilters.mattress_type.length>0){
      //   console.log("112233665577 It has mattress filters ");
      //   }
      return catFilters;
    },
  },
  async asyncData({ store, route, context }) {
    // this is for SSR purposes to prefetch data - and it's always executed before parent component methods
    if (context) context.output.cacheTags.add("category");
    await composeInitialPageState(store, route);
  },
  async beforeRouteEnter(to, from, next) {
    if (isServer) next();
    // SSR no need to invoke SW caching here
    else if (!from.name) {
      // SSR but client side invocation, we need to cache products and invoke requests from asyncData for offline support
      next(async (vm) => {
        vm.loading = true;
        await composeInitialPageState(vm.$store, to, true);
        await vm.$store.dispatch("category-next/cacheProducts", { route: to }); // await here is because we must wait for the hydration
        vm.loading = false;
      });
    } else {
      // Pure CSR, with no initial category state
      next(async (vm) => {
        vm.loading = true;
        vm.$store.dispatch("category-next/cacheProducts", { route: to });
        vm.loading = false;
      });
    }
  },
  methods: {
   
    openFilters() {
      this.mobileFilters = true;
    },
    closeFilters() {
      this.mobileFilters = false;
    },
    async changeFilter(filterVariant) {
      this.$store.dispatch("category-next/switchSearchFilters", [
        filterVariant,
      ]);
    },
    columnChange(column) {
      this.defaultColumn = column;
    },
    async onBottomScroll() {
      if (this.loadingProducts) return;
      this.loadingProducts = true;
      try {
        await this.$store.dispatch("category-next/loadMoreCategoryProducts"); 
      } catch (e) {
        Logger.error("Problem with fetching more products", "category", e)();
      } finally {
        this.loadingProducts = false;
      }
    },
    async onLoadMore() {
      console.log("Event Triggered");
      if (this.loadingProducts) return;
      this.loadingProducts = true;
      try {
        await this.$store.dispatch("category-next/loadMoreCategoryProducts"); 
      } catch (e) {
        Logger.error("Problem with fetching more products", "category", e)();
      } finally {
        this.loadingProducts = false;
      }
    },
  },
  metaInfo() {
    const storeView = currentStoreView();
    const {
      meta_title,
      meta_description,
      name,
      slug,
    } = this.getCurrentCategory;
    const meta = meta_description
      ? [
          {
            vmid: "description",
            name: "description",
            content: htmlDecode(meta_description),
          },
        ]
      : [];
    /* const categoryLocaliedLink = localizedRoute({
      name: 'category-amp',
      params: { slug }
    }, storeView.storeCode)
    const ampCategoryLink = this.$router.resolve(categoryLocaliedLink).href */
    const categoryLocaliedLink = localizedRoute(
      {
        name: 'category-amp',
        params: { slug }
      },
      storeView.storeCode
    )
  // const ampCategoryLink = this.$router.resolve(categoryLocaliedLink).href
    const canonicalCategoryLink = this.getCurrentCategory.canonical_url ? this.getCurrentCategory.canonical_url : config.api.url + this.getCurrentCategory.url_path

    return {
      link: [{ rel: 'canonical', href: canonicalCategoryLink }],
      title: htmlDecode(meta_title || name),
      titleTemplate: '%s',
      meta
    }
    // return {
    //   // link: [ { rel: 'amphtml', href: ampCategoryLink } ],
    //   title: htmlDecode(meta_title || name),
    //   meta,
    // };
  },
  mounted() {
    // console.log("1122336655 in mounted ",this.getSortedFilters);
    this.webUrl = config.api.url;
    this.title = config.seo.defaultTitle;
  },
};
</script>
<style lang="scss" scoped>
html {
  -webkit-text-size-adjust: 100%; /* Prevent font scaling in landscape while allowing user zoom */
}
.sort-by-mobile{
  display: none;
}
.load-btn{
  background-color: #4dba87;
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 0px 0px;
  cursor: pointer;
  padding: 16px 23px 16px 23px;
  font-weight: bold;
  width: 180px;
}
.align-center{
  height: 50px;
    text-align: center;
}
.category-listing {
  padding: 50px 0px 0px 0px;
}

.cl-secondary .sort-by {
  margin-right: 15px;
}

.btn {
  &__filter {
    min-width: 100px;
  }
}

.sticky {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  bottom: 0;
  background-color: #f2f2f2;
  margin-left: -25px;
  margin-right: -25px;
  z-index: 100;
}

.divider {
  width: calc(100vw - 8px);
  bottom: 20px;
  left: -36px;
}

.category-filters {
  width: 242px;
}

.mobile-filters {
  display: none;
  overflow: auto;
}

.mobile-filters-button {
  display: none;
}

.mobile-sorting {
  display: none;
}

.category-title {
  line-height: 65px;
}

.sorting {
  label {
    margin-right: 10px;
  }
}

.sb-item-number {
  color: rgb(128, 136, 152);
  font-size: 0.9325rem;
  font-family: "Poppins", sans-serif;
  height: 100%;
  max-height: 56px;
}

#category {
  background: #feffff;
  // border-top: 1px solid #e2e2e2;
}

.sort-by-desktop {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.category-page-banner-text {
  /* border: 2px solid #f4f8fb; */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  flex-direction: column;
  padding: 20px;
}

.category-page-banner-text h1 {
  font-size: 40px;
  color: #54575b;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  margin: 0;
  /* text-transform: uppercase; */
}

@media (max-width: 64em) {
  // .products-list {
  //   max-width: 530px;
  // }
}

@media (max-width: 767px) {
  .sort-by-mobile {
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
    line-height: 0em;
    color: rgb(128, 136, 152);
  font-size: 0.9325rem;
  font-family: "Poppins", sans-serif;
  height: 100%;
  max-height: 56px;
} 
  .category-title {
    margin: 0;
    font-size: 36px;
    line-height: 40px;
  }

  .products-list {
    width: 100%;
    max-width: none;
  }

  .mobile-filters {
    display: block;
  }

  .mobile-filters-button {
    display: block;
    height: 45px;
  }

  .sorting {
    display: none;
  }

  .mobile-sorting {
    display: block;
  }

  .category-filters {
    // display: none;
  }

  // .product-listing {
  //   justify-content: center;
  // }

  .mobile-filters {
    position: fixed;
    background-color: #f2f2f2;
    z-index: 5;
    padding: 0 40px;
    left: 0;
    width: 100vw;
    height: 100vh;
    top: 0;
    box-sizing: border-box;
  }

  .mobile-filters-body {
    padding-top: 0px;
  }
}

.close-px15 {
  left: 0;
}

.close {
  margin-left: auto;
}

@media (max-width: 767px) {
  .mobile-filters-button {
    display: block;
    border: 2px solid #e7e7e7;

    height: 35px;
    border-radius: 5px;
    color: #54575b;
    font-size: 0.8rem;
    font-family: "Poppins", sans-serif;
    background: #f5f7fa
      url("/assets/category-images/category-filer-mobile-icon.png") no-repeat
      95% 55%;
    text-align: left;
    width: 95%;
    float: right;
  }
  .sort-by-desktop {
    display: none;
  }
  .category-filters {
    display: none;
  }
  .mobile-filter-main {
    margin-bottom: 1rem;
  }
}
</style>
<style lang="scss">
html {
  -webkit-text-size-adjust: 100%; /* Prevent font scaling in landscape while allowing user zoom */
}

.category-description-inner p {
  font-size: 0.875rem;
  color: #54575b;
  font-family: "Poppins", sans-serif;
  display: inline;
}

.category-description-inner span {
  font-style: italic;
  font-size: 0.875rem;
  color: #54575b;
  font-family: "Poppins", sans-serif;
}

.category-description-inner {
  width: 85%;
  margin: 0 auto;
  text-align: center;
}

.products-list .sort-by {
  width: 160px;
}

.bgimg {
  height: 100%;
  position: relative;
  font-size: 25px;
}

.topleft {
  display: flex;
  justify-content: center;
}

.middle {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-align: center;
  background-color: #eeee;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.topleft img {
  width: 100%;
}
.only-h1-tag {
  display: none;
}
.category-description-top {
  margin-top: 15px;
}
.category-description-top .block-content {
  padding: 0;
}
</style>
