<template>
  <button
    type="button"
    class="relative bg-cl-transparent bg-cl-trans brdr-none inline-flex cart"
    data-testid="openMicrocart"
    ref="MicrocartBtn"
    :aria-label="$t('Open microcart')"
    id="minicarticon"
    @click="toggleMicroCartCustom"
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
  data () {
    return {
      onlyCutSizeSample: [],
      onlyFullSizeSample: []
    }
  },
  watch: {
    totalItems: {
      handler (newVal, oldVal) {
        if (oldVal === newVal) {
          this.getFullSampleItems()
          this.getCutSampleItems()
        }
      },
      deep: true
    }
  },
  async mounted () {
    await this.getFullSampleItems()
    await this.getCutSampleItems()
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
    async getFullSampleItems () {
      this.onlyFullSizeSample = await this.totalItems.filter((item, index) => {
        return item.totals && item.totals.options && item.totals.options.length > 0 && item.totals.options[0].value === 'Full Size'
      });
      return this.onlyFullSizeSample
    },
    isTotalsLoaded () {
      let firstItem = this.totalItems?.[0];
      if (firstItem) {
        return firstItem.totals && firstItem.totals.options
      }
      return true
    },
    async getCutSampleItems () {
      this.onlyCutSizeSample = await this.totalItems.filter((item, index) => {
        return item.totals && item.totals.options && item.totals.options.length > 0 && item.totals.options[0].value === 'Cut Size'
      });
      return this.onlyCutSizeSample
    },
    toggleMicroCartCustom () {
      console.log("from PSWP")
      this.getFullSampleItems()
      this.getCutSampleItems()
      if (!this.isTotalsLoaded()) {
        return false;
      }
      if (this.onlyCutSizeSample.length > 0 && this.onlyCutSizeSample.length <= 3 && this.totalItems.length <= 3 && this.onlyCutSizeSample.length === this.totalItems.length) {
        this.$bus.$emit('modal-show', 'modal-quickcheckoutmodel')
      } else if (this.onlyCutSizeSample.length > 3 && this.onlyCutSizeSample.length === this.totalItems.length) {
        this.$router.push(this.localizedRoute('/cart'))
      } else if (this.onlyFullSizeSample.length > 0 && this.onlyFullSizeSample.length === this.totalItems.length) {
        this.$router.push(this.localizedRoute('/checkout'))
      } else if (this.onlyFullSizeSample.length === 0 && this.onlyCutSizeSample.length === 0 && this.totalItems.length > 0) {
        this.$router.push(this.localizedRoute('/cart'))
      } else if (this.totalItems.length > 0) {
        this.$router.push(this.localizedRoute('/cart'))
      }
      if (this.totalItems.length === 0) {
        //this.$router.push(this.localizedRoute('/'))
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
            if (!getClassForHide.classList.contains('fullCloseCart')) {
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
<style scoped lang="scss">
@font-face {
  font-family: 'Oblik';
  src: url('/assets/fonts/Oblik_Bold.otf');
}
.minicart-count {
  top: -4px;
  left: 33px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #EE4C56;
}
.cart {
  width: auto;
  // margin-right: -6px;
  position: relative;
  display: flex;
  min-width: 60px;
  padding-left: 0 !important;
  align-items: center;
}
img {
  height: 30px;
}
.price {
  margin-top: 7px;
  font-size: 12px;
  color: #071A44;
  font-weight: 600;
  font-family: 'ROBOTO';
  display: block !important;
}
@media (max-width: 1199px) {
  .bg-cl-trans{
    width: 7vw;
  }
  .cart {
    // height: 100%;
    // width: 100%;
    // max-width: 53px;
    padding: 0px;
    -ms-flex-align: center;
    align-items: center;
    margin: 0px;
    min-width: auto !important;
  }
  .cart img {
    margin-top: 9px;
    height: 30px;
  }
  .minicart-count {
    top: 28px;
    left: 12px;
    width: 16px;
    height: 16px;
    font-size: 10px;
  }
  .price {
    margin-top:5px;
    font-size: 12px !important;
  }
  
}
@media (max-width: 991px) {
  button{
    width: 13.5vw !important;
    
  }
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
    // margin-top: -2px;
    // margin-top: 18px;
    height: 28px;
  }
  .price {
    display: none;
  }
  .minicart-count {
    left: 25%;
    top: 32px;
    width: 14px;
    height: 14px;
    font-size: 9px;
  }
}
@media (max-width: 767px) {
  .cart {
    min-width: 0px;
    height: 100%;
    width: 100%;
    padding: 0px;
    align-items: center;
  }
  .cart img {
    // height: 100%;
    width: 30px;
    margin: 0px;
    margin-top: 0px;
    min-height: 40px;
  }
  .minicart-count {
    top: 13px;
    left: 20px;
    width: 22px;
    height: 22px;
    font-size: 14px;
  }
  .price {
    display: none;
  }
}
@media (max-width: 480px) {
  .cart {
    max-width: 3em;
    img {
      width: 25px;
    }
  }
  .minicart-count {
    top: 19px;
    left: 17px;
    width: 16px;
    height: 16px;
    font-size: 10px;
  }
 
}
</style>