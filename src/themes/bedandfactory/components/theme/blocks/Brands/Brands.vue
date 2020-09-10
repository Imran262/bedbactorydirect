<template>
  <div class="brands">
    <div class="container">
      <Branddetail identifier="brands" />
    </div>
  </div>
</template>

<script>
import CmsBlock from "theme/components/core/blocks/Cms/Block";
import Branddetail from "theme/components/theme/blocks/Brands/Branddetail";
export default {
  components: {
    CmsBlock,
    Branddetail,
  },
};
</script>
<style>
.brands-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
}
.brands-inner a:hover::after {
  content: unset;
}
.brands-inner a ul {
  /* display: flex;
  
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap; */
  padding: 0;
}
.brands-inner a ul li {
  list-style-type: none;
  padding-right: 70px;
}
.brands-inner ul li {
  list-style-type: none;
}
.brands-inner a ul li a:hover:after {
  content: unset;
}
.brands-inner a:nth-child(6n + 6) ul li {
  padding-right: 0;
}
@media only screen and (min-device-width: 320px) and (max-device-width: 767px) {
  .brands-inner a ul li {
    padding-right: 0;
  }
  .brands-inner {
    justify-content: space-around;
  }
}
</style>
