<template>
  <div class="sidebar-menu fixed mw-100 bg-cl-secondary">
    <div class="sidebar-menu__container row" ref="container">
      <div class="col-xs-12 h4 serif fawad">
        <ul class="p0 m0 relative sidebar-menu__list" :style="mainListStyles">
          <li
            class="brdr-bottom-1 brdr-cl-bg-secondary bg-cl-primary flex"
            :key="category.slug"
            @click="closeMenu"
            v-for="category in mobileMenuLinks"
          >
            <div v-if="category.submenu" class="subcategory-item">
              <sub-btn
                v-if="category.submenu.length > 0"
                class="bg-cl-transparent brdr-none fs-medium"
                :id="category.title"
                :name="category.title"
                :link="category.link"
              />
              <router-link
                v-else
                class="px25 py20 cl-accent no-underline col-xs"
                :to="localizedRoute(category.link)"
              >{{ category.title }}</router-link>
            </div>

            <div v-else class="subcategory-item">
              <router-link
                class="px25 py20 cl-accent no-underline col-xs"
                :to="localizedRoute(category.link)"
              >{{ category.title }}</router-link>
            </div>

            <sub-category-custom
              :category-links="category.submenu"
              :id="category.title"
              :parent-slug="category.link"
              :parent-path="category.link"
            />
          </li>
          <li @click="login" class="brdr-bottom-1 brdr-cl-secondary bg-cl-secondary flex">
            <sub-btn
              v-if="currentUser"
              :name="$t('My account')"
              class="bg-cl-transparent brdr-none fs-medium-small"
            />
            <sub-category
              v-if="currentUser"
              :my-account-links="myAccountLinks"
              :id="'foo'"
              @click.native="closeMenu"
            />
            <a
              v-if="!currentUser && isCurrentMenuShowed"
              href="#"
              @click.prevent="closeMenu"
              class="block w-100 px25 py20 cl-accent no-underline fs-medium-small"
            >{{ $t('My account') }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import i18n from '@vue-storefront/i18n';
import SidebarMenu from '@vue-storefront/core/compatibility/components/blocks/SidebarMenu/SidebarMenu';
import SubBtn from 'theme/components/core/blocks/SidebarMenu/SubBtn';
import SubCategoryCustom from 'theme/components/core/blocks/SidebarMenu/SubCategoryCustom';
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import cmsBlock from 'vsf-cms-block-mixin/components/cmsBlock';
export default {
  components: {
    SubCategoryCustom,
    SubBtn
  },
  mixins: [SidebarMenu, cmsBlock],
  data() {
    return {
      myAccountLinks: [
        {
          id: 1,
          name: i18n.t('My profile'),
          url: '/my-account'
        },
        {
          id: 2,
          name: i18n.t('My delivery details'),
          url: '/my-account/shipping-details'
        },
        {
          id: 3,
          name: i18n.t('My newsletter'),
          url: '/my-account/newsletter'
        },
        {
          id: 4,
          name: i18n.t('My orders'),
          url: '/my-account/orders'
        }
      ],
      componentLoaded: false
    };
  },
  computed: {
    mainListStyles() {
      return this.submenu.depth
        ? `transform: translateX(${this.submenu.depth * 100}%)`
        : false;
    },
    mobileMenuLinks() {
      console.log('mobileMenuLinks 2', this.parsedContent);
      var mainTopLinks = [];
      var i = 0;
      var mbclasses = this.parsedContent.querySelectorAll('.sb-menu');
      // console.log('Sb -class ', mbclasses);
      [].forEach.call(mbclasses, mbclass => {
        // do whatever
        // console.log('class - ' + i, mbclass);
        var menulink = [];
        if (mbclass.querySelector('a.sb-forward').attributes['href']) {
          menulink['link'] = mbclass.querySelector('a.sb-forward').attributes[
            'href'
          ];
        } else {
          menulink['link'] = '#';
        }
        if (mbclass.querySelector('a.sb-forward').rawText) {
          menulink['title'] = mbclass.querySelector('a.sb-forward').rawText;
        } else {
          menulink['title'] = 'UnDefined';
        }

        var issubmenu = false;
        var submenuimg = false;

        if (mbclass.querySelector('.nav-panel-dropdown')) {
          var totalsubmenublocks = 0;
          var blockiterator = 0;
          var submenublockselements = mbclass.querySelectorAll(
            '.sb-height-dropdown-menu'
          );
          if (submenublockselements.length) {
            issubmenu = true;
            totalsubmenublocks = submenublockselements.length;

            var allsubmenublocks = [];
            [].forEach.call(submenublockselements, submenublockelement => {
              var submenublockls = [];
              var submenublocklinks = [];

              if (submenublockelement.querySelector('.subcag-title').rawText) {
                var subblocktitle = submenublockelement.querySelector(
                  '.subcag-title'
                ).rawText;
              } else {
                var subblocktitle = 'UnDefined';
              }

              submenublockls['main_title'] = subblocktitle;

              var bulletul = submenublockelement.querySelector('ul.bullet');
              var bulletullis = bulletul.querySelectorAll('li');
              var bulletlicount = 0;

              [].forEach.call(bulletullis, bulletulli => {
                var submenulink = new Array(2);

                var bulletullianchor = bulletulli.querySelector('a');
                if (bulletullianchor && bulletullianchor.attributes['href']) {
                  submenulink['link'] = bulletullianchor.attributes['href'];
                } else {
                  submenulink['link'] = '#';
                }

                if (bulletullianchor && bulletullianchor.rawText) {
                  submenulink['title'] = bulletullianchor.rawText;
                } else {
                  submenulink['title'] = 'UnDefined';
                }

                submenublocklinks[bulletlicount] = submenulink;

                bulletlicount++;
              });

              submenublockls['sub_links'] = submenublocklinks;
              allsubmenublocks[blockiterator] = submenublockls;
              blockiterator++;
            });

            if (mbclass.querySelector('img')) {
              // submenuimg = true;
              console.log('dsadasdsadsadasd');
              submenuimg = mbclass.querySelector('img').attributes['src'];
            }
          }
          // console.log('Total subblocks ' + totalsubmenublocks);
        }

        if (issubmenu) {
          // console.log('Submenuhtml', allsubmenublocks);
          menulink['submenu'] = allsubmenublocks;
        }

        if (submenuimg) {
          menulink['submenuimg'] = submenuimg;
        }
        mainTopLinks[i] = menulink;
        i++;
      });

      // this.parsedContent.querySelectorAll('.mb_class').forEach(this.title);
      console.log('mainTopLinks', mainTopLinks);

      return mainTopLinks;
      // return this.parsedContent.querySelector('a').attributes['href'];
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
          this.$store.commit('ui/setAuthElem', 'login');
          this.$bus.$emit('modal-show', 'modal-signup');
          this.$router.push({ name: 'my-account' });
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
  height: 100%;
  width: 350px;
  overflow: hidden;

  @media (max-width: 767px) {
    width: 100vh;
  }

  &__container {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: calc(100% - 50px);
    overflow-x: hidden;
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
.sidebar-menu ul li:nth-child(12n){
  background: #FEE31D;
}
.sidebar-menu ul li:nth-child(12n) a{
  color: #54575B;
}
</style>
