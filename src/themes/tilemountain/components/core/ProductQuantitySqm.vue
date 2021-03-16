<template>
  <div class="product-quantity">
    <base-input-number
      :forbaseinput="forbaseinput"
      :name="name"
      :value="inputValue"
      :min="minSqmQuantity || 0"
      :max="maxQuantity"
      :disabled="disabled"
      @input="$emit('input', $event)"
      @keyup="$emit('keyup', $event)"
      @click="setFocusOn"
      @blur="getValueBack"
      only-positive
      :validations="[
        //{
        //  condition: !$v.value.numeric || !$v.value.minValue || !$v.value.required,
        //  text: $t(`Quantity must be positive integer`)
        //},
        {
          condition: maxQuantity && value && !$v.value.maxValue,
          text: $t('Quantity must be below {quantity}', { quantity: maxQuantity })
        }
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
      inputValue: 0
    };
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
    minSqmQuantity: {
      type: Number,
      default: undefined,
      required: true
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
    sqmValue: {
      type: [Number, String],
      default: 0
    },
    forbaseinput: {
      type: String,
      required: true
    }
  },
  methods: {
    setFocusOn () {
      this.inputValue = '';
    },
    getValueBack () {
      this.inputValue = this.value;
    }
  },
  computed: {
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
        minValue: this.minSqmQuantity
          ? minValue(this.minSqmQuantity)
          : minValue(0),
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
      this.inputValue = newValue;
    },
    $route: function (to, from) {
      this.inputValue = '';
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
