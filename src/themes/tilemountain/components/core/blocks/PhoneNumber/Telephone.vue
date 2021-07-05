<template>
  <div class="phone phone-icon" v-if="!fromCheckoutPage">
    <a :title="callText || subtitle" href="tel:+441515481554" class="contact NEw">
      <!-- <img :src="image" alt="icon"> -->
      <p class="call-us">{{ callText || subtitle }}</p>
    </a>
  </div>
  <div v-else class="" style="display: inline-block">
    <a href="tel:01782 223822" class="phone-no">
      <img src="/assets/phone.svg" alt="checkout phone" class="checkout-contact"/>
      <span>{{ callText || subtitle }}</span>
    </a>
  </div>
</template>
<script>
import cmsBlock from 'vsf-cms-block-mixin/components/cmsBlock'
export default {
  name: 'Telephone',
  mixins: [
    cmsBlock
  ],
  props: {
    callText: {
      type: String,
      required: false,
      default: null
    },
    fromCheckoutPage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    subtitle() {
      if (this.data) {
        return this.parsedContent.querySelector('p').rawText
      }
      return false
    },
    link() {
      if (this.data) {
        return this.parsedContent.querySelector('a').attributes['href']
      }
      return false
    }
    // image () {
    //   if (this.data) {
    //     return this.parsedContent.querySelector('img').attributes['src']
    //   }
    //   return false;
    // }
    // image () {
    //   return this.parsedContent.querySelector('img').attributes['src']
    // }
  }
}
</script>
<style lang="scss" scoped>
@font-face {
  font-family: 'Oblik';
  src: url('/assets/fonts/Oblik_Bold.otf');
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
    color: #071a44;
    font-size: 14px;
    font-weight: 700;
  }
}

div.phone-icon > .contact {
  display: flex;
  padding-top: 12px;
  white-space: nowrap;
  background: url('/assets/phone.svg') no-repeat 0 60%;
  background-size: 29px;
  @media (max-width: 767px) {
    background-size: 5.467vw;
  }

  img {
    margin-top: 11px;
    height: 28px;
  }

  p {
    margin-left: 6px;
    font-size: 18px;
    color: #071A44;
    font-family: 'Oblik';
    padding-left: 29px;
    // font-weight: 600;
  }
}

a.underline:after,
a:not(.no-underline):hover:after {
  content: none;
}

@media (min-width: 767px) and (max-width: 991px) {
  .contact {
    // padding-right: 50px;
    img {
      margin-top: 12px;
    }
  }
}

@media (min-width: 767px) and (max-width: 1199px) {
  .phone {
    padding-right: 12px;

    div.phone-icon > .contact {
      padding: 13px;
      padding-top: 20px;
      padding-right: 0px;
    }

    img {
      margin-top: 8px;
    }
  }
  .contact p {
    font-size: 14px;
    padding-left: 12px;
  }
}

@media (max-width: 992px) {
  .contact img {
    height: 23px;
  }
}

@media (max-width: 767px) {
  .wishlist {
    .wishlist-text {
      span {
        display: none;
      }
    }
  }
  .contact {
    // padding-top: 0px;
    display: flex;
    /* padding-top: 12px; */
    white-space: nowrap;
    height: 72px;
    width: 100%;
    max-width: 35px;
    padding: 0px !important;

    img {
      // margin-top: 12px;
      // height: 28px;
      height: 38%;
      width: 100%;

      padding-top: 25px;
      margin: 0px;
    }
  }
  .phone p {
    display: none;
  }
  .phone a {
    background: url('/assets/phone.svg') no-repeat 0 60%;
    padding-top: 0;
    width: 35px;
  }
}
@media (min-width: 320px) and (max-width: 767px) {
  .phone a {
    width: 13.7vw;
    max-width: 13.7vw;
    // transform: scale(0.65);
  }
}
// @media (max-width: 399px) {
//   .contact {
//     img {
//       height: 24px;
//       margin-top: 14px;
//     }
//   }
// }
img.checkout-contact {
    width: 29px;
}
</style>
