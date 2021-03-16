<template>
<div class="container">
  <div class="row pt20">
    <router-link
      v-for="singleblock in singleblockdata"
      :to="localizedRoute(singleblock.atag)"
      :key="singleblock.hthree"
      class="brand-detail col-lg-4 col-md-4 col-sm-6 col-xs-12"
    >
      <div class="brand-detail-inner">
        <img :src="singleblock.img" :alt="singleblock.hthree" />
        <div class="overlay">
          <h3>{{ singleblock.hthree }}</h3>
          <button class="main_product_btn">{{ singleblock.btntxt }}</button>
        </div>
      </div>
    </router-link>
  </div></div>
</template>

<script>
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock";
import { getThumbnailPath } from "@vue-storefront/core/helpers";
import { empty } from "apollo-link";
export default {
  name: "PageNotFoundBlock",
  mixins: [cmsBlock],
  computed: {
    singleblockdata() {
      var homeSmallBlocks = [];
      if (this.data) {
        var mbclasses = this.parsedContent.querySelectorAll(
          ".mb_home_small_img"
        );
        var i = 0;
        [].forEach.call(mbclasses, (mbclass) => {
          var singleBlock = new Array(3);
          singleBlock["img"] = mbclass.querySelector("img").attributes["src"];
          if (mbclass.querySelector("a")) {
            singleBlock["atag"] = mbclass.querySelector("a").innerHTML;
          } else {
            singleBlock["atag"] = "";
          }
          singleBlock["hthree"] = mbclass.querySelector("h2").rawText;
          singleBlock["btntxt"] = mbclass.querySelector("button").rawText;
          homeSmallBlocks[i] = singleBlock;
          i++;
        });
      }
      return homeSmallBlocks;
    },
  },
};
</script>

<style scoped>
.notfound_main_text{
font-family: oblik;
color: #29275b;
}
.notfound_text{
color: #29275b;
font-weight: bold;
}
.text-colour{
color: #828282;
}
a.underline:after,
a:not(.no-underline):hover:after {
background-color: transparent !important;
}
@media (min-width: 767px){
.brand-detail {
position: relative;
padding: 0px 16px 24px 16px;
}
.brand-detail-inner {
position: relative;
}
img {
width: 100%;
z-index: 1;
margin-bottom: -4px;
}
.overlay {
position: absolute;
bottom: 0px;
background: rgba(207,206,202,0.7);
font-family: oblik;
color: #f1f1f1;
width: 100%;
color: #29275b;
font-size: 20px;
padding: 4px 0 10px 0;
text-align: center;
font-weight: bold;
}
.overlay h3 {
font-family: oblik;
font-size: 24px;
color: #29275b;
text-align: center;
}
.main_product_btn {
width: 70%;
text-transform: uppercase;
font-family: Arial;
font-weight: bold;
margin: 0 auto !important;
background: transparent;
display: none;
color: #29275b;
font-size: 14px;
margin-top: 10px;
border-radius: 3px;
padding: 15px;
border: 2px solid #29275b;
}
.brand-detail:hover .main_product_btn {
display: block;
}
}
@media (max-width: 767px) {
.brand-detail:hover .main_product_btn {
display: none;
}
.familiar-brands {
background: #ffffff;
padding: 0px;
margin-top: 0px;
}
.brand-detail {
position: relative;
margin-bottom: 20px;
}
.brand-detail-inner {
position: relative;
}
img {
width: 100%;
height: auto;
z-index: 1;
margin-bottom: -4px;
}
.overlay {
position: absolute;
bottom: 0px;
background: rgba(207, 206, 202, 0.7);
font-family: oblik;
color: #f1f1f1;
width: 100%;
color: #29275b;
font-size: 20px;
padding: 4px 0 10px 0;
text-align: center;
font-weight: bold;
}
.h3 {
font-size: 24px;
color: #29275b;
text-align: center;
font-family: oblik !important;
}
.main_product_btn {
width: 70%;
text-transform: uppercase;
font-family: Arial;
font-weight: bold;
margin: 0 auto !important;
background: transparent;
display: none;
color: #29275b;
font-size: 14px;
margin-top: 10px;
border-radius: 3px;
padding: 15px;
border: 2px solid #29275b;
}
}


@media (max-width: 767px){
.overlay h3{
  font-family: oblik;
}
}
</style>
