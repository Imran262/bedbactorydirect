<template>
  <ul :class="ulClass" @click="starsClicked">
    <li v-for="(star, index) in stars" :key="index">
      <i :class="`fa ` + star " aria-hidden="true"/>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Rating',
  data () {
    return {
      maxScore: 5
      // stars: []
    }
  },
  props: {
    score: {
      type: [Number],
      required: true
    },
    ulClass: {
      type: String,
      required: false,
      default: ''
    }
  },
  methods: {
    starsClicked () {
      this.$emit('starsClicked');
    },
    isFloat (n) {
      return Number(n) === n && n % 1 !== 0;
    }
  },
  computed: {
    stars () {
      let starsArr = [];
      for (let i = 1; i <= this.maxScore; i++) {
        if (this.score < i) {
          if (this.isFloat(this.score) && (Math.round(this.score) === i)) {
            starsArr.push('fa-star-half-o');
          } else {
            starsArr.push('fa-star-o');
          }
        } else {
          starsArr.push('fa-star');
        }
      }
      return starsArr;
    }
  }
}
</script>

<style scoped>
.rating ul {
  padding: 0;
  list-style: none;
  margin: 0;
}

.rating ul li {
  display: inline-block;
  /* margin: 1px; */
}

.rating ul li .fa {
  color: #f5da00;
  font-size: 18px !important;
}
  @media (min-width: 320px) and (max-width: 440px){
   .rating ul li .fa {
  font-size: 16px !important;
}
  }
.rating1 ul {
  /* padding: 0; */
  list-style: none;
  /* margin: 0; */
}

.rating1 ul li {
  display: inline-block;
  /* margin: 1px; */
}

.rating1 ul li .fa {
  color: #f5da00;
  font-size: 18px !important;
}
.slider-rating {
  display: inline-block;
  width: auto !important;
}

.slider-rating li {
  display: inline-block;
}

.slider-rating li .fa {
  color: #fcde02;
  font-size: 20px;
}
.cursor-pointer{
  cursor: pointer;
}
@media(min-width: 370px) and (max-width: 423px){
 .cutsample-box .rating .stars ul li .fa {
    font-size: 12px !important;
  }
  /* .cutsample .rating .stars ul li .fa{
      font-size: 10px !important;
  } */
    .cutsample .cutsample-box .rating .stars ul li .fa{
      font-size: 10px !important;
  }
}
@media(min-width: 423px) and (max-width: 470px){
 .cutsample-box .rating .stars ul li .fa {
    font-size: 12px !important;
  }
  .cutsample .cutsample-box .rating .stars ul li .fa{
      font-size: 10px !important;
  }
}
@media(max-width: 767px){
  .slider-rating li .fa {
    font-size: 12px;
  }
  .padding_right {
    padding-left: 0;
}
.product-slide .slider-rating{
    margin-top: 18px;
}
}
@media (max-width:388px) and (min-width: 320px){
    .slider-rating li .fa {
     font-size: 2.5vw !important;
  }
  .rating ul li .fa{
      color: #f5da00;
      font-size: 13px !important;
  }
  .cutsample-box .rating .stars ul li .fa {
    font-size: 12px !important;
  }
}
</style>
