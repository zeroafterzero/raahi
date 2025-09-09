import { usePomodoro } from "@/hooks/usePomodoro";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { useEffect } from "react";

export default function Controls() {
  const { 
    isActive, 
    sessionType, 
    toggleTimer, 
    resetTimer, 
    skipSession, 
    setSessionType 
  } = usePomodoro();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          toggleTimer();
          break;
        case 'r':
        case 'R':
          resetTimer();
          break;
        case 's':
        case 'S':
          skipSession();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [toggleTimer, resetTimer, skipSession]);

  const sessionTypes = [
    { key: 'focus', label: 'Focus (25m)', duration: 25 * 60 },
    { key: 'short_break', label: 'Short Break (5m)', duration: 5 * 60 },
    { key: 'long_break', label: 'Long Break (15m)', duration: 15 * 60 },
  ];

  return (
    <div>
      <div className="flex flex-col space-y-4">
        {/* Main control button */}
        <button 
          className={`w-full py-4 bg-capella-btn text-capella-btn-text rounded-xl font-semibold text-lg hover:opacity-90 transition-all flex items-center justify-center space-x-2 ${
            isActive ? 'active-timer shadow-lg transform scale-105' : ''
          }`}
          onClick={toggleTimer}
          data-testid="button-toggle-timer"
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isActive ? 'Pause Session' : 'Start Session'}</span>
        </button>

        {/* Secondary controls */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            className="py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            onClick={resetTimer}
            data-testid="button-reset-timer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button 
            className="py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            onClick={skipSession}
            data-testid="button-skip-session"
          >
            <SkipForward className="w-4 h-4" />
            <span>Skip</span>
          </button>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
          <div>Shortcuts: Space (Start/Pause) • R (Reset) • S (Skip)</div>
        </div>

        {/* Session type selector */}
        <div className="flex bg-gray-100 rounded-lg p-1 mt-4">
          {sessionTypes.map((type) => (
            <button
              key={type.key}
              className={`
                flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all
                ${sessionType === type.key 
                  ? 'bg-capella-btn text-capella-btn-text shadow-md transform scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
              onClick={() => setSessionType(type.key as 'focus' | 'short_break' | 'long_break')}
              data-testid={`button-session-${type.key}`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
