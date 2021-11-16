<template>
<div class="container-fluid main-usp-bar">
  <div class="usp-bar container">
    <!-- <div class="container">
      <div class="usp-bar-inner">
        <CmsBlock identifier="usp-bar-TM" />
      </div>
    </div> -->
    <div
      :class="['bedfactorydirect', 'row']"
      v-if="data"
    >

      <div
        class="bus-img-main col-sm-3"
        v-for="(singleblock, index) in uspData"
        :key="index"
      >
        <router-link :to="localizedRoute(singleblock.actuallink)" class="usp-a">
          <div class="bus-img">
            <img
              :src="singleblock.icon"
              alt="icons"
              style="height: 24px"
              class="icons_home"
            />
          </div>
          <div class="home_delivery_text">{{ singleblock.linktext }}</div>
        </router-link>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import CmsBlock from 'theme/components/core/blocks/Cms/Block';
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock";
export default {
  components: {
    CmsBlock
  },
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
          // console.log('this is img' , imgicon)
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
<style lang='scss'>
.main-usp-bar{
  background-color: aliceblue;
}
.usp-bar-box {
  img {
    width: 18px;
    height: 15px;
    padding-right: 5px;
  }
  p {
    display: inline;
  }
}
.mobile-view {
  text-align: center;
}
@media screen and (max-width: 767px) {
  .usp-bar {
    display: none;
  }
}
a.usp-a {
    display: inline-flex;
    padding: 12px 0 12px 0;
}
.home_delivery_text {
    margin-left: 10px;
    margin-top: 4px;
    color: #071A44;
}
@media screen and (max-width:991px){
  .home_delivery_text {
    font-size: 12px;
}
}
.bedfactorydirect {
    text-align: center;
}
</style>
