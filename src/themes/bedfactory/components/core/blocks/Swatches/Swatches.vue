<template>
  <div class="container">
    <div class="row">
      <div
        class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 home_video"
        v-if="data"
      >
        <div class="hm-tilingtips-content">
          <h3 v-if="title" v-html="title" class="hm-style-advice"></h3>
         
          <p v-if="subtitle" class="hm-tiling-para">
            {{ subtitle }}
          </p>
          <router-link :to="localizedRoute(link)" v-if="link">
            <button class="hm-watch-vid-one" v-if="button">{{ button }}</button>
          </router-link>
        </div>
      </div>
      <div
        class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 home_video1 mt20"
      >
        <router-link :to="localizedRoute(link)" v-if="link" class="hm-watch-vid">
          <img v-lazy="image" v-if="image" width="88%" alt="home video" />
        </router-link>

        <router-link :to="localizedRoute(link)" v-if="link">
          <button class="hm-watch-vid-mobile" v-if="buttonmobile">{{ buttonmobile }}</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock";
export default {
  name: "LeftBanner",
  mixins: [cmsBlock],
  computed: {
    title() {
      if (!this.data) { return false;}
      let liParsedH3 = this.parsedContent.querySelector('h3');
      if (liParsedH3 && liParsedH3.length === 0) return false;
      return this.parsedContent.querySelector("h3").rawText;
    },
    title2() {
      if (!this.data) { return false;}
      let liParsedH1 = this.parsedContent.querySelector('h1');
      if (liParsedH1 && liParsedH1.length === 0) return false;
      return this.parsedContent.querySelector("h1").rawText;
    },
    subtitle() {
      if (!this.data) { return false;}
      let liParsedP = this.parsedContent.querySelector('p');
      if (liParsedP && liParsedP.length === 0) return false;
      return this.parsedContent.querySelector("p").rawText;
    },
    button() {
      if (!this.data) { return false;}
      let liParsedBtn = this.parsedContent.querySelector('button');
      if (liParsedBtn && liParsedBtn.length === 0) return false;
      return this.parsedContent.querySelector("button").rawText;
    },
    buttonmobile() {
      if (!this.data) { return false;}
      let liParsedBtnMob = this.parsedContent.querySelector('button');
      if (liParsedBtnMob && liParsedBtnMob.length === 0) return false;
      return this.parsedContent.querySelector("button").rawText;
    },
    link() {
      if (!this.data) { return false;}
      let liParsedA = this.parsedContent.querySelector('a');
      if (liParsedA && liParsedA.length === 0) return false;
      return this.parsedContent.querySelector("a").attributes["href"];
    },
    image() {
      if (!this.data) { return false;}
      let liParsedImg = this.parsedContent.querySelector('img');
      if (liParsedImg && liParsedImg.length === 0) return false;
      return this.parsedContent.querySelector("img").attributes["src"];
    },
  },
};
</script>
<style  scoped>
.hm-style-advice {
  margin-top: 80px !important;
  font-size: 25px;
  color: #071A44;
  font-family: Arial;
  font-weight: bold;
  font-family: oblik;
}
.hm-tiling-heading {
  font-size: 38px;
  color: #59595b;
  font-family: oblik;
}
.hm-tiling-para {
    font-size: 18px;
    line-height: 1.6;
    padding-bottom: 20px;
    color: #858585;
    padding-right: 119px;
}

.hm-watch-vid-one {
  text-align: center;
  border: none;
  font-family: Arial;
  font-weight: bold;
  height: 47px;
  line-height: 1;
  padding: 15px 47px;
  font-size: 14px;
  border-radius: 4px;
  background-color: #071A44;
  color: #ffffff;
}
.hm-watch-vid-mobile {
  text-align: center;
  border: none;
  font-family: Arial;
  font-weight: bold;
  height: 47px;
  line-height: 1;
  padding: 15px 47px;
  font-size: 14px;
  border-radius: 4px;
  background-color: #29275b;
  color: #ffffff;
  display: none;
}
@media only screen and (min-device-width: 320px) and (max-device-width: 767px) {
  .hm-watch-vid-mobile {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 61%;
    margin-bottom: 8px;
    margin-top: 6px;
  }
  .hm-tiling-para {
    font-size: 16px;
    line-height: 1.6;
    color: #858585;
    padding-bottom: 0px;
    padding-right: 50px;
  }
  .hm-tiling-heading {
    font-size: 31px;
  }
  .hm-style-advice {
    margin-top: 0px !important;
  }
  .hm-watch-vid-mobile {
    padding: 15px 27px;
    font-size: 14px;
  }
  .hm-watch-vid-one {
    display: none;
  }
}
@media (max-width: 575px){
.home_video1 , .home_video{
  padding: 0px 14px 0px 14px;
}
}
</style>