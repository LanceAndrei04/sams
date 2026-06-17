// Navigation configuration for SAMS
// Centralized navigation config for sidebar and header

import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Package,
  Settings,
  UserCircle,
  Bell,
  HelpCircle,
} from "lucide-react";

export type NavItem = {
  label: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
};

export const mainNavItems: NavItem[] = [
  {
    label: "Dashboard",
    route: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview and quick actions",
  },
  {
    label: "Students",
    route: "/students",
    icon: GraduationCap,
    description: "Student roster and management",
  },
  {
    label: "Teachers",
    route: "/teachers",
    icon: Users,
    description: "Teacher directory and information",
  },
  {
    label: "Inventory",
    route: "/inventory",
    icon: Package,
    description: "School assets and materials",
  },
  {
    label: "Settings",
    route: "/settings",
    icon: Settings,
    description: "System configuration",
  },
];

export const headerNavItems = {
  notifications: {
    icon: Bell,
    label: "Notifications",
  },
  help: {
    icon: HelpCircle,
    label: "Help",
  },
  profile: {
    icon: UserCircle,
    label: "Profile",
  },
};

// School year data (mock for now)
export const currentSchoolYear = {
  label: "2025-2026",
  status: "active" as const,
  startDate: "June 2025",
  endDate: "March 2026",
};

export const schoolYears = [
  { label: "2025-2026", status: "active" as const },
  { label: "2024-2025", status: "archived" as const },
  { label: "2023-2024", status: "archived" as const },
];