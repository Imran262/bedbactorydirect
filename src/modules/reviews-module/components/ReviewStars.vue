<template>
  <no-ssr>
    <div>
      <star-rating :rating="average" read-only :show-rating="true" />
      <span>({{ totalReviews }} Reviews)</span>
    </div>
  </no-ssr>
</template>

<script>
import NoSSR from "vue-no-ssr";
import { log } from "util";

export default {
  data() {
    return {
      average: 0,
      totalReviews: 0,
    };
  },
  components: {
    StarRating: () => import("vue-star-rating"),
    "no-ssr": NoSSR,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    shouldshowtotal: {
      type: Boolean,
    },
    reviews: {
      type: Object,
      required: false,
    },
  },
  mounted() {
    // if (this.productSku) {
    //   const result = await this.$store.dispatch(
    //     "ukreviews/getReviews",
    //     this.productSku
    //   );
    //   await this.$store.commit(`ukreviews/UPDATE_REVIEWS`, result);
    //   this.average = result.stats.average;
    //   this.totalReviews = result.reviews.total;
    // };
  },
  watch: {
    // async productSku() {
    //   const result = await this.$store.dispatch(
    //     "ukreviews/getReviews",
    //     this.productSku
    //   );
    //   await this.$store.commit(`ukreviews/UPDATE_REVIEWS`, result);
    //   this.average = result.stats.average;
    //   this.totalReviews = result.reviews.total;
    // },
    reviewsStats(newVal, oldVal) {
      if (this.reviews) {
        this.average = this.reviews.bottomline.average_score
          ? parseFloat(this.reviews.bottomline.average_score)
          : 0;
        this.totalReviews = this.reviews.bottomline.total_review
          ? parseInt(this.reviews.bottomline.total_review)
          : 0;
        console.log(
          "This is the complete data object==========>",
          this.average,
          this.totalReviews
        );
      } else {
        console.log("no reviews");
      }
    },
  },
  computed: {
    // productSku() {
    //   return this.product.sku;
    // },
    reviewsStats() {
      return this.reviews;
    },
  },
};
</script>

<style>
.product-reviews .vue-star-rating {
  float: left;
  margin-top: -2px;
}
.product-reviews .vue-star-rating-star {
  height: 22px;
  width: 22px;
}
.product-reviews span {
  font-style: italic;
  font-weight: 500;
}
.details-need div {
  margin-left: 30px;
  margin-top: -18px;
}
.details-need .vue-star-rating {
  float: left;
  margin-top: -1px;
}
.details-need .vue-star-rating-star {
  height: 22px;
  width: 22px;
}
.details-need span {
  font-style: italic;
  font-weight: 500;
}
</style>
