<template>
  <button type="button" data-testid="addToCart" class="financesuccess">
    Apply For Finance
  </button>
</template>
<script>
import axios from 'axios';
export default {
    name : 'FinanceSuccess',
    data(){return{}},
    props:{},
    mounted(){
        this.submitApplication();
    },
    methods:{
        submitApplication(){
            let retailerGuid="e6eb9e9a-9d8a-4919-9ef5-3ed2b14150a8",
            retailerId='25838',
            authenticationKey='U6BPJvIObeSZkb3dW7E6mqHCxzisV5gvuget1yA4a0y2ALOnzM' , 
            productGuid='244b3e7a-0ffb-41f2-88d5-adf78b6a3d9e', 
            productId='27' , 
            salesReference = '012365',
            orderId = Math.floor(Math.random() * 1000000000) + 1000 ;
           

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
 console.log("order id is ",orderId,typeof orderId);

    //   {
    //    "Customer":{
    //       "EmailAddress":"test@v12finance.com",
    //       "Title":"3",
    //       "FirstName":"Bob",
    //       "Addresses":[
    //          {
    //             "MonthsAtAddress":"35",
    //             "FlatNumber":"",
    //             "BuildingName":"",
    //             "BuildingNumber":"92",
    //             "Street":"The Street",
    //             "Locality":"",
    //             "TownOrCity":"Cardiff",
    //             "County":"Cardiff",
    //             "Postcode":"CF24 5PJ"
    //          },
    //          {
    //             "MonthsAtAddress":"150",
    //             "FlatNumber":"",
    //             "BuildingName":"",
    //             "BuildingNumber":"92",
    //             "Street":"The Street",
    //             "Locality":"",
    //             "TownOrCity":"Cardiff",
    //             "County":"Cardiff",
    //             "Postcode":"CF24 5PJ"
    //          }
    //       ],
    //       "HomeTelephone":{
    //          "Code":"02920",
    //          "Number":"123456"
    //       },
    //       "LastName":"Test",
    //       "MobileTelephone":{
    //          "Code":"02920",
    //          "Number":"123456"
    //       }
    //    },
    //    "Order":{
    //       "Lines":[
    //          {
    //             "Qty":"1",
    //             "SKU":"cavali-divan-bed-6ft-2dre",
    //             "Item":"Cavali Divan Bed",
    //             "Price":"2000.00"
    //          }
    //       ],
    //       "CashPrice":"2000",
    //       "Deposit":"300",
    //       "DuplicateSalesReferenceMethod":"ShowError",
    //       "ProductGuid":productGuid,
    //       "ProductId":productId,
    //       "SalesReference":salesReference,
    //       "vLink":"false"
    //    },
    //    "Retailer":{
    //       "AuthenticationKey":authenticationKey,
    //       "RetailerGuid":retailerGuid,
    //       "RetailerId":retailerId
    //    }
    // }
    const URL ='https://apply.v12finance.com/latest/retailerapi/SubmitApplication';
    fetch(URL, {
        method: 'POST',
        body: order,
        headers: {
            'Content-type': 'application/json'
          }
        })
          .then(r => {
            console.log('115599  fetch responseIs', r);
          })
          .catch(error => {
            console.log('115599 fetch Error', error);
          })
    axios.post(URL, (order), {
          headers: {
            'Content-type': 'application/json'
          }
        })
          .then(r => {
            console.log('115599 responseIs', r);
          })
          .catch(error => {
            console.log('115599 Error', error);
          })
     







      axios.post(URL, order,{
          headers: {
            'Content-type': 'application/json'
          }
          }).then(({ data }) => {
          console.log('v12 data us ',data);
        });
    },
    },
    computed:{},

}
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