<template>
  <div class="wastage-detail">
    <div class="wastage-detail-box">
      <label class="wastage override-wastage">
        <input
          type="checkbox"
          name="wastage"
          value="wastage"
          id="wastage wastage-btn"
          class="wastage-btn-check"
          @click="$emit('click')"
        />
        <div class="slider round">
          <span id="slideOff" class="off"
            >Avoid Reordering by adding wastage?</span
          >
          <span id="slideOn" class="on"
            >{{ product.wastage }}% Wastage Added</span
          >
        </div>
        <span class="wastage-amount">Add {{ product.wastage }}%</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "WastagePercentage",
  components: {},
  data() {
    return {};
  },
  props: {
    product: {
      required: true,
      type: Object,
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.wastage-detail {
  padding: 25px 40px 55px 30px;
  border-bottom: 1px solid #cccccc;
  transition: 5s ease-in;
  .wastage {
    position: absolute;
    display: inline-block;
    width: 70px;
    height: 30px;
    float: none !important;
    right: 25%;
  }

  input {
    display: none;
  }

  .slider.round {
    border-radius: 34px;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #a1170c;
    -webkit-transition: 0.4s;
    -o-transition: 0.4s;
    transition: 0.4s;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 3.7px;
    background-color: transparent;
    -webkit-transition: 0.4s;
    -o-transition: 0.4s;
    transition: 0.4s;
    border: 3px solid #ffffff;
  }

  .off {
    font-size: 14px;
    font-weight: 700;
    position: absolute;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    top: 45%;
    left: -93px;
    font-family: Arial, Helvetica, sans-serif;
    color: #a1170c !important;
    min-width: 375px;
    width: 100%;
    text-align: left;
    cursor: default;
  }

  .on {
    display: none;
  }
}

.wastage-detail .on,
.wastage-detail .off {
  font-size: 14px;
  font-weight: 700;
  position: absolute;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  top: 45%;
  left: -150px;
  font-family: Arial, Helvetica, sans-serif;
  min-width: 375px;
  width: 100%;
  text-align: left;
  cursor: default;
}

.wastage-detail-box {
  position: relative;
}

.wastage-detail input:checked + .slider .on {
  display: block;
  color: #60b307;
  font-family: Arial, Helvetica, sans-serif;
}

.wastage-detail input:checked + .slider .off {
  display: none;
  color: #a1170c;
  font-family: Arial, Helvetica, sans-serif;
}

.wastage-detail input:checked + .slider {
  background-color: #60b307;
}

.wastage-detail input:checked + .slider:before {
  -webkit-transform: translateX(40px);
  -ms-transform: translateX(40px);
  transform: translateX(40px);
  border: 3px solid #fff;
}

.wastage-detail .slider.round:before {
  border-radius: 50%;
}

.wastage-detail .wastage-amount {
  margin-left: 90px;
  width: 100%;
  display: block;
  margin-top: 7px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: bold;
}
@media (min-width: 991px) and (max-width: 1200px) {
  .wastage-detail .on,
  .wastage-detail .off {
    left: -82px;
  }
  .wastage-detail .wastage {
    right: 20%;
  }
}
@media (min-width: 1200px) and (max-width: 1350px) {
  .wastage-detail .on,
  .wastage-detail .off {
    left: -140px;
  }
}
@media (max-width: 767px) {
  .wastage-detail {
    padding: 37px 40px 55px 30px;
  }

  label.wastage.override-wastage {
    left: 50%;
    top: 10px;
  }
  .wastage-detail .off {
    transform: translate(5%, -50%);
    top: 0;
    bottom: -32px;
  }
  .wastage-detail .on {
    top: 0;
    bottom: -28px;
    left: 129px;
  }
  .wastage-amount {
    margin-left: -60px !important;
    color: #928f8f;
  }
}
</style>