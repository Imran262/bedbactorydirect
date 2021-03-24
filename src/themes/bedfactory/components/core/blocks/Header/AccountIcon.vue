<template>
  <div>
    <div
      class="inline-flex relative dropdown"
      data-testid="accountButton"
      @click.self="showMenu = true"
      @keyup.enter="goToAccount"
      tabindex="0"
      role="button"
      @mouseover="showMenu = true"
      @mouseout="showMenu = false"
      :aria-label="$t('Open my account')"
    >
      <router-link
        :to="localizedRoute('/customer/account/login')"
        v-if="!currentUser"
      >
        <button type="button" class="bg-cl-transparent brdr-none p0">
          <img src="/assets/icons/user.svg" alt="user login" />
        </button>
      </router-link>
      <router-link :to="localizedRoute('/my-account')" v-else>
        <button type="button" class="bg-cl-transparent brdr-none p0">
          <img src="/assets/icons/user.svg" alt="user login" />
        </button>
      </router-link>
      <no-ssr>
        <div
          v-show="currentUser"
          :class="[
            'dropdown-content aalign-left sans-serif lh20 weight-400',
            !showMenu ? 'dropdown-content__hidden' : '',
          ]"
        >
          <div class="py5">
            <div
              v-for="(page, index) in navigation"
              :key="index"
              @click="notify(page.title)"
            >
              <router-link
                @click.native="showMenu = false"
                class="no-underline block py10 px15"
                :to="localizedRoute(page.link)"
                >{{ page.title }}</router-link
              >
            </div>
          </div>
          <div class="py5 brdr-top-1 brdr-cl-bg-secondary">
            <a
              href="#"
              class="no-underline block py10 px15"
              @click.prevent="logout"
              >{{ $t('Logout') }}</a
            >
          </div>
        </div>
      </no-ssr>
    </div>
    <!-- <router-link :to="localizedRoute('/my-account')" exact v-else>
   </router-link> -->
  </div>
</template>

<script>
import NoSSR from "vue-no-ssr"
import AccountIcon from "@vue-storefront/core/compatibility/components/blocks/Header/AccountIcon"

export default {
  mixins: [AccountIcon],
  components: {
    "no-ssr": NoSSR,
  },
  data() {
    return {
      showMenu: false,
      navigation: [
        { title: this.$t("My Dashboard"), link: "/my-account/dashboard" },
        { title: this.$t("Account Information"), link: "/my-account" },
        { title: this.$t("Address Book"), link: "/my-account/shipping-details"},
        { title: this.$t("My orders"), link: "/my-account/orders" },
        { title: this.$t("Quotations"), link: "/my-account/quotations" },
        { title: this.$t("Newsletter"), link: "/my-account/newsletter" },
        //{ title: this.$t("My loyalty card"), link: "#" },
        //{ title: this.$t("My product reviews"), link: "#" },
        {title: this.$t("Recently viewed products"),link: "/my-account/recently-viewed"},
      ],
    }
  },
  methods: {
    notify(title) {
      if (title === "My loyalty card" || title === "My product reviews") {
        this.$store.dispatch("notification/spawnNotification", {
          type: "warning",
          message: this.$t(
            "This feature is not implemented yet! Please take a look at https://github.com/DivanteLtd/vue-storefront/issues for our Roadmap!"
          ),
          action1: { label: this.$t("OK") },
        })
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~theme/css/base/global_vars';
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-icon-hover: color(secondary, $colors-background);

.dropdown {
  // padding-right: 42px;
  padding-right: 13px;
  outline: none;
  button {
    pointer-events: none;
    padding-top: 20px;
  }
  img {
    height: 22px;
    margin-top: 9px;
  }
  .dropdown-content {
    display: none;
    position: absolute;
    right: 0;
    top: 100%;
    width: 170px;
    z-index: 9;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }
  a {
    // opacity: 0.6;
    text-align: left;

    &:hover,
    &:focus {
      // background-color: transparent;
      opacity: 1;
    }
  }
  @media (min-width: 767px) {
    &:hover .dropdown-content:not(.dropdown-content__hidden),
    &:focus .dropdown-content:not(.dropdown-content__hidden) {
      display: block;
    }

    &:focus-within {
      // background-color: $color-icon-hover;
      opacity: 1;
      .dropdown-content:not(.dropdown-content__hidden) {
        display: block;
      }
    }
  }
}
@media (min-width: 767px) and (max-width: 1199px) {
  .dropdown img {
    margin-top: 0px;
  }
  .dropdown {
    button {
      padding-top: 28px;
    }
  }
}
@media (max-width: 767px) {
  .dropdown {
    padding: 0px;
    button {
      height: 78px;
      width: 100%;
      max-width: 3em;
      padding: 0px;
    }
  }
  .dropdown img {
    // height: 28px;
    // margin-top: 8px;
    height: 100%;
    width: 6vw;
    padding-top: 1px;
    margin: 0px;
  }
}
@media (min-width: 320px) and (max-width: 480px) {
  .dropdown {
    button {
      max-width: 2em;
      // transform: scale(0.65);
    }
  }
}
// @media (max-width: 399px) {
//   .dropdown img {
//     height: 24px;
//   }
// }
</style>
