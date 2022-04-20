<template>
  <div class="footer-middle top-blue-line">
    <div class="container customContainer">
      <div class="row">
        <div
          class="col-sm-12 col-md-12 col-lg-11 col-xl-11 marginAuto"
          v-if="data"
        >
          <div class="trustpilot-main">
            <div class="a">
              <a class="sb-footer-green-line" href="/reviews/">
                <p
                  class="trustpilot-text-footer trustpilot_one trustpilot_texts dfdfd"
                  v-html="titleh5"
                ></p>
              </a>
            </div>
            <div class="b">
              <a class="sb-footer-green-line" href="/reviews/">
                <div class="sb-star">
                  <ul>
                    <li v-for="(img, index) in singleblockImage" :key="index">
                      <img :src="img" alt="singleblock images" />
                    </li>
                  </ul>
                </div>
              </a>
            </div>
            <div class="c">
              <div class="related-excellent ">
                <a class="sb-footer-green-line" href="/reviews/">
                  <p class="trustpilot_texts" v-html="subtitle"></p>
                </a>
              </div>
            </div>
            <div class="d">
              <a class="sb-footer-green-line" href="/reviews/">
                <div class="trustpilot-img"></div>
              </a>
            </div>
          </div>
        </div>
        <div
          class="col-md-12 top-blue-line-mobile"
          style="display:none"
          v-if="data"
        >
          <div class="trustpilot-footer-logo">
            <div
              class="trustpilot-mobile-logo"
              :src="trustPilotMobileLogo"
            ></div>
            <h5
              class="trustpilot-mobile-logo-text"
              v-html="trustPilotLogoText"
            ></h5>
          </div>

          <div class="trustpilot-footer-logo trustpilot-footer-customer">
            <h5 class="our-customer" v-html="titleh5"></h5>
            <div
              class="trustpilot-mobile-customer-img"
              :src="trustPilotCustomerImg"
            ></div>
          </div>
        </div>
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
        return this.parsedContent.querySelector("h5").innerHTML;
      }
    },
    subtitle() {
      if (this.parsedContent.querySelector("p")) {
        return this.parsedContent.querySelector("p").innerHTML;
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
        ).innerHTML;
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
        [].forEach.call(allImages, image => {
          var singleImage = "";
          singleImage = image.querySelector("img").attributes["src"];
          images[i] = singleImage;
          i++;
        });
      }
      return images;
    }
  }
};
</script>
<style lang="scss" scoped>
.footer-middle {
  background: #fff;
}
.trustpilot-main {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.trustpilot_texts {
  color: #191919;
  font-size: 1.25rem;
  margin: 0;
}

.top-blue-line {
  padding: 17px 0;
}
.sb-star {
  width: 160px;
  height: 30px;
  background: rgba(0, 0, 0, 0) url(/assets/stars.svg) no-repeat scroll;

  ul {
    display: none;
  }
}
.trustpilot-img {
  width: 114px;
  height: 30px;
  background: rgba(0, 0, 0, 0) url(/assets/trustpilot-logo.svg) no-repeat scroll;
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

@media screen and (min-width: 768px) and (max-width: 1200px) {
  .trustpilot_texts {
    font-size: 1rem !important;
  }
  .sb-star {
    width: 135px;
    height: 25px;
  }
  .trustpilot-img {
    width: 96px;
    height: 25px;
  }
}

@media screen and (min-width: 768px) and (max-width: 991px) {
  .customContainer {
    width: 834px;
  }
}
@media (max-width: 552px) {
  .trustpilot-main > div:nth-child(even) {
    margin-left: auto;
  }
}
@media (max-width: 767px) {
  .trustpilot-main > .a {
    flex-basis: 53%;
  }
  .trustpilot-main > .b {
    flex-basis: 10%;
  }
  .trustpilot-main > .c {
    flex-basis: 74%;
  }
  .trustpilot-main > .d {
    flex-basis: 19%;
  }
  .trustpilot-main > .d > div {
    margin-left: auto;
  }
  .trustpilot-img {
    width: 65px;
    height: 23px;
    margin-left: auto;
  }

  .sb-star {
    width: 108px;
    height: 20px;
  }
  .trustpilot_texts {
    font-size: 0.875rem;
  }
  .trustpilot-main {
    flex-wrap: wrap;
    padding: 0 10px;
    justify-content: space-between;
  }
  .mbl-hide {
    display: none;
  }
  ul li img {
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
@media (min-width: 1199px) {
  .marginAuto {
    margin: 0 auto;
  }
}
</style>
<style>
.trustpilot_texts > span {
  font-weight: 700;
}
</style>
