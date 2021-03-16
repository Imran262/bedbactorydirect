<template>
  <button
    type="button"
    class="relative bg-cl-transparent brdr-none inline-flex cart"
    data-testid="openMicrocart"
    ref="MicrocartBtn"
    :aria-label="$t('Open microcart')"
    id="minicarticon"
    @mouseover="openMicrocartCustom"
    @mouseout="leaveMicrocartCustom"
    @click="toggleMicrocartCustom"
  >
    <img src="/assets/icons/basket.svg" alt="basket">
    <span
      class="minicart-count absolute flex center-xs middle-xs border-box py0 px2 h6 lh16 weight-700 cl-white"
      v-cloak
      v-show="totalQuantity"
      data-testid="minicartCount"
    >{{ totalItems.length }}</span>
    <span
      class="price"
      id="microcartIconPrice"
      v-cloak
      v-show="totalQuantity"
    >{{ getGrandTotal | price }}</span>
  </button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MicrocartIcon from '@vue-storefront/core/compatibility/components/blocks/Header/MicrocartIcon'
import { syncCartWhenLocalStorageChange } from '@vue-storefront/core/modules/cart/helpers'

export default {
  mounted () {
    syncCartWhenLocalStorageChange.addEventListener()
    this.$once('hook:beforeDestroy', () => {
      syncCartWhenLocalStorageChange.removeEventListener()
    })
    document.body.addEventListener('click', (event) => {
      this.closeMiniCart(event)
    });
  },
  computed: {
    ...mapGetters({
      totalQuantity: 'cart/getItemsTotalQuantity',
      totalItems: 'cart/getCartItems',
      getTotals: 'cart/getTotals'
    }),
    getGrandTotal () {
      var grandTotal = 0
      if (this.getTotals && this.getTotals.length > 0) {
        var totalItem = this.getTotals.filter((totalItemsInside) => {
          if (totalItemsInside && totalItemsInside.code && totalItemsInside.code === 'subtotal') {
            grandTotal = totalItemsInside.value
          }
        })
      }
      return grandTotal
    }
  },
  methods: {
    ...mapActions({
      openMicrocart: 'ui/toggleMicrocart'
    }),
    openMicrocartCustom (event) {
      document.getElementsByClassName('microcart-sidebar')[0].style.display = 'block'
    },
    leaveMicrocartCustom (event) {
      document.getElementsByClassName('microcart-sidebar')[0].style.display = 'none'
    },
    toggleMicrocartCustom () {
      var xCartDiv = document.getElementsByClassName('microcart-sidebar')[0]
      if (xCartDiv.classList.contains('fullCloseCart')) {
        xCartDiv.classList.add('openFullMiniCart')
        xCartDiv.classList.remove('fullCloseCart')
      } else {
        xCartDiv.classList.remove('openFullMiniCart')
        xCartDiv.classList.add('fullCloseCart')
      }
    },
    closeMiniCart (event) {
      if (this.$route.name !== 'checkout') {
        let ignoreClickOnMeElement = document.getElementById('minicarticon');
        let isCartRemoveButton = document.getElementById('minicartnotclose');
        let isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
        let isClickInsideElementRemoveButton;
        if (isCartRemoveButton) {
          isClickInsideElementRemoveButton = (event.target.id === isCartRemoveButton.id);
        }
        if (isClickInsideElement) {
        } else {
          if (isClickInsideElementRemoveButton) {
          } else {
            let getClassForHide = document.getElementsByClassName('microcart-sidebar')[0];
            getClassForHide.style.display = 'none'
            if (getClassForHide.classList.contains('fullCloseCart')) {
              getClassForHide.classList.add('openFullMiniCart')
              getClassForHide.classList.remove('fullCloseCart')
            } else {
              getClassForHide.classList.remove('openFullMiniCart')
              getClassForHide.classList.add('fullCloseCart')
            }
          }
        }
      }
    }
  }
};
</script>
<style scoped>
@font-face {
  font-family: 'Oblik';
  src: url('/assets/fonts/Oblik_Bold.otf');
}
.minicart-count {
  top: 34px;
  left: 14%;
  min-width: 20px;
  min-height: 20px;
  border-radius: 10px;
  background-color: #ed108c;
}
.cart {
  width: auto;
  margin-right: -6px;
  position: relative;
  display: flex;
  min-width: 105px;
  padding-left: 0 !important;
  align-items: center;
}
img {
  height: 29px;
  /* margin-top: 22px; */
}
.price {
  /* margin-top: 35px; */
  margin-top: 17px;
  margin-left: 15px;
  font-size: 18px;
  font-family: 'Oblik';
  color: #29275b;
}
@media (min-width: 768px) and (max-width: 1199px) {
  .cart {
    height: 100%;
    width: 100%;
    max-width: 53px;
    padding: 0px;
    -ms-flex-align: center;
    align-items: center;
    margin: 0px;
  }
  .cart img {
    margin-top: -4px;
  }
  .minicart-count {
    top: 36px;
    left: 24%;
  }
  .price {
    margin-top: 4px;
  }
}
@media (max-width: 991px) {
  .cart {
    height: 100%;
    width: 100%;
    max-width: 53px;
    padding: 0px;
    -ms-flex-align: center;
    align-items: center;
    margin: 0px;
  }
  .cart img {
    margin-top: -11px;
  }
  .price {
    display: none;
  }
  .minicart-count {
    left: 25%;
    top: 35px;
  }
}
@media (min-width: 768px) and (max-width: 1024px) {
  .cart img {
    margin-top: -6px;
  }
}
@media (max-width: 767px) {
  .cart {
    min-width: 0px;
    height: 100%;
    width: 100%;
    /* max-width: 6.5em; */
    padding: 0px;
    align-items: center;
  }
  .cart img {
    /* margin-top: 1px;
    height: 34px; */
    height: 100%;
    width: 6vw;
    padding-top: 0px;
    margin: 0px;
    margin-top: -10px;
    min-height: 83px;
  }
  .minicart-count {
    top: 20px;
    left: 49%;
  }
  .price {
    display: none;
  }
}
@media (min-width: 320px) and (max-width: 480px) {
  .cart {
    max-width: 3em;
    /* transform: scale(0.60); */
  }
}
/* @media (max-width: 399px) {
  .cart img {
    height: 30px;
  }
  .minicart-count {
    top: 13px;
  }
} */
</style>
