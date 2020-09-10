<template>
  <button-full
    @click.native="addToCart(product), similarAddtoCart($event,successId)"
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
    successId: {
      type: String,
      required: true
    }
  },
  methods: {
    similarAddtoCart(event, successId) {
      console.log('successId', successId);

      // event.toElement.parentNode.parentNode.parentNode.firstElementChild.classList.add(
      //   'hidden'
      // );
      // event.toElement.parentNode.parentNode.parentNode.lastElementChild.classList.remove(
      //   'hidden'
      // );
      // event.toElement.parentNode.parentNode.parentNode.lastElementChild.classList.add(
      //   'active'
      // );
      event.toElement.parentNode.classList.add('hidden');
      const addedDiv = document.querySelectorAll('.success-similar-addtocart');
      Array.from(addedDiv).forEach((element, index) => {
        if (successId === element.getAttribute('data-success-attribute')) {
          element.classList.remove('hidden');
          element.classList.add('active');
        }
      });
    },
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
  background: none;
  border: 2px solid #00998c;
  border-radius: 5px;
  min-width: auto;
  color: #00998c;
  font-weight: 600;
  width: auto;
  padding: 0 20px;
  line-height: 1.8;
  font-size: 16px;
  margin-top: 5px;
}
.popup-sliders button.carousel-addtocart-btn {
  background: #00998c;
  border: 2px solid #00998c;
  color: #fff;
  float: left;
  border-radius: 5px;
}
</style>
