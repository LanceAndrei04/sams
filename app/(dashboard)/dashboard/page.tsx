// Dashboard page - placeholder for testing navigation
// This is a blank page as requested for UI testing

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to the School Admin Management System
          </p>
        </div>
      </div>
      
      {/* Placeholder content for testing UI */}
      <div className="grid gap-6">
        <div className="p-8 border-2 border-dashed border-border rounded-xl text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-foreground mb-2">Dashboard Content</h3>
          <p className="text-muted-foreground">
            This is a placeholder page for testing the dashboard navigation.
            <br />
            No functional content has been added as requested.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-6 border border-border rounded-lg bg-card"
            >
              <div className="text-2xl mb-2">
                {item === 1 ? "👥" : item === 2 ? "📚" : "🏫"}
              </div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}