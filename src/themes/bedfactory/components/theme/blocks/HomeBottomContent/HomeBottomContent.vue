<template>
  <div class="HomeBottomContent">
    <div class="container">
      <CmsBlock identifier="home-bottom-content" />
    </div>
  </div>
</template>

<script>
import CmsBlock from "theme/components/core/blocks/Cms/Block";
export default {
  components: {
    CmsBlock,
  },
};
</script>
<style>
.HomeBottomContent {
  background-color: #f8f8f8;
}
.HomeBottomContent-inner {
  padding-top: 50px;
  padding-bottom: 50px;
}
.HomeBottomContent-inner h1 {
  font-size: 20px;
  color: #707070;
}
.HomeBottomContent-inner p {
  font-size: 14px;
  color: #707070;
}
</style>
