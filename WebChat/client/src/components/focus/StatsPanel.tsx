import { useQuery } from "@tanstack/react-query";
import type { FocusStats } from "@shared/schema";

export default function StatsPanel() {
  const { data: stats, isLoading } = useQuery<FocusStats>({
    queryKey: ['/api/focus/stats', { range: 'today' }],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">Today's Focus Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-capella-btn mb-2 animate-pulse bg-gray-200 h-8 w-16 mx-auto rounded"></div>
              <div className="text-sm text-gray-600 animate-pulse bg-gray-200 h-4 w-24 mx-auto rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="premium-glass rounded-2xl p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-6 text-capella-text">Today's Focus Stats</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-capella-dark-teal" data-testid="stat-today-minutes">
            {stats?.todayMinutes || 0}<span className="text-sm sm:text-base">m</span>
          </div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">Focus Time Today</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-capella-dark-teal" data-testid="stat-completed-cycles">
            {stats?.completedCycles || 0}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">Pomodoros Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-capella-dark-teal" data-testid="stat-current-streak">
            {stats?.currentStreak || 0}<span className="text-sm sm:text-base">d</span>
          </div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-capella-dark-teal" data-testid="stat-avg-session">
            {stats?.avgSession || 25}<span className="text-sm sm:text-base">m</span>
          </div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">Average Session</div>
        </div>
      </div>
    </div>
  );
}
