<template>
  <div class="color-picker">
<!-- {{      (colors.custom_options && colors.custom_options.length > 0 ) }} -->
    <product-custom-options
      v-if="colors.custom_options && colors.custom_options.length > 0"
      :product="colors"
      :color="true"
    />
  </div>
</template>

<script>
import ProductCustomOptions from "theme/components/core/ProductCustomOptions.vue";
import { mapState } from "vuex";
import i18n from "@vue-storefront/i18n";
import SidebarMenu from "@vue-storefront/core/compatibility/components/blocks/SidebarMenu/SidebarMenu";
import SubBtn from "theme/components/core/blocks/SidebarMenu/SubBtn";
import SubCategory from "theme/components/core/blocks/SidebarMenu/SubCategory";
import { formatCategoryLink } from "@vue-storefront/core/modules/url/helpers";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import { require } from "vue-analytics";

export default {
  components: {
    SubCategory,
    SubBtn,
    ProductCustomOptions
  },
  mixins: [SidebarMenu],
  data() {
    return {
      myAccountLinks: [
        {
          id: 1,
          name: i18n.t("My profile"),
          url: "/my-account"
        },
        {
          id: 2,
          name: i18n.t("My shipping details"),
          url: "/my-account/shipping-details"
        },
        {
          id: 3,
          name: i18n.t("My newsletter"),
          url: "/my-account/newsletter"
        },
        {
          id: 4,
          name: i18n.t("My orders"),
          url: "/my-account/orders"
        },
        {
          id: 5,
          name: i18n.t("My loyalty card"),
          url: "#"
        },
        {
          id: 6,
          name: i18n.t("My product reviews"),
          url: "#"
        }
      ],
      componentLoaded: false
    };
  },
  props: {
    colors: {
      type: Object,
      required: true
    }
  },
  computed: {
    mainListStyles() {
      return this.submenu.depth
        ? `transform: translateX(${this.submenu.depth * 100}%)`
        : false;
    },
    ...mapState({
      submenu: state => state.ui.submenu,
      currentUser: state => state.user.current
    }),
    getSubmenu() {
      return this.submenu;
    },
    visibleCategories() {
      return this.categories.filter(category => {
        return category.product_count > 0 || category.children_count > 0;
      });
    },
    isCurrentMenuShowed() {
      return !this.getSubmenu || !this.getSubmenu.depth;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.componentLoaded = true;
      disableBodyScroll(this.$refs.container);
    });
  },
  destroyed() {
    clearAllBodyScrollLocks();
  },
  methods: {
    login() {
      if (!this.currentUser && this.isCurrentMenuShowed) {
        this.$nextTick(() => {
          this.$store.commit("ui/setAuthElem", "login");
          this.$bus.$emit("modal-show", "modal-signup");
          this.$router.push({ name: "my-account" });
        });
      }
    },
    categoryLink(category) {
      return formatCategoryLink(category);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/css/animations/transitions";
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$bg-secondary: color(secondary, $colors-background);
$color-gainsboro: color(gainsboro);
$color-matterhorn: color(matterhorn);
$color-mine-shaft: color(mine-shaft);
.color-picker {
  height: 100%;
  width: 30%;
  background-color: whitesmoke;
  position: absolute;
  top: 382px;
  /* left: 10px; */
  right: 0px;
  z-index: 2;
}
.overlay {
  position: fixed;
  width: 70%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  cursor: pointer;
}
.sidebar-menu {
  height: 100vh;
  width: 350px;
  overflow: hidden;

  @media (max-width: 767px) {
    width: 100vh;
  }

  &__container {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: calc(100% - 55px);
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
      color: $color-gainsboro;
    }
    &:hover,
    &:focus {
      i {
        color: $color-matterhorn;
      }
    }
  }
}
</style>
