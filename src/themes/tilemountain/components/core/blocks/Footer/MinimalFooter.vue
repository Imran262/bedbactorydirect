<template>
  <footer
    :class="{ 'brdr-top-1 brdr-cl-secondary': isCheckoutPage }"
    v-if="!isCheckoutPage"
  >
    <!-- <Footer /> -->
  </footer>
</template>
<script>
import CurrentPage from 'theme/mixins/currentPage'
import Footer from "theme/components/core/blocks/Footer/Footer";
import config from 'config'

export default {
  name: 'MainFooter',
  computed: {
    multistoreEnabled () {
      return config.storeViews.multistore
    }
  },
  components: {
    Footer
  },
  mixins: [CurrentPage]
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-secondary: color(secondary);

.icon {
  transition: 0.3s all;
}

.social-icon {
  width: 40px;
  height: 40px;
  &:hover,
  &:focus,
  &:active {
    .icon {
      fill: $color-secondary;
    }
  }
}
.links {
  list-style-type: none;
}

.bottom-links {
  @media (max-width: 767px) {
    padding: 0;
  }
}

.underline {
  &:hover {
    color: $color-secondary;
    &:after {
      background-color: $color-secondary;
    }
  }
}
.legal-entity-link {
  text-align: center;
  @media (min-width: 768px) {
    display: none;
  }
}

.privacy-policy-link {
  text-align: right;
  @media (min-width: 768px) {
    display: none;
  }
}

@media (max-width: 595px) {
  .no-mobile {
    display: none;
  }

  .social {
    margin-top: 0;
  }

  .footer-links {
    padding-bottom: 30px;
  }
}
</style>
