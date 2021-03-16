<template>
<div v-if="pager.pages && pager.pages.length" class="paging">
  <p>Page:</p>
  <ul class="pagination" :style="ulStyles">
    <li class="page-item first" :class="{'disabled': pager.currentPage === 1}" :style="liStyles" v-if="pager.currentPage !== 1">
      <a class="page-link" @click="setPage(1)" :style="aStyles">{{ labels.first }}</a>
    </li>
    <li class="page-item previous" :class="{'disabled': pager.currentPage === 1}" :style="liStyles" v-if="pager.currentPage !== 1">
      <a class="page-link" @click="setPage(pager.currentPage - 1)" :style="aStyles">{{ labels.previous }}</a>
    </li>
    <li v-for="page in pager.pages" :key="page" class="page-item page-number"
        :class="{'active': pager.currentPage === page}" :style="liStyles">
      <a class="page-link" @click="setPage(page)" :style="aStyles">{{ page }}</a>
    </li>
    <li class="page-item next" :class="{'disabled': pager.currentPage === pager.totalPages}" :style="liStyles">
      <a class="page-link" @click="setPage(pager.currentPage + 1)" :style="aStyles">{{ labels.next }}</a>
    </li>
    <li class="page-item last" :class="{'disabled': pager.currentPage === pager.totalPages}" :style="liStyles">
      <a class="page-link" @click="setPage(pager.totalPages)" :style="aStyles">{{ labels.last }}</a>
    </li>
  </ul>
  </div>
</template>

<script>
import paginate from 'jw-paginate'

const defaultLabels = () => {
  return {
    first: '<<',
    last: '>>',
    previous: '<',
    next: '>'
  }
};

const defaultStyles = {
  ul: {
    margin: 0,
    padding: 0
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
    color: '#191b59'
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
      required: true
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
    totalItems: {
      type: Number,
      required: true
    },
    sort: {
      type: String,
      required: false,
      default: 'updated_at:desc'
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
      const { items, pageSize, maxPages } = this;

      // get new pager object for specified page
      const pager = paginate(this.totalItems, page, pageSize, maxPages);

      let pageOfItems = [];

      // get new page of items from items array
      if (!['updated_at:desc', ''].includes(this.sort)) {
        pageOfItems = items.reverse().slice(pager.startIndex, pager.endIndex + 1);
      } else {
        pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
      }

      // update pager
      this.pager = pager;

      // emit change page event to parent component
      this.$emit('changePage', {
        pageOfItems,
        'startIndex': pager.startIndex,
        'endIndex': pager.endIndex + 1,
        'selectedPage': pager.currentPage
      });
    }
  },
  watch: {
    pageSize () {
      this.setPage(this.initialPage)
    },
    totalItems: function (newTotal, oldTotal) {
      if (newTotal !== oldTotal) {
        this.setPage(1)
      }
    },
    sort (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setPage(1)
      }
    }
  }
}
</script>
<style scoped lang="scss">

.paging {
  display: inline-flex;
  float: right;

  p {
    padding: 0;
    margin: 7px 4px 0 0;
    font-size: 16px;
    font-weight: bold;
    color: #2a285a;
  }
}
.bottom-pagination .pagination{
  float: right;
}
.bottom-pagination .pagination li:last-child a {
  border-radius: 0 5px 5px 0 !important;
  border-right: 1px solid #3d315b !important;
}
.pagination .previous,
.pagination .next{
  display: none !important;
}
.pagination li.page-item.last.disabled {
  display: none !important;
}
.pagination li a{
  background-color: white;
  padding: 5px 10px !important;
  border: 1px solid #7d7d7d;
  border-right: 0;
  cursor: pointer;
  font-weight: 600;
}
.pagination .active a{
  background-color: #dcd9d9;
  border-radius: 5px 0 0 5px;
  border: 1px solid #dcd9d9;
  padding: 5px 10px ;
}
.pagination a.underline:after, a:not(.no-underline):hover:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: transparent;
}
.pagination ul li:last-child a {
  border-radius: 0 5px 5px 0;
  border-right: 1px solid #3d315b;
}
/* .pagination .active a:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: rgb(25, 27, 89);
}
.pagination li a:hover:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: rgb(25, 27, 89);
} */
@media(min-width: 767px) and (max-width: 1200px){
  /* .main-pagination .pagination{
    display: none;
  } */
}
</style>
