<template>
  <div
    class="overlay bilal fixed w-100"
    @click="close(), colorChange()"
    v-if="isVisible"
  />
</template>

<script>
import Overlay from '@vue-storefront/core/compatibility/components/Overlay'

export default {
  mixins: [Overlay],
  methods: {
    close() {
      this.$store.commit('ui/setOverlay', false)
      this.$store.commit('ui/setMicrocart', false)
      this.$store.commit('ui/setWishlist', false)
      this.$store.commit('ui/setSearchpanel', false)
      this.$store.commit('ui/setSidebar', false)
      this.$store.dispatch('themeCart/closeEditMode')
      this.$store.dispatch('notification/removeNotification')
    },
    colorChange() {
      let hamColorChange = document.getElementById('hamberger')
      hamColorChange.classList.toggle('hamberger-color')
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
@import '~theme/css/base/global_vars';
$color-bg: color(black);
$z-index-overlay: map-get($z-index, overlay);

.overlay {
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba($color-bg, 0.4);
  z-index: 5;
}
.notificationOverlay {
  z-index: 5;
}
</style>
