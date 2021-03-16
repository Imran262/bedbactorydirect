<template>
  <div class="cutsampleModal">
    <div class="modal-content mobile-modal">
      <div class="modal-header">
        <h4 class="modal-title">
          Free Cut Sample Already In Basket
        </h4>
        <button type="button" class="close" @click="closeModal">
          <i class="material-icons">close</i>
        </button>
      </div>
      <div class="modal-body">
        <div class="detail">
          <p>
            You already have a free cut sample of this tile in your basket.
            Here are some similar styles we think you may also like...
          </p>
        </div>
        <SimilarCutSample
          :similar-products="similarProducts"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SimilarCutSample from 'theme/components/SimilarCutSample';
import { mapGetters } from 'vuex';

export default {
  name: 'CutSampleModal',
  props: {
    similarProducts: {
      type: Object,
      required: false,
      default: null
    }
  },
  components: {
    SimilarCutSample
  },
  methods: {
    closeModal () {
      this.$bus.$emit('modal-hide', 'modal-cutsample');
    }
  }
};
</script>
<style lang="scss" scoped>
@font-face {
  font-family: "Oblik-regular";
  src: url("/assets/fonts/Oblik-Regular.otf");
}

.modal {
  background-color: rgba(0, 0, 0, 0.7);
}

.modal-header {
  background: #2a275c;
  color: white;
  font-size: 24px;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
}

h4.modal-title {
  margin: 0;
  padding: 29px 0;
  /* text-align: center; */
  margin-left: 10px;
  font-family: "Oblik";
  font-size: 24px;
  padding-left: 20px;
  text-align: center !important;
}

.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #ffffff;
  margin: 0;
  padding: 0px 0px;
  border-radius: 15px;
}

/* The Close Button */
.close {
  color: #fefefe;
  float: right;
  top: -10px;
  right: -14px;
  position: absolute;
  font-size: 0;
  height: 44px;
  width: 44px;
  border: none;
  font-weight: bold;
  border-radius: 24px;
  background-color: #ec0e8b !important;
}

.close:hover,
.close:focus {
  /* color: white; */
  text-decoration: none;
  cursor: pointer;
}

.modal-body {
  padding: 40px 30px;

  .detail {
    width: 60%;
    margin: auto;
    line-height: 25px;

    p {
      margin: 0px;
      font-size: 18px;
      color: #535353;
      text-align: center;
      font-family: Arial, Helvetica, sans-serif;
    }
  }
}

@media(max-width: 423px) {
  h4.modal-title {
    font-size: 18px;
  }
  .modal-body .detail p {
    font-size: 14px;
  }
}

@media(max-width: 767px) {
  .modal-content {
    width: 95%;
    margin: 0 auto;
    border-radius: 8px;
    overflow-x: hidden;
  }
  .modal-body .detail {
    width: 100%;
  }
  .cutsampleModal .modal-header {
    border-top-right-radius: 8px !important;
    border-top-left-radius: 8px !important;
  }
  .close {
    top: -18px;
    right: 4px;
  }
  .modal-body {
    padding: 40px 10px;
  }
}

@media(min-width: 767px) and (max-width: 991px) {
  .modal-content {
    width: 95%;
    margin: 0 auto;
    border-radius: 8px;
  }
  .close {
    top: -18px;
    right: 4px;
  }
}
</style>
