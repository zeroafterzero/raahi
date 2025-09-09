import { useState, useEffect, useCallback, useRef } from "react";
import { focusServiceClient } from "@/lib/focusServiceClient";
import { useToast } from "@/hooks/use-toast";

type SessionType = 'focus' | 'short_break' | 'long_break';

interface PomodoroState {
  isActive: boolean;
  timeRemaining: number;
  totalTime: number;
  sessionType: SessionType;
  sessionId: string | null;
  cycleCount: number;
}

// Default durations - will be overridden by settings
const DEFAULT_SESSION_DURATIONS = {
  focus: 25 * 60, // 25 minutes
  short_break: 5 * 60, // 5 minutes
  long_break: 15 * 60, // 15 minutes
};

const STORAGE_KEY = 'capella_focus_state';

export function usePomodoro() {
  const { toast } = useToast();
  
  // Get current settings
  const getSettings = () => {
    const saved = localStorage.getItem('capella_pomodoro_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  };

  const getDurationFromSettings = (type: SessionType) => {
    const settings = getSettings();
    if (settings) {
      switch (type) {
        case 'focus': return settings.focusDuration * 60;
        case 'short_break': return settings.shortBreakDuration * 60;
        case 'long_break': return settings.longBreakDuration * 60;
      }
    }
    return DEFAULT_SESSION_DURATIONS[type];
  };

  const [state, setState] = useState<PomodoroState>(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          isActive: false, // Always start inactive after reload
        };
      } catch {
        // Fallback to default state
      }
    }
    
    const focusDuration = getDurationFromSettings('focus');
    return {
      isActive: false,
      timeRemaining: focusDuration,
      totalTime: focusDuration,
      sessionType: 'focus' as SessionType,
      sessionId: null,
      cycleCount: 0,
    };
  });

  const intervalRef = useRef<number | null>(null);
  
  // Listen for settings changes and update current session if needed
  useEffect(() => {
    const handleSettingsChange = (e: CustomEvent) => {
      const newSettings = e.detail;
      setState(prev => {
        // Only update if not currently active to avoid disrupting running sessions
        if (!prev.isActive) {
          const newTotalTime = getDurationFromSettings(prev.sessionType);
          return {
            ...prev,
            totalTime: newTotalTime,
            timeRemaining: newTotalTime,
          };
        }
        return prev;
      });
    };

    window.addEventListener('pomodoroSettingsChanged', handleSettingsChange as EventListener);
    return () => window.removeEventListener('pomodoroSettingsChanged', handleSettingsChange as EventListener);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Timer logic
  useEffect(() => {
    if (state.isActive && state.timeRemaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          timeRemaining: Math.max(0, prev.timeRemaining - 1)
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isActive, state.timeRemaining]);

  // Handle session completion
  useEffect(() => {
    if (state.isActive && state.timeRemaining === 0) {
      // Session completed
      handleSessionEnd(true);
      
      // Show completion notification
      showSessionCompletionNotification(state.sessionType);
      
      // Auto-advance to next session type
      const nextType = getNextSessionType(state.sessionType, state.cycleCount);
      const settings = getSettings();
      
      if (settings?.autoStart) {
        // Auto-start next session after short delay
        setTimeout(() => {
          setSessionType(nextType);
          setTimeout(() => {
            setState(prev => ({ ...prev, isActive: true }));
          }, 1000);
        }, 2000);
      } else {
        setSessionType(nextType);
      }
    }
  }, [state.timeRemaining, state.isActive]);

  const toggleTimer = useCallback(async () => {
    if (!state.isActive) {
      // Starting timer
      try {
        const sessionId = await focusServiceClient.startSession({
          userId: 'default-user',
          sessionType: state.sessionType,
          durationRequested: state.totalTime,
          startedAt: new Date(),
        });

        setState(prev => ({
          ...prev,
          isActive: true,
          sessionId,
        }));
      } catch (error) {
        console.error('Failed to start session:', error);
        // Continue with local timer even if API fails
        setState(prev => ({
          ...prev,
          isActive: true,
        }));
      }
    } else {
      // Pausing timer
      setState(prev => ({
        ...prev,
        isActive: false,
      }));
    }
  }, [state.isActive, state.sessionType, state.totalTime]);

  const resetTimer = useCallback(() => {
    if (state.sessionId && state.isActive) {
      handleSessionEnd(false);
    }

    setState(prev => ({
      ...prev,
      isActive: false,
      timeRemaining: prev.totalTime,
      sessionId: null,
    }));
  }, [state.sessionId, state.isActive]);

  const skipSession = useCallback(() => {
    if (state.sessionId && state.isActive) {
      handleSessionEnd(false);
    }

    const nextType = getNextSessionType(state.sessionType, state.cycleCount);
    setSessionType(nextType);
  }, [state.sessionId, state.isActive, state.sessionType, state.cycleCount]);

  const showSessionCompletionNotification = (completedType: SessionType) => {
    const settings = getSettings();
    
    const messages = {
      focus: "Focus session completed! Time for a break.",
      short_break: "Break time over! Ready to focus?",
      long_break: "Long break finished! Let's get back to work."
    };
    
    // Show toast notification
    toast({
      title: "Session Complete!",
      description: messages[completedType],
      duration: 5000,
    });
    
    // Play sound if enabled
    if (settings?.soundNotifications) {
      // Simple beep sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.log('Audio notification failed:', error);
      }
    }
    
    // Show desktop notification if enabled and permission granted
    if (settings?.desktopNotifications && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Capella Pro - Focus Mode', {
          body: messages[completedType],
          icon: '/favicon.ico',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Capella Pro - Focus Mode', {
              body: messages[completedType],
              icon: '/favicon.ico',
            });
          }
        });
      }
    }
  };

  const setSessionType = useCallback((type: SessionType) => {
    const newTotalTime = getDurationFromSettings(type);
    
    setState(prev => {
      let newCycleCount = prev.cycleCount;
      
      // Increment cycle count when completing a focus session
      if (prev.sessionType === 'focus' && type !== 'focus') {
        newCycleCount += 1;
      }
      
      return {
        ...prev,
        isActive: false,
        sessionType: type,
        totalTime: newTotalTime,
        timeRemaining: newTotalTime,
        sessionId: null,
        cycleCount: newCycleCount,
      };
    });
  }, []);

  const handleSessionEnd = async (completed: boolean) => {
    if (state.sessionId) {
      try {
        await focusServiceClient.endSession(state.sessionId, {
          endedAt: new Date(),
          durationActual: state.totalTime - state.timeRemaining,
          completed,
        });
      } catch (error) {
        console.error('Failed to end session:', error);
      }
    }
  };

  const getNextSessionType = (currentType: SessionType, cycleCount: number): SessionType => {
    if (currentType === 'focus') {
      // After every 4 focus sessions, take a long break
      return cycleCount > 0 && cycleCount % 4 === 0 ? 'long_break' : 'short_break';
    } else {
      // After any break, return to focus
      return 'focus';
    }
  };

  return {
    isActive: state.isActive,
    timeRemaining: state.timeRemaining,
    totalTime: state.totalTime,
    sessionType: state.sessionType,
    cycleCount: state.cycleCount,
    toggleTimer,
    resetTimer,
    skipSession,
    setSessionType,
  };
}
