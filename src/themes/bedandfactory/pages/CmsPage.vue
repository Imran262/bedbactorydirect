<template>
  <div id="cms-page">
    <UspBar />
    <!-- <header class="bg-cl-secondary py35 pl20">
      <div class="container">
        <div class="row middle-sm">
          <h1 class="col-sm-9 category-title mb10">{{ cmsPageContent.title }}</h1>
        </div>
      </div>
    </header>-->
    <div class="pb60" v-html="cmsPageContent.content" />
    <!-- <div class="container" v-if="cmsPageContent.title === 'Contact Us'">
      <SendEmail />
    </div>-->
  </div>
</template>

<script>
import CmsPage from "@vue-storefront/core/pages/CmsPage";
import UspBar from "theme/components/theme/blocks/UspBar/UspBar";
//import SendEmail from 'src/modules/vsf-sendemail-integration/components/SendEmail';

export default {
  data() {
    return {
      isClicked: false,
    };
  },
  computed: {
    cmsPageContent() {
      return this.$store.state.cmsPage.current;
    },
  },
  mixins: [CmsPage],
  mounted() {
    if (document.getElementsByClassName("accordion") != null) {
      var acc = document.getElementsByClassName("accordion");
      var i;
      for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
          this.classList.toggle("active");
          this.isClicked = !this.isClicked;
          var panel = this.nextElementSibling;
          if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
          } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
          }
        });
      }
    }
  },
  updated() {
    if (document.getElementsByClassName("accordion") != null) {
      var acc = document.getElementsByClassName("accordion");
      var i;
      for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
          this.classList.toggle("active");
          this.isClicked = !this.isClicked;
          var panel = this.nextElementSibling;
          if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
          } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
          }
        });
      }
    }
  },
  name: "ContactUs",
  components: {
    // SendEmail
    UspBar,
  },
};
</script>
<style type="text/css">
.accordion {
  background-color: #fff;
  color: #54575B;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
  transition: 0.4s;
  border-top: solid 0.1px #e7e7e7;
  font-weight: 400;
  font-family: "Poppins", sans-serif;
}

.active,
.accordion:hover {
  background-color: #fff;
}

.accordion:after {
  content: "\002B";
  color: #777;
  font-weight: 400;
  float: right;
  margin-left: 5px;
}

.active:after {
  content: "\2212";
}

.panel {
  padding: 0 18px;
  background-color: white;
  color: #54575b;
  font-size: 13px;
  font-weight: 400;
  font-family: "Poppins", sans-serif;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
}
.panel a {
  color: #00bfb2;
}
.t-title-2 {
  font-size: 1.5em;
  font-weight: 400;
  color: #53565a;
}
.t-title-1 {
  font-size: 1.5em;
  font-weight: 400;
  color: #53565a;
}
.warranty__info h2 {
  font-size: 1.5em;
  font-weight: 400;
  color: #53565a;
}
.warranty__info p {
  color: #53565a;
}
.warranty__info p b {
  font-size: 14px;
  color: #53565a;
}
.warranty__info ol li {
  color: #53565a;
  list-style-type: none;
}
.soak-returns {
  padding: 50px 0;
  font-family: "Poppins", sans-serif;
  color: #54575b;
  font-size: 14px;
  line-height: 22px;
  margin: 0;
}
.soak-col-12 h1 {
  font-weight: 600;
  padding: 5px 0;
  font-family: "Poppins", sans-serif;
  color: #54575b;
  font-size: 28px;
  line-height: 40px;
  margin: 0;
}
.soak-col-12 h2 {
  font-weight: 600;
  padding: 5px 0;
  font-family: "Poppins", sans-serif;
  color: #54575b;
  font-size: 24px;
  line-height: 36px;
  margin-bottom: 0px;
}
.soak-col-12 p {
  padding: 5px 0;
  font-family: "Poppins", sans-serif;
  color: #54575b;
  font-size: 14px;
  line-height: 22px;
  margin: 0;
}
.soak-row p {
  color: #53565a;
}
.contact-page-main.container {
  padding: 35px 15px 0px;
}
.contact-page-main.container h2 {
  font-weight: 600;
  padding: 5px 0;
  font-family: "Poppins", sans-serif;
  color: #54575b;
  font-size: 28px;
  line-height: 40px;
  margin: 0;
}
.contact-page-main.container h4 {
  font-weight: 600;
  padding: 5px 0;
  font-family: "Poppins", sans-serif;
  color: #54575b;
  font-size: 24px;
  line-height: 36px;
  margin: 0;
  display: inline-block;
}
.contact-page-main.container p {
  padding: 5px 0;
  font-family: "Poppins", sans-serif;
  color: #54575b;
  font-size: 14px;
  line-height: 22px;
  margin: 0;
}
.contact-page-main.container div {
  padding: 5px 0;
  font-family: "Poppins", sans-serif;
  color: #54575b;
  font-size: 14px;
  line-height: 22px;
  margin: 0;
}
.contact-page-main.container div.call-timings p {
  font-size: 14px;
  line-height: 22px;
}
.contact-page-main.container label {
  color: #00998c;
}

.contact-page-main.container fieldset.fieldset {
  border: 0;
  padding: 0;
}

.send-para button {
  border: 0;
  background: #00998c !important;
  color: #fff;
  padding: 10px 35px;
  font-size: 17px;
  font-family: "Poppins", sans-serif;
  display: inline-block;
  width: auto;
  min-width: auto;
  font-weight: 600;
  border-radius: 5px;
  margin-top: 10px;
}
.contact-page-main.container .actions-toolbar {
  text-align: right;
}
.delivery-page {
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.delivery-page h1 {
  font-size: 1.5em;
  font-weight: 600;
  padding: 10px 0;
  color: #53565a;
}

.delivery-page h2 {
  font-size: 1.5em;
  font-weight: 600;
  padding: 10px 0;
  color: #53565a;
}

.delivery-page p {
  margin: 10px 0;
  font-size: 12px;
  color: #53565a;
  width: 100%;
}

.delivery-page i {
  font-size: 12px;
  font-style: italic;
}
.delivery-page p em a {
  color: #4DBA87;
  text-decoration: none;
  transition: color 0.2s linear;
}
.delivery-page p a {
  color: #4DBA87;
  text-decoration: none;
  transition: color 0.2s linear;
}
.delivery-page .row {
  border-bottom: 2px solid #4DBA87;
  padding: 20px 0;
}

/* Clear floats after the columns */
.delivery-page .row:after {
  content: "";
  display: table;
  clear: both;
}

.delivery-page .columns {
  float: left;
  width: 29.3%;
  padding: 8px;
}

.delivery-page .price {
  list-style-type: none;
  border: 1px solid #eee;
  margin: 0;
  padding: 0;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}

.delivery-page .price:hover {
  box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.2);
}

.delivery-page .focus {
  box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.2);
}

.delivery-page .price .header {
  background-color: #54575b;
  color: white;
  font-size: 16px;
}

.delivery-page .price li {
  border-bottom: 1px solid #eee;
  padding: 20px;
  font-size: 13px;
  line-height: 20px;
  text-align: center;
}

.delivery-page .price .grey {
  background-color: #eee;
  font-size: 15px;
}

.delivery-page .button {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 25px;
  text-align: center;
  text-decoration: none;
  font-size: 18px;
}

/* Create two equal columns that floats next to each other */
.delivery-page .column-two {
  float: left;
  width: 48%;
  padding: 10px;
}

.delivery-page ul {
  margin: 0 30px;
  padding: 10px 0;
  list-style-type: circle;
}

.delivery-page .collapsible {
  background-color: #f4f4f4;
  color: #54575b;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
  font-family: "Poppins";
}

.delivery-page .active,
.collapsible:hover {
  background-color: #ccc;
}

.delivery-page .collapsible:after {
  content: "\002B";
  color: #54575b;
  font-weight: bold;
  float: right;
  margin-left: 5px;
}

.delivery-page .active:after {
  content: "\2212";
}

.delivery-page .content {
  padding: 0 18px;
  background-color: white;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
  color: #54575b;
  font-family: "Poppins";
  margin: 5px 0;
}
.shipping-strategy__button-group button[data-size],
.shipping-strategy__button-group span[data-size] {
  background-color: #e8e8e8;
  color: #545759;
}
.shipping-strategy__button-group button,
.shipping-strategy__button-group span {
  float: left;
  font-size: 16px;
  line-height: 65px;
  margin: 0 2px;
  border-radius: 5px;
  width: calc(25% - 4px);
  transition: opacity 0.5s;
  border: 0;
}
.shipping-strategy__header {
  font-size: 16px;
}
.shipping-strategy__row {
  margin-bottom: 18px;
}
.shipping-strategy__asset-group {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: row;
  flex-direction: row;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-pack: center;
  justify-content: center;
  margin: 0 -0.5%;
}
.shipping-strategy__asset {
  font-size: 13px;
  text-align: center;
  width: 32.33%;
  padding: 7px;
  color: #545759;
  cursor: default;
  margin: 0 0.5%;
}
.h-hidden {
  display: none !important;
}
.shipping-strategy__button-group.active button:not(.active) {
  opacity: 0.25;
}
.shipping-strategy__title {
  background-color: #545759;
  color: #fff;
  font-size: 21px;
  padding: 5px 10px;
  margin-bottom: 0;
}
.shipping-strategy__map img {
  width: 100%;
}
.shipping-strategy__header {
  font-size: 16px;
}
.shipping-strategy__postcode-form {
  display: -ms-flexbox;
  display: flex;
  width: 400px;
  white-space: nowrap;
  font-size: 16px;
  margin: 0;
}
.shipping-strategy__postcode-form label {
  -ms-flex-negative: 0;
  flex-shrink: 0;
  margin-right: 4px;
  line-height: 44px;
}
.shipping-strategy__post-input {
  position: relative;
  -ms-flex-preferred-size: 0;
  flex-basis: 0;
  -ms-flex-positive: 1;
  flex-grow: 1;
  max-width: 100%;
  display: -ms-flexbox;
  display: flex;
}
.shipping-strategy__post-input input {
  -ms-flex-preferred-size: 0;
  flex-basis: 0;
  -ms-flex-positive: 1;
  flex-grow: 1;
  max-width: 100%;
}
.shipping-strategy__post-input button {
  width: auto;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  padding: 0 12px;
  margin-left: 4px;
  border: 0;
}

.ac-button-main {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: antialiased;
  font-smooth: always;
  font-family: Poppins, Helvetica, Arial, sans-serif;
  line-height: 4.5rem;
  padding: 0 4rem;
  text-transform: capitalize;
  border-radius: 2px;
  transition: all 0.15s linear;
  font-size: 1.5rem;
  font-weight: 500;
  background-color: #4DBA87;
  color: #fff;
}
.shipping-strategy__row.m-has-form {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: row;
  flex-direction: row;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -ms-flex-align: center;
  align-items: center;
  margin-bottom: 30px;
}
.shipping-strategy__button-group button[data-zone].m-zone-1 {
  background-color: #545759;
}
.shipping-strategy__button-group button[data-zone].m-zone-0 {
  background-color: #00bfb2;
}
.shipping-strategy__button-group button[data-zone].m-zone-2 {
  background-color: #007573;
}
.shipping-strategy__button-group button[data-zone].m-zone-3 {
  background-color: #d90046;
}
.shipping-strategy__button-group button[data-zone],
.shipping-strategy__button-group span[data-zone] {
  color: #fff;
}
.ac-button-main:hover {
  background-color: #007672;
  color: #fff;
}
.warranty__image {
  -ms-flex: 0 0 130px;
  flex: 0 0 130px;
  max-width: 130px;
}
.warranty__info {
  -ms-flex-preferred-size: 0;
  flex-basis: 0;
  -ms-flex-positive: 1;
  flex-grow: 1;
  max-width: 100%;
}
.warranty {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: row;
  flex-direction: row;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  clear: both;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebedef;
  margin-bottom: 20px;
}
.content-asset p {
  color: #53565a;
}
.warranty__info ol {
  margin: 0;
  padding: 0;
}
.content-asset p a {
  color: #00bfb2;
}
.js-accordion {
  margin: 0 0 3rem;
  text-align: center;
  width: 100%;
}
.js-accordion .accordion__heading {
  color: #4DBA87;
  font-family: Poppins, Helvetica, Arial, sans-serif;
  font-weight: 500;
  margin: 2rem 0 1rem;
  text-align: center;
  width: 100%;
  font-size: 2rem;
}
.accordion__description {
  max-width: 85%;
  font-weight: 500;
  display: block;
  max-width: 100%;
  margin: 0 auto 1rem;
  font-size: 1rem;
  line-height: 1.6;
  height: 4.48rem;
  overflow: hidden;
  transition: 0.2s height;
}
.accordion__toggle {
  color: #007672;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
}
.accordion__toggle:hover {
  text-decoration: underline;
}
.ccontent--3col {
  display: flex;
  width: 100%;
}
.ccontent--3col__col {
  margin: 1rem 0 0;
  max-width: 31.3333%;
  margin-right: 1rem;
}
.this-shopby {
  position: relative;
  border-radius: 0.3rem;
}
.this-shopby a {
  text-decoration: none;
}

.this-shopby a:not(.no-underline):hover:after {
  content: none;
}
.this-shopby img {
  width: 100%;
}
.this-shopby span.abtns {
  position: absolute;
  bottom: 2rem;
  width: calc(100% - 4rem);
  left: 2rem;
  box-sizing: border-box;
  background: #54575b;
  color: #fff;
  font-size: 1.2rem;
  line-height: 4.5rem;
  display: block;

  margin: 0 auto;
  text-align: center;

  letter-spacing: 0.5px;
  text-decoration: none;
  line-height: 3rem;
  border-radius: 2px;
  transition: 0.2s all;
  font-weight: 400;
  padding: 0 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.this-shopby span.abtns:hover {
  background: #3c3e40;
}

@media (max-width: 415px) {
  .shipping-strategy__button-group button,
  .shipping-strategy__button-group span {
    font-size: 10px;
  }
}

@media only screen and (max-width: 600px) {
  .delivery-page .columns {
    width: 100%;
  }

  .delivery-page .column-two {
    width: 100%;
  }
  .delivery-page {
    margin-left: 20px;
    margin-right: 20px;
  }
}
@media only screen and (max-width: 767px) {
  .warranty__image {
    -ms-flex: 0 0 100%;
    flex: 0 0 100%;
    max-width: 100%;
    text-align: center;
    margin-bottom: 20px;
  }
  .warranty__info {
    -ms-flex: 0 0 100%;
    flex: 0 0 100%;
    max-width: 100%;
  }
  .ccontent--3col {
    flex-direction: column;
  }
  .ccontent--3col__col {
    max-width: 100%;
    margin-right: 0;
  }
}
@media (min-width: 768px) and (max-width: 992px) {
  .ccontent--3col__col {
    max-width: 49%;
    flex: 1 0 auto;
  }
  .ccontent--3col__col:last-child {
    margin-right: 0;
  }
}
@media (min-width: 993px) and (max-width: 1024px) {
  .ccontent--3col__col:last-child {
    margin-right: 0;
  }
  .ccontent--3col__col {
    max-width: 32.3333%;
  }
  .this-shopby span.abtns {
    left: 2rem;
    line-height: 3rem;
    padding: 0;
    font-size: 1rem;
    bottom: 1rem;
  }
}
@media (min-width: 1025px) and (max-width: 1200px) {
  .this-shopby span.abtns {
    bottom: 1rem;
    font-size: 1rem;
    padding: 0;
  }
}
</style>
