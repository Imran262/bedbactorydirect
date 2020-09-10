<template>
  <div class="top-bar"></div>
</template>

<script>
export default {
  components: {
    name: "Topbar"
  }
};
</script>

<style lang="scss" scoped>
.top-bar {
  background-color: #00bfb3;
}
.top-bar p {
  display: none;
  margin: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  color: #fff;
  text-align: center;
}
@media (min-width: 320px) and (max-width: 767px) {
  .top-bar p {
    font-size: 12px;
  }
}
</style>
