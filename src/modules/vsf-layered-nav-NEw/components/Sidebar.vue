<template>
  <div class="sidebar sidebar-filter">
    <h4
      class="sidebar__header mt35 mb20 flex"
      :class="[prodlisting ? 'sidehead' : '']"
    >
      <span class="side-filter">
        <img src="/assets/images/filter.svg"  alt="filter" class="filtericon" />
        <p class="filterp">{{ $t("Refine by") }}</p>
        <p class="filterp1">{{ $t("Filter") }}</p>
      </span>
      <span
        class="weight-400 sidebar__header__clear pointer sans-serif flex lh25"
        @click="resetAllFilters"
        v-show="hasActiveFilters"
      >
        <!-- <i class="material-icons cl-accent mr5">cancel</i> -->
        {{ $t("Clear All") }}
      </span>
    </h4>
    <!--<div class="newhead">
      <h4 class="sidebar__header1 relative mt35 mb20 flex">
        <span class="side-filter1">
          <p class="filterpp">{{ $t("Type:") }}</p>
          <p class="filterppp">{{ $t("Type:") }}</p>
        </span>
        <span
          class="weight-400 sidebar__header__clear pointer sans-serif flex lh37 sortbycleartxt"
          @click="resetAllFilters"
          v-show="hasActiveFilters"
          >{{ $t("Clear All") }}</span>
      </h4>
      <label class="container1 sortSelected " @click="sortBtnClick"
        >Floor
        <input type="radio" checked="checked" name="radio" />
        <span class="checkmark"></span>
      </label>
      <label class="container1" @click="sortBtnClick"
        >Modular
        <input type="radio" name="radio" />
        <span class="checkmark"></span>
      </label>
      <label class="container1" @click="sortBtnClick"
        >Mosaic
        <input type="radio" name="radio" />
        <span class="checkmark"></span>
      </label>
      <label class="container1" @click="sortBtnClick"
        >Wall
        <input type="radio" name="radio" />
        <span class="checkmark"></span>
      </label>
    </div>-->
    <div
      v-for="(filter, filterIndex) in availableFilters"
      :key="filterIndex"
      class="filterlabels"
    >
      <product-filter
        :filter-index="filterIndex"
        :filter="filter"
        :limit="filterOptionDisplayLimit"
        :selected-filters="getCurrentFilters"
        @changeFilter="changeFilter"
        :prod-type-filter-both-val="bothFilterValCount"
      />
    </div>
  </div>
</template>

<script>
import ProductFilter from "src/modules/vsf-layered-nav/components/ProductFilter";
import pickBy from "lodash-es/pickBy";

export default {
  components: {
    ProductFilter,
  },
  data() {
    return {
      bothFilterValCount: 0
    }
  },
  props: {
    filters: {
      type: Object,
      required: true,
    },
    prodlisting: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasActiveFilters() {
      return this.$store.getters["category-next/hasActiveFilters"];
    },
    getCurrentFilters() {
      return this.$store.getters["category-next/getCurrentFilters"];
    },
    availableFilters () {
      let filteredFilters = pickBy(this.filters, (filter, filterType) => {
        return (
          filter.length &&
          !this.$store.getters["category-next/getSystemFilterNames"].includes(
            filterType
          )
        );
      });

      for (let key in filteredFilters) {
        if (key === 'filter_type.keyword') {
          let filteredFiltersArray = filteredFilters[key];

          let hasFilterNamedBoth = filteredFiltersArray.filter((item, key) => {
            return item.id === 'Both';
          }).length > 0

          if (hasFilterNamedBoth) {
            filteredFiltersArray.map((item, index)=>{
              if (item.id === 'Both') {
                this.bothFilterValCount = item.count;
              }
            })  
          } else {
            this.bothFilterValCount = 0
          }
        }
      }
      return filteredFilters;
    },
    filterOptionDisplayLimit() {
      return this.$store.state.config.layeredNavigation
        .filterOptionsDisplayLimit;
    },
    isListingProducts() {
      return (
        this.children.length === 0 ||
        this.hasActiveFilters === true ||
        this.sorted
      );
    },
  },
  methods: {
    resetAllFilters() {
      this.$store.dispatch("category-next/resetSearchFilters");
    },
    changeFilter(variant) {
      this.$emit("changeFilter", variant);
    },
    sortById(filters) {
      return [...filters].sort((a, b) => {
        return a.id - b.id;
      });
    },
    sortBtnClick(event) {
      for (var item of document.querySelectorAll(".container1")) {
        item.classList.remove("sortSelected");
      }
      setTimeout(() => {
        // event.target.classList.add('sortSelected');
        if (event.target.localName === "input") {
          event.target.parentNode.classList.add("sortSelected");
        }
      }, 10);
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  &__header {
    justify-content: space-between;
    min-height: 47px;
    @media only screen and (max-width: 767px) {
      min-height: 50px;
    }
    flex-wrap: wrap;
    margin: 0px;
    &__clear {
      font-size: 0.8em;
      min-width: 102px;
      @media only screen and (min-width: 768px) and (max-width: 770px) {
        margin-top: 20px;
      }
    }
  }

  &__inline-selecors {
    display: flex;
  }
}
.sidebar__header__clear {
  line-height: 37px;
  color: #c7c7c7;
  text-decoration: underline;
}
.sidebar__header1 {
  -ms-flex-pack: justify;
  justify-content: space-between;
  min-height: 47px;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin: 0px;
}
.newhead {
  border-bottom: 1px solid #afafaf;
}
@media screen and (max-width: 767px) {
  .newhead {
    padding-left: 39px;
  }
  .sidebar__header__clear {
    line-height: 59px;
  }
  .sidebar-filter {
    position: relative;
    background-color: #fff;
    margin: 0px;
    z-index: 100;
    width: 100%;
    border-top: 2px solid #dfdfdf;
  }
  .sidebar-filter .sidebar__header {
    -ms-flex-pack: justify;
    justify-content: space-between;
    border-bottom: 2px solid #dfdfdf;
    border-top: 2px solid #dfdfdf;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    width: 100%;
    // position: fixed;
    margin: 0px;
    height: 50px;
    background-color: #fff;
    margin-top: -2px;
    z-index: 104;
  }
}
.filtericon {
  width: 35px;
  height: 35px;
  margin-top: -2px;
}
.side-filter {
  display: -ms-inline-flexbox;
  display: inline-flex;
}
.side-filter1 {
  display: -ms-inline-flexbox;
  display: inline-flex;
}

.filterp {
  margin-top: 7px;
  padding-left: 8px;
  font-size: 17px;
  color: #2a285a;
  font-family: "Arial";
}
.filterp1 {
  margin-top: 7px;
  padding-left: 8px;
  font-size: 17px;
  color: #2a285a;
  font-family: "Arial";
}
.filterpp {
  margin-top: 7px;
  // padding-left: 8px;
  font-size: 14px;
  color: #2a285a;
  font-family: "Arial";
  font-weight: bold;
}
.filterppp {
  margin-top: 7px;
  // padding-left: 8px;
  font-size: 14px;
  color: #2a285a;
  font-family: "Arial";
  font-weight: bold;
}
@media screen and (max-width: 767px) {
  .filterpp {
    display: none;
  }
  .filterppp {
    display: block;
    font-size: 17px;
  }
  .filterp {
    display: none;
  }
  .filterp1 {
    display: block;
  }
  .sortbycleartxt {
    display: none;
  }
  .side-filter {
    padding-left: 39px;
    padding-top: 10px;
  }
  .newhead {
    width: auto;
    z-index: -1;
    margin-top: 52px;
  }
}
@media screen and (min-width: 768px) {
  .filterppp {
    display: none;
  }
  .filterpp {
    display: block;
  }
  .filterp {
    display: block;
  }
  .filterp1 {
    display: none;
  }
}
.filterlabels {
  border-bottom: 1px solid #afafaf;
  @media (max-width: 767px) {
    border-bottom: 2px solid #dfdfdf;
    :last-child {
      border-bottom: none;
    }
  }
}
@media (min-width: 768px) {
.filterlabels:last-child{
  border-bottom: none !important;
}
}
.sidehead {
  display: none !important;
}
label {
  font-size: 14px;
  font-family: "Arial";
}
.container1 {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 21px;
  cursor: pointer;
  font-size: 14px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.sortSelected {
  color: #da2f89;
  font-weight: bold;
}

/* Hide the browser's default radio button */
.container1 input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom radio button */
.checkmark {
      position: absolute;
    top: -2px;
    left: 0px;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    border: 1px solid black;
}

/* On mouse-over, add a grey background color */
.container1:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the radio button is checked, add a blue background */
.container1 input:checked ~ .checkmark {
  background-color: #ffffff;
  border-color: #da2f89;
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.container1 input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.container1 .checkmark:after {
  border-radius: 50%;
  font-family: "FontAwesome";
  content: "\F00C";
  color: #da2f89;
  line-height: 21px;
  font-size: 19px;
  font-weight: 100;
}
</style>
