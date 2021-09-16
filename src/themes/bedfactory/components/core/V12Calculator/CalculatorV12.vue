<template>
  <div class="check-v12">
    <i
      data-v-0b1c0f15=""
      class="material-icons close fab-cross cl-white cl-merge"
      @click="$emit('closeV12Calculator')"
      >close</i
    >
    <div>
      <img :src="calculatorData.widget_options.header_img" />
      <p>
        From £{{ minimumInstallment }} per month, subject to details, conditions
        apply
      </p>
      <p>
        {{ calculatorData.widget_options.top_text }}
      </p>
    </div>

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

    <div>
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
.check-v12[data-v-fe00d904] {
  width: 470px;
  background: #f3f3f3;
  position: fixed;
  max-width: 95%;
  margin: 5% auto;
  left: 0;
  right: 0;
  top: 0;
  max-height: 80vh;
  z-index: 2147483647;
  transition: all 0.5s ease-in-out;
  padding: 40px 30px 0 30px;
}
.cl-merge {
  color: #00315e !important;
  cursor: pointer;
}
</style>