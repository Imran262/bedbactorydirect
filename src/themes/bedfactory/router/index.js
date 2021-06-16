import routes from "../../tilemountain/router";

const Swatches = () =>
  import(/* webpackChunkName: 'vsf-static' */ 'theme/pages/Swatches.vue');
routes.push(
  {
    name: "swatches",
    path: "/swatches",
    component: Swatches,
    props: { page: "swatches", title: "Swatches" }
  },
  {
    name: "fail",
    path: "/fail",
    component: Fail
  }
);

export default routes;
