<template>
  <div class="check-v12">
    <i
      data-v-0b1c0f15=""
      class="material-icons close fab-cross cl-white cl-merge"
      @click="$emit('closeV12Calculator')"
      >close</i
    >
    <div><img :src="calculatorData.widget_options.header_img" />
    <p>
      From £{{minimumInstallment}} per month, subject to details, conditions apply
    </p>
    <p>
      {{calculatorData.top_text}}
      </p>
    </div>

    


    <div>
      {{calculatorData.widget_options.footer_text}}
    </div>
  </div>
</template>
<script>
export default {
  name : 'calculatorV12',
  props: {
    calculatorData: {
      type: Object,
      default: true
    },
    minimumInstallment:{
      type: [Number,String],
      required : true
    }
  },
}
</script>>
<style lang="scss" scoped>
.check-v12[data-v-fe00d904] {
  width: 511px;
  height: 670px;
  background: grey;
  position: fixed;
  max-width: 95%;
  margin: 5% auto;
  left: 0;
  right: 0;
  top: 0;
  max-height: 80vh;
  z-index: 2147483647;
  transition: all 0.5s ease-in-out;
}
.cl-merge {
  color: #00315e !important;
  cursor: pointer;
}
</style>