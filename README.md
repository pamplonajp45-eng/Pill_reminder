# LUNO

**Luno keeps you on track, quietly guiding you to take your meds on time.**

LUNO is a modern, minimalist companion for your wellness journey. "Luna" (moon), symbolizing guidance, cycles, and care. It’s designed to be a gentle, brandable, and user-friendly reminder app that feels like a wellness companion rather than just a tool.

## Key Features

- **100% Reliable Push Notifications**: Uses the Web Push API and Vercel Serverless Functions to ensure alerts arrive even when you're using other apps (Facebook, TikTok, etc.) or when your phone is in deep sleep.
- **Smart "Catch-Up" Logic**: If you miss a notification while your phone is off, LUNO immediately alerts you the moment you wake it up.
- **Multi-Dose Support**: Schedule multiple times for the same pill; each dose triggers its own independent alarm.
- **Gentle Audio Cues**: Selection of calm audio alerts to keep you on schedule without being intrusive.
- **Offline First**: A Progressive Web App (PWA) that maintains its core functionality even without an internet connection.
- **Privacy Focused**: Pill data is stored locally on your device via `localStorage`.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/) (Vite)
- **Backend**: [Vercel Serverless Functions](https://vercel.com/docs/functions) (Node.js)
- **Push Engine**: [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) & `web-push`
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- **Styling**: Vanilla CSS with modern Glassmorphism aesthetics.

##  Deployment & Setup

LUNO is optimized for deployment on **Vercel**.

### Environment Variables

For the high-reliability push notifications to work, you must set the following environment variables in your Vercel or local environment:

| Variable | Description |
| :--- | :--- |
| `VAPID_PUBLIC_KEY` | Your VAPID Public Key for Web Push. |
| `VAPID_PRIVATE_KEY` | Your VAPID Private Key for Web Push. |

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pamplonajp45-eng/Pill_reminder.git
   cd Pill_reminder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development**:
   ```bash
   npm run dev
   ```

##  PWA Installation

To install **LUNO** on your mobile device:
- **iOS**: Open the app in Safari, tap the 'Share' icon, and select 'Add to Home Screen'.
- **Android**: Open the app in Chrome, tap the menu (three dots), and select 'Install app'.

##  License

This project is for personal use and portfolio demonstration. Created by jpdev.
