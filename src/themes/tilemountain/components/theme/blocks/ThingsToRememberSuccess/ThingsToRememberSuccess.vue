<template>
<div class="container">
  <div class="things-to-remember row">
    <h3>Delivery</h3>
    <p class="mbl-font">All our deliveries are ‘Kerbside Deliveries’. Your order will be delivered by a third-party courier on a pallet which is placed at the nearest accessible location.<br/><br/>
      <span>
        <a class="pointer" @click="redirectTo">Click here</a>
      </span> for more information on Kerbside Deliveries and find out what to expect on the day.
    </p>
  </div>
  </div>
</template> 
<script>
export default {
  methods:{
    redirectTo() {
      this.$router.push(this.localizedRoute('i/delivery'))
    }
  }
};
</script>
<style scoped lang="scss">
.pointer {
  cursor: pointer;
}
.things-to-remember {
  // background-color: #cfd42d;
  margin-top: 25px;
  padding-top: 25px;
  margin-bottom: 30px;
  @media (max-width: 767px) {
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 0px;
    padding-top: 17px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
 
  h3 {
    font-weight: 700;
    font-family: 'oblik';
    font-size: 27px;
    margin: 0px;
    color: #2A285A;
  }
 
  span {
    text-decoration: underline;
  }
}
 
     @media (min-width: 767px){
       p {
    margin: 10px 0px;
    color: #434343;
    line-height: 1.6;
    font-size: 18px;
    font-family: Arial;
    }
  }
    @media (max-width: 767px) {
  p{
    font-size: 14px;
    margin: 10px 0px;
    color: #434343;
    line-height: 1.6;
    font-family: Arial;
  }
   h3 {
    font-size: 18px !important;
  }
  }
</style>