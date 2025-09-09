import { useState, useEffect } from "react";

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 100); // Update every 100ms for smooth second hand
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  // Calculate angles with smooth movement
  const hourAngle = (hours * 30) + (minutes * 0.5) + (seconds * 0.00833); // Smooth hour hand
  const minuteAngle = (minutes * 6) + (seconds * 0.1); // Smooth minute hand
  const secondAngle = (seconds * 6) + (milliseconds * 0.006); // Smooth second hand

  // Generate hour markers
  const hourMarkers = [];
  for (let i = 0; i < 12; i++) {
    const angle = i * 30;
    const x1 = 100 + Math.cos((angle - 90) * Math.PI / 180) * 85;
    const y1 = 100 + Math.sin((angle - 90) * Math.PI / 180) * 85;
    const x2 = 100 + Math.cos((angle - 90) * Math.PI / 180) * 75;
    const y2 = 100 + Math.sin((angle - 90) * Math.PI / 180) * 75;
    
    hourMarkers.push(
      <line 
        key={`hour-${i}`}
        x1={x1} 
        y1={y1} 
        x2={x2} 
        y2={y2} 
      />
    );
  }

  // Generate minute markers (skip hour positions)
  const minuteMarkers = [];
  for (let i = 0; i < 60; i++) {
    if (i % 5 !== 0) { // Skip hour markers
      const angle = i * 6;
      const x1 = 100 + Math.cos((angle - 90) * Math.PI / 180) * 90;
      const y1 = 100 + Math.sin((angle - 90) * Math.PI / 180) * 90;
      const x2 = 100 + Math.cos((angle - 90) * Math.PI / 180) * 85;
      const y2 = 100 + Math.sin((angle - 90) * Math.PI / 180) * 85;
      
      minuteMarkers.push(
        <line 
          key={`minute-${i}`}
          x1={x1} 
          y1={y1} 
          x2={x2} 
          y2={y2} 
        />
      );
    }
  }

  return (
    <div className="flex justify-center">
      <div className="relative w-48 h-48">
        <div className="premium-glass rounded-full w-full h-full p-2">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Outer ring */}
            <circle 
              cx="100" 
              cy="100" 
              r="98" 
              fill="none" 
              stroke="rgba(0, 139, 139, 0.2)" 
              strokeWidth="1"
            />
            {/* Clock face */}
            <circle 
              cx="100" 
              cy="100" 
              r="95" 
              fill="rgba(255, 255, 255, 0.6)" 
              stroke="rgba(0, 139, 139, 0.1)" 
              strokeWidth="1"
            />
            
            {/* Hour markers - all 12 hours */}
            <g stroke="rgba(0, 139, 139, 0.8)" strokeWidth="3" strokeLinecap="round">
              {hourMarkers}
            </g>
            
            {/* Minute markers - every minute except hours */}
            <g stroke="rgba(0, 139, 139, 0.4)" strokeWidth="1" strokeLinecap="round">
              {minuteMarkers}
            </g>
            
            {/* Clock hands with smooth movement */}
            {/* Hour hand */}
            <line 
              x1="100" 
              y1="100" 
              x2="100" 
              y2="55" 
              stroke="rgba(0, 139, 139, 0.9)" 
              strokeWidth="5" 
              strokeLinecap="round" 
              className="clock-smooth" 
              style={{ transform: `rotate(${hourAngle}deg)` }}
            />
            
            {/* Minute hand */}
            <line 
              x1="100" 
              y1="100" 
              x2="100" 
              y2="35" 
              stroke="rgba(0, 139, 139, 0.8)" 
              strokeWidth="3" 
              strokeLinecap="round" 
              className="clock-smooth" 
              style={{ transform: `rotate(${minuteAngle}deg)` }}
            />
            
            {/* Second hand */}
            <line 
              x1="100" 
              y1="100" 
              x2="100" 
              y2="25" 
              stroke="#ef4444" 
              strokeWidth="2" 
              strokeLinecap="round" 
              className="clock-smooth" 
              style={{ transform: `rotate(${secondAngle}deg)` }}
            />
            
            {/* Center dot */}
            <circle cx="100" cy="100" r="5" fill="rgba(0, 139, 139, 0.9)" />
            <circle cx="100" cy="100" r="2" fill="#ef4444" />
          </svg>
        </div>
      </div>
    </div>
  );
}