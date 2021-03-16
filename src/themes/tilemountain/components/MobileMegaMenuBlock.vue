<template>
  <div class="sidebar-menu sidebar-menu-two fixed mw-100">
    <div
      class="sidebar-menu__container row"
      id="sidebarmenucontainer"
      ref="container"
    >
      <div class="col-xs-12 h4 serif">
        <ul class="p0 m0 relative sidebar-menu__list" :style="mainListStyles">
          <li
            class="sidebar-menu-li bg-cl-primary flex"
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
                >{{ category.title }}</router-link
              >
            </div>

            <div v-else class="subcategory-item" @click="menuItemsEmit()">
              <router-link
                class="px25 py20 cl-accent no-underline col-xs"
                :to="localizedRoute(category.link)"
                >{{ category.title }}</router-link
              >
            </div>
            <sub-category-custom
              :category-links="category.submenu"
              :id="category.title"
              :parent-slug="category.title"
              :parent-path="category.link"
            />
          </li>
          <!-- <li
            @click="login"
            class="brdr-bottom-1 brdr-cl-secondary bg-cl-secondary flex"
          >
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
              >{{ $t("My account") }}</a
            >
          </li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import i18n from "@vue-storefront/i18n"
import SidebarMenu from "@vue-storefront/core/compatibility/components/blocks/SidebarMenu/SidebarMenu"
import SubBtn from "theme/components/core/blocks/SidebarMenu/SubBtn"
import SubCategoryCustom from "theme/components/core/blocks/SidebarMenu/SubCategoryCustom"
import { formatCategoryLink } from "@vue-storefront/core/modules/url/helpers"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock"
export default {
  components: {
    SubCategoryCustom,
    SubBtn,
  },
  mixins: [SidebarMenu, cmsBlock],
  data () {
    return {
      myAccountLinks: [
        {
          id: 1,
          name: i18n.t("My profile"),
          url: "/my-account",
        },
        {
          id: 2,
          name: i18n.t("My delivery details"),
          url: "/my-account/shipping-details",
        },
        {
          id: 3,
          name: i18n.t("My newsletter"),
          url: "/my-account/newsletter",
        },
        {
          id: 4,
          name: i18n.t("My orders"),
          url: "/my-account/orders",
        },
      ],
      componentLoaded: false,
    }
  },
  computed: {
    mainListStyles () {
      return this.submenu.depth
        ? `transform: translateX(${this.submenu.depth * 100}%)`
        : false
    },
    mobileMenuLinks () {
      var mainTopLinks = []
      var i = 0
      var mbclasses = this.parsedContent.querySelectorAll(".sb-menu");
      [].forEach.call(mbclasses, (mbclass) => {
        var menulink = []
        if (mbclass.querySelector("a.sb-forward").attributes["href"]) {
          menulink["link"] = mbclass.querySelector("a.sb-forward").attributes[
            "href"
          ]
        } else {
          menulink["link"] = "#"
        }
        if (mbclass.querySelector("a.sb-forward").rawText) {
          menulink["title"] = mbclass.querySelector("a.sb-forward").rawText
        } else {
          menulink["title"] = "UnDefined"
        }

        var issubmenu = false
        var submenuimg = false

        if (mbclass.querySelector(".nav-panel-dropdown")) {
          var totalsubmenublocks = 0
          var blockiterator = 0
          var submenublockselements = mbclass.querySelectorAll(
            ".sb-height-dropdown-menu"
          )
          if (submenublockselements.length) {
            issubmenu = true
            totalsubmenublocks = submenublockselements.length

            var allsubmenublocks = [];
            [].forEach.call(submenublockselements, (submenublockelement) => {
              var submenublockls = []
              var submenublocklinks = []

              if (submenublockelement.querySelector(".subcag-title").rawText) {
                var subblocktitle = submenublockelement.querySelector(
                  ".subcag-title"
                ).rawText
              } else {
                var subblocktitle = "UnDefined"
              }

              submenublockls["main_title"] = subblocktitle

              var bulletul = submenublockelement.querySelector("ul.bullet")
              var bulletullis = bulletul.querySelectorAll("li")
              var bulletlicount = 0;

              [].forEach.call(bulletullis, (bulletulli) => {
                var submenulink = new Array(2)

                var bulletullianchor = bulletulli.querySelector("a")
                if (bulletullianchor && bulletullianchor.attributes["href"]) {
                  submenulink["link"] = bulletullianchor.attributes["href"]
                } else {
                  submenulink["link"] = "#"
                }

                if (bulletullianchor && bulletullianchor.rawText) {
                  submenulink["title"] = bulletullianchor.rawText
                } else {
                  submenulink["title"] = "UnDefined"
                }

                submenublocklinks[bulletlicount] = submenulink

                bulletlicount++
              })

              submenublockls["sub_links"] = submenublocklinks
              allsubmenublocks[blockiterator] = submenublockls
              blockiterator++
            })

            if (mbclass.querySelector("img")) {
              // submenuimg = true;
              submenuimg = mbclass.querySelector("img").attributes["src"]
            }
          }
          // console.log('Total subblocks ' + totalsubmenublocks);
        }

        if (issubmenu) {
          // console.log('Submenuhtml', allsubmenublocks);
          menulink["submenu"] = allsubmenublocks
        }

        if (submenuimg) {
          menulink["submenuimg"] = submenuimg
        }
        mainTopLinks[i] = menulink
        i++
      })

      // this.parsedContent.querySelectorAll('.mb_class').forEach(this.title);

      return mainTopLinks
      // return this.parsedContent.querySelector('a').attributes['href'];
    },
    ...mapState({
      submenu: (state) => state.ui.submenu,
      currentUser: (state) => state.user.current,
    }),
    getSubmenu () {
      return this.submenu
    },
    visibleCategories () {
      return this.categories.filter((category) => {
        return category.product_count > 0 || category.children_count > 0
      })
    },
    isCurrentMenuShowed () {
      return !this.getSubmenu || !this.getSubmenu.depth
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.componentLoaded = true
      disableBodyScroll(this.$refs.container)
    })
  },
  destroyed () {
    clearAllBodyScrollLocks()
  },
  methods: {
    login () {
      if (!this.currentUser && this.isCurrentMenuShowed) {
        this.$nextTick(() => {
          this.$store.commit("ui/setAuthElem", "login")
          this.$bus.$emit("modal-show", "modal-signup")
          this.$router.push({ name: "my-account" })
        })
      }
    },
    menuItemsEmit(){
       this.$bus.$emit("hidecolor")
    },
    categoryLink (category) {
      return formatCategoryLink(category)
    },
  },
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'Oblik';
  src: url('/assets/fonts/Oblik_Bold.otf');
}
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
      //background-color: $color-gainsboro;
    }
    &.bg-cl-primary {
      &:hover,
      &:focus {
        //background-color: $bg-secondary;
      }
    }
    a {
      color: $color-mine-shaft;
    }
  }

  .subcategory-item {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #f2f2f2;
    button {
      padding-bottom: 9px;
      padding-top: 9px;
      font-size: 10.59px;
      color: #434343;
      font-family: 'Oblik';
      line-height: 1.5;
    }
    a {
      padding-bottom: 9px;
      padding-top: 9px;
      font-size: 10.59px;
      color: #434343;
      font-family: 'Oblik';
      line-height: 1.5;
    }
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
  .sidebar-menu-li {
    border-left: 2px solid #292758;
    border-right: 2px solid #292758;
    &:first-child {
      border-top: 2px solid #292758;
    }
    &:last-child {
      border-bottom: 2px solid #292758;
    }
  }
}
.sidebar-menu ul li:nth-child(11n) {
  background: #00adee;
}
.sidebar-menu ul li:nth-child(12n) {
  display: none;
}
.sidebar-menu ul li:nth-child(11n) button {
  color: #fff;
}
.sidebar-menu ul li:nth-child(11n) a {
  color: #fff !important;
}
// #sidebarmenucontainer {
//     overflow: hidden;
// }
</style>
