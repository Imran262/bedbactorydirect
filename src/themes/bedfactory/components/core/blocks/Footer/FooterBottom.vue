<template>
  <div class="flex">
    <div class="container footer-bottom-main">
      <div class="row">
        <cms-block :identifier="'footer-bottom'" class="col-md-12" />
      </div>
    </div>
  </div>
</template>
<script>
import CmsBlock from "theme/components/core/blocks/Cms/Block";
export default {
  name: "FooterBottom",
  components: {
    CmsBlock
  }
};
</script>
<style>
.container.footer-bottom-main {
  width: 1280px !important;
  /* margin-bottom: 50px; */
}

.footer-payment-copyright-inner {
  padding: 0;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.footer-payment-icons h5 {
  color: #54575b;
  font-size: 16px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  margin-bottom: 10px;
}

.footer-payment-icons ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer-payment-icons ul li {
  display: inline-block;
}

.footer-copy-right h6 {
  color: #54575b;
  font-size: 12px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  text-align: right;
  margin-bottom: 0px;
}
.footer-copy-right h6:last-child {
  margin-top: 5px;
}

.footer-copy-right p:first-child {
  margin-top: 26px;
}

@media (max-width: 767px) {
  .footer-payment-copyright-inner {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }

  .footer-copy-right {
    padding: 0 20px;
  }

  .footer-copy-right h6 {
    text-align: left !important;
  }
}
</style>
