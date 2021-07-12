<template>
 <div class="social">
        <a v-for="(linkblock, index) in socialLinks" :key="index"
           title="Social Page link"
           class="fb"
           :href="linkblock.links"
            target="_blank"
            rel="noopener"
            v-html="linkblock.socialicons"
         >
        </a>
        </div>
</template>

<script>
import cmsBlock from 'vsf-cms-block-mixin/components/cmsBlock';

export default {
  name: 'sociallinks',
  mixins: [cmsBlock],
  computed: {
    socialLinks () {
           var homeSmallBlocks = [];
           let sociallinks = ''
           let icons = ''
      if (this.data) {
        var mbclasses = this.parsedContent.querySelectorAll(
          ".sb-white-background"
        );
        var i = 0;
        mbclasses.forEach((mbclass, index) => {
       if(mbclass.querySelectorAll('a')){
        let Socialhref = mbclass.querySelectorAll('a')
        Socialhref.forEach((anchor, index) => {
          sociallinks  = anchor.attributes['href'];
          icons = anchor.innerHTML;

          let linkobject = {
          links: sociallinks,
          socialicons: icons
        }
        homeSmallBlocks.push(linkobject)
        })
      }
        });
      }
      return homeSmallBlocks;
  }
  }
};
</script>
<style lang="scss">
@font-face {
  font-family: "Oblik";
  src: url("/assets/fonts/Oblik_Bold.otf");
  font-display: block;
}
.circle {
  height: 64px;
  width: 64px;
  background: #9d9d9d;
  border-radius: 50%;
  display: inline-block;
  margin-right: 17px;
  margin-bottom: 25px;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.fa {
  color: #434243;
  font-size: 40px !important;
}
 .social .instagram:hover {
  background: #e1306c;
}
 .social .linkedin:hover {
  background: #0077b5;
 }
.social .pinterest:hover {
  background: #bd081c;
}
.social .facebook:hover {
  background: #3b5999;
}
 .social .play:hover {
  background: #cd201f;
 }
 .social .youtube:hover {
  background: #cd201f;
 }
 .social .twitter:hover {
  background: #55acee;
}
 .social .instagram:hover .fa,
 .social .linkedin:hover .fa,
 .social .pinterest:hover .fa,
 .social .facebook:hover .fa,
 .social .youtube:hover .fa,
 .social .twitter:hover .fa {
  color: #fff;
}
.fa-pinterest-p{
  display: block !important;
}
.fa {
    color: #434243;
    font-size: 30px !important;
}
@media only screen and (min-width: 320px) and (max-width: 500px){
.circle {
    height: 25px;
    width: 25px;
    padding: 3px;
    margin-left: 2px;
    margin-right: 5px !important;
}
.fa{
  font-size: 16px !important;
}
}
@media only screen and (min-width: 499px) and (max-width: 768px){
.circle {
    height: 44px;
    width: 44px;
    padding: 3px;
    margin-left: 2px;
    margin-right: 5px !important;
}
.fa{
  font-size: 22px !important;
}
}
input#input_370 {
    border: 2px solid #24224d  !important;
    text-align: center  !important;
    height: 45px !important;
    width: 45px !important;
    border-radius: 7px;
}
</style>
<style>
.youtube{
  padding-left: 5px;
}
</style>
