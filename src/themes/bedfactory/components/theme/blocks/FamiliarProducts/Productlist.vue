<template>
  <div class="row center-xs">
    <router-link
      v-for="singleblock in singleblockdata"
      :to="localizedRoute(singleblock.atag)"
      :key="singleblock.hthree"
      class="brand-detail col-lg-3 col-md-3 col-sm-3 col-xs-6 pb15"
    >
      <div class="brand-detail-inner">
        <img :src="singleblock.img" />
        <div class="heading">
          <h3>{{ singleblock.hthree }}</h3>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock";
import { getThumbnailPath } from "@vue-storefront/core/helpers";
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
       // console.log('Sb -class ', mbclasses);
        var i = 0;
        [].forEach.call(mbclasses, mbclass => {
          var singleBlock = new Array(3);
         // console.log("single block ",singleBlock," \n ",mbclass);
          singleBlock["img"] = mbclass.querySelector("img") ?mbclass.querySelector("img").attributes["src"] : ' ';
           singleBlock["atag"] = mbclass.querySelector("a") ? mbclass.querySelector("a").attributes["href"] : '/';
           singleBlock["hthree"] = mbclass.querySelector("h3")?mbclass.querySelector("h3").rawText : 'bed';
          // singleBlock["atag"] = mbclass.querySelector("a").attributes["href"];
          // singleBlock["hthree"] = mbclass.querySelector("h3").rawText;
          // console.log("\n\n\n\n\n\n1122single block ",singleBlock," \n ",);
          // console.log(" \n mbclass ",mbclass);
          // console.log(" \n mbclass.querySelector('img')  ",mbclass.querySelector("img"));
          // console.log(" \n mbclass.querySelector('a') ",mbclass.querySelector("a"));
          // console.log(" \n mbclass.querySelector('h3') ",mbclass.querySelector("h3"));
          // console.log(" \n mbclass.querySelector('img').attributes['src']",mbclass.querySelector("img").attributes["src"]);
         homeSmallBlocks[i] = singleBlock;
          i++;
        });
      }
      return homeSmallBlocks;
    }
  }
};
</script>
