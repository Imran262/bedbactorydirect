<template>
  <div class="phone phone-icon" v-if="!fromCheckoutPage">
    <a
      :title="callText || subtitle"
      href="tel:+441515481554"
      class="contact NEw"
    >
      <!-- <img :src="image" alt="icon"> -->
      <span>Phone</span>
      <!-- phone number commit kya h  -->
      <p class="call-us">{{ callText || subtitle }}</p>
    </a>
  </div>
  <div v-else class="" style="display: inline-block">
    <a href="tel:01782 223822" class="phone-no">
      <img
        src="/assets/phone.svg"
        alt="checkout phone"
        class="checkout-contact"
      />
      <span>{{ callText || subtitle }}</span>
    </a>
  </div>
</template>
<script>
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock";
export default {
  name: "Telephone",
  mixins: [cmsBlock],
  props: {
    callText: {
      type: String,
      required: false,
      default: null,
    },
    fromCheckoutPage: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    subtitle() {
      if (this.data) {
        return this.parsedContent.querySelector("p").rawText;
      }
      return false;
    },
    link() {
      if (this.data) {
        return this.parsedContent.querySelector("a").attributes["href"];
      }
      return false;
    },
    // image () {
    //   if (this.data) {
    //     return this.parsedContent.querySelector('img').attributes['src']
    //   }
    //   return false;
    // }
    // image () {
    //   return this.parsedContent.querySelector('img').attributes['src']
    // }
  },
};
</script>
<style lang="scss" scoped>
@font-face {
  font-family: "Oblik";
  src: url("/assets/fonts/Oblik_Bold.otf");
}
.call-us {
  color: #29275b;
  font-weight: bold;
}
.phone-no {
  margin-right: 20px;
  img {
    position: relative;
    top: 5px;
  }
  span {
    font-family: Arial, Helvetica, sans-serif;
    color: #2A275B;
    font-size: 14px;
    font-weight: 700;
  }
}
div.phone-icon > .contact {
  display: flex;
  padding-top: 12px;
  white-space: nowrap;
  background: url("/assets/phone.svg") no-repeat 0 60%;
  background-size: 27px;
  img {
    margin-top: 11px;
    height: 28px;
  }
  p {
    margin-left: 6px;
    font-size: 16px;
    color: #2A275B;
    font-family: "Oblik";
    padding-left: 29px;
    // font-weight: 600;
  }
}
span{
  display: block;
  font-size: 9px;
  font-weight: 600;
  font-family: "Roboto";
  color: #2A275B;
}

a.underline:after,
a:not(.no-underline):hover:after {
  content: none;
}
// @media (min-width: 767px) and (max-width: 991px) {
//   .contact {
//     img {
//       margin-top: 12px;
//     }
//   }
// }
// @media (min-width: 767px) and (max-width: 1199px) {
//   span {
//     display: block;
//     font-size: 9px;
//     font-weight: 600;
//     font-family: "Roboto";
//     color: #2A275B;
//   }
//   .phone {
//     padding-right: 8px;
//     div.phone-icon > .contact {
//       padding: 13px;
//       padding-top: 20px;
//       padding-right: 0px;
//     }
//     img {
//       margin-top: 8px;
//     }
//   }
//   .contact p {
//     display: none;
//   }
//   div.phone-icon > .contact {
//     display: flex;
//     padding-top: 23px;
//     height: 0;
//     top: -4px;
//     white-space: nowrap;
//     background: url("/assets/phone.svg") no-repeat center 0%;
//     background-size: 21px;
//   }
// }
// phone icons for mobile view 
// @media (max-width: 767px) {
//   span{
//     display: block;
//     font-size: 12px;
//     font-weight: 600;
//     font-family: "Roboto";
//     color: #2A275B;
    
//   }
// }
// 1200 se zyada
// @media (min-width: 1200px) {
//   span {
//     display: none;
//   }
// }
// @media (max-width: 992px) {
//   .contact img {
//     height: 23px;
//   }
// }


// @media (max-width: 480px) {
//   div.phone-icon > .contact{
//     background-size: 21px !important;
//     background: url("/assets/phone.svg") no-repeat 17% 60%;

//   }
//   span{
//     font-size: 11px;
//   }
// }
// @media (max-width: 320px) {
//   div.phone-icon > .contact{
//     margin-bottom: 0;
//   }
  
// }
img.checkout-contact {
  width: 29px;
}
//  @media (max-width: 1199px) and(min-width: 992px) {
//     .phone {
//     padding-right: 16px;
//     }
//   }


// for mobiles
// @media (max-width: 767px) {
//   .wishlist {
//     .wishlist-text {
//       span {
//         display: none;
//       }
//     }
//   }
//   .contact {
//     display: flex;
//     white-space: nowrap;
//     height: 37px;
//     width: 100%;
//     padding: 0px !important;
//     img {
//       height: 38%;
//       width: 100%;
//       padding-top: 25px;
//       margin: 0px;
//     }
//   }
// }

// for tablets
@media (max-width: 992px) {
  .wishlist {
    .wishlist-text {
      span {
        display: none;
      }
    }
  }
  .contact {
    display: flex;
    white-space: nowrap;
    height: 35px;
    width: 100%;
    padding: 0px !important;
    img {
      height: 38%;
      width: 100%;
      padding-top: 25px;
      margin: 0px;
    }
  }
  .contact p {
    display: none;
  }

  div.phone-icon > .contact{
    flex-direction: column-reverse;
    background: url("/assets/phone.svg") no-repeat center 0;
    background-size: 22px;
    
  }
  .phone.phone-icon.icon.pointer.t-mobile {
      padding-right: 3vw;
  }
}

// for desktop
@media (min-width: 993px) {
  span {
    display: none;
  }
}
</style>