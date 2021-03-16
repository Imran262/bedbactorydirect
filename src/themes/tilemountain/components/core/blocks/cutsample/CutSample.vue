<template>
  <div>
    <div id="sample-order-modal" class="modal-content">
      <div
        class="cut_samples_header cut_samples_head_open"
        @click="showSamplesModal()"
        v-if="showcut"
      >
        <div class="cut_samples_header_squar_img">
          <img src="/assets/cut-sample.png" alt="cut sample" />
        </div>
        <h2>
          Totally Free Cut Samples!
          <!-- <span>(ADD UP TO 3 FREE CUT SAMPLES TO COMPARE AT HOME)</span> -->
        </h2>
        <span class="sample_book open_sample_book">
          <span class="sample_book_text">Open Your Sample Book</span>
          <i class="fa fa-angle-up" aria-hidden="true"></i>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { hasOnlySampleTypeInCart } from "src/modules/cut-full-sample/helpers/index"

export default {
  name: "CutSample",
  data () {
    return {
      showCheckoutModel: false,
      showcut: false,
    }
  },
  beforeMount () {
    this.$bus.$on("cartUpdated", () => {
      setTimeout(function () {
        if (this.getTotals) {
          this.getTotals.forEach((segment) => {
            if (segment.code === "grand_total") {
              if (segment.value > 0) {
                this.showCheckoutModel = false
                this.showcut = false
              } else {
                this.showCheckoutModel = false
                this.showcut = true
              }
            }
          })
        }
      }, 3000)
    })
    this.$bus.$on("dontShowValue", () => {
      this.showCheckoutModel = false
      this.showcut = true
    })
  },
  computed: {
    ...mapGetters({
      productsInCart: "cart/getCartItems",
      getTotals: "cart/getTotals",
      getCartToken: "cart/getCartToken",
    }),
    hasFreeSampleWithZeroSubTotal () {
      if (
        hasOnlySampleTypeInCart &&
        typeof hasOnlySampleTypeInCart === "function"
      ) {
        let hasFreeSamplesOnlyInCart = hasOnlySampleTypeInCart({
          cartItems: this.productsInCart,
          sampleType: "Cut Size",
        })

        if (!hasFreeSamplesOnlyInCart) {
          return false
        }
        return this.hasEmptySubTotal && hasFreeSamplesOnlyInCart
      }
      return false
    },
    hasEmptySubTotal () {
      return (
        this.getTotals.filter((item, index) => {
          return (
            (item.code === "subtotal" || item.code === "subtotal_incl_tax") &&
            item.value === 0
          )
        }).length > 0
      )
    }
  },
  mounted () {
    if (this.hasEmptySubTotal) {
      this.showCheckoutModel = false
      this.showcut = true
    } else {
      this.showCheckoutModel = false
      this.showcut = false
    }

    this.$bus.$on("modal-show", (identifier) => {
      if (identifier === "modal-quickcheckoutmodel") {
        this.showcut = false
      }
    })

    this.$bus.$on("modal-hide", (identifier) => {
      if (identifier === "modal-quickcheckoutmodel") {
        // Modal is hidden
        this.showCheckoutModel = false
        this.showcut = true
      }
    })
  },
  watch: {
    hasFreeSampleWithZeroSubTotal (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal === true) {
          this.showCheckoutModel = false
          this.showcut = false
        } else {
          // this.showCheckoutModel = false
          this.showcut = true
        }
      }
    },
    hasEmptySubTotal (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.showcut = newVal === true
      }
    },
  },
  methods: {
    closeModal () {
      this.showCheckoutModel = false
      this.showcut = true
    },
    showSamplesModal () {
      if (this.showCheckoutModel) {
        document.getElementById("sample-order-modal").style.display = "none"
      } else {
        document.getElementById("sample-order-modal").style.display = "block"
      }
      this.$bus.$emit("modal-show", "modal-quickcheckoutmodel")
      this.showCheckoutModel = true
      this.showcut = false
    },
  },
};
</script>
<style lang="scss" scoped>
.modal-content {
  background-clip: padding-box;
  background-color: #fff;
  -webkit-box-shadow: 0px 0px 7px 0px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px 0px 7px 0px rgba(50, 50, 50, 0.75);
  box-shadow: 0px 0px 7px 0px rgba(50, 50, 50, 0.75);
  margin: 0 auto;
  max-width: 1240px;
  outline: 0 none;
  width: 100%;
  position: fixed;
  left: 0;
  /* cursor: pointer; */
  right: 0;
  bottom: -4px;
  z-index: 9999;
}
#sample-order-modal {
  background: transparent !important;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  z-index: 1;
}

.cut_samples_header {
  font-family: oblik;
  background: #e8ebeb !important;
  height: 40px;
  width: 96%;
  padding: 11px 2% 11px 2% !important;
  cursor: pointer;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
}

.cut_samples_header_squar_img {
  float: left;
  margin-left: 130px;
}
.cut_samples_header_squar_img img {
  // height: 100%;
  width: 100%;
}

.cut_samples_header h2 {
  font-family: oblik;
  float: left;
  color: #2a285a;
  text-transform: capitalize;
  line-height: 27px;
  font-weight: 700;
  font-size: 24px;
  /* background: url(cut_samples_book.jpg) no-repeat; */
  /* padding-left: 35px; */
  background-size: 30px;
  margin: 7px 0 0px 22px;
}

.sample_book {
  font-family: arial;
  float: right;
  color: #2a285a;
  text-transform: capitalize;
  line-height: 27px;
  font-weight: 300;
  cursor: pointer;
  font-size: 20px;
  margin-top: 6px;
}

.sample_book i.fa.fa-angle-up {
  font-size: 36px;
  margin-left: 5px;
  float: right;
  color: #29275b;
  position: relative;
  top: -7px;
  font-weight: bold;
}

.modal-header {
  min-height: 16.43px;
  padding: 4px;
}

.cut_samples_header h2 span {
  font-family: arial;
  font-size: 12px;
}

.cut_samples_header {
  background: #f1f1f1;
  height: 40px;
  width: 96%;
  padding: 1% 2% 0 2%;
}

@media only screen and (max-width: 767px) and (min-width: 320px) {
  .modal-content {
    /* width: 90%; */
    overflow: visible;
    -webkit-overflow-scrolling: touch;
  }
  .cut_samples_header {
    height: 35px;
    width: 96%;
    /* padding: 2% 2% 0 2%; */
  }
  .cut_samples_header h2 span {
    display: none;
  }
  .sample_book .sample_book_text {
    display: none;
  }
  #sample-order-modal {
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    width: 95%;
  }
  .cut_samples_header {
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }
  .cut_samples_header h2 {
    font-size: 13px;
  }
  .cut_samples_header_squar_img {
    margin-left: 20px;
  }
  .sample_book i.fa.fa-angle-up {
    right: 10px;
  }
  .cut_samples_header_squar_img img {
    // height: 30px;
    width: 30px;
    margin-top: 5px;
  }
}

@media only screen and (max-width: 1023px) and (min-width: 768px) {
  .modal-content {
    /* width: 90%; */
    overflow: auto;
  }
}

@media only screen and (max-width: 900px) and (min-width: 320px) {
  .cut_samples_header h2 span {
    display: none;
  }
}
</style>
