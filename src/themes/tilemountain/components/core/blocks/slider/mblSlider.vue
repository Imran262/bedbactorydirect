<template>
  <div class="mbl_slider">
    <router-link to="/about">
      <img
        src="/assets/mobile-tile-mountain-outdoor-pic.1596765764.jpg"
        width="100%"
      />
    </router-link>
  </div>
</template>
<script>
export default {
  name: "mblSlider",
};
</script>
<style lang="scss" scoped>
.mbl_slider {
  margin-top: -13px;
}
@media (min-width: 767px) {
  .mbl_slider {
    display: none;
  }
  .mbl_slider {
    margin-top: -23px;
  }
}
</style>