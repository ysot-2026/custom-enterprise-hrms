import ProcessGuide from '@/components/ProcessGuide';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <ProcessGuide title="How Settings Work" steps={[
        { step: 1, title: 'System Configuration', description: 'Configure company details, payroll parameters, leave policies, and system preferences.', role: 'Admin' },
        { step: 2, title: 'User Management', description: 'Manage user accounts, assign roles, and set permissions.', role: 'Admin' },
        { step: 3, title: 'Audit Logs', description: 'View system activity logs for security and compliance tracking.', role: 'Admin' },
      ]} tips={['Only administrators can access system settings', 'Changes to payroll parameters take effect in the next pay cycle']} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Company Profile', desc: 'Company name, address, KRA PIN, registration details' },
          { title: 'Payroll Settings', desc: 'Tax tables, SHIF rates, NSSF tiers, payment schedules' },
          { title: 'Leave Policies', desc: 'Leave types, entitlements, carry-over rules, approval chains' },
          { title: 'User Roles & Permissions', desc: 'Role definitions, access controls, module permissions' },
          { title: 'Notification Settings', desc: 'Email templates, SMS alerts, system notifications' },
          { title: 'Data & Backup', desc: 'Database backups, data export, system maintenance' },
        ].map((item, i) => (
          <div key={i} className="bg-card rounded-lg border p-5 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="font-bold mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
