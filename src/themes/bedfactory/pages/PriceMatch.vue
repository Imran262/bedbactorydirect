<template>
  <div col="lg-12" col-md-12 col-sm-12 col-xl-12>
    <div class="container">
      <div class="breadcrumbs mt-5">
        <div class="row">
          <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
            <div class="MainpriceMatch">
              <h1>Price Match</h1>
              <p>
                We try our best to offer products at prices that are competitive. To make sure our customers are always getting the best products at the best possible price, we also offer a price match service.
              </p>
              <strong> Price Match Conditions</strong>
              <ul>
                <li>
                  It has to be the same product with the same specification
                </li>
                <li>It has to be a new product in it’s original packaging</li>
                <li>It has to be available to buy</li>
                <li>We will consider any delivery charges</li>
              </ul>
              <p class="price-peragrpgh">
                For our full price match terms and conditions view our
                <span class="underlineHere">price match t&c</span> page
              </p>
            </div>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <div class="main-table">
              <h4 class="title">Submit A Request</h4>
              <p class="peragrapgh">
                Complete our simple price match form and we'll aim to reply
                within 1 working day
              </p>
              <p class="your-details">Your Details</p>
              <form id="orderForm">
                <div class="row mainFormRow">
                  <div class="field rightMargin">
                    <label for="first-name"> First Name <span>*</span></label>
                    <div class="input-field">
                      <input
                        class="w-100"
                        type="text"
                        name="first-name"
                        :autofocus="true"
                        autocomplete="given-name"
                      />
                    </div>
                  </div>
                  <div class="field">
                    <label for="last-name">
                      Last Name
                      <span>*</span>
                    </label>
                    <div class="input-field">
                      <input
                        class="w-100"
                        type="text"
                        name="last-name"
                        :autofocus="true"
                        autocomplete="given-name"
                      />
                    </div>
                  </div>
                </div>

                <div class="row mainFormRow">
                  <div class="field rightMargin">
                    <label for="phone-number"> Phone <span>*</span></label>
                    <div class="input-field">
                      <input
                        class="w-100"
                        type="number"
                        name="phone-name"
                        :autofocus="true"
                        autocomplete="tel"
                      />
                    </div>
                  </div>
                  <div class="field">
                    <label for="email-name">
                      Email
                      <span>*</span>
                    </label>
                    <div class="input-field">
                      <input
                        class="w-100"
                        type="email"
                        name="email-addres"
                        :autofocus="true"
                      />
                    </div>
                  </div>
                </div>

                <div class="row mainFormRow">
                  <div class="field rightMargin">
                    <label for="Postcode-name"> Postcode <span>*</span></label>
                    <div class="input-field">
                      <input
                        class="w-100"
                        type="text"
                        name="postcode-name"
                        v-model="postCode"
                        :autofocus="true"
                      />
                    </div>
                  </div>
                  <div class="field">
                    <div class="input-field">
                      <button class=" find-btn btn " :class="postCode === '' ? 'button-disabled' : ''" name="submit-button">
                        Find Address
                      </button>
                    </div>
                  </div>
                </div>
              
                <div class="single-input">
                  <div class="field-full">
                    <label for="address_line1">
                      Address line 1 <span>*</span>
                    </label>
                    <div class="input-field">
                      <input type="text" autocomplete="address_line1" />
                    </div>
                  </div>
                </div>
                <div class="single-input">
                  <div class="field-full">
                    <label for="address_line1">
                      Address line 2 <span>*</span>
                    </label>
                    <div class="input-field">
                      <input type="text" autocomplete="address_line2" />
                    </div>
                  </div>
                </div>
                <div class="single-input">
                  <div class="field-full">
                    <label for="address_line1"> Town <span>*</span> </label>
                    <div class="input-field">
                      <input
                        type="text"
                        name="city"
                        autocomplete="address_level2"
                      />
                    </div>
                  </div>
                </div>
                <div class="producr-history mt-4">
                  <h5>Product Details</h5>
                  <div class="field-full">
                    <label for="address_line1"> Product <span>*</span> </label>
                    <div class="input-field">
                      <input
                        type="text"
                        name="city"
                        autocomplete="address_level2"
                      />
                    </div>
                  </div>

                  <div class="field-full">
                    <label for="address_line1">
                      Competitors Website Link <span>*</span>
                    </label>
                    <div class="input-field">
                      <input
                        type="text"
                        name="city"
                        autocomplete="address_level2"
                      />
                    </div>
                  </div>
                </div>

                <div class="bottom-button">
                  <button class="btn">Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PriceMatch",
  data(){
    return {
      postCode: ''
    }
  },
};
</script>

<style>

.MainpriceMatch {
  text-align: left;
  margin-top: 1rem;
}
.MainpriceMatch strong{
      font-family: oblik;
    color: #343434;
}
.MainpriceMatch p{
  color: #333;
  font-family: Roboto,sans-serif;
}
.MainpriceMatch ul li{
  color: #333;
  font-family: Roboto,sans-serif;

}
.MainpriceMatch .price-peragrpgh{
    color: #333;
  font-family: Roboto,sans-serif;

}
.underlineHere {
  text-decoration: underline;
  
}
.main-table {
  margin-top: 3rem;
  background-color: rgb(241 236 236);
  border-radius: 4px;
  flex-wrap: wrap;
  padding: 0.8rem 0.8rem 3rem 0.8rem;
  text-align: left;
}
.title {
  margin: 0;
  padding-bottom: 0.8rem;
}
.peragrapgh {
  margin: 0;
  font-size: 14px;
  color: #333;
  font-family: Roboto,sans-serif;
}
.your-details{
   color: #333;
  font-family: Roboto,sans-serif;
  font-weight: 700;
}
.mainFormRow {
  justify-content: center;
  flex-wrap: wrap;
}
.rightMargin {
  margin-right: 0.5rem;
}
.main-table form .field {
  padding: 0;
  margin-bottom: 15px;
  width: 46%;
  display: inline-block;
}
.main-table form .field label {
  display: block;
  margin-bottom: 8px;
  text-align: left;
  cursor: pointer;
  color: #747474;
  font-size: 14px;
}
.main-table form .field label > span {
  color: red;
  display: inline;
}
.main-table form .field input {
  display: block;
  border-radius: 4px;
  border: 1px solid #dfdfdf;
  height: 30px;
  padding: 0;
   font-size: 18px;
  font-family: Roboto,sans-serif;
  outline: none;
  background: #fff;
}

.btn {
  margin-top: 1.6rem;
  padding: 0.5rem 0.1rem;
  background-color: #071a44;
  color: #fff;
  border: none;
  border-radius: 3px;
}
.find-btn{
  width: 88%;
  font-weight: 800;
  padding: 5px;
  margin-top: 1.62rem;

}
.button-disabled {
    opacity: 0.3;
    pointer-events: none;
}

.single-input {
  text-align: left;
}
.single-input .field-full {
  padding: 0;
  width: 100%;
  display: inline-block;
  margin-bottom: 10px;
}

.single-input .field-full label {
  display: block;
  margin-bottom: 8px;
  text-align: left;
  cursor: pointer;
  color: #747474;
  font-size: 14px;
}
.single-input .field-full label > span {
  display: inline;
  color: red;
}

.single-input .field-full input {
  display: block;
  border-radius: 4px;
  border: 1px solid #dfdfdf;
  background: #fff;
  width: 100%;
  height: 30px;
  padding: 0;
  font-size: 18px;
  font-family: Roboto,sans-serif;
  outline: none;
}

.producr-history {
}
.producr-history h5 {
  font-weight: 700;
  text-align: left;
}

.producr-history .field-full {
  padding: 0;
  width: 100%;
  display: inline-block;
  margin-bottom: 10px;
}

.producr-history .field-full label {
  display: block;
  margin-bottom: 8px;
  text-align: left;
  cursor: pointer;
  color: #747474;
  font-size: 14px;
}
.producr-history .field-full label > span {
  display: inline;
  color: red;
}
.producr-history .field-full input {
  display: block;
  border-radius: 4px;
  border: 1px solid #dfdfdf;
  background: #fff;
  width: 100%;
  height: 30px;
  padding: 0;
  font-size: 18px;
  font-family: Roboto,sans-serif;
  outline: none;
}

.bottom-button {
  text-align: center;
  justify-content: center;
}
.bottom-button .btn {
  background-color: #071a44;
  color: #fff;
  padding: 0.9rem 2rem;
  margin-top: 0.8rem;
  text-transform: uppercase;
  font-weight: 700;
  border: none;
  border-radius: 4px;
}
.bottom-button .btn:hover {
  background-color: #071a44;
  color: rgb(155, 132, 132);
  padding: 0.9rem 2rem;
  margin-top: 0.8rem;
  text-transform: uppercase;
  font-weight: 700;
  border: none;
  border-radius: 4px;
}
</style>
