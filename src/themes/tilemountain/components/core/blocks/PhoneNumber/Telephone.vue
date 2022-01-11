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
        :class="checkClass"
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
    checkClass: {
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
  margin-right: 15px;
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
  position: relative;
  top: 1px;
}

a.underline:after,
a:not(.no-underline):hover:after {
  content: none;
}

img.checkout-contact {
  width: 29px;
}
img.checkout-contact.logoutClass {
    top: 0 !important;
}

// for tablets
@media (max-width: 992px) {
  .phone-no {
    display: flex;
    align-items: center;

    img {
      top: 0px;
    }
  }
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
      padding-right: 1.25rem;
  }
}

// for desktop
@media (min-width: 768px) {
  span {
    top: 2px;
  }
}
// for desktop
@media (min-width: 993px) {
  span {
    display: none;
  }
}

</style>