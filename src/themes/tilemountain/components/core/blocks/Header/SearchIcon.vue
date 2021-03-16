<template>
  <div>
    <button
    v-if="!searchInput"
      type="button"
      :aria-label="$t('Open search panel')"
      class="bg-cl-transparent brdr-none inline-flex"
      @click="toggleSearchpanel"
      data-testid="openSearchPanel"
    >
      <i class="material-icons">search</i>
    </button>
    <input
      v-if="searchInput"
      class="search-panel-input"
      :aria-label="$t('Open search panel')"
      @click="toggleSearchpanel"
      data-testid="openSearchPanel"
      placeholder="Search..."
    />
  </div>
</template>

<script>
import SearchIcon from "@vue-storefront/core/compatibility/components/blocks/Header/SearchIcon";

export default {
  name: "search",
  mixins: [SearchIcon],
  props: {
    searchInput: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
.search-panel-input {
  border: 1px solid #bfc3cb;
  width: 100%;
  padding-bottom: 0;
  padding-top: 0;
  outline: 0;
  font-size: 18px;
}
input {
  max-width: 405px;
  height: 2.63rem;
  width: 100%;
  border: 1px solid #bfc3cb;
  font-size: 0.839375rem;
  padding-left: 0.5rem;
  background-color: #e6ebee;
  color: #888;
  font-family: "Oblik";
  @media screen and (max-width: 767px){
     padding-left: 4.5rem;
     background-color: #ffff;
     border: none !important;
  }
}
</style>
