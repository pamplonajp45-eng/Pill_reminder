import { precacheAndRoute } from 'workbox-precaching';


precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('notificationclick', (event) => {
    const notification = event.notification;
    const action = event.action;

    notification.close();

    if (action === 'take' || action === 'snooze') {

        event.waitUntil(
            self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
                if (clientList.length > 0) {
                    let client = clientList[0];
                    for (let i = 0; i < clientList.length; i++) {
                        if (clientList[i].focused) {
                            client = clientList[i];
                            break;
                        }
                    }
                    client.postMessage({
                        type: 'NOTIFICATION_ACTION',
                        action: action,
                        pillId: notification.data.pillId
                    });
                    return client.focus();
                }
                return self.clients.openWindow('/').then((client) => {

                    setTimeout(() => {
                        client.postMessage({
                            type: 'NOTIFICATION_ACTION',
                            action: action,
                            pillId: notification.data.pillId
                        });
                    }, 1000);
                });
            })
        );
    } else {

        event.waitUntil(
            self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
                if (clientList.length > 0) {
                    return clientList[0].focus();
                }
                return self.clients.openWindow('/');
            })
        );
    }
});
