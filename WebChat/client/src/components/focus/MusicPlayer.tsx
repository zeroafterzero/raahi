import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  url: string;
}

const relaxationTracks: Track[] = [
  {
    id: 1,
    title: "Forest Sounds",
    artist: "Nature Sounds",
    duration: "10:00",
    url: "https://www.soundjay.com/misc/sounds/rain-01.mp3" // Mock URL
  },
  {
    id: 2,
    title: "Ocean Waves",
    artist: "Relaxation",
    duration: "8:45",
    url: "https://www.soundjay.com/misc/sounds/waves-01.mp3" // Mock URL
  },
  {
    id: 3,
    title: "Gentle Rain",
    artist: "Ambient",
    duration: "12:30",
    url: "https://www.soundjay.com/misc/sounds/rain-02.mp3" // Mock URL
  },
  {
    id: 4,
    title: "Piano Meditation",
    artist: "Calm Music",
    duration: "15:20",
    url: "https://www.soundjay.com/misc/sounds/piano-01.mp3" // Mock URL
  }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Since we're using mock URLs, we'll simulate audio behavior
    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            handleNext();
            return 0;
          }
          return newTime;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  useEffect(() => {
    // Set mock duration for current track
    const track = relaxationTracks[currentTrack];
    const [minutes, seconds] = track.duration.split(':');
    setDuration(parseInt(minutes) * 60 + parseInt(seconds));
    setCurrentTime(0);
  }, [currentTrack]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % relaxationTracks.length);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + relaxationTracks.length) % relaxationTracks.length);
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="premium-glass rounded-xl p-4 mt-4" data-testid="music-player">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
          <Volume2 className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-capella-text truncate" data-testid="current-track-title">
            {relaxationTracks[currentTrack].title}
          </h4>
          <p className="text-xs text-gray-600 truncate">
            {relaxationTracks[currentTrack].artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span data-testid="current-time">{formatTime(currentTime)}</span>
          <span data-testid="total-duration">{relaxationTracks[currentTrack].duration}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-capella-dark-teal h-1 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercentage}%` }}
            data-testid="progress-bar"
          ></div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            data-testid="button-previous-track"
          >
            <SkipBack className="w-4 h-4 text-capella-text" />
          </button>
          
          <button
            onClick={handlePlayPause}
            className="p-3 bg-capella-btn hover:bg-capella-btn/80 rounded-full transition-colors active-timer"
            data-testid="button-play-pause"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-capella-btn-text" />
            ) : (
              <Play className="w-5 h-5 text-capella-btn-text ml-0.5" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            data-testid="button-next-track"
          >
            <SkipForward className="w-4 h-4 text-capella-text" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-gray-500" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-16 h-1 bg-gray-200 rounded-lg appearance-none slider-thumb:appearance-none slider-thumb:w-3 slider-thumb:h-3 slider-thumb:rounded-full slider-thumb:bg-capella-dark-teal"
            data-testid="volume-slider"
          />
        </div>
      </div>
    </div>
  );
}