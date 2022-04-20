<template>
  <div class="familiar-brands">
    <div class="container">
      <Productlist :identifier="'Familiar-Brands'" />
    </div>
  </div>
</template>

<script>
import Productlist from "theme/components/core/blocks/FamiliarProducts/ProductList";

export default {
  components: {
    Productlist
  }
};
</script>
<style lang="scss">
.rockBottom {
  background-color: #ff9000 !important;
}
.rockBottom h3 {
  color: #fff !important;
}
.rockBottom .main_product_btn {
  border: 2px solid #fff;
  color: #fff;
}
@media (min-width: 767px) {
  .familiar-brands {
    background: #f1f1f1;
    padding: 0 0 0 0;
    padding-top: 1%;

    .desktop {
      text-align: center;
      font-size: 26px;
      font-weight: 700;
      text-transform: uppercase;
      color: #54575b;
      margin-bottom: 55px;
    }

    .mobile {
      display: none;
    }

    a.underline:after,
    a:not(.no-underline):hover:after {
      background-color: transparent !important;
    }
  }
}

@media (max-width: 767px) {
  .familiar-brands {
    background: #fff;
    padding: 0;
    margin-top: 0;

    .desktop {
      display: none;
    }

    .mobile {
      text-align: center;
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      color: #54575b;
      letter-spacing: 1px;
    }
    a.underline:after,
    a:not(.no-underline):hover:after {
      background-color: transparent !important;
    }
  }
}
</style>
