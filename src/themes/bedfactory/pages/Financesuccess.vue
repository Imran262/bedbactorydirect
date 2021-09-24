<template>
  <button type="button" data-testid="addToCart" class="financesuccess">
    Apply For Finance new with 
  </button>
</template>
<script>
import axios from "axios";
export default {
  name: "FinanceSuccess",
  data() {
    return {};
  },
  props: {},
  mounted() {
    this.submitApplication();
  },
  methods: {
    submitApplication() {
      let retailerGuid = "e6eb9e9a-9d8a-4919-9ef5-3ed2b14150a8",
        retailerId = "25838",
        authenticationKey =
          "U6BPJvIObeSZkb3dW7E6mqHCxzisV5gvuget1yA4a0y2ALOnzM",
        productGuid = "244b3e7a-0ffb-41f2-88d5-adf78b6a3d9e",
        productId = "27",
        salesReference = "012365",
        orderId = Math.floor(Math.random() * 1000000000) + 1000;
      let order = {
    "Order": {
        "CashPrice": "3000",
        "Deposit": "900",
        "DuplicateSalesReferenceMethod": "ShowError",
        "ProductGuid": "244b3e7a-0ffb-41f2-88d5-adf78b6a3d9e",
        "ProductId": "27",
        "SalesReference": orderId
    },
    "Retailer": {
        "AuthenticationKey": "U6BPJvIObeSZkb3dW7E6mqHCxzisV5gvuget1yA4a0y2ALOnzM",
        "RetailerGuid": "e6eb9e9a-9d8a-4919-9ef5-3ed2b14150a8",
        "RetailerId": "25838"
    }
}
      console.log("order id is ", orderId, typeof orderId);
      axios
        .post(URL, order, {
          headers: {
            "Content-type": "application/json"
          }
        })
        .then(r => {
          console.log("115599 responseIs", r);
        })
        .catch(error => {
          console.log("115599 Error", error);
        });
    }
  }
};
</script>
<style scoped>
.financesuccess {
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 14px;
  max-width: 260px;
  min-height: auto;
  position: relative;
  text-align: center;
  width: 100%;
  font-family: Arial;
  font-weight: bold;
  padding: 15px 0px;
  text-transform: uppercase;
  margin-top: 5px;
  float: right;
  background: #071a44;
}
</style>
