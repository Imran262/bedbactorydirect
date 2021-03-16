<template>
  <div class="row main-search">
    <div class="col-md-9 col-sm-8 col-xs-12 search-box pl0">
      <input v-model="searchInput" autocomplete="off" placeholder="Search for products..." class="search-panel-input">
      <img class="mobile_img" src="/assets/search.png" alt="search">
    </div>
     <div class="col-md-3 col-sm-4 col-xs-12 search-box pl0">
      <button
        class="button block brdr-none w-100 py20 px10 h4 :bg-cl-th-secondary weight-400 cl-white ripple add-btn applyFiltersBtn"
        :class="btnEnabled ? 'btnDisabledFalse': 'btnDisabledTrue'"
        @click="applyFilters"
        :disabled="!btnEnabled">
        Apply Filters
      </button>
    </div>
    <div class="col-md-12 No-result">
      <template v-if="!!filters">
        <div class="filters-main-box">
          <div class="filters row">
            <div class="col-md-12"
                 v-if="hasFilters.type || hasFilters.color || hasFilters.size || hasFilters.finish || hasFilters.material">
              <div class="row">
                <div class="filter_A filterBox" v-if="hasFilters.type" data-filter="type" :data-filter-key="filters.type.key || `type`">
                  <filter-box
                    :filter-name="`Type`"
                    :filter="filters.type.filter"
                    @change="filterChange"
                    :cols="`col-md-12 col-sm-6 col-xs-12`"
                  />
                </div>
                <div class="filter_A filterBox" v-if="hasFilters.color" data-filter="color" :data-filter-key="filters.color.key || `color`">
                  <filter-box
                    :filter-name="`Colour`"
                    :filter="filters.color.filter"
                    @change="filterChange"
                    :cols="`col-md-12 col-sm-6 col-xs-12`"
                  />
                </div>
                <div class="filter_A filterBox" v-if="hasFilters.size" data-filter="size" :data-filter-key="filters.size.key || `size`">
                  <filter-box
                    :filter-name="`Size`"
                    :filter="filters.size.filter"
                    @change="filterChange"
                    :cols="`col-md-12 col-sm-6 col-xs-12`"
                  />
                </div>
                <div class="filter_A filterBox" v-if="hasFilters.finish" data-filter="finish" :data-filter-key="filters.finish.key || `finish`">
                  <filter-box
                    :filter-name="`Finish`"
                    :filter="filters.finish.filter"
                    @change="filterChange"
                    :cols="`col-md-12 col-sm-6 col-xs-12`"
                  />
                </div>
                <div class="filter_A filterBox" v-if="hasFilters.material" data-filter="material" :data-filter-key="filters.material.key || `material`">
                  <filter-box
                    :filter-name="`Material`"
                    :filter="filters.material.filter"
                    @change="filterChange"
                     :cols="`col-md-12 col-sm-6 col-xs-12`"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-12" v-if="hasFilters.thickness || hasFilters.special_features">
              <div class="row">
                <div class="filter_B filterBox" v-if="hasFilters.thickness" data-filter="thickness" :data-filter-key="filters.thickness.key || `thickness`">
                  <filter-box
                    :filter-name="`Thickness`"
                    :filter="filters.thickness.filter"
                    @change="filterChange"
                    :cols="`col-md-6 col-sm-6 col-xs-12`"
                  />
                </div>
                <div class="filter_C filterBox" v-if="hasFilters.special_features" data-filter="special_features" :data-filter-key="filters.special_features.key || `special_features`">
                  <filter-box
                    :filter-name="`Special Features`"
                    :filter="filters.special_features.filter"
                    @change="filterChange"
                    :cols="`col-md-4 col-sm-6 col-xs-12`"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
   
  </div>
</template>
<script>
import FilterBox from './FilterBox';
import { findAncestor } from '../../../helpers';

export default {
  name: 'NoResultFilters',
  components: { FilterBox },
  data () {
    return {
      searchInput: '',
      selectedFilters: [],
      btnEnabled: false
    }
  },
  props: {
    filters: {
      type: [Array, Object],
      required: true
    }
  },
  computed: {
    hasFilters () {
      return {
        type: this.filters.type && this.filters.type.filter.length > 0,
        color: this.filters.color && this.filters.color.filter.length > 0,
        size: this.filters.size && this.filters.size.filter.length > 0,
        finish: this.filters.finish && this.filters.finish.filter.length > 0,
        material: this.filters.material && this.filters.material.filter.length > 0,
        thickness: this.filters.thickness && this.filters.thickness.filter.length > 0,
        special_features: this.filters.special_features && this.filters.special_features.filter.length > 0
      }
    }
  },
  methods: {
    applyFilters () {
      this.$emit('apply-filters', { selectedFilters: this.selectedFilters, searchText: this.searchInput })
    },
    filterChange (e) {
      let selectedFilterElement = e.target;
      let selectedFilterStatus = selectedFilterElement.classList.toggle('active-filter');

      let activeFiltersLength = document.querySelectorAll('.active-filter');
      if (activeFiltersLength && activeFiltersLength.length > 0) {
        this.btnEnabled = true
      } else {
        this.btnEnabled = false
      }
      if (!selectedFilterStatus) {
        let selectedFilterCode = findAncestor(selectedFilterElement, 'div[data-filter]').getAttribute('data-filter');
        let selectedFilter = selectedFilterElement.getAttribute('codeSingle');
        let selectedFilterIndex = this.selectedFilters[selectedFilterCode].filters.indexOf(selectedFilter)
        if (this.selectedFilters[selectedFilterCode] && selectedFilterIndex > -1) {
          let splicedResponse = this.selectedFilters[selectedFilterCode].filters.splice(selectedFilterIndex, 1)
          return splicedResponse.length > 0;
        }
        return false;
      }

      let activeFilters = document.querySelectorAll('.active-filter');
      activeFilters.forEach(activeFilter => {
        let filterAncestor = findAncestor(activeFilter, 'div[data-filter]');
        let filterCode = filterAncestor.getAttribute('data-filter');
        let filterKey = filterAncestor.getAttribute('data-filter-key');
        let filter = activeFilter.getAttribute('codeSingle');
        if (!this.selectedFilters[filterCode]) {
          this.selectedFilters[filterCode] = {
            filters: [],
            key: filterKey
          }
        }
        if (!this.selectedFilters[filterCode].filters.includes(filter)) {
          this.selectedFilters[filterCode].filters.push(filter);
        }
      });
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.filterBox {
  border: 1px solid #ccc;
}
.No-result{
  margin-top: 50px;
}
.search-box{
  position: relative;
}

.search-panel-input {
  width: 92%;
  height: 60px;
  padding-bottom: 0;
  padding-left: 65px;
  padding-top: 0;
  border: 1px solid #ccc;
  outline: 0;
  font-size: 23px;
  font-family: Arial;
  color: #6b6b6c;
}
.search-box img{
  position: absolute;
  top: 13px;
  left: 17px;
}

.applyFiltersBtn {
  background-color: #00a897;
  font-weight: bold;
  font-size: 20px;
    margin-left: 6px;
}
.filter_A{
  width: 19.7%;
}
.filter_B{
    width: 39.7%;
}
.filter_C{
width: 59.8%;
}
@media (min-width: 451px) and (max-width: 767px){
  .applyFiltersBtn {
    background-color: #29275b;
    font-weight: bold;
    font-size: 12px;
    width: 100%;
    height: 41px;
    padding-top: 11px;
}
}
@media (min-width: 320px) and (max-width: 575px){
  .applyFiltersBtn {
       background-color: #29275b;
    font-weight: bold;
    font-size: 12px;
    width: 50%;
    height: 41px;
    padding-top: 11px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 17px;
    
}
}
@media (max-width: 767px){
  .filter_A ,
  .filter_B ,
  .filter_C{
  width: 100%;
}

.main-search{
      padding: 25px;
}
.search-panel-input {
    width: 84% !important;
    height: 40px;
    font-size: 13px;
    padding-left: 54px;
}
.search-box img {
    position: absolute;
    top: 10px;
    left: 14px;
}
.mobile_img{
    width: 25px;
}
.No-result{
  margin-top: 18px;
}
}
@media (min-width: 767px) and (max-width: 991px){
.filter_B {
    width: 39.6%;
}
}
.btnDisabledTrue {
  background-color: #4f4f4f !important;
}
</style>
