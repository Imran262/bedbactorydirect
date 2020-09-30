<template>
  <button-full
    @click.native="addToCart(product), showAdding(prodId)"
    :disabled="isProductDisabled"
    data-testid="addToCart"
    class="carousel-addtocart-btn"
  >{{ $t('Add to basket') }}</button-full>
</template>

<script>
import { formatProductMessages } from '@vue-storefront/core/filters/product-messages';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import focusClean from 'theme/components/theme/directives/focusClean';
import ButtonFull from 'theme/components/theme/ButtonFull.vue';
import { mapGetters } from 'vuex';

export default {
  directives: { focusClean },
  components: { ButtonFull },
  props: {
    product: {
      required: true,
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    },
    prodId: {
      type: String,
      default: ''
    }
  },
  methods: {
    onAfterRemovedVariant() {
      this.$forceUpdate();
    },
    async addToCart(product) {
      try {
        const diffLog = await this.$store.dispatch('cart/addItem', {
          productToAdd: product
        });
        diffLog.clientNotifications.forEach(notificationData => {
          // this.notifyUser(notificationData);
        });
      } catch (message) {
        this.notifyUser(
          notifications.createNotification({ type: 'error', message })
        );
      }
    },
    notifyUser(notificationData) {
      this.$store.dispatch('notification/spawnNotification', notificationData, {
        root: true
      });
    },
    showAdding(event) {
      // console.log('eventevent', event);
      const addedDiv = document.querySelectorAll('.successfull-added');
      Array.from(addedDiv).forEach((element, index) => {
        if (event === element.getAttribute('data-success-attr')) {
          // console.log('FAWADASLAM_FAWADASLAM');
          element.classList.add('showed');
          var mainProdElementZero = document.getElementsByClassName(event)[0];
          mainProdElementZero.classList.add('podElementHide');
          var mainProdElementOne = document.getElementsByClassName(event)[1];
          mainProdElementOne.classList.add('podElementHide');
        }
      });
    }
  },
  computed: {
    ...mapGetters({
      isAddingToCart: 'cart/getIsAdding'
    }),
    isProductDisabled() {
      return (
        this.disabled ||
        formatProductMessages(this.product.errors) !== '' ||
        this.isAddingToCart
      );
    }
  },
  beforeMount() {
    this.$bus.$on('product-after-removevariant', this.onAfterRemovedVariant);
  },
  beforeDestroy() {
    this.$bus.$off('product-after-removevariant');
  }
};
</script>
<style scoped>
button.carousel-addtocart-btn {
  border: 2px solid #00998c;
  border-radius: 5px;
  min-width: auto;
  color: #fff;
  font-weight: 600;
  width: auto;
  padding: 0 20px;
  line-height: 1.8;
  font-size: 12px;
  margin-top: 5px;
  text-transform: uppercase;
  background: #00998c;
  font-family: 'Poppins', sans-serif;
}
button.carousel-addtocart-btn:hover {
  background: #000;
  border: 2px solid #000;
}
</style>
