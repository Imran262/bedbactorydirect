<template>
  <button @click="$emit('click')" class="cart-remove-btn">
    <span class="h6 hidden-xs">{{ $t('Remove') }}</span>
  </button>
</template>
<style scoped>
.cart-remove-btn {
  background: transparent;
  border: none;
  display: flex;
  flex-direction: row;
}
.cart-remove-btn:after {
  content: "x";
  width: 17px;
  height: 17px;
  background-color: #4a4643;
  border-radius: 50%;
  color: #fff;
}
.cart-remove-btn span {
  font-size: 16px;
  color: #4a4a4a;
  font-weight: bold;
  padding-right: 10px;
}
</style>
