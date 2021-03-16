<template>
  <div>
    <HomeSliderDesktop />
    <HomeSliderMobile />
    <!-- <HomeViewMobile /> -->
  </div>
</template>

<script>
import HomeSliderMobile from './HomeSliderMobile';
import HomeSliderDesktop from './HomeSliderDesktop';
export default {
  components: {
    HomeSliderDesktop,
    HomeSliderMobile
  }
};
</script>

<style>
</style>
