<template>
  <div
    v-if="!isCheckoutPage || isThankYouPage"
    class="new-menu-bar new-menu-bar-main hidden-sm hidden-xs"
  >
    <!-- <CmsBlock :identifier="'megamenu'" /> -->
    <MegaMenu  :identifier="'megamenunew'" />
  </div>
</template>
<script>
// import CmsBlock from 'theme/components/core/blocks/Cms/Block';
import MegaMenu from "../Home/MegaMenu";
import { mapState } from "vuex";
import CurrentPage from "theme/mixins/currentPage";
export default {
  data() {
    return {
    
    };
  },
  components: {
    // CmsBlock
    MegaMenu
  },
  mixins: [CurrentPage],
  computed: {
    isThankYouPage() {
      return this.$store.state.checkout.isThankYouPage
        ? this.$store.state.checkout.isThankYouPage
        : false;
    }
  }
};
</script>
<style lang="scss">
.new-menu-bar {
  background-color: #54575b;
  ul.menu {
    padding: 0;
    margin: 0;
    position: relative;
    li {
      -ms-flex: 1 1 auto;
      flex: 1 1 auto;
      list-style-type: none;
      &:last-child a {
        border: none;
      }
      a {
        text-align: center;
        padding: 5px 0px;
        display: block;
        color: #fff;
        line-height: 1;
        text-transform: uppercase;
        margin: 10px 0 10px 0;
        border-right: 1px solid #fff;
        &::after {
          content: none;
        }
      }
      .nav-panel-dropdown {
        width: 100%;
        // border: 7px solid rgb(91, 210, 236) !important;
        position: absolute;
        background-color: #fff;
        display: none;
        left: 0;
        top: 46px;
        .nav-panel-inner {
          .nav-block {
            margin: 10px 0 11px 10px;
            display: flex;
            .sb-height-dropdown-menu {
              border-right: 1px solid #eeeeee;
              height: 259px;
              padding-left: 15px;
              padding-right: 15px;
              .subcag-title {
                font-weight: bold;
                font-size: 14px;
                font-family: "Poppins", sans-serif;
                text-transform: capitalize;
              }
              &:last-child {
                border: none !important;
              }
              ul.bullet {
                margin: 0.5em 0 1em 0;
                padding: 0;
                li {
                  border: none;
                  margin: 0;
                  text-align: left;

                  a {
                    font-size: 12px;
                    font-family: "Poppins", sans-serif;
                    color: #54575b;
                    padding: 0;
                    display: block;
                    text-align: left;
                    line-height: 1.5;
                    margin: 0;
                    border: none;
                    text-transform: capitalize;
                    &:hover {
                      color: #5bd2ec;
                    }
                  }
                }
              }
            }
          }
          .sb-price-match {
     
            display: flex;
            justify-content: flex-end;
            width: 84.2%;
            .menu-dropdown-logo-img {
              height: 59px;
              width: 121px;
              background-size: 100%;
            }
          }
        }
        .dropdown-menu-right-img {
          position: absolute;
          right: 0;
          top: 0;
          z-index: 10;
          a {
            padding: 0;
            margin: 0;
            border: none;
            .sub-right-img {
              width: 200px;
              height: 280px;
            }
          }
        }
      }
      &:hover .nav-panel-dropdown {
        display: block;
        border: 1px solid #D3D3D3;
      }
    }
  }
}
.new-menu-bar ul.menu li:hover .mystyle {
  display: none !important;
}
.new-menu-bar ul.menu li.sb-menu:last-child {
  background: #c64241;
}
.new-menu-bar ul.menu li.sb-menu:nth-child(11n) a {
  border: none;
}
.new-menu-bar ul .first:nth-child(10n+9) {
  background-color: #ffd055;
}
.new-menu-bar ul .first:nth-child(10n+9) a {
  /* color: #54575b; */
  border: none;
}
.new-menu-bar ul .first:nth-child(10n+8) a {
  border: none;
}
@media (min-width: 768px) and (max-width: 992px) {
  .new-menu-bar {
    display: none !important;
    ul.menu {
      li {
        .nav-panel-dropdown {
          top: 35px;
          .nav-panel-inner {
            .nav-block {
              .sb-height-dropdown-menu {
                padding-left: 10px;
                padding-right: 10px;
                .subcag-title {
                  font-size: 10px;
                }
                ul.bullet {
                  li {
                    a {
                      height: 100%;
                      font-size: 10px;
                    }
                  }
                }
              }
            }
            .sb-price-match {
              width: 100%;
            }
          }
          .dropdown-menu-right-img {
            display: none;
          }
        }
        a {
          font-size: 12px;
          padding: 5px 5px;
          line-height: 0.5;
          height: 5px;
        }
      }
    }
  }
  .sb-mobile-menu {
    display: block !important;
    padding: 7px 10px 7px 10px;
    background-color: #f2f2f2 !important;
    margin-bottom: 10px;
    margin-left: 10px;
    margin-top: 5px;
  }
}
@media (min-width: 993px) and (max-width: 1024px) {
  .new-menu-bar {
    display: block !important;
    ul.menu {
      li {
        .nav-panel-dropdown {
          top: 42px;
          .nav-panel-inner {
            .nav-block {
              .sb-height-dropdown-menu {
                padding-left: 10px;
                padding-right: 10px;
                .subcag-title {
                  font-size: 12px;
                }
                ul.bullet {
                  li {
                    a {
                      height: 100%;
                      font-size: 11px;
                    }
                  }
                }
              }
            }
            .sb-price-match {
              width: 100%;
            }
          }
          .dropdown-menu-right-img {
            display: none;
          }
        }
        a {
          font-size: 12px;
          padding: 6px 0px;
        }
      }
    }
  }
  .sb-mobile-menu {
    display: none !important;
  }
}
@media (min-width: 1025px) and (max-width: 1200px) {
  .new-menu-bar {
    ul.menu {
      li {
        .nav-panel-dropdown {
          top: 40px;
          .nav-panel-inner {
            .nav-block {
              .sb-height-dropdown-menu {
                .subcag-title {
                  width: 95%;
                  display: block;
                }
                ul.bullet {
                  li {
                    a {
                      height: 100%;
                      font-size: 10.05px;
                    }
                  }
                }
              }
            }
            .sb-price-match {
            }
          }
          .dropdown-menu-right-img {
          }
        }
        a {
          padding: 5px 5px;
          line-height: 1;
          font-size: 12px;
          height: 10px;
        }
      }
    }
  }
}
</style>
