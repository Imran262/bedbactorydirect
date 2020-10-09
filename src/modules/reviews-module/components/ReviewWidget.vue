<template>
  <no-ssr>
    <div class="ratingLogoWrap">
      <div v-if="reviews" class="overallStatsWrap">
        <div class="reviews" v-for="review in reviews" :key="review.id">
          <ReviewCard :review="review" />
        </div>
      </div>
    </div>
  </no-ssr>
</template>

<script>
import NoSSR from "vue-no-ssr";
import ReviewCard from "./ReviewCard";
export default {
  data() {
    return {
      reviews: null,
    };
  },
  components: {
    "no-ssr": NoSSR,
    ReviewCard,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    reviewsList: {
      type: Object,
      required: false,
    },
  },
  async mounted() {
    if (this.productSku) {
      // const result = await this.$store.dispatch('ukreviews/getReviews', this.productSku)
      // await this.$store.commit(`ukreviews/UPDATE_REVIEWS`, result)
    }
  },
  watch: {
    allReviewsList(oldVal, newVal) {
      if (this.reviewsList) {
        this.reviews = this.reviewsList.reviews;
        console.log("1122 This is reviews in reivew widget",typeof this.reviewsList, this.reviews);
      }
      else{

      }
    },
  },
  computed: {
    productSku() {
      return this.product.sku;
    },
    getAverage() {
      return this.reviews.stats.average;
    },
    getTotal() {
      return this.reviews.reviews.total;
    },
    getReviewsData() {
      return this.reviews.reviews.data;
    },
    allReviewsList() {
      return this.reviewsList;
    },
  },
};
</script>

<style></style>
