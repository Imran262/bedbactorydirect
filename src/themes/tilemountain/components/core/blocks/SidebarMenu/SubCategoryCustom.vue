<template>
  <div>
    <ul
      v-if="children"
      class="sidebar-submenu level1 absolute w-100 p0 bg-cl-primary newCLass"
      :style="styles"
      :class="active"
    >
      <!-- <li
        v-if="parentSlug"
        class="brdr-bottom-1 brdr-cl-bg-secondary bg-cl-primary flex"
      >
        <router-link
          class="px25 py20 cl-accent no-underline col-xs"
          :to="localizedRoute(parentSlug)"
          data-testid="categoryLink"
          >{{ $t("View all") }}</router-link
        >
      </li> -->
      <li
        class="bg-cl-primary flex"
        v-for="(link, index) in children"
        :key="index"
      >
        <div v-if="link.sub_links.length > 0" class="subcategory-item">
          <sub-btn
            class="bg-cl-transparent brdr-none fs-medium"
            :id="link.main_title"
            :name="link.main_title"
            :link="link.link"
          />
        </div>
        <sub-category-custom-new
          v-if="link.sub_links.length > 0"
          :category-links="link.sub_links"
          :id="link.main_title"
          :parent-slug="parentSlug"
          :parent-path="parentSlug"
          :unique-index="index"
        />
      </li>
    </ul>
    <ul
      v-if="myAccountLinks && !path.length"
      class="sidebar-submenu absolute w-100 p0 bg-cl-primary"
      :style="styles"
    >
      <li
        class="bg-cl-primary flex"
        :key="link.id"
        v-for="link in myAccountLinks"
        @click="notify(link.name)"
      >
        <router-link
          class="px25 py20 cl-accent no-underline col-xs"
          :to="localizedRoute(link.url)"
          >{{ link.name }}</router-link
        >
      </li>
      <li class="bg-cl-primary flex">
        <a
          href="#"
          class="px25 py20 cl-accent no-underline col-xs"
          @click.prevent="logout"
          >{{ $t("Logout") }}</a
        >
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from "vuex";
import SubBtn from "./SubBtn.vue";
import i18n from "@vue-storefront/i18n";
import config from "config";
import { formatCategoryLink } from "@vue-storefront/core/modules/url/helpers";
import SubCategoryCustomNew from "theme/components/core/blocks/SidebarMenu/SubCategoryCustomNew";

export default {
  name: "SubCategoryCustom",
  components: {
    SubBtn,
    SubCategoryCustomNew,
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    categoryLinks: {
      type: null,
      required: false,
      default: false,
    },
    parentSlug: {
      type: String,
      required: false,
      default: "",
    },
    parentPath: {
      type: String,
      required: false,
      default: "",
    },
    myAccountLinks: {
      type: null,
      required: false,
      default: false,
    },
  },
  computed: {
    children() {
      if (
        this.categoryLinks &&
        this.categoryLinks.length > 0 &&
        (this.categoryLinks[0].main_title || this.categoryLinks[0].title)
      ) {
        // we're using dynamic prefetching and getting just category.children_data.id from 1.7
        return this.categoryLinks;
      } else {
        return this.$store.state.category.list.filter((c) => {
          return c.parent_id === this.id;
        }); // return my child categories
      }
    },
    ...mapState({
      submenu: (state) => state.ui.submenu,
      path: (state) => state.ui.submenu.path,
    }),
    getSubmenu() {
      return this.submenu;
    },
    active() {
      const pos = this.submenu.path.indexOf(this.id);
        return pos !== -1
        ? {
        active: true,
      }
      : false
    },

    styles() {
      const pos = this.submenu.path.indexOf(this.id);
      return pos !== -1
        ? {
            zIndex: pos + 1,
          }
        : false;
    },
    isCurrentMenuShowed() {
      return (
        this.getSubmenu &&
        this.getSubmenu.depth &&
        this.getSubmenu.path[this.getSubmenu.depth - 1] === this.id
      );
    },
  },

  methods: {
    async logout() {
      await this.$store.dispatch("user/logout", {});
      this.$router.push(this.localizedRoute("/"));
      this.$store.commit("ui/setSubmenu", { depth: false });
    },
    notify(title) {
      if (title === "My loyalty card" || title === "My product reviews") {
        this.$store.dispatch("notification/spawnNotification", {
          // type: 'warning',
          // message: i18n.t(
          //   'This feature is not implemented yet! Please take a look at https://github.com/DivanteLtd/vue-storefront/issues for our Roadmap!'
          // ),
          // action1: { label: i18n.t('OK') }
        });
      }
    },
    categoryLink(category) {
      return formatCategoryLink(category);
    },
  },
};
</script>

<style scoped>
.sidebar-submenu {
  left: 0;
  top: 0;
  transform: translateX(-100%);
  display: none;
}
.sidebar-submenu.active {
  display: block!important;
}

.subcategory-item {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #f2f2f2;
}
.subcategory-item button {
  padding-bottom: 9px;
  padding-top: 9px;
  font-size: 10.59px;
  color: #434343;
  font-family: "Oblik";
  line-height: 1.5;
}
.sidebar-submenu li {
  border-left: 2px solid #292758;
  border-right: 2px solid #292758;
}
.sidebar-submenu li:last-child {
  border-bottom: 2px solid #292758;
}
</style>
