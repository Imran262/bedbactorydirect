<template>
  <div class="OutOfStock">
    <div class="modal-content">
      <button type="button" class="close">
        <i class="material-icons" @click="hidemodal">close</i>
      </button>
      <div class="Topdetails">
        <div class="Header">
          <h1>Sorry, this product is out of stock!</h1>
        </div>
      </div>
      <div class="modal-body">
        <div class="modaldetails">
          <h3>Don't panic! You can still place your order...</h3>
          <p>
            We'll notify you as soon as the product is back in stock and ready
            for delivery, it shouldn't be long.
          </p>
          <p class="Question">Do you wish to proceed?</p>
        </div>
        <div class="buttonGroup flex">
          <div class="orderButton">
            <router-link :to="localizedRoute('/cart')" exact>
              <button-full @click="addToCart(product)">
                {{ $t('Place Order') }}
              </button-full>
            </router-link>
          </div>
          <div class="removeButton">
            <button-full @click="hidemodal">
              {{ $t('Remove Item') }}
            </button-full>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ButtonFull from "theme/components/theme/ButtonFull";
export default {
  props: {
    product: {
      required: true,
      type: Object,
    },
  },
  components: { ButtonFull },
  methods: {
    hidemodal () {
      this.$bus.$emit("modal-hide", "outofstock-modal");
    },
    async addToCart (product) {
      this.$bus.$emit("modal-hide", "outofstock-modal");
      this.$emit("Modal");
      try {
        const diffLog = await this.$store.dispatch("cart/addItem", {
          productToAdd: product,
        });
        this.$bus.$emit("cartUpdated", "Product");
        diffLog.clientNotifications.forEach((notificationData) => {
          this.notifyUser(notificationData);
        });
      } catch (message) {
        // this.notifyUser(notifications.createNotification({ type: 'error', message }))
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@font-face {
  font-family: 'Oblik';
  src: url('/assets/fonts/Oblik_Bold.otf');
}
.OutOfStock {
  .close {
    color: #fefefe;
    float: right;
    top: -10px;
    right: -14px;
    position: absolute;
    font-size: 36px;
    height: 44px;
    width: 44px;
    border: none;
    font-weight: bold;
    border-radius: 24px;
    background-color: #ec0e8b !important;
  }
  .Topdetails {
    background: #29275b;
    height: 87px;
    color: #ffff;
    display: flex;
    justify-content: center;
    border-top-left-radius: 15px;
    border: none;
    .Header {
      h1 {
        font-family: 'Oblik';
        font-size: 24px;
        margin-top: 32px;
      }
    }
  }
  .modaldetails {
    padding: 0 51px;
    h3 {
      font-family: 'Oblik';
      font-size: 22px;
      display: flex;
      justify-content: center;
      color: #413f3f;
      margin-top: 32px;
    }
    p {
      font-family: Arial;
      font-size: 17px;
      color: #54575b;
      line-height: 1.5;
    }
    p.Question {
      margin-top: 32px;
    }
  }
  .buttonGroup {
    padding-top: 33px;
    .orderButton {
      padding: 0 23px 0 49px;
      width: 50%;
      button {
        background-color: #29275b;
        font-family: Arial;
        font-weight: bold;
        font-size: 15.96px;
        max-width: 245px;
        min-width: 245px;
        width: 100%;
        height: 100%;
        max-height: 56px;
        border-radius: 3px;
        margin: 0;
      }
    }
    .removeButton {
      padding: 0 37px 0 0;
      width: 50%;
      button {
        background-color: #00aeef;
        font-family: Arial;
        font-weight: bold;
        font-size: 15.96px;
        max-width: 245px;
        min-width: 245px;
        width: 100%;
        height: 100%;
        max-height: 56px;
        border-radius: 3px;
        margin: 0;
      }
    }
  }
  @media (max-width: 767px) {
    .close {
      height: 30px;
      width: 30px;
      right: -4px;
      font-size: 16px;
      i {
        display: flex;
        justify-content: center;
      }
    }
    .Topdetails {
      height: 55px;
      border-top-left-radius: 3px;
      .Header {
        h1 {
          font-size: 14.86px;
          margin-top: 18px;
        }
      }
    }
    .modaldetails {
      padding: 0 21px;
      h3 {
        font-size: 13.86px;
        justify-content: left;
        font-family: Arial;
        margin-top: 26px;
      }
      P {
        font-size: 13.86px;
      }
      p.Question {
        margin-top: 16px;
      }
    }
    .buttonGroup {
      padding-top: 17px;
      .orderButton {
        padding: 0 17px 0 21px;
        button {
          font-size: 12px;
          max-width: 100%;
          min-width: 100%;
          width: 100%;
          height: 100%;
          max-height: 35px;
          padding-top: 10px;
        }
      }
      .removeButton {
        padding: 0 18px 0 0;
        button {
          font-size: 12px;
          max-width: 100%;
          min-width: 100%;
          width: 100%;
          height: 100%;
          max-height: 35px;
          padding-top: 10px;
        }
      }
    }
  }
  @media (max-width: 350px) {
    .modaldetails {
      h3 {
        margin-top: 20px;
      }
    }
    .buttonGroup {
      padding-top: 0px;
    }
  }
}
</style>
