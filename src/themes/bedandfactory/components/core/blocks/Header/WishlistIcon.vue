<template>
  <button
    type="button"
    class="inline-flex bg-cl-transparent brdr-none relative sb-wishlist"
    @click="toggleWishlistPanel"
    :aria-label="$t('Open wishlist')"
  >
    <div class="wishlist">
      <div class="wishlist-img">
        <span>
          <img src="/assets/heart.svg">
        </span>
      </div>
      <div class="wishlist-text">
        <span>Wishlist</span>
      </div>
    </div>
    <span
      class="whishlist-count absolute flex center-xs middle-xs border-box py0 px2 h6 lh16 weight-700 cl-white bg-cl-silver"
      v-cloak
      v-show="getWishlistItemsCount"
    >{{ getWishlistItemsCount }}</span>
  </button>
</template>

<script>
import WishlistIcon from '@vue-storefront/core/compatibility/components/blocks/Header/WishlistIcon';

export default {
  mixins: [WishlistIcon]
};
</script>

<style lang="scss" scoped>
.whishlist-count {
  top: 7px;
  left: 50%;
  min-width: 16px;
  min-height: 16px;
  border-radius: 10px;
}
.wishlist {
  padding: 10px;
  .wishlist-img {
    span {
      display: block;
      text-align: center;
    }
  }
  .wishlist-text {
    span {
      font-size: 0.671875rem;
      font-family: 'Poppins', sans-serif;
      color: #54575b;
    }
  }
}
@media (max-width: 767px) {
  .wishlist {
    .wishlist-text {
      span {
        display: none;
      }
    }
  }
}
@media (min-width: 768px) and (max-width: 990px) {
  .wishlist {
    
    .wishlist-text {
      span {
        display: none;
      }
    }
  }
}
@media (min-width: 991px) and (max-width: 1024px) {
  // .wishlist {
  //   padding: 0;
  // }
}
</style>
