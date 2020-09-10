<template>
  <div>
    <div class="review">
      <div class="avatar">
        <!-- <img :src="getGravatarImg" alt /> -->
        <span class="nameLetter">
          <span class="yotpo-user-letter">{{
            review.user.display_name[0].toUpperCase()
          }}</span>
          <span v-if="isBuyerVerified">
            <img class="verified-user" src="/assets/tick.svg" />
          </span>
        </span>
      </div>
      <div class="author">
        <p class="author-name">{{ review.user.display_name }}</p>
        <p class="verified" v-if="isBuyerVerified">Verified Buyer</p>
        <p class="verified" v-if="!isBuyerVerified">Not Verified Buyer</p>
        <div class="reviewStarsBuyer">
          <star-rating
            class="overallStarsWrap"
            :rating="getBuyerRating"
            read-only
            :show-rating="false"
          />
        </div>
      </div>
    </div>
    <div class="reviewContent">
      <div class="reviewText">{{ getReviewContent }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    review: {
      type: Object,
      required: true,
    },
  },
  components: {
    StarRating: () => import("vue-star-rating"),
  },
  computed: {
    getGravatarImg() {
      return `https://s.gravatar.com/avatar/${this.review.user.social_image}?d=mm`;
    },
    isBuyerVerified() {
      return this.review.verified_buyer;
    },
    getBuyerRating() {
      return this.review.score;
    },
    getReviewContent() {
      return this.review.content;
    },
  },
};
</script>

<style>
.overallStatsWrap .reviews {
  width: 100%;
  overflow: auto;
  margin-bottom: 30px;
}
.overallStatsWrap .review {
  overflow: auto;
}
.overallStatsWrap .review .avatar {
  margin-right: 15px;
}
.overallStatsWrap .review .avatar,
.overallStatsWrap .review .author {
  float: left;
}
.overallStatsWrap .review .author p {
  margin: 5px 0px;
  font-size: 16px;
}
.overallStatsWrap .reviewContent .reviewText {
  margin-top: 10px;
  font-size: 16px;
  padding-left: 60px;
}
.overallStatsWrap .reviewStarsBuyer .vue-star-rating .vue-star-rating-star {
  height: 22px;
  width: 22px;
}
.nameLetter {
  height: 45px;
  width: 45px;
  border-radius: 50%;
  background-color: #83b6dd;
  position: relative;
  display: block;
}
.yotpo-user-letter {
  background: transparent !important;
  position: absolute;
  top: 8px;
  width: 100%;
  min-width: 100%;
  left: 0px;
  text-align: center;
  font-size: 20px;
  color: #fff;
}
.verified-user {
  width: 85px;
  height: 16px;
  margin-top: 28px;
}
.overallStatsWrap .reviewStarsBuyer .vue-star-rating .vue-star-rating-star {
  width: 15px;
}
</style>
