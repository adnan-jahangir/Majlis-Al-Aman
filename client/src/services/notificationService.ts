// Client Notification Service for Browser Native Web Push & Local Scheduled Reminders

export const notificationService = {
  // Check if browser supports notifications
  isSupported: (): boolean => {
    return 'Notification' in window;
  },

  // Get current permission status
  getPermission: (): NotificationPermission => {
    if (!('Notification' in window)) return 'denied';
    return Notification.permission;
  },

  // Request browser notification permission
  requestPermission: async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notification');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return false;
    }
  },

  // Show rich notification
  showNotification: (title: string, options: NotificationOptions = {}): boolean => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return false;
    }

    try {
      const notif = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'majlis-prayer-reminder',
        ...options
      } as NotificationOptions);

      notif.onclick = () => {
        window.focus();
        notif.close();
      };

      return true;
    } catch (e) {
      console.warn('Notification constructor error (attempting Service Worker fallback):', e);
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, options);
        });
        return true;
      }
      return false;
    }
  },

  // Send immediate test notification
  sendTestNotification: (userName: string = 'Believer') => {
    return notificationService.showNotification('🌿 Majlis Al-Aman Test Notification', {
      body: `Assalamu Alaikum ${userName}! Real-time reminders are active on this device. You will receive alerts to complete your daily worship log.`,
      icon: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      silent: false
    });
  }
};
