<template>
  <div class="searchbar-show">
    <div
      class="searchpanel"
      data-testid="searchPanel"
      v-closable="hideSearchPanel"
    >
      <div class="container" ref="searchContainer">
        <div class="row">
          <div class="col-md-12 col-xs-12 end-xs">
            <label for="search" class="visually-hidden">
              {{ $t('Search') }}
            </label>
            <div class="search-input-group">
              <router-link
                :disabled="!search.length > 2"
                :event="search.length > 2 ? 'click' : ''"
                :style="!search.length > 2 ? 'cursor: default' : ''"
                :to="localizedRoute(formSubmitUrl)"
                title="Click to Search"
                class="search-action-btn"
              >
                <i
                  class="material-icons search-icon"
                  ref="searchIconRef"
                  @click="iConClick"
                >
                  search
                </i>
              </router-link>
              <form @submit.prevent="onSearchSubmit" class="new-searchformTag">
                <input
                  ref="search"
                  id="search"
                  v-model="search"
                  @input="makeSearch"
                  @blur="
                    $v.search.$touch();
                    removeborders();
                  "
                  class="search-panel-input"
                  autocomplete="off"
                  :placeholder="`Search...`"
                  @keyup="
                    someKeyUpFunction();
                    addborders();
                  "
                  @click="
                    searchClick();
                    showSearchPanel();
                    addborders();


                    closeMenu();
                  "
                  @keyup.enter="onEnter"
                />
                <div class="Desktop-search"   @click="
                onSearchSubmit();
                onEnter();
                removeborders();
              "><img data-v-1b40edbc="" src="/assets/icons/search.svg" alt="desktop search" class="search-icon-img"></div>
              </form>
            </div>
          </div>
        </div>
        <div
          id="search-mainmain"
          class="sb-filters"
          v-if="shouldShowProducts && search.length > 2"
        >
          <div class="fixedbut">
            <transition name="fade">
              <div
                v-if="getNoResultsMessage"
                class="no-results relative center-xs h4 col-md-12"
              >
                {{ $t(getNoResultsMessage) }}
              </div>
            </transition>
            <!-- <div
              v-if="visibleProducts.length && categories.length > 1"
              class="categories"
            >
              <category-panel
                :categories="categories"
                v-model="selectedCategoryIds"
              />
            </div> -->
            <div class="product-listing row">
              <ProductTileSearch
                v-for="(product, index) in visibleProducts"
                :key="index"
                :product="product"
                @click.native="
                  hideSearchPanel();
                  clearSearchBar();
                  onEnter(product);
                "
                @removeborders="removeborders()"
              />
            </div>
          </div>
          <div
            v-show="OnlineOnly && visibleProducts.length >= size"
            class="buttons-set align-center"
          >
            <button
              class="showresults"
              type="button"
              @click="
                onSearchSubmit();
                onEnter();
                removeborders();
              "
            >
              {{ $t('View All Results') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="custom-search-icon" ref="magnify"  @click="
                onSearchSubmit();
                onEnter();
                removeborders();
              ">
      <span 
      >
        <img src="/assets/icons/search.svg" alt="desktop search" />
      </span>
    </div>
  </div>
</template>

<script>
import SearchPanel from "@vue-storefront/core/compatibility/components/blocks/SearchPanel/SearchPanel"
import ProductTileSearch from "theme/components/core/ProductTileSearch"
import VueOfflineMixin from "vue-offline/mixin"
import CategoryPanel from "theme/components/core/blocks/Category/CategoryPanel"
import { minLength } from "vuelidate/lib/validators"
import config from 'config'
// import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
export default {
  name: "DesktopSearch",
  methods: {
    async searchRedirectMethodCall () {
      const searchRedirectRes = await this.$store.dispatch(
        'searchredirect/searchRedirectFunction',
        {}
      )
    },
    onEnter (p) {
      if (p) {
        this.suggestEvent(p.name)
      }
      this.$refs.searchContainer.classList.remove("show")
    },
    searchtoggle () {
      this.$refs.searchContainer.classList.toggle("show")
    },
    searchEvent () {
      if (config && config.bloomreach) {
        var searchData = {}
        searchData['q'] = this.query
        searchData['catalogs'] = [{ 'name': 'example_products' }]
        // BrTrk.getTracker().logEvent('suggest', 'submit', searchData, {}, true)
      }
    },
    suggestEvent (q) {
      if (config && config.bloomreach) {
        var searchData = {}
        searchData['aq'] = this.query
        searchData['q'] = q
        searchData['catalogs'] = [{ 'name': 'example_products' }]
        // BrTrk.getTracker().logEvent('suggest', 'submit', searchData, {}, true)
      }
    },
    addborders () {
      // if (this.shows) {
      this.$emit("rightborder", true)
      document.getElementById("search").classList.add("addborders")
      this.$refs.magnify.classList.add("leftborder")
      // }
    },
    removeborders () {
      // if (!this.shows) {
      this.$emit("rightborder", false)
      this.$refs.search.classList.remove("addborders")
      this.$refs.magnify.classList.remove("leftborder")
      // }
    },
    clearSearchBar () {
      this.search = ""
      document.getElementsByClassName('back-layout')[0].style.display = 'none'
    },
    hideSearchPanel () {
      this.showPanelNewDesktop = false
      document.getElementsByClassName('back-layout')[0].style.display = 'none'
    },
    iConClick () {
      this.showPanelNewDesktop = false
    },
    showSearchPanel () {
      this.showPanelNewDesktop = true
    },
    someKeyUpFunction () {
      this.showPanelNewDesktop = true
      if (document.getElementById("search-mainmain") != null) {
        document.getElementById("search-mainmain").className = "sb-filters"
        document.getElementsByClassName('back-layout')[0].style.display = 'block'
      } else {
        document.getElementsByClassName('back-layout')[0].style.display = 'none'
      }
      this.formSubmitUrl = '/catalog-search/?s=' + this.search
      // let savedRedirects = this.$store.state.searchredirect
      // if (savedRedirects.searchRedirectState) {
      //   savedRedirects.searchRedirectState.forEach(element => {
      //     if (element.query_text == this.search) {
      //       this.formSubmitUrl = element.redirect
      //     }
      //   })
      // }
    },
    searchClick () {
      if (document.getElementById("search-mainmain") != null) {
        document.getElementById("search-mainmain").className = "sb-filters"
      }
    },
    handleViewAllClick () {
      this.clearSearchBar()
      this.hideSearchPanel()
    },
    onSearchSubmit () {
      this.searchEvent()
      if (this.search.length > 2) {
        this.clearSearchBar()
        this.hideSearchPanel()
        this.$refs.searchIconRef.click()
      }
    },
    closeMenu () {
      this.$store.commit("ui/setOverlay", false)
      this.$store.commit("ui/setMicrocart", false)
      this.$store.commit("ui/setWishlist", false)
      this.$store.commit("ui/setSidebar", false)
      this.$store.dispatch("themeCart/closeEditMode")
      this.$store.dispatch("notification/removeNotification")
    },
  },
  directives: {
    closable: {
      bind: function (el, binding, vnode) {
        el.eventSetDrag = function () {
          el.setAttribute("data-dragging", "yes")
        }
        el.eventClearDrag = function () {
          el.removeAttribute("data-dragging")
        }
        el.eventOnClick = function (event) {
          var dragging = el.getAttribute("data-dragging")
          // Check that the click was outside the el and its children, and wasn't a drag
          if (
            !(el === event.target || el.contains(event.target)) &&
            !dragging
          ) {
            // call method provided in attribute value
            vnode.context[binding.expression](event)
          }
        }
        document.addEventListener("touchstart", el.eventClearDrag)
        document.addEventListener("touchmove", el.eventSetDrag)
        document.addEventListener("click", el.eventOnClick)
        document.addEventListener("touchend", el.eventOnClick)
      },
      unbind: function (el) {
        document.removeEventListener("touchstart", el.eventClearDrag)
        document.removeEventListener("touchmove", el.eventSetDrag)
        document.removeEventListener("click", el.eventOnClick)
        document.removeEventListener("touchend", el.eventOnClick)
        el.removeAttribute("data-dragging")
      },
    },
  },
  components: {
    ProductTileSearch,
    CategoryPanel,
  },
  mixins: [SearchPanel, VueOfflineMixin],
  validations: {
    search: {
      minLength: minLength(3),
    },
  },
  data () {
    return {
      selectedCategoryIds: [],
      showPanelNewDesktop: true,
      searchHidden: false,
      size: 3,
      formSubmitUrl: '',
      products: [],
      shows: false
    }
  },
  computed: {
    visibleProducts () {
      const productList = this.products || []
      if (this.selectedCategoryIds.length) {
        return productList.filter((product) =>
          product.category_ids.some((categoryId) => {
            const catId = parseInt(categoryId)
            return this.selectedCategoryIds.includes(catId)
          })
        )
      }
      if (productList.length === 1) {
        this.formSubmitUrl = '/' + productList[0].url_path
      }
      return productList
    },
    shouldShowProducts () {
      this.shows =
        this.visibleProducts.length >= !0 && this.showPanelNewDesktop
      return this.shows
    },
    categories () {
      if (this.products.length > 0) {
        const categories = this.products
          .filter((p) => p.category)
          .map((p) => p.category)
          .flat()
        const discinctCategories = Array.from(
          new Set(categories.map((c) => c.category_id))
        ).map((catId) => categories.find((c) => c.category_id === catId))
        return discinctCategories
      } else {
        return []
      }
    },
    getNoResultsMessage () {
      let msg = ""
      if (!this.$v.search.minLength) {
        msg = "Searched term should consist of at least 3 characters."
      } else if (this.emptyResults) {
        msg = "No results were found."
      }
      return msg
    },
  },
  watch: {
    categories () {
      this.selectedCategoryIds = []
    },
    // shows: {
    //   handler() {
    //     this.removeborders()
    //     this.addborders()
    //   },
    // },
    $route (to, from) {
      this.search = ''
    }
  },
  mounted () {
    // add autofocus to search input field
    //this.$refs.search.focus();
    this.search = ""
    // disableBodyScroll(this.$el);
    // this.searchRedirectMethodCall()
  },
  destroyed () {
    // clearAllBodyScrollLocks();
  }
};
</script>

<style lang="scss" scoped>
@import '~theme/css/animations/transitions';
@import '~theme/css/variables/grid';
@import '~theme/css/variables/typography';

@font-face {
  font-family: 'Oblik';
  src: url('/assets/fonts/Oblik_Bold.otf');
}

@media screen and (max-width: 767px) {
  .leftborder {
    top: 0 !important;
    border-top: 2px solid #e3e3e5;
  }
}

.showresults {
  background: none;
  color: #29275b;
  border: none;
  font-family: 'oblik';
  font-size: 19px;
  margin-top: 13px;
}

.sb-filters.dontshow {
  display: none;
}
.fixedbut::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
  border-radius: 5px;
}

.fixedbut::-webkit-scrollbar {
  width: 5px;
  background-color: #f5f5f5;
  border-radius: 5px;
}
.fixedbut::-webkit-scrollbar-thumb {
  background-color: #676566;
  border-radius: 5px;
}
@media screen and (min-width: 768px) {
  .addborders {
    border: 1px solid #29a795 !important;
  }
}
@media screen and (min-width: 768px) {
  .categories {
    padding-left: 15px;
    padding-right: 15px;
  }
  .product {
    padding-left: 15px;
    padding-right: 15px;
  }
}

@media screen and (max-width: 767px) {
  .categories {
    padding-left: 15px;
    padding-right: 15px;
  }
}

.custom-search-icon {
  display: none;
}

.searchbar-show {
  margin-top: 3px;
}

.searchpanel {
  visibility: visible;
  position: relative;
  margin-right: 0px;
  margin-top: 10px;

  .container {
    padding-left: 0px;
    padding-right: 49px;

    .sb-filters {
      position: absolute;
      background-color: #ffffff;
      z-index: 9;
      padding: 0px 9px 10px 9px;
      top: 47px;
      right: 59px;
      width: 100%;
      max-width: 396px;
      border: 2px solid #29a795;
      border-top: none;
      @media screen and (max-width: 767px) {
        border: 3px solid #168ae5;
        position: absolute;
        background-color: #ffff;
        z-index: 9;
        padding: 10px 7px 10px 15px;
        top: 48px;
        left: 71px;
        width: calc(100% - 155px);
        max-width: 80.2%;
        border: 2px solid #e4e4e4;
        border-top: none;
      }
      @media (max-width: 1199px) and (min-width: 991px) {
        top: 47px;
        right: auto;
        width: 100%;
        max-width: 343px;
        left: 25px;
      }
      @media (max-width: 991px) and (min-width: 768px) {
        right: auto;
        width: 100%;
        max-width: 249px;
        left: 25px;
        top: 47px;
      }
    }

    @media #{$media-xs} {
      padding-left: 30px;
      padding-right: 30px;
    }

    .search-input-group {
      position: relative;
      border: none;
      justify-content: flex-end;

      input {
        max-width: 406px;
        height: 45px;
        width: 100%;
        border: 1px solid #333333;
        font-size: 0.839375rem;
        padding-left: 0.5rem;
        background-color: #F2F2F2;
        color: #333333;
        font-family: 'Oblik';
        margin-right: 10px;
        z-index: 3;
        position: relative;
      }

      .search-icon {
        width: auto;
        height: 100%;
        font-size: 36px;
        color: #d6de29;
      }
    }
  }

  a.underline:after,
  a:not(.no-underline):hover:after {
    content: none;
  }

  .row {
    margin-left: -map-get($grid-gutter-widths, lg) / 2;
    margin-right: -map-get($grid-gutter-widths, lg) / 2;
    @media #{$media-xs} {
      margin-right: -map-get($grid-gutter-widths, xs) / 2;
      margin-left: -map-get($grid-gutter-widths, xs) / 2;
    }
  }

  .col-md-12 {
    @media #{$media-xs} {
      padding-left: map-get($grid-gutter-widths, xs) / 2;
      padding-right: map-get($grid-gutter-widths, xs) / 2;
    }
  }
  .product {
    box-sizing: border-box;
    width: 33.33%;
    padding-left: map-get($grid-gutter-widths, lg) / 2;
    padding-right: map-get($grid-gutter-widths, lg) / 2;
    padding-top: 21px;
    @media #{$media-xs} {
      width: 50%;
      padding-left: 15px;
      padding-right: 15px;
    }
  }

  .close-icon {
    padding: 18px 8px;
  }

  .search-input-group {
    display: flex;
    border-bottom: 1px solid #bdbdbd;
  }

  .search-icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-panel-input {
    width: 100%;
    height: 60px;
    padding-bottom: 0;
    padding-top: 0;
    border: none;
    outline: 0;
    font-size: 18px;
    font-family: map-get($font-families, secondary);
    @media #{$media-xs} {
      font-size: 16px;
    }
  }

  .no-results {
    top: -1px;
    width: 100%;
  }

  i {
    // opacity: 0.6;
  }

  i:hover {
    opacity: 1;
  }

  .close-button {
    background: #fff;
  }

  button {
    @media #{$media-xs} {
      width: 100%;
      margin-bottom: 15px;
    }
  }
  @media screen and (max-width: 767px) {
    margin-top: 4px;
  }
}

.search-action-btn {
  position: absolute;
  right: 0px;
  top: 3px;
  width: auto;
  height: 100%;
}

.new-searchformTag {
  width: 100%;
  position: relative;
}
@media (max-width: 767px) {
  .searchbar-show {
    width: 100%;
    background-color: #fff;
    margin: 0px;
    position: relative;
  }
  #active-icon {
    visibility: visible;
  }
  .custom-search-icon {
    display: block;
    position: absolute !important;
    top: 2px;
    right: 13px;
    height: 35px;
    width: 35px;
    background-color: #ffffff;
    border-bottom: 2px solid #e3e3e5;
    border-left: 2px solid #e3e3e5;
    z-index: 99;

    img {
      height: 18px;
      position: absolute;
      margin-top: 10px;
      margin-left: 10px;
    }
  }
  .search-bar {
    .searchpanel {
      .container {
        width: 100%;
        display: block;
        padding-left: 15px;
        padding-right: 15px;

        .search-input-group {
          margin: 0px;
          width: 100%;

          input {
            border-radius: 0;
            border: 2px solid #e3e3e5;
            max-width: 100%;
            height: 35px;
            background-color: #f7f6f6;
            color: #434343;
            font-family: sans-serif;
            font-weight: bold;
            line-height: 17px !important;
            margin: 0px;
            padding: 0px;
            padding-left: 4rem;
            -webkit-appearance: none;
          }

          .search-icon {
            top: 0;
            color: #d6de29;

            &::after {
              top: 10px;
            }
          }
        }

        .sb-filters {
          position: absolute;
          background-color: #ffffff;
          z-index: 9;
          padding: 0px 0px 0px 0px;
          top: 37px;
          left: 52px;
          width: calc(100% - 104px);
          max-width: 86.2%;
          border: 2px solid #e4e4e4;
          border-top: none;
          overflow: auto;
          overflow: auto;
          @media screen and (max-width: 767px) {
            border-left: 2px solid #29a795 !important;
            border-right: 2px solid #29a795 !important;
            border-bottom: 2px solid #29a795 !important;
          }
        }
      }
    }
  }
  .new-searchformTag {
    display: flex;
  }
  .search-action-btn {
    top: 0;
    right: 40px;
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .searchbar-show {
    margin-left: 1px;
  }
}
@media (min-width: 768px) and (max-width: 1200px) {
  .searchpanel .product {
    width: 50%;
  }
  .searchpanel .container {
    padding-left: 25px;
    padding-right: 0px;
    margin-top: 11px;
  }
}

@media (min-width: 768px) {
  .search-bar .searchpanel .container {
    display: block !important;
  }
}

.container.show {
  display: block !important;
}
.search-icon {
  display: none !important;
}
.Desktop-search{
   cursor: pointer;
    position: absolute;
    right: 13px;
    top: 16px;
}
.search-icon-img{
  height: 18px;
    position: absolute;
    z-index: 999;
}
@media screen and (max-width: 767px){
.Desktop-search {
    display: none;
}
}
@media screen and (min-width: 1200px){
.Desktop-search{
    right: 35px;
}
}
</style>
