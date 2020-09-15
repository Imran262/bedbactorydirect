<template>
  <div class="content">
    <div class="fabrics-detail">
      <div class="container">
        <h2 class="order">Your Order Has Been Received.</h2>
        <p>Thanks {{customerName}} for ordering your free swatches. We expect your swatches to arrive in the post within 2-3 working days.</p>
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
    this.$bus.on("get-swatch-customer-fullname", async (data) => {
      console.log("data ==============>", data);
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
  width: 200px;
  border: 1px solid #fbbe63;
  font-size: 0.9375rem;
  letter-spacing: 0.05em;
  padding: 0.75em 1em;
  background: #fbbe63;
  color: #fff;
  line-height: normal;
  box-shadow: none;
  text-align: center;
  text-transform: uppercase;
  transition: all 250ms ease-in-out;
  line-height: normal;
  white-space: normal;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  margin-top: 20px;
}
</style>