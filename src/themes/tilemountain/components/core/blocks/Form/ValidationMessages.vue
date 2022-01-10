<template>
  <div v-if="validations">
    <span
      v-for="(validation, index) in validations"
      :key="index"
      v-if="validation.condition"
      class="cl-error h6 mt4 required-Field"
      data-testid="errorMessage"
    >
      {{ validation.text }}
    </span>
  </div>
</template>
<script>
export default {
  props: {
    validations: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style scoped>
.LoginDetails .required-Field{
     padding-bottom: 21px;
     
}
</style>