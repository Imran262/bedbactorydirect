<template>
  <emodal name="modal-narrowroad" class="NarrowRoadModal" :width="620">
    <p>Properties with restricted access require an extra working day to deliver</p>
    <p class="popup_text_1 popup_text_2">Your order will be delivered on <span id="next_date">{{dateProp}}</span></p>
    <button class="accept_buttons" @click="Accept_Delivery_Date">
        Accept Delivery Date
    </button>
    <button class="accept_buttons yellow_accept_buttons" @click="Accept_Delivery_Date">
        Choose a New Delivery Date
    </button>
  </emodal>
</template>

<script>
import Emodal from 'theme/components/core/Emodal'

export default {
  name: 'NarrowRoad',
  computed: {
  },
  props: {
    dateProp: {
      type: String,
      required: true
    }
  },
  methods: {
    Accept_Delivery_Date () {
      this.$bus.$emit('modal-hide', 'modal-narrowroad')
      if (document.getElementById('shippingSubmitBtnId')) {
        document.getElementById('shippingSubmitBtnId').click();
      }
    }
  },
  components: {
    Emodal
  }
}
</script>

<style scoped>
    .modal {
        font-size: 18px;
    }
    .modal.NarrowRoadModal p {
        font-size: 14px;
        font-weight: bold;
        margin: 15px auto;
        text-align: center;
    }
    button.accept_buttons {
        border: 1px solid;
        margin-left: 6%;
        width: 36%;
        color: white;
        padding: 10px;
        background: #939598;
    }
    button.yellow_accept_buttons{
        background: #f4bc34;
    }
</style>
<style>
    .modal.NarrowRoadModal .modal-container {
        padding: 15px 30px;
    }
</style>