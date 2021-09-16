<template>
  <div class="check-v12">
    <i
      data-v-0b1c0f15=""
      class="material-icons close fab-cross cl-white cl-merge"
      @click="$emit('closeV12Calculator')"
      >close</i
    >
    <div id="v12-modal-head">
      <img :src="calculatorData.widget_options.header_img" />
      <p>
        From £{{ minimumInstallment }} per month, subject to details, conditions
        apply
      </p>
    </div>
    <div class="v12-modal-body">
      <p>
        {{ calculatorData.widget_options.top_text }}
      </p>
    <table id="calc-table">
      <tbody>
        <tr>
          <th>Finance Option</th>
          <td>
            
            <select  id="options-select" @change="setCurrentFinanceOption($event)">
              Selected
              <template
                v-for="(option, count) in calculatorData.finance_options"
              >
                <option
                  :key="count"
                  :value="option.order_id"
                  :data-fcode="option.finance_code"
                >
                  {{ option.name }}
                </option>
              </template>
            </select>
            
          </td>
        </tr>
        <tr>
          <th>Deposit Amount</th>
          <td id="imega-deposit-amount-td">
            <select id="imega-deposit-amount-select"  @change="setCurrentDepositOption($event)">
              <template v-for="(option, count) in depositOptions">
                <option
                  v-if="count === 0"
                  :key="count"
                  :value="option.value"
                  selected="selected"
                >
                  {{ option.name }}
                </option>
                <option v-else :key="count" :value="option.value">
                  {{ option.name }}
                </option>
              </template>
            </select>
          </td>
        </tr>
      </tbody>
      <tbody id="calc-table-data">
        <tr>
          <th>Monthly Payments</th>
          <td data-imega-calculator-field="installment-amount">£{{payment.monthlyPayment}}</td>
        </tr>
        <tr>
          <th>Purchase Price</th>
          <td data-imega-calculator-field="purchase-price">£{{payment.purchasePrice}}</td>
        </tr>
        <tr>
          <th>Deposit To Pay</th>
          <td data-imega-calculator-field="deposit-amount">£{{payment.initialDeposit}}</td>
        </tr>
        <tr>
          <th>Amount Of Credit</th>
          <td data-imega-calculator-field="credit-amount">£{{payment.credit}}</td>
        </tr>
        <tr>
          <th>Amount Of Interest</th>
          <td data-imega-calculator-field="interest-amount">£{{payment.interest}}</td>
        </tr>
        <tr>
          <th>Number Of Monthly Payments</th>
          <td data-imega-calculator-field="term">{{payment.noOfPayments}}</td>
        </tr>
        <tr>
          <th>Total Amount Payable</th>
          <td data-imega-calculator-field="total-payable">£{{payment.totalAmount}}</td>
        </tr>
        <tr>
          <th>Rate Of Interest (Fixed)</th>
          <td data-imega-calculator-field="interest-rate">{{payment.rateOfInterestFixed}}</td>
        </tr>
        <tr>
          <th>APR Representative</th>
          <td data-imega-calculator-field="apr">{{payment.APR}}</td>
        </tr>
      </tbody>
    </table>
    </div>
    <div class="modal-retail-finance">
      {{ calculatorData.widget_options.footer_text }}
    </div>
  </div>
</template>
<script>
export default {
  name : 'calculatorV12',
  data(){
    return {
      depositOptions : this.calculatorData.finance_options[0].deposit_options,
      despositOptionSelected : this.calculatorData.finance_options[0].deposit_options[0].value,
      financeOptionSelected:this.calculatorData.finance_options[0].order_id,
      payment:{
        monthlyPayment:0,
        purchasePrice:0,
        initialDeposit:0,
        credit:0,
        interest:0,
        noOfPayments:0,
        totalAmount:0,
        rateOfInterestFixed:'0.00%',
        APR:'0%'
      }
    }
  },
  props: {
    calculatorData: {
      type: Object,
      default: true
    },
    minimumInstallment:{
      type: [Number,String],
      required : true
    },
    currentPrice:{
      type : [String,Number],
      required: true
    }
  },
  mounted(){
    this.setCurrentData();
  },
  methods:{
    setCurrentFinanceOption(option){
      console.log("778855 selected Finance option is ",option);
      this.financeOptionSelected = option.target.value;
      this.setCurrentData();
    },
    setCurrentDepositOption(option){
      console.log("778855 selected Deposit option is ",option);
      this.despositOptionSelected = option.target.value;
      this.setCurrentData();
    },
    setCurrentData(){
      console.log("778855 deposit option is ",this.despositOptionSelected,"Finance option selected",this.financeOptionSelected);
      console.log("778855 finance option found",this.calculatorData.finance_options.length);
      this.calculatorData.finance_options.forEach( (financeOption,financeIndex) => {
        console.log("778855 About to match",parseInt (financeOption.order_id) === parseInt(this.financeOptionSelected) ,financeOption.order_id , this.financeOptionSelected);
        if(parseInt (financeOption.order_id) === parseInt(this.financeOptionSelected)){
          console.log("778855 finance option found",financeOption);
          parseFloat(this.originalPrice).toFixed(2);
          let totalPrice = parseFloat(this.currentPrice).toFixed(2);
          let initialDeposit = parseFloat(totalPrice - (totalPrice * this.despositOptionSelected)).toFixed(2);
          let creditAmount = parseFloat(totalPrice- initialDeposit).toFixed(2);
          let noOfPayments = parseFloat(financeOption.imega_finance_rate.term).toFixed(2);
          let monthlyPayment = parseFloat(creditAmount/noOfPayments).toFixed(2);
          this.payment = {
            monthlyPayment: monthlyPayment,
            purchasePrice: totalPrice,
            initialDeposit: initialDeposit,
            credit: creditAmount,
            interest: 0.00,
            noOfPayments: noOfPayments,
            totalAmount: totalPrice,
            rateOfInterestFixed:'0.00%',
            APR:'0%'
            }
        }
      });
    }
  }
}
</script>>
<style lang="scss" scoped>
.check-v12{
    width: 470px;
    background: #fff;
    position: fixed;
    max-width: 95%;
    margin: 5% auto;
    left: 0;
    right: 0;
    top: 0;
    max-height: 80vh;
    z-index: 2147483647;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
    border-radius: 15px;
    padding: 22px 15px;
    max-width: 95%;
    max-height: 80vh;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 13px;
    animation: flyin 300ms ease both;
    overflow-y: auto;
    @media (max-width: 520px){
      width: 87%;
    }
}
   .cl-merge{
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    width: 32px;
    height: 32px;
    font-weight: bold;
    line-height: 30px;
    font-size: 28px;
    background: #071a44;
    color: white;
    border-radius: 0 4px;
}
div#v12-modal-head {
    background: #f3f3f3;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 10px;
}
div#v12-modal-head img {
    display: block;
    margin: 0 auto 10px;
    height: 50px;
    object-fit: cover;
    max-width: 100%;
}
.v12-modal-body p {
    background: #071a44;
    border-bottom: 2px solid white;
    color: white;
    border-radius: 8px 8px 0 0;
    padding: 6px 9px;
    margin-bottom: 0;
    font-size: 13px;
    text-transform: initial;
    text-align: center;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    margin-top: 0;
}
table#calc-table {
    display: table;
    border-spacing: 0;
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 20px;
    all: initial;
    font-size: 12px;
    box-sizing: border-box;
    font-family: arial;
}
table#calc-table tbody {
    display: table-row-group;
    width: 100%;
    max-width: 100%;
}
 #calc-table tr th {
    background-color: #e1eefb;
    border-left: none;
    border-color: white;
    border-bottom: 4px solid white;
    color: #00315e;
    min-width: 150px;
    vertical-align: middle;
    font-weight: 400;
    padding: 5px 15px;
    font-family: arial;
    text-align: inherit;
}
#calc-table tr td {
    font-weight: bold;
    border-bottom: 4px solid white;
    border-left: 4px solid white;
    background-color: #f2f2f2;
    padding: 5px 15px;
    color: #505050;
    text-align: right;
    vertical-align: middle;
    min-width: 54%;
    font-family: arial;
}
select#options-select {
    text-align: right;
    border-radius: 2px;
    font-size: 15px;
    font-weight: bold;
    color: #00315e;
    background-color: white;
    width: 100%;
    border: 1px solid #E0DFDF;
    height: auto;
    font-family: arial;
}
select#imega-deposit-amount-select {
    border-radius: 2px;
    font-size: 15px;
    font-weight: bold;
    color: #00315e;
    background-color: white;
    width: 100%;
    border: 1px solid #E0DFDF;
    height: auto;
}
.modal-retail-finance {
    font-size: 10px;
    text-align: left;
    font-family: arial;
    margin-top: 10px;
    width: 100%;
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