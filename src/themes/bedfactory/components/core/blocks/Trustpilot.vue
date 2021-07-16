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
        <h5 class="our-customer">Over 30,000 happy customers!</h5>
      </div>

      <div class="trustpilot-footer-logo trustpilot-footer-customer">
        <h5 class="trustpilot-mobile-logo-text">{{ trustPilotLogoText }}</h5>
        <div
          class="trustpilot-mobile-customer-img"
          :src="trustPilotCustomerImg"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock";
export default {
  name: "TrustPoilet",
  mixins: [cmsBlock],
  computed: {
    titleh5() {
      if (this.parsedContent.querySelector("h5")) {
        return this.parsedContent.querySelector("h5").rawText;
      }
    },
    subtitle() {
      if (this.parsedContent.querySelector("p")) {
        return this.parsedContent.querySelector("p").rawText;
      }
    },
    // image() {
    //    if (this.parsedContent.querySelector("img.trustpilot-img")) {
    //   return this.parsedContent.querySelector("img.trustpilot-img").attributes[
    //     "src"
    //   ];
    // }
    // },
    trustPilotLogoText() {
      if (this.parsedContent.querySelector("h5.trustpilot-mobile-logo-text")) {
        return this.parsedContent.querySelector(
          "h5.trustpilot-mobile-logo-text"
        ).rawText;
      }
    },
    trustPilotMobileLogo() {
      if (this.parsedContent.querySelector("img.trustpilot-mobile-logo")) {
        return this.parsedContent.querySelector("img.trustpilot-mobile-logo")
          .attributes["src"];
      }
    },
    trustPilotCustomerImg() {
      if (
        this.parsedContent.querySelector("img.trustpilot-mobile-customer-img")
      ) {
        return this.parsedContent.querySelector(
          "img.trustpilot-mobile-customer-img"
        ).attributes["src"];
      }
    },
    singleblockImage() {
      var images = [];
      if (this.data) {
        var allImages = this.parsedContent.querySelectorAll(
          ".trustpilot-images li"
        );
        var i = 0;
        [].forEach.call(allImages, (image) => {
          var singleImage = "";
          singleImage = image.querySelector("img").attributes["src"];
          images[i] = singleImage;
          i++;
        });
      }
      return images;
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
  margin-bottom: 12px;
  align-items: center;
  max-width: 1270px;
  padding: 0 10px;
}
.trustpilot_one {
  float: left;
  font-size: 28px;
  font-family: oblik;
  color: #071a44;
  margin: 12px;
}
.related-excellent {
  float: left;
  color: #071a44;
  font-size: 28px;
  font-family: "Oblik";
  margin-left: 35px;
}
.top-blue-line {
  padding: 41px 0px 0px 0px;
}
.sb-star {
  width: 250px;
  height: 50px;
  margin: 0px 0px 0px 21px;
  float: left;
  background: rgba(0, 0, 0, 0) url(/assets/stars.svg) no-repeat scroll;
}
.trustpilot-img {
  width: 200px;
  height: 50px;
  margin-left: 38px;
  float: left;
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
  padding: 16px 0 18px;
  border-top: 1px solid #c2c2c5;
}
.trustpilot-footer-customer {
  margin-top: 11px;
}
.trustpilot-mobile-logo {
  width: 120px;
  height: 32px;
  margin-top: -4px;
  float: left;
  background: rgba(0, 0, 0, 0) url(/assets/trustpilot-logo.svg) no-repeat scroll;
}
.trustpilot-mobile-customer-img {
  width: 110px;
  height: 24px;
  margin: 0px -6px 0px 0px;
  float: left;
  background: rgba(0, 0, 0, 0) url(/assets/stars.svg) no-repeat scroll;
  position: relative;
  top: 1px;
}

@media only screen and (min-device-width: 992px) and (max-device-width: 1199px) {
  .trustpilot-main{
   max-width: 960px;
  }
  .sb-star {
    width: 210px;
    height: 44px;
  }
  .trustpilot-img {
    width: 180px;
    height: 35px;
  }
  .trustpilot_one {
    font-size: 18px;
  }
  ul li img {
    height: 32px;
    width: 32px;
  }
  .related-excellent {
    font-size: 18px;
  }
  .trustpilot_image {
    margin-top: -7px;
    height: 42px;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 991px) {
   .trustpilot-main{
   max-width: 740px;
   justify-content: space-evenly;
  }
  .sb-star {
    width: 138px;
    height: 31px;
    margin: 0;
  }
  .trustpilot-img {
    width: 134px;
    height: 35px;
    margin-left: 0px;
  }
  .trustpilot_one {
    font-size: 16px;
    margin-left: 0;
  }
  ul li img {
    height: 22px;
    width: 22px;
  }
  .related-excellent {
    font-size: 16px;
    margin-left: 0;
  }
  .trustpilot_image {
    margin-top: -7px;
    height: 30px;
  }
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
    font-size: 15px;
    color: #29275b;
    font-family: "ArcaMajora3";
    margin: 0;
    padding-right: 0;
  }
  .trustpilot-footer-logo img {
    display: inline-block;
    vertical-align: bottom;
  }
  .trustpilot-footer-logo {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 10px;
  }
  .our-customer {
    font-size: 15px !important;
    padding-right: 15px;
  }
  .top-blue-line-mobile {
    background-color: #ffffff;
    padding: 16px 0 18px;
  }
  .trustpilot-footer-customer {
    margin-top: 11px;
  }
}
@media only screen and (min-device-width: 1200px) and (max-device-width: 1500px) {
  .trustpilot_one {
    font-size: 25px;
  }
  .related-excellent {
    font-size: 25px;
  }
  .trustpilot-main {
    width: 100%;
    justify-content: center;
  }
}
@media (max-width: 360px) {
  .trustpilot-footer-logo h5,
  .our-customer {
    font-size: 13px !important;
  }
  .trustpilot-mobile-logo {
    width: 100px;
    height: 27px;
  }
  .trustpilot-mobile-customer-img {
    width: 100px;
    height: 20px;
  }
}
@media (min-width: 480px) {
  .our-customer,
  .trustpilot-footer-logo h5 {
    font-size: 16px !important;
  }
}
</style>