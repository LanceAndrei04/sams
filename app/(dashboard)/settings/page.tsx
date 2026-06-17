// Settings page - placeholder for testing navigation
// This is a blank page as requested for UI testing

import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-100 dark:bg-slate-900/30 rounded-lg">
            <Settings className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Settings</h2>
            <p className="text-muted-foreground">
              System configuration and preferences
            </p>
          </div>
        </div>
      </div>
      
      {/* Placeholder content for testing UI */}
      <div className="p-8 border-2 border-dashed border-border rounded-xl text-center">
        <div className="text-4xl mb-4">⚙️</div>
        <h3 className="text-lg font-medium text-foreground mb-2">System Settings</h3>
        <p className="text-muted-foreground">
          This is a placeholder page for testing the settings navigation.
          <br />
          No functional content has been added as requested.
        </p>
      </div>
      
      {/* Placeholder settings cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "School Year Management", description: "Configure active and historical school years" },
          { title: "User Accounts", description: "Manage administrator access and permissions" },
          { title: "System Preferences", description: "Customize interface and behavior settings" },
          { title: "Data Backup & Export", description: "Schedule backups and export records" },
        ].map((setting, index) => (
          <div
            key={index}
            className="p-6 border border-border rounded-lg bg-card space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-foreground">{setting.title}</h3>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="h-8 bg-muted rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}