import { useState, useEffect } from "react";

export default function DigitalTimeGreeting() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getGreeting = (date: Date) => {
    const hour = date.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const userName = "User"; // This would come from user context in real app

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="text-center lg:text-left space-y-3">
      <div className="text-4xl font-bold text-capella-text" data-testid="text-current-time">
        {formatTime(time)}
      </div>
      <div className="text-lg font-semibold text-capella-dark-teal" data-testid="text-greeting">
        {getGreeting(time)}, {userName}!
      </div>
      <div className="text-sm text-gray-600" data-testid="text-current-date">
        {formatDate(time)}
      </div>
    </div>
  );
}
