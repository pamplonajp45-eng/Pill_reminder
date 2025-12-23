import { useState, useEffect, useRef, useCallback, } from "react";

const VIBRATION_PATTERN = [200, 100, 200, 100, 200];
const DIALOG_DELAY_MS = 500;

export function useAlarm(pills, onPillTaken, onPillSnoozed, options = {}) {
  const {
    audioUrl = "reminder4.mp3",
    snoozeDurationMinutes = 10,
    audioLoopDurationSeconds = 9,
    enableServiceWorker = false
  } = options;

  const [snoozedPills, setSnoozedPills] = useState({});
  const [triggeredAlarms, setTriggeredAlarms] = useState({});
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const audioRef = useRef(null);
  const activeAlarmRef = useRef(null);

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    if (audio._loopHandler) {
      audio.removeEventListener('timeupdate', audio._loopHandler);
      audio._loopHandler = null;
    }
  }, []);

  const clearSnooze = useCallback((pillId) => {
    setSnoozedPills(prev => {
      const newSnoozed = { ...prev };
      delete newSnoozed[pillId];
      return newSnoozed;
    });
  }, []);

  const snooze = useCallback((pillId, minutes = snoozeDurationMinutes) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    const snoozeTime = now.toTimeString().slice(0, 5);

    setSnoozedPills(prev => ({
      ...prev,
      [pillId]: snoozeTime
    }));

    return snoozeTime;
  }, [snoozeDurationMinutes]);

  useEffect(() => {
    return () => {
      activeAlarmRef.current = null;
      stopAudio();
    };
  }, [stopAudio]);


  useEffect(() => {
    const audio = new Audio(audioUrl);
    audio.volume = 1.0;
    audio.preload = "auto";
    audioRef.current = audio;

    const enableAudio = () => {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        setIsAudioEnabled(true);
        console.log("Audio enabled for alarms");
      }).catch(err => {
        console.log("Audio could not be enabled:", err);
      });
    };

    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, enableAudio, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, enableAudio);
      });
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl]);


  useEffect(() => {
    const today = new Date().toDateString();
    const lastAlarmReset = localStorage.getItem("lastAlarmResetDate");

    if (lastAlarmReset !== today) {
      setTriggeredAlarms({});
      localStorage.setItem("lastAlarmResetDate", today);
    }
  }, []);

  const triggerAlarm = useCallback((pill) => {
    if (activeAlarmRef.current) {
      console.log("An alarm is already active, skipping new alarm for", pill.name);
      return;
    }

    activeAlarmRef.current = pill.id;

    const audio = audioRef.current;
    if (audio && (audio.paused || audio.ended)) {
      audio.currentTime = 0;
      audio.loop = false;

      audio.play().catch(err => {
        console.log("Audio playback failed:", err);
      });

      const handleTimeUpdate = () => {
        if (audio.currentTime >= audioLoopDurationSeconds && !audio.paused) {
          audio.currentTime = 0;
        }
      };

      if (audio._loopHandler) {
        audio.removeEventListener('timeupdate', audio._loopHandler);
      }
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio._loopHandler = handleTimeUpdate;
    }

    if ('vibrate' in navigator) {
      navigator.vibrate(VIBRATION_PATTERN);
    }

    if ('Notification' in window && Notification.permission === "granted") {
      const dosageText = pill.dosage ? ` (${pill.dosage})` : "";


      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification("LUNO", {
            body: `Time to take ${pill.name}${dosageText}`,
            icon: "LUNO.png",
            badge: "LUNO.png",
            requireInteraction: true,
            tag: `pill-${pill.id}`,
            data: { pillId: pill.id },
            vibrate: VIBRATION_PATTERN,
            silent: false,
            actions: [
              { action: 'take', title: 'I took it', icon: 'LUNO.png' },
              { action: 'snooze', title: `Snooze (${snoozeDurationMinutes}m)`, icon: 'LUNO.png' }
            ]
          });
        });
      } else {

        const notification = new Notification(" LUNO", {
          body: `Time to take ${pill.name}${dosageText}`,
          icon: "LUNO.png",
          badge: "LUNO.png",
          requireInteraction: true,
          tag: `pill-${pill.id}`,
          vibrate: VIBRATION_PATTERN,
          silent: false
        });
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    }

    setTimeout(() => {
      const dosageText = pill.dosage ? ` (${pill.dosage})` : "";
      const userResponse = window.confirm(
        `💊 ${pill.name}${dosageText}\n\nOK = I took it\nCancel = ${snoozeDurationMinutes} min snooze`
      );

      stopAudio();
      activeAlarmRef.current = null;

      if (userResponse) {
        onPillTaken(pill);
        clearSnooze(pill.id);
      } else {
        const snoozeTime = snooze(pill.id, snoozeDurationMinutes);
        onPillSnoozed(pill, snoozeTime);
      }
    }, DIALOG_DELAY_MS);
  }, [
    audioLoopDurationSeconds,
    snoozeDurationMinutes,
    onPillTaken,
    onPillSnoozed,
    clearSnooze,
    snooze,
    stopAudio
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);

      pills.forEach(pill => {
        if (!pill.times || !Array.isArray(pill.times)) return;

        pill.times.forEach(time => {
          if (typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) return;

          const alarmKey = `${pill.id}-${time}`;
          const isScheduledTime = time === currentTime && !pill.takenToday;
          const isSnoozedTime = snoozedPills[pill.id] === currentTime;
          const notTriggeredYet = triggeredAlarms[alarmKey] !== currentTime;

          if ((isScheduledTime || isSnoozedTime) && notTriggeredYet) {
            setTriggeredAlarms(prev => ({
              ...prev,
              [alarmKey]: currentTime
            }));
            triggerAlarm(pill);
          }
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pills, snoozedPills, triggeredAlarms, triggerAlarm]);

  // Listen for actions from Service Worker
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'NOTIFICATION_ACTION') {
        const { action, pillId } = event.data;
        const pill = pills.find(p => p.id === pillId);

        if (pill) {
          stopAudio();
          if (action === 'take') {
            onPillTaken(pill);
            clearSnooze(pill.id);
          } else if (action === 'snooze') {
            const snoozeTime = snooze(pill.id, snoozeDurationMinutes);
            onPillSnoozed(pill, snoozeTime);
          }
        }
      }
    };

    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
      return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
    }
  }, [pills, onPillTaken, onPillSnoozed, clearSnooze, snooze, snoozeDurationMinutes, stopAudio]);

  return {
    snoozedPills,
    isAudioEnabled,
    snooze,
    clearSnooze,
    stopAudio
  };
}























