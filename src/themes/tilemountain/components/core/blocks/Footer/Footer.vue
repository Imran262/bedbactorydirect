<template>
  <footer :class="{ 'brdr-top-1 brdr-cl-secondary': isCheckoutPage }">
    <div>
      <trustPoilet :identifier="'trust-pilot'" />
      <!-- v-if="!isSuccess" -->
    </div>
    <div class="footer-main" id="footer-main-desktop" v-if="windowWidth >= 768">
      <div class="container">
        <div class="row">
          <footerlink :identifier="'tm_footer_links'" />
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <div class="row">
              <div class="col-xs-12 col-sm-6 col-md-12 col-lg-12">
                <h2>Follow Us</h2>
                <div class="social">
                  <a
                    title="Facebook Page link"
                    class="fb"
                    href="https://www.facebook.com/TileMountainUK"
                    target="_blank"
                    rel="noopener"
                  >
                    <div class="circle facebook">
                      <i class="fa fa-facebook" />
                    </div>
                  </a>
                  <a
                    title="Twitter Page link"
                    class="twt"
                    href="https://twitter.com/TileMountainUK"
                    target="_blank"
                    rel="noopener"
                  >
                    <div class="circle twitter">
                      <i class="fa fa-twitter" />
                    </div>
                  </a>
                  <a
                    title="Instagram link"
                    class="insta"
                    href="https://www.instagram.com/bedfactorydirect"
                    target="_blank"
                    rel="noopener"
                  >
                    <div class="circle instagram">
                      <i class="fa fa-instagram" />
                    </div>
                  </a>
                  <a
                    title="Pinterest link"
                    href="https://www.pinterest.co.uk/bedfactorydirect/"
                    target="_blank"
                    rel="noopener"
                  >
                    <div class="circle pinterest">
                      <i class="fa fa-pinterest-p" />
                    </div>
                  </a>
                  <a
                    title="Youtube Channel link"
                    class="yt"
                    href="https://www.youtube.com/channel/UCCkGBpvAdflgqVvfV8zZYMw/"
                    target="_blank"
                    rel="noopener"
                  >
                    <div class="circle youtube">
                      <i class="fa fa-play" aria-hidden="true" />
                    </div>
                  </a>
                  <a
                    title="Linkedin Profile link"
                    class="link"
                    href="https://www.linkedin.com/company/tile-mountain-limited/"
                    target="_blank"
                    rel="noopener"
                  >
                    <div class="circle linkedin">
                      <i class="fa fa-linkedin" />
                    </div>
                  </a>
                </div>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-12 col-lg-12">
                <h2 class="acceptedcards">Accepted Cards</h2>
                <div class="acccards">
                  <img v-lazy="this.cardsAccept" alt="payments" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mobile-footer" v-else>
      <div class="container-fluid1">
        <div class="row">
          <div class="col">
            <footerlinkmobile :identifier="'tm_footer_links'" />
            <div class="tabset">
              <div class="tab-panels">
                <section id="huge-variety" class="tab-panel">
                  <input type="checkbox" id="chck4" />
                  <label class="tab-label" for="chck4">Follow Us</label>
                  <div class="content socialicons">
                    <div class="social">
                      <div class="circle facebook">
                        <a
                          class="fb"
                          href="https://www.facebook.com/TileMountainUK"
                          target="_blank"
                          rel="noopener"
                        >
                          <i class="fa fa-facebook" />
                        </a>
                      </div>
                      <div class="circle twitter">
                        <a
                          class="twitter"
                          href="https://twitter.com/TileMountainUK"
                          target="_blank"
                          rel="noopener"
                        >
                          <i class="fa fa-twitter" />
                        </a>
                      </div>
                      <div class="circle instagram">
                        <a
                          class="instagram"
                          href="https://www.instagram.com/bedfactorydirect"
                          target="_blank"
                          rel="noopener"
                        >
                          <i class="fa fa-instagram" />
                        </a>
                      </div>
                      <div class="circle pinterest">
                        <a
                          href="https://www.pinterest.co.uk/bedfactorydirect/"
                          target="_blank"
                          rel="noopener"
                        >
                          <i class="fa fa-pinterest-p" />
                        </a>
                      </div>
                      <div class="circle youtube">
                        <a
                          class="youtube"
                          href="https://www.youtube.com/channel/UCCkGBpvAdflgqVvfV8zZYMw/"
                          target="_blank"
                          rel="noopener"
                        >
                          <i class="fa fa-play" aria-hidden="true" />
                        </a>
                      </div>
                      <div class="circle linkedin">
                        <a
                          class="linkedin"
                          href="https://www.linkedin.com/company/tile-mountain-limited/"
                          target="_blank"
                          rel="noopener"
                        >
                          <i class="fa fa-linkedin" />
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
                <section id="huge-variety" class="tab-panel tab-panel-two">
                  <input type="checkbox" id="chck5" />
                  <label class="tab-label" for="chck5">Accepted Cards</label>
                  <div class="content socialicons">
                    <img
                      v-lazy="cardsAccept"
                      class="mobilepaymentcards"
                      alt="payments"
                    />
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid copyright">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <small>
            <p class="copyright1">
              &#169; {{ getCurrentYear }} Tile Mountain Ltd
            </p>
          </small>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  currentStoreView,
  localizedRoute
} from '@vue-storefront/core/lib/multistore'
import CurrentPage from 'theme/mixins/currentPage'
import trustPoilet from 'theme/components/core/blocks/trustPoilet/trustPoilet'
import LanguageSwitcher from '../../LanguageSwitcher.vue'
import BackToTop from 'theme/components/core/BackToTop'
import { getPathForStaticPage } from 'theme/helpers'
import config from 'config'
// import CmsBlock from "theme/components/core/blocks/Cms/Block";
import footerlink from 'theme/components/core/blocks/Cms/FooterLinks'
import footerlinkmobile from 'theme/components/core/blocks/Cms/FooterLinkMobile'
import BlockTitle from 'theme/components/core/blocks/Cms/BlockTitle'

export default {
  mixins: [CurrentPage, footerlink, footerlinkmobile],
  name: 'MainFooter',
  data () {
    return {
      cardsAccept: '/assets/images/payments.svg',
      windowWidth: 0
    }
  },
  beforeMount () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  methods: {
    handleResize () {
      this.windowWidth = window.innerWidth
    },
    goToAccount () {
      this.$bus.$emit('modal-toggle', 'modal-signup')
    },
    getLinkFor (path) {
      return localizedRoute(getPathForStaticPage(path))
    }
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      isLogged: 'user/isLoggedIn',
      totals: 'cart/getTotals'
    }),
    multistoreEnabled () {
      return config.storeViews.multistore
    },
    getVersionInfo () {
      return `v${process.env.__APPVERSION__} ${process.env.__BUILDTIME__}`
    },
    getCurrentYear () {
      return new Date().getFullYear()
    }
  },
  components: {
    LanguageSwitcher,
    BackToTop,
    footerlink,
    footerlinkmobile,
    // CmsBlock,
    // CustomerServiceBlock,
    BlockTitle,
    trustPoilet
  }
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'Oblik';
  src: url('/assets/fonts/Oblik_Bold.otf');
  font-display: block;
}

@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-secondary: color(secondary);
// my customization for footr starts here
.footer-main {
  padding: 20px 0 36px;
  background-color: #606060;
}
.footer-main h2 {
  font-family: 'Oblik';
  color: #ffff;
  font-size: 22px;
  font-weight: bold;
  padding-top: 62px;
  padding-bottom: 19px;
  margin: 0;
}
.footer-main .acceptedcards {
  font-size: 20px;
  padding-bottom: 27px;
}
input {
  position: absolute;
  opacity: 0;
  z-index: -1;
}
.row {
  display: flex;
  .col {
    flex: 1;
    &:last-child {
      margin-left: 1em;
    }
  }
}
.tabs {
  overflow: hidden;
  margin-left: -22px;
  margin-right: -6px;
}
input:checked {
  + .tab-label {
    background: #606060;
    color: #ffffff;
    &::after {
      font-family: FontAwesome;
      content: '\f068';
    }
  }
  ~ .tab-content {
    max-height: 100vh;
    padding-top: 1px;
    background-color: #f2f2f2;
    font-family: 'Arial';
  }
}
.tabset > input[type='radio'] {
  position: absolute;
  left: -200vw;
}
.tabset > input:first-child:checked ~ .tab-panels > .tab-panel:first-child,
.tabset > input:nth-child(3):checked ~ .tab-panels > .tab-panel:nth-child(2),
.tabset > input:nth-child(5):checked ~ .tab-panels > .tab-panel:nth-child(3),
.tabset > input:nth-child(7):checked ~ .tab-panels > .tab-panel:nth-child(4),
.tabset > input:nth-child(9):checked ~ .tab-panels > .tab-panel:nth-child(5),
.tabset > input:nth-child(11):checked ~ .tab-panels > .tab-panel:nth-child(6) {
  display: block;
}
.tabset > label {
  position: relative;
  display: inline-block;
  padding: 15px 15px 25px;
  border: 1px solid transparent;
  border-bottom: 0;
  cursor: pointer;
  color: white;
}
.tabset > label::after {
  content: '';
  position: absolute;
  left: 0px;
  bottom: 18px;
  width: 100%;
  height: 2px;
}
.tabset > label:hover,
.tabset > input:focus + label {
  color: white;
}
.tabset > label:hover::after,
.tabset > input:focus + label::after,
.tabset > input:checked + label::after {
  border-bottom: 2px solid #00998c;
}
.tabset > input:checked + label {
  border-color: #fff;
  border-bottom: 2px solid #fff;
  margin-bottom: -1px;
}
.tab-panel {
  padding: 15px 0;
}
*,
*:before,
*:after {
  box-sizing: border-box;
}
.tabset {
  max-width: 65em;
  text-align: center;
}
p {
  text-align: center;
  color: #54575b;
}
@media (min-width: 768px) {
  .tab-panels input,
  .tab-panels .tab-label {
    display: none;
  }
}
@media (max-width: 767px) {
  #tab1,
  #tab2,
  #tab3,
  .desktop {
    display: none !important;
  }
  section {
    background-color: #606060;
  }
  input {
    position: absolute;
    opacity: 0;
    z-index: -1;
  }
  .tab-label {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    color: #ffffff;
    font-size: 2.933vw;
  }
  .tab-label::after {
    font-family: FontAwesome;
    content: '\f067';
    width: 1em;
    height: 1em;
    text-align: center;
    -webkit-transition: all 0.35s;
    transition: all 0.35s;
    font-size: 9px;
    margin-top: 5px;
  }
  .content {
    text-align: left;
    line-height: 20px;
    font-size: 14px;
    -webkit-transition: all 0.35s;
    transition: all 0.35s;
    display: none;
    padding-left: 20px;
    margin-top: 10px;
  }
  input:checked + .tab-label::after {
    font-family: FontAwesome;
    content: '\f068';
    color: #ffffff;
  }
  input:checked ~ .content {
    display: block;
  }
  input:checked ~ .socialicons {
    text-align: center;
  }
  .tabset .tab-panel {
    display: block !important;
    width: 100%;
    float: left;
    margin-left: -8px;
    padding: 1px 0px;
    border-bottom: 2px solid white;
  }
  .tab-panel-two {
    border: none !important;
  }
}
@media screen and (min-width: 320px) and (max-width: 480px) {
  .tab-label {
    font-size: 3vw;
  }
}
#footer-main-desktop i.fa.fa-play {
  margin-left: 9px;
  margin-top: 2px;
}
#footer-main-desktop a:hover {
  text-decoration: none !important;
}
#footer-main-desktop a.underline:after,
#footer-main-desktop a:not(.no-underline):hover:after {
  background-color: transparent;
}
.social {
  margin-top: 6px !important;
}
.circle {
  height: 64px;
  width: 64px;
  background: #9d9d9d;
  border-radius: 50%;
  display: inline-block;
  margin-right: 17px;
  margin-bottom: 25px;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.circle:nth-child(3n + 3) {
  margin-right: 0;
}
.pinterest,
.youtube,
.linkedin {
  margin-bottom: 8px !important;
}
@media screen and (min-width: 992px) and (max-width: 1046px) {
  .circle {
    margin-right: 0px !important;
  }
  .fa-facebook[data-v-9d635ab6] {
    margin-left: 6px;
  }
  .fa-instagram,
  .fa-linkedin,
  .fa-twitter {
    margin-left: 3px;
    margin-top: 0px;
  }
}
@media screen and (min-width: 992px) and (max-width: 1199px) {
  .footer-main .acceptedcards {
    font-size: 19px;
  }
}
.fa {
  color: #434243;
  font-size: 30px;
}
.footer-main .social .instagram:hover {
  background: #e1306c;
}
.footer-main .social .linkedin:hover {
  background: #0077b5;
}
.footer-main .social .pinterest:hover {
  background: #bd081c;
}
.footer-main .social .facebook:hover {
  background: #3b5999;
}
.footer-main .social .play:hover {
  background: #cd201f;
}
.footer-main .social .youtube:hover {
  background: #cd201f;
}
.footer-main .social .twitter:hover {
  background: #55acee;
}
.footer-main .social .instagram:hover .fa,
.footer-main .social .linkedin:hover .fa,
.footer-main .social .pinterest:hover .fa,
.footer-main .social .facebook:hover .fa,
.footer-main .social .youtube:hover .fa,
.footer-main .social .twitter:hover .fa {
  color: #fff;
}
.copyright {
  background-color: #444444;
  height: 86px;
}
.copyright1 {
  color: #fff;
  text-align: center;
  padding-top: 14px;
  font-size: 19px;
  font-family: 'Arial';
}
@media screen and (max-width: 767px) {
  .copyright {
    height: auto;
  }
  .copyright1 {
    font-size: 2.4vw;
    padding-top: 8px;
    padding-bottom: 8px;
  }
}
$midnight: #2c3e50;
$clouds: #ecf0f1;
body {
  color: $midnight;
  background: $clouds;
  padding: 0 1em 1em;
}
h2 {
  margin: 0 0 0.5em;
  font-weight: normal;
}
.acccards img {
  width: 100%;
}
.container-fluid1 {
  padding-left: 0px;
  padding-right: 0px;
}
@media screen and (max-width: 767px) {
  .footer-main {
    display: none;
  }
  .mobile-footer {
    display: block;
  }
  ul {
    padding: 0;
    margin-top: 15px !important;
    list-style: none;
  }
  ul li {
    margin: 10px 0 !important;
    color: #414043;
    font-size: 18px;
    font-family: 'oblik';
  }
}
@media screen and (min-width: 768px) {
  .footer-main {
    display: block;
  }
  .mobile-footer {
    display: none;
  }
  .sociallinks {
    display: none;
  }
}
@media screen and (max-width: 767px) {
  .mobilepaymentcards {
    width: 86%;
    padding-left: 0px;
  }
  .social {
    display: inline;
  }
  .sociallinks {
    display: block;
  }
  .fa-linkedin {
    padding-top: 0px;
  }
  .fa-pinterest-p {
    margin-top: 3px;
  }
  i.fa.fa-play {
    margin-left: 7px;
  }
  .pinterest,
  .youtube,
  .linkedin {
    margin-bottom: 0 !important;
  }
}
.sociallinks {
  text-align: center;
  margin-top: 11px;
}
@media only screen and (min-width: 1200px) {
  .container {
    width: 1280px !important;
    max-width: 100% !important;
  }
}
@media only screen and (min-width: 320px) and (max-width: 328px) {
  .circle {
    height: 37px;
    width: 37px;
    padding: 0px;
    margin-left: 2px;
    margin-right: 7px !important;
  }
}
@media only screen and (min-width: 329px) and (max-width: 500px) {
  .circle {
    height: 41px;
    width: 41px;
    padding: 3px;
    margin-left: 2px;
    margin-right: 5px !important;
  }
}
@media screen and (min-width: 320px) and (max-width: 480px) {
  .copyright1 {
    font-size: 3.1vw;
    padding-top: 12px;
    padding-bottom: 12px;
  }
}
.tab {
  margin-bottom: -13px;
  width: 100%;
  color: white;
  overflow: hidden;

  &-label {
    font-family: 'oblik';
    display: flex;
    content: '\f068';
    justify-content: space-between;
    padding: 1em;
    background: #606060;
    font-size: 3vw;

    cursor: pointer;
    &::after {
      font-family: FontAwesome;
      content: '\f067';
      width: 1em;
      height: 1em;
      text-align: center;
      transition: all 0.35s;
      font-size: 9px;
      margin-top: 10px;
      border: none;
    }
  }

  &-content {
    max-height: 0;
    padding: 0 1em;
    color: #2c3e50;
    background: white;
    transition: all 0.35s;
  }

  &-close {
    display: flex;
    justify-content: flex-end;
    padding: 1em;
    font-size: 0.75em;
    cursor: pointer;

    &:hover {
      background: darken(#2c3e50, 10%);
    }
  }
}
</style>
