<template>
  <div id="cms-page" :class="selectClasssforcolor(cmsPageContent.identifier)">
    <div
      class="breadcrumbs"
      :class="
        cmsPageContent.identifier == 'clearance_sales' ||
        cmsPageContent.identifier == 'deliveryinfo'
          ? 'breadcrumbs-new'
          : 'breadcumbs-old'
      "
      :id="
        cmsPageContent.identifier == 'clearance_sales'
          ? 'breadcrumbs-hide'
          : 'breadcrumbs-show'
      "
    >
    <div itemscope itemtype="http://schema.org/Organization">
      <meta itemprop="name" content="Tile Mountain" />
      <meta itemprop="url" content="https://www.tilemountain.co.uk/" />
      <meta
        v-for="socialLink in socialLinksSchema"
        :key="socialLink"
        itemprop="sameAs"
        :content="socialLink"
      />
    </div>
    <div itemscope itemtype="http://schema.org/WebSite">
      <meta itemprop="name" content="Tile Mountain" />
      <meta itemprop="url" content="https://www.tilemountain.co.uk/" />
    </div>
      <div class="container">
        <ul>
          <li class="home">
            <a href="/" title="Go to Home Page">Home</a>
            <span>/ </span>
          </li>

          <li class="cms_page">
            <strong>{{ cmsPageContent.title }}</strong>
          </li>
        </ul>
      </div>
    </div>
    <template v-if="cmsPageContent.identifier == 'portico'">
      <div class="pb10" :class="selectClasss(cmsPageContent.identifier)">
        <portico
          :content="cmsPageContent.content"
          :select-class="selectClasss(cmsPageContent.identifier)"
        />
      </div>
    </template>
    <template v-else-if="cmsPageContent.identifier == 'clearance'">
      <div class="pb10" :class="selectClasss(cmsPageContent.identifier)">
        <clearance
          :content="cmsPageContent.content"
          :select-class="selectClasss(cmsPageContent.identifier)"
        />
      </div>
    </template>
    <template v-else>
      <div
        class="pb10"
        :class="selectClasss(cmsPageContent.identifier)"
        v-html="cmsPageContent.content"
    /></template>
  </div>
</template>

<script>
import CmsPage from '@vue-storefront/core/pages/CmsPage'
import CurrentPage from 'theme/mixins/currentPage'
import portico from 'theme/components/Portico'
import clearance from 'theme/components/Clearance'
import Head from 'theme/head'
import config from 'config'
import { MeasureProductClick } from 'src/modules/google-gtag/mixins/MeasureProductClick'
export default {
  mixins: [CurrentPage, CmsPage, MeasureProductClick],
  components: {
    portico,
    clearance
  },
  data () {
    return {
      showdesc: false
    }
  },
  mounted () {
    this.showportico()
    this.hideportico()
    this.addevent1()
    this.addevent2()
    this.loadreviews()
    this.sendOtherClick()

    if (typeof BrTrk === 'undefined') {
      document.getElementsByTagName('script')[0].addEventListener('load', () => {
        this.addBloom()
      })
    } else {
      this.addBloom()
    }
    // this.showroombutton()
    if (document.querySelector(".showroom-button")) {
      document.querySelector(".showroom-button").addEventListener("click", function () {
        var element = document.querySelector(".text")
        element.classList.toggle("d-block")
      })
    }
  },
  watch: {
    $route (to, from) {
      this.loadreviews()
      this.addBloom()
    }
  },
  computed: {
    cmsPageContent () {
      return this.$store.state.cmsPage.current
    },
    socialLinksSchema () {
      return config.socialUrlsForSchema ? config.socialUrlsForSchema : ''
    }
  },
  methods: {
    addBloom () {
      console.log('from cms page')
      if (config && config.bloomreach) {
        var br_data = br_data || {}
        br_data.acct_id = config.bloomreach.accountID
        br_data.ptype = 'other'
        br_data.item_id = this.cmsPageContent.id ? this.cmsPageContent.id : ''
        br_data.item_name = this.cmsPageContent.meta_title ? this.cmsPageContent.meta_title : this.cmsPageContent.title
        br_data.domain_key = config.bloomreach.domainKey
        br_data.test_data = 'true'
        // var brtrk = document.createElement('script')
        // brtrk.type = 'text/javascript'
        // brtrk.async = true
        // brtrk.src = `//cdn.brcdn.com/v1/br-trk-${config.bloomreach.accountID}.js`
        // var s = document.getElementsByTagName('script')[0]
        // s.parentNode.insertBefore(brtrk, s)
        BrTrk.getTracker().updateBrData(br_data)
        BrTrk.getTracker().logPageView()

      }
    },

    addevent1 () {
      if (document.getElementsByClassName('buton')) {
        let a = document.getElementsByClassName('buton')
        for (var i = 0; i < a.length; i++) {
          if (a) {
            a[i].addEventListener('click', this.displaypop)
          }
        }
      }
    },
    addevent2 () {
      if (document.getElementById('popup2') && document.getElementsByClassName('close')) {
        let d = document.getElementById('popup2')
        let p = document.getElementsByClassName('close')
        d.addEventListener('click', this.hide)
        for (var i = 0; i < p.length; i++) {
          if (d && p) {
            p[i].addEventListener('click', this.hide)
          }
        }
      }
    },
    hide () {
      let b = document.getElementById('popup2')
      b.style.display = 'none'
      b.style.opacity = '0'
      b.style.visibility = 'hidden'
    },
    displaypop () {
      let b = document.getElementById('popup2')
      b.style.display = 'block'
      b.style.opacity = '1'
      b.style.visibility = 'visible'
    },
    loadreviews () {
      if (document.getElementsByClassName('trustpilot-widget')) {
        // if(document.getElementsByClassName("trustpilot-widget")){
        var element = document.getElementsByClassName('trustpilot-widget')
        // console("helolowowoowowow", element);
        for (var i = 0; i < element.length; i++) {
          window.Trustpilot.loadFromElement(element[i])
        }
      }
    },
    showdescription () {
      this.showdesc = true
    },
    selectClasss (url) {
      let className = ''
      if (
        url == 'deliveryinfo' ||
        url == 'showrooms_info' ||
        url == 'clearance_sales' ||
        url == 'sample-service' ||
        url == 'style-inspiration'
      ) {
        className = ''
        return className
      } else {
        className = 'container'
        return className
      }
    },
    selectClasssforcolor (url) {
      let className = ''
      if (
        url == 'returns' ||
        url == 'about-us' ||
        url == 'privacy_policy' ||
        url == 'terms_of_use' ||
        url == 'terms_and_condition' ||
        url == 'portico'
      ) {
        className = 'cmspage1'
        return className
      } else if (url == 'showrooms_info') {
        className = 'cmspage2'
        return className
      } else {
        className = 'cmspage'
        return className
      }
    },
    showportico () {
      if (document.getElementsByClassName('popup-portico')) {
        let a = document.getElementsByClassName('popup-portico')
        for (var i = 0; i < a.length; i++) {
          if (a) {
            a[i].addEventListener('click', this.displayportico)
          }
        }
      }
    },
    displayportico () {
      if (document.getElementById('popup_portico') && document.getElementById('iframeouterdiv')) {
        document.getElementById("popup_img_portico").setAttribute('src', 'https://www.youtube.com/embed/mu5MywdBcGQ?rel=0&autoplay=0&wmode=Opaque&enablejsapi=1&vq=large')
        let a = document.getElementById('popup_portico')
        let b = document.getElementById('iframeouterdiv')
        a.style.display = 'block'
        a.style.visibility = 'visible'
        a.style.opacity = '1'
        b.style.display = 'block'
        b.style.visibility = 'visible'
        b.style.opacity = '1'
      }

    },
    hideportico () {
      if (document.getElementById('popup_portico') && document.getElementsByClassName('close')) {
        let d = document.getElementById('popup_portico')
        let p = document.getElementsByClassName('close')
        if (d) {
          d.addEventListener('click', this.porticohide)
        }
        for (var i = 0; i < p.length; i++) {
          if (d && p) {
            p[i].addEventListener('click', this.porticohide)
          }
        }
      }
    },
    porticohide () {
      document.getElementById("popup_img_portico").setAttribute('src', '')
      let b = document.getElementById('popup_portico')
      b.style.display = 'none'
      b.style.opacity = '0'
      b.style.visibility = 'hidden'
    }
  }
};
</script>
<style>
@font-face {
  font-family: 'Oblik';
  src: url('/assets/fonts/Oblik_Bold.otf');
}

@font-face {
  font-family: 'Oblik-regular';
  src: url('/assets/fonts/Oblik-Regular.otf');
}
.cmspage {
  overflow: hidden;
  background-color: #f2f2f2;
}
.cmspage1 {
  overflow: hidden;
  background-color: #f2f2f2;
}
.cmspage2 {
  overflow: hidden;
  background-color: #fff;
}
.contact-us-page .sb-page-title {
  padding: 10px 0 0 10px;
}
.contact-us-page .contact-follow-us {
  margin: 15px 0 50px 10px;
}
.contact-us-page .contact-top-detail {
  margin: 0 0 30px 0;
}
@media (max-width: 1024px) and (min-width: 768px) {
  .contact-us-page .contact-top-detail .contact-top-detail-box .img img {
    margin-left: 0 !important;
    width: 100%;
  }
}
@media screen and (max-width: 767px) {
  .contact-us-page .contact-top-detail .contact-top-detail-box {
    margin-bottom: 8px;
  }
  .contact-us-page .contact-top-detail .contact-top-detail-box .img {
    padding: 20px 0;
    width: 30% !important;
    text-align: center;
  }
  .contact-us-page .contact-top-detail .contact-top-detail-box .inner-detail {
    padding: 20px 0;
    width: 70% !important;
  }
  .contact-us-page .contact-top-detail .contact-top-detail-box .img img {
    margin-left: 0 !important;
  }
  .about-us-cms p {
    font-size: 14px;
}
.about-us-cms h2 {
    font-size: 20px !important;
}
.about-us-cms h1 {
    font-size: 24px !important;
}
.showroom h1 {
    font-size: 24px !important;
}
.delivery-info h1 {
    font-size: 24px !important;
}
.delivery-info h2 {
    font-size: 20px !important;
}
.delivery-info h3 {
    font-size: 18px !important;
}
.delivery-info p {
    font-size: 14px !important;
}
 .showroom p{
    font-size: 14px;
}
.faqs-cms h1 {
    font-size: 24px !important;
}
.faqs-cms h2 {
  font-size: 20px !important;
}
.faqs-cms p {
    font-size: 14px !important;
}
.contact-cms h1{
     font-size: 24px !important;
}
.contact-cms h2 {
    font-size: 20px !important;
}
.contact-cms p {
  font-size: 14px !important;
}
}
.contact-us-page .contact-visit-us .address-detail .get-direction > a {
  background-image: url(/assets/map-pin.png);
  background-position: left center;
  background-repeat: no-repeat;
  padding-left: 20px;
  color: #00aeef;
  font-size: 12px;
  text-decoration: underline;
}
.contact-us-page .contact-visit-us .address-detail .phone-no a {
  background-image: url(/assets/call-pink.png);
  background-position: left center;
  background-repeat: no-repeat;
  padding-left: 30px;
  color: #29275b;
  font-size: 12px;
  text-decoration: none;
  font-weight: 600;
}
.grid-full,
.grid12-12 {
  width: 98%;
}
.grid12-4 {
  width: 31.33%;
}
.grid-col2-main,
.grid-col2-sidebar,
.grid-full,
.grid12-1,
.grid12-10,
.grid12-11,
.grid12-12,
.grid12-2,
.grid12-3,
.grid12-4,
.grid12-5,
.grid12-6,
.grid12-7,
.grid12-8,
.grid12-9 {
  display: inline;
  float: left;
  margin-left: 1%;
  margin-right: 1%;
}
.contact-us-page .contact-top-detail .contact-top-detail-box {
  background: #fff;
  height: auto;
  overflow: auto;
}
.contact-us-page .visit-us-title {
  padding: 10px 0 0 10px;
}
.contact-us-page .contact-visit-us {
  margin: 15px 0 50px 0;
}
.contact-follow-us {
  color: #595a5c;
  font-family: Arial;
  font-size: 18px;
}
.contact-us-page .sb-page-title h1 {
  font-weight: 600 !important;
  color: #4a4a4a;
  font-family: Oblik;
  font-size: 36px;
}
.contact-us-page .contact-top-detail .contact-top-detail-box .img {
  padding: 20px 0;
}
.contact-us-page .contact-top-detail .contact-top-detail-box .inner-detail {
  padding: 20px 0;
}
.contact-us-page .contact-top-detail .contact-top-detail-box .img img {
  margin-left: 20px;
}
.contact-us-page .contact-top-detail .contact-top-detail-box .inner-detail h2 {
  margin: 0;
  color: #29275b;
  font-size: 18px;
}
.contact-us-page .contact-top-detail .contact-top-detail-box .inner-detail a,
.contact-us-page .contact-top-detail .contact-top-detail-box .inner-detail p {
  margin: 0;
  font-size: 13px;
  color: #58595b;
}
.contact-us-page .visit-us-title h2 {
  font-weight: 600 !important;
  color: #4a4a4a;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 28px;
}
.contact-us-page .contact-visit-us .contact-visit-inner {
  background: #fff;
  height: auto;
  overflow: auto;
  padding: 20px 15px;
}
@media (min-width: 767px) {
  .mobile-accordion-left {
    display: none;
  }
}
.contact-us-page .contact-visit-us .address-detail {
  padding: 20px 0;
}
.contact-us-page .contact-visit-us .address-detail .address-time {
  height: 100%;
  min-height: 120px;
}
.contact-us-page .contact-visit-us .address-detail .title {
  color: #29275b;
  font-size: 14px;
  font-weight: 600;
}
.contact-us-page .contact-visit-us .address-detail p {
  margin: 0 0 2px 0;
  font-size: 12px;
  color: #58595b;
}
.contact-us-page .contact-visit-us .address-detail .phone-no a {
  background-position: left center;
  background-repeat: no-repeat;
  padding-left: 30px;
  color: #29275b;
  font-size: 12px;
  text-decoration: none;
  font-weight: 600;
}
.contact-us-page .contact-visit-us .contact-visit-inner h2 {
  margin: 0 0 5px 0;
  color: #29275b;
  font-size: 18px;
}
@media (min-width: 767px) {
  .contact-us-page .get-more-information p {
    display: none;
  }
}
.contact-us-page .contact-follow-us .socials li {
  display: inline-block;
  background: #29275b;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  margin-right: 10px;
}
.contact-us-page .contact-follow-us .socials li:first-child .fa {
  margin: 12px 17px;
}
.contact-us-page .contact-follow-us .socials li .fa {
  margin: 12px 13px;
  color: #fff;
  font-style: initial;
  text-align: center;
  font-size: 26px;
}
.socials {
  margin: 0;
  padding: 0;
}
.socials a.underline:after,
a:not(.no-underline):hover:after {
  content: none !important;
}
@media screen and (min-width: 768px) {
  .contact-visit-inner input {
    display: none;
  }
  .contact-visit-inner label {
    display: none;
  }
}
@media screen and (max-width: 395px) and (min-width: 320px) {
  .contact-visit-inner img {
    display: none;
  }
}
@media screen and (max-width: 767px) {
  .contact-visit-inner input {
    display: none;
  }
  .contact-visit-inner label::after {
    content: '';
    position: absolute;
    width: 35px;
    background: url(/assets/+.png) no-repeat;
    height: 30px;
    right: 8px;
  }
  .contact-visit-inner input:checked + label::after {
    content: '';
    position: absolute;
    width: 35px;
    background: url(/assets/_.png) no-repeat;
    height: 30px;
    right: 10px;
  }
  .contact-visit-inner label {
    display: inline-flex;
    font-size: 16px;
    padding: 8px 22px;
    margin: 0 0 1px 0;
    cursor: pointer;
    color: #29275b;
    border-radius: 3px;
    transition: ease 0.5s;
    font-weight: 700;
    font-family: Arial, Helvetica, sans-serif;
  }
  .contact-visit-inner img {
    max-width: 100px;
    width: 100%;
    margin-top: -21px;
    margin-right: 8px;
  }
  .contact-visit-inner .content {
    margin: 0 0 1px 0;
    border-radius: 3px;
  }
  .contact-visit-inner input + label + .content {
    display: none;
  }
  .contact-visit-inner input:checked + label + .content {
    display: block;
  }
  .get-more-information {
    display: none;
  }
}
.delivery-info-top-title {
  width: 100%;
  background-color: #8d85ca;
  margin: 0 0 75px 0;
  padding: 50px 0 110px 0;
}
.sb-deliver-right h3 {
  font-size: 26px !important;
  color: #29265a !important;
  font-family: Oblik !important;
  margin-top: 0;
  margin-bottom: 10px;
}
@media (max-width: 767px) {
  .delivery-info-top-title {
    margin: -27px 0 45px 0;
    padding: 40px 0 40px 0;
  }
  .delivery-info-top-title-style h1 {
    font-size: 28px !important;
    padding: 0;
  }
}
.datagrid table {
  border-collapse: collapse;
  text-align: left;
  width: 100%;
}
tr.heading {
  color: #fff;
}
.sb-delivery-left table tbody tr {
  border-bottom: 1px solid #f2f2f2;
}
.sb-order-above {
  border: medium none !important;
  background: #00b09a;
  color: #fff !important;
  font-family: Arial !important;
  font-size: 16px !important;
  padding: 12px 25px 12px 25px !important;
}
.sb-order-freee {
  background: #00b09a;
  border: medium none !important;
  text-align: right;
  color: #fff !important;
  font-family: Arial !important;
  font-size: 16px !important;
  padding: 12px 25px 12px 25px !important;
  font-weight: 700 !important;
}
.sb-sample-delivery {
  background: #00b09a;
  border: medium none !important;
  color: #fff !important;
  font-family: Arial !important;
  font-size: 16px !important;
  padding: 12px 25px 12px 25px !important;
}
.sb-sample-delivery-free {
  background: #00b09a;
  border: medium none !important;
  text-align: right;
  color: #fff !important;
  font-family: Arial !important;
  font-size: 16px !important;
  padding: 12px 25px 12px 25px !important;
  font-weight: 700 !important;
}
.heading-one {
  font-family: Arial !important;
  font-size: 18px !important;
  background: #27215c none repeat scroll 0 0 !important;
  padding: 12px 25px 12px 25px !important;
  font-weight: 700;
}
.heading-two {
  font-family: Arial !important;
  font-size: 18px !important;
  text-align: right;
  background: #27215c none repeat scroll 0 0 !important;
  padding: 12px 25px 12px 25px !important;
  font-weight: 700;
}
.second-tbody tr {
  border-bottom: 1px solid #cdcdcd !important;
}
.sb-color-left {
  background: #f2f2f2;
  border: medium none !important;
  color: #000;
  font-family: Arial !important;
  font-size: 16px !important;
  padding: 12px 25px 12px 25px !important;
}
.sb-color-right {
  padding: 12px 25px 12px 25px !important;
  background: #f2f2f2;
  border: medium none !important;
  color: #000;
  font-family: Arial !important;
  font-size: 16px !important;
  text-align: right;
  font-weight: 700 !important;
}
.sb-delivery-left h3 {
  /* font-size: 26px !important;
  color: #29265a !important;
  font-family: Oblik !important;
  margin: 0;
  margin-bottom: 10px; */
}
@media (max-width: 767px) and (min-width: 294px) {
  .sb-color-right {
    padding: 12px 14px 12px 14px !important;
  }
}
.delivery-info-top-title-style h1 {
  font-family: Oblik !important;
  color: #fff !important;
  font-size: 42px;
  padding: 20px;
  margin: 0;
  text-align: center;
}
.feature.indent.large {
  padding-left: 0;
  margin-bottom: 0;
  font-family: Arial, Helvetica, sans-serif;
}
.feature .above-heading1 {
  margin-bottom: 20px;
  font-family: Arial;
  font-weight: 700;
  margin-top: 0;
  padding-top: 98px;
  font-size: 20px;
  color: #58595b;
}
.feature.indent.large p {
  margin-bottom: 25px;
  color: #58595b;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.4;
}
.feature.indent.large .special-offer {
  margin-bottom: 5px;
}
.feature .above-heading {
  margin-bottom: 20px;
  font-family: Arial;
  font-weight: 700;
  margin-top: -1px;
}
.feature.indent.large a:hover {
  text-decoration: none;
  color: #ca0413;
}
.feature.indent.large span#hereLink {
  color: #888;
}
.tooltip {
  position: relative;
  display: inline-block;
}
.tooltip .tooltiptext {
  visibility: hidden;
  width: 151px;
  background-color: #000;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  border: 1.7px solid #fff;
  top: 18px;
  left: 28px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
}
#sb-pallet-info,
.Opening-Hours,
.feature .above-heading,
.new-users.grid12-6 h2,
.page-title h1,
.sb-contact-text,
.sb-parcel-left > p,
.sb-parcel-right > p strong,
.std h2,
.std h4,
.std h5,
.visit-us > p {
  font-size: 20px;
  color: #58595b;
  font-family: Arial;
  font-weight: 700;
}
#sb-pallet-info,
.disc li,
.feature .above-heading,
.page-title h1,
.sb-parcel-left > p,
.sb-parcel-right > p strong,
.std h2,
.std h5,
.std li,
.std p {
  line-height: 1.5;
}
.firsth2 {
  margin-top: 0;
  padding-top: 31px;
}
.covidh5 {
  margin-top: 0;
  padding-top: 31px;
  font-size: 20px;
  color: #58595b;
  font-family: Arial;
  font-weight: 700;
}
.aboutusp {
  margin-top: 0;
  padding-top: 31px;
}
.tm_careers_top_paragragh_div {
  font-family: arial;
  margin: 1% 0 3%;
  padding: 0 1%;
}
.-orange:hover {
  color: #27215d;
}
.-orange {
  color: #27215d;
}
.tm_careers_job_description_div strong {
  font-size: 16px;
  color: #27215d;
  line-height: 1.4em;
}
.pdf_link {
  font-size: 1.2em;
}
.tm_careers_jobs_list_main_div {
  font-size: 1.2em;
  font-family: arial;
  float: left;
  min-height: 400px;
  width: 100%;
}
.tm_careers_job_div:first-child {
  border-top: 1px solid #dfdfdf;
}
.tm_careers_job_div {
  border-bottom: 1px solid #dfdfdf;
  margin: 0 auto;
  width: 92%;
  float: left;
  border-bottom: 1px solid grey;
}
.tm_careers_job_div > label {
  padding: 15px 0;
  width: 100%;
}
@media (max-width: 430px) and (min-width: 320px) {
  .tm_careers_job_div > label {
    font-size: 14px;
  }
}
.tm_careers_job_div > label > .down_arrow {
  background: rgba(0, 0, 0, 0) url(/assets/downarrow.png) no-repeat scroll
    center bottom;
  margin: 0 auto;
  float: right;
  height: 17px;
  width: 20px;
}
input:checked + .down_arrow::after {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
input:checked + .tm_careers_job_div + .tab-label + .down_arrow {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
.tm_careers_job_description_div {
  float: left;
  padding: 2% 2% 2% 8px;
}
.tm_careers_job_description_div ul li {
  line-height: 1em;
  padding: 4px 0;
  list-style-type: initial;
}
.tm_careers_job_description_div_left {
  float: left;
  width: 45%;
}
.tm_careers_job_description_div_left > div,
.tm_careers_job_description_div_right > div {
  margin-bottom: 1em;
}
.tm_careers_job_description_div_left_inner {
  margin-top: 0;
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 0;
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 0;
  padding-left: 0;
}
.bluefoot-textarea.content-container > p,
.interested_cadidates_div {
  line-height: 1.4em;
}
.tm_careers_job_description_div_right {
  float: right;
  width: 45%;
}
.apply_btn {
  background-color: #27215d;
  background-image: rgba(0, 0, 0, 0)
    linear-gradient(
      to bottom,
      #494475 0,
      #40396b 28%,
      #342d61 51%,
      #2b255f 71%,
      #28235f 100%
    )
    repeat scroll 0 0;
  background-size: 100% 200%;
  border-color: #ee810d;
  border-radius: 25px;
  color: #fff;
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 20px 11px;
  width: 250px !important;
  float: left;
  margin: 0 auto;
}
.tm_careers_job_description_div strong {
  font-size: 16px;
  color: #333;
  line-height: 1.4em;
}
@media (max-width: 768px) and (min-width: 320px) {
  .tm_careers_job_div {
    width: 98%;
  }
  .tm_careers_job_description_div_right {
    width: 100%;
  }
  .tm_careers_job_description_div_left {
    width: 100%;
  }
  .tm_careers_jobs_list_main_div .content {
    padding: 0 !important;
  }
}
.tm_careers_jobs_list_main_div input {
  display: none;
}
.tm_careers_jobs_list_main_div label {
  display: block;
  cursor: pointer;
  color: #000;
  -webkit-transition: ease 0.5s;
  -o-transition: ease 0.5s;
  transition: ease 0.5s;
  border-top: 1px solid grey;
}
.tm_careers_jobs_list_main_div .content {
  background: #fafafa;
  padding: 10px 25px;
  margin: 0 0 1px 0;
  border-bottom: 1px solid grey;
}
.tm_careers_jobs_list_main_div input + label + .content {
  display: none;
}
.tm_careers_jobs_list_main_div input:checked + label + .content {
  display: block;
}
.tm_careers_jobs_list_main_div input:checked + label::after {
  content: '';
  background: rgba(0, 0, 0, 0) url(/assets/opened.png) no-repeat scroll center
    bottom;
  margin: 0 auto;
  float: right;
  height: 28px;
  width: 34px;
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}
.tm_careers_jobs_list_main_div label::after {
  content: '';
  background: rgba(0, 0, 0, 0) url(/assets/closed.png) no-repeat scroll center
    bottom;
  margin: 0 auto;
  float: right;
  height: 30px;
  width: 32px;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
.std ol ol,
.std ol ul,
.std ul ol {
  margin: 0.5em 0;
}
.std ol {
  list-style: decimal;
  padding: 0 0 0 1.5em;
}
.font-style li {
  font-family: arial;
  font-weight: 400;
  line-height: 35px;
}
.term-use ol > li {
  display: block;
}
.term-use ol > li:first-child {
  counter-reset: item;
}
.term-use ol > li {
  counter-increment: item;
  position: relative;
}
.term-use ol > li:before {
  content: counters(item, '.') '. ';
  position: absolute;
  margin-right: 100%;
  right: 10px;
}
#sb-our-courier,
.disc li,
.sb-feature.indent p,
.std,
.std p {
  font-size: 16px;
  color: #58595b;
}
.ppolicy {
  font-size: 20px;
  color: #58595b;
  font-family: Arial;
  font-weight: 700;
}
.privacyul {
  list-style: disc;
}
.strongsm {
  font-size: 1.4em;
  display: block;
}
.level2-category-a {
  display: block;
  font-size: 15px;
  padding-bottom: 5px;
  padding-top: 5px;
}
.sitempan {
  width: 100%;
  float: left;
}
.sitecatul {
  margin: 0 5px;
  padding: 0 0 0 10px;
  float: left;
  width: 100%;
}
.main-category-a {
  display: block;
  font-size: 16px;
  padding-bottom: 5px;
  padding-top: 10px;
}
.level2-category-ul {
  list-style: outside none disc;
  padding-left: 20px;
}
.level3-category-ul {
  list-style: outside none disc;
  padding-left: 10px;
}
.sitecatul a {
  color: #888;
}
.sitecatul a:hover {
  text-decoration: none;
  color: #ca0413;
}
.sitecatul a:not(.no-underline):hover:after {
  background-color: transparent;
}
.showroom-banner-bottom {
  width: 100%;
  margin: 0;
  background-color: #f2f2f2;
  overflow: auto;
}
@media (max-width: 767px) {
  .mobile-showroom-heading {
    display: none;
  }
}
.showroom-banner-bottom .banner-text {
  margin: 0 auto;
  float: none;
  display: block;
}
.grid12-6 {
  width: 48%;
}
.stroke-on-trent-right-video {
  margin-top: 8px;
}
.d-block {
  display: block !important;
}
.banner-text p {
  color: #000;
  font-size: 20px;
  font-family: Oblik-Regular;
  text-align: center;
  padding-top: 65px;
  padding-bottom: 65px;
}
.stroke-on-trent {
  border-top: 1px solid #f5f5f5;
  margin-top: 35px;
  padding-top: 35px;
}
@media (min-width: 768px) {
  .stroke-on-trent .trent-head-mobile {
    display: none;
  }
}
.bar-bottom {
  margin-top: 5px;
}
@media (min-width: 768px) {
  .iframe-mobile {
    display: none;
  }
  .stroke-on-trent input {
    display: none;
  }
  .stroke-on-trent label {
    display: none;
  }
}
.std .grid12-6 iframe,
.std .grid12-6 img {
  width: 100%;
}
.grid12-8 {
  width: 64.67%;
}
ul {
  list-style: none;
}
.stroke-on-trent-inner.content .bar-bottom ul {
  padding: 0;
}
.bar-bottom ul li {
  display: inline-block;
  padding-right: 27px;
}
.bar-bottom ul li p {
  color: #29275b;
  font-size: 14px;
  font-family: Arial;
  display: flex;
  align-items: center;
  padding-left: 40px;
}
.bar-bottom ul li:nth-child(6n + 1) p {
  background: url(/assets/click-img.jpg) no-repeat;
  height: 30px;
}
.bar-bottom ul li:nth-child(6n + 2) p {
  background: url(/assets/abc-img.jpg) no-repeat;
  height: 34px;
}
.bar-bottom ul li:nth-child(6n + 3) p {
  background: url(/assets/car-img.jpg) no-repeat;
  height: 28px;
}
.bar-bottom ul li:nth-child(6n + 4) p {
  background: url(/assets/tea-cup-img.jpg) no-repeat;
  height: 28px;
}
.bar-bottom ul li:nth-child(6n + 5) p {
  background: url(/assets/tub-img.jpg) no-repeat;
  height: 28px;
}
.bar-bottom ul li:nth-child(6n + 6) p {
  background: url(/assets/tool-img.jpg) no-repeat;
  height: 27px;
}
.stroke-on-trent-left h4 {
  font-size: 14px;
  color: #29275b;
  font-family: '';
  margin-top: 6px;
  float: left;
  width: 100%;
  font-family: Oblik;
  margin-bottom: 0;
}
.stroke-on-trent-left ul:nth-child(n + 1) {
  padding-right: 35px;
  padding-left: 0;
}
.stroke-on-trent-left ul li {
  font-size: 16px;
  color: #000;
  font-family: Arial;
}
.stroke-on-trent-left ul {
  float: left;
}
h1.headingStyle {
  text-align: center;
  color: #fff;
  margin-bottom: 15px;
  font-size: 28px;
  font-family: Oblik;
}
.stroke-on-trent-left h3 {
  font-family: Oblik;
  color: #29275b;
  margin-top: 0;
}
.showroom-banner {
  background-color: #333072;
  width: 100%;
  margin: 0;
  padding-top: 38px;
  padding-bottom: 30px;
  overflow: auto;
}
@media only screen and (max-width: 767px) {
  .std {
    margin-top: 22px;
  }
  .showroom-banner {
    padding: 27px 0 27px 0;
  }
  .h1.headingStyle {
    font-weight: 700;
  }
  .grid-col2-main,
  .grid-col2-sidebar,
  .grid-col3-main,
  .grid-col3-sidebar,
  .grid-full,
  .grid12-1,
  .grid12-10,
  .grid12-11,
  .grid12-12,
  .grid12-2,
  .grid12-3,
  .grid12-4,
  .grid12-5,
  .grid12-6,
  .grid12-7,
  .grid12-8,
  .grid12-9 {
    width: 100% !important;
    margin-left: 0;
    margin-right: 0;
  }
  .bar-bottom ul {
    padding-left: 0;
    margin-top: 0;
  }
  .stroke-on-trent input:checked + label::after {
    content: '';
    position: absolute;
    width: 35px;
    background: url(/assets/opened.png);
    height: 30px;
    right: 10px;
  }
  .stroke-on-trent label::after {
    content: '';
    position: absolute;
    width: 35px;
    background: url(/assets/closed.png);
    height: 30px;
    right: 7px;
  }
  .banner-text p {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .trent-head-mobile {
    display: none;
  }
}
@media (max-width: 480px) and (min-width: 320px) {
  .banner-text p {
    margin-top: 23px;
    font-size: 14px;
  }
}
@media screen and (max-width: 767px) {
  .stroke-on-trent .trent-head-desktop {
    display: none;
  }
  .container.showrom {
    margin-top: 31px;
  }
  .grid12-6 .stroke-on-trent-right-video {
    margin-top: 9px;
  }
  .stroke-on-trent {
    margin-top: 0;
    padding: 14px 0 14px 0;
  }
  .iframe-desktop {
    display: none;
  }
  .stroke-on-trent input {
    display: none;
  }
  .stroke-on-trent label {
    display: block;
    padding: 8px 22px;
    margin: 0 0 1px 0;
    cursor: pointer;
    font-size: 22px;
    border-radius: 3px;
    color: #29275b;
    transition: ease 0.5s;
    font-family: Oblik;
    padding-top: 3px;
    padding-bottom: 2px;
    padding-left: 0;
  }
  .stroke-on-trent .content {
    padding: 10px 0;
    margin: 0 0 1px 0;
    border-radius: 3px;
    display: none;
  }
  .stroke-on-trent input + label + .content {
    display: none;
  }
  .stroke-on-trent input:checked + label + .content {
    display: block;
  }
  .stroke-on-trent-inner .grid12-4 {
    width: 100%;
  }
  .iframe-mobile iframe {
    height: 250px !important;
  }
}
.stroke-on-trent-left p {
  font-size: 22px;
  color: #29275b;
  background: url(/assets/phoneicon.png) no-repeat;
  padding-left: 30px;
}
@media screen and (min-width: 320px) and (max-width: 1096px) {
  .covidimg {
    width: 100%;
  }
}
.clear_container {
  float: left;
  margin: 0 0 20px 0;
  width: 100%;
}
@media screen and (max-width: 520px) and (min-width: 320px) {
  .clear_container {
    margin: 0 0;
  }
}
@media screen and (max-width: 1280px) and (min-width: 1024px) {
  .clear_footer_h1 {
    font-size: 1.8vw !important;
  }
}
@media screen and (max-width: 1024px) and (min-width: 768px) {
  .clear_footer h1 {
    margin: 3% 0;
    font-size: 1.8vw;
  }
}
ul.homecategory-grid {
  column-count: 3;
  -webkit-column-count: 3;
  -moz-column-count: 3;
  column-gap: 40px;
  column-width: auto;
  -moz-column-gap: 40px;
  -moz-column-width: auto;
  -webkit-column-gap: 40px;
  -webkit-column-width: auto;
  -webkit-column-width: auto;
  grid-template-columns: repeat(3, 1fr);
  display: grid;
  row-gap: 20px;
}
.hu_homcategory li {
  display: inline-block;
  position: relative;
  width: 100%;
  float: left;
}
.title-explore {
  padding: 30px 0 30px 0;
  background: rgba(79, 152, 208, 0.6);
  position: absolute;
  bottom: 6px;
  text-align: center;
  width: 100%;
}
.homecategory-grid li img {
  width: 100%;
}
.hu_homcategory li:hover .hm-btn-explore {
  display: block;
  color: #fff;
}
.category-name.parent-category {
  background: 0 0;
  position: initial;
  margin: 0;
  padding: 0;
}
.hu_homcategory .parent-category a {
  color: #fff;
  font-family: Oblik;
  font-size: 26.51px;
}
.hm-btn-explore {
  width: 70%;
  text-transform: uppercase;
  font-family: Arial;
  font-weight: 700;
  margin: 0 auto;
  background: 0 0;
  display: none;
  color: #fff;
  font-size: 15.46px;
  margin-top: 10px;
  border-radius: 3px;
  padding: 15px;
  border: 2px solid #fff;
}
.clear_footer {
  float: left;
  height: 80px;
  width: 100%;
  padding-bottom: 14px;
}
.clear_footer_left {
  font-family: Oblik;
  background: #0c0928 none repeat scroll 0 0;
  float: left;
  height: 100%;
  text-align: center;
  width: 46%;
  font-size: 16px;
}
.clear_footer h2 {
  margin: 2% 0;
  font-family: Oblik;
  text-shadow: 1px 2px 3px rgba(24, 23, 24, 0.62);
  color: #fff;
}
.clear_footer_left span {
  font-size: 44.87px;
}
.clear_footer > img {
  float: left;
  height: 100%;
  width: 8%;
}
.clear_footer_right {
  background: #0c0928 none repeat scroll 0 0;
  float: left;
  font-family: Oblik;
  height: 100%;
  text-align: center;
  width: 46%;
  font-size: 12px;
}
.clear_footer_h1 {
  font-size: 24.37px;
}
@media screen and (min-width: 768px) {
  .clear_footer_right .clear_footer_h1 {
    margin-top: 5%;
  }
}
@media screen and (max-width: 1070px) {
  .clear_footer_right h1 {
    line-height: 2.4;
  }
}
@media screen and (max-width: 991px) and (min-width: 768px) {
  h1.clear_footer_h1.clear_footer_h1_first {
    font-size: 13px;
  }
  .clear_footer_right h1 {
    line-height: 4.1;
    font-size: 13px;
  }
}
.sb-category-banner {
  margin: 0 auto;
  width: 100%;
}
.sb-category-page-container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}
.sb-category-banner-img {
  margin: 0 auto;
  padding: 0;
}
.sb-category-banner-img img {
  max-width: 100%;
}
.sb-category-tile-text_2 {
  display: none;
}
.clearance_banner_heading {
  color: #fff;
  font-family: Oblik;
  font-size: 32px;
  line-height: 30px;
  margin: 0;
}
.clearance_banner_content {
  color: #fff;
  font-family: Arial;
  font-size: 13px;
  margin-top: 10px;
}
@media (max-width: 767px) {
  .img-responsive {
    width: 100% !important;
  }
  .hu_homcategory li {
    margin-top: 16px;
  }
  ul.homecategory-grid {
    display: flex;
    flex-direction: column;
    padding-left: 1px;
  }
  .clear_footer_h1 {
    font-size: 3.8vw;
  }
  .clear_footer_left {
    width: 100%;
  }
  .clear_footer h1 {
    margin: 2% 0;
  }
  .clear_footer_left span {
    font-size: 5.8vw;
  }
  .clear_footer_right {
    width: 100%;
    margin-top: 2%;
  }
  .clear_footer > img {
    display: none;
  }
  .clear_footer {
    height: auto;
  }
}
.discountimage {
  max-width: 100%;
}
.order-free {
  width: 100%;
  max-width: 455px;
}
.order-free h1 {
  font-size: 42px;
  color: #333072;
  font-family: Oblik;
  width: 100%;
  max-width: 395px;
  margin-top: 0;
}
.order-free h1 span {
  color: #ed018c;
}
.order-free p {
  font-family: arial;
  color: #13132f;
  font-size: 16px;
}
.order-free ul li {
  background: url(/assets/tick-img.png) no-repeat 0 25%;
  padding-bottom: 25px;
}
.order-free ul li small {
  font-size: 16px;
  color: #13132f;
  font-family: Arial;
  padding-left: 42px;
  display: block;
}
.grid12-6.landing-page-grid.landing-page-grid-right {
  margin-left: 1% !important;
}
.order-sample-main {
  background-color: #333072;
  position: relative;
  margin-left: 0;
  margin-right: 0;
  width: 100%;
  margin-top: 55px;
}
.tile-samples {
  margin-left: 0;
  margin-right: 0;
  width: 100%;
  margin-top: 50px;
}
.tile-samples h1 {
  font-size: 30px;
  color: #333072;
  font-family: Oblik;
  margin-bottom: 26px;
}
.tile-samples h4 {
  font-size: 30px;
  color: #333072;
  font-family: Oblik;
  margin-bottom: 26px;
}
.hu_homcategory li {
  display: inline-block;
  position: relative;
  width: 100%;
  float: left;
}
.smaple-video-text-mobile {
  display: none;
}
.sample-video-text {
  background-color: #fff;
  text-align: center;
  float: left;
  width: 100%;
}
.sample-video-text h2 {
  font-size: 23px;
  color: #333072;
  font-family: Oblik;
  margin-bottom: 11px;
  padding-top: 30px;
}
.sample-video-text small {
  font-size: 16px;
  color: #13132f;
  font-family: Arial;
}
.sample-video-text h2 {
  color: #333072;
  margin-top: 0;
  margin-bottom: 0;
  font-size: 32px;
  padding-top: 15px;
  padding-bottom: 20px;
  background: url(/assets/sample-phone-receiver.png) no-repeat 30% 44%;
}
.order-free p span {
  color: #ed018c;
  font-weight: 700;
}
.order-sample-page ul li small {
  font-size: 16px;
  font-family: Arial;
  color: #fff;
  padding-left: 30px;
  display: block;
}
.order-sample-page h1 {
  font-size: 29px;
  color: #fff;
  margin-top: 53px;
  font-family: Oblik;
}
.order-sample-page h3 {
  font-size: 29px;
  color: #fff;
  margin-top: 53px;
  font-family: Oblik;
}
.order-sample-page ul {
  width: 100%;
  max-width: 340px;
}
.order-sample-page ul li {
  background: url(/assets/order-sample-triganle-img.png) no-repeat 0 15%;
  padding-bottom: 20px;
}
.order-sample-img {
  position: relative;
}
.sb-order-right-img {
  position: absolute;
  bottom: 0;
  right: 0;
}
.order-sample-img-mobile {
  display: none !important;
}
.landing-page-grid-mobile {
  display: none !important;
}
.overlay-popup {
  display: none;
  visibility: hidden;
  opacity: 0;
}
.order-sample-page button {
  width: 100%;
  max-width: 243px;
  height: 100%;
  min-height: 53px;
  border: 1px solid #fff;
  background-color: transparent;
  color: #fff;
  font-family: Oblik_W01;
  font-size: 16px;
  border-radius: 2px;
  background: url(/assets/video-play-icon.png) no-repeat 12% 50%;
  text-align: center;
  padding-left: 30px;
  cursor: pointer;
  margin-bottom: 40px;
}
#breadcrumbs-hide {
  display: none;
}
.breadcrumbs-new.breadcrumbs {
  background-color: transparent;
  position: absolute;
}
.breadcrumbs-new.breadcrumbs a {
  color: #b7b2de;
}
.breadcrumbs-new.breadcrumbs li strong {
  color: #c9c5e6;
}
.breadcrumbs-new.breadcrumbs li span {
  background: url(/assets/pix.png) -20px -129px no-repeat;
}
.breadcrumbs {
  background-color: transparent;
  padding: 15px 0;
  float: left;
  width: 100%;
}
.breadcrumbs ul {
  list-style: none;
  padding: 0;
}
.breadcrumbs li {
  display: inline;
}
.breadcrumbs a {
  display: block;
  float: left;
  font-size: 12px;
  color: #888;
  font-family: Arial, Helvetica, sans-serif;
}
.breadcrumbs a:hover {
  color: #ca0413;
}
.breadcrumbs li span {
  background: url(/assets/pix.png) 0 -129px no-repeat;
  width: 7px;
  height: 5px;
  margin: 6px 4px 0;
  display: block;
  float: left;
  text-indent: -9999px;
  overflow: hidden;
}
.breadcrumbs li strong {
  font-weight: 400;
  display: block;
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
  color: #58595b;
  text-transform: capitalize;
}
@media (max-width: 767px) {
  .breadcrumbs {
    display: none;
  }
  .order-sample-img-mobile {
    display: block !important;
  }
  .grid12-6.landing-page-grid.landing-page-grid-right {
    margin-left: 0 !important;
    display: none;
  }
  .landing-page-grid-mobile {
    display: block !important;
  }
  .sb-order-right-img {
    left: 50%;
    top: 80%;
    margin-left: -75px;
    right: auto;
  }
  .order-sample-img {
    display: none;
  }
  .tile-samples h1 {
    margin-bottom: 10px;
  }
  .tile-samples {
    margin-top: 135px;
  }
  .order-sample-page button {
    display: none;
  }
  .order-sample-page h1 {
    font-size: 20px;
    padding-left: 10px;
  }
  .order-sample-page ul {
    padding-left: 10px;
  }
  .order-sample-page ul li small {
    font-size: 14px;
    padding-left: 20px;
    width: 255px;
  }
  .order-sample-main .container {
    max-width: none !important;
    width: 96% !important;
  }
  .order-sample-main {
    height: 750px;
    margin-top: 30px;
  }
}
@media (max-width: 1024px) and (min-width: 768px) {
  .sb-order-right-img {
    width: 50% !important;
  }
  .sb-order-right-img img {
    border: 0;
    vertical-align: top;
    max-width: 100%;
  }
  .order-sample-page ul li small {
    width: 300px;
  }
  .sample-video-text h2 {
    max-width: 350px;
    margin: 0 auto;
  }
  .sample-video-text h2 {
    background: url(/assets/sample-phone-receiver.png) no-repeat 12% 44%;
  }
  .order-free h1 {
    font-size: 27px;
    text-align: left;
  }
}
@media (max-width: 1210px) and (min-width: 1025px) {
  .sb-order-right-img {
    width: 50% !important;
  }
}
.order-free ul {
  padding-left: 0;
}
@media screen and (min-width: 768px) {
  .order-sample-page h1 {
    margin-left: 40px;
  }
  .tile-samples h1 {
    margin-left: 40px;
  }
  .order-sample-page button {
    margin-left: 40px;
  }
}
.sample-popup-two {
  margin: 13% auto;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  width: 30%;
  position: relative;
  transition: all 1s ease-in-out;
}
.sample-popup-two .close {
  position: absolute;
  top: -7px;
  right: 3px;
  transition: all 0.2s;
  font-size: 30px;
  font-weight: 700;
  text-decoration: none;
  color: #333;
}
@media screen and (max-width: 767px) {
  .sample-popup-two {
    width: 100%;
    padding: 0;
    margin: 0;
    background: 0 0;
  }
}
@media (max-width: 900px) and (min-width: 768px) {
  .sample-popup-two {
    width: 60% !important;
    top: 5% !important;
  }
}
.overlay-popup {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  transition: opacity 0.5s;
  display: block;
  z-index: 999;
}
@media screen and (min-width: 768px) {
  .breadcrumb-bottom {
    margin-top: 50px;
  }
}
@media screen and (max-width: 767px) {
  .breadcrumb-bottom {
    margin-top: 25px;
  }
}
.tile-inspiration {
  width: 100%;
  background-color: #00a997;
  margin: -76px 0 0 0;
  padding: 50px 0 110px 0;
}
.lin-style h1 {
  font-family: Oblik !important;
  color: #fff;
  font-size: 42px !important;
  padding: 20px;
  margin: 0;
  text-align: center;
}
.top-images {
  padding: 23px 0 0;
}
#top-images {
  margin-top: -130px;
}
.tv-img {
  margin: 0;
  margin-right: 8px;
  position: relative;
  width: 47.6% !important;
}
.tv-img img {
  border: 0;
  vertical-align: top;
  max-width: 100%;
}
.styles-bottom {
  clear: both;
  padding: 50px 0 30px 0;
  font-family: Arial !important;
  text-align: center;
}
.style-bottom-p-inner a {
  color: #2a275b;
  text-decoration: underline;
  font-weight: 700;
}
.style-bottom-p-inner span {
  color: #2a275b;
  text-decoration: underline;
  font-weight: 700;
  cursor: pointer;
}
.sb-tv-img-text {
  padding: 25px 0 15px 0;
  background: rgba(207, 206, 202, 0.8);
  position: absolute;
  bottom: 0;
  text-align: center;
  width: 100%;
}
.sb-tv-img-text .sb-tile-visualier-para {
  color: #2a275b;
  font-size: 15px;
  font-weight: 400;
  margin: 0 !important;
  padding-bottom: 7px !important;
  text-align: center;
  font-family: Arial !important;
}
.sb-tile-visualier-link {
  padding-bottom: 20px;
  color: #2a275b;
  display: block;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  text-transform: inherit;
  font-family: Oblik !important;
}
.sb-tv-img-text .overlay {
  padding: 0 61px;
  display: none;
}
.sb-tv-img-text .overlay span {
  color: #050403;
  font-family: Arial !important;
  line-height: 1.5;
}
.sb-tv-img-text .overlay .sb-visualiser-button {
  display: block;
  text-align: center;
  text-decoration: none;
}
.tv-img:hover .overlay {
  display: block;
}
.sb-tile-visualier-link:hover {
  color: #2a275b;
}
.sb-tv-img-text .overlay .sb-visualiser-button button {
  cursor: pointer;
  background-color: transparent;
  border: 2px solid #2a275b;
  border-radius: 3px;
  color: #2a275b;
  font-size: 15px;
  padding: 20px;
  width: 45%;
  font-family: Oblik !important;
  margin-top: 20px;
}
.sb-tv-img-text .overlay .sb-visualiser-button {
  text-align: center;
  text-decoration: none;
}
.sb-tv-img-text .overlay .sb-visualiser-button button:hover {
  background-color: #2a275b;
  color: #fff;
}
@media (max-width: 767px) and (min-width: 601px) {
  .tv-img {
    padding: 0;
    float: left;
    width: 48.6% !important;
  }
}
@media (max-width: 1024px) {
  .style-bottom-p {
    display: none;
  }
}
@media (max-width: 600px) and (min-width: 294px) {
  .tv-img {
    width: 100% !important;
    padding: 0 0 16px;
  }
  #tv-img {
    margin-left: 0;
  }
}
@media screen and (min-width: 768px) {
  .lin-style {
    margin-top: 43px;
  }
}
@media (max-width: 767px) {
  .lin-style {
    margin-top: 30px;
  }
  .style-bottom-p-inner {
    display: none;
  }
  .style-bottom-p {
    display: none;
  }
  .styles-bottom {
    padding: 10px 0 10px 0;
  }
  #top-images {
    margin-top: -80px;
  }
  #tv-img {
    margin-left: 7px;
    margin-right: 0;
  }
  .sb-tv-img-text {
    position: relative;
    bottom: 0;
    top: -1px;
  }
  .sb-tv-img-text .sb-tile-visualier-para {
    font-size: 13px;
  }
  .sb-tile-visualier-link {
    font-size: 26px !important;
  }
  .sb-tv-img-text .overlay {
    padding: 0 35px;
    display: block;
  }
  .sb-tv-img-text .overlay span {
    color: #050403;
    display: none;
    margin: 0;
  }
  .sb-tv-img-text .overlay .sb-visualiser-button {
    display: block;
    text-align: center;
    text-decoration: none;
  }
  .sb-tv-img-text .overlay .sb-visualiser-button button {
    cursor: pointer;
    background-color: transparent;
    border: 2px solid #2a275b;
    border-radius: 3px;
    color: #2a275b;
    font-size: 14.31px;
    font-weight: 700;
    padding: 15px;
    width: 210px;
    font-family: Arial !important;
    margin-top: 0;
  }
}
@media screen and (max-width: 1280px) {
  .Chrisimg {
    width: 100%;
  }
}
.banner-image-mobile {
  display: none;
}
.trent-map-side {
  margin-right: 0;
}
.banner-image img {
  border: 0;
  vertical-align: top;
  max-width: 100%;
}
.explore-showroom img {
  width: 100%;
}
.trent-address {
  border: 1px solid #333072;
  float: left;
  padding: 24px;
  margin-bottom: 35px;
}
.trent-address ul {
  float: left;
  padding-right: 49px;
  padding-left: 0;
}
.trent-address ul li {
  font-size: 16px;
  font-family: Arial;
  color: #13132f;
}
.trent-address ul:nth-child(3n + 3) {
  margin-top: 13px;
}
.trent-address ul li h5 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #333072;
  line-height: 0;
  margin-bottom: 13px;
  font-family: Arial;
}
.trent-text-side span {
  color: #ed018c;
  font-weight: 700;
  font-size: 16px;
  font-family: Arial;
}
.trent-text-side h1 {
  font-size: 42px;
  color: #333072;
  font-family: Oblik;
  margin: 5px;
}
.map p {
  float: right;
  font-size: 22px;
  font-family: Arial;
  color: #333072;
  font-weight: 700;
  background: url(/assets/images/map-phone-reciver-icon.png) no-repeat;
  padding-left: 30px;
  margin-top: 0;
  margin-bottom: 31px;
}
.toggle {
  display: none;
}
.showroom-slick li {
  float: left;
  margin-right: 6px;
}
.img-one {
  width: 100%;
  max-width: 388px;
}
.img-one img {
  border: 0;
  vertical-align: top;
  max-width: 100%;
}
cite.mobile-no {
  display: none;
}
.showroom-bottom-images {
  margin-top: 68px;
}
@media (max-width: 1024px) and (min-width: 768px) {
  .showroom-button {
    width: 100%;
    border: 1px solid #fff;
    height: 100%;
    min-height: 39px;
    text-align: center;
    border-radius: 3px;
    color: #fff;
    font-size: 14px;
    font-family: Arial;
    background: #333072 url(/assets/images/showroom-read-more-icon.png)
      no-repeat;
    background-position: 70% 50%;
    display: block !important;
    cursor: pointer;
  }
  .text {
    display: none;
  }
}
@media (max-width: 767px) {
  .banner-image-mobile {
    display: block;
  }
  .banner-image {
    display: none;
  }
  .banner-image-mobile img {
    width: 100%;
  }
  .showroom-button {
    width: 100%;
    border: 1px solid #fff;
    height: 100%;
    min-height: 39px;
    text-align: center;
    border-radius: 3px;
    color: #fff;
    font-size: 14px;
    font-family: Arial;
    background: #333072 url(/assets/images/showroom-read-more-icon.png)
      no-repeat;
    background-position: 70% 50%;
    display: block !important;
    cursor: pointer;
  }
  .banner-text p {
    margin-top: 23px;
    font-size: 14px;
  }
  .banner-text {
    padding-left: 4.6%;
    padding-right: 4.6%;
    width: 90.8% !important;
  }
  .mobile-no {
    display: block !important;
    font-size: 22px;
    font-family: Arial;
    color: #333072;
    font-weight: 700;
    background: url(/assets/images/map-phone-reciver-icon.png) no-repeat;
    padding-left: 30px;
    margin-top: 10px;
  }
}
.sample-video-text h2:nth-child(1) {
  background: 0 0;
}
.portico-logo {
  margin-left: 35%;
  margin-top: -6%;
  position: relative;
  z-index: 2 !important;
}
h2.intro-heading {
  color: #333072;
  font-size: 42px;
  font-family: Oblik;
  font-weight: 700;
}
.intro-text p {
  font-size: 16px;
  color: #000;
  line-height: 1.5;
}
.intro-img {
  margin-top: -42%;
  overflow: hidden;
}
.intro-img img {
  border: 0;
  vertical-align: top;
  max-width: 100%;
}
.push-right {
  float: right;
}
.text-right {
  text-align: right;
}
.overlay-popup-portico {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  transition: opacity 0.5s;
  display: none;
  z-index: 999;
}
.sample-popup-portico {
  margin: 13% auto;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  width: 30%;
  position: relative;
  transition: all 1s ease-in-out;
  display: none;
  visibility: hidden;
  opacity: 0;
}
.sample-popup-portico .close {
  position: absolute;
  top: 3px;
  right: 3px;
  transition: all 0.2s;
  font-size: 30px;
  font-weight: 700;
  text-decoration: none;
  color: #333;
}
.sb-info-div {
  z-index: 111;
}
.info-vid {
  padding: 19%;
}
.portico-div {
  font-family: Arial;
  font-weight: 400;
}
.potrico-info-two {
  background: #fff;
}
.info-two-text {
  background-color: #4c4f56;
  margin: -45% 0 0 0;
  padding: 4% 2% 5% 2%;
}
.info-two-text h2 {
  color: #fff !important;
  font-size: 30px;
  font-family: Oblik;
  font-weight: 700;
  line-height: 1.5;
}
.info-two-text p {
  color: #fff !important;
  font-size: 15px;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.5;
}
.info-two-text {
  background-color: #4c4f56;
  margin: -45% 0 0 0;
  padding: 4% 2% 5% 2%;
}
.potrico-info-two .grid12-3 {
  width: 23%;
}
.portico-div .no-gutter.grid12-10 {
  margin-left: 0;
  margin-right: 0;
  width: 83.33%;
}
.portico-div .no-gutter.grid12-6 {
  margin-left: 0;
  margin-right: 0;
  width: 50%;
}
.info-div {
  z-index: 0;
  margin-top: -5%;
  position: relative;
  background: #fff;
}
.portico-div .no-gutter.grid-full,
.portico-div .no-gutter.grid12-12 {
  margin-left: 0;
  margin-right: 0;
  width: 100%;
}
.info-img img,
.info-two-img img {
  border: 0;
  vertical-align: top;
  max-width: 100%;
}
.portico-blog {
  width: 100%;
  margin: 0;
  background: #fff;
  padding-top: 100px;
  padding-bottom: 40px;
}
.anchor-heading {
  color: #333072;
  font-size: 19px;
  line-height: 60px;
  font-weight: 700;
}
.portico-blog a:hover {
  text-decoration: none;
  color: #ca0413;
}
.exterior-text {
  background-color: #4c4f56;
  margin: 0;
  color: #f2f2f2;
  min-height: 471px;
}
.exterior-text-in {
  padding: 6% 15% 6% 6%;
  font-size: 30px;
}
.exterior-text h1 {
  font-family: Oblik;
  font-size: 30px;
  margin-bottom: 35px;
  line-height: 1.5;
}
.exterior-text-in p {
  color: #fff;
  font-size: 16px;
  line-height: 1.5;
}
.exterior-img {
  width: 52% !important;
}
.exterior-img img {
  border: 0;
  vertical-align: top;
  max-width: 100%;
}
.portico-div .collection {
  text-align: center;
}
.learn-more h2,
.portico-div .collection h2 {
  font-family: Oblik;
  font-size: 24px;
  color: #333072;
  text-align: center;
}
.bttn-all {
  padding: 20px 60px;
  font-size: 20px;
  background: #333072;
  color: #fff;
  margin-bottom: 20px;
  border-radius: 5px;
  border: transparent;
}
.install-div {
  background: #333072;
}
.install-text {
  padding: 8%;
  padding-right: 15%;
}
.install-text h1 {
  color: #fff !important;
  font-size: 30px;
  font-family: Oblik;
  margin-bottom: 35px;
}
.install-text p {
  color: #fff !important;
  font-size: 16px;
  line-height: 1.5;
}
.install-img {
  margin-top: 50px;
}
.install-img a {
  color: #fff;
  line-height: 30px;
  font-size: 20px;
  font-family: Arial;
  font-weight: 700;
}
@media (max-width: 1025px) and (min-width: 751px) {
  .exterior-img img {
    height: 261px;
  }
  .intro-img img {
    max-width: 88%;
  }
  h2.intro-heading {
    margin: 0;
    margin-bottom: 5px;
    line-height: 23px;
    font-size: 25px;
  }
  .intro-text p {
    margin: 0;
    font-size: 13px;
  }
  .intro-img img {
    max-width: 88%;
  }
  .info-two-text h2 {
    color: #fff !important;
    font-size: 30px;
    font-family: Oblik;
    margin: 0;
    line-height: 28px;
  }
  .info-two-text p {
    color: #fff !important;
    font-size: 15px;
    margin: 0;
  }
  .info-two-text {
    width: 46% !important;
  }
  .exterior-text {
    background-color: #4c4f56;
    margin: 0;
    color: #f2f2f2;
    min-height: 261px;
  }
  .exterior-text h1 {
    font-family: Oblik;
    font-size: 21px;
    margin-bottom: 0;
    line-height: 1.25em;
  }
  .exterior-text-in p {
    color: #fff;
    margin-bottom: 0;
    font-size: 14px;
    line-height: 1.25em;
  }
  .anchor-heading {
    color: #333072;
    font-size: 19px;
    line-height: 25px;
    font-weight: 700;
  }
}
@media (max-width: 1024px) and (min-width: 768px) {
  .info-div {
    z-index: 111;
  }
  .sample-popup-portico {
    width: 60%;
  }
}
@media (max-width: 750px) {
  .sample-popup-portico {
    padding: 0;
    width: 100%;
  }
  .portico-logo {
    margin-left: 0;
    margin-top: -6%;
    width: 84% !important;
    margin-left: 8%;
  }
  h2.intro-heading {
    font-size: 27px;
  }
  .intro-text p {
    font-size: 16px;
  }
  .intro-div img {
    margin-right: 0 !important;
  }
  .intro-img {
    margin-top: 1%;
  }
  .info-vid {
    padding: 15px;
  }
  .info-two-text {
    padding: 8px;
    margin-top: -504px;
    width: 95% !important;
  }
  .info-two-img {
    margin-top: 304px;
  }
  .anchor-heading {
    font-size: 18px;
    line-height: 30px;
  }
  .exterior-text h1 {
    font-size: 20px;
  }
  .exterior-text-in p {
    padding-right: 5px;
  }
  .exterior-text-in {
    padding: 10px;
  }
  .exterior-text {
    min-height: 339px;
  }
  .exterior-text {
    min-height: 339px;
  }
  .exterior-img {
    width: 100% !important;
  }
  .portico-blog {
    padding: 35px 2%;
    width: 95% !important;
  }
  .info-two-text h2 {
    font-size: 20px;
    font-family: Oblik-regular;
  }
}
.product-image-wrapper-portico {
  width: 345px;
}
.product-image-wrapper-portico img {
  width: 100%;
}
.portico-div ul {
  display: inline-flex;
}
.portico-div .item {
  overflow: hidden;
}
.collection-slider h3 {
  line-height: 25px;
  font-size: 15px;
  color: #000;
  font-weight: 400;
  font-family: Arial;
}
.collection-slider .size-value {
  color: #4a4a4a;
  display: inline-block;
  font-family: Arial;
  font-size: 0.875rem;
}
.content-slider p {
  font-weight: 700;
  font-size: 20px;
  color: #000;
  font-family: Arial;
}
.collection-slider .coverage-size {
  font-weight: 700;
  font-family: Arial;
}
.collection-slider li {
  padding: 24px;
}
.photogallery {
  font-size: 32px;
  font-family: Arial;
  font-weight: 700;
  text-align: center;
}
.customergallery {
  font-size: 32px;
  font-family: Arial;
  font-weight: 700;
  text-align: center;
}
.tilesglosary {
  font-size: 32px;
  font-family: Arial;
  color: #888;
}
.discount_codes {
  font-size: 32px;
  color: #888;
  font-family: Arial;
}
.about-us {
  font-size: 32px;
  font-family: Arial;
  margin-bottom: 0;
}
.careersh1 {
  font-size: 32px;
  font-family: Arial;
  margin-bottom: 0;
}
.site-map {
  font-size: 32px;
  font-family: Arial;
  margin-bottom: 0;
  color: #888;
}
.trustpiloth1 {
  font-size: 32px;
  font-family: Arial;
  margin-bottom: 0;
  color: #888;
}
.vouchers {
  font-size: 32px;
  font-family: Arial;
  margin-bottom: 0;
  color: #888;
}
#iubenda_policy.iubenda_fluid_policy #wbars {
  overflow-y: visible !important;
  overflow-x: visible !important;
}
.about-us-cms h1 {
    color: #071a44;
    font-size: 32px;
}
.about-us-cms h2 {
    color: #071a44;
    font-size: 28px;
}
.about-us-cms p {
    color: #333333;
    line-height: 30px;
}
.about-us-cms li {
    color: #333333;
}
.about-us-cms ul {
  padding-left: 0px;
}
a.about-cms-btn {
    background: #071a44 !important;
    max-width: 126px;
    width: 100%;
}
.showroom h1 {
    color: #071a44;
    font-size: 32px;
}
.showroom h2 {
    color: #071a44;
    font-size: 28px;
     margin: 0px;
}
.showroom p {
  color: #333333;
   line-height: 30px;
}
.showroom a {
    color: #57c9c0;
}
.showroom address {
    color: #333333;
}
span.shoroom-open {
    color: #071a44;
}
span.shoroom-btn {
    background: #071a44;
}
.showroom span.material-icons {
    color: #071a44;
}
.delivery-info h1 {
    color: #071a44;
    font-size: 32px;
}
.delivery-info h2 {
    color: #071a44;
    font-size: 28px;
}
.delivery-info h3 {
    color: #071a44 !important;
    font-size: 24px !important;
}
.delivery-info p {
  color: #333333;
   line-height: 30px;
}
a.delivery-link {
    color: #57c9c0;
}
.faqs-cms h1 {
      color: #071a44;
    font-size: 32px;
}
.faqs-cms h2 {
      color: #071a44;
    font-size: 28px;
}
.faqs-cms p {
    color: #333333;
   line-height: 30px;
}
.contact-cms h1{
      color: #071a44;
    font-size: 32px;
}
.contact-cms h2 {
      color: #071a44;
    font-size: 28px;
}
.contact-cms p {
    color: #333333;
   line-height: 30px;
}
.contact-cms strong {
    color: #333333;
}
.contact-cms ul {
   padding-left: 0;
}
</style>
