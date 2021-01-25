<template>
  <footer class="footer-main">
    <div class="footer-links flex pt30 pb60 px40 bg-cl-secondary">
      <div class="footer-container-main container">
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 footer-left">
            <div class="footer-left-content">
              <div class="row">
                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                  <div class="footer-left-block">
                    <h3 @click="FootershowList">
                      <BlockTitle :identifier="'vue-footer-block-1'" />
                      <img
                        id="footer-ul-open-icon-1"
                        class="hidden-lg hidden-md"
                        src="/assets/footer/footer-mobile-link-icon.png"
                      />
                    </h3>
                    <ul v-if="FooterlistShow1" id="ul-list-1">
                      <FooterLink :identifier="'vue-footer-block-1'" />
                    </ul>
                  </div>
                </div>
                <!-- <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                  <div class="footer-left-block">
                    <h3 @click="FootershowList2">
                      <BlockTitle :identifier="'vue-footer-block-2'" />
                      <img
                        class="hidden-lg hidden-md"
                        id="footer-ul-open-icon-2"
                        src="/assets/footer/footer-mobile-link-icon.png"
                      />
                    </h3>
                    <ul v-if="FooterlistShow2" id="ul-list-2">
                      <FooterLink :identifier="'vue-footer-block-2'" />
                    </ul>
                  </div>
                </div> -->
                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                  <div class="footer-left-block">
                    <h3 @click="FootershowList3">
                      <BlockTitle :identifier="'vue-footer-block-3'" />
                      <img
                        id="footer-ul-open-icon-3"
                        class="hidden-lg hidden-md"
                        src="/assets/footer/footer-mobile-link-icon.png"
                      />
                    </h3>
                    <ul v-if="FooterlistShow3" id="ul-list-3">
                      <FooterLink :identifier="'vue-footer-block-3'" />
                    </ul>
                   
                  </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                  <div class="footer-left-block">
                    <h3 @click="FootershowList2">
                      <BlockTitle :identifier="'vue-footer-block-5'" />
                      <img
                        class="hidden-lg hidden-md"
                        id="footer-ul-open-icon-2"
                        src="/assets/footer/footer-mobile-link-icon.png"
                      />
                    </h3>
                    <ul v-if="FooterlistShow2" id="ul-list-2">
                      <FooterLink :identifier="'vue-footer-block-5'" />
                    </ul>
                  </div>
                </div>
              </div>
            </div>



             <div class="follow-us col-lg-12 col-md-12 col-sm-12 col-xs-12">
               <div class="follow-us-inner">
                      <h2>
                        <BlockTitle :identifier="'vue-footer-block-4'" />
                      </h2>
                      <ul id="ul-list-4">
                        <FollowUsLik :identifier="'vue-footer-block-4'" />
                      </ul>
                    </div>
                    </div>
                    </div>
          </div>

          <div class="clearfix" />
        </div>
      </div>
    </div>
    <FooterBottom />
    <back-to-top bottom="20px" right="20px" visibleoffset="200">
      <button
        type="button"
        class="btn-top button no-outline brdr-none cl-white bg-cl-mine-shaft :bg-cl-th-secondary py10 px10"
      >
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fill-rule="evenodd"
          clip-rule="evenodd"
        >
          <path
            d="M23.245 20l-11.245-14.374-11.219 14.374-.781-.619 12-15.381 12 15.391-.755.609z"
            fill="white"
          />
        </svg>
      </button>
    </back-to-top>
  </footer>
</template>

<script>
import { mapGetters } from "vuex";
import {
  currentStoreView,
  localizedRoute,
} from "@vue-storefront/core/lib/multistore";
import CurrentPage from "theme/mixins/currentPage";
import LanguageSwitcher from "../../LanguageSwitcher.vue";
import BackToTop from "theme/components/core/BackToTop";
import { getPathForStaticPage } from "theme/helpers";
import config from "config";
import FooterBottom from "theme/components/core/blocks/Footer/FooterBottom";
import CmsBlock from "theme/components/core/blocks/Cms/Block";
import BlockTitle from "theme/components/core/blocks/Cms/BlockTitle";
import FooterLink from "theme/components/core/blocks/Footer/FooterLink";
import FollowUsLik from "theme/components/core/blocks/Footer/FollowUsLink";
import NewsLetter from "theme/components/core/blocks/Footer/NewsLetter";
export default {
  data() {
    return {
      FooterlistShow1: true,
      FooterlistShow2: true,
      FooterlistShow3: true,
      FooterlistShow4: true,
    };
  },
  mixins: [CurrentPage],
  name: "MainFooter",
  methods: {
    FootershowList() {
      if (screen.width <= 767) {
        document.getElementById("ul-list-1").classList.toggle("is-open");
        document
          .getElementById("footer-ul-open-icon-1")
          .classList.toggle("icon-rotate");
        // this.FooterlistShow1 = !this.FooterlistShow1;
      } else {
        // this.FooterlistShow1 = this.FooterlistShow1;
      }
    },
    FootershowList2() {
      if (screen.width <= 767) {
        document.getElementById("ul-list-2").classList.toggle("is-open");
        document
          .getElementById("footer-ul-open-icon-2")
          .classList.toggle("icon-rotate");
        // this.FooterlistShow2 = !this.FooterlistShow2;
      } else {
        // this.FooterlistShow2 = this.FooterlistShow2;
      }
    },
    FootershowList3() {
      if (screen.width <= 767) {
        document.getElementById("ul-list-3").classList.toggle("is-open");
        document
          .getElementById("footer-ul-open-icon-3")
          .classList.toggle("icon-rotate");
        // this.FooterlistShow3 = !this.FooterlistShow3;
      } else {
        // this.FooterlistShow3 = this.FooterlistShow3;
      }
    },
    FootershowList4(event) {
      if (screen.width <= 767) {
        document.getElementById("ul-list-4").classList.toggle("is-open");
        document
          .getElementById("footer-ul-open-icon-4")
          .classList.toggle("icon-rotate");
        // this.FooterlistShow4 = !this.FooterlistShow4;
      } else {
        // this.FooterlistShow4 = this.FooterlistShow4;
      }
    },
    goToAccount() {
      this.$bus.$emit("modal-toggle", "modal-signup");
    },
    getLinkFor(path) {
      return localizedRoute(getPathForStaticPage(path));
    },
  },
  computed: {
    ...mapGetters({
      isLogged: "user/isLoggedIn",
    }),
    multistoreEnabled() {
      return config.storeViews.multistore;
    },
    getVersionInfo() {
      return `v${process.env.__APPVERSION__} ${process.env.__BUILDTIME__}`;
    },
  },
  components: {
    LanguageSwitcher,
    BackToTop,
    FooterBottom,
    CmsBlock,
    BlockTitle,
    FooterLink,
    FollowUsLik,
    NewsLetter
  },
};
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";

/*Footer Custom Css*/
.container.footer-container-main {
  width: 1280px;
  max-width: 100%;
  position: relative;
}

.footer-left-content .col-lg-4.col-md-4.col-sm-12.col-xs-12 {
  padding: 0;
      display: flex;
    justify-content: center;
}
.footer-left-color {
  background-color: #54575b;
  width: calc(27% - 185px);
  position: absolute;
  left: 0;
  height: calc(100% - 0px);
  top: 0;
  z-index: 0;
}

.footer-right-color {
  position: absolute;
  right: 0;
  background-color: #f1f1f1;
  height: calc(100% - 0px);
  width: calc(27% - 185px);
  z-index: 0;
}

footer.footer-main {
  position: relative;
}

.footer-left-content {
  background: #54575b;
  width: 100%;
}

.col-lg-8.col-md-8.col-sm-12.col-xs-12.footer-left {
  padding: 0;
  background: #fff;
}

.col-lg-8.col-md-8.col-sm-12.col-xs-12.footer-left:after {
  background-color: #54575b;
  left: -999em;
  content: "";
  display: block;
  position: absolute;
  width: 999em;
  top: 0;
  bottom: 0;
}

.col-lg-4.col-md-4.col-sm-12.col-xs-12.footer-right:after {
  background-color: #f1f1f1;
  right: -1000em;
  content: "";
  display: block;
  position: absolute;
  width: 999em;
  top: 0;
  bottom: 0;
}

.footer-left-block h3 {
  font-size: 1rem;
  color: #fff;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
  margin-bottom: 1.5rem;
  user-select: none;
}

.footer-left-block ul {
  padding: 0;
  list-style: none;
}

.col-lg-8.col-md-8.col-sm-12.col-xs-12.footer-left .row {
  padding: 50px 30px;
  margin: 0;
}

.follow-us ul li:before {
  content: "";
  display: none;
  margin: 0;
}

.footer-left-block .follow-us ul li {
  display: inline-block;
  padding-left: 5px;
}

.follow-us h2 {
  font-size: 1.11rem;
  color: #fff;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
  margin-bottom: 10px;
  text-align:center;
}
.follow-us ul {
  margin: 0;
}

footer.footer-main {
  margin: 40px 0px 0px 0px;
}
footer.footer-main .footer-links {
  padding: 0;
  background-color: #54575b;
}

footer.footer-main .footer-links {
  // background: #fff;
}
footer.footer-main .footer-links:before {
  content: "";
  border-top: 10px solid #54575b;
  position: absolute;
  top: -15px;
  width: 100%;
}

footer.footer-main .col-lg-4.col-md-4.col-sm-12.col-xs-12.footer-right {
  background: #f1f1f1;
  padding: 18px 47px;
}

.footer-right-inner h3 {
  font-size: 1.11rem;
  color: #54575b;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
  margin: 21px 0px;
  line-height: 1.77;
}

.footer-right-inner p {
  color: #54575b;
  margin-top: 30px;
  font-size: 1rem;
}

.enter-email-address input {
  width: 100%;
  margin: 0;
  padding: 0px 10px;
  float: left;
  border-radius: 5px 0px 0px 5px;
  height: 40px;
  border: 1px solid #cccccc;
  font-size: 16px;
  box-shadow: none;
}

.enter-email-address input:focus,
.enter-email-address input:visited {
  box-shadow: none;
  outline: none;
}

.enter-email-address button {
  background: #4dba87;
  height: 42px;
  border: 0;
  padding: 0 20px;
  border-radius: 5px;
  // position: absolute;
  // right: 0px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  display: inline;
}

.enter-email-address {
  position: relative;
  display: flex;
}

text {
  color: #000;
}

.footer-right-inner text {
  padding-top: 50px;
  float: left;
  width: 100%;
  text-align: left;
  color: #54575b;
}

.footer-right-inner text a {
  color: #4dba87;
  text-decoration: none;
  font-weight: bold;
}

.follow-us-inner {
    display: flex;
    justify-content: center;
    flex-direction: column;
}
.follow-us ul {
    margin: 0;
    display: flex;
    justify-content: center;
    padding: 0;
}


@media (max-width: 767px) {
  ul#ul-list-1.is-open {
    display: block !important;
  }

  ul#ul-list-2.is-open {
    display: block !important;
  }

  ul#ul-list-3.is-open {
    display: block !important;
  }

  ul#ul-list-1 {
    display: none;
  }

  ul#ul-list-2 {
    display: none;
  }

  ul#ul-list-3 {
    display: none;
  }
  .col-lg-4.col-md-4.col-sm-12.col-xs-12.footer-right:after {
    right: -999em;
  }
  .footer-right-inner p {
    font-size: 0.8rem;
  }
  .footer-right-inner text {
    font-size: 0.8rem;
  }
  .footer-left-content .col-lg-4.col-md-4.col-sm-12.col-xs-12 {
  
      display: inline-block;
    
}
}
/*Footer Tablet */
@media (max-width: 1100px) and (min-width: 768px) {
  .col-lg-8.col-md-8.col-sm-12.col-xs-12.footer-left .row {
    padding: 0px 10px;
  }

  .footer-left-block h3 {
    font-size: 14px;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .footer-left-block ul {
    margin: 0;
  }

  .follow-us h2 {
    font-size: 14px;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  footer.footer-main .col-lg-4.col-md-4.col-sm-12.col-xs-12.footer-right {
    padding: 10px 10px;
  }

  .footer-right-inner h3 {
    font-size: 16px;
    margin-bottom: 0px;
    margin-top: 0px;
  }

  .footer-right-inner p {
    margin-top: 5px;
    font-size: 14px;
  }

  .footer-right-inner text {
    padding-top: 10px;
    font-size: 14px;
  }
}
/*Footer Tablet */
/*Footer Mobile */
@media (max-width: 767px) {
  .col-lg-8.col-md-8.col-sm-12.col-xs-12.footer-left {
    order: 1;
  }
  .col-lg-8.col-md-8.col-sm-12.col-xs-12.footer-left .row {
    padding-left: 0 !important;
    padding-right: 0px !important;
  }
  .footer-left-content .col-lg-4.col-md-4.col-sm-12.col-xs-12:not(:last-child) {
    border-bottom: 3px solid #fff;
  }
  .footer-left-content .col-lg-4.col-md-4.col-sm-12.col-xs-12 {
    padding: 0 15px;
  }
  footer.footer-main .col-lg-4.col-md-4.col-sm-12.col-xs-12.footer-right {
    padding: 15px 15px;
  }
  .col-lg-8.col-md-8.col-sm-12.col-xs-12.footer-left .row {
    padding: 5px 15px;
  }
  .footer-left-block h3 {
    margin: 0;
  }
  .footer-left-content {
    width: 100%;
  }
  .follow-us h2 {
    margin-top: 0;
    padding: 15px 0px 0px 0px;
    font-size: 21px;
    position: relative;
  }
  .footer-left-block h3 {
    padding: 10px 0px 14px 0px;
    font-size: 1.2rem;
    position: relative;
  }
  // .enter-email-address input {
  //   width: 92%;
  // }
  .footer-right-inner h3 {
    margin: 0;
  }
  .follow-us ul {
    margin-top: 5px;
    margin-bottom: 15px;
  }
  .footer-left-block h3 img,
  .footer-left-block h2 img {
    position: absolute;
    right: 0;
    top: 13px;
    width: 12px;
    transform: rotate(-360deg);
  }
  .follow-us:before {
    content: "";
    position: absolute;
    width: 100%;
    left: 0;
    border-top: 3px solid #fff;
  }

  img.icon-rotate {
    transform: rotate(90deg) !important;
    width: 12px;
  }
}
/*Footer Mobile */
/*Footer Custom Css*/
</style>
<style>
/*BLOCK FOOTERS */
.footer-left-block li {
  padding: 2px 0px;
  color: #fff;
  line-height: 1.5;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
  position: relative;
  font-size: 0.914375rem;
}

.footer-left-block li a {
  color: #fff;
}

.footer-left-block li:before {
  content: url("/assets/footer/footer-links-arrow-icon.png");
  font-weight: bolder;
  margin-right: 10px;
}
.follow-us ul li:before {
  content: "";
  display: none;
  margin: 0;
}

.footer-left-block .follow-us ul li {
  display: inline-block;
  padding-left: 5px;
}
.follow-us ul li a:hover:after {
  text-decoration: none;
  background-color: transparent;
}
.follow-us-inner ul ul li {
    padding-right: 5px;
    list-style-type: none;
}
@media (max-width: 1200px) and (min-width: 991px) {
  .footer-left-content {
    padding: 0px 0px 100px 0px !important;
  }
}
@media (max-width: 991px) and (min-width: 768px) {
  .footer-left-block li {
    font-size: 12px;
  }
  .footer-left-content {
    padding: 0px 0px 96px 0px !important;
  }
}
/*BLOCK FOOTERS */
</style>
