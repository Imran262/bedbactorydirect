<template>
  <router-link
    class="inline-flex between-xs w-100 px25 py20 pr15 serif cl-accent bg-cl-transparent brdr-none fs-medium"
    :to="localizedRoute( link )"
  >{{ name }}</router-link>
</template>
<script>
import { mapState } from 'vuex';
import config from 'config';
export default {
  name: 'SubBtnNew',
  props: {
    id: {
      type: null,
      default: ''
    },
    type: {
      type: String,
      default: 'next'
    },
    name: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      submenu: state => state.ui.submenu
    })
  },
  methods: {
    next() {
      if (config.entities.category.categoriesDynamicPrefetch)
        this.$store.dispatch('category/list', { parent: this.id });
      this.$store.commit('ui/setSubmenu', {
        id: this.id,
        depth: ++this.submenu.depth
      });
    },
    back() {
      this.$store.commit('ui/setSubmenu', {
        depth: --this.submenu.depth
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-gray: color(gainsboro);
$color-black: color(matterhorn);

button {
  i {
    color: #333;
    font-size: 28px;
    line-height: 24px;
  }
  &:hover,
  &:focus {
    i {
      color: $color-black;
    }
  }
}
</style>
