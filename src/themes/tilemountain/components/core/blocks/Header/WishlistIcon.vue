<template>
  <div class="bg-cl-transparent brdr-none">
    <button type="button" class="bg-cl-transparent brdr-none p0 location">
      <router-link :to="localizedRoute('/bed-factory-stores')" exact>
        <img src="/assets/icons/location.svg" alt="location" />
      </router-link>

      <!-- <span
      class="whishlist-count absolute flex center-xs middle-xs border-box py0 px2 h6 lh16 weight-700 cl-white bg-cl-silver"
      v-cloak
      v-show="getWishlistItemsCount"
      >{{ getWishlistItemsCount }}</span>-->
    </button>
    <span>Showrooms</span>
  </div>
</template>

<script>
// import WishlistIcon from "@vue-storefront/core/compatibility/components/blocks/Header/WishlistIcon";

export default {
  // mixins: [WishlistIcon]
};
</script>

<style scoped>
/* button {
  padding-right: 13px;
} */
.bg-cl-transparent button{
  margin-left: 30px;
}
.bg-cl-transparent span{
      color: #071A44;
      font-weight: bold;
       font-family: 'Roboto', sans-serif;
           font-size: 14px;
}
.whishlist-count {
  top: 7px;
  left: 50%;
  min-width: 16px;
  min-height: 16px;
  border-radius: 10px;
}
button img {
  margin-top: 29px;
  margin-right: -1px;
}
.location a:after {
  background-color: transparent !important;
}
@media (max-width: 767px) {
  button {
    display: block;
    height: 76px;
    /* width: 100%; */
    max-width: 5em;
    padding: 0px;
  }
  @media (min-width: 481px) and (max-width: 600px) {
    button {
      width: auto;
    }
  }
  button img {
    /* height: 28px;
    margin-top: 9px; */
    height: 100%;
    width: 5vw;
    padding-top: 3px;
    margin: 0px;
  }
}
@media (min-width: 320px) and (max-width: 480px) {
  button {
    max-width: 2em;
    /* transform: scale(0.65); */
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  button img {
    height: 22px;
    margin-top: 29px;
  }
}
img {
  height: 23px;
  margin-top: 12px;
}
/* @media (max-width: 399px) {
  button img {
    height: 24px;
  }
} */
</style>
