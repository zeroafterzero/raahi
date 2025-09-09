import SettingsModal from "./SettingsModal";

export default function TopBar() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-capella-text">Focus Mode</h1>
          <p className="text-sm text-gray-600">Capella Pro</p>
        </div>
        <SettingsModal />
      </div>
    </header>
  );
}
