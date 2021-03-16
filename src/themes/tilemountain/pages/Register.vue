<template>
  <div class="Register-Main">
    <div class="container flex mt50">
      <div class="RegisterDetails col-md-12 col-xs-12">
        <h1>Create an Account</h1>
        <div class="newCustomers col-md-12 col-xs-12 pl0">
          <h4>Please fill in your details below:</h4>
          <div class="LoginDetails col-md-12 col-xs-12 p0">
            <no-ssr>
              <register />
            </no-ssr>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
import ButtonFull from "theme/components/theme/ButtonFull";
import register from "theme/components/core/blocks/Auth/Register";
import NoSSR from "vue-no-ssr";
import i18n from '@vue-storefront/i18n'
import { htmlDecode } from '@vue-storefront/core/filters'
export default {
  computed: {
    // ...mapState({
    //   activeElem: (state) => state.ui.authElem,
    // }),
  },
  components: {
    ButtonFull,
    register,
    "no-ssr": NoSSR,
  },
  metaInfo () {
    return {
      title: htmlDecode(this.$route.meta.title || i18n.t('Customer Signup') || name),
      titleTemplate: '%s'
    }
  }
};
</script>

<style lang="scss" scoped>
.Register-Main {
  h1 {
    font-family: oblik;
    font-size: 41px;
    color: #29275b;
  }
  .newCustomers {
    h4 {
      font-size: 27px;
      color: #737374;
      font-family: Arial, Helvetica, sans-serif;
    }
    p {
      font-size: 18px;
      color: #6b6b6c;
      line-height: 1.9;
    }
  }
  .CreateAccountButton {
    padding: 36px 0;
    .registerbutton {
      width: 50%;
      background: #7f77a7;
      color: #ffffff;
      font-size: 19px;
      padding: 19.5px;
      font-weight: bold;
      border-radius: 3px;
    }
    .Amazonbutton {
      background-attachment: scroll;
      background-clip: border-box;
      background-color: #fcdd8a;
      border: 0px solid #fcdd8a;
      background-image: url("/assets/Amazon.png");
      background-origin: padding-box;
      background-position: 16% 45%;
      background-repeat: no-repeat;
      background-size: auto auto;
      border-radius: 3px;
      color: #fff;
      cursor: pointer;
      display: block;
      font-size: 14px;
      max-width: 310px;
      min-height: auto;
      position: relative;
      text-align: center;
      width: 95%;
      font-family: Arial;
      line-height: auto;
      font-weight: bold;
      padding: 31px 0px;
      text-transform: uppercase;
      margin-top: 5px;
    }
    p {
      color: #6b6b6c;
      font-size: 20px;
    }
  }
  @media (max-width: 767px) and (min-width: 320px) {
    .container{
      margin-top: 10px;
    }
    h1 {
      font-size: 20px;
      padding-left: 8px;
    }
    .newCustomers {
      h4 {
        font-size: 13px;
        margin-left: 8px;
      }
    }
  }
}
</style>
