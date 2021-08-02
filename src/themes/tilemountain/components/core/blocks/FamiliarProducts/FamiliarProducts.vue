<template>
  <div class="familiar-brands">
    <div class="container">
      <Productlist :identifier="'Familiar-Brands'"/>
    </div>
  </div>
</template>

<script>
import Productlist from "theme/components/core/blocks/FamiliarProducts/ProductList";

export default {
  components: {
    Productlist,
  },
};
</script>
<style lang="scss">
.rockBottom {
  background-color: #ff9000 !important;
}
.rockBottom h3 {
  color: #FFF !important;
}
.rockBottom .main_product_btn {
  border: 2px solid #FFF;
  color: #FFF;
}
@media (min-width: 767px) {
  .familiar-brands {
    background: #f1f1f1;
    padding: 0 0 0 0;
    padding-top: 1%;

    .desktop {
      text-align: center;
      font-size: 26px;
      font-weight: 700;
      text-transform: uppercase;
      color: #54575b;
      margin-bottom: 55px
    }

    .mobile {
      display: none
    }

    .brand-detail {
      position: relative;
      padding: 0 10px 24px 10px;

      .brand-detail-inner {
        position: relative;
        padding-bottom: 109%;

        img {
          width: 100%;
          margin-bottom: -4px;
          position: absolute;
          transform: translate(-50%, -50%);
          top: 50%;
          left: 50%;
          object-fit: contain
        }

        .overlay {
          position: absolute;
          bottom: 0;
          background: rgba(207, 206, 202, .7);
          font-family: oblik;
          color: #f1f1f1;
          width: 100%;
          color: #29275b;
          font-size: 20px;
          padding: 4px 0 10px 0;
          text-align: center;
          font-weight: 700;

          h3 {
            font-family: oblik;
            color: #071A44;
            text-align: center
          }
          sup{
            font-size: 15px;
            margin: 1px;
          }
        }
      }
    }

    a.underline:after, a:not(.no-underline):hover:after {
      background-color: transparent !important
    }
  }
}
.familiar-brands .brand-detail {
  z-index: 0;
}
.main_product_btn {
  width: 70%;
  text-transform: uppercase;
  font-family: Arial;
  font-weight: 700;
  margin: 0 auto !important;
  background: transparent;
  display: none;
  color: #071A44;
  font-size: 14px;
  margin-top: 10px;
  border-radius: 3px;
  padding: 15px;
  border: 2px solid #071A44;
}

.brand-detail:hover .main_product_btn {
  display: block
}

@media (min-width: 767px) and (max-width: 1280px) {
  .familiar-brands {
    .brand-detail {
      .brand-detail-inner {
        img {
          height: auto
        }
      }
    }
  }
}

@media (max-width: 767px) {
  .brand-detail:hover .main_product_btn {
    display: none
  }
  .familiar-brands {
    background: #fff;
    padding: 0;
    margin-top: 0;

    .desktop {
      display: none
    }

    .mobile {
      text-align: center;
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      color: #54575b;
      letter-spacing: 1px
    }

    .brand-detail {
      position: relative;
      margin-bottom: 10px;
      margin-top: 2px;

      .brand-detail-inner {
        position: relative;
        padding-bottom: 109%;

        img {
          width: 100%;
          height: auto;
          margin-bottom: -4px;
          transform: translate(-50%, -50%);
          top: 50%;
          left: 50%;
          object-fit: contain;
          position: absolute
        }

        .overlay {
          position: absolute;
          bottom: 0;
          background: rgba(207, 206, 202, .7);
          font-family: oblik;
          color: #f1f1f1;
          width: 100%;
          color: #29275b;
          font-size: 20px;
          padding: 4px 0 10px 0;
          text-align: center;
          font-weight: 700;

          h3 {
            font-size: 24px;
            color: #29275b;
            text-align: center;
            font-family: oblik
          }
        }
      }
    }

    a.underline:after, a:not(.no-underline):hover:after {
      background-color: transparent !important
    }
  }
}

@media (min-width: 1200px) and (max-width: 1225px) {
  .familiar-brands .brand-detail .brand-detail-inner:hover .heading {
    width: 100% !important;
    padding: 80px 0
  }
}

@media (min-width: 991px) and (max-width: 1200px) {
  .familiar-brands .brand-detail .brand-detail-inner:hover .heading {
    width: 100% !important;
    padding: 102px 0
  }
}

@media (min-width: 767px) and (max-width: 990px) {
  .familiar-brands .brand-detail .brand-detail-inner:hover .heading {
    width: 100% !important;
    padding: 74px 0
  }
}

@media (max-width: 575px) {
  .familiar-brands .brand-detail {
    position: relative;
    margin-bottom: 10px;
    margin-top: 4px;
    padding: 0 14px 0 14px
  }
}
@media (min-width: 992px) {
.familiar-brands .brand-detail .brand-detail-inner .overlay h3 {
    font-size: 24px;
}
}
@media (min-width: 768px) and (max-width: 991px){
.familiar-brands .brand-detail .brand-detail-inner .overlay h3 {
    font-size: 19px;
}
}

</style>
