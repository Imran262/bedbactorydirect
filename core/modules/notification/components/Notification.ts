import NotificationItem from '../types/NotificationItem'

export const Notification = {
  name: 'Notification',
  computed: {
    notifications (): NotificationItem[] {
      return this.$store.getters['notification/notifications']
    },
  basketNotifications (): NotificationItem[] {
    return this.$store.getters['notification/basketNotifications']
  }
  }
}
