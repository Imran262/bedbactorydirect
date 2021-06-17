<template>
  <div
    v-if="(!isCheckoutPage && $route.name !== 'confirmorder') || isThankYouPage"
    class="new-menu-bar new-menu-bar-main hidden-sm hidden-xs"
  >
    <MegaMenu :identifier="'megamenunew'" />
  </div>
</template>
<script>
// import CmsBlock from 'theme/components/core/blocks/Cms/Block';
import MegaMenu from "src/themes/bedfactory/components/core/blocks/Home/MegaMenu";
import { mapState } from "vuex";
import CurrentPage from "theme/mixins/currentPage";

export default {
  components: {
    // CmsBlock
    MegaMenu,
  },
  mixins: [CurrentPage],
  mounted() {},
  computed: {
    isThankYouPage() {
      return this.$store.state.checkout.isThankYouPage
        ? this.$store.state.checkout.isThankYouPage
        : false;
    },
  },
};
</script>
<style lang="scss">
@font-face {
  font-family: "Oblik";
  src: url("/assets/fonts/Oblik_Bold.otf");
  font-display: block;
}

.new-menu-bar {
  background-color: #071a44;
  margin-top: 2px;
  ul.menu {
    padding: 0;
    margin: 0;
    position: relative;
    z-index: 8;

    li {
      -ms-flex: 1 1 auto;
      flex: 1 1 auto;
      list-style-type: none;

      &:last-child a {
        border: none;
      }

      &.sb-menu {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      a {
        text-align: center;
        padding: 26px 0px;
        display: block;
        color: #fff;
        line-height: 1;
        text-transform: capitalize;
        font-size: 14.96px;
        font-family: "Oblik";
        z-index: 999;
        width: 100%;

        &::after {
          content: none;
        }
      }

      .nav-panel-dropdown {
        width: 100%;
        position: absolute;
        background-color: #fff;
        display: none;
        left: 0;
        top: 66px;
        border: 5px solid #ee4c56;

        .nav-panel-inner {
          .nav-block {
            display: flex;

            .sb-height-dropdown-menu {
              border-right: 3px solid #c1c1c1;
              padding-left: 19px;
              padding-right: 19px;
              padding-top: 28px;
              height: 100%;
              min-height: 256px;
              @media (min-width: 1025px) and (max-width: 1199px) {
                padding-top: 15px;
              }
              @media (min-width: 768px) and (max-width: 991px) {
                min-height: 277px;
              }
              .subcag-title {
                font-size: 17px;
                font-family: "Oblik";
                text-transform: capitalize;
                color: #071a44;
              }

              &:last-child {
                border: none !important;
              }

              ul.bullet {
                margin: 10px 0px 0px 0;
                padding: 0;

                li {
                  border: none;
                  margin: 0;
                  text-align: left;

                  a {
                    font-size: 13px;
                    font-family: Arial;
                    color: #333333;
                    padding: 0;
                    display: block;
                    text-align: left;
                    line-height: 1.7;
                    margin: 0;
                    border: none;
                    text-transform: capitalize;
                    @media (min-width: 1025px) and (max-width: 1199px) {
                      line-height: 1.5;
                      font-size: 12px;
                    }
                    &:hover {
                      color: #5bd2ec;
                    }
                  }
                }
              }
            }
          }
          .sb-price-match {
            background-color: #ee4c56;
            display: flex;
            justify-content: flex-end;
            width: 82.2%;

            .menu-dropdown-logo-img {
              background: url("/assets/menu-logo.png") no-repeat 100% 100%;
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
          border-left: 0px solid #0fa897;

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

      .box {
        width: 115px;
        height: 66px;
        background-color: #ee4c56;
        position: absolute;
        display: none;
        top: 0px;

        .arrow-down {
          width: 0;
          height: 0;
          border-left: 58px solid transparent;
          border-right: 58px solid transparent;
          border-top: 20px solid #ee4c56;
          position: absolute;
          bottom: -24px;
          left: 0;
          display: none;
        }
      }

      &:hover .nav-panel-dropdown {
        display: block;
      }

      &:hover .box {
        display: block;
      }
    }
  }
}

.nav-panel-dropdown + .box .arrow-down {
  display: block !important;
}

.new-menu-bar ul.menu li:hover .mystyle {
  display: none !important;
}

.new-menu-bar ul.menu li.sb-menu:nth-child(12n + 11) {
  background-color: #00adee;
}
.new-menu-bar ul.menu li.sb-menu:nth-child(12n + 11) .box {
  background-color: #00adee;
  width: 66px;
}
.new-menu-bar ul.menu li.sb-menu:nth-child(11n) a {
  border: none;
}
@media (min-width: 768px) and (max-width: 992px) {
  .new-menu-bar {
    ul.menu {
      li {
        &.nav-1 {
          background: #071a44;
          z-index: 999;
          display: block;
        }

        .nav-panel-dropdown {
          top: 50px !important;
          left: 0;
        }
        a {
          font-size: 11.96px !important;
          padding: 20px 0px;
        }
        .box {
          height: 52px;
          width: 95px !important;
          .arrow-down {
            display: none !important;
            border-left: 30px solid transparent !important;
            border-right: 30px solid transparent !important;
          }
        }
      }
    }
  }
  .sb-mobile-menu {
    display: none !important;
    padding: 7px 10px 7px 10px;
    background-color: #f2f2f2 !important;
    margin-bottom: 10px;
    margin-left: 10px;
    margin-top: 5px;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .new-menu-bar {
    display: block !important;

    ul.menu {
      li {
        .nav-panel-dropdown {
          top: 64px;
          .nav-panel-inner {
            .nav-block {
              .sb-height-dropdown-menu {
                .subcag-title {
                  font-size: 12px;
                }
                ul.bullet {
                  li {
                    a {
                      height: 100%;
                      font-size: 12px;
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
          font-size: 12.96px;
        }

        .box {
          width: 88px;

          .arrow-down {
            bottom: -23px;
            border-left: 43px solid transparent;
            border-right: 43px solid transparent;
          }
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
          top: 64px;
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
                    }
                  }
                }
              }
            }
            .sb-price-match {
              width: 76.2%;
            }
          }

          .dropdown-menu-right-img {
          }
        }

        a {
          line-height: 1;
          font-size: 12.96px;
        }

        .box {
          width: 88px;

          .arrow-down {
            border-left: 43px solid transparent;
            border-right: 43px solid transparent;
            bottom: -23px;
          }
        }
      }
    }
  }
}

@media (min-width: 1201px) and (max-width: 1260px) {
  .new-menu-bar {
    ul.menu {
      li {
        .box {
          width: 109px;

          .arrow-down {
            border-left: 53px solid transparent;
            border-right: 53px solid transparent;
          }
        }
      }
    }
  }
}
@media (min-width: 1025px) and (max-width: 1199px) {
  .menu-frame {
    flex-basis: 0%;
    max-width: 47%;
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .menu-frame {
    max-width: 55%;
  }
}
</style>
