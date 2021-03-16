<template>
  <div class="container">
    <router-link :to="{ name: 'home' }">
      <img class="respon" src="/assets/home-vid_05.1524600742.png" alt="homevideo" />
    </router-link>
    <a
      href="/videogallery"
      class="hm-watch-vid1"
      type="button"
      title="Watch Video"
      >WATCH THE VIDEOS</a
    >
  </div>
</template>
<script>
export default {
  name: "mainvideo",
};
</script>
<style lang="scss" scoped>
img {
  border: 0;
  vertical-align: top;
  max-width: 100%;
}
a:hover:after {
  cursor: pointer;
  content: none !important;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: transparent;
}
@media (max-width: 767px) and (min-width: 481px) {
  .respon {
    border: 0;
    vertical-align: top;
    /* max-width: 100%; */
    width: 100%;
  }
}
@media (max-width: 1199px) and (min-width: 991px) {
  .respon {
    margin-top: 97px;
  }
}
@media (max-width: 990px) and (min-width: 768px) {
  .respon {
    margin-top: 228px;
  }
}
.hm-watch-vid1 {
  text-align: center;
  border: none;
  font-family: Arial;
  font-weight: bold;
  height: 47px;
  line-height: 3;
  padding: 15px 47px;
  font-size: 14px;
  border-radius: 4px;
  background-color: #29275b;
  color: #ffffff;
}
@media (max-width: 767px) {
  .hm-watch-vid1 {
    display: block;
    margin-top: 15px;
    padding: 0;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
    height: 40px;
    font-size: 12px;
    margin-bottom: 15px;
  }
}
@media (min-width: 767px) {
  .hm-watch-vid1 {
    display: none;
    margin-top: 15px;
    padding: 0;
  }
}
</style>
