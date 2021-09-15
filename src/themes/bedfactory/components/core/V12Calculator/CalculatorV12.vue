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
    </div>
    <div class="modal-retail-finance">
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