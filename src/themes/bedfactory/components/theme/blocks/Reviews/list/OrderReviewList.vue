<template>
  <div class="succes-order-review">
    <div class="header">
      Order Review:
    </div>
    <div class="summary">
      <div class="card" v-for="product in products" :key="product.sku">
        <div class="card-row">
          <div class="card-img-container">
            <OrderReviewListImage :sku="product.sku" />
          </div>
          <div class="card-content">
            <p>{{ product.name }}</p>
            <p class="sku">
              Sku: {{ product.sku }}
            </p>
            <div class="card-price">
              <p>{{ product.qty }} qty</p>
              <p class="final-price">
                {{ product.price_incl_tax | price }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="summary-totals">
        <div class="summary-totals-inner">
          <p>Subtotal: </p>
          <p>{{ totals.subtotal_incl_tax | price }}</p>
        </div>
        <div class="summary-totals-inner">
          <p>Delivery: </p>
          <p>{{ isNaN(deliveryDetails) ? deliveryDetails : deliveryDetails | price }}</p>
        </div>
        <div class="summary-totals-inner grand-total-box">
          <p>Grand Total</p>
          <p>{{ grandsTotal | price }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import OrderReviewListImage from './OrderReviewListImage';
export default {
  computed: {
    deliveryDetails () {
      let freeDelivery = 'Free Delivery';
      if(this.addressInformation && this.addressInformation.shipping_carrier_code && this.addressInformation.shipping_carrier_code === "customshipping_collection") {
        return freeDelivery;
      }
      return this.totals.shipping_incl_tax === 0 ? freeDelivery : this.totals.shipping_incl_tax
    },
    grandsTotal(){
      if(this.addressInformation && this.addressInformation.shipping_carrier_code && this.addressInformation.shipping_carrier_code === "customshipping_collection") {
        return this.totals.subtotal_incl_tax; //No Shipping Information needed.
      }
      return this.totals.base_grand_total;
    }
  },
  components: {
    OrderReviewListImage
  },
  props: ['products', 'totals', 'addressInformation']
}
</script>
<style scoped>
  .header {
    margin-top: 25px;
    background-color: #54575B;
    color: white;
    font-weight: 700;
    padding: 15px 25px;
  }
  .summary {
    background-color: #EBEBEB;
  }
  .card-row {
    display: flex;
    align-items: center;
  }
  .card-img-container {
    padding: .5rem 1rem;
  }
  .card-img {
    height: 7rem;
    width: 110px;
  }
  .card-content {
    padding: 0rem 1rem;
    width: 100%;
  }
  .card-content p{
    font-size: 12px;
    font-family: 'Poppins', sans-serif;
    margin-top: 30px;
    font-weight: 600;
  }
  .card-content .sku{
    margin-top: 10px;
    font-weight: 600;
  }

  .card-price {
    display: flex;
    justify-content: space-between;
  }
  .card-price p{
    margin-top: 0px;
    font-family: 'Poppins', sans-serif;
  }
  .card-price .final-price{
    font-weight: 700;
    font-size: 14px;
  }

  .summary-totals {
    background-color: #BFE9E5;
    font-family: 'Poppins', sans-serif;
  }
  .summary-totals-inner {
    display: flex;
    justify-content: space-between;
    padding: 0 2rem 0 1rem;
    font-family: 'Poppins', sans-serif;
  }
  .grand-total-box p{
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
  }
  @media(max-width: 767px){
    .succes-order-review{
      padding: 0px 20px;
    }
    .input-box label {
      font-size: 10px !important;
    }
  }
  @media(min-width: 767px) and (max-width: 991px){
    .card-img-container{
      padding: .5rem 5px;
    }
  }
</style>
