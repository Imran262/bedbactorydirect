<template>
  <div class="review_one" :review-id="review.review_id">
    <div class="row">
      <div class="col-xs-12 col-md-12 pt30 pb15 review_one_detail">
        <div class="row">
          <div class="col-xs-4 col-md-2 tabrating">
            <div class="rating">
              <rating :score="review.score ? parseFloat(review.score) : 0" />
            </div>
          </div>
          <div class="col-xs-8 col-md-8 mrg">
            <p>
              <span class="blue" :user-id="review.user_id">{{
                review.user.display_name
              }}</span>
              <span class="buyer">{{ formatDate(review.created_at) }}</span>
            </p>
          </div>
        </div>
        <p><b v-html="review.title" /></p>
        <p v-html="review.content" />
        <template v-if="review.reviewImages && review.reviewImages.length > 0">
          <template v-for="(rImage, rImgIndex) in review.reviewImages">
            <div
              @click="showReviewModal({ selectedImgIndex: rImgIndex, review })"
              class="pic_one"
              v-if="rImage.thumb_url && rImage.original_url"
              :key="rImgIndex"
            >
              <!--{{ rImgIndex }}-->
              <img :src="rImage.thumb_url" alt="review image" />
            </div>
          </template>
        </template>
      </div>
      <div class="verified-buyer-mobile">
        <div class="verify-buyer">
          <p v-if="review.verified_buyer" class="buyer">
            Verified Buyer <i class="fa fa-check-circle" aria-hidden="true" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateFormat from 'dateformat'
import rating from './Rating'
export default {
  name: 'ReviewItem',
  props: {
    review: {
      type: [Object],
      required: true
    }
  },
  methods: {
    formatDate (date) {
      let formattedDate = date.replace(' ', 'T')
      let d = new Date(formattedDate)
      return dateFormat(d, 'dd/mm/yy')
    },
    showReviewModal (payload) {
      // console.log('sending payloaad'payload),
      this.$bus.$emit('modal-show', { ...payload, modalName: 'modal-ReviewItemImageModel' })
    }
  },
  components: {
    rating
  }
}
</script>
<style scoped>
.rating {
  margin-top: 4px;
}
.review_one {
  border-top: 2px dashed #acacac;
  position: relative;
}
.review_one p {
  color: #4a4a4a;
  font-family: Arial;
  line-height: 26px;
}
.images-box img:first-child {
  margin-left: 0px;
}
.images-box img {
  height: 100px;
  width: 100px;
  display: inline-block;
  margin-left: 10px;
}
.buyer {
  color: #acacac;
  margin-bottom: -6px;
  font-family: Arial;
  font-size: 14px;
  margin-top: 0px;
}
.mrg1 {
  font-size: 14px;
}
.fa-check-circle:before {
  content: '\f058';
  color: #66c136;
}

.buyer1 {
  border-bottom: 8px solid #191b59;
  float: left;
  width: 23px;
  margin-left: 3px;
  font-size: 14px;
}
.blue {
  margin-top: 0;
  color: #4e86d2;
  font-weight: bold;
  font-family: Arial;
  font-size: 14px;
}
.product_review h2 span {
  display: none;
}
.add_review h2 span {
  display: none;
}
.product_review .head {
  font-weight: 700;
  font-family: Arial;
  margin-bottom: -5px;
}
.add_review {
  margin-left: 19px;
  margin-right: auto;
  width: 590px;
}
.add_review h2 {
  color: #4a4a4a;
}
.mrg {
  margin-top: -15px;
}
.mrg1 {
  margin-top: 36px;
  margin-bottom: 5px;
}
/* .room{
  margin-top: 27px;
  margin-bottom: 27px;
} */
.pic_one {
  display: inline-block;
  margin: 0px 15px 15px 0px;
}
.pic_one img {
  height: 112px;
  width: 112px;
}
.verified-buyer-mobile {
  position: absolute;
  right: 0;
  top: 31px;
}

@media (max-width: 767px) and (min-width: 320px) {
  .product_review {
    width: 100%;
    padding: 0px;
    margin: 0px;
  }
  .product_review h2 {
    padding: 20px 30px;
    margin: 0px;
    font-size: 22px;
  }
  .product_review h2 span {
    display: block;
  }
  .back_clr,
  .back_clr1 {
    background-color: #dedad9;
    padding: 0px;
    border-bottom: 2px solid #ffffff;
  }
  .reviews-inner {
    padding: 0px 30px;
  }
  .add_review {
    width: 100%;
    padding: 0px;
    margin: 0px;
  }
  .review_one {
    padding: 0px 30px;
  }
  .verified-buyer-mobile {
    padding: 0px 8px 20px 8px;
  }
  .review_one_detail {
    padding-bottom: 0px;
  }
  .verified-buyer-mobile {
    position: relative;
    top: 0;
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .product_review {
    display: block;
    margin-left: auto !important;
    margin-right: auto !important;
    width: 710px !important;
  }
  .tabrating {
    padding-right: 0;
  }
  .mrg {
    padding-left: 0;
  }
  .add_review {
    display: block;
    margin-left: auto !important;
    margin-right: auto !important;
    width: 710px !important;
  }
}

@media (min-width: 992px) and (max-width: 1200px) {
  .tabrating {
    flex-basis: 22.666667%;
    max-width: 22.666667%;
  }
  .mrg {
    flex-basis: 77.333333%;
    max-width: 77.33333333%;
  }
  .product_review {
    margin-left: auto !important;
    /* margin-right: auto !important; */
    width: 437px !important;
  }
  .add_review {
    margin-left: auto !important;
    /* margin-right: auto !important; */
    width: 437px !important;
  }
  .buyer1 {
    border-bottom: 8px solid #191b59;
    float: left;
    width: 22px;
    margin-left: 3px;
  }
}

.text_left {
  text-align: end;
}
.font_size {
  font-size: 15px;
}
.left1 {
  float: left;
}
.image1 {
  margin: 19px 0 0px -6px;
  width: 100%;
}
.head1 {
  float: left;
  width: 50%;
  height: 50px;
}
.head2 {
  float: left;
  width: 50%;
  height: 50px;
}

.advice {
  font-size: 15px;
}

.pagination_clr {
  color: #191b59;
  font-family: Arial;
}

.verify-buyer {
  float: right;
}

@media (max-width: 767px) {
  .verify-buyer {
    float: left;
  }
}
/* @media(min-width: 1201px){
  .blue{
    margin-left: -35px;
  }
} */
</style>
