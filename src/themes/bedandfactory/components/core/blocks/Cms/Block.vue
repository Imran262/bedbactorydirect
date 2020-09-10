<template>
  <div
    :class="['cms-content', { container: sync }]"
    v-if="getCmsData"
    v-html="getCmsData.content"
  />
</template>

<script>
import { isServer } from "@vue-storefront/core/helpers";
export default {
  name: "CmsBlock",
  props: {
    id: {
      type: Number,
      default: null,
      required: false,
    },
    identifier: {
      type: String,
      default: null,
      required: false,
    },
    sync: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  serverPrefetch() {
    return this.fetchCmsBlock();
  },
  created() {
    if (!isServer) {
      this.fetchCmsBlock();
    }
  },
  methods: {
    fetchCmsBlock() {
      let queryKey = "";
      let queryValue = "";
      if (this.id) {
        queryKey = "id";
        queryValue = this.id;
      } else if (this.identifier) {
        queryKey = "identifier";
        queryValue = this.identifier;
      }
      if (queryKey && queryValue) {
        return this.$store.dispatch("cmsBlock/single", {
          key: queryKey,
          value: queryValue,
        });
      }
    },
  },
  computed: {
    getCmsData() {
      if (this.id) {
        return this.$store.getters[`cmsBlock/getCmsBlockById`](this.id);
      } else if (this.identifier) {
        return this.$store.getters[`cmsBlock/getCmsBlockByIdentifier`](
          this.identifier
        );
      }
      return null;
    },
  },
};
</script>
<style lang="scss">
#category,
#cms-page,
.contact-page-main {
  .usp-bar {
    background: #ffffff;
    margin: 0px 0px;
    border-bottom: 1px solid #f1f1f1;
  }
}

.mainProduct {
  .usp-bar {
    background: #ffffff;
    margin: 8px 0px;
    border-bottom: 1px solid #f1f1f1;
  }
}
.block-content {
  .block-content-inner {
    background: #f3f6f7;
    padding: 30px;
    margin-bottom: 15px;
    h2 {
      font-family: arial, helvetica, sans-serif;
    }
    p {
      font-family: arial, helvetica, sans-serif;
      a {
        font-family: arial, helvetica, sans-serif;
        color: #b10000;
      }
      strong {
        display: block;
        padding-bottom: 10px;
      }
    }
  }
}

@media (min-width: 991px) and (max-width: 1200px) {
  .usp-bar .usp-bar-inner .usp-bar-box p {
    font-size: 12px !important;
  }
}
@media (min-width: 767px) and (max-width: 991px) {
  .usp-bar .usp-bar-inner .usp-bar-box p {
    font-size: 9px !important;
  }
}
@media (min-width: 768px) {
  .usp-bar {
    .usp-bar-inner {
      background: #fff;
      padding: 8px 0px;
      .usp-bar-box {
        display: flex;
        align-items: center;
        justify-content: center;
        img,
        p {
          float: left;
        }
        p {
          font-size: 14px;
          color: #4a4d51;
          margin: 3px 0px 0 8px;
          span {
            color: #00bbaa;
            font-weight: 600;
          }
        }
      }
      .usp-bar-box-delivery {
        img {
          display: block;
          margin-top: 1px;
        }
      }
      .usp-bar-box-stars {
        img {
          display: block;
          margin-top: 5px;
        }
      }
    }
  }
}
@media (max-width: 767px) {
  .usp-bar {
    margin: 5px 0px 10px 0px;
    .usp-bar-inner {
      padding: 7px 0px;
      .mobile-view {
        display: none;
      }
      .usp-bar-box {
        display: flex;
        align-items: center;
        justify-content: center;
        img,
        p {
          float: left;
        }
        p {
          font-size: 14px;
          color: #4a4d51;
          margin: 4px 0px 0 8px;
          span {
            color: #00bbaa;
            font-weight: 600;
          }
        }
      }
    }
  }
  #category,
  #cms-page,
  .contact-page-main {
    .usp-bar {
      margin: 0px 0px 0px 0px;
      border-bottom: 1px solid transparent;
    }
  }
  .mainProduct {
    .usp-bar {
      margin: 8px 0px;
      border-bottom: 1px solid transparent;
    }
  }
}
</style>
