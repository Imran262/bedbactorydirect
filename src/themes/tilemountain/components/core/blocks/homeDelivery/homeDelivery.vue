<template>
  <div :class="title != 'Tile Mountain' ? 'flooring' : ['tilemountain', 'container'] "  v-if="data">
    <div class="bus-img-main row" v-for="(singleblock , index) in uspData" :key="index">
      <router-link :to="localizedRoute(singleblock.actuallink)">
        <div class="bus-img"><img :src="singleblock.icon"  alt="icons" style="height: 24px;" class="icons_home"> </div>
        <div class="home_delivery_text">{{ singleblock.linktext }}</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock";
import config from 'config'
export default {
  name: "homeDelivery",
  mixins: [cmsBlock],
  computed: {
    uspData(){
      let storeAllData = [];
      if (this.data) {
      let saveAllData = this.parsedContent.querySelectorAll('.item');
        saveAllData.forEach((data, index) => {
          let anchortext = data.querySelector('a') ? data.querySelector('a').innerHTML : '';
          let anchorlink = data.querySelector('a') ? data.querySelector('a').getAttribute('href') : '';
          let imgicon = data.querySelector('img') ? data.querySelector('img').getAttribute('src') : ' ';
          console.log('this is img' , imgicon)
          let dataObject = {
            linktext: anchortext.toString(),
            actuallink: anchorlink.toString(),
            icon: imgicon.toString()
          }
          storeAllData.push(dataObject);
        });
        return storeAllData;
      }
    },
     title () {
      return config?.themeConfigurations?.title;
    }
  },
  methods: {
 
  }
};
</script>
<style lang="scss" scoped>
.flooring{
  text-align: center;
  padding: 16px 0 8px 46px;
}
.bus-img-main {
  margin-left: 12px;
  display: inline-block;
}
.squar-img-main {
  margin-left: 40px;
  display: inline-block;
}
.star-img-main {
  margin-left: 56px;
  display: inline-block;
}
.falgship-img-main {
  margin-left: 34px;
  display: inline-block;
}
.home_delivery_text {
  font-size: 14px;
  font-family: Oblik;
  color: #4a4a4a;
  float: left;
  margin-left: 12px;
  margin-top: 4px;
  @media screen and (min-width: 1271px){
    padding-right: 75px;
  }
  
}
.flooring .home_delivery_text {
  margin-top: 1px;
  @media (max-width: 1270px) and (min-width: 991px){
    margin-top: 6px;
  }
  @media (max-width: 990px) and (min-width: 768px){
    margin-top: 4px;
  }
}
.bus-img {
  float: left;
}
// .bus-img,
// .squar-img,
// .star-img,
// .falgship-img {
//   background: rgba(0, 0, 0, 0) url(/assets/sprites-nine.svg) no-repeat scroll;
// }
.tilemountain {
  padding: 14px 0 8px 52px;
  text-align: center;
  @media screen  and (max-width: 1279px) and (min-width: 1271px){
    padding: 14px 0 8px 43px;
  }
}
@media (max-width: 1270px) and (min-width: 768px) {
  .home_delivery_text {
    font-size: 10px !important;
    margin-left: 12px;
    margin-top: 5px;
    padding-right: 16px;
  }
  .falgship-img-main {
    margin-left: 14px;
    display: inline-block;
  }
}
@media screen and (min-width: 992px) and (max-width: 1199px) {
   .home_delivery_text {
     padding-right: 20px;
   }
}
@media (max-width: 767px) {
  .tilemountain , .flooring {
    display: none !important;
  }
}
@media (max-width: 990px) and (min-width: 768px) {
  .bus-img-main {
    display: inline-flex;
    margin: 0 0 0 7px !important;
  }
  .squar-img-main {
    display: inline-flex;
    margin: 0 0 0 0px !important;
  }
  .star-img-main {
    margin-left: 18px;
    display: inline-flex;
  }
  .falgship-img-main {
    margin-left: 4px;
    display: inline-flex;
  }
  .tilemountain , .flooring {
    padding: 14px 0 8px 0;
  }
  .home_delivery_text {
    font-size: 10px !important;
    margin-left: 5px;
    margin-top: 6px;
  }
}
a:not(.no-underline):hover:after {
  background-color: transparent;
}
.flooring .home_delivery_text{
  font-size: 19px;
  font-family: Oblik;
  padding-right: 106px;
  @media screen and (max-width: 1550px){
    padding-right: 60px;
  }
  @media screen and (max-width: 991px){
    padding-right: 30px !important;
  }
}
@media (max-width: 1270px) and (min-width: 768px) {
 .flooring .home_delivery_text {
    font-size: 10px !important;
  }
  }
  @media screen and (min-width: 1271px) and (max-width: 1480px){
    .flooring .home_delivery_text {
    font-size: 16px !important;
  }
  }
  .icons_home{
    @media screen and (max-width: 992px){
      height: 19px !important;
    }
  }
</style>
