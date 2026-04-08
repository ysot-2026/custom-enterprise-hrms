import { useState } from 'react';
import { useAuth, demoUsers, roleLabels, roleColors, type UserRole } from '@/contexts/AuthContext';
import logo from '@/assets/parapet-logo.png';

const roleOrder: UserRole[] = ['admin', 'hr', 'supervisor', 'hrbp', 'hod', 'employee'];

export default function LoginPage() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const selectedUser = demoUsers.find(u => u.role === selectedRole)!;

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(var(--primary))' }}>
      <div className="bg-card rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Parapet HRMS" className="h-16 mb-3" />
          <h1 className="text-xl font-bold text-foreground">Parapet HRMS</h1>
          <p className="text-sm text-muted-foreground">Human Resource Management System</p>
        </div>

        <div className="mb-6">
          <label className="form-label mb-2 block">Select Role to Login</label>
          <div className="flex flex-wrap gap-2">
            {roleOrder.map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedRole === role
                    ? 'ring-2 ring-ring shadow-md scale-105'
                    : 'opacity-70 hover:opacity-100'
                } ${roleColors[role]}`}
              >
                {roleLabels[role]}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4 mb-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Name</span>
            <span className="text-sm font-medium">{selectedUser.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Email</span>
            <span className="text-sm">{selectedUser.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Role</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[selectedUser.role]}`}>
              {roleLabels[selectedUser.role]}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Department</span>
            <span className="text-sm">{selectedUser.department}</span>
          </div>
        </div>

        <button
          onClick={() => login(selectedUser)}
          className="w-full py-3 rounded-lg text-sm font-semibold transition-colors"
          style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
        >
          Login as {roleLabels[selectedUser.role]}
        </button>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Demo system — select a role tab above to see different views
        </p>
      </div>
    </div>
  );
}
