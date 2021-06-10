<template>
  <div class="addtocart-popup">
    <button-full
      @click.native="
        addToCart(product);
        showPopUp(product);
      "
      :disabled="!isProductDisabled"
      data-testid="addToCart"
    >
      {{ $t("Add to cart") }}
    </button-full>
    <popup-cart
      :productOptions="productOptions"
      class="popup-main-cart"
      :product="product"
      :custom-options="customOptions"
      v-if="cartpopupshow"
      @popInterface="handlePopupAfteBack"
      :productCalculatedPrice="productCalculatedPrice"
    />
  </div>
</template>

<script>
import { formatProductMessages } from '@vue-storefront/core/filters/product-messages'
import { notifications } from '@vue-storefront/core/modules/cart/helpers'
import focusClean from 'theme/components/theme/directives/focusClean'
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import { mapGetters } from 'vuex'
import PopupCart from "src/themes/bedfactory/components/PopupCart";

export default {
  directives: { focusClean },
  components: { ButtonFull , PopupCart },
  props: {
    productCalculatedPrice: {
      required: true,
      type: Object,
    },
    productOptions: {
      required: true,
      type: Array,
    },
    product: {
      required: true,
      type: Object,
    },
    customOptions: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    disableProduct: {
      type: Boolean,
      default: true
    },
    disableProductFlag: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    showPopUp(product) {
      this.cartpopupshow = true;
      // var x = document.getElementsByTagName("BODY")[0];
      // x.style.overflow ="hidden";
      this.$bus.$emit("modal-show", "modal-switcher");
    },
    handlePopupAfteBack(event) {
      console.log("EventEventEvent ", event);
      this.cartpopupshow = event;
      var x = document.getElementsByTagName("BODY")[0];
      x.style.overflow ="scroll";
    },
    onAfterRemovedVariant () {
      this.$forceUpdate()
    },
    async addToCart (product) {
      try {
        const diffLog = await this.$store.dispatch('cart/addItem', { productToAdd: product })
        diffLog.clientNotifications.forEach(notificationData => {
          this.notifyUser(notificationData)
        })
      } catch (message) {
        this.notifyUser(notifications.createNotification({ type: 'error', message }))
      }
    },
    notifyUser (notificationData) {
      this.$store.dispatch('notification/spawnNotification', notificationData, { root: true })
    }
  },
  computed: {
    ...mapGetters({
      isAddingToCart: 'cart/getIsAdding'
    }),
    isProductDisabled() {
      console.log("112233445577 Answer is ",this.disableProduct,this.disableProductFlag,this.customOptions && this.customOptions.length > 0,this.customOptions , this.customOptions.length > 0,this.cOptionCheck , this.ccOptionCheck);
       if (this.disableProductFlag) {
return this.disableProduct;
       }
       else{
         
         //      console.log("112233445577 Answer is ",this.customOptionsCheck,this.customOptionsChecking);
    //  console.log("112233445577 product options ",this.productOptions,"\n\nCustomOptions\n",this.customOptions,"\n\n\n",this.disabled,"\n\n\n",this.customOptionsCheck,"\n\n\n");
    console.log("1122334455 ",formatProductMessages(this.product.errors),this.product.errors,"\n is adding to cart",this.isAddingToCart,"\n\n",this.disabled,"\n\n",(
        this.disabled ||
        this.cFlag ||
        this.isAddingToCart
      ));
      console.log("1122334455 product is ",this.product);
      return (
        this.disabled ||
        this.cFlag ||
        this.isAddingToCart
      );
       }
    },
    cOptionCheck(){
      let cOPtions= this.customOptions;
      console.log("112233-----> ",cOPtions);
      this.isProductDisabledcList = []
      this.cList=[]
      this.cFlag = true;
      for (let opt in this.customOptions){
          console.log("Option is ",opt);
        console.log(this.customOptions[opt].option_id);
        console.log(this.customOptions[opt].option_value , );
        // flag true
            // if i === null
            // flag false
        if (this.customOptions[opt].option_value !== null){
        let  newFlag ={
          option_id: this.customOptions[opt].option_id,
          value : true
          }
        this.cList.push(newFlag)
         // this.cFlag = true
        }
        else{
           let  newFlag ={
             option_id: this.customOptions[opt].option_id,
             value : false
                  }
        this.cList.push(newFlag)
         // this.cFlag = false
        }
        console.log("this.customOptions",this.customOptions);
        
      }
    },
    ccOptionCheck(){
      // this.cList.forEach((option,index)=>{
      //   console.log("ssssssss ",option);
      // })
      this.cFlag=true
      for (let opt in this.cList){
        console.log("2255 ",this.cList[opt]);
        if(this.cList[opt].value !== true){
          this.cFlag =false;
        }

      }


    },
    customOptionsCheck(){
     // console.log("112233445577 custom options is ",typeof this.customOptions ,this.customOptions , this.customOptions.length ,this.customOptions && this.customOptions.length>0);
      // if(this.customOptions && this.customOptions.length>0){this.customOptions.forEach((option,index)=>{
      //   console.log("112233445577 options is ",option);
      // });
      // }
      this.optionsFlag =[];
      if (this.product.custom_options) {
        console.log("112233445577 product has custom options");
        if (this.product.custom_options.length > 0) {
          console.log("112233445577 length of custom options : ",this.product.custom_options.length);
         this.product.custom_options.forEach((option, index) => {
            // this.customOptions[
            //       option.option_id
            //     ].option_value
            console.log("112233445577 in loop First option is ",index,option.option_id, this.customOptions[option.option_id]);
            if(this.customOptions[option.option_id]){
             console.log("112233445577",this.customOptions[option.option_id].option_value ,this.customOptions[option.option_id].option_value, this.customOptions[option.option_id].option_value && this.customOptions[option.option_id].option_value==null);
              if(this.customOptions[option.option_id].option_value && this.customOptions[option.option_id].option_value!==null){
              let newFlag ={
                    option_id: option.option_id,
                    value : true
                  }
                  this.optionsFlag.push(newFlag)
              //  console.log("112233445577 options is ",option.option_id , this.customOptions["13"],this.customOptions[option.option_id],this.customOptions[option.option_id].option_value);
                console.log("112233445577 options is ",this.product.custom_options.length ,index);
                if (this.product.custom_options.length == index+1) {

                  console.log("112233445577 All options complete returning true",this.customOptions);
                  this.cusOptionChecked =true;
                  // return true
                  this.optionsFlag.forEach((cOption,cIndex)=>{
                    console.log("112233445577 NEW option is ",option);
                    if(option.value !== true){
                      console.log("Value is not true",option.value);
                        this.customOptionFlag = false
                      return false
                      }
                    else{
                        console.log("Value is true",option.value);
                        }
                        if (this.optionsFlag.length == cIndex+1) {
                          if (this.customOptionFlag !== true){
                            this.customOptionFlag = false
                          }
                          else{
                            this.customOptionFlag =true
                          }
                        }
      });
                }
                }
                else {
                  console.log("112233445577 check failed 1 ");
                  this.flag =false
                 let newFlag ={
                    option_id: option.option_id,
                    value : false
                  }
                  this.optionsFlag.push(newFlag)
                  this.cusOptionChecked =false;
                  return "Check Failed"
                }
                }
                else {
                  console.log("112233445577 check failed 2");
                   let newFlag ={
                    option_id: option.option_id,
                    value : false
                  }
                  this.optionsFlag.push(newFlag)
                  this.flag =false
                  this.cusOptionChecked =false;
                  return "Check Failed 2"
                }
           });
        } else {
          return {};
        }
      } else {
        return {};
      }
    },
    customOptionsChecking(){
      this.optionsFlag.forEach((option,index)=>{
        console.log("112233445577 NEW option is ",option);
        if(option.value != true){
          console.log("Value is not true",option.value);
        //  this.customOptionFlag = false
          return false
        }
        else{
          console.log("Value is true",option.value);
        }
      });
    }
  },
  beforeMount () {
    console.log('SomethingToTest', this.productOptions, this.customOptions, this.productCalculatedPrice)
    this.$bus.$on('product-after-removevariant', this.onAfterRemovedVariant)
  },
  beforeDestroy () {
    this.$bus.$off('product-after-removevariant')
  }
}
</script>
<style scoped>
.bt-product-addtocartbtn .addtocart-popup button {
  padding: 7.5px 15px;
  border-bottom-left-radius: 6px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  background: #4dba87;
  text-transform: uppercase;
  font-weight: bold;
}
</style>
