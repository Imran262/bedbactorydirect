<template>
  <div class="footerTabsBox">
    <section
      id="luxurious-experiences"
      class="tab-panel"
      @click.prevent="selectTab('luxurious-experiences')"
    >
      <span class="mainHeading"
        >{{ footerHeadings["footerlink1"] || "About" }}
      </span>
      <div class="content">
        <ul>
          <li v-for="(singleblock, index) in singleblockdata1" :key="index">
            <a
              v-if="singleblock.target === '_blank'"
              :href="singleblock.atag"
              >{{ singleblock.hthree }}</a
            >
            <router-link
              v-else
              :to="localizedRoute(singleblock.atag)"
              :key="singleblock.atag"
              >{{ singleblock.hthree }}</router-link
            >
          </li>
        </ul>
      </div>
    </section>

    <section
      id="impeccable-quality"
      class="tab-panel"
      @click.prevent="selectTab('impeccable-quality')"
    >
      <span class="mainHeading">{{
        footerHeadings["footerlink2"] || "Ordering"
      }}</span>
      <div class="content">
        <ul>
          <li v-for="(singleblock, index) in singleblockdata2" :key="index">
            <a
              v-if="singleblock.target === '_blank'"
              :href="singleblock.atag"
              >{{ singleblock.hthree }}</a
            >
            <router-link
              v-else
              :to="localizedRoute(singleblock.atag)"
              :key="singleblock.atag"
              >{{ singleblock.hthree }}</router-link
            >
          </li>
        </ul>
      </div>
    </section>

    <section
      id="huge-variety"
      class="tab-panel"
      @click.prevent="selectTab('huge-variety')"
    >
      <span class="mainHeading">{{
        footerHeadings["footerlink3"] || "T&Zzz's"
      }}</span>
      <div class="content">
        <ul>
          <li v-for="(singleblock, index) in singleblockdata3" :key="index">
            <a
              v-if="singleblock.target === '_blank'"
              :href="singleblock.atag"
              >{{ singleblock.hthree }}</a
            >
            <router-link
              v-else
              :to="localizedRoute(singleblock.atag)"
              :key="singleblock.atag"
              >{{ singleblock.hthree }}</router-link
            >
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock";
import { getThumbnailPath } from "@vue-storefront/core/helpers";
export default {
  name: "footerlinkmobile",
  props: {
    classname: {
      type: String,
      required: false
    }
  },
  mixins: [cmsBlock],
  computed: {
    singleblockdata1() {
      var homeSmallBlocks1 = [];
      if (this.data) {
        var mbclasses = this.parsedContent.querySelectorAll(".footerlink1 li");
        var i = 0;
        [].forEach.call(mbclasses, mbclass => {
          var singleBlock1 = new Array(0);
          singleBlock1["atag"] = mbclass.querySelector("a").attributes["href"];
          singleBlock1["hthree"] = mbclass.querySelector("a").rawText;
          if (
            mbclass.querySelector("a").attributes["target"] &&
            mbclass.querySelector("a").attributes["target"] === "_blank"
          ) {
            singleBlock1["target"] = mbclass.querySelector("a").attributes[
              "target"
            ];
          } else {
            singleBlock1["target"] = "";
          }
          // singleBlock['ul'] = mbclass.querySelector('ul').rawText;
          homeSmallBlocks1[i] = singleBlock1;
          i++;
        });
      }
      return homeSmallBlocks1;
    },
    singleblockdata2() {
      var homeSmallBlocks2 = [];
      if (this.data) {
        var mbclasses = this.parsedContent.querySelectorAll(".footerlink2 li");
        var i = 0;
        [].forEach.call(mbclasses, mbclass => {
          var singleBlock2 = new Array(0);
          singleBlock2["atag"] = mbclass.querySelector("a").attributes["href"];
          singleBlock2["hthree"] = mbclass.querySelector("a").rawText;
          if (
            mbclass.querySelector("a").attributes["target"] &&
            mbclass.querySelector("a").attributes["target"] == "_blank"
          ) {
            singleBlock2["target"] = mbclass.querySelector("a").attributes[
              "target"
            ];
          } else {
            singleBlock2["target"] = "";
          }
          // singleBlock['ul'] = mbclass.querySelector('ul').rawText;
          homeSmallBlocks2[i] = singleBlock2;
          i++;
        });
      }
      return homeSmallBlocks2;
    },
    singleblockdata3() {
      var homeSmallBlocks3 = [];
      if (this.data) {
        var mbclasses = this.parsedContent.querySelectorAll(".footerlink3 li");

        var i = 0;
        [].forEach.call(mbclasses, mbclass => {
          var singleBlock3 = new Array(0);
          singleBlock3["atag"] = mbclass.querySelector("a").attributes["href"];
          singleBlock3["hthree"] = mbclass.querySelector("a").rawText;
          if (
            mbclass.querySelector("a").attributes["target"] &&
            mbclass.querySelector("a").attributes["target"] === "_blank"
          ) {
            singleBlock3["target"] = mbclass.querySelector("a").attributes[
              "target"
            ];
          } else {
            singleBlock3["target"] = "";
          }

          // singleBlock['ul'] = mbclass.querySelector('ul').rawText;
          homeSmallBlocks3[i] = singleBlock3;
          i++;
        });
      }
      return homeSmallBlocks3;
    },
    footerHeadings() {
      let footerHeads = {};
      if (this.data) {
        let fHeads = this.parsedContent.querySelectorAll(".footerHeadings");
        fHeads.forEach((element, index) => {
          footerHeads[element.id] = element.innerHTML;
        });
      }
      return footerHeads;
    }
  },
  methods: {
    selectTab(id) {
      let activeEle = document.getElementById(id);
      if (this.isHidden(activeEle.querySelector(".content"))) {
        const elements = document.getElementsByClassName("tab-panel");
        for (var i = 0; i < elements.length; i++) {
          if (elements[i]) {
            elements[i].querySelector(".content").style.display = "none";
            elements[i].querySelector(".mainHeading").classList.remove("open");
          }
        }
        setTimeout(function() {
          activeEle.querySelector(".content").style.display = "block";
          activeEle.querySelector(".mainHeading").classList.add("open");
        }, 100);
      } else {
        activeEle.querySelector(".content").style.display = "none";
        activeEle.querySelector(".mainHeading").classList.remove("open");
      }
    },
    isHidden(el) {
      var style = window.getComputedStyle(el);
      return style.display === "none";
    }
  }
};
</script>
<style lang="scss" scoped>
@font-face {
  font-family: "Oblik";
  src: url("/assets/fonts/Oblik_Bold.otf");
}

@media (max-width: 767px) {
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  .footerTabsBox > .tab-panel:last-child {
    border-bottom: unset !important;
  }
  .tab-panel {
    border-bottom: 0.5px solid #040e2c;
    padding: 9px 0;

    .mainHeading {
      font-family: "oblik";
      display: flex;
      justify-content: space-between;
      font-size: 1rem;
      cursor: pointer;
      color: #fff;

      &::after {
        font-family: FontAwesome;
        content: "\f067";
        width: 1em;
        height: 1em;
        text-align: center;
        transition: all 0.35s;
        font-size: 9px;
        margin-top: 10px;
        border: none;
      }
    }
    .mainHeading.open {
      &::after {
        font-family: FontAwesome;
        content: "\f068";
        width: 1em;
        height: 1em;
        text-align: center;
        transition: all 0.35s;
        font-size: 9px;
        margin-top: 10px;
        border: none;
      }
    }
  }
  section#luxurious-experiences {
    margin-top: 25px;
  }
  .content {
    -webkit-transition: all 0.35s;
    transition: all 0.35s;
    display: none;
  }
  .content ul li a {
    font-size: 0.875rem;
    text-decoration: underline;
    color: #fff;
  }
}

ul {
  padding: 0;
  margin-top: 15px !important;
  list-style: none;
}
ul li {
  padding-bottom: 13px;
}
</style>
