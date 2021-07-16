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
   padding: 50px 10px 50px 10px;
}
.HomeBottomContent-inner h1 {
  font-size: 20px;
  color: #707070;
}
.HomeBottomContent-inner p {
    font-size: 18px;
    line-height: 1.6;
    color: #333333;
    text-align: justify;
}
.HomeBottomContent-inner h1 {
    font-size: 25px;
    color: #071A44;
    font-weight: bold;
    font-family: oblik;
}
.HomeBottomContent-inner strong {
    color: #071A44;
}
@media screen and (max-width: 767px){
.HomeBottomContent-inner p {
    font-size: 16px;
}
}
</style>
