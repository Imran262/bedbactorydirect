<template>
  <div class="V-12-retail-Finance">
    <div v-if="ViewCalculatorCheck">
      <div class="modal-backdrop"  @click="HandleOnCloseV12"/>
    <V12calculator   
      @closeV12Calculator="HandleOnCloseV12"
      :calculatorData="v12Data"
      :minimumInstallment="minimumMonthlyPayment"
      :currentPrice="currentPrice"
    />
    </div>
    <div class="retail-finance">
      <div class="v-12-head">
        <div class="v-12-logo">
          <img src="/assets/Vector.svg" alt="v-12-logo" />
        </div>
        <div
          class="v-12-more-info"
          v-if="showCalculator"
          @click="HandleOnClickV12"
        >
          <p>More Info</p>
        </div>
      </div>
      <div class="v-12-detail">
        <p v-if="showCalculator">
          From £{{ minimumMonthlyPayment }} per month, subject to details,
          conditions apply
        </p>
        <p v-else>
          {{ monthly_text }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import V12calculator from "src/themes/bedfactory/components/core/V12Calculator/CalculatorV12.vue";
import axios from "axios";
export default {
  name : 'Retailfinancev12',
  components: {
    V12calculator,
  },
  data() {
    return {
      v12Data:{},
      minimumMonthlyPayment : 0,
      minProductPrice : 335,
      monthly_text : ' ',
      showCalculator : false,
      updatedPrice:0,
      ViewCalculatorCheck: false,
    }
  },
  props:{
    currentPrice:{
      type : [String,Number],
      required: true
    }
  },
  methods:{
    retailcalculator (){
            let price = this.currentPrice;
      // let price = data.special ?(data.original - data.special === 0) ? data.original : data.special : data.original
      console.log("778855 current price is ",price);
      this.updatedPrice = price
      const URL = "https://angus.finance-calculator.co.uk/api/public/finance-options?loan_amount="+price+"&api_key=79166ebc201070380f581a4a2dcc004a";
      axios.get(URL).then((res) => {
        const response = res;
        console.log("778855 response for v12 is ",res);
        if (response.status !== 200) {
          throw (
            ("Error Occured while requesting for reviews:",response.data[0].message));
            } else {
              let responseV12 = response.data;
              this.v12Data = responseV12;
              console.log("778855 Successfully called V12 API recieved data is new ",responseV12, responseV12.finance_available);
              this.showCalculator = responseV12.finance_available;
              this.minProductPrice = responseV12.min_max.min_order;
              this.monthly_text = responseV12.monthly_text
              if(this.showCalculator){
                let selectedOption =responseV12.finance_options[responseV12.finance_options.length-1];
                let initialdeposit =  selectedOption.deposit_options[0].value * price;
                let noOfMonths = selectedOption.imega_finance_rate.term;
                this.minimumMonthlyPayment = (price - initialdeposit)/noOfMonths;
                this.minimumMonthlyPayment = parseFloat(this.minimumMonthlyPayment).toFixed(
                            2
                          )
                console.log("778855 selcted option",selectedOption , initialdeposit ,noOfMonths, this.minimumMonthlyPayment);
                
                }
      }
      })
      .catch((err) => {
        throw ("778855 Error occured while requesting for v12 api:", err);
        });
    },
    HandleOnClickV12 () {
      this.ViewCalculatorCheck = true
       let x = document.getElementsByTagName('BODY')[ 0 ]
      x.style.overflowY = 'hidden'
    },
    HandleOnCloseV12 () {
      this.ViewCalculatorCheck = false
      let x = document.getElementsByTagName('BODY')[ 0 ]
      x.style.overflowY = 'scroll'
    },
  },
   async mounted(){
     this.retailcalculator();
   },
  
}
  </script>

<style scoped>
.V-12-retail-Finance {
  box-shadow: 0px 0px 8px rgb(0 0 0 / 25%);
  width: 554px;
  height: 115px;
  margin-left: 40px;
  width: 89%;
  margin-bottom: 20px;
}
.retail-finance {
  width: 100%;
}
.v-12-head {
  display: flex;
  justify-content: space-between;
  padding: 13px;
  align-items: center;
}
.v-12-more-info {
  width: 88px;
  height: 23px;
  background: #071a44;
  border-radius: 30px;
  color: #fff;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: arial;
  cursor: pointer;
}
.v-12-detail {
  background: #d6d6d6;
  margin: 13px;
  height: 35px;
  bottom: 12px;
  position: relative;
  display: flex;
  align-items: center;
  font-size: 11px;
  line-height: 12.65px;
  font-family: arial;
  padding-left: 12px;
}
@media (max-width: 375px) {
  .V-12-retail-Finance {
    width: 86% !important;
  }
  .v-12-detail {
    font-size: 9px;
    padding-left: 5px;
  }
}
.modal-backdrop {
  position: fixed; /* Stay in place */
  z-index: 999; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}
</style>