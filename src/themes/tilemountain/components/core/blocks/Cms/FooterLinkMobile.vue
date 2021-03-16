<template>
  <span>
    <div class="tabset">
      <div class="tab-panels">
        <section id="luxurious-experiences" class="tab-panel">
          <input type="checkbox" id="chck1" />
          <label class="tab-label" for="chck1">Customer Info 111</label>
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

        <section id="impeccable-quality" class="tab-panel tab-panel">
          <input type="checkbox" id="chck2" />
          <label class="tab-label" for="chck2">Popular Tiles</label>
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

        <section id="huge-variety" class="tab-panel">
          <input type="checkbox" id="chck3" />
          <label class="tab-label" for="chck3">Company</label>
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
    </div>
  </span>
</template>

<script>
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock"
import { getThumbnailPath } from "@vue-storefront/core/helpers"
export default {
  name: "footerlinkmobile",
  props: {
    classname: {
      type: String,
      required: false,
    },
  },
  mixins: [cmsBlock],
  computed: {
    singleblockdata1() {
      var homeSmallBlocks1 = []
      if (this.data) {
        var mbclasses = this.parsedContent.querySelectorAll(".footerlink1 li")
        var i = 0;
        [].forEach.call(mbclasses, (mbclass) => {
          var singleBlock1 = new Array(0)
          singleBlock1["atag"] = mbclass.querySelector("a").attributes["href"]
          singleBlock1["hthree"] = mbclass.querySelector("a").rawText
          if (
            mbclass.querySelector("a").attributes["target"] &&
            mbclass.querySelector("a").attributes["target"] === "_blank"
          ) {
            singleBlock1["target"] = mbclass.querySelector("a").attributes[
              "target"
            ]
          } else {
            singleBlock1["target"] = ""
          }
          // singleBlock['ul'] = mbclass.querySelector('ul').rawText;
          homeSmallBlocks1[i] = singleBlock1
          i++
        })
      }
      return homeSmallBlocks1
    },
    singleblockdata2() {
      var homeSmallBlocks2 = []
      if (this.data) {
        var mbclasses = this.parsedContent.querySelectorAll(".footerlink2 li")
        var i = 0;
        [].forEach.call(mbclasses, (mbclass) => {
          var singleBlock2 = new Array(0)
          singleBlock2["atag"] = mbclass.querySelector("a").attributes["href"]
          singleBlock2["hthree"] = mbclass.querySelector("a").rawText
          if (
            mbclass.querySelector("a").attributes["target"] &&
            mbclass.querySelector("a").attributes["target"] == "_blank"
          ) {
            singleBlock2["target"] = mbclass.querySelector("a").attributes[
              "target"
            ]
          } else {
            singleBlock2["target"] = ""
          }
          // singleBlock['ul'] = mbclass.querySelector('ul').rawText;
          homeSmallBlocks2[i] = singleBlock2
          i++
        })
      }
      return homeSmallBlocks2
    },
    singleblockdata3() {
      var homeSmallBlocks3 = []
      if (this.data) {
        var mbclasses = this.parsedContent.querySelectorAll(".footerlink3 li")

        var i = 0;
        [].forEach.call(mbclasses, (mbclass) => {
          var singleBlock3 = new Array(0)
          singleBlock3["atag"] = mbclass.querySelector("a").attributes["href"]
          singleBlock3["hthree"] = mbclass.querySelector("a").rawText
          if (
            mbclass.querySelector("a").attributes["target"] &&
            mbclass.querySelector("a").attributes["target"] === "_blank"
          ) {
            singleBlock3["target"] = mbclass.querySelector("a").attributes[
              "target"
            ]
          } else {
            singleBlock3["target"] = ""
          }

          // singleBlock['ul'] = mbclass.querySelector('ul').rawText;
          homeSmallBlocks3[i] = singleBlock3
          i++
        })
      }
      return homeSmallBlocks3
    },
  },
};
</script>
<style lang="scss" scoped>
@font-face {
  font-family: 'Oblik';
  src: url('/assets/fonts/Oblik_Bold.otf');
}
input {
  position: absolute;
  opacity: 0;
  z-index: -1;
}
// Layout
.row {
  display: flex;
  .col {
    flex: 1;
    &:last-child {
      margin-left: 1em;
    }
  }
}
/* Accordion styles */
.tabs {
  // border-radius: 8px;
  overflow: hidden;
  margin-left: -22px;
  margin-right: -6px;
}
.tab {
  margin-bottom: -13px;
  width: 100%;
  color: white;
  overflow: hidden;
  &-label {
    font-family: 'oblik';
    display: flex;
    content: '\f068';
    justify-content: space-between;
    padding: 1em;
    background: #606060;
    font-size: 3vw;

    cursor: pointer;
    /* Icon */
    // &:hover {
    //   background: darken($midnight, 10%);
    // }
    &::after {
      font-family: FontAwesome;
      content: '\f067';
      width: 1em;
      height: 1em;
      text-align: center;
      transition: all 0.35s;
      font-size: 9px;
      margin-top: 10px;
      border: none;
    }
  }
  &-content {
    max-height: 0;
    padding: 0 1em;
    color: #2c3e50;
    background: white;
    transition: all 0.35s;
  }
  &-close {
    display: flex;
    justify-content: flex-end;
    padding: 1em;
    font-size: 0.75em;
    // background: $midnight;
    cursor: pointer;
    &:hover {
      background: darken(#2c3e50, 10%);
    }
  }
}

// :checked
input:checked {
  + .tab-label {
    background: #606060;
    color: #ffffff;;
    &::after {
      font-family: FontAwesome;
      content: '\f068';
    }
  }
  ~ .tab-content {
    max-height: 100vh;
    padding-top: 1px;
    background-color: #f2f2f2;
    font-family: 'Arial';
  }
}
.tabset > input[type='radio'] {
  position: absolute;
  left: -200vw;
}
// .tabset .tab-panel {
//   display: none;
// }
.tabset > input:first-child:checked ~ .tab-panels > .tab-panel:first-child,
.tabset > input:nth-child(3):checked ~ .tab-panels > .tab-panel:nth-child(2),
.tabset > input:nth-child(5):checked ~ .tab-panels > .tab-panel:nth-child(3),
.tabset > input:nth-child(7):checked ~ .tab-panels > .tab-panel:nth-child(4),
.tabset > input:nth-child(9):checked ~ .tab-panels > .tab-panel:nth-child(5),
.tabset > input:nth-child(11):checked ~ .tab-panels > .tab-panel:nth-child(6) {
  display: block;
}
.tabset > label {
  position: relative;
  display: inline-block;
  padding: 15px 15px 25px;
  border: 1px solid transparent;
  border-bottom: 0;
  cursor: pointer;
  color: white;
}
.tabset > label::after {
  content: '';
  position: absolute;
  left: 0px;
  bottom: 18px;
  width: 100%;
  height: 2px;
}
.tabset > label:hover,
.tabset > input:focus + label {
  color: white;
}
.tabset > label:hover::after,
.tabset > input:focus + label::after,
.tabset > input:checked + label::after {
  border-bottom: 2px solid #00998c;
}
.tabset > input:checked + label {
  border-color: #fff;
  border-bottom: 2px solid #fff;
  margin-bottom: -1px;
}
.tab-panel {
  padding: 15px 0;
}
*,
*:before,
*:after {
  box-sizing: border-box;
}
.tabset {
  max-width: 65em;
  text-align: center;
}
p {
  text-align: center;
  color: #54575b;
}

@media (min-width: 768px) {
  .tab-panels input,
  .tab-panels .tab-label {
    display: none;
  }
}
@media (max-width: 500px) {
  .tab-label {
    // font-size: 18px !important;
  }
}

@media (max-width: 767px) {
  #tab1,
  #tab2,
  #tab3,
  .desktop {
    display: none !important;
  }
  section {
    background-color: #606060;
  }
  input {
    position: absolute;
    opacity: 0;
    z-index: -1;
  }
  .tab-label {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    color: #ffffff;
    font-size: 2.933vw;
  }
  .tab-label::after {
    font-family: FontAwesome;
    content: '\f067';
    width: 1em;
    height: 1em;
    text-align: center;
    -webkit-transition: all 0.35s;
    transition: all 0.35s;
    font-size: 9px;
    margin-top: 5px;
  }
  .content {
    text-align: left;
    line-height: 20px;
    font-size: 14px;
    -webkit-transition: all 0.35s;
    transition: all 0.35s;
    display: none;
    padding-left: 20px;
    margin-top: 10px;
  }

  input:checked + .tab-label::after {
    font-family: FontAwesome;
    content: '\f068';
    color: #ffffff;
  }
  input:checked ~ .content {
    display: block;
  }
  input:checked ~ .socialicons {
    text-align: center;
  }
  .tabset .tab-panel {
    display: block !important;
    width: 100%;
    float: left;
    margin-left: -8px;
    padding: 1px 0px;
    border-bottom: 2px solid white;
  }
  .content ul li a {
    font-size: 2.667vw;
  }
}

ul {
  padding: 0;
  margin-top: 15px !important;
  list-style: none;
}
ul li {
  padding-bottom: 13px;
  margin: 10px 0 !important;
  font-family: 'Arial';
}
a {
  color: White;
  font-size: 17px;
}
@media screen and (min-width: 320px) and (max-width: 480px) {
  .tab-label {
    font-size: 3vw;
    color:#ffffff;
  }
  .content ul li {
    padding-bottom: 0;
  }
  .content ul li a {
    font-size: 3vw;
  }
}
</style>
