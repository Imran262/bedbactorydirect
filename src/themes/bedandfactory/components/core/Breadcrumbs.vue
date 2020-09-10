<template>
  <div class="breadcrumbs mt10 h5 cl-gray">
    <span class="home-breadcrumb-icon product-page-home-breadcrumb-icon">
      <router-link :to="localizedRoute('/')" class="cl-tertiary links">
        <img
          class="home-breadcrumb-icon-img"
          src="/assets/home-breadcrumb-icon.svg"
        /> </router-link
      >|
    </span>
    <span v-for="link in paths" :key="link.route_link">
      <template v-if="link.name !== 'Default category'">
        <router-link :to="link.route_link">
          {{ link.name | htmlDecode }} </router-link
        >|
      </template>
    </span>
    <span class="cl-mine-shaft">{{ current | htmlDecode }}</span>
  </div>
</template>

<script>
import { Breadcrumbs } from "@vue-storefront/core/modules/breadcrumbs/components/Breadcrumbs.ts";
export default {
  mixins: [Breadcrumbs],
  components: {}
};
</script>
<style lang="scss" scoped>
img.home-breadcrumb-icon-img {
  width: 15px;
  float: left;
  margin: 3px 2.5px 0 0;
}
.breadcrumbs {
  padding-top: 1rem;
  span {
    color: #54575b;
    display: inline-block;
    a {
      color: #54575b;
      padding: 0px 2.5px;
    }
  }
}
iframe {
  display: none;
}
</style>
