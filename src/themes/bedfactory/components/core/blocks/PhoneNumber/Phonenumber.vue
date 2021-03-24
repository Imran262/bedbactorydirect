<template>
  <a href="tel:0151 548 1554">
    <button class="bg-cl-transparent brdr-none p0">
      <div class="wishlist">
        <div class="wishlist-img phone-icon">
          <span>
            <img src="/assets/communications.svg" />
          </span>
        </div>
        <div class="wishlist-text">
          <span>{{callText}}</span>
        </div>
      </div>
    </button>
  </a>
</template>

<script>
export default {
  components: {
    name: 'Phonenumber'
  },
  props: {
    callText: {
      type: String,
      required: false,
      default: '0151 548 15542'
    }
  },
};
</script>

<style lang="scss" scoped>
.wishlist {
  display: flex;
  .wishlist-img {
    span {
      display: block;
      text-align: center;
    }
  }
  .phone-icon img {
    width: 27px;
    height: 20px;
  }
  .wishlist-text {
    span {
      font-size: 0.671875rem;
      font-family: 'Poppins', sans-serif;
      color: #54575b;
    }
  }
}

@media (max-width: 767px) {
  .wishlist {
    .wishlist-text {
      span {
        display: none;
      }
    }
  }
  .wishlist .phone-icon img{
    width: 6vw;
}
}
 @media (min-width: 768px) and (max-width: 992px){
   .wishlist-text {
    width: 80px !important;
}
 }
@media (min-width: 768px) and (max-width: 990px) {
  .wishlist {
    padding: 0;
  }
}
@media (min-width: 991px) and (max-width: 1024px) {
  .wishlist {
    padding: 0;
  }
}
.bg-cl-transparent {
    padding-top: 31px;
}
</style>
