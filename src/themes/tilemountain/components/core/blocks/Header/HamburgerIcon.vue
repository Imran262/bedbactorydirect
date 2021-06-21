<template>
  <button
    type="button"
    class="bg-cl-transparent brdr-none inline-flex"
    @click="openSidebarMenu(), colorChange(), toggleMenu()"
    :aria-label="$t('Open menu')"
    data-testid="menuButton"
  >
    <i class="material-icons" id="hamberger"></i>
  </button>
</template>

<script>
import HamburgerIcon from "@vue-storefront/core/compatibility/components/blocks/Header/HamburgerIcon"

export default {
  mixins: [HamburgerIcon],
  beforeMount(){
      this.$bus.$on('hidecolor', this.colorChange , this.toggleMenu)
      this.$bus.$on('SubItemHideColor', this.colorChange , this.toggleMenu)
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
          console.log('vissible')
          return bodyVar.classList.toggle('body-fixed')
        }
      }, 100)
    }
  }
};
</script>
<style scoped>
button i {
  /* font-size: 31px;
  color: #29275b; */
  position: absolute;
  border-top: 2px solid #e3e3e5;
  border-left: 2px solid #c2c2c2;
  border-right: 1px solid #c2c2c2;
  border-bottom: 2px solid #e3e3e5;
  bottom: 15px;
  left: -2px;
  width: 40px;
  height: 35px;
  line-height: 1.2;
  background: #ffffff url('/assets/menu-blue.svg') no-repeat 50% 50%;
}
.hamberger-color {
  color: #fff;
  border-top: 2px solid #292758;
  border-left: 2px solid #292758;
  border-bottom: 1px solid #292758;
  background-color: #292758;
  background: #292758 url('/assets/menu-white.svg') no-repeat 50% 50%;
}
@media screen and (max-width: 991px) and (min-width: 767px) {
  button i {
    bottom: 0px;
  }
}
</style>
<style>
.body-fixed {
  position: fixed;
  width: 100%;
}
@media screen and (max-width: 767px) {
  .body-fixed .overlay.fixed.w-100 {
    height: 88vh;
    top: auto;
    bottom: 0;
  }
  i#hamberger {
    bottom: 15px !important;
}
}

</style>