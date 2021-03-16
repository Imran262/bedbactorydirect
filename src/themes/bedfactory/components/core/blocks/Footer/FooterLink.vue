<template>
  <ul>
    <li v-for="singleblock in footersingleblock" :key="'footer_key' + singleblock.hthree">
      <template v-if="singleblock.hthree === 'Your account'">
        <span
          v-if="!currentUser"
          @click="goToAccount()"
          class="your-account-login-btn"
        >
          {{ singleblock.hthree }}
        </span>
        <router-link
          v-else
          :to="localizedRoute(singleblock.atag)"
          :key="singleblock.hthree"
        >
          {{ singleblock.hthree }}
        </router-link>
      </template>
      <template v-else-if="singleblock.hthree === 'Your Wishlist'">
        <span class="your-whishlist-login-btn" @click="toggleWishlistPanel">
          {{
            singleblock.hthree
          }}
        </span>
      </template>
      <template v-else>
        <router-link
          :to="localizedRoute(singleblock.atag)"
          :key="singleblock.hthree"
        >
          {{ singleblock.hthree }}
        </router-link>
      </template>
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex';
import cmsBlock from 'vsf-cms-block-mixin/components/cmsBlock';
import Modal from 'theme/components/core/Modal.vue';
import WishlistIcon from '@vue-storefront/core/compatibility/components/blocks/Header/WishlistIcon';
export default {
  name: 'FooterLink',
  mixins: [cmsBlock, WishlistIcon],
  computed: {
    ...mapState({
      currentUser: state => state.user.current
    }),
    footersingleblock() {
      var homeSmallBlocks = [];
      var mbclasses = this.parsedContent.querySelectorAll(
        '.mb_home_small_img li'
      );
      // console.log('Sb -class ', mbclasses);
      var i = 0;
      [].forEach.call(mbclasses, mbclass => {
        var singleBlock = new Array(0);

        singleBlock['atag'] = mbclass.querySelector('a').attributes['href'];
        singleBlock['hthree'] = mbclass.querySelector('a').rawText;

        homeSmallBlocks[i] = singleBlock;
        i++;
      });

      return homeSmallBlocks;
    }
  },
  methods: {
    goToAccount() {
      this.$bus.$emit('modal-toggle', 'modal-signup');
    }
  },
  async mounted() {
    this.$nextTick(() => {
      this.componentLoaded = true;
      this.$bus.$emit('modal-show', 'modal-switcher');
    });
  }
};
</script>
<style scoped>
.your-account-login-btn {
  cursor: pointer;
}
.your-account-login-btn:hover {
  border-bottom: 1px solid #bdbdbd;
}
.your-whishlist-login-btn {
  cursor: pointer;
}
.your-whishlist-login-btn:hover {
  border-bottom: 1px solid #bdbdbd;
}
</style>
