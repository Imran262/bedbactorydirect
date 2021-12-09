<template>
  <div class="bg-cl-transparent bg-location2 brdr-none headerIconsNew">
    <!-- <button type="button" class="bg-cl-transparent brdr-none p0 location"> -->
      <router-link :to="localizedRoute('/bed-factory-stores')" exact>
        <div class="iconContainer">
          <img src="/assets/icons/location.svg" alt="location" />
        </div>
        <span class="showrooms">Showrooms</span>
      </router-link>

      <!-- <span
      class="whishlist-count absolute flex center-xs middle-xs border-box py0 px2 h6 lh16 weight-700 cl-white bg-cl-silver"
      v-cloak
      v-show="getWishlistItemsCount"
      >{{ getWishlistItemsCount }}</span>-->
    <!-- </button> -->
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
.headerIconsNew > a {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.headerIconsNew > a .iconContainer {
    width: 18px;
}
.headerIconsNew > a .iconContainer img{
    max-width: 100%;
}
/* @media (min-width: 1200px) {
    .showrooms {
    font-size: 10px;
  }
} */
.showrooms {
  display: block;
  font-size: 10px;
  font-weight: 600;
  font-family: "Roboto";
  color: #2A275B;
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
/* @media (min-width: 768px) and (max-width: 990px) {
  .bg-location2 button {
    margin-right: 0;
  }
  .showrooms {
    font-size: 9px;
  }
} */
button img {
  margin-top: 24px;
}
.location a:after {
  background-color: transparent !important;
}
/* @media (max-width: 768px) {
  button {
    display: block;
    height: 23px;
    max-width: 6em;
    padding: 0px;
    margin-right: 0;
  }
  img {
  height: 28px;
}
  button img {
    width: 4.3vw;
    margin: 0px;
  }
  .bg-cl-transparent span {
    font-size: 12px;
    margin-top: 0.2rem;
  }
} */

/* for mobiles  */
/* @media (min-width: 320px) and (max-width: 480px) {
  button {

    height: auto;
  }
  img {
    width: 4vw;
    margin: 0px;
    height: 26px;
    margin-top: 6px;
  }
  .bg-cl-transparent span{
        font-size: 11px;
  }
} */

/* for tablets devices */
/* @media (min-width: 768px) and (max-width: 991px) {
  button img {
    height: 32px;
    margin-top: 27px;
  }
} */

/* @media (min-width: 992px) { 
  button img {
    height: 25px;
  }
 } */

 /* @media (max-width: 319px) {
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
 } */
/* @media (min-width: 767px) and (max-width: 1199px) {
  .headerIconsNew > a .iconContainer {
    width: 16px;
  }
} */

@media (max-width: 767px) {
  .headerIconsNew > a .iconContainer {
    width: 16.5px;
  }
}
</style>