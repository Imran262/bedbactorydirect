<template>
  <span class="col-md-9">
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
        <h2>{{ footerHeadings['footerlink1'] || 'About' }}</h2>
        <ul>
          <li v-for="(singleblock, index) in singleblockdata1" :key="index">
          <a v-if="singleblock.target === '_blank'" :href="singleblock.atag">{{ singleblock.hthree }}</a>
                <router-link v-else
                             :to="localizedRoute(singleblock.atag)"
                             :key="singleblock.atag"
                >{{ singleblock.hthree }}</router-link>
          </li>
        </ul>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
        <h2>{{ footerHeadings['footerlink2'] || 'Ordering' }}</h2>
        <ul>
          <li v-for="(singleblock, index) in singleblockdata2" :key="index">
            <a v-if="singleblock.target === '_blank'" :href="singleblock.atag">{{ singleblock.hthree }}</a>
                <router-link v-else
                             :to="localizedRoute(singleblock.atag)"
                             :key="singleblock.atag"
                >{{ singleblock.hthree }}</router-link>
          </li>
        </ul>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
        <h2>{{ footerHeadings['footerlink3'] || 'T&Zzz's' }}</h2>
        <ul>
          <li v-for="(singleblock, index) in singleblockdata3" :key="index">
            <a v-if="singleblock.target === '_blank'" :href="singleblock.atag">{{ singleblock.hthree }}</a>
                <router-link v-else
                             :to="localizedRoute(singleblock.atag)"
                             :key="singleblock.atag"
                >{{ singleblock.hthree }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </span>
</template>

<script>
import cmsBlock from 'vsf-cms-block-mixin/components/cmsBlock';
import { getThumbnailPath } from '@vue-storefront/core/helpers';

export default {
  name: 'footerlink',
  props: {
    classname: {
      type: String,
      required: false
    }
  },
  mixins: [cmsBlock],
  computed: {
    singleblockdata1 () {
      var homeSmallBlocks1 = [];
      if (this.data) {
        var mbclasses = this.parsedContent.querySelectorAll('.footerlink1 li');
        var i = 0;
        [].forEach.call(mbclasses, (mbclass) => {
          var singleBlock1 = new Array(0);
          singleBlock1['atag'] = mbclass.querySelector('a').attributes['href'];
          singleBlock1['hthree'] = mbclass.querySelector('a').rawText;
          // singleBlock['ul'] = mbclass.querySelector('ul').rawText;
          if (mbclass.querySelector('a').attributes['target'] && mbclass.querySelector('a').attributes['target'] === '_blank') {
            singleBlock1['target'] = mbclass.querySelector('a').attributes['target'];
          } else {
            singleBlock1['target'] = '';
          }
          homeSmallBlocks1[i] = singleBlock1;
          i++;
        });
      }
      return homeSmallBlocks1;
    },
    singleblockdata2 () {
      var homeSmallBlocks2 = [];
      if (this.data) {
        var mbclasses = this.parsedContent.querySelectorAll('.footerlink2 li');
        var i = 0;
        [].forEach.call(mbclasses, (mbclass) => {
          var singleBlock2 = new Array(0);
          singleBlock2['atag'] = mbclass.querySelector('a').attributes['href'];
          singleBlock2['hthree'] = mbclass.querySelector('a').rawText;
          // singleBlock['ul'] = mbclass.querySelector('ul').rawText;
          if (mbclass.querySelector('a').attributes['target'] && mbclass.querySelector('a').attributes['target'] === '_blank') {
            singleBlock2['target'] = mbclass.querySelector('a').attributes['target'];
          } else {
            singleBlock2['target'] = '';
          }
          homeSmallBlocks2[i] = singleBlock2;
          i++;
        });
      }
      return homeSmallBlocks2;
    },
    singleblockdata3 () {
      var homeSmallBlocks3 = [];
      if (this.data) {
        var mbclasses = this.parsedContent.querySelectorAll('.footerlink3 li');
        var i = 0;
        [].forEach.call(mbclasses, (mbclass) => {
          var singleBlock3 = new Array(0);
          singleBlock3['atag'] = mbclass.querySelector('a').attributes['href'];
          singleBlock3['hthree'] = mbclass.querySelector('a').rawText;
          // singleBlock['ul'] = mbclass.querySelector('ul').rawText;
          if (mbclass.querySelector('a').attributes['target'] && mbclass.querySelector('a').attributes['target'] === '_blank') {
            singleBlock3['target'] = mbclass.querySelector('a').attributes['target'];
          } else {
            singleBlock3['target'] = '';
          }
          homeSmallBlocks3[i] = singleBlock3;
          i++;
        });
      }
      return homeSmallBlocks3;
    },
    footerHeadings () {
      let footerHeads = {};
      if (this.data) {
        let fHeads = this.parsedContent.querySelectorAll('.footerHeadings');
        fHeads.forEach((element, index) => {
          footerHeads[element.id] = element.innerHTML;
        })
      }
      return footerHeads;
    }
  }
};
</script>
<style lang="scss" scoped>
@font-face {
  font-family: "Oblik";
  src: url("/assets/fonts/Oblik_Bold.otf");
  font-display: block;
}

ul {
  padding: 0;
  margin-top: 15px !important;
  list-style: none;
}

ul li {
  padding-bottom: 13px;
  margin: 10px 0 !important;
  font-family: "Arial";
}

a {
  color: White;
  font-size: 17px;
}

/* ul li a {
  color: White !important;
  font-size: 18px;
  font-family: "Arial";
} */
ul li a.underline:after,
ul li a:not(.no-underline):hover:after {
  background-color: transparent;
}

h2 {
  font-family: "Oblik";
  color: #ffff;
  font-size: 20px;
  font-weight: bold;
  padding-top: 43px;
  padding-bottom: 14px;
}
</style>
