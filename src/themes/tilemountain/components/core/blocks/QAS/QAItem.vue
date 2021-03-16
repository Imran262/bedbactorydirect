<template>
  <div class="review_one qa-reviews">
    <div class="row" :qa-id="qa.question_id">
      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 pt35 questiondetail">
        <p>
        <span class="blue"> {{ qa.asker_name }} </span>
        <span class="buyer"> {{ qa.created_at ? formatDate(qa.created_at) : '' }}</span>
        </p>
        </div>
      <!--<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 pt35"><p class="buyer text_left">Verified Buyer
        <i class="fa fa-check-circle" aria-hidden="true"></i></p></div>-->
    </div>
    <div><p class="question-text">
      <b v-html="qa.question" class="font_size">
      </b>
    </p></div>
    <div class="row">
      <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-xs-2"><img class="image1" src="/assets/logo.svg" alt="logo">
      </div>
      <div class="col-xl-10 col-lg-10 col-md-10 col-sm-10 col-xs-10">
        <p class="advice"><b>Our advice:</b> <span v-html="qa.answer"></span> </p>
      </div>
    </div>
  </div>
</template>

<script>
import dateFormat from 'dateformat';

export default {
  name: 'QAItem',
  props: {
    qa: {
      type: [Object],
      required: true
    }
  },
  methods: {
    formatDate (date) {
      let formattedDate = date.replace(' ', 'T');
      let d = new Date(formattedDate);
      return dateFormat(d, "dd/mm/yy")
    }
  }
}
</script>
<style scoped>
.review_one{
  border-top: 2px dashed #acacac;
  margin-top: 15px;
  color: #4a4a4a;
  font-family: Arial;
  line-height: 26px;
}
.qa-reviews:nth-of-type(2){
  border-top: none !important;
}
.images-box img:first-child{
  margin-left: 0px;
}
.images-box img{
  height: 100px;
  width: 100px;
  display: inline-block;
  margin-left: 10px;
}
.questiondetail{
  padding-top: 0px;
}
.questiondetail p{
  margin-top: 4px;
  margin-bottom: 0;
}
p.question-text {
    margin-top: 0;
}
.buyer{
  color: #acacac;
  margin-bottom: -6px;
  font-family: Arial;
  font-size: 14px;
}

.fa-check-circle:before {
  content: "\f058";
  color: #66c136;
}
.blue{
  margin-top: 0;
  color: #4e86d2;
  font-weight: bold;
  font-family: Arial;
  font-size: 14px;
}
.product_review h2{
  color:#4a4a4a;
}
.product_review h2 span{
  display: none;
}
.add_review h2 span{
  display: none;
}
.product_review .head{
  font-weight: 700;
  font-family: Arial;
  margin-bottom: -5px;
}
@media (max-width:767px) and (min-width: 320px){
  .product_review {
    width: 100%;
    padding: 0px;
    margin:0px;
  }
  .product_review h2{
    padding: 20px 30px;
    margin: 0px;
    font-size: 22px;
  }
  .product_review h2 span{
    display: block;
  }
  .back_clr, .back_clr1{
    background-color: #DEDAD9;
    padding: 0px;
    border-bottom: 2px solid #ffffff;
  }
  .add_review h2{
    padding: 20px 30px;
    margin: 0px;
    font-size: 22px;
  }
}
.text_left{
  text-align: end;
}
.font_size{
  font-size: 15px;
}
.image1{
  margin: 19px 0 0px -6px;
  width: 100%;
}
.advice{
  font-size: 15px;
}
</style>
