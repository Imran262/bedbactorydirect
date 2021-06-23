<template>
  <div class="Login-Main">
    <div class="container flex mt50 resetPasswordMain" v-if="emailAddressStore" v-once>
      <div class="row">
        If there is an account associated with {{ emailAddressStore }} you will recieve an email with a link to reset your password.
      </div>
    </div>
    <div class="container flex mt50">
      <div class="row">
        <div class="RegisterDetails col-md-6 col-xs-12">
          <h1>Login or Create an Account</h1>
          <div class="newCustomers col-md-12">
            <h4 class="newCustomers1">New Customers</h4>
            <p>
              By creating an account with our store, you will be able to move
              through the checkout process faster, store multiple shipping
              addresses, view and track your orders in your account and more.
            </p>
          </div>
          <div class="CreateAccountButton col-md-12">
            <button-full
              class="registerbutton"
              @click.prevent="switchElem"
              :link="{ name: 'register' }"
              >{{ $t("Create an Account") }}</button-full
            >
            <!-- <p>Or</p>
            <button-full class="Amazonbutton" :link="{ name: '' }">{{
              $t("")
            }}</button-full> -->
          </div>
        </div>
        <div class="LoginDetails col-md-6 col-xs-12">
          <no-ssr>
            <login />
          </no-ssr>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NoSSR from "vue-no-ssr";
import ButtonFull from "theme/components/theme/ButtonFull";
import Login from "theme/components/core/blocks/Auth/Login";
import i18n from '@vue-storefront/i18n'
import { htmlDecode } from '@vue-storefront/core/filters'
export default {
  computed: {
    ...mapState({
      activeElem: (state) => state.ui.authElem,
    }),
  },
  data() {
    return {
      emailAddressStore: null
    }
  },
  mounted () {
    let emailAddressStorage = localStorage.getItem('emailSendTo')
    if (emailAddressStorage && emailAddressStorage !== '' && emailAddressStorage !== undefined) {
      this.emailAddressStore = emailAddressStorage;
      localStorage.setItem('emailSendTo', '')
    }
  },
  components: {
    ButtonFull,
    Login,
    "no-ssr": NoSSR,
  },
  metaInfo () {
    return {
      title: htmlDecode(this.$route.meta.title || i18n.t('Customer Login') || name),
      titleTemplate: '%s'
    }
  }
};
</script>

<style lang="scss" scoped>
.newCustomers1{
  margin-top: 32px;
  margin-bottom: 0px;
}
.Login-Main {
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
      color: #333333;
      line-height: 1.9;
    }
  }
  .CreateAccountButton {
    padding: 36px 0;
    .registerbutton {
      width: 50%;
      background: #071a44;
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
  @media (max-width: 1200px) and (min-width: 768px) {
    .CreateAccountButton {
      .Amazonbutton {
        max-width: 250px;
        background-position: 37% 45%;
      }
    }
  }
  @media (max-width: 767px) and (min-width: 320px) {
    .RegisterDetails {
      padding-left: 27px;
      padding-right: 27px;
      h1 {
        font-size: 20px;
      }
      .CreateAccountButton {
        padding-top: 35px;
        p {
          font-size: 12px;
        }
        .registerbutton {
          min-width: 170px;
          padding: 14px;
          font-size: 12px;
          width: 35%;
        }
        .Amazonbutton {
          box-shadow: none;
          outline: none;
          background-color: transparent;
          max-width: 50%;
          min-width: 170px;
          background-size: 175px 41px;
          background-position: 16% 8%;
          margin-top: 0;
        }
      }
    }
    .LoginDetails {
      padding-left: 20px;
      padding-right: 20px;
    }
    .container {
      margin-top: 10px;
    }
    .newCustomers {
      h4 {
        font-size: 12px;
      }
      p {
        font-size: 12px;
        margin-bottom: 0;
      }
    }
  }
  @media(max-width: 450px){
    .CreateAccountButton {
      padding-top: 13px !important;
    }
  }
}
.resetPasswordMain {
  border-color: #296a23;
  background-color: #e9ffca;
  background-image: url(../assets/images/i_msg-success.png);
  color: #296a23;
  background-position: 25px center!important;
  background-repeat: no-repeat!important;
  padding: 25px 25px 25px 80px!important;
  font-size: 12px!important;
}
</style>
