<template>
  <ul v-if="pager.pages && pager.pages.length && items.length > pageSize" class="pagination" :style="ulStyles">
    <!-- <li class="page-item first" :class="{'disabled': pager.currentPage === 1}" :style="liStyles" v-if="currentPage !== 1">
      <a class="page-link" @click="setPage(1)" :style="aStyles">{{ labels.first }}</a>
    </li> -->
    <li class="page-item previous" :class="{'disabled': pager.currentPage === 1}" :style="liStyles" v-if="currentPage !== 1">
      <a class="page-link" @click="setPage(pager.currentPage - 1)" :style="aStyles">{{ labels.previous }}</a>
    </li>
    <li class="page-item first" :class="{'disabled': pager.pages.includes(initialPage)}" :style="liStyles" v-if="pager.currentPage !== 1">
      <a class="page-link" @click="setPage(1)" :style="aStyles">{{ labels.first }}</a>
    </li>
    <li class="page-item" :style="liStyles" v-if="!pager.pages.includes(initialPage)">
      <a class="page-link" :style="aStyles">...</a>
    </li>
    <li v-for="(page) in pager.pages" :key="page" class="page-item page-number"
        :class="{'active': pager.currentPage === page}" :style="liStyles">
      <a class="page-link" @click="setPage(page)" :style="aStyles">{{ page }}</a>
    </li>
    <li class="page-item" :style="liStyles" v-if="pager.pages[pager.pages.length - 1] < (pager.totalPages - 1)">
      <a class="page-link" :style="aStyles">...</a>
    </li>
    <li class="page-item last" :class="{'disabled': pager.pages.includes(pager.totalPages)}" :style="liStyles">
      <a class="page-link" @click="setPage(pager.totalPages)" :style="aStyles">{{ pager.totalPages }}</a>
    </li>
    <li class="page-item next" :class="{'disabled': pager.currentPage === pager.totalPages}" :style="liStyles">
      <a class="page-link" @click="setPage(pager.currentPage + 1)" :style="aStyles">{{ labels.next }}</a>
    </li>
    <!-- <li class="page-item last" :class="{'disabled': pager.currentPage === pager.totalPages}" :style="liStyles">
      <a class="page-link" @click="setPage(pager.totalPages)" :style="aStyles">{{ labels.last }}{{pager.totalPages}}</a>
    </li> -->
  </ul>
</template>

<script>
import paginate from 'jw-paginate'

const defaultLabels = () => {
  return {
    first: '1',
    last: '>>',
    previous: 'PREV',
    next: 'Next'

  }
};

const defaultStyles = {
  ul: {
    margin: 0,
    padding: 0,
    // display: 'inline-block'
  },
  li: {
    listStyle: 'none',
    display: 'inline',
    textAlign: 'center'
  },
  a: {
    cursor: 'pointer',
    padding: '6px 5px',
    display: 'block',
    float: 'left',
    color: '#808085'
  }
};

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    initialPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    maxPages: {
      type: Number,
      default: 3
    },
    labels: {
      type: Object,
      default: defaultLabels
    },
    styles: {
      type: Object
    },
    disableDefaultStyles: {
      type: Boolean,
      default: false
    },
    productId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      pager: {},
      ulStyles: {},
      liStyles: {},
      aStyles: {},
      currentPage: this.initialPage,
      paginationWork: false
    }
  },
  created () {
    this.paginationWork = false;
    if (!this.$listeners.changePage) {
      throw 'Missing required event listener: "changePage"';
    }

    // set default styles unless disabled
    if (!this.disableDefaultStyles) {
      this.ulStyles = defaultStyles.ul;
      this.liStyles = defaultStyles.li;
      this.aStyles = defaultStyles.a;
    }

    // merge custom styles with default styles
    if (this.styles) {
      this.ulStyles = { ...this.ulStyles, ...this.styles.ul };
      this.liStyles = { ...this.liStyles, ...this.styles.li };
      this.aStyles = { ...this.aStyles, ...this.styles.a };
    }
    // set to initial page
    this.setPage(this.initialPage);
  },
  methods: {
    setPage (page) {
      if( page != 1 || this.paginationWork){
        const productReviews = this.$parent.$refs.productReviews;
        const headerClass = document.getElementsByClassName('header')[0]
        const headerHeight = parseFloat(headerClass.offsetHeight);
        const elementPosition = productReviews.offsetTop;
        const offsetPosition = elementPosition - headerHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        this.paginationWork = true;
      }
      const { items, pageSize, maxPages } = this;

      // get new pager object for specified page
      const pager = paginate(items.length, page, pageSize, maxPages);

      // get new page of items from items array
      const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

      // update pager
      this.pager = pager;

      // emit change page event to parent component
      this.$emit('changePage', pageOfItems);
    }
  },
  watch: {
    items () {
      this.setPage(this.initialPage);
    },
    productId: function(newVal, oldVal) {
      if(newVal !== oldVal){
        this.paginationWork = false;
      }
    }
  }
}
</script>
<style scoped>
.pagination .active a{
  color: #ec008c !important;
}
.pagination .next a{
  text-decoration: underline;
  color: #191b59 !important;
}
.pagination .active a:after {
  content: none;
  /* position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: rgb(25, 27, 89); */
}
.pagination li a:hover:after {
  content: none;
  /* position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: rgb(25, 27, 89); */
}
.disabled{
  display: none !important;
}
</style>
