import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'hr' | 'supervisor' | 'hrbp' | 'hod' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  hasAccess: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const demoUsers: User[] = [
  { id: 'U001', name: 'System Admin', email: 'admin@parapet.co.ke', role: 'admin', department: 'IT' },
  { id: 'U002', name: 'Jane Wanjiku', email: 'hr@parapet.co.ke', role: 'hr', department: 'Human Resources' },
  { id: 'U003', name: 'James Otieno', email: 'supervisor@parapet.co.ke', role: 'supervisor', department: 'Engineering' },
  { id: 'U004', name: 'Sarah Wambui', email: 'hrbp@parapet.co.ke', role: 'hrbp', department: 'Human Resources' },
  { id: 'U005', name: 'John Maina', email: 'hod@parapet.co.ke', role: 'hod', department: 'Finance' },
  { id: 'U006', name: 'Grace Muthoni', email: 'employee@parapet.co.ke', role: 'employee', department: 'Engineering' },
];

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  hr: 'HR Manager',
  supervisor: 'Supervisor',
  hrbp: 'HR Business Partner',
  hod: 'Head of Department',
  employee: 'Employee',
};

export const roleColors: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-700',
  hr: 'bg-blue-100 text-blue-700',
  supervisor: 'bg-amber-100 text-amber-700',
  hrbp: 'bg-purple-100 text-purple-700',
  hod: 'bg-emerald-100 text-emerald-700',
  employee: 'bg-slate-100 text-slate-700',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (u: User) => setUser(u);
  const logout = () => setUser(null);
  const hasAccess = (allowedRoles: UserRole[]) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
