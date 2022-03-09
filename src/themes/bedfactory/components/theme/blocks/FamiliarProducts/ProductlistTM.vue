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
          <h3>
            {{ singleblock.hthree
            }}<sup>{{ singleblock.rockBottomSuperScript }}</sup>
          </h3>
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
        [].forEach.call(mbclasses, mbclass => {
          var singleBlock = new Array(3);
          singleBlock["img"] = mbclass.querySelector("img").attributes["src"];
          if (mbclass.querySelector("a")) {
            singleBlock["atag"] = mbclass.querySelector("a").innerHTML;
          } else {
            singleBlock["atag"] = "";
          }
          singleBlock["hthree"] = mbclass.querySelector("h2").rawText;
          singleBlock["btntxt"] = mbclass.querySelector("button").rawText;
          let checkForStylishClass = mbclass.classNames.includes(
            "stylishSaving"
          );
          let checkForStylishText = mbclass
            .querySelector("h2")
            .outerHTML.includes("<sup>");
          if (checkForStylishText) {
            singleBlock["rockBottomSuperScript"] = "2";
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
    }
  }
};
</script>

<style scoped lang="scss">
.brand-detail {
  z-index: 0;
}
.brand-detail:hover .main_product_btn {
  display: block;
}

.main_product_btn {
  width: 70%;
  text-transform: uppercase;
  font-family: Arial;
  font-weight: 700;
  margin: 0 auto !important;
  background: transparent;
  display: none;
  color: #071a44;
  font-size: 14px;
  margin-top: 10px;
  border-radius: 3px;
  padding: 15px;
  border: 2px solid #071a44;
}
@media (min-width: 767px) {
  .brand-detail {
    position: relative;
    padding: 0 10px 24px 10px;

    .brand-detail-inner {
      position: relative;
      padding-bottom: 109%;

      img {
        width: 100%;
        margin-bottom: -4px;
        position: absolute;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;
        object-fit: contain;
      }

      .overlay {
        position: absolute;
        bottom: 0;
        background: rgba(207, 206, 202, 0.7);
        font-family: oblik;
        color: #f1f1f1;
        width: 100%;
        color: #29275b;
        font-size: 20px;
        padding: 4px 0 10px 0;
        text-align: center;
        font-weight: 700;

        h3 {
          font-family: oblik;
          color: #071a44;
          text-align: center;
        }
        sup {
          font-size: 15px;
          margin: 1px;
        }
      }
    }
  }

  a.underline:after,
  a:not(.no-underline):hover:after {
    background-color: transparent !important;
  }
}

@media (min-width: 767px) and (max-width: 1280px) {
  .brand-detail {
    .brand-detail-inner {
      img {
        height: auto;
      }
    }
  }
}

@media (max-width: 767px) {
  .brand-detail:hover .main_product_btn {
    display: none;
  }
  .brand-detail {
    position: relative;
    margin-bottom: 10px;
    margin-top: 2px;

    .brand-detail-inner {
      position: relative;
      padding-bottom: 109%;

      img {
        width: 100%;
        height: auto;
        margin-bottom: -4px;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;
        object-fit: contain;
        position: absolute;
      }

      .overlay {
        position: absolute;
        bottom: 0;
        background: rgba(207, 206, 202, 0.7);
        font-family: oblik;
        color: #f1f1f1;
        width: 100%;
        color: #29275b;
        font-size: 20px;
        padding: 4px 0 10px 0;
        text-align: center;
        font-weight: 700;

        h3 {
          font-size: 24px;
          color: #29275b;
          text-align: center;
          font-family: oblik;
        }
      }
    }
  }

  a.underline:after,
  a:not(.no-underline):hover:after {
    background-color: transparent !important;
  }
}

@media (min-width: 1200px) and (max-width: 1225px) {
  .brand-detail .brand-detail-inner:hover .heading {
    width: 100% !important;
    padding: 80px 0;
  }
}

@media (min-width: 991px) and (max-width: 1200px) {
  .brand-detail .brand-detail-inner:hover .heading {
    width: 100% !important;
    padding: 102px 0;
  }
}

@media (min-width: 767px) and (max-width: 990px) {
  .brand-detail .brand-detail-inner:hover .heading {
    width: 100% !important;
    padding: 74px 0;
  }
}

@media (max-width: 575px) {
  .brand-detail {
    position: relative;
    margin-bottom: 10px;
    margin-top: 4px;
    padding: 0 14px 0 14px;
  }
}

@media (min-width: 992px) {
  .brand-detail .brand-detail-inner .overlay h3 {
    font-size: 24px;
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .brand-detail .brand-detail-inner .overlay h3 {
    font-size: 19px;
  }
}
</style>
