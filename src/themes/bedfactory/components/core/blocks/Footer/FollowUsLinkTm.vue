<template>
  <ul>
    <li v-for="(singleblock) in footersingleblock">
      <a :href="singleblock.atag" :key="singleblock.hthree" target="_blank">
        {{ singleblock.hthree }}
        <img :src="singleblock.img">
      </a>
    </li>
  </ul>
</template>

<script>
import cmsBlock from 'vsf-cms-block-mixin/components/cmsBlock';
export default {
  name: 'FooterLink',
  mixins: [cmsBlock],
  computed: {
    footersingleblock() {
      var homeSmallBlocks = [];
      var mbclasses = this.parsedContent.querySelectorAll(
        '.mb_home_small_img li'
      );
      // console.log('Sb -class ', mbclasses);
      var i = 0;
      [].forEach.call(mbclasses, mbclass => {
        var singleBlock = new Array(0);
        singleBlock['img'] = mbclass.querySelector('img').attributes['src'];
        singleBlock['atag'] = mbclass.querySelector('a').attributes['href'];
        singleBlock['hthree'] = mbclass.querySelector('a').rawText;

        homeSmallBlocks[i] = singleBlock;
        i++;
      });

      return homeSmallBlocks;
    }
  }
};
</script>
