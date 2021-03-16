<template>
  <div class="row center-xs">
    <router-link
      v-for="singleblock in singleblockdata"
      :to="localizedRoute(singleblock.atag)"
      :key="singleblock.hthree"
      class="brand-detail col-lg-4 col-md-4 col-sm-6 col-xs-12"
    >
      <div class="brand-detail-inner">
        <img :src="singleblock.img" :alt="singleblock.hthree" />
        <div :class="singleblock.classrockBottom + ' overlay'">
          <h3>{{ singleblock.hthree }}<sup>{{ singleblock.rockBottomSuperScript }}</sup></h3>
          <button class="main_product_btn">{{ singleblock.btntxt }}</button>
        </div>
       </div>
    </router-link>
  </div>
</template>

<script>
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock";
import { getThumbnailPath } from "@vue-storefront/core/helpers";
import { empty } from "apollo-link";
export default {
  name: "Productlist",
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
          let checkForStylishClass = mbclass.classNames.includes('stylishSaving');
          let checkForStylishText = mbclass.querySelector("h2").outerHTML.includes('<sup>');
          if (checkForStylishText) {
            singleBlock["rockBottomSuperScript"] = '2';
          } else {
            singleBlock["rockBottomSuperScript"] = "";
          }
          if (checkForStylishClass) {
            singleBlock["classrockBottom"] = "rockBottom";
          } else {
            singleBlock["classrockBottom"] = "";
          }
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
</style>
