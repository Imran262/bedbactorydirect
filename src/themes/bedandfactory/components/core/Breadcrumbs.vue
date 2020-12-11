<template>
  <div
    class="breadcrumbs mt10 h5 cl-gray"
    itemscope
    itemtype="https://schema.org/BreadcrumbList"
  >
    <span class="home-breadcrumb-icon product-page-home-breadcrumb-icon">
      <router-link :to="localizedRoute('/')" class="cl-tertiary links">
        <img
          class="home-breadcrumb-icon-img"
          src="/assets/home-breadcrumb-icon.svg"
        /> </router-link
      >|
    </span>
    <!-- Helloo -->
    <!-- {{updatedPath}}  -->
    <!-- Hello{{ updatedPath }}
    {{ setPaths() }} -->
    <!-- Hello{{ updatedPath }} -->
    <span
      v-for="(link, index) in paths"
      :key="link.route_link"
      v-if="
          link.name !== 'Default category' && link.name !== 'Default Category'
        "
      itemprop="itemListElement"
      itemscope
      itemtype="https://schema.org/ListItem"
    >
        <router-link :to="link.route_link" itemprop="item">
          {{ link.name | htmlDecode }}
          <meta itemprop="name" :content="link.name" />
          <meta itemprop="position" :content="index + 1" /> </router-link
        >
        |
    </span>
    <span class="cl-mine-shaft">{{ current | htmlDecode }}</span>
  </div>
</template>

<script>
import { Breadcrumbs } from "@vue-storefront/core/modules/breadcrumbs/components/Breadcrumbs.ts";
export default {
  mixins: [Breadcrumbs],
  components: {},
  props:{
  },
  data(){
    return{
    updatedPath :[]
  }},
  serverPrefetch() {
   // return this.setPaths();
  },
  mounted(){
   // console.log("-----> Mount",this.renderPage);
   // this.setPaths()
  },
  methods:{
    setPaths(){

//  console.log("1122",this.paths);
      this.paths.forEach((link,index) => {
        if((link.name !== 'Default category') && (link.name !== 'Default Category')){
          this.updatedPath.push(link)
        }
        // console.log("1122",this.paths.length , index+1,this.paths.length == index + 1);
        // if(this.paths.length == index + 1){
        //   console.log("112233");
        //   return updatedPath
        // }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
img.home-breadcrumb-icon-img {
  width: 15px;
  float: left;
  margin: 3px 2.5px 0 0;
}
.breadcrumbs {
  padding-top: 1rem;
  span {
    color: #54575b;
    display: inline-block;
    a {
      color: #54575b;
      padding: 0px 2.5px;
    }
  }
}
iframe {
  display: none;
}
</style>
