import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { employees, activeEmployees, onLeaveEmployees, consultants, payrollSummary, departmentHeadcount, formatCurrency } from '@/data/hrData';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

const PIE_COLORS = ['#1e3a5f', '#dc2626', '#22c55e', '#f59e0b'];

const statutoryData = [
  { name: 'PAYE', value: payrollSummary.paye, pct: Math.round(payrollSummary.paye / payrollSummary.totalStatutory * 100) },
  { name: 'SHIF', value: payrollSummary.shif, pct: Math.round(payrollSummary.shif / payrollSummary.totalStatutory * 100) },
  { name: 'NSSF', value: payrollSummary.nssf, pct: Math.round(payrollSummary.nssf / payrollSummary.totalStatutory * 100) },
  { name: 'Housing', value: payrollSummary.housing, pct: Math.round(payrollSummary.housing / payrollSummary.totalStatutory * 100) },
];

const alerts = [
  { type: 'URGENT' as const, message: 'April 2026 payroll has not been processed yet', link: '/payroll' },
  { type: 'INFO' as const, message: 'KRA P10 filing deadline: 9th May 2026', link: '/statutory' },
  { type: 'INFO' as const, message: `${Math.round(employees.length * 0.0024)} employees have pending contract renewals`, link: '/employees' },
  { type: 'INFO' as const, message: 'SHIF remittance due by 9th May 2026', link: '/statutory' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { hasAccess } = useAuth();

  return (
    <div className="space-y-6">
      <ProcessGuide
        title="How the Dashboard Works"
        steps={[
          { step: 1, title: 'Overview Metrics', description: 'Shows real-time company statistics including headcount, payroll, and statutory obligations.', role: 'All roles' },
          { step: 2, title: 'Quick Actions', description: 'Navigate directly to key modules like payroll processing, employee directory, and reports.', role: 'Admin / HR' },
          { step: 3, title: 'Alerts & Notifications', description: 'Urgent deadlines and pending tasks are displayed here for immediate action.', role: 'Admin / HR' },
          { step: 4, title: 'Department Analytics', description: 'Headcount distribution and statutory breakdowns help with workforce planning.', role: 'Admin / HR / HOD' },
        ]}
        tips={['Check alerts daily for upcoming deadlines', 'Click on stat cards to navigate to the relevant module']}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card" onClick={() => navigate('/employees')}>
          <div>
            <div className="stat-label">Total Employees</div>
            <div className="stat-value">{employees.length.toLocaleString()}</div>
            <div className="stat-sub">{activeEmployees.length.toLocaleString()} active · {onLeaveEmployees.length} on leave</div>
          </div>
          <Users className="w-5 h-5 text-muted-foreground" />
        </div>
        {hasAccess(['admin', 'hr']) && (
          <>
            <div className="stat-card" onClick={() => navigate('/payroll')}>
              <div>
                <div className="stat-label">Monthly Gross Payroll</div>
                <div className="stat-value">{formatCurrency(payrollSummary.totalGross)}</div>
                <div className="stat-sub">Net: {formatCurrency(Math.round(payrollSummary.totalNet))}</div>
              </div>
              <DollarSign className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="stat-card" onClick={() => navigate('/statutory')}>
              <div>
                <div className="stat-label">Statutory Obligations</div>
                <div className="stat-value">{formatCurrency(Math.round(payrollSummary.totalStatutory))}</div>
                <div className="stat-sub">PAYE + SHIF + NSSF + Housing</div>
              </div>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
          </>
        )}
        <div className="stat-card" onClick={() => navigate('/employees?type=consultant')}>
          <div>
            <div className="stat-label">Consultants</div>
            <div className="stat-value">{consultants.length}</div>
            <div className="stat-sub">5% WHT applicable</div>
          </div>
          <AlertTriangle className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      {/* Quick actions */}
      {hasAccess(['admin', 'hr']) && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => navigate('/payroll')} className="crud-btn-primary flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Run Payroll
          </button>
          <button onClick={() => navigate('/employees')} className="crud-btn-secondary flex items-center gap-1">
            <Users className="w-3 h-3" /> View Directory
          </button>
          <button onClick={() => navigate('/statutory')} className="crud-btn-secondary">Statutory Reports</button>
          <button onClick={() => navigate('/kpis')} className="crud-btn-secondary flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> KPI Dashboard
          </button>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-lg border p-5">
          <h3 className="font-bold mb-4">Headcount by Department</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={departmentHeadcount}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(217, 55%, 18%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {hasAccess(['admin', 'hr']) && (
          <div className="bg-card rounded-lg border p-5">
            <h3 className="font-bold mb-4">Statutory Obligations Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statutoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, pct }) => `${name} ${pct}%`}>
                  {statutoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(Math.round(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Alerts */}
      <div className="bg-card rounded-lg border p-5">
        <h3 className="font-bold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-warning" /> Alerts & Notifications</h3>
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 cursor-pointer" onClick={() => navigate(a.link)}>
              <div className="flex items-center gap-3">
                <span className={a.type === 'URGENT' ? 'badge-rejected' : 'badge-info'}>{a.type}</span>
                <span className="text-sm">{a.message}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
