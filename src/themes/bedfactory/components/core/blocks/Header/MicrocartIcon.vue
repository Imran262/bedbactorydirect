<template>
  <div>
    <button
      type="button"
      class="relative bg-cl-transparent bg-cl-trans brdr-none cart"
      data-testid="openMicrocart"
      ref="MicrocartBtn"
      :aria-label="$t('Open microcart')"
      id="minicarticon"
      @click="toggleMicroCartCustom"
    >
      <div class="iconContainer">
        <img src="/assets/icons/basket.svg" alt="basket" />
        <span
        class="
          minicart-count
          absolute
          flex
          center-xs
          middle-xs
          border-box
          py0
          px2
          h6
          lh16
          weight-700
          cl-white
        "
        v-cloak
        v-show="totalQuantity"
        data-testid="minicartCount"
        >{{ totalQuantity }}
      </span>
      </div>
      

      <span
        v-if="totalQuantity > 0"
        class="price price-bfd"
        id="microcartIconPrice"
        v-cloak
        v-show="totalQuantity"
        >{{ getGrandTotal | price }}</span
      >
      <span
        v-else
        class="price price-bfd"
        id="microcartIconPrice"
        v-cloak
        v-show="totalQuantity"
        >Basket</span
      >
    </button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import MicrocartIcon from '@vue-storefront/core/compatibility/components/blocks/Header/MicrocartIcon';
import { syncCartWhenLocalStorageChange } from '@vue-storefront/core/modules/cart/helpers';
export default {
  data () {
    return {
      onlyCutSizeSample: [],
      onlyFullSizeSample: []
    };
  },
  watch: {
    totalItems: {
      handler (newVal, oldVal) {
        if (oldVal === newVal) {
          this.getFullSampleItems();
          this.getCutSampleItems();
        }
      },
      deep: true
    }
  },
  async mounted () {
    await this.getFullSampleItems();
    await this.getCutSampleItems();
    syncCartWhenLocalStorageChange.addEventListener();
    this.$once('hook:beforeDestroy', () => {
      syncCartWhenLocalStorageChange.removeEventListener();
    });
    document.body.addEventListener('click', event => {
      this.closeMiniCart(event);
    });
  },
  computed: {
    ...mapGetters({
      totalQuantity: 'cart/getItemsTotalQuantity',
      totalItems: 'cart/getCartItems',
      getTotals: 'cart/getTotals'
    }),
    getGrandTotal () {
      var grandTotal = 0;
      if (this.getTotals && this.getTotals.length > 0) {
        var totalItem = this.getTotals.filter(totalItemsInside => {
          if (
            totalItemsInside &&
            totalItemsInside.code &&
            totalItemsInside.code === 'subtotal'
          ) {
            grandTotal = totalItemsInside.value;
          }
        });
      }
      return grandTotal;
    }
  },
  methods: {
    ...mapActions({
      openMicrocart: 'ui/toggleMicrocart'
    }),
    openMicrocartCustom (event) {
      document.getElementsByClassName('microcart-sidebar')[0].style.display =
        'block';
    },
    leaveMicrocartCustom (event) {
      document.getElementsByClassName('microcart-sidebar')[0].style.display =
        'none';
    },
    async getFullSampleItems () {
      this.onlyFullSizeSample = await this.totalItems.filter((item, index) => {
        return (
          item.totals &&
          item.totals.options &&
          item.totals.options.length > 0 &&
          item.totals.options[0].value === 'Full Size'
        );
      });
      return this.onlyFullSizeSample;
    },
    isTotalsLoaded () {
      let firstItem = this.totalItems?.[0];
      if (firstItem) {
        return firstItem.totals && firstItem.totals.options;
      }
      return true;
    },
    async getCutSampleItems () {
      this.onlyCutSizeSample = await this.totalItems.filter((item, index) => {
        return (
          item.totals &&
          item.totals.options &&
          item.totals.options.length > 0 &&
          item.totals.options[0].value === 'Cut Size'
        );
      });
      return this.onlyCutSizeSample;
    },
    toggleMicroCartCustom () {
      console.log('from PSWP');
      this.getFullSampleItems();
      this.getCutSampleItems();
      if (!this.isTotalsLoaded()) {
        return false;
      }
      if (
        this.onlyCutSizeSample.length > 0 &&
        this.onlyCutSizeSample.length <= 3 &&
        this.totalItems.length <= 3 &&
        this.onlyCutSizeSample.length === this.totalItems.length
      ) {
        this.$bus.$emit('modal-show', 'modal-quickcheckoutmodel');
      } else if (
        this.onlyCutSizeSample.length > 3 &&
        this.onlyCutSizeSample.length === this.totalItems.length
      ) {
        this.$router.push(this.localizedRoute('/cart'));
      } else if (
        this.onlyFullSizeSample.length > 0 &&
        this.onlyFullSizeSample.length === this.totalItems.length
      ) {
        this.$router.push(this.localizedRoute('/checkout'));
      } else if (
        this.onlyFullSizeSample.length === 0 &&
        this.onlyCutSizeSample.length === 0 &&
        this.totalItems.length > 0
      ) {
        this.$router.push(this.localizedRoute('/cart'));
      } else if (this.totalItems.length > 0) {
        this.$router.push(this.localizedRoute('/cart'));
      }
      if (this.totalItems.length === 0) {
        // this.$router.push(this.localizedRoute('/'))
        // var xCartDiv = document.getElementsByClassName('microcart-sidebar')[0]
        // console.log('xCartDiv',xCartDiv);
        // if (xCartDiv.classList.contains('fullCloseCart')) {
        //   xCartDiv.classList.add('openFullMiniCart')
        //   xCartDiv.style.display = 'block'
        //   xCartDiv.classList.remove('fullCloseCart')
        // } else {
        //   xCartDiv.classList.remove('openFullMiniCart')
        //   xCartDiv.classList.add('fullCloseCart')
        //   xCartDiv.style.display = 'none'
        // }
      }
    },
    closeMiniCart (event) {
      if (this.$route.name !== 'checkout') {
        let ignoreClickOnMeElement = document.getElementById('minicarticon');
        let isCartRemoveButton = document.getElementById('minicartnotclose');
        let isClickInsideElement = ignoreClickOnMeElement.contains(
          event.target
        );
        let isClickInsideElementRemoveButton;
        if (isCartRemoveButton) {
          isClickInsideElementRemoveButton =
            event.target.id === isCartRemoveButton.id;
        }
        if (isClickInsideElement) {
        } else {
          if (isClickInsideElementRemoveButton) {
          } else {
            let getClassForHide = document.getElementsByClassName(
              'microcart-sidebar'
            )[0];
            getClassForHide.style.display = 'none';
            if (!getClassForHide.classList.contains('fullCloseCart')) {
              getClassForHide.classList.remove('openFullMiniCart');
              getClassForHide.classList.add('fullCloseCart');
            }
          }
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
@font-face {
  font-family: "Oblik";
  src: url("/assets/fonts/Oblik_Bold.otf");
}
.iconContainer {
  width: 27px;
  position: relative;
}
.iconContainer img {
  max-width: 100%;
}
.minicart-count {
  top: -1px;
  left: 19px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ee4c56;
  font-size: 11px;
}
.cart {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0;
}

.price {
  margin-top: 2px;
  font-size: 9px;
  color: #2a275b;
  font-weight: 600;
  font-family: "ROBOTO";
  display: block !important;
}

@media (max-width: 767px) {
  .iconContainer {
    width: 24.7px;
  }
  .cart {
    padding: 0;
  }
  .price  {
    font-size: 9px;
  }
  .minicart-count {
    left: 17px;
  }
}
@media (max-width: 991px) {
  .price  {
      margin-top: 1px;
  }
  
}
@media (min-width: 993px) {
  .price  {
      font-size: 10px;
  }
}
@media (max-width: 991px) and (min-width: 768px) {
   .minicart-count {
    left: 19px;
  }
}
</style>