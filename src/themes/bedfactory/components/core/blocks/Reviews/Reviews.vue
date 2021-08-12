<template>
  <div class="brdr-top-1 brdr-cl-secondary">

    <template v-if="finalReview">
      <div v-for="(review, index) in finalReview.reviews" :key="index">
        <div v-if="review && index === 0" itemprop="review" itemscope itemtype="https://schema.org/Review">
          <meta itemprop="datePublished" :content="formatDate(review.created_at)">
          <meta itemprop="description" :content="review.content">
          <meta itemprop="name" :content="review.title">
          <div itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
            <meta itemprop="ratingValue" :content="review.score">
            <meta itemprop="bestRating" content="5">
          </div>
          <div itemprop="author" itemscope itemtype="https://schema.org/Person">
            <meta itemprop="name" :content="review.user.display_name">
          </div>
        </div>
      </div>
    </template>
    <div class="row between-xs" id="reviewMainSection">
      <div ref="productReviews" class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 pt50 back_clr pb50">
        <div class="product_review">
          <h2 style="font-family: oblik;" class="h3 m0 mb10 serif lh20 weight-700" @click="productReview()">
            {{ $t('Product Reviews') }}
            <span id="right-icon-review" class="icon-rotate-review"/>
          </h2>
          <div class="reviews-detail-box productReview-close">
            <template v-if="finalReview.reviews && finalReview.reviews.length > 0">
              
              <template v-for="(reviewItem, index) in pageOfItems">
                <review-item :key="index" :review="reviewItem"/>
              </template>
              <div class="pagination-box">
                <b class="pagination_clr">
                  <template v-if="finalReview.reviews && finalReview.reviews.length > reviewsPageSize">
                    Read More Reviews:
                  </template>
                </b>
                <pagination :items="finalReview.reviews" @changePage="onChangePage" :page-size="reviewsPageSize"
                            :product-id="productId"/>
              </div>
            </template>
            <template v-else>
              <p class="not-found">
                No Reviews Found
              </p>
            </template>
          </div>
        </div>
      </div>
      <!--QA Section-->
      <div ref="productQAS" class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 pt50 back_clr1 pb50">
        <div class="add_review">
          <h2 style="font-family: oblik;" class="h3 m0 mb10 serif lh20 weight-700 hidden-xs" @click="qaBox()">
            {{ $t('Q & A') }}
            <span id="right-icon-qa" class="icon-rotate-qa"/>
            <span class="question" @click="qaArea()"><img src="/assets/qa-block.png" alt="qa block"> Ask A Question</span>
          </h2>
          <h2 style="font-family: oblik;" class="h3 m0 mb10 serif lh20 weight-700 hidden-lg hidden-md"
              @click="qaBox(); qaArea()">
            {{ $t('Question & Answers') }}
            <span id="right-icon-qa" class="icon-rotate-qa"/>
            <span class="question hidden-xs"><img src="/assets/qa-block.png"  alt="qa block" class="hidden-xs"></span>
          </h2>
          <div class="qa-detail-box qaBox-close">
            <div class="qaArea-close">
              <form method="post" v-if="formSubmitted" @submit.prevent="createQuestion">
                <label>Question:</label>
                <textarea name="question" v-model="question.review_content" ref="questionField" rows="5"
                          @keyup="userName();" required/>
                <div class="row qa-inputarea">
                  <div class="col-md-4 username-box" @keyup="emailBox()">
                    <label>Name:</label>
                    <input ref="nameField" name="username" v-model="question.display_name" required>
                  </div>
                  <div class="col-md-4 email-box" @keyup="btnPost()">
                    <label>Email:</label>
                    <input ref="emailField" name="email" v-model="question.email" type="email" required>
                  </div>
                  <button class="btn-post" type="submit">
                    Post
                  </button>
                </div>

              </form>
            </div>
            <div class="thankyou-box" v-if="thankYou">
              <div class="row">
                <div class="col-xs-4 col-md-2 col-lg-2">
                  <img src="/assets/check.png" alt="check">
                </div>
                <div class="col-xs-4 col-md-10 col-lg-10">
                  <h1>Thank you.</h1>
                  <p>Your question has been submitted successfully.</p>
                  <p>We will aim to answer your question within 24 Hours.</p>
                </div>
              </div>
            </div>
             <template v-if="qas">
            <template v-if="qas.length > 0">
              <template v-for="(qaItem, index) in pageOfQas">
                <qa-item :key="index" :qa="qaItem"/>
              </template>
              <div class="pagination-box">
                <b class="pagination_clr">
                  <template v-if="qas.length > qasPageSize">
                    Read More Q & A:
                  </template>
                </b>
                <pagination :items="qas" @changePage="onChangeQAPage" :page-size="qasPageSize" :product-id="productId"/>
              </div>
            </template>
            <template v-else>
              <p class="not-found">
                No Questions yet
              </p>
            </template>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import NoSSR from 'vue-no-ssr'
import i18n from '@vue-storefront/i18n'
import axios from 'axios';
import config from 'config';
import dateFormat from 'dateformat';
import reviewItem from './reviewItem';
import qaItem from '../QAS/QAItem';
import pagination from '../Pagination';
import { empty } from 'apollo-link';

export default {
  name: 'Reviews',
  data () {
    return {
      configData: null,
      reviews: [],
      reviewsPageSize: 5,
      pageOfItems: [],
      qas: [],
      qasPageSize: 5,
      pageOfQas: [],
      formSubmitted: true,
      routeUpdated: false,
      thankYou: false,
      newQuestion: '',
      question: {
        product_id: null,
        review_content: null,
        display_name: null,
        email: null
      }
    }
  },
  props: {
    finalReview:{
      type: [Object , Array],
      required: true
    },
    productId: {
      type: [String, Number],
      required: true
    },
    productName: {
      type: String,
      default: ''
    },
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user.current
    },
    configsData () {
      return {
        'api': config.api,
        'reviewPath': config.yopto.reviews,
        'qaPath': config.yopto.qa
      }
    }
  },
  serverPrefetch () {
    // return this.fetchReviews();
  },
  created () {
    this.question.product_id = this.productId;
    // this.fetchReviews();
  },
  methods: {
    formatDate (date) {
      let formattedDate = date.replace(' ', 'T');
      let d = new Date(formattedDate);
      return dateFormat(d, "yyyy-mm-dd")
    },
    async fetchReviews () {
      let productReviewsUrl = this.configsData.api.url + this.configsData.reviewPath.product + this.productId
    //  productReviewsUrl = 'https://vue.bedfactorydirect.co.uk/vueapi/ext/reviews/getReview?id=454';
      // let productReviewsUrl = this.configsData.api.url + this.configsData.reviewPath.product + 1931
      // console.log("112233 ",productReviewsUrl);
      await axios.get(productReviewsUrl)
        .then(({ data }) => {
          // console.log("112233 Data is ", data);
          if (data.result) {
            this.reviews = data.result;
          }
        })
        .catch(err => console.log('hasError', err))
    },
    notifyUser (notificationData) {
      this.$emit('sampleRes', notificationData);
      console.log("7894561 notificationData",notificationData);
      this.$store.dispatch('notification/spawnNotification', notificationData, {
        root: true
      });
    },
    async fetchQA () {
      let productQAUrl = this.configsData.api.url + this.configsData.qaPath.product + this.productId
      // let productQAUrl = this.configsData.api.url + this.configsData.qaPath.product + 1931
      console.log("145214 QA url is ",productQAUrl);
      await axios.get(productQAUrl)
        .then(({ data }) => {
          let
          console.log("145214 Data received is ",data);
          if (data.result) {
            this.qas = data.result;
            this.$emit('hasTotalQA', { 'qas': this.qas });
          }
          
        })
        .catch(err =>{ console.log('145214 qas hasError', err)
        this.$emit('hasTotalQA', { 'qas': [] });})
      // let productQAUrl = this.configsData.api.url + this.configsData.qaPath.product + this.productId
      // let productQAUrl = this.configsData.api.url + this.configsData.qaPath.product + 1931
      // this.$emit('hasTotalQA', { 'qas': [] });
      // await axios.get(productQAUrl)
      //   .then(({ data }) => {
      //     if (data.result) {
      //       this.qas = data.result;
      //       // this.$emit('hasTotalQA', { 'qas': this.qas });
      //       this.$emit('hasTotalQA', { 'qas': this.qas });
      //     }
      //   })
      //   .catch(err => console.log('qas hasError', err))
    },
    async createQuestion () {
      if (!this.question.review_content || !this.question.display_name || !this.question.email) {
      } else {
        let qaCreate = '/vueapi2/ext/yopto/qa/create';

        if (config.yopto && config.yopto.qa.create) {
          qaCreate = config.yopto.qa.create;
        }
        console.log("4563214 parameters are",config.api.url + qaCreate, this.question);
        axios.post(config.api.url + qaCreate, this.question, {
          headers: {
            'Content-type': 'application/json'
          }
        })
          .then(r => {
            console.log('4563214 responseIs', r);
            this.question.review_content = '';
            this.question.display_name = '';
            this.question.email = '';
            let removeQuestionClass = document.getElementsByClassName('question')[0];
            removeQuestionClass.classList.remove('question-hide');
            this.thankYou = true;
            this.formSubmitted = false;
          })
          .catch(error => {
            console.log('14563214 qaCreateError', error);
            this.notifyUser(
              notifications.createNotification({
                type: 'error',
                message: 'Failed to Post a Question'
              })
            );
          })
      }
    },
    productReview () {
      var desc = document.getElementsByClassName('productReview-close')[0];
      desc.classList.toggle('productReview-show');
      document.getElementById('right-icon-review').classList.toggle('icon-rotate-review');
    },
    qaBox () {
      var desc = document.getElementsByClassName('qaBox-close')[0];
      desc.classList.toggle('qaBox-show');
      document.getElementById('right-icon-qa').classList.toggle('icon-rotate-qa');
    },
    qaArea () {
      let qaAreaDesc = document.getElementsByClassName('qaArea-close')[0];
      qaAreaDesc.classList.add('qaArea-show');
      let question = document.getElementsByClassName('question')[0];
      question.classList.add('question-hide');
      this.thankYou = false;
      this.formSubmitted = true;
    },
    userName () {
      var desc = document.getElementsByClassName('username-box')[0];
      desc.classList.add('username-box-show');
    },
    emailBox () {
      var desc = document.getElementsByClassName('email-box')[0];
      desc.classList.add('email-box-show');
    },
    btnPost () {
      var change = document.getElementsByClassName('btn-post')[0];
      change.style.opacity = '1';
    },
    onChangePage (pageOfItems) {
      // update page of Reviews
      this.pageOfItems = pageOfItems;
    },
    onChangeQAPage (pageOfItems) {
      // update page of QAS
      this.pageOfQas = pageOfItems;
    }
  },
  destroyed () {
    // this.$bus.$off('product-after-load', this.refreshList)
    // this.$bus.$off('clear-add-review-form', this.clearReviewForm)
    // this.$bus.$off('user-after-loggedin', this.fillInUserData)
  },
  beforeMount () {
    // this.fetchReviews();
    this.fetchQA();
  },
  validations: {
    formData: {
      name: {
        minLength: minLength(2),
        required
      },
      email: {
        required,
        email
      },
      summary: {
        required
      },
      review: {
        required
      }
    }
  },
  components: {
    reviewItem,
    qaItem,
    'pagination': pagination,
    'no-ssr': NoSSR
  }
}
</script>
<style scoped>
.product_review {
  margin-left: auto;
  margin-right: 19px;
  width: 590px;
}

.pagination_clr {
  margin-bottom: 30px;
}

.back_clr {
background-color: #F2F2F2;
}

.back_clr1 {
  background-color: #D6D6D6 ;
}

.add_review {
  margin-left: 19px;
  margin-right: auto;
  width: 590px;
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

}

.mrg1 {
  font-size: 14px;
}

.fa-check-circle:before {
  content: "\f058";
  color: #66c136;
}

.buyer1 {
  border-bottom: 8px solid #191b59;
  float: left;
  width: 29px;
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

.product_review h2 {
  color: #071A44;
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
  color: #071A44;
  border-bottom: 2px dashed #acacac;
  padding-bottom: 10px;
}

.mrg {
  margin-top: -15px;
}

.mrg1 {
  margin-top: 36px;
  margin-bottom: 5px;
}

.room {
  margin-top: 27px;
  margin-bottom: 27px;
}

.not-found {
  font-family: oblik;
  color: #4a4a4a;
}

.pagination-box {
  border-top: 2px dashed #acacac;
}

.question {
  display: block !important;
  float: right;
  font-size: 18px;
  color: #071A44;
  cursor: pointer;
}

.qaArea-close {
  width: 95%;
  display: none;
  margin-top: 20px;
}

.qaArea-close label {
  color: #191b59;
  font-size: 14px;
  margin-bottom: 8px;
  font-family: Arial;
  font-weight: bold;
  display: block;
}

.qaArea-close textarea {
  width: 100%;
  border-radius: 0px;
  padding: 10px;
  margin: 0;
  border: 1px solid #acacac;
  font-family: 'Roboto', sans-serif;
    color: #333333;
    font-size: 14px;
}

.qaArea-close textarea:active,
.qaArea-close textarea:focus {
  border: 1px solid #acacac;
  outline: none;
}

.qaArea-close .btn-post {
  background: #191b59;
  border: 1px solid #191b59;
  color: #fff;
  float: right;
  text-transform: uppercase;
  border: none;
  border-radius: 3px;
  /* padding: 0px 67px; */
  display: block;
  margin-top: 35px;
  margin-right: -3px;
  font-weight: 700;
  opacity: 0.5;
  width: 100%;
  max-width: 158px;
  height: 100%;
  min-height: 35px;
  margin-left: 15px;
}

.qaArea-show {
  display: inline-block !important;
}

.question-hide {
  display: none !important;
}

.username-box {
  display: none;
}

.username-box input {
  width: 100%;
  height: 34px;
  border: 1px solid #acacac;
  font-family: 'Roboto', sans-serif;
  color: #333333;
  font-size: 14px;
  padding: 0 5px 0 5px;
}

.username-box input:active,
.username-box input:focus {
  outline: none;
}

.username-box-show {
  display: block;
  margin: 10px 0px;
}

.email-box {
  display: none;
}

.email-box input {
  width: 100%;
  height: 34px;
  border: 1px solid #acacac;
  font-family: 'Roboto', sans-serif;
  color: #333333;
  font-size: 14px;
  padding: 0 5px 0 5px;
}

.email-box input:active,
.email-box input:focus {
  outline: none;
}

.email-box-show {
  display: block;
  margin: 10px 0px;
}

.qa-inputarea {
  margin: 0 0px 0 -8px;
}

.thankyou-box {
  background: #BDEBFB;
  padding: 45px 35px;
  /* display: none; */
}

.thankyou-box img {
  margin-top: 15px;
}

.thankyou-box h1 {
  margin: 0px 0px 10px 0px;
  text-align: center;
  color: #4a4a4a;
  font-family: oblik;
  font-size: 26px;
}

.thankyou-box p {
  margin: 0px 0px 10px 0px;
  text-align: center;
  color: #4a4a4a;
  font-family: oblik;
  font-weight: 100;
  font-size: 14px;
  font-family: Arial;
}
@media (min-width: 600px) and (max-width: 767px){
.product_review h2 {
padding: 20px 31px;
margin: 0px;
font-size: 22px !important;
}
.add_review h2 {
padding: 21px 31px;
margin: 0px;
font-size: 22px !important;
}
}
@media (max-width: 767px) and (min-width: 320px) {
  .product_review {
    width: 100%;
    padding: 0px;
    margin: 0px;
  }

  .product_review h2 {
    padding: 20px 31px;
    margin: 0px;
    font-size: 4.267vw;
  }

  .product_review h2 span {
    display: block;
  }

  .back_clr, .back_clr1 {
    background-color: #DEDAD9;
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

  .add_review h2 {
    padding: 21px 31px;
    margin: 0px;
    font-size: 4.267vw;
  }

  .product_review h2 #right-icon-review {
    background: url(/assets/images/up.png) no-repeat;
    height: 25px;
    width: 25px;
    float: right;
    margin-top: 5px;
  }

  .product_review h2 .icon-rotate-review {
    background: url(/assets/images/down.png) no-repeat !important;
  }

  .product_review .productReview-show {
    display: block !important;
  }

  .product_review .productReview-close {
    display: none;
    padding: 0px 30px;
  }

  .add_review h2 #right-icon-qa {
    background: url(/assets/images/up.png) no-repeat;
    height: 25px;
    width: 25px;
    float: right;
    margin-top: 5px;
  }

  .add_review h2 .icon-rotate-qa {
    background: url(/assets/images/down.png) no-repeat !important;
  }

  .add_review .qaBox-show {
    display: block !important;
  }

  .add_review .qaBox-close {
    display: none;
    padding: 0px 30px;
  }

  .add_review h2 span {
    display: block;
  }

  .add_review h2 #right-icon-q {
    background: url(/assets/images/up.png) no-repeat;
    height: 25px;
    width: 25px;
    float: right;
    margin-top: 5px;
  }

  .add_review h2 .icon-rotate-q {
    background: url(/assets/images/down.png) no-repeat !important;
  }

  .add_review .qAnswer-show {
    display: block !important;
  }

  .add_review .qAnswer-close {
    display: none;
  }

  .pagination-box {
    padding: 0px 30px;
  }

  .add_review h2 {
    border-bottom: 2px dashed transparent;
  }

  .qa-detail-box {
    border-top: 2px dashed #acacac;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .product_review {
    display: block;
    margin-left: auto !important;
    margin-right: auto !important;
    width: 710px !important;
  }

  .add_review {
    display: block;
    margin-left: auto !important;
    margin-right: auto !important;
    width: 710px !important;
  }
}

@media (min-width: 992px) and (max-width: 1200px) {
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

.pagination_clr, .pagination {
  float: left;
  margin-top: 20px;
}

.pagination {
  font-weight: 700;
  margin-top: 13px !important;
}
</style>
