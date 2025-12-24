import webpush from 'web-push';

// Configuration (Use environment variables in Vercel!)
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BOj9X__EeOKgWsDO3_TdxQyiPinOB_lMjj3491BcXVfojK-5bUTUIx7VHyGGVfxlJ9t_qQ3JBI92RUWjqVgCVTs';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'a89RzA2yaV4WpdzbzzJBRgfbfO2ovg2tk_BsvwUETSI';

webpush.setVapidDetails(
    'mailto:example@yourdomain.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

// This is a placeholder. In a real app, you MUST use a database (e.g., Upstash, MongoDB, etc.)
// to store subscriptions persistently. Vercel functions are stateless!
let subscriptions = [];

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const subscription = req.body;

        // In a real app: await db.insert(subscription);
        console.log('Received subscription:', subscription);

        // For demo purposes, we'll just return success.
        res.status(201).json({ message: 'Subscription received' });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
