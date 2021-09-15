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
            <select id="options-select">
              <option
                value="0"
                data-fcode="27|244b3e7a-0ffb-41f2-88d5-adf78b6a3d9e"
              >
                Interest Free Finance (6 Months)
              </option>
              <option
                value="1"
                data-fcode="88|34ee414c-94d8-4cd2-8f62-fc5b8a2d2a7d"
              >
                Interest Free Finance (10 Months)
              </option>
              <option
                value="2"
                data-fcode="28|8e0bd3a9-657f-457c-b488-dbfab37fac39"
              >
                Interest Free Finance (12 Months)
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <th>Deposit Amount</th>
          <td id="imega-deposit-amount-td">
            <select id="imega-deposit-amount-select">
              <option value="0.3" selected="selected">30%</option>
              <option value="0.2">20%</option>
              <option value="0.1">10%</option>
            </select>
          </td>
        </tr>
      </tbody>
      <tbody id="calc-table-data">
        <tr>
          <th>Monthly Payments</th>
          <td data-imega-calculator-field="installment-amount">£34.93</td>
        </tr>
        <tr>
          <th>Purchase Price</th>
          <td data-imega-calculator-field="purchase-price">£499.00</td>
        </tr>
        <tr>
          <th>Deposit To Pay</th>
          <td data-imega-calculator-field="deposit-amount">£149.70</td>
        </tr>
        <tr>
          <th>Amount Of Credit</th>
          <td data-imega-calculator-field="credit-amount">£349.30</td>
        </tr>
        <tr>
          <th>Amount Of Interest</th>
          <td data-imega-calculator-field="interest-amount">£0.00</td>
        </tr>
        <tr>
          <th>Number Of Monthly Payments</th>
          <td data-imega-calculator-field="term">10</td>
        </tr>
        <tr>
          <th>Total Amount Payable</th>
          <td data-imega-calculator-field="total-payable">£499.00</td>
        </tr>
        <tr>
          <th>Rate Of Interest (Fixed)</th>
          <td data-imega-calculator-field="interest-rate">0.00%</td>
        </tr>
        <tr>
          <th>APR Representative</th>
          <td data-imega-calculator-field="apr">0%</td>
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
  props: {
    calculatorData: {
      type: Object,
      default: true
    },
    minimumInstallment:{
      type: [Number,String],
      required : true
    }
  },
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