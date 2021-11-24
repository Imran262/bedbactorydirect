<template>
  <div class="main-content">
    <div class="price-match-detail">
      <div class="container">
        <div class="price-match-header">
          <div class="col-md-12 col-lg-12">
            <h2 class="title">YOUR PRICE MATCH REQUEST HAS BEEN RECEIVED.</h2>
          </div>
        </div>
        <p class="sub-title">Thanks for submitting a price match request.</p>
        <p class="sub-title-info">
          We aim to reply to price match requests within 1 working day.
        </p>
        <button type="button" class="btn">CONTINUE SHOPPING</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PriceMatchSuccess",
};
</script>

<style scoped>
.main-content {
  min-height: 25rem;
  background: #fff;
}
.price-match-detail {
  font-family: "Lato", sans-serif;
  margin-top: 2.3rem;
}
.price-match-header {
  text-align: center;
  padding: 1.4rem 0.8rem;
  background: #071a44;
  color: #fff;
}
.price-match-header .title {
  font-size: 25px;
  font-weight: 700;
  margin: 0;
  font-family: Arial;
}
.sub-title {
  font-size: 27px;
  font-weight: 600;
  font-family: Arial;
  color: #071a44;
}
.sub-title-info {
  font-weight: normal;
  color: #333333;
  line-height: 1.5;
  font-size: 15px;
}
.btn {
  border: 1px solid #57c9c0;
  letter-spacing: 0.05rem;
  font-size: 0.9375rem;
  color: #fff;
  background: #57c9c0;
  text-align: center;
  padding: 0.7em 1em;
  border-radius: 4px;
  font-weight: bold;
  margin-top: 1.5rem;
}
/* @media (max-width: 767px)
{
    .price-match-header .title  {
   font-size: 14px !important; }
} */
@media (min-width: 575px) and (max-width: 767.98px) {
  .price-match-header .title {
    font-size: 14px !important;
  }
}
@media (min-width: 768px) and (max-width: 991.98px) {
  .price-match-header .title {
   font-size: 16px !important;
  }
}
</style>

