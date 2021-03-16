<template>
<div class="cutsample">
  <div class="similar-cut-sample">
    <no-ssr>
      <carousel
        :per-page-custom="[
          [320, 2],
          [375, 2],
          [768, 3],
          [1000, 4],
          [1200, 4],
        ]"
        :center-mode="false"
        :navigation-enabled="true"
        :pagination-enabled="false"
        navigation-next-label="<i class='recent-right-arrow cl-bg-tertiary-new arrow-mobile material-icons pointer'>keyboard_arrow_right</i>"
        navigation-prev-label="<i class='recent-left-arrow cl-bg-tertiary-new arrow-mobile material-icons pointer'>keyboard_arrow_left</i>"
      >
        <slide v-for="(product, index) in similarProducts.items" :key="index">
          <product
            :product="product"
          />
        </slide>
        <!-- <slide>
          <div class="cutsample-box">
            <div class="product-image">
              <a
                href="#"
                class="block no-underline product-link slider-custom-link product-image product-cover__thumb"
              >
                <img src="/assets/placeholder.svg" />
              </a>
            </div>
            <h3>Moliere Grey Anti-Slip Floor Tiles</h3>
            <p>Size: 300x300</p>
            <div class="rating">
              <h4>Now £15.99 /sqm</h4>
              <div class="stars">
                <i aria-hidden="true" class="fa fa-star" />
                <i aria-hidden="true" class="fa fa-star" />
                <i aria-hidden="true" class="fa fa-star" />
                <i aria-hidden="true" class="fa fa-star-half-o" />
                <i aria-hidden="true" class="fa fa-star-o" />
                <span>(9)</span>
              </div>
            </div>
            <a href="#" class="product_btn"> VIEW </a>
          </div>
        </slide>
        <slide>
          <div class="cutsample-box">
            <div class="product-image">
              <a
                href="#"
                class="block no-underline product-link slider-custom-link product-image product-cover__thumb"
              >
                <img src="/assets/placeholder.svg" />
              </a>
            </div>
            <h3>Moliere Grey Anti-Slip Floor Tiles</h3>
            <p>Size: 300x300</p>
            <div class="rating">
              <h4>Now £15.99 /sqm</h4>
              <div class="stars">
                <i aria-hidden="true" class="fa fa-star" />
                <i aria-hidden="true" class="fa fa-star" />
                <i aria-hidden="true" class="fa fa-star" />
                <i aria-hidden="true" class="fa fa-star-half-o" />
                <i aria-hidden="true" class="fa fa-star-o" />
                <span>(9)</span>
              </div>
            </div>
            <a href="#" class="product_btn"> VIEW </a>
          </div>
        </slide>
        <slide>
          <div class="cutsample-box">
            <div class="product-image">
              <a
                href="#"
                class="block no-underline product-link slider-custom-link product-image product-cover__thumb"
              >
                <img src="/assets/placeholder.svg" />
              </a>
            </div>
            <h3>Moliere Grey Anti-Slip Floor Tiles</h3>
            <p>Size: 300x300</p>
            <div class="rating">
              <h4>Now £15.99 /sqm</h4>
              <div class="stars">
                <i aria-hidden="true" class="fa fa-star" />
                <i aria-hidden="true" class="fa fa-star" />
                <i aria-hidden="true" class="fa fa-star" />
                <i aria-hidden="true" class="fa fa-star-half-o" />
                <i aria-hidden="true" class="fa fa-star-o" />
                <span>(9)</span>
              </div>
            </div>
            <a href="#" class="product_btn"> VIEW </a>
          </div>
        </slide>
        <slide>
          <div class="cutsample-box">
            <div class="product-image">
              <a
                href="#"
                class="block no-underline product-link slider-custom-link product-image product-cover__thumb"
              >
                <img src="/assets/placeholder.svg" />
              </a>
            </div>
            <h3>Moliere Grey Anti-Slip Floor Tiles</h3>
            <p>Size: 300x300</p>
            <div class="rating">
              <h4>Now £15.99 /sqm</h4>
              <div class="stars">
                <i aria-hidden="true" class="fa fa-star" />
                <i aria-hidden="true" class="fa fa-star" />
                <i aria-hidden="true" class="fa fa-star" />
                <i aria-hidden="true" class="fa fa-star-half-o" />
                <i aria-hidden="true" class="fa fa-star-o" />
                <span>(9)</span>
              </div>
            </div>
            <a href="#" class="product_btn"> VIEW </a>
          </div>
        </slide>
        <slide>
          <div class="cutsample-box">
            <div class="product-image">
              <a
                href="#"
                class="block no-underline product-link slider-custom-link product-image product-cover__thumb"
              >
                <img src="/assets/placeholder.svg" />
              </a>
            </div>
            <h3>Moliere Grey Anti-Slip Floor Tiles</h3>
            <p>Size: 300x300</p>
            <div class="rating">
              <h4>Now £15.99 /sqm</h4>
              <div class="stars">
                <i aria-hidden="true" class="fa fa-star" />
                <i aria-hidden="true" class="fa fa-star" />
                <i aria-hidden="true" class="fa fa-star" />
                <i aria-hidden="true" class="fa fa-star-half-o" />
                <i aria-hidden="true" class="fa fa-star-o" />
                <span>(9)</span>
              </div>
            </div>
            <a href="#" class="product_btn"> VIEW </a>
          </div>
        </slide> -->
      </carousel>
    </no-ssr>
  </div>
  </div>
</template>
<script>
import NoSSR from "vue-no-ssr";
import product from 'theme/components/custom/similar/Product'
export default {
  name: "SimilarCutSample",
  components: {
    Carousel: () => import("vue-carousel").then((Slider) => Slider.Carousel),
    Slide: () => import("vue-carousel").then((Slider) => Slider.Slide),
    product,
    "no-ssr": NoSSR,
  },
  props: {
    similarProducts: {
      type: Object,
      required: false,
      default: null
    }
  },
};
</script>
<style lang="scss" scoped>

.cutsample{
.similar-cut-sample {
  margin-top: 40px;
  // margin-bottom: 50px;
  .cutsample-box {
    padding: 0px 10px;
  }
  img {
    width: 100%;
  }
  h3 {
    color: #29275b;
    text-align: left;
    line-height: 2;
    font-size: 11px;
    font-weight: 500;
    margin: 10px 0 0 0;
    font-family: Arial, Helvetica, sans-serif;
  }
  p {
    color: #29275b;
    text-align: left;
    line-height: 2;
    font-size: 12px;
    margin: 0px;
    font-weight: 500;
    font-family: Arial, Helvetica, sans-serif;
    width: 60%;
  }
  .rating {
      // display: flex;
    h4 {
      color: #29275b;
      text-align: left;
      line-height: 0;
      font-weight: bold;
      font-size: 10.1px;
      font-family: Arial, Helvetica, sans-serif;
      float: left;
      margin-top: 15px;
    }
    .stars {
      float: right;
      margin-top: 5px;
      // padding-left: 10px;
      i {
        color: #fcde02;
        margin: 0px;
        font-size: 14px;
        margin-right: -3px;
      }
      span {
        color: #7e7979;
        font-size: 10px;
      }
    }
  }
  .product_btn {
    width: 100%;
    background-color: #29275b;
    border: none;
    color: white;
    border-radius: 3px;
    display: block;
    text-align: center;
    padding: 10px 0px;
    margin-top: 40px;
    font-size: 14px;
    &:hover {
      border: none;
    }
  }
  a.underline:after,
  a:not(.no-underline):hover:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: transparent;
  }
  .VueCarousel-navigation-button:focus {
    outline: 1px solid transparent !important;
  }
}
}
@media(max-width: 767px){
  .cutsample{
    .similar-cut-sample{
    .rating{
      .stars{
        span{
          padding-left: 5px;
        }
         
    }
  }
}
  }
}
@media screen and (max-width: 500px) {
  .cutsample{
  .similar-cut-sample{
    margin: 20px 0;
    h3{
      font-size: 9.3px;
    }
    p{
      font-size: 9.3px;
    }
    .rating{
      h4{
        font-size: 8px;
      }
      .stars{
        margin-top: 2px;
        span{
          font-size: 9px;
              padding: 0;
        }
        i{
          color: #fcde02;
          margin: 0px;
          font-size: 9px;
          margin-right: -3px;
        }
      }
    }
  }
  }
}
@media screen and (max-width: 357px) {
  .cutsample{
.similar-cut-sample{
  .rating{
    h4{
      margin-bottom: 0;
    }
    .stars{
      float: left;
    }
  }
}
  }
}

</style>
<style lang="scss">
  @media(max-width: 767px){
    .cutsample{
     .VueCarousel-navigation{
      opacity: 1 !important;
      .VueCarousel-navigation-next{
        background: #605c76;
        top: 135px;
        right: 3px;
        i{
          color: #ffffff;
          font-weight: bold;
        }
        
      }
       .VueCarousel-navigation-prev{
         background: #605c76;
         top: 135px;
         left: 3px;
        i{
          color: #ffffff;
          font-weight: bold;
        }
       }
      }
    }
    }
    @media screen and (max-width: 500px) {
    .cutsample{
     .VueCarousel-navigation{
      opacity: 1 !important;
      .VueCarousel-navigation-next{
        top: 60px;
        right: 26px !important;
        height: 35px;
        width: 35px;
        i{
          color: #ffffff;
          font-weight: bold;
          display: block;
          margin-top: -2px;
        }   
      }
       .VueCarousel-navigation-prev{
        top: 60px;
        left: 40px !important;
        height: 35px;
        width: 35px;
        i{
          color: #ffffff;
          font-weight: bold;
          display: block;
          margin-top: -2px;
          margin-left: -4px;
        }
       }
      }
    }
    }
    @media(max-width: 357px){
    .cutsample{
     .VueCarousel-navigation{
      opacity: 1 !important;
      .VueCarousel-navigation-next{
        right: 22px;
        width: 31px;
        i{
          margin-top: -5px;
          font-size: 30px;
          margin-left: -5px;
        }
        
      }
       .VueCarousel-navigation-prev{
        left: 22px;
        width: 31px;
        i{
          font-size: 30px;
          margin-top: -5px;
          margin-left: -10px;
        }
       }
      }
    }
    }
    @media(min-width: 767px) and (max-width: 991px){
      .VueCarousel-navigation {
          opacity: 1 !important;
        }
    }
</style>
<style lang="scss">
.modal.ClearanceModal .modal-container{
  border-radius: 15px;
  max-width: 92%;
}
</style>