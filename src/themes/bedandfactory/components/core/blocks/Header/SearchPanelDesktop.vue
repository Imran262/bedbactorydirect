<template>
  <div
    class="searchpanel"
    data-testid="searchPanel"
    v-closable="hideSearchPanel"
  >
    <!-- <div class="close-icon-row">
<i
class="material-icons pointer cl-accent close-icon"
@click="closeSearchpanel"
data-testid="closeSearchPanel"
>close</i>
    </div>-->
    <div class="container">
      <div class="row">
        <div class="col-md-12 col-xs-12 end-xs">
          <label for="search" class="visually-hidden">{{ $t("Search") }}</label>
          <div class="search-input-group">
            <router-link
              :disabled="!search.length > 2"
              :event="search.length > 2 ? 'click' : ''"
              :style="!search.length > 2 ? 'cursor: default' : ''"
              :to="localizedRoute('/search-result-page/?s=' + search)"
              class="search-action-btn search-button"
            >
              <i
                class="material-icons search-icon"
                ref="searchIconRef"
                @click="iConClick"
                >search</i
              >
            </router-link>
            <form @submit.prevent="onSearchSubmit" class="new-searchformTag">
              <input
                ref="search"
                id="search"
                v-model="search"
                @input="makeSearch"
                @blur="$v.search.$touch()"
                class="search-panel-input"
                autocomplete="off"
                :placeholder="$t('What are you looking for?')"
                @keyup="someKeyUpFunction"
                @click="
                  searchClick();
                  showSearchPanel();
                "
              />
            </form>
          </div>
        </div>
      </div>
      <!-- <div
v-if="visibleProducts.length && categories.length > 1"
class="categories"
>
<category-panel
:categories="categories"
v-model="selectedCategoryIds"
/>
      </div>-->
      <div
        id="search-mainmain"
        class="sb-filters dontshow"
        v-if="shouldShowProducts"
      >
        <transition name="fade">
          <div
            v-if="getNoResultsMessage"
            class="no-results relative center-xs h4 col-md-12"
          >
            {{ $t(getNoResultsMessage) }}
          </div>
        </transition>
        <div class="product-listing row">
          <product-tile
            v-for="product in visibleProducts"
            :key="product.id"
            :product="product"
            @click.native="
              hideSearchPanel();
              clearSearchBar();
            "
          />
        </div>
        <div
          v-show="OnlineOnly && visibleProducts.length >= size"
          class="buttons-set align-center"
        >
          <button
            class="no-outline brdr-none py15 px20 bg-cl-mine-shaft :bg-cl-th-secondary cl-white fs-medium-small"
            type="button"
            @click="onSearchSubmit"
          >
            {{ $t("View All Results") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchPanel from "@vue-storefront/core/compatibility/components/blocks/SearchPanel/SearchPanel";
import ProductTile from "theme/components/core/ProductTile";
import VueOfflineMixin from "vue-offline/mixin";
import CategoryPanel from "theme/components/core/blocks/Category/CategoryPanel";
import { minLength } from "vuelidate/lib/validators";
// import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

export default {
  methods: {
    clearSearchBar() {
      this.search = "";
    },
    hideSearchPanel() {
      this.showPanelNew = false;
    },
    iConClick() {
      this.showPanelNew = false;
    },
    showSearchPanel() {
      this.showPanelNew = true;
    },
    someKeyUpFunction() {
      if (document.getElementById("search-mainmain") != null) {
        document.getElementById("search-mainmain").className = "sb-filters";
      }
    },
    searchClick() {
      if (document.getElementById("search-mainmain") != null) {
        document.getElementById("search-mainmain").className = "sb-filters";
      }
    },
    handleViewAllClick() {
      this.clearSearchBar();
      this.hideSearchPanel();
      // Route to search page
      // console.log('searchsearch', this.search);
      // this.$router.replace('/search-result-page/?s=' + this.search);
    },
    onSearchSubmit() {
      console.log("onSearchSubmit", this.search);
      if (this.search.length > 2) {
        this.clearSearchBar();
        this.hideSearchPanel();
        this.$refs.searchIconRef.click();
      }
    }
  },
  directives: {
    closable: {
      bind: function(el, binding, vnode) {
        el.eventSetDrag = function() {
          el.setAttribute("data-dragging", "yes");
        };
        el.eventClearDrag = function() {
          el.removeAttribute("data-dragging");
        };
        el.eventOnClick = function(event) {
          var dragging = el.getAttribute("data-dragging");
          // Check that the click was outside the el and its children, and wasn't a drag
          if (
            !(el === event.target || el.contains(event.target)) &&
            !dragging
          ) {
            // call method provided in attribute value
            vnode.context[binding.expression](event);
          }
        };
        document.addEventListener("touchstart", el.eventClearDrag);
        document.addEventListener("touchmove", el.eventSetDrag);
        document.addEventListener("click", el.eventOnClick);
        document.addEventListener("touchend", el.eventOnClick);
      },
      unbind: function(el) {
        document.removeEventListener("touchstart", el.eventClearDrag);
        document.removeEventListener("touchmove", el.eventSetDrag);
        document.removeEventListener("click", el.eventOnClick);
        document.removeEventListener("touchend", el.eventOnClick);
        el.removeAttribute("data-dragging");
      }
    }
  },
  components: {
    ProductTile
  },
  mixins: [SearchPanel, VueOfflineMixin],
  validations: {
    search: {
      minLength: minLength(3)
    }
  },
  data() {
    return {
      selectedCategoryIds: [],
      showPanelNew: false,
      size: 6
    };
  },
  computed: {
    visibleProducts() {
      const productList = this.products || [];
      if (this.selectedCategoryIds.length) {
        return productList.filter(product =>
          product.category_ids.some(categoryId => {
            const catId = parseInt(categoryId);
            return this.selectedCategoryIds.includes(catId);
          })
        );
      }
      return productList;
    },
    shouldShowProducts() {
      return this.visibleProducts.length >= !0 && this.showPanelNew;
    },
    // categories () {
    // const categories = this.products
    // .filter(p => p.category)
    // .map(p => p.category)
    // .flat();

    // const discinctCategories = Array.from(
    // new Set(categories.map(c => c.category_id))
    // ).map(catId => categories.find(c => c.category_id === catId));

    // return discinctCategories;
    // },
    getNoResultsMessage() {
      let msg = "";
      if (!this.$v.search.minLength) {
        msg = "Searched term should consist of at least 3 characters.";
      } else if (this.emptyResults) {
        msg = "No results were found.";
      }
      return msg;
    }
  },
  watch: {
    categories() {
      this.selectedCategoryIds = [];
    }
  },
  mounted() {
    // add autofocus to search input field
    //this.$refs.search.focus();
    this.search = "";
    // disableBodyScroll(this.$el);
  },
  destroyed() {
    // clearAllBodyScrollLocks();
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/css/animations/transitions";
@import "~theme/css/variables/grid";
@import "~theme/css/variables/typography";

a:link {


  text-decoration: none;


}


a:visited {


  text-decoration: none;


}


a:hover {


  text-decoration: none;


}


a:active {


  text-decoration: none;


}
.sb-filters.dontshow {
  display: none;
}
.categories {
  display: none;
}
.search-button:hover {
  text-decoration: none;
}
.searchpanel {
  position: relative;
  .container {
    padding-left: 40px;
    padding-right: 40px;
    .sb-filters {
      position: absolute;
      background-color: #ffff;
      z-index: 9;
      padding: 10px;
      top: 64px;
      right: 45px;
      width: 100%;
      max-width: 521px;
    }
    @media #{$media-xs} {
      padding-left: 30px;
      padding-right: 30px;
    }
    .search-input-group {
      position: relative;
      border: none;
      justify-content: flex-end;
      padding-top: 1.25rem;

      input {
        max-width: 430px;
        height: 2.625rem;
        border-radius: 3px;
        width: 100%;
        border: 1px solid #bfc3cb;
        font-size: 0.839375rem;
        padding-left: 0.5rem;
      }
      .search-icon {
        // position: absolute;
        // right: 10px;
        // top: 10px;
        width: auto;
        height: 100%;
        &::after {
          content: "";
          border: 1px solid #efefef;
          position: absolute;
          right: 35px;
          top: 20px;
          height: 20px;
        }
      }
    }
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
    padding-left: map-get($grid-gutter-widths, lg) / 2;
    padding-right: map-get($grid-gutter-widths, lg) / 2;

    @media #{$media-xs} {
      padding-left: map-get($grid-gutter-widths, xs) / 2;
      padding-right: map-get($grid-gutter-widths, xs) / 2;
    }
  }

  .product-listing {
    padding-top: 30px;
    overflow-y: scroll;
    height: 510px;
  }

  .product {
    box-sizing: border-box;
    width: 33.33%;
    padding-left: map-get($grid-gutter-widths, lg) / 2;
    padding-right: map-get($grid-gutter-widths, lg) / 2;

    @media #{$media-xs} {
      width: 50%;
      padding-left: map-get($grid-gutter-widths, xs) / 2;
      padding-right: map-get($grid-gutter-widths, xs) / 2;
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
    font-family: 'Poppins', sans-serif;

    @media #{$media-xs} {
      font-size: 16px;
    }
  }

  .no-results {
    top: 5px;
    width: 100%;
  }

  i {
    opacity: 0.6;
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
}
.search-action-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  width: auto;
  height: 100%;
}
.search-action-btn:hover:after{
content: unset;
}
.new-searchformTag {
  width: 100%;
}
.buttons-set {
  margin-top: 15px;
}
@media (max-width: 767px) {
  .search-bar {
    .searchpanel {
      .container {
        padding: 0;
        width: 100%;
        .search-input-group {
          padding-top: 0;
          input {
            border-radius: 0;
            max-width: 100%;
            padding-left: 4rem;
          }
          .search-icon {
            top: 0;
            &::after {
              top: 10px;
            }
          }
        }
        .sb-filters {
          top: 44px;
          right: 0;
          max-width: 93%;
          overflow-y: auto;
          overflow-x: hidden;
          height: 60vh;
        }
      }
    }
  }
  .new-searchformTag { 
    display: flex;
  }
  .search-action-btn {
    top: 0;
  }
}

@media (min-width: 767px) and (max-width: 1200px) {
  .searchpanel .product {
    width: 50%;
  }
}
</style>
