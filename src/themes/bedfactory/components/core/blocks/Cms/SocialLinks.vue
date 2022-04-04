<template>
  <div class="social">
    <a
      class="fb"
      href="https://www.facebook.com/bedfactorydirect"
      target="_blank"
    >
      <div class="circle facebook">
        <!-- <i class="fa fa-facebook" /> -->
        <img src="/assets/facebook-icon.svg" alt="" />
      </div>
    </a>
    <a class="fb" href="https://twitter.com/bedfactoryuk" target="_blank">
      <div class="circle twitter">
        <!-- <i class="fa fa-twitter" /> -->
        <img src="/assets/twitter-icon.svg" alt="" />
      </div>
    </a>
    <a class="fb" href="https://www.pinterest.co.uk/bfdbeds" target="_blank">
      <div class="circle pinterest">
        <!-- <i class="fa fa-pinterest-p" /> -->
        <img src="/assets/pinterest-icon.svg" alt="" />
      </div>
    </a>
    <a
      class="fb"
      href="https://www.youtube.com/channel/UCCSWNWPxZ2PXm_24oe5rpkg"
      target="_blank"
    >
      <div class="circle youtube">
        <!-- <i class="fa fa-play" aria-hidden="true" /> -->
        <img src="/assets/youtube-icon.svg" alt="" />
      </div>
    </a>
    <!-- <a class="fb" href="https://uk.linkedin.com/in/bed-factory-direct-47520a116" target="_blank">
            <div class="circle linkedin">
                <i class="fa fa-linkedin" />
            </div>
        </a> -->
    <a
      class="fb"
      href="https://www.instagram.com/bedfactorydirect"
      target="_blank"
    >
      <div class="circle instagram">
        <!-- <i class="fa fa-instagram" /> -->
        <img src="/assets/instagram-icon.svg" alt="" />
      </div>
    </a>
    <!-- <a v-for="(linkblock, index) in socialLinks" :key="index"
           title="Social Page link"
           class="fb"
           :href="linkblock.links"
            target="_blank"
            rel="noopener"
            v-html="linkblock.socialicons"
         >
        </a> -->
  </div>
</template>

<script>
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock";

export default {
  name: "sociallinks",
  mixins: [cmsBlock],
  computed: {
    socialLinks() {
      var homeSmallBlocks = [];
      let sociallinks = "";
      let icons = "";
      let vari = "";
      if (this.data) {
        var mbclasses = this.parsedContent.querySelectorAll(
          ".sb-white-background"
        );
        var i = 0;
        mbclasses.forEach((mbclass, index) => {
          if (mbclass.querySelectorAll("a")) {
            let Socialhref = mbclass.querySelectorAll("a");
            Socialhref.forEach((anchor, index) => {
              sociallinks = anchor.attributes["href"];
              icons = anchor.innerHTML;

              let linkobject = {
                links: sociallinks,
                socialicons: icons
              };
              homeSmallBlocks.push(linkobject);
            });
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
  height: 30px;
  width: 30px;
  // background: #fff;
  border-radius: 5px;
  margin-right: 0.2rem;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.social {
  text-align: right;
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
@media screen and (max-width: 767px) {
  .social {
    text-align: center !important;
    padding: 1rem;
  }
}
</style>
