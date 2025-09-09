import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
  
  const weeks = [];
  const currentWeek = [];
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    currentWeek.push(new Date(date));
    
    if (currentWeek.length === 7) {
      weeks.push([...currentWeek]);
      currentWeek.length = 0;
    }
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  return (
    <div className="premium-glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-capella-text">
          {monthNames[month]} {year}
        </h3>
        <div className="flex space-x-1">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            data-testid="button-prev-month"
          >
            <ChevronLeft className="w-4 h-4 text-capella-dark-teal" />
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            data-testid="button-next-month"
          >
            <ChevronRight className="w-4 h-4 text-capella-dark-teal" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {/* Day headers */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="font-semibold text-capella-dark-teal p-2 text-xs">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {weeks.map((week, weekIndex) =>
          week.map((date, dayIndex) => (
            <button
              key={`${weekIndex}-${dayIndex}`}
              className={`
                p-2 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium
                ${!isCurrentMonth(date) ? 'text-gray-400 opacity-50' : 'text-capella-text hover:bg-white/20'}
                ${
                  isToday(date) 
                    ? 'calendar-today text-white font-bold shadow-lg transform scale-105' 
                    : ''
                }
              `}
              data-testid={`calendar-day-${date.getDate()}`}
            >
              {date.getDate()}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
