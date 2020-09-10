<template>
  <button
    type="button"
    class="bg-cl-transparent brdr-none p0 p15 icon pointer basket-icon relative"
    @click="openMicrocart"
    data-testid="openMicrocart"
    :aria-label="$t('Open microcart')"
  >
    <div class="wishlist">
      <div class="wishlist-img">
        <span>
          <img src="/assets/basket-4.svg">
        </span>
      </div>
      <div class="wishlist-text">
        <span>Basket</span>
      </div>
    </div>
    <span
      class="minicart-count absolute flex center-xs middle-xs"
      v-cloak
      v-show="totalQuantity"
      data-testid="minicartCount"
    >{{ totalQuantity }}</span>
  </button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import MicrocartIcon from '@vue-storefront/core/compatibility/components/blocks/Header/MicrocartIcon';

export default {
  // mixins: [MicrocartIcon],
  mounted() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.$store.dispatch('cart/load');
      }
    });
  },
  computed: {
    ...mapGetters({
      totalQuantity: 'cart/getItemsTotalQuantity'
    })
  },
  methods: {
    ...mapActions({
      openMicrocart: 'ui/toggleMicrocart'
    })
  }
};
</script>

<style lang="scss" scoped>
.minicart-count {
  top: 7px;
  left: 50%;
  width: auto;
  height: 20px;
  border-radius: 10px;
  background-color: #0f988b;
  color: #fff;
  border-radius: 3px;
  font-size: 0.8rem;
  font-family: 'Poppins', sans-serif;
  padding:0px 8px;
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
    padding: 0;
    .wishlist-text {
      span {
        display: none;
      }
    }
  }
  .minicart-count {
    top: -15px;
    left: 21%;
    padding: 0px 5px;
  }

  .basket-icon {
    padding: 0;
  }
}
@media (min-width: 768px) and (max-width: 990px) {
  .wishlist {
    padding: 0;
    .wishlist-text {
      span {
        display: none;
      }
    }
  }
  .basket-icon {
    padding: 0;
  }
}
</style>
