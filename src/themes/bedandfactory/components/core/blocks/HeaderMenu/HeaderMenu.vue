<template>
  <div
    v-if="!isCheckoutPage"
    class="new-menu-bar new-menu-bar-main hidden-sm hidden-xs"
  >
    <div class="container">
      <ul class="flex menu">
        <li class="relative">
          <router-link
            class="block px25 py20 cl-accent no-underline"
            :to="localizedRoute('/')"
            exact
          >
            {{ $t('Home') }}
          </router-link>
        </li>
        <li
          class="relative"
          :key="category.slug"
          v-for="category in visibleCategories"
          :class="{
            'with-submenu':
              category.children_data && category.children_data.length
          }"
        >
          <button
            v-if="category.children_count > 0"
            class="menu-link"
            :class="{ active: activeSubMenu == category.id }"
            type="button"
            :aria-label="$t('Show subcategories')"
            data-testid="categoryButton"
            @click="toggleSubMenu(category.id)"
            @mouseenter="activeSubMenu = category.id"
            @mouseleave="activeSubMenu = null"
          >
            {{ category.name }}
          </button>
          <router-link
            v-else
            class="menu-link"
            :to="
              localizedRoute({
                name: 'category',
                params: { id: category.id, slug: category.slug }
              })
            "
          >
            {{ category.name }}
          </router-link>

          <sub-category
            v-show="activeSubMenu === category.id"
            :category-links="category.children_data"
            :id="category.id"
            :parent-slug="category.slug"
            class="left-0"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress';
import SubCategory from 'theme/components/core/blocks/HeaderMenu/SubCategory';
import CurrentPage from 'theme/mixins/currentPage';

export default {
  name: 'HeaderMenu',
  components: {
    SubCategory
  },
  mixins: [CurrentPage, onEscapePress],
  data() {
    return {
      allCategories: [],
      activeSubMenu: null
    };
  },
  computed: {
    ...mapGetters('category', ['getCategories']),
    categories() {
      return this.allCategories.filter(op => {
        return (
          op.level ===
          (this.$store.state.config.entities.category
            .categoriesDynamicPrefetchLevel
            ? this.$store.state.config.entities.category
              .categoriesDynamicPrefetchLevel
            : 2)
        ); // display only the root level (level =1 => Default Category), categoriesDynamicPrefetchLevel = 2 by default
      });
    },
    ...mapState({
      currentUser: state => state.user.current
    }),
    visibleCategories() {
      return this.categories.filter(category => {
        return category.product_count > 0 || category.children_count > 0;
      });
    }
  },
  created() {
    this.allCategories = this.getCategories;
  },
  async mounted() {
    let categories = await this.$store.dispatch('category/list', {
      skipCache: true,
      includeFields: this.$store.state.config.entities.optimize
        ? this.$store.state.config.entities.category.includeFields
        : null
    });

    this.allCategories = categories.items;
  },
  methods: {
    onEscapePress() {
      this.closeMenu();
    },
    openMenu(id) {
      this.activeSubMenu = id;
      // this.$store.commit('ui/setOverlay', true)
    },
    closeMenu() {
      this.activeSubMenu = null;
      // this.$store.commit('ui/setOverlay', false)
    },
    toggleSubMenu(id) {
      if (this.activeSubMenu === id) {
        this.closeMenu();
      } else {
        this.openMenu(id);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.menu {
  @apply p-0 m-0;
  list-style: none;

  .menu-link {
    @apply block text-black font-medium;
    padding: 15px;
    line-height: 1.25rem;
    text-decoration: none;

    &:hover,
    &:focus {
      @apply text-primary bg-grey-lighter;
      outline: none;
    }

    &.active,
    &.router-link-active {
      @apply text-primary bg-grey-lighter border-t-2 border-solid border-primary;
      padding-top: 13px;
    }
  }
}

.with-submenu:hover {
  > .menu-link {
    @extend .menu-link.active;
  }

  > .submenu {
    display: block !important;
  }
}
/*Custom Style */
.new-menu-bar.new-menu-bar-main.hidden-sm.hidden-xs {
  background-color: #606060;
}
.new-menu-bar.new-menu-bar-main ul li a {
  text-align: center;
  padding: 10px !important;
  display: block;
  color: #fff;
  line-height: 0.5 !important;
  text-transform: uppercase;
}
.new-menu-bar.new-menu-bar-main ul li a:after {
  content: '';
  background-color: none !important;
  width: 0;
}

ul.submenu {
  display: block;
  position: absolute;
  background: #606060;
  width: 100%;

  top: 25px;
}
.new-menu-bar.new-menu-bar-main ul > li {
  border-right: 1px solid #fff;
  margin-top: 10px;
  margin-bottom: 10px;
  -ms-flex: 1 1;
  flex: 1 1;
}

.new-menu-bar.new-menu-bar-main ul {
  margin-top: 0 !important;
  margin-bottom: 3px !important;
  padding: 0;
}

li.relative.with-submenu button {
  background: none;
  border: 0;
  text-align: center;
  padding: 10px !important;
  display: block;
  color: #fff;
  line-height: 0.5 !important;
  text-transform: uppercase;
  margin: auto;
  font-size: 16px !important;
}

.new-menu-bar.new-menu-bar-main ul > li:last-child {
  border-right: none;
}
@media (min-width: 768px) and (max-width: 992px) {
  li.relative.with-submenu button {
    font-size: 11px !important;
  }
  .new-menu-bar.new-menu-bar-main ul li a {
    font-size: 11px;
  }
}
@media (min-width: 993px) and (max-width: 1024px) {
  li.relative.with-submenu button {
    font-size: 14px;
  }
  .new-menu-bar.new-menu-bar-main ul li a {
    font-size: 14px;
  }
}
/*Custom Style */
</style>
