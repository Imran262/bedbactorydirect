<template>
  <div class="homepageslider-mobile hidden-md hidden-lg hidden-xl">
    <div>
      <router-link class="shop-now" :to="localizedRoute('/heating')">
        <img src="assets/images/homepage/home-mobile-banner.jpg" />
      </router-link>
      <!-- <div class="homepage-detail-mobile">
        <h1>Get the luxury look for less</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <a href="" class="btn-explore">Explore Baths</a>
      </div>-->
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@media (max-width: 767px) {
  .homepageslider-mobile {
    margin-top: -2px;
    position: relative;
    // margin-bottom: 130px;
    img {
      width: 100%;
      // height: 258px;
    }
    .homepage-detail-mobile {
      padding: 40px !important;
      background: #f5f7fa;
      position: absolute;
      top: 135px;
      right: 10px;
      left: 10px;
      h1 {
        font-family: "Poppins", sans-serif;
        font-weight: 500;
        color: #54575b;
        text-transform: uppercase;
        margin: 0px;
        text-align: center;
        font-size: 22px;
        letter-spacing: 1px;
        font-weight: 700;
      }
      p {
        color: #54575b;
        font-size: 14px;
        margin-top: 10px;
        text-align: center;
        font-family: "Poppins", sans-serif;
        font-weight: 500;
      }
      .btn-explore {
        background: #4dba87;
        color: #ffffff;
        border: 2px solid #ffffff;
        border-radius: 5px;
        text-align: center;
        font-family: "Poppins", sans-serif;
        font-weight: 500;
        padding: 5px;
        font-size: 18px;
        display: block;
      }
    }
  }
}
</style>
