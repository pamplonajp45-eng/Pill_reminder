import { precacheAndRoute } from 'workbox-precaching';


precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', (event) => {
    let data = { title: 'LUNO', body: 'Time for your pill!' };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = { title: 'LUNO', body: event.data.text() };
        }
    }

    const options = {
        body: data.body,
        icon: data.icon || 'LUNO.png',
        badge: data.badge || 'LUNO.png',
        data: data.data || {},
        vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500],
        requireInteraction: true,
        renote: true,
        tag: 'pill-reminder'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    const notification = event.notification;
    const action = event.action;

    notification.close();

    // Default behavior: focus or open app
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return self.clients.openWindow('/');
        })
    );

    // If it was a specific pill action (from useAlarm local notification)
    if (action === 'take' || action === 'snooze') {
        event.waitUntil(
            self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
                const client = clientList.find(c => c.focused) || clientList[0];
                if (client) {
                    client.postMessage({
                        type: 'NOTIFICATION_ACTION',
                        action: action,
                        pillId: notification.data?.pillId
                    });
                }
            })
        );
    }
});
