<template>
  <div class="main_pro">
  <div class="mb35">
    <!-- My orders header -->
    <div class="row mb15 main_pro1">
      <div class="col-xs-12 col-sm-6">
        <h3 class="m0 mb5">
          {{ $t('My orders') }}
        </h3>
      </div>
    </div>
    <!-- My orders body -->
    <div class="row p20">
      <div class="col-xs-12" v-show="!isHistoryEmpty">
        <table class="brdr-1 brdr-cl-bg-secondary">
          <thead>
            <tr>
              <th class="p20 lh20">
                {{ $t('Order ID') }}
              </th>
              <th class="p20 lh20 hide-on-xs">
                {{ $t('Date and time') }}
              </th>
              <th class="p20 lh20 hide-on-xs">
                {{ $t('Author') }}
              </th>
              <th class="p20 lh20 hide-on-xs">
                {{ $t('Value') }}
              </th>
              <th class="p20 lh20 hide-on-xs">
                {{ $t('Type') }}
              </th>
              <th class="p20 lh20 hide-on-xs">
                {{ $t('Status') }}
              </th>
              <th class="p20 lh20">
&nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="brdr-top-1 brdr-cl-bg-secondary" v-for="order in ordersHistory" :key="order.entity_id">
              <td class="fs-medium lh25">
                #{{ order.increment_id }}
              </td>
              <td class="fs-medium lh25 hide-on-xs">
                {{ order.created_at | date(null, storeView) }}
              </td>
              <td class="fs-medium lh25 hide-on-xs">
                {{ order.customer_firstname }} {{ order.customer_lastname }}
              </td>
              <td class="fs-medium lh25 hide-on-xs">
                {{ order.grand_total | price(storeView) }}
              </td>
              <td class="fs-medium lh25 hide-on-xs">
                {{ $t('Purchase') }}
              </td>
              <td class="fs-medium lh25 hide-on-xs">
                {{ order.status | capitalize }}
              </td>
              <td class="fs-medium lh25">
                <router-link class="no-underline block py10 px15" :to="{path: '/my-account/orders/' + order.entity_id}">
                  <span title="View Order">
                    <i data-v-f2390ed2="" class="material-icons cl-secondary pointer">visibility</i>
                  </span>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-xs-12 h4" v-show="isHistoryEmpty">
        <p>{{ $t('No orders yet') }}</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import UserOrder from '@vue-storefront/core/modules/order/components/UserOrdersHistory'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  mixins: [UserOrder],
  computed: {
    storeView () {
      return currentStoreView()
    }
  },
  watch: {
    $route: function (to, from) {
      console.log("420 to: ",to , "\t\t\t420 from ",from);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/base/global_vars';
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-icon-hover: color(secondary, $colors-background);

table {
  border-collapse: collapse;
  width: 100%;

  th, td {
    text-align: left;
    padding: 20px;
    font-family: Arial;

    @media (max-width: 1199px) {
      padding: 10px;
    }

    @media (max-width: 767px) {
      text-align: center;
    }

    &.hide-on-xs {

      @media (max-width: 767px) {
        display: none;
      }

    }

  }

  i {
    vertical-align: middle;
  }

}

.dropdown {
  display: block;
  margin: -20px;
  padding: 20px;

  @media (max-width: 1199px) {
    margin: -10px;
    padding: 10px;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    right: 0;
    top: 100%;
    width: 160px;
    z-index: 1;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }

  a {
    opacity: .6;

    &:hover,
    &:focus {
      background-color: $color-icon-hover;
      opacity: 1;
    }

  }

  &:hover .dropdown-content {
    display: block;
  }

}
.main_pro {
     border: 1px solid #b7b4b4;
    border-radius: 10px;
    padding: 7px;
  background: #fff;
}
.main_pro1{
     border: 1px solid #b7b4b4;
    background-color:#071a44;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    margin-top: -9px;
      padding: 8px;
}
h3{
    color: #fff;

}

.bg-cl-mine-shaft {
    background-color: #29275b!important;
}
h1, h2, h3, h4, h5 {
   font-family: oblik !important;
}
.cl-tertiary {
    color: #fff!important;
}
.main_pro p {
    color: #333333;
}
@media (max-width: 1024px){
.main_pro p {
    font-size: 14px;
}
}
</style>
