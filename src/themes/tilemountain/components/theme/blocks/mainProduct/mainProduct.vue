<template>
  <div class="main_product_bg_colour">
    <div class="container">
      <div class="row">
        <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12">
          <router-link :to="{ name: 'product' }">
            <div class="main_product">
              <div class="main_product_image">
                <img src="/assets/main_product.jpg" alt="main product" width="100%" />
                <div class="overlay">
                  <p>Floor Tiles</p>
                  <button class="main_product_btn">EXPLORE</button>
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12">
          <router-link :to="{ name: 'product' }">
            <div class="main_product">
              <div class="main_product_image">
                <img src="/assets/main_product.jpg" alt="main product" width="100%" />
                <div class="overlay">
                  <p>Floor Tiles</p>
                  <button class="main_product_btn">EXPLORE</button>
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12">
          <router-link :to="{ name: 'product' }">
            <div class="main_product">
              <div class="main_product_image">
                <img src="/assets/main_product.jpg" alt="main product" width="100%" />
                <div class="overlay">
                  <p>Floor Tiles</p>
                  <button class="main_product_btn">EXPLORE</button>
                </div>
              </div>
            </div>
          </router-link>
        </div>

        <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12">
          <router-link :to="{ name: 'product' }">
            <div class="main_product">
              <div class="main_product_image">
                <img src="/assets/main_product.jpg" alt="main product" width="100%" />
                <div class="overlay">
                  <p>Floor Tiles</p>
                  <button class="main_product_btn">EXPLORE</button>
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12">
          <router-link :to="{ name: 'product' }">
            <div class="main_product">
              <div class="main_product_image">
                <img src="/assets/main_product.jpg" alt="main product" width="100%" />
                <div class="overlay">
                  <p>Floor Tiles</p>
                  <button class="main_product_btn">EXPLORE</button>
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12">
          <router-link :to="{ name: 'product' }">
            <div class="main_product">
              <div class="main_product_image">
                <img src="/assets/main_product.jpg" alt="main product" width="100%" />
                <div class="overlay">
                  <p>Floor Tiles</p>
                  <button class="main_product_btn">EXPLORE</button>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MainProduct",
};
</script>
<style lang="scss" scoped>
.main_product {
  padding: 22px 5px 0px 5px;
}
.main_product_image {
  position: relative;
}

.overlay {
  position: absolute;
  bottom: 4px;
  background: rgba(207, 206, 202, 0.7);
  font-family: oblik;
  color: #f1f1f1;
  width: 100%;
  color: #29275b;
  font-size: 20px;
  padding: 4px 0 10px 0;
  text-align: center;
  font-weight: bold;
}

.main_product_image :hover .overlay {
  padding: 0px 0 27px 0;
}
.main_product_image :hover button {
  display: block;
}
.main_product_bg_colour {
  background-color: #f2f2f2;
  padding-bottom: 35px;
}

.main_product_btn {
  width: 70%;
  text-transform: uppercase;
  font-family: Arial;
  font-weight: bold;
  margin: 0 auto !important;
  background: transparent;
  display: none;
  color: #29275b;
  font-size: 14px;
  margin-top: 10px;
  border-radius: 3px;
  padding: 15px;
  border: 2px solid #29275b;
}
</style>

