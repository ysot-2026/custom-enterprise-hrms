import { useState } from 'react';
import { leaveRequests as initialLeaves, type LeaveRequest } from '@/data/hrData';
import { CheckCircle, XCircle, Plus, X, Calendar, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

export default function LeaveManagement() {
  const { hasAccess, user } = useAuth();
  const [tab, setTab] = useState<'requests' | 'balances'>('requests');
  const [requests, setRequests] = useState<LeaveRequest[]>(initialLeaves);
  const [showNew, setShowNew] = useState(false);
  const [newReq, setNewReq] = useState({ employeeName: '', department: '', leaveType: 'Annual Leave', startDate: '', endDate: '', days: 0, reason: '' });

  const pending = requests.filter(r => r.status === 'pending');
  const approved = requests.filter(r => r.status === 'approved');

  const approveRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
    toast.success('Leave request approved');
  };
  const rejectRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
    toast.success('Leave request rejected');
  };
  const deleteRequest = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    toast.success('Leave request deleted');
  };
  const addRequest = () => {
    if (!newReq.employeeName || !newReq.startDate || !newReq.endDate) { toast.error('Fill all required fields'); return; }
    const id = `LV-${String(requests.length + 1).padStart(3, '0')}`;
    setRequests(prev => [...prev, { id, employeeId: `PAR-NEW`, ...newReq, status: 'pending' as const }]);
    setShowNew(false);
    toast.success('Leave request submitted');
  };

  const tabs = ['requests', 'balances'] as const;

  return (
    <div className="space-y-4">
      <ProcessGuide
        title="How Leave Management Works — 5-Step Approval Flow"
        steps={[
          { step: 1, title: 'Employee Submits Request', description: 'Employee fills in leave type, dates, reason, and designates a reliever. The request enters "Submitted" status.', role: 'Employee' },
          { step: 2, title: 'Supervisor Approves', description: 'Direct supervisor reviews the request, checks team capacity, and approves or rejects. Status moves to "Supervisor Approved".', role: 'Supervisor' },
          { step: 3, title: 'HR Head Reviews', description: 'HR Head checks leave balance, policy compliance, and approves. Status moves to "HR Head Approved".', role: 'HR Head' },
          { step: 4, title: 'HRBP Final Review', description: 'HR Business Partner does final review for business impact and compliance. Status moves to "HRBP Reviewed".', role: 'HRBP' },
          { step: 5, title: 'Leave Activated', description: 'Leave is now active. Employee is marked as "On Leave" in the system. Leave balance is deducted. Leave allowance processed if applicable.', role: 'System / HR' },
        ]}
        tips={[
          'After approval, the reliever must accept handover before leave starts',
          'Leave recall can be initiated by the supervisor for urgent business needs',
          'Annual leave schedules should be planned at the start of the year per department',
          'Sick leave beyond 3 days requires a medical certificate',
          'Maternity/Paternity leave follows Kenyan Employment Act guidelines',
        ]}
      />

      <div className="flex gap-2 flex-wrap items-center">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {t === 'requests' ? 'Leave Requests' : 'Leave Balances'}
          </button>
        ))}
        <button onClick={() => setShowNew(true)} className="crud-btn-primary flex items-center gap-1 ml-auto">
          <Plus className="w-3 h-3" /> New Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-card border text-center">
          <div className="text-xl font-bold">{requests.length}</div>
          <div className="text-xs text-muted-foreground">Total Requests</div>
        </div>
        <div className="p-3 rounded-lg bg-card border text-center">
          <div className="text-xl font-bold text-warning">{pending.length}</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>
        <div className="p-3 rounded-lg bg-card border text-center">
          <div className="text-xl font-bold text-success">{approved.length}</div>
          <div className="text-xs text-muted-foreground">Approved</div>
        </div>
        <div className="p-3 rounded-lg bg-card border text-center">
          <div className="text-xl font-bold">{approved.filter(r => r.startDate <= '2026-04-08' && r.endDate >= '2026-04-08').length}</div>
          <div className="text-xs text-muted-foreground">On Leave Today</div>
        </div>
      </div>

      {tab === 'requests' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Employee</th><th>Department</th><th>Type</th><th>Dates</th><th>Days</th><th>Status</th>
                {hasAccess(['admin', 'hr', 'supervisor', 'hrbp']) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td className="font-mono text-xs">{r.id}</td>
                  <td className="font-medium">{r.employeeName}</td>
                  <td>{r.department}</td>
                  <td>{r.leaveType}</td>
                  <td className="text-xs">{r.startDate} → {r.endDate}</td>
                  <td>{r.days}</td>
                  <td><span className={r.status === 'approved' ? 'badge-active' : r.status === 'pending' ? 'badge-pending' : 'badge-rejected'}>{r.status}</span></td>
                  {hasAccess(['admin', 'hr', 'supervisor', 'hrbp']) && (
                    <td>
                      <div className="flex gap-1">
                        {r.status === 'pending' && (
                          <>
                            <button onClick={() => approveRequest(r.id)} className="p-1 hover:bg-success/10 rounded text-success"><CheckCircle className="w-3.5 h-3.5" /></button>
                            <button onClick={() => rejectRequest(r.id)} className="p-1 hover:bg-destructive/10 rounded text-destructive"><XCircle className="w-3.5 h-3.5" /></button>
                          </>
                        )}
                        {hasAccess(['admin', 'hr']) && <button onClick={() => deleteRequest(r.id)} className="p-1 hover:bg-destructive/10 rounded text-destructive"><X className="w-3.5 h-3.5" /></button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'balances' && (
        <div className="bg-card rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">Leave balance tracking per employee — showing entitlement, taken, pending, and available days for each leave type.</p>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {['Annual Leave: 21 days entitlement', 'Sick Leave: 10 days', 'Maternity: 90 days', 'Paternity: 14 days', 'Compassionate: 5 days', 'Study Leave: 10 days'].map((t, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted text-sm">{t}</div>
            ))}
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">New Leave Request</h3>
              <button onClick={() => setShowNew(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div className="form-field"><label className="form-label">Employee Name</label><input className="form-input" value={newReq.employeeName} onChange={e => setNewReq(r => ({ ...r, employeeName: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Department</label><input className="form-input" value={newReq.department} onChange={e => setNewReq(r => ({ ...r, department: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Leave Type</label>
                <select className="form-select" value={newReq.leaveType} onChange={e => setNewReq(r => ({ ...r, leaveType: e.target.value }))}>
                  {['Annual Leave', 'Sick Leave', 'Maternity Leave', 'Paternity Leave', 'Compassionate Leave', 'Study Leave'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-field"><label className="form-label">Start Date</label><input className="form-input" type="date" value={newReq.startDate} onChange={e => setNewReq(r => ({ ...r, startDate: e.target.value }))} /></div>
                <div className="form-field"><label className="form-label">End Date</label><input className="form-input" type="date" value={newReq.endDate} onChange={e => setNewReq(r => ({ ...r, endDate: e.target.value }))} /></div>
              </div>
              <div className="form-field"><label className="form-label">Days</label><input className="form-input" type="number" value={newReq.days} onChange={e => setNewReq(r => ({ ...r, days: Number(e.target.value) }))} /></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addRequest} className="crud-btn-primary flex-1">Submit Request</button>
              <button onClick={() => setShowNew(false)} className="crud-btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
