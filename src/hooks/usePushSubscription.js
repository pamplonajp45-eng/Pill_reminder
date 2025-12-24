import { useState, useCallback } from 'react';

const VAPID_PUBLIC_KEY = 'BOj9X__EeOKgWsDO3_TdxQyiPinOB_lMjj3491BcXVfojK-5bUTUIx7VHyGGVfxlJ9t_qQ3JBI92RUWjqVgCVTs';

export function usePushSubscription() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState(null);

    const subscribeUser = useCallback(async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Push notifications not supported');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;

            // Check if already subscribed
            let sub = await registration.pushManager.getSubscription();

            if (!sub) {
                // Subscribe
                sub = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
                });

                // Save to our backend
                await fetch('/api/subscribe', {
                    method: 'POST',
                    body: JSON.stringify(sub),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            setSubscription(sub);
            setIsSubscribed(true);
            console.log('User subscribed:', sub);
            return sub;
        } catch (error) {
            console.error('Failed to subscribe user:', error);
        }
    }, []);

    return { isSubscribed, subscription, subscribeUser };
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
