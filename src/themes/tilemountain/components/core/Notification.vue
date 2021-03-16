<template>
  <div class="notifications fixed">
    <transition-group name="fade-in-down">
      <div
        class="notification mt30 border-box cl-white"
        v-for="(notification, index) in notifications"
        :key="`${notification.type}_${index}`"
        :class="notification.type"
      >
        <div
          @click="execAction(notification.action1, index)"
          class="message p20"
          data-testid="notificationMessage"
        >
          <!-- {{ $t('Are you sure you would like to remove this item from your basket?')}} -->
          {{ notification.message }}
        </div>
        <div class="actions col-md-10">
          <div
            class="pointer weight-400 notification-action okay-please uppercase"
            id="notificationAction2"
            data-testid="notificationAction2"
            @click="execAction(notification.action2, index)"
            v-if="notification.action2"
          >
            <!-- {{ $t('Yes Please') }} -->
            {{ notification.action2.label }}
          </div>
          <div
            class="pointer weight-400 action-border notification-action  uppercase"
            :class="`border-${notification.type}`"
            id="notificationAction1"
            data-testid="notificationAction1"
            @click="execAction(notification.action1, index)"
          >
            {{ notification.action1.label }}
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { Notification } from '@vue-storefront/core/modules/notification/components/Notification'

export default {
  mixins: [Notification],
  methods: {
    execAction (action, index) {
      if (action.action) {
        // for backward compatibility
        if (action.action === 'close') {
          this.$store.dispatch('notification/removeNotification', index)
          this.$store.commit('ui/setOverlay', false)
        } else {
          action.action()
        }
      }
      this.$store.dispatch('notification/removeNotification', index)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/base/global_vars';
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$z-index-notification: map-get($z-index, notification);
$color-error: color(error);
$color-success: color(success);
$color-warning: color(warning);
$color-info: color(accent);
$color-action: color(black);

.notifications {
  top: 160px;
  right: 32%;
  width: 370px;
  z-index: 1000;
  .notification{
    color: #4a4a4a;
    background:#fff;
    border-radius:10px;
    padding: 10px 0px;
    .message{
      text-align: center;
      font-size: 18px;
      line-height: 30px;
    }
  }

  @media (max-width: 64em) {
    width: 95%;
    top: 50%;
    left: 50%;
    /* right: 0; */
    /* bottom: 0; */
    margin: 0 auto;
    position: fixed;
    transform: translate(-50%, -50%);

    .fade-in-down-enter,
    .fade-in-down-leave-to {
      transform: translateY(100%);
    }
    .notification-action.okay-please{
      margin-left: 10px;
      margin-right: 10px;
    }
    .notification-action{
      margin-right: 10px;
    }
  }
}
.notification {
  box-shadow: 0px 0px 35px -5px rgba($color-action, .7);

  &:first-child  {
    margin-top: 0;
  }
}

.actions {
  display: flex;
  justify-content: space-between;
  margin:auto;
  padding-bottom: 10px;

  .notification-action {
    background:transparent;
    text-transform: capitalize;
    background: #ABAAB2;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    width: 100% !important;
    padding: 15px 0px;
    border-radius: 3px;
    min-width: 125px;
    font-weight: bold;
  }
  .notification-action.okay-please{
    background:#279C8E;
    margin-right: 30px;
  }

  #notificationAction2 {
    width: 100%;
  }
}
.success {
  background: $color-success;
}
.error {
  background: $color-error;
}
.warning {
  background: $color-warning;
}
.info {
  background: $color-info;
}
// .action-border {
//   border-right: 2px solid transparent;
//   &.border-success {
//     border-right-color: $color-success;
//   }
//   &.border-error {
//     border-color: $color-error;
//   }
//   &.border-warning {
//     border-color: $color-warning;
//   }
//   &.border-info {
//     border-color: $color-info;
//   }
// }
@media(max-width:767px){
  .notification-action {
    margin-right: 20px !important;
    margin-left: 20px !important;
  }
}
</style>
