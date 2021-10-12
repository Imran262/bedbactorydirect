<template>
  <div class="link_button" @click=" toggleMenu()"   @click.stop="next()">
    <template v-if="type === 'next'">
      <template v-if="link">
        <router-link
          class="menuLinkTag inline-flex between-xs w-100 px25 py20 pr15 serif cl-accent"
          :to="localizedRoute('')"
        >
          {{ name }}
        </router-link>
      </template>
      <template v-else>
        {{ name }}
      </template>
      <button
        class="inline-flexarrow-forward"
        type="button"
        @click.stop="next()"
        :aria-label="$t('Show subcategories')"
        data-testid="categoryButton"
      >
        <i class="material-icons">
          <!-- <img src="/assets/right-arrow.png" /> -->
        </i>
      </button>
    </template>
    <template v-else>
      <div class="sub-category-mobile-main-back" >
        <div class="d-flex align-center"  @click.stop="back(false)">
          <button
            class="arrow-back"
            type="button"
            @click.stop="back(false)"
            :aria-label="$t('Back')"
          >
            <i class="material-icons"> </i>
          </button>
          <template v-if="submenu.depth == 1">
            <div id="backBtnRef" @click.stop="back(false)">
              {{ menuName }}
            </div>
          </template>
          <template v-else>
            <span id="backBtnRef" @click.stop="back(false)">
              {{ submenu.path[1] }}
            </span>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState } from "vuex"
import config from "config"
import hamburgerMenu from '@vue-storefront/core/compatibility/components/blocks/Header/HamburgerIcon'
export default {
  name: "SubBtn",
  data () {
    return {
      menuName: "",

    }
  },
  props: {
    id: {
      type: null,
      default: "",
    },
    type: {
      type: String,
      default: "next",
    },
    name: {
      type: String,
      default: "",
    },
    isCategory: {
      type: Boolean,
      default: true,
    },
    link: {
      type: String,
      default: "",
    },
  },
  mixins: [hamburgerMenu],
  computed: {
    ...mapState({
      submenu: (state) => state.ui.submenu,
      submenuLink: (state) => state.ui.submenu.link,
    }),
  },
  mounted () {
    this.changeValue()

  },
  methods: {
    colorChange () {
      let hamColorChange = document.getElementById("hamberger")
      hamColorChange.classList.toggle("hamberger-color")

    },
    toggleMenu () {
      setTimeout(function () {
        let bodyVar = document.getElementsByTagName('BODY')[0]
        let sidebarMenu = document.getElementById('sidebarmenucontainer')
        if (sidebarMenu != null) {
          // console.log('9512 vissible sub btn',bodyVar.classList, bodyVar.classList.indexOf("body-fixed"),bodyVar.classList.includes("body-fixed"))
          
          
          console.log('9512 vissible sub btn',bodyVar.classList, typeof bodyVar.classList)
          var exists = Object.keys(bodyVar.classList).some(function(k) {
            return bodyVar.classList[k] === "body-fixed";
            });
       console.log('9512 vissible sub btn',exists)
          // console.log('9512 vissible sub btn',bodyVar.classList,bodyVar.classList.includes("body-fixed"))
          if (exists)
          return true
          else
            return bodyVar.classList.toggle('body-fixed')
        }
      }, 100)
    },
    changeValue () {
      if (this.submenu.depth == 1) {
        this.menuName = this.submenu.path[0]
      } else if (this.submenu.depth == 2) {
        this.menuName = this.submenu.path[1]
      }
    },
    redirectTo () {
      this.$router.push(this.localizedRoute(this.submenuLink))
      this.closeSidebarMenu()
    },
    next () {
      // console.log('event', event)
      // console.log('toelement', event.toElement)
      // console.log('toparentElement', event.toElement.parentElement.parentElement)
      // console.log('toparentElement', event.toElement.parentElement.parentElement.parentElement)
      // console.log('parentnextElementSibling', event.toElement.parentElement.parentElement.parentElement.nextElementSibling)
      if (
        this.submenu.depth &&
        this.submenu.depth == 1 &&
        event.toElement &&
        event.toElement.parentElement &&
        event.toElement.parentElement.parentElement &&
        event.toElement.parentElement.parentElement.parentElement
          .nextElementSibling &&
        event.toElement.parentElement.parentElement.parentElement
          .nextElementSibling.children[0]
      ) {
        const heightVal =
          event.toElement.parentElement.parentElement.parentElement
            .nextElementSibling.children[0].offsetHeight
        document.getElementById("sidebarmenucontainer").style.height =
          heightVal + "px"

        // console.log('heightVal', heightVal)
      } else if (
        this.submenu.depth &&
        this.submenu.depth == 1 &&
        event.toElement &&
        event.toElement.parentElement.parentElement &&
        event.toElement.parentElement.parentElement.nextElementSibling &&
        event.toElement.parentElement.parentElement.nextElementSibling
          .children[0]
      ) {
        const heightValForImg =
          event.toElement.parentElement.parentElement.nextElementSibling
            .children[0].offsetHeight
        document.getElementById("sidebarmenucontainer").style.height =
          heightValForImg + "px"
        // console.log('else if heightValForImg', heightValForImg)
      }
      if (
        config.entities.category.categoriesDynamicPrefetch &&
        this.isCategory
      ) {
        this.$store.dispatch("category-next/fetchMenuCategories", {
          parent: this.id,
        })
      }

      this.$store.commit("ui/setSubmenu", {
        id: this.id,
        depth: ++this.submenu.depth,
        link: this.link
      })
    },
    async back (linkCheck) {
      if (linkCheck) {
        // this.$router.push({
        //   path: "/mosaic-tiles.html",
        // });
      } else {
        this.$store.commit("ui/setSubmenu", {
          depth: --this.submenu.depth,
          link: this.link
        })
        if (this.submenu.path[0]) {
          setTimeout(() => {
            if (
              document.getElementById("backBtnRef") !== null &&
              document.getElementById("backBtnRef") !== ""
            ) {
              document.getElementById("backBtnRef").innerHTML =
                this.submenu.path[0]
            }
          }, 200)
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-gray: color(gainsboro);
$color-black: color(matterhorn);
.d-flex {
  display: flex;
}

button {
  i {
    color: $color-gray;
    font-size: 0;
    line-height: 0;
  }
  &:hover,
  &:focus {
    i {
      color: $color-black;
    }
  }
}
.sidebar-menu ul li:nth-child(11n) button i {
  filter: brightness(0) invert(1);
}
.sidebar-menu .sidebar-menu-li button i {
  position: relative;
}
.arrow-forward button i:after {
  content: '';
  background: url('/assets/arrow-forward.png');
  position: absolute;
  left: 10px;
  top: 15px;
  width: 7px;
  height: 15px;
}
.sidebar-menu .sidebar-menu-li button i:after {
  content: '';
  background: url(/assets/right-arrow.png);
  position: absolute;
  right: 0;
  top: 0;
  width: 7px;
  height: 15px;
}
.subcategory-item {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #f2f2f2;
  .link_button {
    position: relative;
    width: 100%;
    padding-bottom: 9px;
    padding-top: 9px;
    font-size: 14px;
    color: #434343;
    font-family: 'Oblik';
    line-height: 1.5;
    padding-left: 25px;
    button {
      // padding-bottom: 9px;
      // padding-top: 9px;
      // font-size: 10.59px;
      // color: #434343;
      // font-family: "Oblik";
      // line-height: 1.5;
      background: transparent;
      border: none;
      position: absolute;
      right: 10px;
      top: -3px;
    }

    a {
      // padding-bottom: 9px;
      // padding-top: 9px;
      //line-height: 1.5;
      padding: 0;
      font-size: 15px;
      color: #434343;
      font-family: 'Oblik';
      width: 50%;
    }
  }
  a {
    padding-bottom: 9px;
    padding-top: 9px;
    font-size: 15px;
    color: #434343;
    font-family: 'Oblik';
    line-height: 1.5;
  }
}
@media only screen and (min-device-width: 320px) and (max-device-width: 767px) {
  .arrow-forward .link_button button {
    padding-bottom: 15px;
    width: 10%;
    padding-top: 15px;
    border-top: 2px solid #292758;
    border-left: 2px solid #292758;
    border-right: 2px solid #292758;
    position: relative;
    background: transparent;
    border: none;
    text-align: left;
  }
  .sub-category-mobile-main-back {
    border-top: 2px solid #292758;
    border-left: 2px solid #292758;
    border-right: 2px solid #292758;
  }
}
</style>
<style>
.align-center {
  align-items: center;
}
#backBtnRef i:after {
  content: '';
  background: url('/assets/arrow-forward.png');
  position: absolute;
  left: 10px;
  top: 15px;
  width: 7px;
  height: 15px;
}
#backBtnRef {
  padding-left: 3.5px;
  font-size: 14px;
  font-family: 'Oblik';
  color: #fff;
  font-weight: bold;
  width: 100%;
  text-align: left;
}
#backBtnRef a {
  font-size: 10.59px;
  font-family: 'Oblik';
  color: #fff;
  font-weight: bold;
  padding-left: 0;
}
.body-fixed {
  position: fixed !important;
}
</style>
