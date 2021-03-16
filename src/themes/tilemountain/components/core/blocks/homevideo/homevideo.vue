<template>
  <div class="container">
    <div class="row">
      <advice :identifier="'style_advice'" />
    </div>
  </div>
</template>

<script>
import advice from "theme/components/core/blocks/advice/advice";
import mainvideo from "theme/components/core/blocks/mainvideo/mainvideo";
export default {
  name: "homevideo",
  components: {
    advice,
    mainvideo,
  },
};
</script>
<style lang="scss" scoped>
.home_video {
  padding: 25px 0px 25px 0px;
}
.home_video1 {
  text-align: right;
  padding: 25px 0px 25px 0px;
}
@media (max-width: 767px) {
  .home_video {
    padding: 0px;
  }
  .home_video1 {
    text-align: right;
    padding: 0px;
  }
}
</style>