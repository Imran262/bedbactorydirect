<template>
  <div>
    <header class="thank-you-title bg-cl-secondary pl20">
      <div class="container">
        <breadcrumbs
          :with-homepage="true"
          :routes="[]"
          :active-route="this.$t('Order confirmation')"
        />
        <h2 class="category-title hidden">
          {{ $t('Order confirmation') }}
        </h2>
      </div>
    </header>
    <div class="container">
      <div v-if="OnlineOnly" class="col-md-7 col-sm-12 success-header">
        <div class="non-selected-tick" />
        <div class="success-heading">
          <p class="order-received">
            Your Order has been failed. Please Try again.
          </p>
          <!-- <p class="order-received-text">
            Keep an eye on your inbox, we'll send you email shortly
          </p> -->
        </div>
      </div>
      <div v-if="OnlineOnly" class="col-md-7 col-sm-12 seccess-body">
        For More Information, 
        <router-link :to="localizedRoute('/contact')">
          <a >
            Please contact us
          </a>
        </router-link>
        <!-- <span <span v-if="purchaserName" class="purchaser-text">
          <label
            class="purchaser-name"
          >{{ purchaserName }}</label>, thank you for your purchase!
        </span>
        <span v-if="backendOrderId">
          Your personal order is.
          <label class="order-num">{{ backendOrderId }}</label>
        </span>
        <span>You will receive an order confirmation email with full details of your order</span> -->
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from 'theme/components/core/Breadcrumbs';
import VueOfflineMixin from 'vue-offline/mixin';
import Composite from '@vue-storefront/core/mixins/composite';

export default {
  name: 'Fail',
  mixins: [Composite, VueOfflineMixin],
  data() {
    return {
      lastOrderItem: null
    }
  },
  computed: {
    backendOrderId() {
      if (this.lastOrderItem) {
        return this.lastOrderItem.confirmation.backendOrderId
      }
      return undefined
    },
    purchaserName() {
      if (this.lastOrderItem) {
        return this.lastOrderItem.order.addressInformation.billingAddress.firstname
      }
      return undefined
    }
  },
  mounted() {
    if (typeof window !== 'undefined') {
      try {
        const lastOrderItem = localStorage.getItem('lastOrderItem')
        this.lastOrderItem = JSON.parse(lastOrderItem)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
.thank-you-title .category-title {
  margin-bottom: 0;
}
.success-header {
  position: relative;
  margin-top: 25px;
  padding: 25px 25px;
  background:#ca3625;
}
.success-header .non-selected-tick {
  left: 20px;
  top: 55px;
  width: 40px;
  height: 30px;
}
.success-heading {
  color: #fff;
  margin-left: 55px;
  font-family: 'Poppins', sans-serif;
}

p.order-received {
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0;
}

p.order-received-text {
  font-weight: 600;
  font-size: 18px;
}
.seccess-body {
  padding: 25px 0px;
  font-size: 17px;
  font-family: 'Poppins', sans-serif;
  color: #54575b;
}

.seccess-body span {
  display: block;
  padding-bottom: 15px;
}

span.purchaser-text {
  font-size: 28px;
  font-weight: 600;
  color: #54575b;
  padding-bottom: 15px;
}

label.order-num {
  color: #40439d;
  font-weight: 700;
}

@media(max-width: 423px){
  p.order-received {
      font-size: 12px !important;
    }
    p.order-received-text{
      font-size: 12px !important;
    }
  }

</style>
