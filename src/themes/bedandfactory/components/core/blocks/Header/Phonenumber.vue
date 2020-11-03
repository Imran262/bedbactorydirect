<template>
  <a href="tel:01782 405047">
    <button class="bg-cl-transparent brdr-none p0">
      <div class="wishlist">
        <div class="wishlist-img phone-icon">
          <span>
            <img src="/assets/communications.svg" />
          </span>
        </div>
        <div class="wishlist-text">
          <span>0151 548 1554</span>
        </div>
      </div>
    </button>
  </a>
</template>

<script>
export default {
  components: {
    name: 'Phonenumber'
  }
};
</script>

<style lang="scss" scoped>
.wishlist {
  padding: 10px;
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
}
@media (min-width: 768px) and (max-width: 990px) {
  .wishlist {
    padding: 0;
    .wishlist-text {
      span {
        display: none;
      }
    }
  }
}
@media (min-width: 991px) and (max-width: 1024px) {
  .wishlist {
    padding: 0;
  }
}
</style>
