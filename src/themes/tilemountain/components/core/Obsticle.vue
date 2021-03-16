<template>
  <div class="surface" v-if="obstacleKey != null">
    <div class="container p0">
      <div class="row">
        <div class="col-md-3 col-xs-4 p0 labeltag">
          <h2>
            Window / Door <span>{{ obstacleKey + 1 }}</span>
          </h2>
        </div>
        <div class="col-md-9 col-xs-8 overalldimension">
          <div class="first-label">
            <label
              for="tileHeight"
              class="height col-xs-4"
              v-if="obstacleKey < 1"
              >Height(m)</label
            >
            <input
              class="tileHeight"
              type="number"
              v-model="height"
              ref="heightref"
              min="0"
              @focus="heightClick"
              @blur="heightClickOld"
              @keyup="updateSurfaceArea"
              @change="updateSurfaceArea"
            />
          </div>

          <span class="mutiply col-xs-1">x</span>
          <div class="second-label col-xs-4">
            <label for="tileWidth" class="width" v-if="obstacleKey < 1"
              >Width(m)</label
            >
            <input
              class="tileWidth"
              type="number"
              v-model="width"
              ref="widthref"
              min="0"
              @focus="widthClick"
              @blur="widthClickOld"
              @keyup="updateSurfaceArea"
              @change="updateSurfaceArea"
            />
          </div>
          <label
            for="tileHeight"
            class="height rightheight"
            v-if="obstacleKey < 1"
            >Area(m<sup>2</sup>)</label
          >
          <span class="area">
            <span id="equal">=</span>
            <span class="m2class">{{ area.toFixed(2) }}</span>
          </span>
          <button
            type="button"
            class="close btnRemove col-md-1"
            v-if="obstacleKey != 0"
            @click="removeSurface()"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
    <div class="clearfix"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: 0,
      height: 0,
      widthOldValue: 0,
      heightOldValue: 0,
      area: 0,
    };
  },
  props: {
    obstacleKey: {
      type: Number,
    },
  },
  beforeDestroy () {
    this.width=0;
    this.height=0;
    this.updateSurfaceArea()
  },
  methods: {
    widthClickOld() {
      if (this.$refs.widthref.value == "") {
        this.$refs.widthref.value = this.widthOldValue;
      }
      if (this.width == "") {
        this.width = this.widthOldValue;
      }
    },
    widthClick() {
      this.widthOldValue = this.$refs.widthref.value;
      this.width = "";
      this.$refs.widthref.value = "";
    },
    heightClickOld() {
      if (this.$refs.heightref.value == "") {
        this.$refs.heightref.value = this.heightOldValue;
      }
      if (this.height == "") {
        this.height = this.heightOldValue;
      }
    },

    heightClick() {
      this.heightOldValue = this.$refs.heightref.value;
      this.height = "";
      this.$refs.heightref.value = "";
    },
    updateSurfaceArea() {
      this.area = this.width * this.height;
      this.area.toFixed(2);
      this.$emit("addAreaToObstacle", {
        area: this.area,
        obstacle: this.obstacleKey,
      });
    },
    removeSurface() {
      this.$emit("removeAreaFromObsticle", this.obstacleKey);
    },
  },
};
</script>

<style scoped>
.overalldimension {
  position: relative;
}
span.mutiply {
  float: left;
  padding-top: 32px;
  padding-left: 20px;
  padding-right: 10px;
  font-size: 17px;
  color: #48403d;
}
.btnRemove {
  width: 20px;
  height: 20px;
  background: #b9b9b9;
  padding: 0px;
  font-size: 12px;
  color: #fff;
  font-weight: bold;
  margin-left: 6px;
  border: none;
  border-radius: 10px;
  float: right;
  margin-top: -20px;
  margin-right: 38px;
}
.area {
  float: left;
  margin: 34px 0px 0px 8px;
  font-weight: bold;
  font-size: 11px;
  padding-left: 14px;
  width: 41%;
  display: flex;
}
.tileWidth {
  height: 31px;
  border: 2px solid #e1e1e1;
  background: white;
  width: 58px;
  text-align: center;
  display: block;
  margin-top: 26px;
  line-height: 0px !important;
  border-radius: 5px;
}
.tileHeight {
  height: 31px;
  border: 2px solid #e1e1e1;
  background: white;
  width: 58px;
  text-align: center;
  display: block;
  margin-top: 26px;
  line-height: 0px !important;
  border-radius: 5px;
}
.Totalarea {
  height: 31px;
  border: 2px solid #e1e1e1;
  background: white;
  width: 90px;
  text-align: center;
  display: block;
  margin-top: 6px;
  line-height: 0px !important;
  border-radius: 5px;
}
.first-label,
.second-label,
.third-label {
  float: left;
  margin: 0 0 0 10px;
  position: relative;
  width: 17%;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.third-label {
  padding-left: 35px;
}
.third-label sup {
  font-size: 8px;
}

.surface h2 {
  margin: 38px 0 0 0;
  padding-left: 37px;
  font-size: 12px;
  color: #48403d;
  font-family: Arial, Helvetica, sans-serif;
}
.surface {
  margin-bottom: 8px;
}

.height,
.width {
  font-size: 12px;
  font-family: Arial;
  color: #48403d;
  position: absolute;
}
.rightheight {
  /* position: absolute;
      right: 19%; */
  padding-left: 68px;
}
#equal {
  float: inherit;
  padding-left: 10px;
  font-size: 18px;
  color: #3e3c3b;
  font-weight: 100;
}
.m2class {
  float: left;
  padding-left: 40px;
  font-size: 16px;
  font-weight: 100;
  color: #2a275c;
  font-family: Arial;
}
@media only screen and (max-width: 372px) and (min-width: 320px) {
  .surface h2 {
    /* margin: 0 0 0 0; */
    padding-left: 5px;
    font-size: 11px;
  }
}
@media (max-width: 767px) {
  .surface h2 {
    padding-left: 26px;
    font-size: 13px;
  }
  .surface h2 span {
    display: none;
  }
  .first-label {
    width: 18% !important;
  }
  .second-label {
    width: 18% !important;
  }
  .third-label {
    width: 24% !important;
    padding-left: 6% !important;
  }
  .tileWidth {
    width: 90% !important;
    height: 41px !important;
    margin-top: 26px !important;
  }
  .tileHeight {
    width: 90% !important;
    height: 41px !important;
    margin-top: 26px !important;
  }
  span.mutiply {
    padding-left: 22px !important;
    padding-right: 12px !important;
    padding-top: 39px;
  }
  .Totalarea {
    width: 100% !important;
    height: 41px !important;
  }
  #equal {
    margin-top: 8px;
  }
  .m2class {
    margin-top: 8px;
  }
  .btnRemove {
    width: 30px !important;
    height: 30px !important;
    border-radius: 36px !important;
    font-size: 29px;
    font-weight: 100;
    width: 20px !important;
    height: 20px !important;
    font-size: 20px;
    font-weight: 100;
    margin: 0;
    margin-top: 7px;
    font-family: Arial;
    line-height: 0;
    display: none;
  }
  .mobile_responsive {
    font-size: 11px !important;
    font-weight: 100 !important;
  }
}
@media (max-width: 525px) {
  .Totalarea {
    width: 80% !important;
    height: 41px !important;
  }
  .second-label {
    margin: 0;
  }
  .btnRemove {
    /* width: 25px !important;
    height: 25px !important; */
    /* margin-left: 29% !important; */
    /* font-size: 22px;
    font-weight: 100;
    margin: 0; */
    margin-top: 4px;
    margin-left: 25px !important;
  }
  span.mutiply {
    padding-left: 12px !important;
    padding-right: 11px !important;
    padding-top: 39px;
  }
  .surface h2 {
    font-size: 8px;
    margin-top: 45px;
  }
}
@media (max-width: 480px) {
  .labeltag {
    max-width: 31.333333%;
  }
  .surface h2 {
    padding-left: 26px;
    margin-top: 35px;
    font-size: 3.2vw;
    font-family: Arial;
  }
  .overalldimension {
    padding-left: 0;
    padding-right: 0;
  }
  .first-label,
  .second-label {
    width: 19% !important;
  }
  .first-label,
  .second-label,
  .third-label {
    margin-left: 0;
    padding-left: 0;
    padding: 0;
  }
  .rightheight {
    padding-left: 56px;
  }
  .tileHeight {
    width: 99% !important;
    height: 29px !important;
  }
  .tileWidth {
    width: 99% !important;
    height: 29px !important;
  }
  .area {
    max-width: 33%;
    padding-right: 0;
    margin-top: 30px;
  }
  .overalldimension span.mutiply {
    padding-left: 14px !important;
    padding-right: 16px !important;
    padding-top: 32px;
  }
  .Totalarea {
    width: 80% !important;
    height: 41px !important;
  }
  .second-label {
    margin: 0;
  }
  .m2class {
    margin-top: 5px;
    float: right;
    padding-left: 0;
    text-align: right;
    width: 100%;
    font-size: 14px;
  }
  #equal {
    margin-top: 3px;
  }
  /* .btnRemove {
    width: 25px !important;
    height: 25px !important;
    font-size: 22px;
    font-weight: 100;
    margin: 0;
    margin-top: 4px;
  } */
  span.mutiply {
    padding-left: 12px !important;
    padding-right: 11px !important;
    padding-top: 39px;
  }
}
@media (max-width: 340px) {
  .labeltag {
    max-width: 28%;
  }
  .overalldimension {
    padding-right: 0;
  }
  .surface h2 {
    margin-top: 40px;
    font-size: 10px;
    padding-left: 18px;
  }
  .height,
  .width {
    font-size: 10px;
  }
  .first-label {
    width: 19% !important;
  }
  .second-label {
    width: 19% !important;
  }
  span.mutiply {
    padding-left: 10px !important;
    padding-right: 9px !important;
    padding-top: 33px;
  }
  .area {
    width: 38%;
    padding-left: 9px;
  }
  .tileWidth {
    height: 30px !important;
    font-size: 10px;
  }
  .tileHeight {
    height: 30px !important;
    font-size: 10px;
  }
  .m2class {
    padding-left: 18px;
    font-size: 10px;
    margin-top: 9px;
  }
  .rightheight {
    padding-left: 45px;
  }
}
</style>
