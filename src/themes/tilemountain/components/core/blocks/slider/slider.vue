<template>
  <div>
    <desktopSlider />
    <mblSlider />
  </div>
</template>

<script>
import desktopSlider from "theme/components/core/blocks/slider/desktopSlider";
import mblSlider from "theme/components/core/blocks/slider/mblSlider";
export default {
  name: "slider",
  components: {
    desktopSlider,
    mblSlider,
  },
};
</script>