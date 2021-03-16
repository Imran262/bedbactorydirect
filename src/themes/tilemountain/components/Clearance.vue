<template>
  <div>
    <div v-html="content"></div>
    <div ref="clearanceDataReplacement" id="clearanceDataReplacement">
      <div class="row center-xs">
        <router-link
          v-for="(singleblock , index) in sliderData"
          :to="localizedRoute(singleblock.imageLink)"
          :key="index"
          class="brand-detail col-lg-4 col-md-4 col-sm-12"
        >
          <div class="brand-detail-inner">
            <img :src="singleblock.imagesStore" /> 
            <div class="overlay"> 
              <h3>{{ singleblock.headingtext }}</h3>
              <button class="main_product_btn">{{ singleblock.buttontext }}</button>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import NoSSR from "vue-no-ssr";
export default {
  data() {
    return {
      sliderData: []
    };
  },
  props: {
    content: {
      type: String,
      required: true
    }
  },
  mounted() {                                                                                                                                                           
    this.clearanceData();
    this.replacer(document.getElementById("clearanceDataReplacement"));
  },
  methods: {
    clearanceData() {
          let storeAllImages = [];
      let contentSlide = document.getElementById('oldcontent');
      if (contentSlide) {
        let saveAllImages = contentSlide.querySelectorAll('.item');
        saveAllImages.forEach((images, index) => {
          let imagePath = images.querySelector('img').getAttribute('src');
          let routeLink = images.querySelector('a').getAttribute('href');
          let routerlinktext = images.querySelector('a').innerHTML;
          console.log("links" , routeLink , routerlinktext)
          let heading = images.querySelector('h5 > a').innerHTML;
          let button = images.querySelector('.hm-btn-explore').innerHTML;
        //   let price = images.querySelector('#price > p').innerHTML;
          let imagesObject = {
            imagesStore: imagePath.toString(),
            imageLink: routeLink.toString(),
            linktext: routerlinktext.toString(),
            headingtext: heading.toString(),
            buttontext: button.toString()
            // P_Price: price
          }
          storeAllImages.push(imagesObject);
        });
        this.sliderData = storeAllImages;
        return storeAllImages;
      }
    },
    replacer(updatedContent) {
      let oldContent = document.getElementById("oldcontent");
      if(oldContent){
      oldContent.parentElement.replaceChild(updatedContent, oldContent);
      }
    }
  }
};
</script>
<style scoped lang="scss"> 
.brand-detail {
    z-index: 0;
}.brand-detail {
    position: relative;
    padding: 0 10px 24px 10px;
}
.brand-detail .brand-detail-inner {
    position: relative;
    padding-bottom: 109%;
    @media screen and (max-width: 575px) {
        padding-bottom: 0%;
    }
}
.brand-detail .brand-detail-inner img {
    width: 100%;
    margin-bottom: -4px;
    @media screen and (min-width: 575px) {
    position: absolute;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    -o-object-fit: contain;
    object-fit: contain;
    }
}
.brand-detail .brand-detail-inner .overlay {
    position: absolute;
    bottom: 0;
    background: rgba(79, 152, 208, 0.6);
    font-family: oblik;
    color: #f1f1f1;
    width: 100%;
    color: #ffff;
    font-size: 20px;
    padding: 4px 0 10px 0;
    text-align: center;
    font-weight: 700;
}
.brand-detail .brand-detail-inner .overlay h3 {
    font-family: oblik;
    font-size: 24px;
    background: rgba(79, 152, 208, 0);
    text-align: center;
}
.main_product_btn {
    width: 70%;
    text-transform: uppercase;
    font-family: Arial;
    font-weight: 700;
    margin: 0 auto;
    background: 0 0;
    display: none;
    color: #fff;
    font-size: 15.46px;
    margin-top: 10px;
    border-radius: 3px;
    padding: 15px;
    border: 2px solid #fff;
}

.brand-detail:hover .main_product_btn {
  display: block
}
// @media (max-width: 767px){
// .brand-detail {
//     position: relative;
//     margin-bottom: 10px;
//     margin-top: 2px;
// }
// .brand-detail .brand-detail-inner img {
//     width: 100%;
//     height: auto;
//     margin-bottom: -4px;
//     -webkit-transform: translate(-50%, -50%);
//     -ms-transform: translate(-50%, -50%);
//     transform: translate(-50%, -50%);
//     top: 50%;
//     left: 50%;
//     -o-object-fit: contain;
//     object-fit: contain;
//     position: absolute;
// }
// .brand-detail .brand-detail-inner .overlay {
//     position: absolute;
//     bottom: 0;
//     background: rgba(207,206,202,0.7);
//     font-family: oblik;
//     color: #f1f1f1;
//     width: 100%;
//     color: #29275b;
//     font-size: 20px;
//     padding: 4px 0 10px 0;
//     text-align: center;
//     font-weight: 700;
// }
// .brand-detail .brand-detail-inner .overlay h3 {
//     font-size: 24px;
//     color: #29275b;
//     text-align: center;
//     font-family: oblik;
// }

// }
</style>
<style>
@media screen and (min-width: 768px){
  .desktopClearance{
     display: block;
  }
  .mobileClearance{
    display: none;
  }
}
@media screen and (max-width: 767px) {
    .desktopClearance{
     display: none;
  }
  .mobileClearance{
    display: block;
    width: 100%;
    padding-bottom: 10px;
  }
}
</style>
