import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, DollarSign, Calendar, Clock, Target,
  Briefcase, Receipt, FileText, Megaphone, Upload, Settings, BarChart3, Menu, Bell, X, Truck, FolderOpen, LogOut
} from 'lucide-react';
import { useState } from 'react';
import logo from '@/assets/parapet-logo-white.png';
import { useAuth, roleLabels, roleColors, type UserRole } from '@/contexts/AuthContext';

interface MenuItem {
  to: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const mainMenu: MenuItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'hr', 'supervisor', 'hrbp', 'hod', 'employee'] },
  { to: '/employees', label: 'Employee Directory', icon: Users, roles: ['admin', 'hr', 'supervisor', 'hrbp', 'hod'] },
  { to: '/payroll', label: 'Payroll Processing', icon: DollarSign, roles: ['admin', 'hr'] },
  { to: '/leave', label: 'Leave Management', icon: Calendar, roles: ['admin', 'hr', 'supervisor', 'hrbp', 'hod', 'employee'] },
  { to: '/attendance', label: 'Attendance', icon: Clock, roles: ['admin', 'hr', 'supervisor', 'hrbp', 'hod', 'employee'] },
  { to: '/performance', label: 'Performance', icon: Target, roles: ['admin', 'hr', 'supervisor', 'hrbp', 'hod', 'employee'] },
  { to: '/kpis', label: 'KPI Management', icon: BarChart3, roles: ['admin', 'hr', 'hod'] },
  { to: '/recruitment', label: 'Recruitment', icon: Briefcase, roles: ['admin', 'hr', 'hod'] },
  { to: '/expenses', label: 'Expenses', icon: Receipt, roles: ['admin', 'hr', 'supervisor', 'hod', 'employee'] },
  { to: '/statutory', label: 'Statutory Reports', icon: FileText, roles: ['admin', 'hr'] },
  { to: '/announcements', label: 'Announcements', icon: Megaphone, roles: ['admin', 'hr', 'supervisor', 'hrbp', 'hod', 'employee'] },
  { to: '/fleet', label: 'Fleet Management', icon: Truck, roles: ['admin', 'hr', 'hod'] },
  { to: '/documents', label: 'Document Hub', icon: FolderOpen, roles: ['admin', 'hr', 'supervisor', 'hrbp', 'hod', 'employee'] },
  { to: '/upload', label: 'Bulk Upload', icon: Upload, roles: ['admin', 'hr'] },
];

const systemMenu: MenuItem[] = [
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout, hasAccess } = useAuth();

  const filteredMain = mainMenu.filter(item => hasAccess(item.roles));
  const filteredSystem = systemMenu.filter(item => hasAccess(item.roles));

  const SidebarContent = () => (
    <>
      <div className="p-4 mb-2">
        <img src={logo} alt="Parapet" className="h-10" />
      </div>
      <div className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'hsl(var(--sidebar-muted))' }}>
        Main Menu
      </div>
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {filteredMain.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      {filteredSystem.length > 0 && (
        <>
          <div className="px-4 mt-4 mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'hsl(var(--sidebar-muted))' }}>
            System
          </div>
          <nav className="px-2 space-y-0.5 mb-2">
            {filteredSystem.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </>
      )}
      <div className="px-4 py-3 text-xs" style={{ color: 'hsl(var(--sidebar-muted))' }}>
        Parapet HRMS v2.0 © 2026
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 overflow-y-auto" style={{ background: 'hsl(var(--sidebar-bg))' }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 flex flex-col overflow-y-auto" style={{ background: 'hsl(var(--sidebar-bg))' }}>
            <button onClick={() => setSidebarOpen(false)} className="absolute top-3 right-3 text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-4 lg:px-6 h-14 border-b bg-card flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-foreground">{getPageTitle(location.pathname)}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{getPageSubtitle(location.pathname)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-1.5 rounded-md hover:bg-muted">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' }}>3</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}>
                {user?.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </div>
              <span className={`hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${roleColors[user?.role || 'employee']}`}>
                {roleLabels[user?.role || 'employee']}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function getPageTitle(path: string): string {
  const map: Record<string, string> = {
    '/': 'Dashboard',
    '/employees': 'Employee Directory',
    '/payroll': 'Payroll Processing',
    '/leave': 'Leave Management',
    '/attendance': 'Attendance & Time Tracking',
    '/performance': 'Performance Management',
    '/kpis': 'KPI Management',
    '/recruitment': 'Recruitment',
    '/expenses': 'Expense Management',
    '/statutory': 'Statutory Reports',
    '/announcements': 'Announcements',
    '/fleet': 'Fleet Management',
    '/documents': 'Document Hub',
    '/upload': 'Bulk Upload',
    '/settings': 'Settings',
  };
  return map[path] || 'Parapet HRMS';
}

function getPageSubtitle(path: string): string {
  const map: Record<string, string> = {
    '/': 'April 2026 · Payroll Period Overview',
    '/employees': '5,000 employees',
    '/payroll': 'April 2026 Payroll Run',
    '/leave': 'Track and manage employee leave requests',
    '/attendance': 'Daily attendance records and overtime',
    '/performance': 'Q1 2026 Review Cycle',
    '/kpis': 'Create, track, and monitor key performance indicators',
    '/recruitment': 'Job postings, applicant tracking & hiring pipeline',
    '/expenses': 'Employee expense claims and reimbursements',
    '/statutory': 'Kenya Revenue Authority · SHIF · NSSF · Housing Levy',
    '/announcements': 'Company-wide announcements and updates',
    '/fleet': 'Company vehicles, assignments & maintenance tracking',
    '/documents': 'Central repository for company documents & policies',
    '/upload': 'Import employee data in bulk',
    '/settings': 'System configuration',
  };
  return map[path] || '';
}
