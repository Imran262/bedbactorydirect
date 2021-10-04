<template>
  <div class="container">
    <div class="row row-shipping">
      <div class="col-lg-6 col-md-12 col-xs-6 address-info">
        <div class="delivery-info col-md-6 col-sm-6 col-xs-7">
          <h3 class="coming">Address:</h3>
          <p v-if="getAddressInformation.shippingAddress.company">
            {{ getAddressInformation.shippingAddress.company }}
          </p>
          <p>{{ getStreetName }}</p>
          <p>{{ getAddressInformation.shippingAddress.region }}</p>
          <p>{{ getAddressInformation.shippingAddress.city }}</p>
          <p>{{ getAddressInformation.shippingAddress.postcode }}</p>
        </div>
        <div class="address-icon col-md-6 col-sm-6 col-xs-5">
          <img src="/assets/box.png" class="truck" alt="truck" />
        </div>
      </div>
      <div class="col-lg-6 col-md-12 col-xs-6 shipping">
        <div class="shipping-detail">
          <div class="d-detail">
            <span class="dm">Delivery Method:</span>
            <p v-if="getAddressInformation.shipping_method_code">
              {{ getShippingMethodName }}
            </p>
          </div>
          <template v-if="getAddressInformation.shipping_method_code">
            <template v-if="getAddressInformation.shipping_date">
              <span class="arrive">Prefered Delivery Day</span>
              <p v-if="getShippingMethodDate && getShippingMethodDate !=='Invalid Date'">{{ getShippingMethodDate }}</p>
              <p v-else>Date to be Arranged</p>
            </template>
          </template>
        </div>
        <div class="icon-box">
          <div class="icon">
            <img class="desktop-img truck" src="/assets/Trucknew.png" alt="trucknew" />
            <img class="mbl-img" src="/assets/van.png" alt="van" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { format } from "date-fns"
export default {
  props: ["addressInformation"],
  computed: {
    getAddressInformation() {
      return this.addressInformation
    },
    getStreetName() {
      if (Array.isArray(this.getAddressInformation.shippingAddress.street)) {
        return this.getAddressInformation.shippingAddress.street.join("\n")
      } else {
        return this.getAddressInformation.shippingAddress.street
      }
    },
    getShippingMethodDate() {
      const regex = /(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g
      if (
        this.getAddressInformation &&
        this.getAddressInformation.shipping_date.match(regex)
      ) {
        const date = this.getAddressInformation.shipping_date.match(
          regex
        )[0]
        let newDate
        if (date.includes("-")) {
          // Because of this component used in at two places for two different payment methods.
          const splitDate = date.split("-")
          const changedOrder = [splitDate[1], splitDate[0], splitDate[2]].join(
            "/"
          )
          newDate = new Date(changedOrder)
        } else {
          newDate = new Date(date)
        }
        console.log(" 789632145 New date",newDate,"Formated",format(newDate, "Do MMMM YYYY"));
        return format(newDate, "Do MMMM YYYY")
      }
    },
    getShippingMethodName() {
      let nameOfService
      if (
        this.getAddressInformation &&
        this.getAddressInformation.shipping_method_code
      ) {
        console.log("789654 Before ",this.getAddressInformation.shipping_method_code);
        let deliveryName = this.getAddressInformation.shipping_method_code.split(
          "__"
        )
        if (deliveryName) {
          // deliveryName.forEach((name) => {
          //   console.log("deliveryNamedeliveryName", name);
          // });
          if (deliveryName[0]) {
            nameOfService = deliveryName[0]
            let i = 0
            let strLength = nameOfService.length
            for (i; i < strLength; i++) {
              nameOfService = nameOfService.replace("_", " ")
            }
          }
        }
      }
      console.log("789654 After ",nameOfService);
     let newName = this.getAddressInformation.shipping_method_code.split(
          "-"
        )
        console.log("789654 new ",newName);
      return newName[0]
    }
  }
};
</script>
<style scoped lang="scss">
@media (min-width: 991px) {
  .row-shipping {
    flex-wrap: nowrap;
  }
}
.address-info {
  flex: 1 auto;
  background-color: #e1dde9;
  margin-right: 0.5rem;
  padding: 12px 11px 25px;

  .coming {
    font-weight: 700;
    font-size: 21px;
    color: #54575b;
    font-family: 'oblik';
  }
  p {
    margin: 0px;
    color: #54575b;
    font-family: Arial;
    margin-bottom: 10px;
    font-size: 17px;
  }
  img {
    float: right;
    margin-top: 63px;
  }
  .delivery-info,
  .address-icon {
    float: left;
    width: 50%;
  }
  @media (max-width: 767px) {
    .delivery-info {
      width: 65%;
      padding-left: 15px;
      padding-right: 0;
    }
    .address-icon {
      width: 35%;
    }
  }
}

.shipping {
  flex: 1 auto;
  margin-left: 0.5rem;
  background-color: #b7e6e2;
  padding: 15px 21px 35px 32px;
  span {
    font-family: 'oblik';
    font-weight: bold;
    font-size: 21px;
    color: #434343;
  }
  p {
    margin: 0px;
    padding-top: 5px;
    padding-bottom: 25px;
    font-weight: 300;
    font-family: Arial;
    word-break: break-word;
    color: #434343;
    font-size: 17px;
  }

  img {
    float: right;
    margin-top: 75px;
  }
  .icon-box,
  .shipping-detail {
    float: left;
  }
  .shipping-detail {
    width: 60%;
    padding-top: 13px;
    p:first-child {
      margin-top: 20px;
      word-break: break-word;
    }
    .d-detail {
      margin-bottom: 25px;
      color: #434343;
      p {
        margin-top: 5px;
      }
    }
  }
  .icon-box {
    width: 40%;
  }
}

@media (max-width: 767px) {
  .container {
    padding-right: 0px;
    padding-left: 0px;
  }
  .address-info {
    margin-right: 0;
    padding: 5px 5px 20px 10px;
    border-right: 4px solid #fff;
    // height: 146px;
    img {
      margin: 16px;
      margin-top: 61px;
    }
    .coming {
      font-size: 12px;
      margin-bottom: 10px;
      font-family: Arial;
    }
    p {
      font-size: 11px;
      line-height: 1.5;
    }
    .shipping-detail {
      padding-top: 0 !important;
    }
  }
  .shipping {
    margin-left: 0;
    padding: 16px 5px 20px 15px;
    border-left: 4px solid #fff;
    // height: 146px;
    p {
      font-size: 11px;
      padding-bottom: 0px;
    }
    img {
      float: none;
      margin-top: 76px;
    }
  }
  .shipping-detail span {
    font-size: 12px;
    font-family: Arial;
  }
  .address-info img {
    margin: 33px 0px 0px 20px;
    width: 35px;
  }
  .shipping img {
    width: 40px;

    margin: 35px 0px 0px 12px;
  }
  .shipping .shipping-detail {
    width: 60%;
    padding-top: 0px;
  }
  .desktop-img {
    display: none;
  }
  .address-info p {
    margin-bottom: 0;
  }
  .address-info .delivery-info {
    // padding-left: 18px;
  }
}

@media (min-width: 767px) {
  .mbl-img {
    display: none;
  }
}
@media (min-width: 767px) and (max-width: 1200px) {
  .shipping {
    margin-left: 0;
  }
  .address-info {
    margin-right: 0;
  }
}
@media (max-width: 428px) {
  .address-info img {
    margin: 51px -9px 0px 0px;
    width: 28px;
  }
  .shipping img {
    width: 40px;
    margin: 39px 0px 0px 6px;
  }
}
</style>
