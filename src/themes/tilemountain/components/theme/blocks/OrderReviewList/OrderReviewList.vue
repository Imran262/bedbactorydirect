<template>
  <div class="succes-order-review">
    <div class="header">Order Review</div>
    <div class="summary">
    <!-- products  {{products}} -->
      <div class="card" v-for="product in products" :key="product.sku">
        <div class="card-row">
          <div class="card-img-container col-xs-12">
            <div class="imginfo col-xs-6">
              <label class="product-img">Product</label>
              <OrderReviewListImage :sku="product.product_sku ? product.product_sku :product.sku" />
              <p id="product-name">{{ product.name }}</p>
              <!-- <p class="sku">Sku: {{ product.sku }}</p> -->
            </div>
            <div class="card-price col-xs-3">
              <label class="product-img-qty">Qty</label>
              <p id="multiply-qty">x {{ Math.trunc(product.qty) }}</p>
            </div>
            <div class="card-price col-xs-3">
              <label class="product-img-qty">Price</label>
              <p class="final-price">
                £{{ parseFloat(product.price).toFixed(2) }}
              </p>
              <p id="subtotal">{{ (parseFloat(product.price*Math.trunc(product.qty)).toFixed(2)) | price }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="summary-totals">
      <div class="summary-totals-inner">
        <p>Subtotal</p>
        <p>{{ totals.subtotal_incl_tax | price }}</p>
      </div>
      <div class="summary-totals-inner">
        <p>Delivery</p>
        <p>
          {{
            totals.shipping_incl_tax === 0 || totals.shipping_total === 0.0
              ? 'Free Delivery'
              : totals.shipping_incl_tax | price
          }}
        </p>
      </div>
      <div class="summary-totals-inner grand-total-box">
        <p class="total-price-text">Grand Total</p>
        <p id="subtotalprice">{{ totals.base_grand_total | price }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import OrderReviewListImage from './OrderReviewListImage'

export default {
  computed: {},
  components: {
    OrderReviewListImage
  },
  props: ['products', 'totals']
};
</script>
<style scoped>
.header {
  /* margin-top: 25px; */
  background-color: #2a275c;
  color: #ffffff;
  font-weight: 700;
  padding: 15px 25px;
  font-family: Arial;
  font-weight: bold;
  font-size: 18px;
}

.summary {
  background-color: #fff;
  /* margin-bottom: 35px; */
  border: 1px solid #cccccc;
  border-bottom: 0;
}

.card-row {
  display: flex;
  align-items: center;
}

.card-img-container {
  padding: 0.5rem 1rem;
  display: flex;
}

.product-img {
  display: flex;
  justify-content: left;
  color: #494949;
  font-size: 13.74px;
  font-weight: bold;
  padding-bottom: 15px;
  padding-top: 28px;
  font-family: Arial;
}

.imginfo.col-xs-6 {
  padding-left: 1px;
}

.card-img-container.col-xs-12 {
  padding: 8px 9px 27px 17px;
}

.product-img-qty {
  display: flex;
  justify-content: center;
  color: #2a275c;
  font-size: 13.74px;
  font-weight: bold;
  padding-bottom: 15px;
  padding-top: 28px;
  font-family: Arial;
  margin-left: 0;
}

.card-img {
  height: 7rem;
  width: 110px;
}

.card-content {
  padding: 0rem 0rem;
}

p#product-name {
  color: #2a275c;
  font-weight: bold;
  margin-top: 19px;
  font-size: 14px;
  margin-bottom: 0;
  font-family: Arial;
}

.area {
  margin-top: 12px;
  font-size: 12px;
  color: #5c5c5c;
  margin-bottom: 0;
}

.card-content p {
  font-size: 12px;
  margin-top: 30px;
  font-weight: 600;
  color: #54575b;
}

.card-content .sku {
  margin-top: 10px;
  font-weight: 600;
}

.card-price {
  display: flex;
  -ms-flex-pack: justify;
  /* justify-content: unset; */
  flex-direction: column;
  position: relative;
}

#multiply-qty {
  display: flex;
  color: #2a275c;
  align-items: flex-start;
  height: 100%;
  margin: 0;
  -ms-flex-pack: center;
  justify-content: center;
  font-family: Arial;
  font-size: 14px;
}

#multiply-qty1 {
  display: flex;
  font-size: 12px;
  color: #5c5c5c;
  align-items: flex-start;
  height: 18%;
  margin: 0;
  -ms-flex-pack: center;
  justify-content: center;
  font-family: Arial;
}
@media screen and (max-width: 767px) {
  .total {
    padding-right: 16px;
  }
}

.card-price p {
  margin-top: 0px;
}

.card-price .final-price {
  font-size: 14px;
  display: -ms-flexbox;
  display: flex;
  color: #2a275c;
  -ms-flex-align: end;
  align-items: flex-start;
  height: 100%;
  margin: 0;
  margin-bottom: 25px;
  -ms-flex-pack: center;
  justify-content: center;
  font-family: Arial;
}

p#subtotal {
  margin-bottom: 0;
  margin-top: 0;
  font-size: 12px;
  color: #5c5c5c;
  display: flex;
  justify-content: center;
}

.summary-totals {
  background-color: #ffffff;
  padding-bottom: 35px;
}

.summary-totals-inner {
  display: flex;
  justify-content: space-between;
  padding: 0 2.5rem 0 1rem;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 600;
  border: 1px solid #cccccc;
  /* border-left: 0; */
  /* border-right: 0; */
  border-bottom: 0;
}

.summary-totals-inner:last-child {
  border: 1px solid #cccccc;
}

.summary-totals-inner p {
  color: #59595b;
  margin-top: 21px;
  margin-bottom: 25px;
}

/* .summary-totals-inner.grand-total-box p {
    color: #2A275C;
} */
.grand-total-box p {
  font-weight: 700;
  color: #2a275c;
  font-size: 14px;
}

#subtotalprice {
  font-size: 20px;
}

@media (max-width: 767px) {
  .succes-order-review {
    padding: 0px 20px;
  }

  .input-box label {
    font-size: 10px;
  }

  p#product-name {
    font-weight: normal;
    font-size: 12px;
  }

  #multiply-qty {
    font-size: 12px;
  }

  .card-price .final-price {
    font-size: 12px;
  }

  .product-img-qty {
    font-size: 12px;
    padding-top: 7px;
  }

  .product-img {
    font-size: 12px;
    padding-top: 7px;
  }

  .area {
    font-size: 11px;
    margin-bottom: 17px;
  }

  .summary-totals-inner p {
    font-size: 12.05px;
  }

  #subtotalprice {
    font-size: 14px;
  }

  .total-price-text {
    font-size: 14px !important;
  }

  .summary-totals {
    padding-bottom: 25px;
  }

  .summary-totals-inner {
    padding: 0;
  }
  .summary-totals-inner p {
    margin-top: 18px;
    margin-bottom: 18px;
  }

  #multiply-qty1 {
    margin: 0 5px 0 0px;
  }
  .summary-totals-inner p:nth-child(1) {
    width: 50%;
    text-align: left;
    padding-left: 16px;
  }
  .summary-totals-inner p:nth-child(2) {
    width: 50%;
    text-align: right;
    padding-right: 24px;
  }
  .card-img-container {
    padding: 8px 0px 27px 16px !important;
  }
}
@media (device-height: 568px) and (device-width: 320px) and (-webkit-min-device-pixel-ratio: 2) /* and (orientation: todo: you can add orientation or delete this comment) */ {
  .card-img-container {
    padding: 8px 8px 27px 16px !important;
  }
}
@media (min-width: 767px) and (max-width: 991px) {
  .card-img-container {
    padding: 0.5rem 5px;
  }
}
</style>
