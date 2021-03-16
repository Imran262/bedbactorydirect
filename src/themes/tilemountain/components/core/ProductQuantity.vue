<template>
  <div
    class="product-quantity"
    :class="tileType && tileType === 'Boxes' ? 'boxes-class' : ''"
  >
    <base-input-number
      :forbaseinput="tileType"
      :name="name"
      :value="inputValue"
      :min="1"
      :max="max"
      :disabled="disabled"
      @input="$emit('input', $event)"
      @keyup="
        $emit('keyup', $event);
        cartValueSend();
      "
      @click="setFocusOn"
      @blur="getValueBack"
      only-positive
      :validations="[
        {
          condition: maxQuantity && value && !$v.value.maxValue,
          text: $t('Quantity must be below {quantity}', {
            quantity: maxQuantity,
          }),
        },
      ]"
    />
    <spinner v-if="loading" />
  </div>
</template>

<script>
import { minValue, maxValue, numeric, required } from 'vuelidate/lib/validators'
import { onlineHelper } from '@vue-storefront/core/helpers'
import BaseInputNumber from 'theme/components/core/blocks/Form/BaseInputNumberCustom'
import Spinner from 'theme/components/core/Spinner'

export default {
  data () {
    return {
      inputValue: ''
    }
  },
  components: {
    Spinner,
    BaseInputNumber
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    showQuantity: {
      type: Boolean,
      default: false
    },
    maxQuantity: {
      type: Number,
      default: undefined
    },
    checkMaxQuantity: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    isSimpleOrConfigurable: {
      type: Boolean,
      default: false
    },
    forbaseInput: {
      type: String,
      required: true
    }
  },
  mounted () {
    this.inputValue = ''
  },
  methods: {
    setFocusOn () {
      this.inputValue = ''
    },
    getValueBack () {
      if (this.value !== 1 || this.inputValue !== '') {
        this.inputValue = this.value
      }
    },
    cartValueSend () {
      this.$bus.$emit('sendvalueToCart', this.inputValue)
    }
  },
  computed: {
    tileType () {
      if (this.product && this.product.filter_type && this.product.filter_type === 'Pack') {
        return 'Boxes'
      } else {
        return this.forbaseInput
      }
    },
    isOnline (value) {
      return onlineHelper.isOnline
    },
    max () {
      if (!this.isOnline || !this.isSimpleOrConfigurable) {
        return null
      }

      return this.maxQuantity
    },
    disabled () {
      if (!this.isOnline) {
        return false
      }
      // return (
      //   !this.maxQuantity &&
      //   this.checkMaxQuantity &&
      //   this.isSimpleOrConfigurable
      // );
      return false
      // return !this.maxQuantity && this.checkMaxQuantity && this.isSimpleOrConfigurable
    },
    name () {
      if (this.isSimpleOrConfigurable && !this.loading && this.showQuantity) {
        return this.$i18n.t(this.isOnline ? 'Quantity available' : 'Quantity available offline', { qty: this.maxQuantity })
      }
      return this.$i18n.t('Quantity')
    }
  },
  validations () {
    return {
      value: {
        minValue: minValue(1),
        maxValue: maxValue(this.max) && !this.isSimpleOrConfigurable,
        numeric,
        required
      }
    }
  },
  watch: {
    '$v.$invalid' (error) {
      this.$emit('error', error)
    },
    value (newValue, oldValue) {
      this.inputValue = newValue
    },
    $route: function (to, from) {
      this.inputValue = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.product-quantity {
  position: relative;
  /deep/ .spinner {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }
}
</style>
<style>
.boxes-class label {
  font-size: 12px !important;
}
@media (max-width: 767px) {
  .boxes-class label {
    margin-right: 0 !important;
  }
}
</style>
