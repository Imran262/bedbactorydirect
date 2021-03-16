<template>
  <div>
    <header class="thank-you-title bg-cl-secondary py35 pl20">
      <div class="container">
        <h2 class="category-title">
          {{ $t('Order confirmation') }}
        </h2>
      </div>
    </header>
    <div class="thank-you-content align-justify py40 pl20">
      <div class="container">
        <div class="row">
          <div class="col-md-12 pl20 pr20">
            <h3>
              {{ $t('Your purchase') }}
            </h3>
            <p v-html="this.$t('You have successfuly placed the order. You can check status of your order by using our <b>delivery status</b> feature. You will receive an order confirmation e-mail with details of your order and a link to track its progress.')" />
            <p>
              <button-outline
                color="dark"
                @click.native="$router.push('/')"
              >
                {{ $t('Return to shopping') }}
              </button-outline>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonOutline from 'theme/components/theme/ButtonOutline'
export default {
  components: {
    ButtonOutline
  },
  mounted () {
    this.$store.dispatch('cart/clear', { sync: false }, { root: true })
  }
}
</script> 