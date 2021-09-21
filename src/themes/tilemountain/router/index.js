const Home = () => import(/* webpackChunkName: "vsf-home" */ 'theme/pages/Home.vue')
const PageNotFound = () => import(/* webpackChunkName: "vsf-not-found" */ 'theme/pages/PageNotFound.vue')
const ErrorPage = () => import(/* webpackChunkName: "vsf-error" */ 'theme/pages/Error.vue')
const Product = () => import(/* webpackChunkName: "vsf-product" */ 'src/themes/bedfactory/pages/Product.vue')
const Category = () => import(/* webpackChunkName: "vsf-category" */ 'theme/pages/Category.vue')
const CmsPage = () => import(/* webpackChunkName: "vsf-cms" */ 'theme/pages/CmsPage.vue')
const Checkout = () => import(/* webpackChunkName: "vsf-checkout" */ 'theme/pages/Checkout.vue')
const ConfirmOrder = () => import(/* webpackChunkName: "vsf-checkout" */ 'theme/pages/Confirmation.vue')
const video = () => import(/* webpackChunkName: "vsf-checkout" */ 'theme/pages/videogallery.vue')
const Cart = () => import(/* webpackChunkName: "vsf-checkout" */ 'theme/pages/Cart.vue')
const Login = () => import(/* webpackChunkName: "vsf-checkout" */ 'theme/pages/Login.vue')
const Register = () => import(/* webpackChunkName: "vsf-checkout" */ 'theme/pages/Register.vue')
const ForgetPassword = () => import(/* webpackChunkName: "vsf-checkout" */ 'theme/pages/ForgetPassword.vue')
const Compare = () => import(/* webpackChunkName: "vsf-compare" */ 'theme/pages/Compare.vue')
const MyAccount = () => import(/* webpackChunkName: "vsf-my-account" */ 'theme/pages/MyAccount.vue')
const Static = () => import(/* webpackChunkName: "vsf-static" */ 'theme/pages/Static.vue')
const ResetPassword = () => import(/* webpackChunkName: "vsf-reset-password" */ 'theme/pages/ResetPassword.vue');
const CatalogSearch = () =>
  import(
    /* webpackChunkName: "vsf-static" */ 'theme/pages/CatalogSearch.vue'
  );
const TmSearch = () =>
  import(
    /* webpackChunkName: "vsf-static" */ 'theme/pages/TmSearch.vue'
  );
const Success3D = () => import(/* webpackChunkName: "vsf-my-account" */ 'theme/pages/Success.vue')
const Fail3D = () => import(/* webpackChunkName: "vsf-my-account" */ 'theme/pages/Fail.vue')
const Swatches = () =>
  import(/* webpackChunkName: 'vsf-static' */ 'src/themes/bedfactory/pages/Swatches.vue');
const SwatchSuccess = () =>
  import(/* webpackChunkName: 'vsf-static' */ 'src/themes/bedfactory/pages/SwatchesSuccess.vue');
const CheckoutSuccess = () =>
  import(/* webpackChunkName: 'vsf-static' */ 'src/themes/bedfactory/pages/CheckoutSuccess.vue');
const FinanceSuccess = () =>
  import(/* webpackChunkName: 'vsf-static' */ 'src/themes/bedfactory/pages/Financesuccess.vue');
let routes = [
  { name: 'home', path: '/', component: Home, alias: '/pwa.html' },
  { name: 'checkout', path: '/checkout', component: Checkout },
  { name: 'confirmorder', path: '/confirmorder', component: ConfirmOrder },
  { name: 'videogallery', path: '/videogallery', component: video },
  { name: 'cart', path: '/cart', component: Cart },
  { name: 'login', path: '/customer/account/login', component: Login },
  { name: 'register', path: '/customer/account/create', component: Register },
  { name: 'forgetpassword', path: '/forgetpassword', component: ForgetPassword },
  { name: 'my-account', path: '/my-account', component: MyAccount },
  { name: 'my-shipping-details', path: '/my-account/shipping-details', component: MyAccount, props: { activeBlock: 'MyShippingDetails' } },
  { name: 'quotations', path: '/my-account/quotations', component: MyAccount, props: { activeBlock: 'Quotations' } },
  { name: 'my-newsletter', path: '/my-account/newsletter', component: MyAccount, props: { activeBlock: 'MyNewsletter' } },
  { name: 'my-dashboard', path: '/my-account/dashboard', component: MyAccount, props: { activeBlock: 'MyDashboard' } },
  { name: 'my-orders', path: '/my-account/orders', component: MyAccount, props: { activeBlock: 'MyOrders' } },
  { name: 'my-order', path: '/my-account/orders/:orderId', component: MyAccount, props: { activeBlock: 'MyOrder' } },
  { name: 'my-recently-viewed', path: '/my-account/recently-viewed', component: MyAccount, props: { activeBlock: 'MyRecentlyViewed' } },
  { name: 'order-from-catalog', path: '/order-from-catalog', component: Static, props: { page: 'lorem', title: 'Order from catalog' } },
  { name: 'compare', path: '/compare', component: Compare, props: { title: 'Compare Products' } },
  { name: 'error', path: '/error', component: PageNotFound },
  // { name: 'error', path: '/error', component: ErrorPage, meta: { layout: 'minimal' } },
  { name: 'virtual-product', path: '/p/:parentSku/:slug', component: Product }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
  { name: 'bundle-product', path: '/p/:parentSku/:slug', component: Product }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
  { name: 'simple-product', path: '/p/:parentSku/:slug', component: Product }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
  { name: 'downloadable-product', path: '/p/:parentSku/:slug', component: Product }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
  { name: 'grouped-product', path: '/p/:parentSku/:slug', component: Product }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
  { name: 'configurable-product', path: '/p/:parentSku/:slug/:childSku', component: Product }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
  { name: 'product', path: '/p/:parentSku/:slug/:childSku', component: Product }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
  { name: 'category', path: '/c/:slug', component: Category },
  { name: 'cms-page', path: '/i/:slug', component: CmsPage },
  { name: 'create-password', path: '/create-password', component: ResetPassword },
  { name: 'page-not-found', path: '*', component: PageNotFound },
  { name: 'Success', path: '/success', component: Success3D },
  { name: 'Fail', path: '/fail', component: Fail3D },
  {
    name: 'catalog-search',
    path: '/catalog-search',
    component: CatalogSearch
  },
  {
    name: 'tm-search',
    path: '/catalogsearch/result',
    component: TmSearch
  },
  {
    name: 'swatches',
    path: '/swatches',
    component: Swatches,
    props: { page: 'swatches', title: 'Swatches' }
  },
  {
    name: 'swatches-success',
    path: '/swatches-success',
    component: SwatchSuccess,
    props: { page: 'swatches', title: 'Swatches' }
  },
  { name: 'CheckoutSuccess', path: '/checkout-success', component: CheckoutSuccess }
  { name: 'FinanceSuccess', path: '/finance-success', component: FinanceSuccess }
]

export default routes
