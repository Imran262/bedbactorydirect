<template>
  <transition appear>
    <div class="cookie bg-cl-th-accent cl-tertiary" v-if="isOpen" ref="cookie">
      <div class="cookie-inner" ref="cookieinner">
        <div class="general-preference-box">
          <div class="left">
          <span class="cookie-small-text">
            {{ message }}
          </span>
            <span class="cookie-preferences" @click="openPreferences">
            Manage your cookies here
          </span>
          </div>
          <div class="right">
            <button type="button" class="close-btn" @click="accept" @keyup.enter="accept">
              OK
            </button>
          </div>
        </div>
      </div>
      <div class="modal-backdrop" ref="overlaybackdrop" @click="openPreferences" />
      <div class="cookie-settings-wrapper bg-cl-th-accent" ref="cookieSettingsWrapper">
        <div class="container w-o-c-w">
          <div class="settings-inner">
            <div class="setting-box">
              <div class="type">
                <span class="cookie-small-text">Type</span>
              </div>
              <div class="detail">
                <span class="cookie-small-text">What does it do?</span>
              </div>
              <div class="actions">
                <span class="cookie-small-text">On / Off</span>
              </div>
            </div>
            <div class="setting-box">
              <div class="type">
                <span class="cookie-small-text"><b>Necessary</b></span>
              </div>
              <div class="detail">
                <span class="cookie-small-text">These cookies are necessary for the normal running and security of our website.</span>
              </div>
              <div class="actions">
                <span class="cookie-small-text">ALWAYS ON</span>
              </div>
            </div>
            <div class="setting-box">
              <div class="type">
                <span class="cookie-small-text"><b>Performance</b></span>
              </div>
              <div class="detail">
                <span class="cookie-small-text">These analytical cookies allow us to monitor how visitors use our website, so that we can improve our user experience. They can also help our website to load faster on your device.</span>
              </div>
              <div class="actions">
                <span class="cookie-small-text">ALWAYS ON</span>
              </div>
            </div>
            <div class="setting-box">
              <div class="type">
                <span class="cookie-small-text"><b>Personalised</b></span>
              </div>
              <div class="detail">
                <span class="cookie-small-text">These cookies allow us to personalise content and ads to help deliver the perfect products for your project.</span>
              </div>
              <div class="actions">
                <div class="button-cover">
                  <div class="button b2" id="button-13">
                    <input type="checkbox" class="checkbox" checked>
                    <div class="knobs">
                      <span></span>
                    </div>
                    <div class="layer"></div>
                  </div>
                </div>
              </div>
            </div>
            <button type="button" class="close-btn" @click="accept" @keyup.enter="accept">
              OK
            </button>
          </div>
        </div>
        <span class="cross" ref="crossbutton" @click="openPreferences">X</span>
      </div>
    </div>
  </transition>
</template>

<script>
import i18n from '@vue-storefront/i18n'

export default {
  props: {
    detailsLinkText: {
      type: String,
      default: i18n.t('See details')
    },
    detailsLink: {
      type: String,
      default: '/privacy'
    },
    message: {
      type: String,
      // default: i18n.t('By continuing to use our website, you agree to the use of cookie for analytical and performance purposes, as well as to allow information sharing on social media networks.')
      default: i18n.t('By using our site, you agree to our use of cookies, which help deliver the best experience.')
    }
  },
  data () {
    return {
      isOpen: false,
      isUpdated: false
    }
  },
  methods: {
    accept () {
      this.setVisited()
      this.isOpen = false
    },
    setVisited () {
      this.$store.dispatch('claims/set', { claimCode: 'cookiesAccepted', value: true })
    },
    openPreferences (e) {
      e.target.classList.toggle('active')
      this.$refs.cookieSettingsWrapper.classList.toggle('show')
      this.$refs.cookieinner.classList.toggle('hide')
      this.$refs.cookie.classList.toggle('cookie_two')
      this.$refs.overlaybackdrop.classList.toggle('backdrop-none')
      if (!this.$device.isMobile) {
        setTimeout(() => {
          this.$refs.crossbutton.classList.toggle('showcross')
        }, 2000);
      } else {
        this.$refs.crossbutton.classList.toggle('showcross')
      }
    }
  },
  updated () {
    if (this.isUpdated === false) {
      this.isUpdated = true;
    }
  },
  mounted () {
    this.$store.dispatch('claims/check', { claimCode: 'cookiesAccepted' }).then((cookieClaim) => {
      if (!cookieClaim) {
        this.isOpen = true
        this.$store.dispatch('claims/set', { claimCode: 'cookiesAccepted', value: false })
      } else {
        this.isOpen = !cookieClaim.value
      }
    });
  }
}
</script>

<style lang="scss" scoped>
  @import '~theme/css/base/global_vars';
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';

  $color-icon: color(black);
  $bg-icon: color(suva-gray);
  $z-index: map-get($z-index, overlay) - 1;

  .bg-cl-th-accent {
    background: #727272;
  }

  .backdrop-none {
    display: block !important;
  }

  .showcross {
    display: flex !important;
  }

  .modal-backdrop {
    position: fixed; /* Stay in place */
    z-index: 999; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
    display: none;
  }

  .cookie_two {
    box-shadow: none !important;
    padding: 0 !important;
  }

  .cookie {
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #202124;
    color: #f8f9fa;
    margin: 24px;
    padding: 8px 24px;
    border-radius: 4px;
    box-shadow: 8px 8px 8px black;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    z-index: 1100;
    @media (max-width: 480px) {
      z-index: 99999 !important;
      margin: 0;
    }

    .cookie-inner {
      user-select: none;
      @media (max-width: 480px) {
        z-index: 99999;
      }
    }

    .hide {
      display: none;
    }

    .cookie-small-text {
      font-size: 16px;
      margin: 0;
      padding: 0;
      line-height: 1.5;
      color: #e2e2e2;
      display: inline-block;
      font-family: 'GillSansRegular';
      letter-spacing: 0.4px;

      b {
        font-size: 17px;
      }

      @media (max-width: 991px) {
        font-size: 15px;
        b {
          font-size: 15px;
        }
      }
      @media (max-width: 575px) {
        font-size: 14px;
        line-height: 1.1;
        b {
          font-size: 14px;
        }
      }
    }

    .general-preference-box {
      display: flex;
      align-items: center;

      .left {
        padding-right: 20px;
      }

      .right {
        max-width: max-content;
      }
    }

    .cookie-preferences {
      font-family: 'GillSansRegular';
      font-size: 16px;
      line-height: 1.5;
      color: #e2e2e2;
      text-decoration: underline;
      display: inline-block;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover,
      &.active {
        color: #fff;
      }

      @media (max-width: 991px) {
        font-size: 14px;
      }
    }

    .close-btn {
      background: #454545;
      outline: 0;
      border: 0;
      border-radius: 0;
      padding: 12px 30px 10px;
      color: #fff;
      text-transform: uppercase;
      font-size: 16px;
      font-family: 'ArcaMajora3';
      transition: all 0.2s ease;
      @media (max-width: 575px) {
        padding: 10px 18px 9px;
        font-size: 14px;
      }

      &:hover {
        background: #121212;
      }
    }

    .cookie-settings-wrapper {
      position: fixed;
      bottom: 0;
      left: 0;
      background-color: #202124;
      color: #f8f9fa;
      margin: 24px;
      padding: 8px 24px;
      border-radius: 4px;
      box-shadow: 8px 8px 8px black;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      opacity: 0;
      z-index: -1;
      height: 0%;
      width: 0%;
      overflow: hidden;
      -webkit-transition: all 0.5s ease;
      -o-transition: all 0.5s ease;
      transition: all 0.5s ease;
      transition: height 5s, width 1s;

      &.show {
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: #202124;
        color: #f8f9fa;
        margin: 24px;
        padding: 8px 24px;
        border-radius: 4px;
        box-shadow: 8px 8px 8px black;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        opacity: 1;
        z-index: 1200;
        height: 36%;
        width: 95%;
        @media (min-width: 768px) and (max-width: 1199px) {
          width: 90%;
          height: 38%;
        }
        @media(max-width: 767px) {
          height: 48%;
        }
        @media (max-width: 767px) {
          width: auto;
        }
        @media (max-width: 480px) {
          bottom: 0 !important;
          height: 100vh !important;
          top: -5px;
        }
      }

      .cross {
        font-size: 25px;
        position: absolute;
        background-color: #eb3679;
        right: 10px;
        top: 10px;
        width: 47px;
        height: 47px;
        padding-left: 0px;
        text-align: center;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        display: none;
        @media (max-width: 480px) {
          top: 49px;
          right: 10px;
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          height: 40px;
          width: 40px;
        }
      }

      @media (max-width: 480px) {
        position: fixed;
        bottom: auto;
        padding-bottom: 100px;
        overflow-y: auto;
        margin: 0 !important;
        -webkit-transition: all 0.2s linear;
        -moz-transition: all 0.2s linear;
        -o-transition: all 0.2s linear;
        transition: all 0.2s linear;
        &.show {
          transform: none;
          opacity: 1;
        }
      }

      .settings-inner {
        padding: 30px 0;
        @media (max-width: 1280px) {
          padding: 50px 0;
        }
        @media (min-width: 829px) and (max-width: 1199px) {
          padding: 54px 0 44px;
        }
        @media (max-width: 575px) {
          padding: 20px 0 74px;
        }
        @media (max-width: 440px) {
          padding: 20px 0 94px;
        }
        @media (max-width: 360px) {
          padding: 20px 0 114px;
        }

        .setting-box {
          display: flex;
          margin-bottom: 22px;
          @media (max-width: 575px) {
            margin-bottom: 16px;
          }

          &:last-child {
            margin-bottom: 0;
          }

          & > * {
            flex: 1;
          }

          .type,
          .actions {
            width: 140px;
            max-width: 140px;
            @media (max-width: 1199px) {
              width: 110px;
              max-width: 110px;
            }
            @media (max-width: 767px) {
              width: 90px;
              max-width: 90px;
            }
          }

          .actions {
            text-align: right;
          }

          .detail {
            @media (max-width: 575px) {
              padding: 0 10px;
            }
          }

          .actions {
            .button {
              position: relative;
              width: 80px;
              height: 36px;
              margin-left: auto;
              overflow: hidden;

              .checkbox {
                position: relative;
                width: 100%;
                height: 100%;
                padding: 0;
                margin: 0;
                opacity: 0;
                cursor: pointer;
                z-index: 3;

                &:checked + .knobs span {
                  background: #5eb92b;
                  left: 40px;
                }
              }

              .knobs, .layer {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
              }

              .knobs:before, .knobs:after, .knobs span {
                position: absolute;
                top: 0;
                width: 20px;
                height: 18px;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                line-height: 1;
                padding: 9px 4px;
                transition: 0.3s ease all;
              }

              .knobs {
                z-index: 2;

                &:after,
                &:before {
                  color: #4e4e4e;
                  z-index: 1;
                }

                &:before {
                  content: 'ON';
                  left: 5px;
                  top: 3px;
                  font-family: 'GillSansRegular';
                  color: #fff;
                  letter-spacing: 0.6px;
                }

                &:after {
                  content: 'OFF';
                  right: 9px;
                  top: 3px;
                  font-family: 'GillSansRegular';
                  color: #fff;
                  letter-spacing: 0.6px;
                }

                span {
                  width: 32px;
                  left: 0;
                  background-color: #454545;
                  z-index: 2;
                  transition: all 0.3s ease;
                }
              }

              .layer {
                width: 100%;
                background-color: #626262;
                transition: 0.3s ease all;
                z-index: 1;
              }
            }
          }
        }
      }
    }
  }

</style>
