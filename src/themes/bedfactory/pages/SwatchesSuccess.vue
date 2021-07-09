
<template>
  <div class="content">
    <div class="fabrics-detail">
      <div class="container">
        <div class="success-header">
          <div class="col-md-12 col-lg-12 col-xs-12 success-heading">
        <h2 class="order">Your Order Has Been Received.</h2></div></div>
        <p class="purchaser-text">Thanks {{customerName}} for ordering your free swatches.</p>
        <p class="order-info"> We expect your swatches to arrive in the post within 2-3 working days.</p>
        <button
          type="button"
          class="btn-order ui-btn ui-shadow ui-corner-all"
          @click="goToShoppingPage"
        >Continue Shopping</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      customerName: "",
    };
  },
  methods: {
    goToShoppingPage() {
      this.$router.replace("/");
    },
  },
  mounted() {
    this.$bus.$on("get-swatch-customer-fullname", async (data) => {
     // console.log("data ==============>", data);
      if (data) {
        customerName = data;
      }
    });
  },
};
</script>

<style>
.content {
  min-height: 400px;
  background: white;
}
.fabrics-detail {
  width: 100%;
  margin-top: 40px;
  font-family: "Lato", sans-serif;
}
.order {
  font-family: "Lato", sans-serif;
  font-size: 21px;
  line-height: 38px;
}
.fabrics-detail .order h1 {
  margin-bottom: 40px;
}
.fabrics-detail .order p {
  margin: 10px 0px;
}
.fabrics-detail .btn-order {
  /* width: 200px; */
  border: 1px solid #57c9c0;
  font-size: 0.9375rem;
  letter-spacing: 0.05em;
  padding: 0.75em 1em;
  background: #57c9c0;
  color: #fff;
  text-align: center;
  text-transform: uppercase;
  transition: all 250ms ease-in-out;
  line-height: normal;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  font-weight: bold
}
.success-header {
    position: relative;
    padding: 25px 25px;
    background: #071a44;
}
@media (max-width: 767px){
 .success-header{
    padding: 17px 25px;
    margin: 0 -8px 0 -8px;
}
h2.order{
  font-size: 15px !important;
}
.fabrics-detail {
  margin-top: 10px;
}
p.purchaser-text {
    font-size: 17px !important;
    margin-top: 15px !important;
}
p.order-info {
    font-size: 14px !important;
}
}
h2.order {
    font-size: 27px;
    font-weight: 700;
    margin: 0px 0 0 0;
    text-align: center;
    color: #fff;
    font-family: Arial;
}
p.purchaser-text {
    font-size: 27px;
    font-weight: 600;
    color: #071a44;
    font-family: Arial;
    margin-top: 25px;
}
p.order-info {
    font-weight: normal;
    color: #333333;
    font-size: 19px;
    line-height: 1.5;
    margin-top: 10px;
}
</style>