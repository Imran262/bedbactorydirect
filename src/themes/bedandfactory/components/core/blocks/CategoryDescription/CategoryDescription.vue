<template>
  <div class="col-lg-12 col-md-12 block-content">
    <div class="container" v-html="parsedContent">
      <!-- <div class="block-content-inner" v-for="singleblock in singleblockdata">
        <h2>{{ singleblock.httwo }}</h2>
        <p>
          {{ singleblock.ptext }}
          <router-link
            v-if="singleblock && singleblock.atag"
            :to="localizedRoute(singleblock.atag)"
          >{{ singleblock.atag }}</router-link>
        </p>
        <p>
          <strong>{{ singleblock.strongtext }}</strong>
          {{ singleblock.ptext }}
          <router-link
            v-if="singleblock && singleblock.atag"
            :to="localizedRoute(singleblock.atag)"
          >{{ singleblock.atag }}</router-link>
        </p>
      </div> -->
    </div>
  </div>
</template>
<script>
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock";
export default {
  mixins: [cmsBlock],
  computed: {
    singleblockdata() {
      var homeSmallBlocks = [];
      if (this.data) {
        var mbclasses = this.parsedContent.querySelectorAll(
          ".mb_category_description"
        );
        // console.log('Sb -class ', mbclasses);
        var i = 0;
        [].forEach.call(mbclasses, mbclass => {
          var singleBlock = new Array(3);
          singleBlock["atag"] = mbclass.querySelector("a")
            ? mbclass.querySelector("a").rawText
            : "";
          singleBlock["httwo"] = mbclass.querySelector("h2").rawText;
          singleBlock["ptext"] = mbclass.querySelector("p").rawText;
          singleBlock["strongtext"] = mbclass.querySelector("strong").rawText;
          homeSmallBlocks[i] = singleBlock;
          i++;
        });
      }
      return homeSmallBlocks;
    }
  }
};
</script>