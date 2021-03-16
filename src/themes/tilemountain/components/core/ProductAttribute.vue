<template>
  <li class="h5 prod-info-detail">
    <span class="weight-700">{{ label|htmlDecode }} </span>
    <span v-if="label.toLowerCase() === 'weight'" class="detail">
      {{ value ? parseFloat(value).toFixed(2) : value }} KG
    </span>
    <span v-else class="detail" v-html="processedValue" />
  </li>
</template>

<script>
import { ProductAttribute } from '@vue-storefront/core/modules/catalog/components/ProductAttribute.ts'

export default {
  mixins: [ProductAttribute],
  computed: {
    processedValue () {
      switch (this.value) {
        case 0:
          case '0':
        case 'N/A':
          return 'No'
        case 1:
          case '1':
          return 'Yes'
        default:
          return this.value
      }
    }
  }
}
</script>
<style scoped lang="scss">
.prod-info-detail{
.detail{
    float: right;
    font-weight: 500;
  }
}
</style>
