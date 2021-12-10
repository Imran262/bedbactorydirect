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

.showrooms {
  display: block;
  font-size: 9px;
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

button img {
  margin-top: 24px;
}
.location a:after {
  background-color: transparent !important;
}

@media (max-width: 767px) {
  .headerIconsNew > a .iconContainer {
    width: 16.5px;
  }
}
@media (min-width: 991px) {
  .showrooms {
    font-size: 10px;
  }
}
</style>