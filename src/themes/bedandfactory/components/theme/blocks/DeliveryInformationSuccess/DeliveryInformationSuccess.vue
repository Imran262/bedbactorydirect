<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-xs-12 address-info">
      <h3 class="coming">
          It's coming to...
        </h3>
      <div class="delivery-info col-lg-8 col-md-6 col-sm-8 col-xs-9">
        <p>{{ getAddressInformation.shippingAddress.company }}</p>
        <p>{{ getStreetName }}</p>
        <p>{{ getAddressInformation.shippingAddress.city }}</p>
        <p>{{ getAddressInformation.shippingAddress.region }}</p>
        <p>{{ getAddressInformation.shippingAddress.postcode }}</p>
      </div>
      <div class="address-icon col-lg-4 col-md-6 col-sm-4 col-xs-3">
        <img src="assets/box.png">
      </div>
    </div>
  </div>
</template>
<script>
import {format} from 'date-fns'
export default {
  props: ['addressInformation'],
  computed: {
    getAddressInformation() {
      return this.addressInformation
    },
    getStreetName() {
      if (Array.isArray(this.getAddressInformation.shippingAddress.street)) {
        return this.getAddressInformation.shippingAddress.street.join('\n');
      } else {
        return this.getAddressInformation.shippingAddress.street
      }
    },
    getShippingMethodDate() {
      const regex = /(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g;
      if (this.getAddressInformation && this.getAddressInformation.shipping_method_code.match(regex)) {
        const date = this.getAddressInformation.shipping_method_code.match(regex)[0];
        let newDate;
        if (date.includes('-')) {
          // Because of this component used in at two places for two different payment methods.
          const splitDate = date.split('-')
          const changedOrder = [splitDate[1], splitDate[0], splitDate[2]].join('/')
          newDate = new Date(changedOrder)
        } else {
          newDate = new Date(date)
        }
        return format(newDate, 'EEEE do MMMM yyyy');
      }
    }
  }
}
</script>
<style scoped lang="scss">

  .address-info {
    flex: 1 auto;
    background-color: #e1dde9;
    margin-right: 0.5rem;
    font-family: 'Poppins', sans-serif;
    padding: 25px 25px 35px 25px;

    .coming{
      font-weight: 700;
      font-size: 16px;
      margin-left: 7px;
    }
    p{
      margin:0px;
    }
    img{
      float: right;
      margin-top: 40px;
    }
    .delivery-info, .address-icon{
      float: left;
    }
    .delivery-info{
      width: 70%;
    }
    .address-icon{
      width: 30%;
      float: right;
    }
  }

  .shipping {
    flex: 1 auto;
    background-color: #bfe9e5;
    font-family: 'Poppins', sans-serif;
    padding: 25px 25px 35px 25px;
    p{
      margin:0px;
      height: 55px;
      word-break: break-word;
    }
    img{
      float: right;
      margin-top: 15px;
    }
    .shipping-detail{
      p:first-child{
        margin-top: 20px;
      }
      h3{
        font-weight: 700;
        font-size: 16px;
        margin-bottom: 5px;
      }
    }
    .arriving{
      h3{
        font-weight: 700;
        font-size: 16px;
        margin-bottom: 5px;
        margin-top: 0px;
      }
    }
    .icon-box{
      overflow: auto;
    }
  }
  @media(max-width: 470px){
    .address-info{
      img{
        margin-top: 33px !important;
        float: right !important;
        width: 45px !important;
        height: 45px !important;
        margin-right: -7px !important;
      }
    }
    .shipping img{
         width: 50px !important;
         height: 45px !important;
      }
  }
  @media(min-width: 471px) and (max-width: 570px){
    .address-info{
      img{
        margin-right: -75px !important;
        margin-top: 33px !important;
      }
    }
  }
  @media(max-width: 767px){
    .address-info{
      margin-right: 0px;
      padding: 10px 5px 0px 5px;
      img{
        margin-top: 0px !important;
        margin-right: -100px;
        float: right;
        width: 45px !important;
        height: 45px !important;
      }
      .coming{
        font-size: 12px;
      }
      p{
        font-size: 10px;
      }
    }
    .shipping {
      margin-left: 0;
      padding: 10px 5px 0px 5px;
      p{
        font-size: 10px;
        min-height: 35px;
        height: auto;
      }
      h3{
        font-size: 12px !important;
      }
      img{
        margin-top: 5px;
        width: 50px !important;
        height: 45px !important;
      }
    }
     .arriving{
      h3{
        font-size: 12px !important;
      }
    }
    .address-info .delivery-info, .address-info .address-icon{
      /* float: left; */
      width: auto;
    }
  }
  @media(min-width: 767px) and (max-width: 1200px){
    .shipping {
      margin-left: 0;
    }
    .address-info{
      margin-right: 0;
      img{
      margin-top: 20px;
    }
    }
  }
  @media(min-width: 767px) and (max-width: 991px){
    .address-info img{
      margin-top: 20px;
    }
  }
  @media(min-width: 767px){
      .shipping {
        width: 399px;
      }
  }
  @media(min-width: 1200px) and (max-width: 1250px){
    .shipping{
        width: 360px !important;
    }
  }
</style>
