<template>
    <div
      class="inline-flex relative dropdown headerIconsNew"
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
        <!-- <button type="button" class="bg-cl-transparent brdr-none p0"> -->
        <div class="iconContainer">

          <img src="/assets/icons/user.svg" alt="user login" />
        </div>
          <span class="account">Account</span>
        <!-- </button> -->
      </router-link>
      <router-link :to="localizedRoute('/my-account')" v-else>
        <!-- <button type="button" class="bg-cl-transparent brdr-none p0"> -->
        <div class="iconContainer">
          <img src="/assets/icons/user.svg" alt="user login" />
        </div>
          <span class="account">Account</span>

        <!-- </button> -->
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
              >{{ $t("Logout") }}</a
            >
          </div>
        </div>
      </no-ssr>
    </div>
    <!-- <router-link :to="localizedRoute('/my-account')" exact v-else>
   </router-link> -->
</template>

<script>
import NoSSR from "vue-no-ssr";
import AccountIcon from "@vue-storefront/core/compatibility/components/blocks/Header/AccountIcon";
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
        {
          title: this.$t("Address Book"),
          link: "/my-account/shipping-details",
        },
        { title: this.$t("My orders"), link: "/my-account/orders" },
        { title: this.$t("Quotations"), link: "/my-account/quotations" },
        { title: this.$t("Newsletter"), link: "/my-account/newsletter" },
        //{ title: this.$t("My loyalty card"), link: "#" },
        //{ title: this.$t("My product reviews"), link: "#" },
        {
          title: this.$t("Recently viewed products"),
          link: "/my-account/recently-viewed",
        },
      ],
    };
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
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~theme/css/base/global_vars";
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$color-icon-hover: color(secondary, $colors-background);
.headerIconsNew > a {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.headerIconsNew > a .iconContainer {
    width: 24px;
}
.headerIconsNew > a .iconContainer img{
    max-width: 100%;
}
.account {
  display: block;
  font-size: 9px;
  font-weight: 600;
  font-family: "Roboto";
  color: #2A275B;
}
.dropdown {
  outline: none;
  button {
    margin-right: 1rem;
    pointer-events: none;
    padding-top: 17px;
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
    
    &:hover,
    &:focus {
      opacity: 1;
    }
  }

  @media (min-width: 768px) {
    &:hover .dropdown-content:not(.dropdown-content__hidden),
    &:focus .dropdown-content:not(.dropdown-content__hidden) {
      display: block;
    }

    &:focus-within {
      background-color: $color-icon-hover;
      opacity: 1;
      .dropdown-content:not(.dropdown-content__hidden) {
        display: block;
      }
    }
  }
}

@media (max-width: 767px) {
  .headerIconsNew > a .iconContainer {
    width: 22px;
  }
}
@media (min-width: 991px) {
  .account {
    font-size: 10px;
    
  }
}

</style>