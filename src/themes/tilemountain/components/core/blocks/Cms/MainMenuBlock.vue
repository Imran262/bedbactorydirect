<template>
  <div>
    <ul class="Menu">
      <template v-for="(singleblock) in singleblockdata">
        <li :class="singleblock.listItemClass" :key="singleblock.atag">
          <router-link
            :to="localizedRoute(singleblock.atag)"
            :key="singleblock.atag"
            v-html="singleblock.hthree"
          />
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock";
import { getThumbnailPath } from "@vue-storefront/core/helpers";
export default {
  name: "CustomerServiceBlock",
  mixins: [cmsBlock],
  computed: {
    singleblockdata() {
      var homeSmallBlocks = [];
      if (this.data) {
        var menuItems = this.parsedContent.querySelectorAll(".Menu li");
        var i = 0;
        [].forEach.call(menuItems, (menuItem) => {
          var singleBlock = new Array(0);
          singleBlock["atag"] = menuItem.querySelector("a").attributes["href"];
          singleBlock["hthree"] = menuItem.querySelector("a").rawText;
          singleBlock["listItemClass"] = menuItem.attributes["class"]
            ? menuItem.attributes["class"]
            : "";
          // singleBlock['ul'] = menuItem.querySelector('ul').rawText;
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
@font-face {
  font-family: "Oblik";
  src: url("/assets/fonts/Oblik_Bold.otf");
  font-display: block;
}
@font-face {
  font-family: "Oblik-regular";
  src: url("/assets/fonts/Oblik-Regular.otf");
  font-display: block;
}
nav ul {
  padding: 0;
  margin: 0;
  position: relative;
  display: flex;
  list-style-type: none;
}
li {
  flex: 1 1 auto;
}
ul li a {
  text-align: center;
  padding: 13px 0px;
  display: block;
  line-height: 1;
  margin: 10px 0 10px 0;
  font-size: 15px;
  font-family: "Oblik";
  font-weight: bold;
  color: #ffffff;
  /* text-transform: uppercase; */
}
.clearance {
  background-color: #24adee;
}
a.underline:after,
a:not(.no-underline):hover:after {
  content: none;
}
@media (min-width: 992px) and (max-width: 1199px) {
  ul li a {
    font-size: 13px;
  }
}
@media (min-width: 767px) and (max-width: 991px) {
  .clearance {
    display: none;
  }
  .style {
    display: none;
  }
  ul li a {
    font-size: 13px;
  }
}
ul li a:not(.no-underline):hover:after {
  content: none;
}
</style>
