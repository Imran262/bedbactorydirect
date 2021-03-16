<template>
  <div class="Main-Location">
    <div class=" pt10 pb30 pl10 pr10">
      <div class="row">
        <h2 class="m0 mb5">Your Collection Point:</h2>
        <div class="row col-md-12 storeinfo">
          <div class="Storedetails col-md-6 col-xs-12">
            <h3>Tunstall Showroom</h3>
            <p>103.41 miles - Get Directions</p>
            <div class="directions">
              <i class="material-icons">location_on</i>
              <span>Get Direction</span>
            </div>
            <div class="store-address">
              <span class="companyName">Tile Mountain</span>
              <span class="Street">Harewood Street</span>
              <span class="Origin">Tunstall</span>
              <span class="Address">Stoke on Trent</span>
              <span class="Number">ST6 5DX</span>
            </div>
            <!-- <div class="Date-button ">
               <button-full data-testid="buttonconfirm" class="button">{{ $t('Confirm Collection') }}</button-full>
             </div>-->
          </div>
          <div class="map col-md-6 col-xs-12">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d9592.45737200364!2d-2.2125426!3d53.0542529!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x1d52baadf23252b5!2sTile%20Mountain!5e0!3m2!1sen!2s!4v1598451939404!5m2!1sen!2s"
              width="313;"
              height="305"
              frameborder="0"
              style="border:0;"
              allowfullscreen
              aria-hidden="false"
              tabindex="0"
            ></iframe>
            <div class="bmouter">
              <div class="bminfo">
                <img src="/assets/logo.svg" alt="logo"/>
                <div class="bminner">
                  <strong class="opentime">
                    <span>Opening Times</span>
                  </strong>
                  <span class="timespan">Mon - Fri: 9:00 - 17:00</span>
                  <strong class="phonenumber">
                    <span>01782 405047</span>
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StoreLocation'
};
</script>
<style lang="scss" scoped>
.Main-Location {
  .container {
    padding: 0px !important;
    /* padding-top: 15px !important; */
    padding-bottom: 30px !important;
    padding-left: 31px !important;
    // padding-right: 31px !important;
    @media (min-width: 768px) and(max-width: 991px) {
      padding-left: 13px !important;
    }
  }

  background: #fff;
  margin-bottom: 25px;
  margin-top: 25px;

  h2 {
    color: #3A3E3D;
    font-size: 22px;
    width: 100%;
    font-weight: 600;
    font-family: 'oblik';
  }

  .storeinfo {
    display: flex;
    padding: 0px 10px;
    padding-left: 0px;

    .Storedetails {
      margin-top: -18px;
      @media (max-width: 767px) {
        padding-right: 37px !important;
        padding-left: 24px !important;
      }
      @media (max-width: 400px) {
        padding-left: 16px !important;
      }
    }

    p {
      color: #3A3E3D;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14px;
      margin-bottom: 5px;
    }

    h3 {
      color: #3A3E3D;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 18px;
      margin-top: 50px;
      margin-bottom: 7px;
    }

    .map {
      margin-top: -40px;

      iframe {
        border: 0px;
        padding-left: 21px;
        padding-top: 15px;
      }
    }

    .Date-button {
      padding-top: 21px;

      .button {
        background-color: #00a997;
        height: 50px;
        line-height: 0;
        border-radius: 3px;
        width: 68%;
        opacity: 1;
        color: #fff;
    
        font-size: 16px;
        text-align: center;
        display: block;
        font-weight: 600;
        line-height: 3.3;
      }
    }
  }

  .directions {
    position: relative;

    i {
      color: #ED008C;
      position: absolute;
      font-size: 19px;
      left: -2px;
      top: 6px;
    }

    span {
      cursor: pointer;
      text-decoration: underline;
      color: #5fabe6;
      padding-left: 19px;
      /* padding-top: 24px; */
      font-size: 13px;
    }
  }

  .store-address {
    padding-top: 15px;
    display: grid;

    span {
      color: #4a4a4a;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14px;
      /* padding-top: 51px; */
      padding-bottom: 8px;
      font-weight: bold;
    }

    .companyName {
      padding-top: 8px;
      padding-bottom: 0px;
    }

    .Street {
      padding-bottom: 0px;
      padding-top: 5px;
    }

    .Origin {
      padding-top: 6px;
      padding-bottom: 0px;
    }

    .Address {
      padding-top: 6px;
      padding-bottom: 0px;
    }

    .Number {
      padding-top: 6px;
      padding-bottom: 0px;
    }
  }

  .bmouter {
    position: relative;

    .bminfo {
      display: grid;
      max-width: 137px;
      width: 100%;
      height: 149px;
      background-color: #fff;
      border: 2px solid #ED008C;
      position: absolute;
      right: 37px;
      bottom: 143px;

      img {
        width: 85px;
        height: 45px;
        padding-left: 12px;
        padding-top: 9px;
      }

      .bminner {
        display: contents;
        margin-top: -28px;

        span {
          color: #1D1B4A;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 11px;
        }

        .opentime {
          padding-left: 15px;
          margin-top: 4px;
        }

        .phonenumber {
          padding-left: 16px;
          padding-bottom: 19px;
        }

        .timespan {
          margin-top: -9px;
          padding-left: 15px;
          padding-top: 2px;
        }
      }
    }
  }

  .place-card-medium {
    display: none;
  }

  @media (min-width: 992px) and (max-width: 1200px) {
    .map {
      iframe {
        width: 247px;
        height: 285px;
        padding-top: 57px !important;
        padding-left: 0px !important;
      }

      .bminfo {
        display: grid;
        max-width: 137px;
        width: 100%;
        height: 128px;
        background-color: #fff;
        border: 2px solid #ed0f8b;
        position: absolute;
        right: 30px;
        bottom: 150px;
      }

      .opentime {
        padding-bottom: 6px;
      }
    }
  }
  @media (min-width: 768px) and(max-width: 991px) {
    .Main-Location .container {
      padding-left: 13px !important;
    }
    .map {
      iframe {
        width: 206px;
        padding-top: 57px !important;
        padding-left: 0px !important;
      }

      .bminfo {
        right: 4px;
        bottom: 150px;
      }

      .opentime {
        padding-bottom: 6px;
      }
    }
    .Date-button {
      .button {
        width: 100% !important;
      }
    }
  }
  @media (max-width: 767px) {
    .map {
      padding-right: 24px;
      padding-left: 3px;
      padding-top: 47px;

      iframe {
        width: 93%;
      }
    }

    .Date-button {
      .button {
        width: 100% !important;
      }
    }
  }
}

@media (max-width: 400px) {
  .map {
    iframe {
      width: 93%;
      padding-left: 13px !important;
    }
  }
}
</style>
