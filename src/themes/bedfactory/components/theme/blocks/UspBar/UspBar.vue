<template>
  <div class="usp-bar">
    <div class="container">
      <div class="usp-bar-inner">
        <CmsBlock identifier="usp-bar" />
      </div>
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
<style lang='scss'>
.usp-bar-box{
  img{
    width: 18px;
    height: 15px;
    padding-right: 5px;
  }
  p{
    display: inline;
  }
}
.mobile-view {
    text-align: center;
}
@media screen and (max-width: 767px){
  .usp-bar {
    display: none;
}
}
</style>
