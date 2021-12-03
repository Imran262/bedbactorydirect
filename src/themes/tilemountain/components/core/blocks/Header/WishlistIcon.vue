<template>
  <div class="bg-cl-transparent bg-location2 brdr-none">
    <button type="button" class="bg-cl-transparent brdr-none p0 location">
      <router-link :to="localizedRoute('/bed-factory-stores')" exact>
        <img src="/assets/icons/location.svg" alt="location" />
        <span class="showrooms">Showrooms</span>
      </router-link>

      <!-- <span
      class="whishlist-count absolute flex center-xs middle-xs border-box py0 px2 h6 lh16 weight-700 cl-white bg-cl-silver"
      v-cloak
      v-show="getWishlistItemsCount"
      >{{ getWishlistItemsCount }}</span>-->
    </button>
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
.showrooms {
  display: block;
  font-size: 12px;
  font-weight: 600;
  font-family: "Roboto";
  color: #071a44;
}
.whishlist-count {
  top: 7px;
  left: 50%;
  min-width: 16px;
  min-height: 16px;
  border-radius: 10px;
}
.bg-location2 button {
  margin-right: 1rem;
}
/* large than mobiles  */
@media (min-width: 768px) and (max-width: 990px) {
  .bg-location2 button {
    margin-right: 0;
  }
}
button img {
  margin-top: 24px;
  /* margin-right: -1px; */
}
.location a:after {
  background-color: transparent !important;
}
@media (max-width: 767px) {
  button {
    display: block;
    height: 23px;
    /* width: 100%; */
    max-width: 6em;
    padding: 0px;
    margin-right: 0;
  }
  img {
  height: 28px;
}
  @media (min-width: 481px) and (max-width: 600px) {
    button {
      width: auto;
    }
  }
  button img {
    /* height: 100%; */
    width: 5vw;
    margin: 0px;
  }
  .bg-cl-transparent span {
    font-size: 12px;
    margin-top: 0.2rem;
  }
}
/* for mobiles  */
@media (min-width: 320px) and (max-width: 480px) {
  button {
    /* max-width: 2em; */
    /* margin-top: 1.2rem; */
    /* transform: scale(0.65); */
    height: auto;
  }
  img {
    width: 4vw;
    margin: 0px;
    height: 26px;
    margin-top: 6px;
  }
  .bg-cl-transparent span{
    /* margin-top: 0.3rem; */
        font-size: 11px;
  }
}
/* for tablets devices */
@media (min-width: 768px) and (max-width: 991px) {
  button img {
    height: 32px;
    margin-top: 27px;
  }
}
/* img {
  height: 31px;
} */
/* @media (max-width: 399px) {
  button img {
    height: 24px;
  }
} */
@media (min-width: 992px) { 
 button img {
   height: 33px;
 }
 }
 @media (max-width: 319px) {
   button{
     height: 40px;
   }
   button img {
      width: 4.3vw;
    height: 27px;
 }
 .bg-cl-transparent{
       margin-right: 0.2rem;
 }
 .bg-cl-transparent span{
    font-size: 10px;
     margin-top: 0;
 }
 }
</style>