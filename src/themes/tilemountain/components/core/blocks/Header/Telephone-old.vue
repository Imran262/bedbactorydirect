<template>
  <div class="phone">
    <a href="tel:0127 0340034" class="contact">
      <img src="/assets/icons/phone.svg" alt="icon" />
      <p>01782 223822</p>
    </a>
  </div>
</template>

<script>
export default {
  components: {
    name: "Telephone",
  },
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "Oblik";
  src: url("/assets/fonts/Oblik_Bold.otf");
}
.contact {
  display: flex;
  padding-top: 12px;
  white-space: nowrap;

  img {
    margin-top: 11px;
    height: 29px;
  }
  p {
    margin-left: 7px;
    font-size: 17px;
    color: #29275b;
    font-family: "Oblik";
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
    a {
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
    padding: 0px;
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
    padding-top: 0;
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
</style>
