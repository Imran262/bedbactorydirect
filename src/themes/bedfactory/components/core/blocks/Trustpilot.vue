<template>
  <div class="footer-middle">
    <div class="col-md-12 top-blue-line desktop" v-if="data">
      <div class="">
        <div class="trustpilot-main mbl-hide">
          <div class="a">
            <div class="sb-footer-green-line" data-link="/trustpilot-reviews/">
              <p class="trustpilot-text-footer trustpilot_one">
                {{ titleh5 }}
              </p>
            </div>
          </div>
          <div class="b">
            <div class="sb-star">
              <ul>
                <li v-for="(img, index) in singleblockImage" :key="index">
                  <img :src="img" alt="singleblock images" />
                </li>
              </ul>
            </div>
          </div>
          <div class="c">
            <div class="related-excellent">
              <p>{{ subtitle }}</p>
            </div>
          </div>
          <div class="d">
            <div class="trustpilot-img"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-12 top-blue-line-mobile" v-if="data">
      <div class="trustpilot-footer-logo">
        <div class="trustpilot-mobile-logo" :src="trustPilotMobileLogo"></div>
        <h5 class="trustpilot-mobile-logo-text">{{ trustPilotLogoText }}</h5>
      </div>

      <div class="trustpilot-footer-logo trustpilot-footer-customer">
        <h5 class="our-customer">{{ titleh5 }}</h5>
        <div
          class="trustpilot-mobile-customer-img"
          :src="trustPilotCustomerImg"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock"
export default {
  name: "TrustPoilet",
  mixins: [cmsBlock],
  computed: {
    titleh5 () {
      if (this.parsedContent.querySelector("h5")) {
        return this.parsedContent.querySelector("h5").rawText
      }
    },
    subtitle () {
      if (this.parsedContent.querySelector("p")) {
        return this.parsedContent.querySelector("p").rawText
      }
    },
    // image() {
    //    if (this.parsedContent.querySelector("img.trustpilot-img")) {
    //   return this.parsedContent.querySelector("img.trustpilot-img").attributes[
    //     "src"
    //   ];
    // }
    // },
    trustPilotLogoText () {
      if (this.parsedContent.querySelector("h5.trustpilot-mobile-logo-text")) {
        return this.parsedContent.querySelector("h5.trustpilot-mobile-logo-text")
          .rawText
      }
    },
    trustPilotMobileLogo () {
      if (this.parsedContent.querySelector("img.trustpilot-mobile-logo")) {
        return this.parsedContent.querySelector("img.trustpilot-mobile-logo")
          .attributes["src"]
      }
    },
    trustPilotCustomerImg () {
      if (this.parsedContent.querySelector(
        "img.trustpilot-mobile-customer-img"
      )) {
        return this.parsedContent.querySelector(
          "img.trustpilot-mobile-customer-img"
        ).attributes["src"]
      }
    },
    singleblockImage () {
      var images = []
      if (this.data) {
        var allImages = this.parsedContent.querySelectorAll(
          ".trustpilot-images li"
        )
        var i = 0;
        [].forEach.call(allImages, (image) => {
          var singleImage = ""
          singleImage = image.querySelector("img").attributes["src"]
          images[i] = singleImage
          i++
        })
      }
      return images
    },
  },
};
</script>
<style lang="scss" scoped>
.trustpilot-main {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  justify-content: space-between;
  max-width: 1270px;
  padding: 0 10px;
  align-items: center;
}
.trustpilot_one {
     float: left;
    font-size: 28px;
    font-family: oblik;
    color: #071a44;
}
.related-excellent {
  float: left;
  color: #071a44;
  font-size: 28px;
  font-family: 'Oblik';
  font-weight: bold;
}
.top-blue-line {
  padding: 10px 0;
}
.sb-star {
  width: 250px;
  height: 50px;
  float: left;
  background: rgba(0, 0, 0, 0) url(/assets/stars.svg) no-repeat scroll;
}
.trustpilot-img {
  width: 200px;
  height: 50px;
  background: rgba(0, 0, 0, 0) url(/assets/trustpilot-logo.svg) no-repeat scroll;
  margin-top: -7px;
}
.trustpilot_image {
  margin-top: -7px;
}
ul li {
  list-style-type: none;
  float: left;
  margin: -14px 4px 0px 0px;
}
.top-blue-line-mobile {
  display: none;
}
.trustpilot-footer-customer {
  margin-top: 11px;
}
.trustpilot-mobile-logo {
  width: 113px;
  height: 39px;
  margin-top: -4px;
  float: left;
  background: rgba(0, 0, 0, 0) url(/assets/trustpilot-logo.svg) no-repeat scroll;
}
.trustpilot-mobile-customer-img {
  width: 116px;
  height: 35px;
  margin: 4px 0px 0px 3px;
  float: left;
  background: rgba(0, 0, 0, 0) url(/assets/stars.svg) no-repeat scroll;
}

// @media only screen and (min-device-width: 992px) and (max-device-width: 1199px) {
//   .sb-star {
//     width: 116px;
//     height: 35px;
//     margin: 9px 0px 0px 17px;
//     float: left;
//     background: rgba(0, 0, 0, 0) url(/assets/stars.svg) no-repeat scroll;
//   }
//   .trustpilot-img {
//     width: 116px;
//     height: 35px;
//     margin-top: 0px;
//     float: left;
//     background: rgba(0, 0, 0, 0) url(/assets/trustpilot-logo.svg) no-repeat
//       scroll;
//   }
//   .trustpilot_one {
//     font-size: 17px;
//   }
//   ul li img {
//     height: 32px;
//     width: 32px;
//   }
//   .related-excellent {
//     font-size: 16px;
//     margin-top: -3px;
//   }
//   .trustpilot_image {
//     margin-top: -7px;
//     height: 42px;
//   }
// }
@media only screen and (min-device-width: 768px) and (max-device-width: 991px) {
  .trustpilot-main{
    max-width: 740px !important;
}
 .related-excellent {
  font-size: 16px !important;
 }
 .trustpilot_one {
   font-size: 16px !important;
 }
 .sb-star{
    width: 150px !important;
    height: 31px !important;
}
.trustpilot-img {
    width: 134px !important;
    height: 31px !important;
}
  // .sb-star {
  //   width: 116px;
  //   height: 35px;
  //   margin: 4px 0px 0px 3px;
  //   float: left;
  //   background: rgba(0, 0, 0, 0) url(/assets/stars.svg) no-repeat scroll;
  //   margin-left: 8px;
  // }
  // .trustpilot-img {
  //   width: 116px;
  //   height: 35px;
  //   margin-top: -4px;
  //   float: left;
  //   background: rgba(0, 0, 0, 0) url(/assets/trustpilot-logo.svg) no-repeat
  //     scroll;
  // }
  // .trustpilot_one {
  //   font-size: 12px;
  //   margin: 6px;
  //   margin-left: 0;
  // }
  // ul li img {
  //   height: 22px;
  //   width: 22px;
  // }
  // .related-excellent {
  //   font-size: 12px;
  //   margin-top: -4px;
  //   margin-left: 26px;
  // }
  // .trustpilot_image {
  //   margin-top: -7px;
  //   height: 30px;
  // }
}
@media (max-device-width: 767px) {
  .mbl-hide {
    display: none;
  }
  .trustpilot_one {
    float: left;
  }
  ul li img {
    float: left;
  }
  .related-excellent {
    float: left;
  }
  .trustpilot_image {
    float: left;
  }
  .trust_pilot_mbl {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .desktop {
    display: none;
  }
  .top-blue-line-mobile {
    display: block;
  }
  .trustpilot-footer-logo h5 {
    display: inline-block;
    font-size: 12.07px;
    color: #071a44;
    font-family: oblik;
    margin: 0;
    padding-left: 14px;
  }
  .trustpilot-footer-logo img {
    display: inline-block;
    vertical-align: bottom;
  }
  .trustpilot-footer-logo {
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
  .our-customer {
    font-size: 14px !important;
    padding-right: 15px;
  }
  .top-blue-line-mobile {
    background-color: #e0dfdf;
    padding: 13px 0;
  }
  .trustpilot-footer-customer {
    margin-top: 11px;
  }
  .trustpilot-mobile-customer-img {
    width: 116px;
    height: 23px;
    margin: 0px 0px 0px 0px;
    float: left;
    background: rgba(0, 0, 0, 0) url(/assets/stars.svg) no-repeat scroll;
  }
  .trustpilot-mobile-logo {
    width: 113px;
    height: 29px;
    margin-top: -4px;
    float: left;
    background: rgba(0, 0, 0, 0) url(/assets/trustpilot-logo.svg) no-repeat
      scroll;
  }
}
// @media only screen and (min-device-width: 1200px) and (max-device-width: 1500px) {
//   .trustpilot_one {
//     float: left;
//     font-size: 25px;
//     font-family: oblik;
//     color: #29275b;
//     margin: 12px;
//     margin-left: 47px;
//   }
//   .sb-star {
//     width: 267px;
//     height: 45px;
//     margin: 4px 0px 0px 0px;
//     float: left;
//     background: rgba(0, 0, 0, 0) url(/assets/stars.svg) no-repeat scroll;
//   }
//   .related-excellent {
//     float: left;
//     color: #29275b;
//     font-size: 22px;
//     font-family: 'Oblik';
//     margin-top: -8px;
//     margin-left: -30px;
//   }
//   .trustpilot-img {
//     width: 267px;
//     height: 47px;
//     margin-left: 0px;
//     float: left;
//     background: rgba(0, 0, 0, 0) url(/assets/trustpilot-logo.svg) no-repeat
//       scroll;
//     margin-top: -3px;
//     margin-left: 22px;
//   }
//   .trustpilot-main {
//     display: flex;
//     margin-left: auto;
//     margin-right: auto;
//     width: 100%;
//     justify-content: center;
//   }
// }
// @media only screen and (min-device-width: 1501px) and (max-device-width: 1795px) {
//   // .related-excellent {
//   //   font-size: 31px;
//   // }
//   // .trustpilot_one {
//   //   font-size: 31px;
//   // }
//   .trustpilot-main{
//     width: 100%;
//   }
// }
@media (max-width: 1199px){
.trustpilot-main{
    max-width: 960px;
}
 .related-excellent {
  font-size: 20px;
 }
 .trustpilot_one {
   font-size: 20px;
 }
 .sb-star{
    width: 210px;
    height: 44px;
}
.trustpilot-img {
    width: 180px;
}
}
</style>