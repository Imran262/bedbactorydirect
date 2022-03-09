<template>
  <div class="brands-inner">
    <router-link
      v-for="singleblock in singleblockdata"
      :to="localizedRoute(singleblock.atag)"
      :key="singleblock.id"
    >
      <ul>
        <li>
          <!-- <a :href="localizedRoute(singleblock.atag)"> -->
          <img :src="singleblock.img" :alt="singleblock.atag" />
          <!-- </a> -->
        </li>
      </ul>
    </router-link>
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
        var mbclasses = this.parsedContent.querySelectorAll(".mb_home_img");
        // console.log('Sb -class ', mbclasses);
        var i = 0;
        [].forEach.call(mbclasses, mbclass => {
          var singleBlock = new Array(3);

          singleBlock["atag"] = mbclass.querySelector("a")
            ? mbclass.querySelector("a").attributes["href"]
              ? mbclass.querySelector("a").attributes["href"]
              : " "
            : " ";
          singleBlock["img"] = mbclass.querySelector("img")
            ? mbclass.querySelector("img").attributes["src"]
              ? mbclass.querySelector("img").attributes["src"]
              : " "
            : " ";
          singleBlock["alt"] = mbclass.querySelector("img")
            ? mbclass.querySelector("img").attributes["alt"]
              ? mbclass.querySelector("img").attributes["alt"]
              : " "
            : " ";
          homeSmallBlocks[i] = singleBlock;
          i++;
        });
      }
      return homeSmallBlocks;
    }
  }
};
</script>
