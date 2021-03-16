<template>
  <div class="category-detail align-center w-100">
    <router-link
      :to="'/'+category.url"
      class="block no-underline product-link"
    >
      <div class="product-cover">
        <div class="product-image product-cover__thumb product-image--width">
          <CategoryImage
            :alt="category.title"
            :image="category.thumb_image"
            :label="category.category_banner_image"
            :category-index="categoryIndex"
          />
        </div>
      </div>
      <div class="product details product-item-details clearfix">
        <strong class="product name product-item-name category-item-name">
          <p class="category-product-name">{{ category.title }}</p>
        </strong>
        <span class="minimal-price" v-if="category">
          <span v-if="categoryType !== 'notrequired' && categoryType !== 'Not Required' && categoryType !== 'not required'" class="p-from">
            <p>
              From £{{ category.price }}/<span v-html="categoryType" />
            </p>
          </span>
        </span>
      </div>
    </router-link>
  </div>
</template>

<script>
import { formatCategoryLink } from "@vue-storefront/core/modules/url/helpers"
import CategoryImage from "./CategoryImage"
import config from 'config'
export default {
  components: {
    CategoryImage,
  },
  props: {
    category: {
      type: Object,
      required: true
    },
    categoryType: {
      type: String,
      required: false
    },
    categoryIndex: {
      type: [String, Number],
      default: 0,
      required: false
    }
  },
  methods: {
    categoryLink(category) {
      return formatCategoryLink(category)
    },
    matchstring(url) {
      var string = url
      var substring = "-tile"
      return string.indexOf(substring) !== -1
    }
  },
  computed: {
    categoryTileType() {
      return config.tileTypes
    },
    categoryTileUnit() {
      // if (this.categoryType === 'sqm') {
      //
      //   console.log('categoryTpye', this.categoryType)
      // }
    }
  }
};
</script>

<style lang="scss">
.category-listing .sb-item a h1 {
  font-size: 18px;
  color: #54575b;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  margin: -6px 0 0 0;
  background-color: #f4f8fb;
  padding: 15px 0;
}
.product-item-details {
  margin: auto;
  margin-top: -7px;
  position: relative !important;
  padding-top: 10px;
  height: auto;
  line-height: 1;
}
.product-item-name {
  padding: 0;
  text-align: start;
  font-weight: 400;
  margin-bottom: 0;
  font-size: 1em;
  color: #474747;
  line-height: 1;
}

// .p-from {
//   color: #2a285a;
//   font-weight: bold;
//   font-size: 16px;
//   text-align: left;
//   display: block;
//   @media screen and (max-width: 1023px) and (min-width: 768px) {
//     font-size: 11px;
//   }
// }
.sign {
  float: left;
}
@media (min-width: 768px) {
  .category-detail {
    margin-bottom: 30px;
    .category-image {
      img {
        width: 100%;
        // height: 216px;
      }
    }
    h5 {
      font-size: 16px;
      color: #54575b;
      font-family: 'Arial';
      margin-bottom: 7px;
      margin-top: 7px;
      font-weight: 500;
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    p {
      font-size: 16px;
      color: #2a285a;
      font-family: 'Arial';
      font-weight: bold;
      margin: 0px;
      float: left;
    }
  }
}
@media screen and (max-width: 767px) {
  .category-detail {
    p {
      font-size: 16px;
      color: #2a285a;
      font-family: 'Arial';
      font-weight: bold;
      margin: 0px;
      float: left;
    }
    h5 {
      font-size: 16px;
      color: #54575b;
      font-family: 'Arial';
      margin-bottom: 3px;
      margin-top: 5px;
      font-weight: 500;
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
 
}
@media (min-width: 767px) and (max-width: 1280px) {
  .category-detail {
    .category-image {
      img {
        width: 100%;
      }
    }
  }
}
@media (max-width: 767px) {
  .category-detail {
    margin-bottom: 22px;
    .category-image {
      img {
        width: 100%;
      }
    }
    h5 {
      font-size: 3.733vw;
    }
    p {
      font-size: 3.733vw;
    }
  }
}
// h5.sub-cat-title {
//   font-size: 16px;
//   color: #54575b;
//   font-family: "Arial";
//   font-weight: bold;
//   margin: -6px 0 0 0;
//   padding: 15px 0;
// }
.priceprod {
  font-weight: bold;
  font-size: 16px;
  text-align: left;
}
</style>
<style lang="scss" scoped>
.product-cover {
  overflow: hidden;

  &__thumb {
    // padding-bottom: calc(143.88% / (164.5 / 100));
    @media screen and (min-width: 320px) {
      padding-bottom: calc(240.44% / (276.5 / 115));
    }
    // @media screen and (max-width: 767px) {
    //   padding-bottom: calc(164.5% / (276.5 / 115));
    // }
  }
}
.product-image {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 0;
  mix-blend-mode: multiply;
}
@media (min-width: 992px) and (max-width: 1024px) {
  .minimal-price {
    .only {
      font-size: 14px;
    }
  }
}
.category-product-name{
  font-size: 16px;
    color: #54575b;
    font-family: 'Arial';
    margin-bottom: 7px;
    margin-top: 7px;
    font-weight: 500;
    width: 100%;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding-bottom: 1px;
}
@media (max-width: 767px){
   .category-product-name{
    font-size: 3.733vw;
  }
}
</style>
