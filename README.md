# 💊 Pill Reminder

A modern, responsive Progressive Web App (PWA) designed to help you never miss a dose. Manage your pill schedule, set smart alarms, and track your medication history with ease. Developed by **jpdev**.

##  Features

- **Pill Management**: Add, edit, and delete pill entries with name, dosage, and frequency.
- **Smart Alarms**: Native-style notifications and audio reminders even when the app is in the background.
- **Offline Mode**: Fully functional offline thanks to PWA technology. All data is persisted locally.
- **Dose History**: Track which pills were taken and when.
- **Modern UI**: Smooth animations powered by Framer Motion and a clean, responsive layout.
- **Automatic Resets**: Daily status resets ensure you're ready for each new day.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/) (Vite)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- **State Management**: Custom React Hooks (`usePills`, `useAlarm`, `usePillHistory`)
- **Storage**: `localStorage`

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

## 📱 PWA Installation

To install the app on your mobile device:
- **iOS**: Open the app in Safari, tap the 'Share' icon, and select 'Add to Home Screen'.
- **Android**: Open the app in Chrome, tap the menu (three dots), and select 'Install app'.

## 📜 License

This project is for personal use and portfolio demonstration. Created by jpdev.
