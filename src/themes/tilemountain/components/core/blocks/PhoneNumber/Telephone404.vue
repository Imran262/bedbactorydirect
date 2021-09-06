<template>
    <span :class="`phone` + (callText?``:` phone-icon`)">
        <a :title="callText || subtitle" href="tel:+441515481554" class="contact">
        <span class="call-us">{{ callText || subtitle }}</span>
        </a>
    </span>
</template>
<script>
import cmsBlock from 'vsf-cms-block-mixin/components/cmsBlock'
export default {
  name: 'Telephone',
  mixins: [
    cmsBlock
  ],
  props:{
    callText: {
      type: String,
      required:false,
      default:null
    }
  },
  computed: {
    subtitle () {
      if (this.data) {
        return this.parsedContent.querySelector('p').rawText
      }
      return false;
    },
    link () {
      if (this.data) {
        return this.parsedContent.querySelector('a').attributes['href']
      }
      return false;
    }
  }
}
</script>
<style lang="scss" scoped>
@font-face {
  font-family: "Oblik";
  src: url("/assets/fonts/Oblik_Bold.otf");
}
.call-us{
    color: #29275b;
    font-weight: bold;
}
.phone-icon > .contact {
  display: flex;
  padding-top: 12px;
  white-space: nowrap;
  background: url("/assets/phone.svg") no-repeat 0 60%;
 background-size: 29px;

  img {
    margin-top: 11px;
    height: 28px;
  }

  p {
    margin-left: 7px;
    font-size: 17px;
    color: #29275b;
    font-family: "Oblik";
    padding-left: 32px;
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

    .phone-icon > .contact {
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
    background: url("/assets/phone.svg") no-repeat 0 60%;
    padding-top: 0;
    width: 29px;
  }
}
</style>
