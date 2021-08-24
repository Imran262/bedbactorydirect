<template>
  <div class="overflow">
    <div class="sb-category-banner grid12-12">
      <div class="container sb-category-page-container">
        <div class="sb-category-tile-text grid12-5">
          <div class="sb-left-text">
            <h1>Tiling Trade Tips</h1>
            <p>
              Tiling needn’t be trialling - just watch our collection of tiling
              trade tips videos for all manner of handy tips and easy to follow
              instructions for some of the most common tiling tasks. We’ve got
              everything covered with expert advice from TV handyman and former
              Big Brother winner Craig Phillips on hand to answer the top ten
              questions we get asked most about tiles and tiling.
            </p>
            <p>
              In the unlikely event that one of the UK’s leading DIY and home
              improvement experts can’t help you, or if you’re just looking for
              some step-by-step instructions that be followed on the job, then
              our Top Down Tiling Tips videos show you how to carry out
              essential tasks required during most tiling projects in a nice,
              bite-size manner.
            </p>
          </div>
        </div>
        <div class="container sb-category-banner-img grid12-7">
          <div class="sb-left-shape-img">
            <img src="/assets/left-line-img.png" alt="left line" />
          </div>
          <img
            class="banner-img-1"
            src="https://www.bedfactorydirect.co.uk//skin/frontend/base/default/youtube/images/video-banner-img.1524601844.jpg"
            alt="banner_1"
          />
          <img
            class="banner-img-2"
            style="display: none"
            src="https://www.bedfactorydirect.co.uk//skin/frontend/base/default/youtube/images/video-banner-img2.1524601844.jpg"
            alt="banner_2"
          />
          <div class="sb-right-shape-img">
            <img src="/assets/right-line-img.png" alt="right_line" />
          </div>
          <div class="watch_video_here_img">
            <a
              target="blank"
              href="https://www.youtube.com/channel/UCCkGBpvAdflgqVvfV8zZYMw"
            >
              <img
                src="https://www.bedfactorydirect.co.uk//skin/frontend/base/default/youtube/images/watch_video_here_img.1524601845.png"
                alt="videoskin"
            /></a>
          </div>
        </div>
        <div class="sb-category-tile-text_2 grid12-5">
          <div class="sb-left-text_2">
            <h2>Tiling Trade Tips</h2>
            <p>
              Tiling needn’t be trialling - just watch our collection of tiling
              trade tips videos for all manner of handy tips and easy to follow
              instructions for some of the most common tiling tasks. We’ve got
              everything covered with expert advice from TV handyman and former
              Big Brother winner Craig Phillips on hand to answer the top ten
              questions we get asked most about tiles and tiling.
            </p>
            <p>
              In the unlikely event that one of the UK’s leading DIY and home
              improvement experts can’t help you, or if you’re just looking for
              some step-by-step instructions that be followed on the job, then
              our Top Down Tiling Tips videos show you how to carry out
              essential tasks required during most tiling projects in a nice,
              bite-size manner.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="video_gallery_main container">
      <div class="video_gallery_header grid12-12">
        <div class="grid12-2 yt_logo_img">
          <img
            class="imgtohide"
            src="https://www.bedfactorydirect.co.uk//skin/frontend/base/default/youtube/images/youtube-logo.svg"
            alt="youtube logo"
          />

          <div
            class="grid12-3 youtube_subcribe_grid_div2"
            style="display: none"
          >
            <div class="youtube_subcribe_div2">
              <a
                class="youtube_subcribe_text2"
                target="blank"
                href="//www.youtube.com/channel/UCCkGBpvAdflgqVvfV8zZYMw?sub_confirmation=1"
                ><span>SUBSCRIBE HERE</span></a
              >
            </div>
          </div>
        </div>
        <div class="grid12-7 header_main">
          <h2>Watch our handy DIY tiling trade tip videos below</h2>
          <p>
            Don’t miss out on future tips and tricks, make sure you subscribe to
            our channel...
          </p>
          <img
            src="https://www.bedfactorydirect.co.uk//skin/frontend/base/default/youtube/images/blue-arrow.svg"
            alt="youtube blue arrow"
          />
        </div>

        <div class="grid12-3 youtube_subcribe_grid_div">
          <div class="imgtoshow" style="width: 40%; display: none">
            <img
              src="https://www.bedfactorydirect.co.uk//skin/frontend/base/default/youtube/images/youtube-logo.svg"
              alt="youtube logo"
            />
          </div>
          <div class="youtube_subcribe_div">
            <a
              class="youtube_subcribe_text"
              target="blank"
              href="//www.youtube.com/channel/UCCkGBpvAdflgqVvfV8zZYMw?sub_confirmation=1"
              ><span>SUBSCRIBE HERE</span></a
            >
          </div>
        </div>
      </div>
    </div>
    <div class="container" v-if="getin">
      <div
        v-for="(videoData, index) in datas.items"
        :key="index"
        class="grid12-3 video_gallery_div"
      >
        <div
          @click="
            showpopup(
              videoData.snippet.resourceId.videoId,
              videoData.snippet.title
            )
          "
        >
          <a>
            <img
              :src="videoData.snippet.thumbnails.maxres.url"
              alt="youtube thumbnail"
          /></a>
          <div class="video_gallery_yt_play_bt_div">
            <a href="javascript:void(0);">
              <img
                class="yt_play_bt_img"
                src="//www.bedfactorydirect.co.uk//skin/frontend/base/default/youtube/images/youtube-play-icon.svg"
                alt="youtube icon"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
    <section
      style="text-align: center; margin: 0 auto"
      class="mainpop"
      :id="channelIdData"
      @click="closePopup(channelIdData)"
    >
      <div
        @click="closePopup(channelIdData)"
        id="vidgallery_popup_show"
        class="overlay"
      ></div>
      <div class="vidgallery_popup" id="vidgallery_popup">
        <iframe
          width="560"
          height="315"
          :src="'https://www.youtube.com/embed/' + channelIdData"
          frameborder="0"
          class="iframe"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <div class="vidgallery_popup_header">
          <h2 id="vidgallery_imagesname">
            {{ title }}
          </h2>
          <a
            @click="closePopup(channelIdData)"
            href="javascript:void(0);"
            class="close"
            >×</a
          >
        </div>
      </div>
    </section>
    <div itemscope itemtype="http://schema.org/Organization">
      <meta itemprop="name" content="Tile Mountain" />
      <meta itemprop="url" content="https://www.bedfactorydirect.co.uk/" />
      <meta
        v-for="socialLink in socialLinksSchema"
        :key="socialLink"
        itemprop="sameAs"
        :content="socialLink"
      />
    </div>
    <div itemscope itemtype="http://schema.org/WebSite">
      <meta itemprop="name" content="Tile Mountain" />
      <meta itemprop="url" content="https://www.bedfactorydirect.co.uk/" />
    </div>
  </div>
</template>
<script>
import config from 'config'

const axios = require('axios')
export default {
  name: 'videogallery',
  data: function () {
    return {
      videos: [],
      datas: {},
      show: false,
      channelIdData: 'AoooeG8dbQA',
      title: '',
      getin: false,
    }
  },
  mounted () {
    this.getName()
  },
  computed: {
    socialLinksSchema () {
      return config.socialUrlsForSchema ? config.socialUrlsForSchema : ''
    }
  },
  methods: {
    showpopup (a, b) {
      this.channelIdData = a
      this.title = b
      setTimeout(() => {
        let p = document.getElementById(this.channelIdData)
        p.style.display = 'block'
        p.style.opacity = '1'
        p.style.visibility = 'visible'
        let scrollOff = document.getElementsByTagName('body')[0]
        scrollOff.style.overflow = 'hidden'
        var scrollPos =
          window.scrollY ||
          window.scrollTop ||
          document.getElementsByTagName('html')[0].scrollTop
        var scrollPosx =
          window.scrollX ||
          window.scrollLeft ||
          document.getElementsByTagName('html')[0].scrollLeft
        console.log('position', scrollPos)
        let d = document.querySelector('body .vidgallery_popup')
        if (window.innerWidth > 958 && window.innerWidth < 1200) {
          d.style.left = '21%'
          d.style.top = scrollPos + 200 + 'px'
        } else if (window.innerWidth < 958 && window.innerWidth > 767) {
          d.style.left = '14%'
          d.style.top = scrollPos + 200 + 'px'
        } else if (window.innerWidth > 1200) {
          d.style.left = '656px'
          d.style.top = scrollPos + 200 + 'px'
        } else {
          d.style.left = '2%'
          d.style.top = scrollPos + 200 + 'px'
        }
      }, 1000)
    },
    closePopup (i) {
      let t = document.getElementById(i)
      t.style.display = 'none'
      t.style.opacity = '0'
      t.style.visibility = 'hidden'
      let scrollOff = document.getElementsByTagName('body')[0]
      scrollOff.style.overflow = 'scroll'
    },
    async getName () {
      const { data } = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${config.playlist.id}&key=${config.playlist.key}&fields=items&part=snippet&maxResults=15`
      )
      // console.log("this is data" ,data)
      if (data.hasOwnProperty('items')) {
        this.datas = data
        if (this.datas.items[0].snippet.title) {
          this.getin = true
        }
      }
    }
  },
  metaInfo () {
    return {
      title: '',
      titleTemplate: 'Video Gallery',
      meta: [
        {
          property: 'og:url',
          content: (config.ogtagsBaseUrl ? config.ogtagsBaseUrl : '') + '/videogallery'
        },
        {
          property: 'og:title',
          content: ''
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:description',
          content: 'Looking for some help on your tiling project? Our video gallery is home to a comprehensive range of "how to" guides featuring TV handyman Craig Phillips!'
        },
        {
          vmid: 'description',
          name: 'description',
          content: 'Looking for some help on your tiling project? Our video gallery is home to a comprehensive range of "how to" guides featuring TV handyman Craig Phillips!'
        }
      ],
      link: [
        {
          rel: 'canonical',
          href: '/videogallery'
        }
      ]
    }
  }
};
</script>
<style scoped>
@font-face {
  font-family: 'Oblik';
  src: url('/assets/fonts/Oblik_Bold.otf');
}

.video_gallery_div_main {
  float: left;
  width: 100%;
  margin-left: 0;
}

.video_gallery_div {
  background-repeat: no-repeat;
  float: left;
  margin-top: 32px;
  width: 30.66%;
  overflow: hidden;
  position: relative;
  margin-left: 0;
}

/* img {
  border: 0;
  vertical-align: top;
  max-width: 100%;
} */
.video_gallery_yt_play_bt_div {
  position: absolute;
  left: 40%;
  top: 30%;
}

.overflow {
  overflow: hidden;
  margin-bottom: 30px;
}

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  transition: opacity 500ms;
  visibility: visible;
  opacity: 1;
  z-index: 9999;
}

.vidgallery_popup {
  margin: 5px auto;
  padding: 10px;
  background: #fff;
  border-radius: 5px;
  position: absolute;
  transition: all 0s ease-in-out;
  z-index: 111;
  top: 15%;
  z-index: 99999;
  opacity: 0;
  display: block;
  opacity: 1;
  visibility: visible;
}

a:hover {
  text-decoration: none;
  background: transparent;
  text-decoration-color: transparent;
}

a.underline:after,
a:not(.no-underline):hover:after {
  background-color: transparent !important;
}

.mainpop {
  display: none;
}

.sb-category-banner {
  background: #231b61 none repeat scroll 0 0;
  float: left !important;
  margin: 0 !important;
  width: 100% !important;
}

.sb-category-tile-text.grid12-5 {
  width: 41%;
}

.sb-left-text {
  /* margin-bottom: 10px; */
  margin: 30px auto 0;
  overflow: visible;
  height: auto;
}
.sb-left-text > h1 {
  color: #ffffff;
  font-size: 28px;
  font-family: Arial;
  font-weight: bold;
  margin-bottom: 10px;
  margin: 9px 0px 0px 0px;
}

.sb-left-text > p {
  padding-bottom: 10px;
  color: #ffffff;
  font-size: 13px;
  font-family: Arial;
  /* white-space: pre-line; */
  text-align: justify;
}

.sb-left-text > p:last-child {
  color: #ffffff !important;
  font-family: Arial;
  font-size: 13px;
  padding-bottom: 0;
  /* white-space: pre-line; */
}

.sb-category-banner-img.grid12-7 {
  height: 100%;
  width: 49%;
  float: right;
}

.sb-left-shape-img {
  height: 100%;
  left: 0;
  position: absolute !important;
  top: 0;
  width: 17%;
}

.banner-image-1 {
  max-width: 100%;
  vertical-align: top;
}

.sb-category-banner-img.grid12-7 > img {
  vertical-align: bottom;
  /* height: 100%; */
}

.sb-right-shape-img {
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  width: 20.69%;
}

@media screen and (max-width: 1199px) {
  .sb-right-shape-img {
    width: 20.5%;
  }
}

.watch_video_here_img {
  position: absolute !important;
  right: -10px;
  top: 10px;
  width: 18% !important;
}

.sb-category-tile-text_2.grid12-5 {
  display: none;
  background-color: #fff;
}

* {
  /* margin: 0; */
  padding: 0;
}

.header_main p {
  margin: 0;
}

@media (max-width: 1313px) and (min-width: 1231px) {
  .sb-left-text {
    line-height: 16px;
    margin: 25px auto 0;
  }
}

@media (max-width: 1313px) and (min-width: 1231px) {
  .sb-left-shape-img {
    height: 100%;
  }

  .sb-right-shape-img {
    height: 100%;
    right: 0px;
    top: 0;
  }
}

.header_main {
  text-align: left;
}

@media (max-width: 1024px) and (min-width: 768px) {
  .sb-category-tile-text.grid12-5 {
    margin-left: 0px;
  }

  .youtube_subcribe_text2 > span {
    font-size: 14px !important;
  }

  .header_main {
    width: 96% !important;
  }

  .youtube_subcribe_text2 > span {
    font-size: 14px !important;
  }
  .sb-left-text > h1 {
    font-size: 18px;
    margin-bottom: 8px;
    margin: 0px 0px 8px 0px;
  }

  .grid12-7.header_main > h2 {
    width: 95%;
  }

  .sb-left-text {
    width: 100%;
  }
  .sb-left-text > h1 {
    font-size: 18px;
  }

  .yt_logo_img {
    text-align: left;
  }

  .grid12-7.header_main > h2 {
    width: 95%;
  }

  .grid12-7.header_main > p {
    width: 95%;
  }
}

@media (max-width: 1024px) and (min-width: 901px) {
  .sb-left-text {
    line-height: 12px;
    margin: 7px auto 0;
  }

  .grid12-7.header_main {
    margin-top: 26px;
    width: 75% !important;
  }

  .grid12-3.youtube_subcribe_grid_div {
    display: none;
  }

  .sb-left-text > p {
    font-size: 11px;
  }

  .sb-left-text > p {
    padding-bottom: 0px;
  }

  .sb-left-text > p:last-child {
    font-size: 11px;
  }

  .sb-category-banner-img {
    width: 56% !important;
  }

  .sb-left-shape-img {
    height: 100%;
    left: -1px;
  }

  .sb-right-shape-img {
    height: 100%;
    right: -1px;
    top: 0;
  }
}

@media (max-width: 479px) and (min-width: 320px) {
  .container {
    max-width: none !important;
    width: 96% !important;
  }

  .vidgallery_popup {
    max-width: 100%;
    width: 90%;
  }

  .sb-category-tile-text.grid12-5 {
    display: none;
  }

  .sb-left-text {
    width: 90%;
  }
  .sb-left-text > h1 {
    padding-left: 5px;
  }

  .sb-left-text > p {
    padding-left: 5px;
  }

  .sb-category-banner-img.grid12-7 {
    height: 100%;
  }

  .sb-left-shape-img {
    display: none;
  }

  .sb-category-banner-img.grid12-7 > img {
    height: auto;
  }

  .sb-right-shape-img {
    display: none;
    right: 0;
  }

  .watch_video_here_img {
    right: 0px;
    display: none;
  }

  .sb-category-tile-text_2.grid12-5 {
    display: block;
    background-color: #fff;
  }
  .sb-left-text_2 > h2 {
    background-color: #231b61;
    color: #fff;
    font-family: 'Arial';
    font-size: 24px;
    font-weight: bold;
    line-height: 28px;
    margin-bottom: 5px;
    padding-bottom: 10px;
    padding-top: 5px;
    padding-left: 5px;
  }

  .sb-left-text_2 > p {
    padding-left: 10px;
    padding-right: 10px;
    font-family: Arial;
  }
}

.video_gallery_header {
  width: 96%;
  text-align: center;
  background-color: #eeeeee;
  margin-top: 25px;
  padding-top: 10px;
  margin-left: 0;
}

.yt_logo_img {
  text-align: right;
}

.grid12-2 {
  width: 14.66%;
}

/* .grid12-3 {
  width: 23%;
} */
.youtube_subcribe_text2 > span {
  color: #fff;
  font-family: 'Oblik-Regular';
  font-size: 16px !important;
  font-weight: bold;
  text-align: center;
}

.grid12-7 {
  width: 56.33%;
}

.grid12-7.header_main > h2 {
  float: left;
  font-family: 'Oblik';
  font-size: 26px;
  width: 95%;
  margin-bottom: 0;
  margin-top: 36px;
  color: rgb(88, 89, 91);
}

.grid12-7.header_main > p {
  float: left;
  font-family: 'Oblik-Regular';
  font-size: 17px;
  width: 95%;
  color: rgb(88, 89, 91);
}

.grid12-7.header_main > img {
  position: absolute;
}

.youtube_subcribe_div {
  background: #de504e;
  background: -moz-linear-gradient(
    top,
    #de504e 0%,
    #db4b4a 15%,
    #dd4947 17%,
    #da4541 30%,
    #db4342 37%,
    #d93e3a 48%,
    #d5302e 85%,
    #d62d2a 89%,
    #d52b2b 91%,
    #ce2a28 93%,
    #c82d28 96%,
    #c22924 98%,
    #c32522 100%
  );
  background: -webkit-linear-gradient(
    top,
    #de504e 0%,
    #db4b4a 15%,
    #dd4947 17%,
    #da4541 30%,
    #db4342 37%,
    #d93e3a 48%,
    #d5302e 85%,
    #d62d2a 89%,
    #d52b2b 91%,
    #ce2a28 93%,
    #c82d28 96%,
    #c22924 98%,
    #c32522 100%
  );
  background: linear-gradient(
    to bottom,
    #de504e 0%,
    #db4b4a 15%,
    #dd4947 17%,
    #da4541 30%,
    #db4342 37%,
    #d93e3a 48%,
    #d5302e 85%,
    #d62d2a 89%,
    #d52b2b 91%,
    #ce2a28 93%,
    #c82d28 96%,
    #c22924 98%,
    #c32522 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#de504e', endColorstr='#c32522', GradientType=0);
  margin: 12px 15px 0 auto;
  float: right;
  width: 150px;
  padding: 9px;
}

.mainpop .vidgallery_popup {
  margin: 5px auto;
  padding: 10px;
  background: #fff;
  border-radius: 5px;
  position: absolute;
  -webkit-transition: all 0s ease-in-out;
  -o-transition: all 0s ease-in-out;
  transition: all 0s ease-in-out;
  z-index: 111;
  z-index: 99999;
  opacity: 0;
  display: block;
  opacity: 1;
  visibility: visible;
}

@media screen and (max-width: 767px) {
  .imgtohide {
    display: none;
  }

  .imgtoshow {
    display: block !important;
  }

  .youtube_subcribe_div {
    width: 40% !important;
    height: 20px;
  }

  .youtube_subcribe_grid_div {
    display: inline-flex !important;
    padding-bottom: 24px;
  }

  .youtube_subcribe_text > span {
    font-size: 14px !important;
  }
}

.vidgallery_popup .close {
  transition: all 200ms;
  font-size: 40px;
  font-weight: bold;
  text-decoration: none;
  color: #666;
  float: right;
  max-width: 10%;
}
.vidgallery_popup_header > h2 {
  float: left;
  text-align: left;
  max-width: 95%;
  font-size: 12px;
  font-weight: bold;
  max-width: 80%;
  color: #666;
  margin-bottom: 0;
  font-family: 'Arial';
}

.grid12-5 {
  width: 39.67%;
}

.grid12-1,
.grid12-2,
.grid12-3,
.grid12-4,
.grid12-5,
.grid12-6,
.grid12-7,
.grid12-8,
.grid12-9,
.grid12-10,
.grid12-11,
.grid12-12,
.grid-full,
.grid-col2-sidebar,
.grid-col2-main {
  position: relative;
  display: inline;
  float: left;
  margin-left: 1%;
  margin-right: 1%;
}

.sb-category-banner-img {
  position: relative;
}

.video_gallery_div img {
  border: 0;
  vertical-align: top;
  max-width: 100%;
}

@media (max-width: 900px) and (min-width: 768px) {
  .sb-category-banner-img {
    margin: 0;
    width: 50% !important;
  }

  .sb-category-tile-text {
    width: 49% !important;
  }

  .grid12-2.yt_logo_img {
    width: 18%;
    text-align: center;
  }

  .grid12-7.header_main {
    margin-top: 26px;
    width: 75% !important;
  }

  .youtube_subcribe_grid_div2 {
    width: 100%;
    display: block !important;
  }

  .youtube_subcribe_div2 {
    background: #de504e;
    background: -moz-linear-gradient(
      top,
      #de504e 0%,
      #db4b4a 15%,
      #dd4947 17%,
      #da4541 30%,
      #db4342 37%,
      #d93e3a 48%,
      #d5302e 85%,
      #d62d2a 89%,
      #d52b2b 91%,
      #ce2a28 93%,
      #c82d28 96%,
      #c22924 98%,
      #c32522 100%
    );
    background: -webkit-linear-gradient(
      top,
      #de504e 0%,
      #db4b4a 15%,
      #dd4947 17%,
      #da4541 30%,
      #db4342 37%,
      #d93e3a 48%,
      #d5302e 85%,
      #d62d2a 89%,
      #d52b2b 91%,
      #ce2a28 93%,
      #c82d28 96%,
      #c22924 98%,
      #c32522 100%
    );
    background: linear-gradient(
      to bottom,
      #de504e 0%,
      #db4b4a 15%,
      #dd4947 17%,
      #da4541 30%,
      #db4342 37%,
      #d93e3a 48%,
      #d5302e 85%,
      #d62d2a 89%,
      #d52b2b 91%,
      #ce2a28 93%,
      #c82d28 96%,
      #c22924 98%,
      #c32522 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#de504e', endColorstr='#c32522', GradientType=0);
    margin: 12px auto;
    padding: 4% 1%;
    text-align: center;
    width: 100%;
  }
}

.sb-left-shape-img > img {
  height: 100%;
}

.sb-left-shape-img > img {
  /* height: 100%; */
  left: 0;
  position: absolute;
}

@media (max-width: 767px) and (min-width: 320px) {
  .banner-img-2 {
    display: block !important;
  }

  .sb-category-page-container {
    width: 100% !important;
  }

  .yt_logo_img {
    margin-bottom: 10px;
    margin-left: 2%;
    text-align: center;
    width: 40% !important;
  }

  .header_main {
    display: none;
  }

  .sb-left-shape-img {
    display: none;
  }

  .sb-category-banner-img.grid12-7 {
    height: 100%;
  }

  .sb-category-tile-text.grid12-5 {
    display: none;
  }

  .sb-left-text {
    width: 90%;
  }

  .sb-right-shape-img {
    display: none;
  }

  .sb-category-tile-text.grid12-5 {
    display: none;
  }
  .sb-left-text_2 > h2 {
    background-color: #231b61;
    color: #fff;
    font-family: Arial;
    font-size: 24px;
    line-height: 28px;
    margin-bottom: 5px;
    padding-bottom: 10px;
    padding-top: 5px;
    padding-left: 5px;
    margin: 0;
  }

  .sb-left-text_2 > p {
    padding-left: 10px;
    padding-right: 10px;
    font-family: Arial;
  }

  .watch_video_here_img {
    display: none;
    right: 0px;
  }

  .banner-img-1 {
    display: none;
  }

  .banner-img-2 {
    width: 100%;
    display: block !important;
  }

  .sb-category-tile-text_2.grid12-5 {
    display: block;
    background-color: #fff;
  }
}

@media only screen and (max-width: 767px) {
  .grid12-1,
  .grid12-2,
  .grid12-3,
  .grid12-4,
  .grid12-5,
  .grid12-6,
  .grid12-7,
  .grid12-8,
  .grid12-9,
  .grid12-10,
  .grid12-11,
  .grid12-12,
  .grid-full,
  .grid-col2-sidebar,
  .grid-col2-main,
  .grid-col3-sidebar,
  .grid-col3-main {
    width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}

@media (max-width: 900px) and (min-width: 850px) {
  .grid12-7.header_main > h2 {
    font-size: 19px;
  }
}

@media (max-width: 950px) and (min-width: 900px) {
  .grid12-7.header_main > h2 {
    font-size: 16px;
  }

  .grid12-7.header_main > p {
    font-size: 16px;
  }
}

img {
  border: 0;
  vertical-align: top;
  max-width: 100%;
}

@media (max-width: 1199px) {
  .sb-left-text > p {
    margin: 0px !important;
  }
}

@media (max-width: 1024px) and (min-width: 901px) {
  .sb-left-text > p {
    padding-bottom: 5px;
  }

  .grid12-3.youtube_subcribe_grid_div {
    display: none;
  }

  .sb-left-text > p {
    font-size: 11px;
  }

  .sb-left-text > p:last-child {
    font-size: 11px;
  }

  .youtube_subcribe_grid_div2 {
    display: block !important;
    width: 100%;
  }

  .grid12-7.header_main > p {
    width: 95%;
  }

  .youtube_subcribe_div2 {
    background: #de504e;
    background: -moz-linear-gradient(
      top,
      #de504e 0%,
      #db4b4a 15%,
      #dd4947 17%,
      #da4541 30%,
      #db4342 37%,
      #d93e3a 48%,
      #d5302e 85%,
      #d62d2a 89%,
      #d52b2b 91%,
      #ce2a28 93%,
      #c82d28 96%,
      #c22924 98%,
      #c32522 100%
    );
    background: -webkit-linear-gradient(
      top,
      #de504e 0%,
      #db4b4a 15%,
      #dd4947 17%,
      #da4541 30%,
      #db4342 37%,
      #d93e3a 48%,
      #d5302e 85%,
      #d62d2a 89%,
      #d52b2b 91%,
      #ce2a28 93%,
      #c82d28 96%,
      #c22924 98%,
      #c32522 100%
    );
    background: linear-gradient(
      to bottom,
      #de504e 0%,
      #db4b4a 15%,
      #dd4947 17%,
      #da4541 30%,
      #db4342 37%,
      #d93e3a 48%,
      #d5302e 85%,
      #d62d2a 89%,
      #d52b2b 91%,
      #ce2a28 93%,
      #c82d28 96%,
      #c22924 98%,
      #c32522 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#de504e', endColorstr='#c32522', GradientType=0);
    margin: 12px auto;
    padding: 4% 1%;
    text-align: center;
    width: 100%;
  }
}

@media (max-width: 1230px) and (min-width: 1025px) {
  .sb-left-text > p {
    padding-bottom: 5px;
  }
  .sb-left-text > h1 {
    font-size: 20px;
  }
}

/* @media screen and (max-width: 1199px;){

} */
@media (max-width: 1024px) and (min-width: 901px) {
  .sb-left-text > p {
    font-size: 11px;
  }

  .sb-left-text > p:last-child {
    font-size: 11px;
  }
}

@media (max-width: 900px) and (min-width: 768px) {
  .sb-left-text > p:last-child {
    font-size: 10px;
  }

  .sb-left-text > p {
    font-size: 10px;
  }

  .grid12-3.youtube_subcribe_grid_div {
    display: none;
  }
}

@media screen and (max-width: 1199px) {
  .sb-left-text {
    margin-top: 4px;
  }
}

@media (max-width: 479px) and (min-width: 320px) {
  .grid12-3.youtube_subcribe_grid_div {
    margin-left: 10%;
  }
}

.youtube_subcribe_text > span {
  color: #fff;
  font-family: 'Oblik-Regular';
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

@media (max-width: 810px) and (min-width: 768px) {
  .grid12-7.header_main > h2 {
    font-size: 20px;
    margin: 0;
  }

  .grid12-7.header_main > p {
    font-size: 14px;
  }
}

@media (max-width: 850px) and (min-width: 810px) {
  .grid12-7.header_main > h2 {
    font-size: 22px;
  }

  .grid12-7.header_main > p {
    font-size: 15px;
  }
}

@media (max-width: 1024px) and (min-width: 950px) {
  .grid12-7.header_main > p {
    font-size: 16px;
  }

  .grid12-7.header_main > h2 {
    font-size: 26px;
  }
}

@media screen and (max-width: 768px) and (min-width: 480px) {
  .vidgallery_popup_header {
    width: 450px;
  }

  .iframe {
    width: 450px !important;
    height: 300px !important;
  }

  .youtube_subcribe_div {
    width: 80%;
    float: none;
  }
}

@media screen and (max-width: 479px) and (min-width: 320px) {
  .iframe {
    width: 290px !important;
    height: 250px !important;
  }
}

@media (max-width: 479px) and (min-width: 320px) {
  .sb-left-text_2 > p {
    padding-left: 10px;
    padding-right: 10px;
    font-family: Arial;
    font-size: 12px;
    line-height: 19px;
  }
}

@media (max-width: 900px) and (min-width: 850px) {
  .grid12-7.header_main > h2 {
    font-size: 22px;
  }

  .grid12-7.header_main > p {
    font-size: 15px;
  }
}

@media (max-width: 1150px) and (min-width: 1100px) {
  .grid12-7.header_main > h2 {
    font-size: 22px;
  }

  .grid12-7.header_main > p {
    font-size: 15px;
  }
}

.grid12-3 .youtube_subcribe_grid_div {
  width: 23%;
}

@media screen and (min-width: 1440px) {
  .video_gallery_header {
    padding-bottom: 30px;
    width: 96%;
  }

  .youtube_subcribe_grid_div {
    float: right;
  }
}
</style>
