# LUNO

**Luno keeps you on track, quietly guiding you to take your meds on time.**

LUNO is a modern, minimalist companion for your wellness journey. "Luna" (moon), symbolizing guidance, cycles, and care. It’s designed to be a gentle, brandable, and user-friendly reminder app that feels like a wellness companion rather than just a tool.

## Features

- **Gentle Reminders**: Native-style notifications and calm audio cues to keep you on schedule.
- **Pill Management**: Clean interface to manage names, dosages, and frequencies.
- **Offline Reliability**: A Progressive Web App (PWA) that works anywhere, even without an internet connection.
- **Dose History**: Track your consistency with an easy-to-read history log.
- **Premium Design**: Smooth, fluid animations powered by Framer Motion.
- **Daily Guidance**: Automatic resets to help you start every day on the right foot.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/) (Vite)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- **State Management**: Custom React Hooks (`usePills`, `useAlarm`, `usePillHistory`)
- **Storage**: `localStorage` (Privacy-focused, local-only)

##  Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

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

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

##  PWA Installation

To install **LUNO** on your mobile device:
- **iOS**: Open the app in Safari, tap the 'Share' icon, and select 'Add to Home Screen'.
- **Android**: Open the app in Chrome, tap the menu (three dots), and select 'Install app'.

##  License

This project is for personal use and portfolio demonstration. Created by jpdev.
