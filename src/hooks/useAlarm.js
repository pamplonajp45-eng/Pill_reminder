import { useState, useEffect, useRef } from "react";

export function useAlarm(pills, onPillTaken, onPillSnoozed) {
  const [snoozedPills, setSnoozedPills] = useState({});
  const [triggeredAlarms, setTriggeredAlarms] = useState({});
  const audioRef = useRef(null);

  useEffect(() => {
    // Register service worker for better mobile support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered');
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Setup audio
    audioRef.current = new Audio("/reminder2.mp3");
    audioRef.current.volume = 1.0;
    audioRef.current.preload = "auto";

    const enableAudio = () => {
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }).catch(() => {
        console.log("Audio not yet enabled");
      });
    };

    document.addEventListener('click', enableAudio, { once: true });

    return () => {
      document.removeEventListener('click', enableAudio);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);

      pills.forEach(pill => {
        if (!pill.times || !Array.isArray(pill.times)) return;

        pill.times.forEach(time => {
          const alarmKey = `${pill.id}-${time}`;
          
          const shouldTrigger =
            (time === currentTime && !pill.takenToday) ||
            snoozedPills[pill.id] === currentTime;

          if (shouldTrigger && triggeredAlarms[alarmKey] !== currentTime) {
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
  }, [pills, snoozedPills, triggeredAlarms]);

  function triggerAlarm(pill) {
    const audio = audioRef.current;

    // Try to play audio (works on desktop, often blocked on mobile)
    if (audio && (audio.paused || audio.ended)) {
      audio.currentTime = 0;
      audio.loop = false;
      audio.play().catch(err => {
        console.log("Audio playback blocked on mobile:", err);
      });

      const loopDuration = 7;
      const handleTimeUpdate = () => {
        if (audio.currentTime >= loopDuration) {
          audio.currentTime = 0;
        }
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio._loopHandler = handleTimeUpdate;
    }

    // Vibrate phone (works on mobile!)
    if ('vibrate' in navigator) {
      // Vibrate pattern: vibrate 200ms, pause 100ms, repeat 3 times
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    // Show notification with system sound
    if (Notification.permission === "granted") {
      const dosageText = pill.dosage ? ` (${pill.dosage})` : "";
      
      const notification = new Notification("💊 Pill Reminder!", {
        body: `Time to take ${pill.name}${dosageText}`,
        icon: "/icon-192.png", // Add an icon
        badge: "/icon-192.png",
        requireInteraction: true,
        tag: `pill-${pill.id}`,
        vibrate: [200, 100, 200, 100, 200], // Vibration pattern
        silent: false // Use system notification sound
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }

    // Show dialog (only works if app is open)
    setTimeout(() => {
      const dosageText = pill.dosage ? ` (${pill.dosage})` : "";
      const userResponse = window.confirm(
        `💊 ${pill.name}${dosageText}\n\nOK = I took it\nCancel = Snooze 10 min`
      );

      stopAudio();

      if (userResponse) {
        onPillTaken(pill);
        clearSnooze(pill.id);
      } else {
        snooze(pill.id, 10);
        onPillSnoozed(pill);
      }
    }, 500);
  }

  function stopAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;

    if (audio._loopHandler) {
      audio.removeEventListener('timeupdate', audio._loopHandler);
      audio._loopHandler = null;
    }
  }

  function snooze(pillId, minutes) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    const snoozeTime = now.toTimeString().slice(0, 5);

    setSnoozedPills(prev => ({
      ...prev,
      [pillId]: snoozeTime
    }));

    alert(`Snoozed for ${minutes} minutes. Will remind you at ${snoozeTime}`);
  }

  function clearSnooze(pillId) {
    setSnoozedPills(prev => {
      const newSnoozed = { ...prev };
      delete newSnoozed[pillId];
      return newSnoozed;
    });
  }

  return {
    snoozedPills,
    snooze,
    clearSnooze
  };
}