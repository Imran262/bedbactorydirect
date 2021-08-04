<template>
  <div>
    <ul
      v-if="children"
      class="sidebar-submenu level2 absolute w-100 p0 bg-cl-primary newCLass"
      :style="styles"
      :class="{className, active}"
    >
      <!-- <li v-if="parentSlug" class="brdr-bottom-1 brdr-cl-bg-secondary bg-cl-primary flex">
        <router-link
          class="px25 py20 cl-accent no-underline col-xs"
          :to="localizedRoute(parentSlug )"
          data-testid="categoryLink"
        >{{ $t('View all') }}</router-link>
      </li> -->
      <li class="bg-cl-primary flex" :key="link.slug" v-for="link in children" @click="colorChange(), toggleMenu()">
        <div v-if="link.length > 0" class="subcategory-item" @click="menuSubItemsEmit()">
          <sub-btn-new
            class="bg-cl-transparent brdr-none fs-medium"
            :id="link.title"
            :name="link.title"
            :link="link.link"
          />
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import SubBtnNew from './SubBtnNew.vue';
import i18n from '@vue-storefront/i18n';
import config from 'config';
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers';

export default {
  name: 'SubCategoryCustom',
  components: {
    SubBtnNew,
  },
  data () {
    return {
      currentUlOuterHeightArray: [],
    };
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    uniqueIndex: {
      type: Number,
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
      default: ''
    },
    parentPath: {
      type: String,
      required: false,
      default: ''
    },
    myAccountLinks: {
      type: null,
      required: false,
      default: false
    }
  },

  mounted() {
    console.log('tag', this.active, this.styles)
  },

  computed: {
    children () {
      if (
        this.categoryLinks &&
        this.categoryLinks.length > 0 &&
        this.categoryLinks[0].title
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
    getSubmenu () {
      return this.submenu;
    },
    ulComponent () {
      let name = 'currentUlShow'
      if (this.submenu && this.submenu.path && this.submenu.path[1]) {
        name = (this.submenu.path[0] + this.submenu.path[1] + '_' + this.uniqueIndex).replace(/ /g, '_')
      }
      return name;
    },
    className () {
      const pos = this.submenu.path.indexOf(this.id);
      return (pos !== -1 && this.submenu.depth === 2) ? 'currentUlShow ' + this.ulComponent : false;
    },
      active() {
      // if(this.submenu.path[1]){
      //   document.getElementById("backBtnRef").innerHTML = this.submenu.path[1];
      //   document.getElementById("backBtnRef").removeAttribute("href")
      // }
      const pos = this.submenu.path.indexOf(this.id);
      const currentUlHeight = document.getElementsByClassName(
        this.ulComponent
      )[0];
      if (currentUlHeight) {
        if (this.submenu.depth == 2) {
          document.getElementById("sidebarmenucontainer").style.overflow = "hidden";
        } else {
          document.getElementById("sidebarmenucontainer").style.height = "auto";
          document.getElementById("sidebarmenucontainer").style.overflow = "initial";
        }
      } else if(this.submenu.depth == 2 && this.submenu.path[1] == 'By Room'){
        document.getElementById("sidebarmenucontainer").style.overflow = "hidden";
      }
      return pos !== -1
        ? {
        active: true,
      }
      : false
    },
    styles() {
      // if(this.submenu.path[1]){
      //   document.getElementById("backBtnRef").innerHTML = this.submenu.path[1];
      //   document.getElementById("backBtnRef").removeAttribute("href")
      // }
      const pos = this.submenu.path.indexOf(this.id);
      const currentUlHeight = document.getElementsByClassName(
        this.ulComponent
      )[0];
      if (currentUlHeight) {
        if (this.submenu.depth == 2) {
          document.getElementById('sidebarmenucontainer').style.overflow = 'hidden';
        } else {
          document.getElementById('sidebarmenucontainer').style.height = 'auto';
          document.getElementById('sidebarmenucontainer').style.overflow = 'initial';
        }
      } else if (this.submenu.depth == 2 && this.submenu.path[1] == 'By Room') {
        document.getElementById('sidebarmenucontainer').style.overflow = 'hidden';
      }
      return pos !== -1
        ? {
          zIndex: pos + 1,
        }
        : false;
    },
    isCurrentMenuShowed () {
      return (
        this.getSubmenu &&
        this.getSubmenu.depth &&
        this.getSubmenu.path[this.getSubmenu.depth - 1] === this.id
      );
    },
  },
  methods: {
    menuSubItemsEmit () {
      this.$bus.$emit('SubItemHideColor')
    },
    colorChange () {
      let hamColorChange = document.getElementById('hamberger')
      hamColorChange.classList.remove('hamberger-color')

    },
    toggleMenu () {
      setTimeout(function () {
        let bodyVar = document.getElementsByTagName('BODY')[0]
        let sidebarMenu = document.getElementById('sidebarmenucontainer')
        if (sidebarMenu != null) {
          return bodyVar.classList.remove('body-fixed')
        }
      }, 100)
    },
    async logout () {
      await this.$store.dispatch('user/logout', {});
      this.$router.push(this.localizedRoute('/'));
      this.$store.commit('ui/setSubmenu', { depth: false });
    },
    notify (title) {
      if (title === 'My loyalty card' || title === 'My product reviews') {
        this.$store.dispatch('notification/spawnNotification', {
          // type: 'warning',
          // message: i18n.t(
          //   'This feature is not implemented yet! Please take a look at https://github.com/DivanteLtd/vue-storefront/issues for our Roadmap!'
          // ),
          // action1: { label: i18n.t('OK') }
        });
      }
    },
    categoryLink (category) {
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
.sidebar-submenu li {
  border-left: 2px solid #292758;
  border-right: 2px solid #292758;
}

.sidebar-submenu li:last-child {
  border-bottom: 2px solid #292758;
}

.subcategory-item {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #f2f2f2;
}

.subcategory-item a {
  padding-bottom: 9px;
  padding-top: 9px;
  font-size: 10.59px;
  color: #434343;
  font-family: "Oblik";
  line-height: 1.5;
}
ul.sidebar-submenu.level2.absolute.w-100.p0.bg-cl-primary.newCLass.className.active {
    height: 50vh;
    overflow-y: auto;
    background: transparent;
}
</style>
