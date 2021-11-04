<template>
  <div :class="{'filter-label': true}">
    <label
      :class="[{'container1': true, 'typeSelected': isActive}, variant.label === 'Both' ? 'triggerBoth' : '']"
      @click="$emit('change', variant)"
      :aria-label="$t('Select ' + variant.label)"
    >
      {{ variant.label }}
      <span class="checkmark" />
    </label>
    <span v-if="showCount && variant.label !== 0 && variant.id !== 0"
     class="product-counter"
     :class="variant.label === 'Both' ? 'triggerBothCounter' : ''"
    >
      ({{ newCountFn }})
    </span>
  </div>
</template>

<script>
import filterMixin from 'src/modules/vsf-layered-nav/mixins/filterMixin'

export default {
  mixins: [filterMixin],
  data() {
    return {
      newCount: this.variant.count
    }
  },
  props: {
    prodTypeFilterMainVal: {
      type: [Number, String],
      required: false
    }
  },
  computed: {
    newCountFn () {
      if (this.variant.label === "Wall" || this.variant.label === "Floor") {
        return parseInt(this.prodTypeFilterMainVal) + parseInt(this.variant.count);
      } else {
        return parseInt(this.variant.count)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-label {
  position: relative;
  margin-bottom: 8px;

  .typeSelected {
    color: #da2f89;
    font-weight: bold;
  }

  /* Hide the browser's default radio button */
  .container1 input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  .container1 {
    display: inline;
    position: relative;
    padding-left: 35px;
    margin-bottom: 21px;
    cursor: pointer;
    font-size: 14px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Create a custom radio button */
  .checkmark {
    position: absolute;
    top: -2px;
    left: 0;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    border: 1px solid black;
  }

  /* On mouse-over, add a grey background color */
  .container1:hover .checkmark {
    background-color: #ccc;
  }

  /* When the radio button is checked, add a blue background */
  .container1.typeSelected .checkmark {
    background-color: #ffffff;
    border-color: #da2f89;
  }

  /* Create the indicator (the dot/circle - hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the indicator (dot/circle) when checked */
  .container1.typeSelected .checkmark:after {
    display: block;
  }

  /* Style the indicator (dot/circle) */
  .container1.typeSelected .checkmark:after {
    border-radius: 50%;
    font-family: "FontAwesome";
    content: "\F00C";
    color: #da2f89;
    line-height: 21px;
    font-size: 19px;
    font-weight: 100;
  }
}
.triggerBoth {
  display: none !important;
}
.triggerBothCounter {
  display: none !important;
}
</style>
