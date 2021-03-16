<template>
  <div>
    <header class="bg-cl-secondary py35 pl20">
      <div class="container">
        <h2 class="category-title">
          {{ $t('Payment error') }}
        </h2>
      </div>
    </header>
    <div class="align-justify py40 pl20">
      <div class="container">
        <div class="row">
          <div class="col-md-12 pl20 pr20">
            <h3>
              {{ $t('Your purchase') }}
            </h3>
            <p v-html="this.$t('The transaction could not be processed. Please try again.')" />
            <p>
              <button-outline color="dark" @click.native="$router.push('/checkout')">
                {{ $t('Go to checkout') }}
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
  }
}
</script> 