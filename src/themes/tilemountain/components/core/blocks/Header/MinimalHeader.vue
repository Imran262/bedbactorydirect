<template>
  <div>
    <Header />
  </div>
</template>

<script>
import CurrentPage from "theme/mixins/currentPage";
import { currentStoreView } from "@vue-storefront/core/lib/multistore";
import Header from "theme/components/core/blocks/Header/Header";
import config from "config";

export default {
  data () {
    const storeView = currentStoreView();
    return {
      defaultTitle: storeView.seo.defaultTitle
        ? storeView.seo.defaultTitle
        : config.seo.defaultTitle
    };
  },
  components: {
    Header
  },
  mixins: [CurrentPage]
};
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-icon-hover: color(secondary, $colors-background);

header {
  height: auto;
  z-index: 3;
  transition: top 0.2s ease-in-out;
  background-color: #434343;
  &.is-visible {
    top: 0;
  }
}
.icon {
  opacity: 0.6;
  &:hover,
  &:focus {
    background-color: $color-icon-hover;
    opacity: 1;
  }
}
.right-icons {
  //for edge
  float: right;
}
.header-placeholder {
  height: 54px;
}
.links {
  text-decoration: underline;
}
@media (max-width: 767px) {
  .row.middle-xs {
    margin: 0 -15px;

    &.py5 {
      margin: 0;
    }
  }
  .col-xs-2:first-of-type {
    padding-left: 0;
  }
  .col-xs-2:last-of-type {
    padding-right: 0;
  }
  a,
  span {
    font-size: 12px;
  }
}
</style>
