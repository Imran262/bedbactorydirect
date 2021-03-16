<template>
  <div class="categories">
    <div
      class="categories__handler"
    >
      <!-- <h4 class="categories__heading">
        {{ $t('Filter by categories') }}
      </h4> -->

      <template v-for="(category,index) in categories">

        <button
         v-if="index<=4"
          :key="category.category_id"
          class="categories__button no-outline bg-cl-transparent py10 px20"
          :class="{ 'categories__button--active': value.includes(category.category_id) }"
          type="button"
          @click="toggleCategory(category)"
        >
          {{ category.name }}
        </button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      required: false
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  },
  methods: {
    toggleCategory (category) {
      const isSelected = this.value.includes(category.category_id)
      if (isSelected) {
        this.$emit('input', this.value.filter(categoryId => categoryId !== category.category_id))
      } else {
        this.$emit('input', [...this.value, category.category_id])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
$break-large: 1030px;

.categories {
  &__heading {
    width: 100%;
  }

  &__handler {
    display: flex;
    flex-wrap: wrap;
  }

  &__button {
    display: flex;
    align-items: center;
    margin-right: 15px;
    margin-bottom: 15px;
    border: 2px solid #333;
    transition: all 0.2s ease;
    background-color: #29275B;
    color: #fff;
    font-family: "oblik";
    border-radius: 6px;
    @media screen and (min-width: 320px) and (max-width: 425px){
      font-size: 9px;
      
    }

    &--active {
      background: #333;
      color: #fff;
    }

    &--active {
      text-decoration: underline;
    }
    @media screen and (min-width: $break-large) {
      &:hover{
        background: #333;
        color: #fff;
      }
    }
  }

  &__button-text {
    display: block;
    margin-right: 15px;
  }

}
</style>
