<template>
  <div class="sidebar-menu sidebar-menu-one fixed mw-100">
    <div class="row brdr-bottom-1 brdr-cl-bg-secondary">
      <div v-if="submenu.depth" class="arrow-forward col-xs">
        <sub-btn type="back" class="bg-cl-transparent brdr-none" />
      </div>
      <!-- <div class="col-xs bg-cl-primary">
        <button
          type="button"
          :aria-label="$t('Close')"
          class="w-100 inline-flex end-xs bg-cl-transparent brdr-none p0 close-btn"
          @click="closeMenu"
        >
          <i class="material-icons p15">close</i>
        </button>
      </div> -->
    </div>
    <MobileMegaMenuBlock :identifier="'follow-us-social-links-TM'" />
  </div>
</template>

<script>
import { mapState } from "vuex"
import i18n from "@vue-storefront/i18n"
import SidebarMenu from "@vue-storefront/core/compatibility/components/blocks/SidebarMenu/SidebarMenu"
import SubBtn from "theme/components/core/blocks/SidebarMenu/SubBtn"
import SubCategory from "theme/components/core/blocks/SidebarMenu/SubCategory"
import { formatCategoryLink } from "@vue-storefront/core/modules/url/helpers"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"
import MobileMegaMenuBlock from "theme/components/MobileMegaMenuBlock.vue"

export default {
  components: {
    MobileMegaMenuBlock,
    SubBtn,
  },
  mixins: [SidebarMenu],
  computed: {
    mainListStyles() {
      return this.submenu.depth
        ? `transform: translateX(${this.submenu.depth * 100}%)`
        : false
    },
    ...mapState({
      submenu: (state) => state.ui.submenu,
      currentUser: (state) => state.user.current,
    }),
    getSubmenu() {
      return this.submenu
    },
    visibleCategories() {
      return this.categories.filter((category) => {
        return category.product_count > 0 || category.children_count > 0
      })
    },
    isCurrentMenuShowed() {
      return !this.getSubmenu || !this.getSubmenu.depth
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.componentLoaded = true
      disableBodyScroll(this.$refs.container)
    })
  },
  destroyed() {
    clearAllBodyScrollLocks()
  },
  methods: {
    categoryLink(category) {
      return formatCategoryLink(category)
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~theme/css/animations/transitions';
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$bg-secondary: color(secondary, $colors-background);
$color-gainsboro: color(gainsboro);
$color-matterhorn: color(matterhorn);
$color-mine-shaft: color(mine-shaft);

.sidebar-menu li button i {
  color: red !important;
}
.sidebar-menu {
  height: auto;
  width: 350px;
  overflow: hidden;

  @media (max-width: 767px) {
    width: 100vh;
    max-width: 230px;
    margin-top: -1px;
    height: 100% !important;
  }

  &__container {
    // overflow-y: auto;
    // -webkit-overflow-scrolling: touch;
    // height: calc(100% - 50px);
    // overflow-x: hidden;
  }

  &__list {
    transition: transform $duration-main $motion-main;
  }

  ul {
    list-style-type: none;
  }

  li {
    &:hover,
    &:focus {
      background-color: $color-gainsboro;
    }
    &.bg-cl-primary {
      &:hover,
      &:focus {
        background-color: $bg-secondary;
      }
    }
    a {
      color: $color-mine-shaft;
    }
  }

  .subcategory-item {
    display: flex;
    width: 100%;
  }

  button {
    color: $color-mine-shaft;
    a {
      color: $color-mine-shaft;
    }
  }

  .close-btn {
    i {
      color: $color-matterhorn;
    }
    &:hover,
    &:focus {
      i {
        color: $color-matterhorn;
      }
    }
  }
}
@media only screen and (min-device-width: 320px) and (max-device-width: 767px) {
  .sidebar-menu ul {
    display: flex;
    flex-direction: column;
  }
  .sidebar-menu ul li:nth-child(13n + 1) {
    -ms-flex-order: 9;
    order: 11;
    -webkit-order: 11;
  }
  .sidebar-menu ul li:nth-child(13n + 2) {
    -ms-flex-order: 3;
    order: 4;
    -webkit-order: 4;
  }
  .sidebar-menu ul li:nth-child(12n + 3) {
    -ms-flex-order: 2;
    order: 10;
    -webkit-order: 10;
  }
  .sidebar-menu ul li:nth-child(13n + 4) {
    -ms-flex-order: 1;
    order: 3;
    -webkit-order: 3;
  }
  .sidebar-menu ul li:nth-child(13n + 5) {
    -ms-flex-order: 8;
    order: 2;
    -webkit-order: 2;
  }
  .sidebar-menu ul li:nth-child(13n + 6) {
    -ms-flex-order: 5;
    order: 1;
    -webkit-order: 1;
  }
  .sidebar-menu ul li:nth-child(13n + 7) {
    -ms-flex-order: 7;
    order: 9;
    -webkit-order: 9;
  }
  .sidebar-menu ul li:nth-child(13n + 8) {
    -ms-flex-order: 4;
    order: 6;
    -webkit-order: 6;
  }
  .sidebar-menu ul li:nth-child(13n + 9) {
    -ms-flex-order: 6;
    order: 8;
    -webkit-order: 8;
  }
  .sidebar-menu ul li:nth-child(13n + 10) {
    -ms-flex-order: 10;
    order: 5;
    -webkit-order: 5;
  }
  .sidebar-menu ul li:nth-child(13n + 11) {
    -webkit-order: 7;
    order: 7;
  }
  .sidebar-menu ul li:nth-child(13n + 12) {
    display: none;
  }
  .sidebar-menu ul li:nth-child(13n + 13) {
    -webkit-order: 12;
    order: 12;
  }
  .arrow-forward {
    background-color: #00a799;
    // margin-top: 4px;
  }
  .arrow-forward .link_button button {
    padding-bottom: 15px;
    padding-top: 15px;
    border-top: 2px solid #292758;
    border-left: 2px solid #292758;
    border-right: 2px solid #292758;
    width: 100%;
    position: relative;
    background: transparent;
    border: none;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 992px) {
  .sidebar-menu ul {
    display: flex;
    flex-direction: column;
  }
  .sidebar-menu ul li:nth-child(13n + 1) {
    -ms-flex-order: 9;
    order: 11;
    -webkit-order: 11;
  }
  .sidebar-menu ul li:nth-child(13n + 2) {
    -ms-flex-order: 3;
    order: 4;
    -webkit-order: 4;
  }
  .sidebar-menu ul li:nth-child(12n + 3) {
    -ms-flex-order: 2;
    order: 10;
    -webkit-order: 10;
  }
  .sidebar-menu ul li:nth-child(13n + 4) {
    -ms-flex-order: 1;
    order: 3;
    -webkit-order: 3;
  }
  .sidebar-menu ul li:nth-child(13n + 5) {
    -ms-flex-order: 8;
    order: 2;
    -webkit-order: 2;
  }
  .sidebar-menu ul li:nth-child(13n + 6) {
    -ms-flex-order: 5;
    order: 1;
    -webkit-order: 1;
  }
  .sidebar-menu ul li:nth-child(13n + 7) {
    -ms-flex-order: 7;
    order: 9;
    -webkit-order: 9;
  }
  .sidebar-menu ul li:nth-child(13n + 8) {
    -ms-flex-order: 4;
    order: 6;
    -webkit-order: 6;
  }
  .sidebar-menu ul li:nth-child(13n + 9) {
    -ms-flex-order: 6;
    order: 8;
    -webkit-order: 8;
  }
  .sidebar-menu ul li:nth-child(13n + 10) {
    -ms-flex-order: 10;
    order: 5;
    -webkit-order: 5;
  }
  .sidebar-menu ul li:nth-child(13n + 11) {
    -webkit-order: 7;
    order: 7;
  }
  .sidebar-menu ul li:nth-child(13n + 12) {
    display: none;
  }
  .sidebar-menu ul li:nth-child(13n + 13) {
    -webkit-order: 12;
    order: 12;
  }
}
</style>
