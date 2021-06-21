<template>
  <router-link
    :to="localizedRoute('/')"
    :title="$t('Home Page')"
    class="no-underline inline-flex"
  >
    <img
      :width="width"
      :height="height"
      :src="logoPath"
      :alt="$t(defaultTitle)"
    />
  </router-link>
</template>

<script>
import config from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  data () {
    const storeView = currentStoreView()
    return {
      defaultTitle: config?.themeConfigurations?.title || storeView?.seo?.defaultTitle || config?.seo?.defaultTitle
    }
  },
  props: {
    width: {
      type: [String, Number],
      required: true
    },
    height: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    logoPath () {
      return config?.themeConfigurations?.logo || '/assets/logo.svg';
    }
  }
};
</script>
<style lang="scss" scoped>
@media (max-width: 992px) {
  img {
    // width: 115px;
  }
}

@media (max-width: 767px) {
  img {
    // width: 100%;
    // height: 100%;
    width: 137px;
    // max-width: 168px;
    height: 100%;
  }
}

@media (min-width: 320px) and (max-width: 480px) {
  img {
    width: 100px;
    min-height: 45px;
  }
}

@media (min-width: 481px) and (max-width: 600px) {
  img {
    width: 137px;
  }
}

@media (min-width: 768px) and (max-width: 992px) {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
