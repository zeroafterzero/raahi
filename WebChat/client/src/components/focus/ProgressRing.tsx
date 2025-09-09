import { usePomodoro } from "@/hooks/usePomodoro";

export default function ProgressRing() {
  const { 
    timeRemaining, 
    totalTime, 
    sessionType, 
    isActive 
  } = usePomodoro();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'focus': return 'Focus Session';
      case 'short_break': return 'Short Break';
      case 'long_break': return 'Long Break';
      default: return 'Session';
    }
  };

  const progress = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0;
  const circumference = 2 * Math.PI * 80; // radius = 80
  const strokeDashoffset = circumference - (progress * circumference);
  const progressPercent = Math.round(progress * 100);

  return (
    <div className={`flex flex-col items-center space-y-6 ${isActive ? 'active-timer' : ''}`}>
      <div className="relative w-56 h-56">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="rgba(0, 0, 0, 0.1)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="var(--capella-btn)"
              strokeWidth="8"
              strokeLinecap="round"
              className="progress-ring"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset
              }}
            />
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
            <div className="text-3xl font-bold" data-testid="text-timer-display">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-600" data-testid="text-session-type">
              {getSessionTypeLabel(sessionType)}
            </div>
            <div className="text-xs text-gray-500 mt-1" data-testid="text-progress-percent">
              {progressPercent}% complete
            </div>
          </div>
        </div>
    </div>
  );
}
