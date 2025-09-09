import TopBar from "@/components/focus/TopBar";
import AnalogClock from "@/components/focus/AnalogClock";
import DigitalTimeGreeting from "@/components/focus/DigitalTimeGreeting";
import MiniCalendar from "@/components/focus/MiniCalendar";
import MusicPlayer from "@/components/focus/MusicPlayer";
import ProgressRing from "@/components/focus/ProgressRing";
import Controls from "@/components/focus/Controls";
import StatsPanel from "@/components/focus/StatsPanel";
import GraphCard from "@/components/focus/GraphCard";
import ReportsCard from "@/components/focus/ReportsCard";

export default function FocusMode() {
  return (
    <div className="bg-capella-bg text-capella-text font-sans min-h-screen w-full">
      <TopBar />
      
      <main className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Block 1: Two Boxes Side by Side - Fully Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Box 1: Clock, Time, Greeting + Calendar + Music */}
          <div className="premium-glass rounded-2xl p-4 sm:p-6 h-fit">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left side: Clock, Time, Greeting */}
              <div className="space-y-4 flex flex-col items-center lg:items-start">
                <AnalogClock />
                <DigitalTimeGreeting />
              </div>
              {/* Right side: Mini Calendar */}
              <div className="flex flex-col space-y-4">
                <MiniCalendar />
                <MusicPlayer />
              </div>
            </div>
          </div>

          {/* Box 2: Progress Ring & Controls */}
          <div className="premium-glass rounded-2xl p-4 sm:p-6 h-fit">
            <div className="space-y-4 sm:space-y-6">
              <ProgressRing />
              <Controls />
            </div>
          </div>
        </div>

        {/* Block 2: Full Width Stats and Reports - Fully Responsive */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          <StatsPanel />
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <GraphCard />
            <ReportsCard />
          </div>
        </div>
      </main>
    </div>
  );
}
