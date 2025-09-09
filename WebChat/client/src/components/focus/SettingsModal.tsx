import { useState, useEffect } from "react";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface PomodoroSettings {
  focusDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStart: boolean;
  soundNotifications: boolean;
  desktopNotifications: boolean;
  emailWeeklySummary: boolean;
}

const defaultSettings: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStart: false,
  soundNotifications: true,
  desktopNotifications: true,
  emailWeeklySummary: true,
};

const SETTINGS_KEY = 'capella_pomodoro_settings';

export default function SettingsModal() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Emit custom event so other components can react to settings changes
    window.dispatchEvent(new CustomEvent('pomodoroSettingsChanged', { detail: settings }));
  }, [settings]);

  const updateSetting = <K extends keyof PomodoroSettings>(key: K, value: PomodoroSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-gray-500 hover:text-capella-text transition-colors"
          data-testid="button-settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-capella-card">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-capella-text">
            <Settings className="w-5 h-5" />
            <span>Pomodoro Settings</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Duration Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-capella-text">Session Durations</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="focus-duration" className="text-sm">Focus (min)</Label>
                <Input
                  id="focus-duration"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.focusDuration}
                  onChange={(e) => updateSetting('focusDuration', parseInt(e.target.value) || 25)}
                  className="bg-white"
                  data-testid="input-focus-duration"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short-break-duration" className="text-sm">Short Break (min)</Label>
                <Input
                  id="short-break-duration"
                  type="number"
                  min="1"
                  max="30"
                  value={settings.shortBreakDuration}
                  onChange={(e) => updateSetting('shortBreakDuration', parseInt(e.target.value) || 5)}
                  className="bg-white"
                  data-testid="input-short-break-duration"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="long-break-duration" className="text-sm">Long Break (min)</Label>
                <Input
                  id="long-break-duration"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreakDuration}
                  onChange={(e) => updateSetting('longBreakDuration', parseInt(e.target.value) || 15)}
                  className="bg-white"
                  data-testid="input-long-break-duration"
                />
              </div>
            </div>
          </div>

          {/* Auto-start Setting */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Auto-start next session</Label>
              <p className="text-xs text-gray-500 mt-1">Automatically start the next session when current one ends</p>
            </div>
            <Switch
              checked={settings.autoStart}
              onCheckedChange={(checked) => updateSetting('autoStart', checked)}
              data-testid="toggle-auto-start"
            />
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-capella-text">Notifications</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Sound notifications</Label>
                <p className="text-xs text-gray-500 mt-1">Play sound when session ends</p>
              </div>
              <Switch
                checked={settings.soundNotifications}
                onCheckedChange={(checked) => updateSetting('soundNotifications', checked)}
                data-testid="toggle-sound-notifications"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Desktop notifications</Label>
                <p className="text-xs text-gray-500 mt-1">Show browser notifications when session ends</p>
              </div>
              <Switch
                checked={settings.desktopNotifications}
                onCheckedChange={(checked) => updateSetting('desktopNotifications', checked)}
                data-testid="toggle-desktop-notifications"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Email weekly summary</Label>
                <p className="text-xs text-gray-500 mt-1">Receive weekly focus reports via email</p>
              </div>
              <Switch
                checked={settings.emailWeeklySummary}
                onCheckedChange={(checked) => updateSetting('emailWeeklySummary', checked)}
                data-testid="toggle-email-summary"
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="w-full"
              data-testid="button-reset-defaults"
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook to use settings in other components
export function usePomodoroSettings() {
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    const handleSettingsChange = (e: CustomEvent<PomodoroSettings>) => {
      setSettings(e.detail);
    };

    window.addEventListener('pomodoroSettingsChanged', handleSettingsChange as EventListener);
    return () => window.removeEventListener('pomodoroSettingsChanged', handleSettingsChange as EventListener);
  }, []);

  return settings;
}