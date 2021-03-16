<template>
  <button type="button" class="new_button added-to-basket">
    <span>
      <span>Added To Basket</span>
    </span>
  </button>
</template>
<script>
export default {
  name: 'AddedToBasket'
}
</script>

<style lang="scss" scoped>
.added-to-basket {
  display: block;
  border-radius: 3px;
  cursor: pointer;
  width: 100%;
  padding: 9px;
  height: 100%;
  min-height: 48px;
  border: 2px solid #2a275c;
  float: left;
  background-color: #ffffff;
  font-weight: 700;

  span {
    background: none !important;
    color: #2a275c;
  }
}
</style>
