<template>
  <div v-if="shouldShowBlock">
    <CmsBlock :identifier="getIdentifier"/>
  </div>
</template>

<script>
import CmsBlock from 'vsf-cms-block-mixin/components/cmsBlock';
    // '@vue-storefront/theme-custom/components/core/blocks/Cms/Block';
import { isServer } from '@vue-storefront/core/helpers';

export default {
  components: {
    CmsBlock
  },
  props: {
    identifier: {
      type: String,
      required: true
    },
    currentMethod: {
      type: String,
      required: true
    },
    isCalendarSelected: {
      type: Boolean,
      required: true
    }
  },
  serverPrefetch () {
    return this.fetchCmsBlock();
  },
  created () {
    if (!isServer) {
      this.fetchCmsBlock();
    }
  },
  methods: {
    fetchCmsBlock () {
      let queryKey = '';
      let queryValue = '';
      if (this.id) {
        queryKey = 'id';
        queryValue = this.id;
      } else if (this.getIdentifier) {
        queryKey = 'identifier';
        queryValue = this.getIdentifier;
      }
      if (queryKey && queryValue) {
        return this.$store.dispatch('cmsBlock/single', {
          key: queryKey,
          value: queryValue
        });
      }
    }
  },
  computed: {
    getIdentifier () {
      return 'shpm_' + this.identifier
    },
    getCurrentlySelectedMethod () {
      return 'shpm_' + this.currentMethod
    },
    getCmsData () {
      if (this.id) {
        return this.$store.getters[`cmsBlock/getCmsBlockById`](this.id);
      } else if (this.getIdentifier) {
        return this.$store.getters[`cmsBlock/getCmsBlockByIdentifier`](
          this.getIdentifier
        );
      }
      return null;
    },
    shouldShowBlock () {
      return this.getCmsData && this.getCmsData.content && (this.getCurrentlySelectedMethod === this.getCmsData.identifier) && !this.isCalendarSelected
    }
  }
}
</script>

<style>

</style>
