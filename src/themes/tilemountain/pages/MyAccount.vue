<template>
  <div class="back-color" id="my_account">
    <div class="bg-cl-secondary py15 pl20">
      <div class="container">
        <breadcrumbs
          :with-homepage="true"
          :routes="[]"
          :active-route="myAccountBreadcrumb"
          class="account-breadcrumbs"
        />
        <!-- <h1>
          {{ $t('My Account') }}
        </h1> -->
      </div>
    </div>

    <div class="container pt45 pb35">
      <div class="row px20 pt0">
        <div class="col-12 col-md-3 block">
          <nav class="static-menu serif h4 mb35">
            <ul class="m0 p0 dashborad">
              <li v-for="(page, index) in navigation" :key="index" @click="notify(page.title,$event)">
                <router-link :to="localizedRoute(page.link)" :class="currentRoute === page.link ? 'routerActive' : '' " class="cl-accent playimg">
                  {{ page.title }}
                </router-link>
              </li>
              <li class="py5 brdr-top-1 brdr-cl-bg-secondary">
                <a
                  href="#"
                  class="no-underline block py10 px15 NewClasss"
                  @click.prevent="logout"
                >
                  {{ $t('Logout') }}</a>
              </li>
            </ul>
          </nav>
        </div>
        <div class="col-12 col-md-9">
          <no-ssr>
            <component :is="this.$props.activeBlock" />
          </no-ssr>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyAccount from '@vue-storefront/core/pages/MyAccount'
import Breadcrumbs from '../components/core/Breadcrumbs'
import MyProfile from '../components/core/blocks/MyAccount/MyProfile'
import MyShippingDetails from '../components/core/blocks/MyAccount/MyShippingDetails'
import MyNewsletter from '../components/core/blocks/MyAccount/MyNewsletter'
import MyDashboard from '../components/core/blocks/MyAccount/MyDashboard'
import MyOrders from '../components/core/blocks/MyAccount/MyOrders'
import Quotations from '../components/core/blocks/MyAccount/Quotations'
import MyOrder from '../components/core/blocks/MyAccount/MyOrder'
import MyQuotationOrder from '../components/core/blocks/MyAccount/MyQuotationOrder'
import MyRecentlyViewed from '../components/core/blocks/MyAccount/MyRecentlyViewed'
import NoSSR from 'vue-no-ssr'
import { RecentlyViewedModule } from '@vue-storefront/core/modules/recently-viewed'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { htmlDecode } from '@vue-storefront/core/filters'
import i18n from '@vue-storefront/i18n'
import { AccountButton } from '@vue-storefront/core/modules/user/components/AccountButton'

export default {
  data () {
    return {
      navigation: [
        { title: this.$t('My Dashboard'), link: '/my-account/dashboard' },
        { title: this.$t('Account Information'), link: '/my-account' },
        { title: this.$t('Address Book'), link: '/my-account/shipping-details' },
        { title: this.$t('My orders'), link: '/my-account/orders' },
        { title: this.$t('Quotations'), link: '/my-account/quotations' },
        // { title: this.$t('My loyalty card'), link: '#card' },
        // { title: this.$t('My product reviews'), link: '#reviews' },
        { title: this.$t('Newsletter'), link: '/my-account/newsletter' },
        { title: this.$t('Recently viewed products'), link: '/my-account/recently-viewed' }
      ],
      myAccountBreadcrumb: 'My Account',
      currentRoute: null
    }
  },
  components: {
    Breadcrumbs,
    MyProfile,
    MyShippingDetails,
    MyNewsletter,
    MyDashboard,
    MyOrders,
    MyOrder,
    MyQuotationOrder,
    MyRecentlyViewed,
    Quotations,
    'no-ssr': NoSSR
  },
  beforeCreate () {
    registerModule(RecentlyViewedModule)
  },
  mixins: [MyAccount, AccountButton],
  methods: {
    notify (title, e) {
      document.querySelector('.playimg').classList.remove('routerActive')
      e.target.classList.add('routerActive')

      if (title === 'My loyalty card' || title === 'My product reviews') {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'warning',
          message: this.$t('This feature is not implemented yet! Please take a look at https://github.com/DivanteLtd/vue-storefront/issues for our Roadmap!'),
          action1: { label: this.$t('OK') }
        })
      }
    }
  },
  mounted () {
    this.myAccountBreadcrumb = this.$route.name.replace(/-/g, ' ');
    console.log('my router mounted:', this.$route);
  },
  created () {
    console.log('my router created:', this.$route);
    this.currentRoute = this.$route.path
  },
  watch: {
    $route: function (to, from) {
      this.myAccountBreadcrumb = to.name.replace(/-/g, ' ');
      console.log('121 to:' + to.name + '\t\t\t from:' + from.name)
      if (to.name == 'my-order' && from.name == 'my-orders') {
        this.currentRoute = '/my-account/orders';
        console.log('121 here 1')
      } else if (to.name == 'my-quotation-order' && from.name == 'quotations') {
        this.currentRoute = '/my-account/quotations';
        console.log('121 here 2')

      } else {
        this.currentRoute = this.$route.path;
        console.log('121 here 3')

      }
      console.log('121 this.currentRoute', this.currentRoute)
    }
  },
  metaInfo () {
    return {
      title: htmlDecode(this.$route.meta.title || i18n.t('My Account') || name),
      titleTemplate: '%s'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/base/text';
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-tertiary: color(tertiary);
#my_account{
  ul {
  list-style-type: none;
  padding: 0;
  border: 1px solid #b7b4b4;
}
.h4 {
    font-size: 17px !important;
}
.serif {
    font-family: oblik !important;
    background-color: #fff;
}

li {

  border-bottom: 1px solid #b7b4b4;
}

ul li:last-child {
  border-bottom: none
}
a:hover:after {
cursor: pointer;
content: none !important;
position: absolute;
bottom: 0;
left: 0;
width: 100%;
height: 1px;
background-color: transparent;
}
.static-menu {
  ul {
    list-style: none;
  }
}

.right{
  float:right;
   font-size: 18px;
       color: #4f4f4f;
}

}
.dashborad{
  a{
    display: block;
    padding: 15px;
  }
}
.routerActive{
  background-color:#071a44 !important;
  color: #fff !important;
}
.routerActive.playimg{
  background-image: url(/assets/icons/accplay-white.svg);
}
.back-color{
  background-color: #f2f2f2;
}
.block{
  padding-right: 17px;
}

.account-breadcrumbs {
  text-transform: capitalize;
}
.playimg{
  background: url(/assets/icons/accplay.svg) no-repeat 95% 46%;
  background-size: 18px;
}
.main_pro .col-xs-12 {
    color: #333333;
    font-size: 16px;
}
</style>
