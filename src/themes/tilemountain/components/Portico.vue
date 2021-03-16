<template>
   <div>
       <div v-html="content"></div>
       <div ref="sliderReplacement" id="sliderReplacement" v-if="sliderData">
      <no-ssr>
        <carousel
         :per-page-custom="[
            [320, 1],
            [480, 0],
            [768, 4],
            [1000, 3],
            [1200, 4],
          ]"
          :min-swipe-distance="20"
          :navigation-enabled="true"
          :pagination-enabled="false"
          navigation-next-label="<i class='material-icons p15  pointer rightArrow'>keyboard_arrow_right</i>"
          navigation-prev-label="<i class='material-icons p15  pointer leftArrow'>keyboard_arrow_left</i>"
          :loop="true"
        >
          <slide v-for="(image, index) in sliderData" :key="index">
            <a :href="image.imageLink" target="_blank" >
              <img :src="image.imagesStore" class="sliderimages" />
              <p class="Productname">{{image.pName}}</p>
              <p class="Productsize">Size: {{image.productSize}}</p>
              <p class="Productprice">{{image.P_Price}}</p>
            </a>
          </slide>
        </carousel>
      </no-ssr>
    </div>
   </div>
</template>
<script>
import NoSSR from 'vue-no-ssr';
export default {
  data (){
     return {
       sliderData: []
     }
  },
   components: {
    Carousel: () => import('vue-carousel').then(Slider => Slider.Carousel),
    Slide: () => import('vue-carousel').then(Slider => Slider.Slide),
    'no-ssr': NoSSR
  },
  props: {
    content: {
      type: String,
      required: true
    },
    selectClass: {
      type: String,
      required: true
    }
  },
mounted (){
     this.porticoCollectionSlider();
     this.replacer(document.getElementById('sliderReplacement'));
},
methods: {
       porticoCollectionSlider () {
      let storeAllImages = [];
      let contentSlide = document.getElementById('content-slider');
      if (contentSlide) {
        let saveAllImages = contentSlide.querySelectorAll('li');
        saveAllImages.forEach((images, index) => {
          let imagePath = images.querySelector('img').getAttribute('src');
          let routeLink = images.querySelector('a').getAttribute('href');
          let productName = images.querySelector('h3 > a').innerHTML;
          let size = images.querySelector('.size-value').innerHTML;
          let price = images.querySelector('#price > p').innerHTML;
          let imagesObject = {
            imagesStore: imagePath.toString(),
            imageLink: routeLink.toString(),
            pName: productName.toString(),
            productSize: size,
            P_Price: price
          }
          storeAllImages.push(imagesObject);
        });
        this.sliderData = storeAllImages;
        return storeAllImages;
      }
    },
    replacer (updatedContent) {
      let oldContent = document.getElementById('content-slider');
      oldContent.parentElement.replaceChild(updatedContent, oldContent)
    }
}
}

</script>
<style scoped>
#sliderReplacement {
  padding: 0 54px 0 44px;
}
.sliderimages {
  width: 85%;
}
.Productname{
    line-height: 25px;
    font-size: 15px;
    color: #000;
    font-weight: normal;
    text-align: left;
}
.Productsize{
    color: #4a4a4a;
    display: inline-block;
    font-family: Arial;
    font-size: 0.875rem;
    font-weight: bold;
    text-align: left;
    width: 100%;
}
.Productprice{
    font-weight: bold;
    font-size: 20px;
    color: #000;
    text-align: left;
}
</style>
<style lang="scss">
// img{
//   width: 300px;
// }
#sliderReplacement {
  .VueCarousel-navigation {
    .VueCarousel-navigation-button:focus {
      outline: none !important;
    }
    .VueCarousel-navigation-prev {
      left: 0px;
      i {
        color: #333072;
        font-size: 50px;
        padding: 0;
      }
    }
    .VueCarousel-navigation-next {
      i {
        color: #333072;
        font-size: 50px;
        padding: 0;
      }
    }
  }
}

</style>