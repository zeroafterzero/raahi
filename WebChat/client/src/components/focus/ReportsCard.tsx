import { useState } from "react";
import { Download, FileText, Mail } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { usePomodoroSettings } from "./SettingsModal";

export default function ReportsCard() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const settings = usePomodoroSettings();

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    
    try {
      const response = await apiRequest('POST', '/api/focus/export', {
        format,
        userId: 'default-user',
        range: 'month'
      });

      if (format === 'csv') {
        // Create blob and download for CSV
        const blob = new Blob([await response.text()], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'focus-sessions.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Handle PDF download
        const data = await response.json();
        const blob = new Blob([atob(data.content)], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      toast({
        title: "Export successful",
        description: `Your ${format.toUpperCase()} report has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to generate the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="premium-glass rounded-2xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Reports & Export</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium">Email Weekly Summary</div>
              <div className="text-sm text-gray-600">Get insights delivered every Monday</div>
            </div>
          </div>
          <div className="text-sm">
            Status: <span className={`font-semibold ${settings.emailWeeklySummary ? 'text-capella-dark-teal' : 'text-gray-500'}`}>
              {settings.emailWeeklySummary ? 'Enabled' : 'Disabled'}
            </span>
            <div className="text-xs text-gray-500 mt-1">
              Configure in Settings
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            className="py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            data-testid="button-export-csv"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button 
            className="py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            data-testid="button-export-pdf"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>

        <div className="text-sm text-gray-500 pt-2 border-t border-gray-200">
          <div className="flex justify-between">
            <span>Last export:</span>
            <span data-testid="text-last-export">Dec 10, 2024</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Data range:</span>
            <span data-testid="text-data-range">Last 30 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
