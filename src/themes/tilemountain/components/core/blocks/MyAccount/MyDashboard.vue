<template>
  <div class="main_pro">
    <div class="mb35">
      <div class="row mb15 main_pro1">
        <div class="col-xs-12 col-sm-6" :class="{ 'cl-accent' : !isEdited }">
          <h3 class="m0 mb5">
            {{ $t('My Dashboard') }}
          </h3>
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="lh30 flex end-md">
              &nbsp;
          </div>
        </div>
      </div>

      <!-- My profile summary -->
      <div class="row fs16 mb35">
        <div class="col-xs-6 h4 p20">
          <h2>Personal Info</h2>
          <p>
            {{ currentUser.firstname }} {{ currentUser.lastname }}
          </p>
          <p>
            {{ currentUser.email }}
          </p>
        </div>
        <div class="col-xs-6 h4 p20">
          <div class="col-xs-12 h4">
            <h2>Shipping Info</h2>
            <p class="mb25">
              {{ shippingDetails.company }}
            </p>
            <p class="mb25">
              {{ shippingDetails.street }}
              <span v-if="shippingDetails.house"> {{ shippingDetails.house }}</span>
            </p>
            <p class="mb25">
              {{ shippingDetails.city }} {{ shippingDetails.postcode }}
            </p>
            <p class="mb25">
              {{ getCountryName() }}
            </p>
            <div class="mb25">
              {{ shippingDetails.phone }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyProfile from '@vue-storefront/core/compatibility/components/blocks/MyAccount/MyProfile'
import MyShippingDetails from '@vue-storefront/core/compatibility/components/blocks/MyAccount/MyShippingDetails'
export default {
  components: {
  },
  mixins: [MyProfile, MyShippingDetails]
}
</script>
<style scoped>
.main_pro {
     border: 1px solid #b7b4b4;
    border-radius: 10px;
    padding: 7px;
}
.main_pro1{
     border: 1px solid #b7b4b4;
    background-color: #00a897;
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
</style>
