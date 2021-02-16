<template>
  <div class="col-lg-12 col-md-12 block-content">
    <!-- <div class="container block-bottom" v-html="parsedContent"> -->
       <cms-block class="container block-bottom" :id="ids"/>
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
import cmsBlock from 'vsf-cms-block-mixin/components/cmsBlock';
import CmsBlock from "theme/components/core/blocks/Cms/Block"
export default {
  components:{
    CmsBlock
  },
  props: {
    ids: {
      type: Number,
      default: null,
      required: false
    },
    identifiers: {
      type: String,
      default: null,
      required: false
    }
  },
  mixins: [cmsBlock],
  computed: {
    singleblockdata() {
      var homeSmallBlocks = [];
      if (this.data) {
        var mbclasses = this.parsedContent.querySelectorAll(
          '.mb_category_description'
        );
        // console.log('Sb -class ', mbclasses);
        var i = 0;
        [].forEach.call(mbclasses, mbclass => {
          var singleBlock = new Array(3);
          singleBlock['atag'] = mbclass.querySelector('a')
            ? mbclass.querySelector('a').rawText
            : '';
          singleBlock['httwo'] = mbclass.querySelector('h2').rawText;
          singleBlock['ptext'] = mbclass.querySelector('p').rawText;
          singleBlock['strongtext'] = mbclass.querySelector('strong').rawText;
          homeSmallBlocks[i] = singleBlock;
          i++;
        });
      }
      return homeSmallBlocks;
    }
  }
};
</script>
<style >
.block-bottom{
  border-style: groove !important;
   color: #54575b;
   padding: 50px;
   border: 1px #AAA9A3 solid;
}
.block-bottom h2 {
  text-align: center !important ;
  font-size: 36px;
  color: #54575b;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  margin: 0;
}
</style>