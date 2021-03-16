<template>
  <div class="row">
    <div class="col-md-12 filter-head">
      <h4 class="filter-heading filter-heading-font" :id="filterName" @click="filterClickOnMobile(filterName)">
        {{ filterName }}
      </h4>
    </div>
    <div class="col-md-12 inner-box">

      <div class="filter-div row">
        <label
          :class="`filterItem ` + cols"
          v-for="({code, title}, indexSingle) in filter"
          :key="indexSingle"
        >
          <template>
            {{ title || code }}
            <input
              class="check-box"
              type="checkbox"
              :code="filterName"
              :value="code"
              :codeSingle="code"
              @change="$emit('change', $event)"
            />
            <!-- <span class="checkmark1"></span> -->
          </template>
        </label>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterBox',
  props: {
    filterName: {
      type: String,
      required: true
    },
    filter: {
      type: Array,
      required: true
    },
    cols:{
      type: String,
      required: false,
      default: 'col-md-12 '
    }
  },
  methods: {
    filterClickOnMobile(id){
      event.srcElement.parentElement.nextElementSibling.classList.toggle('toggleCLassAdded');
      document.getElementById(id).classList.toggle("toggleIconFilterHeading");

    }
  }
}


</script>
<style lang="scss" scoped>

  .filter-div{

  }
  .filterItem{
    display: list-item;
    list-style: none;
    margin-top: 8px;
    margin-bottom: 8px;
    font-family: Arial;
    color: #6b6b6c;
    padding-left: 15px;

  }
  .check-box{
    height: 16px;
    width: 16px;
    float: left;
    color: #29275b;
    border-radius: none !important;
  }
   .active-filter{
    color: #29275b;
    background-color: #29275b;
   }
  // .checkmark1{
  //   background-color: #29275b;
  //   border-radius: none;
  //   color: #29275b;
  // }

  input:checked {
    background: #29275b;
    border-color: #29275b;
}

  .filter-heading-font{
    font-size: 20px;
    margin: 0;
    padding: 6px 6px;
    color:#29275b;
    font-family: 'Oblik';
    border-bottom: 1px solid #ccc;
  }

  .toggleIconFilterHeading{
    background: url("/assets/minus.png") no-repeat 96% 45% !important;
    color: #2a285a !important;
    border-bottom: 1px solid #ccc !important;
  }

  @media (max-width: 767px){
  .filter-heading-font {
   border-bottom: none;
   background: url("/assets/add.png") no-repeat 96% 45%;
   font-size: 12px;
   padding: 16px;
   color: #434343;
 }
 .col-md-12.toggleCLassAdded {
    display: block !important;
  }

  .filterBox .inner-box {
    display: none;
  }

  .filterBox .col-md-12.filter-head {
    display: block;
  }
   .check-box{
    height: 12px;
    width: 12px;
  }
    .filterItem{
    font-size: 12px;
  }
}
</style>
