import webpush from 'web-push';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BOj9X__EeOKgWsDO3_TdxQyiPinOB_lMjj3491BcXVfojK-5bUTUIx7VHyGGVfxlJ9t_qQ3JBI92RUWjqVgCVTs';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'a89RzA2yaV4WpdzbzzJBRgfbfO2ovg2tk_BsvwUETSI';

webpush.setVapidDetails(
    'mailto:example@yourdomain.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { subscription, pillName, dosage } = req.body;

        const payload = JSON.stringify({
            title: 'LUNO Reminder',
            body: `Time to take your ${pillName}${dosage ? ` (${dosage})` : ''}!`,
            icon: '/LUNO.png',
            badge: '/LUNO.png',
            data: {
                url: '/'
            }
        });

        try {
            await webpush.sendNotification(subscription, payload);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error sending push:', error);
            res.status(500).json({ error: 'Failed to send notification' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
