<template>
  <div class="familiar-brands">
    <div class="container">
      <!-- <div class="row center-xs">
        <h1 class="desktop">amiliar Brands, Unfamiliar Prices</h1>
        <h1 class="mobile">
          Shop by category
        </h1>
      </div>-->
      <Productlist :identifier="'familiar-brands-TM'" />
    </div>
  </div>
</template>

<script>
import Productlist from "src/themes/bedfactory/components/theme/blocks/FamiliarProducts/ProductlistTM";
export default {
  components: {
    Productlist,
  },
};
</script>
<style lang="scss">
@media (min-width: 767px) {
  .familiar-brands {
    padding: 0px 0px 27px 0px;
    .desktop {
      text-align: center;
      font-size: 26px;
      font-weight: 700;
      text-transform: uppercase;
      color: #54575b;
      margin-bottom: 55px;
      font-family: "Poppins", sans-serif;
    }
    .mobile {
      display: none;
      font-family: "Poppins", sans-serif;
    }
    .brand-detail {
      position: relative;
      .brand-detail-inner {
        position: relative;
        img {
          width: 100%;
          // height: 194px;
          z-index: 0;
        }
        .heading {
          margin-top: -46px;
          padding: 10px 0 10px 0;
          background: #ffffff;
          position: absolute;
          width: 100%;
          bottom: 0;
          h3 {
            text-align: center;
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            color: #54575b;
            margin: 0px;
            font-family: "Poppins", sans-serif;
          }
        }
        &:hover .heading {
          top: 46px;

          width: 100%;
          padding: 140px 0px;
          background: rgba(0, 0, 0, 0.3);
        }
        &:hover h3 {
          color: #ffffff;
          z-index: 999;
        }
      }
    }
    a.underline:after,
    a:not(.no-underline):hover:after {
      background-color: transparent !important;
    }
  }
}
@media (min-width: 767px) and (max-width: 1280px) {
  .familiar-brands {
    .brand-detail {
      .brand-detail-inner {
        img {
          height: auto;
        }
      }
    }
  }
}
@media (max-width: 767px) {
  .familiar-brands {
    background: #ffffff;
    padding: 0px;
    margin-top: 0px;
    .desktop {
      display: none;
      font-family: "Poppins", sans-serif;
    }
    .mobile {
      text-align: center;
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      color: #54575b;
      letter-spacing: 1px;
      font-family: "Poppins", sans-serif;
    }
    .brand-detail {
      position: relative;
      margin-bottom: 20px;
      .brand-detail-inner {
        position: relative;
        img {
          width: 100%;
          height: auto;
          z-index: 0;
        }
        .heading {
          margin-top: -6px;
          padding: 10px;
          background: #f5f7fa;
          h3 {
            text-align: center;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            color: #54575b;
            margin: 0px;
            letter-spacing: 1px;
            font-family: "Poppins", sans-serif;
          }
        }
      }
    }
    a.underline:after,
    a:not(.no-underline):hover:after {
      background-color: transparent !important;
    }
  }
}

@media (min-width: 1200px) and (max-width: 1225px) {
  .familiar-brands .brand-detail .brand-detail-inner:hover .heading {
    width: 100% !important;
    padding: 80px 0px;
  }
}

@media (min-width: 991px) and (max-width: 1200px) {
  .familiar-brands .brand-detail .brand-detail-inner:hover .heading {
    width: 100% !important;
    padding: 102px 0px;
  }
}
@media (min-width: 767px) and (max-width: 990px) {
  .familiar-brands .brand-detail .brand-detail-inner:hover .heading {
    width: 100% !important;
    padding: 74px 0px;
  }
}
</style>
