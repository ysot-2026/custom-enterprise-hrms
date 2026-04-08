import { useState } from 'react';
import { attendanceRecords, type AttendanceRecord } from '@/data/hrData';
import { Clock, Users, AlertTriangle, CheckCircle, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

export default function Attendance() {
  const { hasAccess } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>(attendanceRecords);
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState({ employeeId: '', employeeName: '', department: '', clockIn: '', clockOut: '', status: 'Present' as AttendanceRecord['status'] });

  const present = records.filter(r => r.status === 'Present').length;
  const late = records.filter(r => r.status === 'Late').length;
  const absent = records.filter(r => r.status === 'Absent').length;

  const handleSave = () => {
    if (!formData.employeeName) { toast.error('Employee name required'); return; }
    const hrs = formData.clockIn && formData.clockOut ? Math.round((parseInt(formData.clockOut.split(':')[0]) - parseInt(formData.clockIn.split(':')[0])) * 10) / 10 : null;
    const rec: AttendanceRecord = { ...formData, hours: hrs, overtime: hrs && hrs > 8 ? Math.round((hrs - 8) * 10) / 10 : null };
    if (editIdx !== null) {
      setRecords(prev => prev.map((r, i) => i === editIdx ? rec : r));
      toast.success('Record updated');
    } else {
      setRecords(prev => [...prev, rec]);
      toast.success('Record added');
    }
    setShowForm(false);
    setEditIdx(null);
  };

  const handleDelete = (idx: number) => {
    setRecords(prev => prev.filter((_, i) => i !== idx));
    toast.success('Record removed');
  };

  const openEdit = (idx: number) => {
    const r = records[idx];
    setFormData({ employeeId: r.employeeId, employeeName: r.employeeName, department: r.department, clockIn: r.clockIn || '', clockOut: r.clockOut || '', status: r.status });
    setEditIdx(idx);
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <ProcessGuide
        title="How Attendance & Time Tracking Works"
        steps={[
          { step: 1, title: 'Biometric Enrollment', description: 'New employees are enrolled via fingerprint, facial recognition, or card at their work location.', role: 'HR / IT Admin' },
          { step: 2, title: 'Daily Clock In/Out', description: 'Employees clock in and out using biometric devices or mobile app. The system records timestamps automatically.', role: 'Employee' },
          { step: 3, title: 'Policy Enforcement', description: 'System checks attendance against shift policies — flags late arrivals, early departures, and unauthorized absences.', role: 'System' },
          { step: 4, title: 'Overtime Calculation', description: 'Hours beyond standard shift are calculated as overtime. Rates depend on the applicable policy (1.5x or 2.0x).', role: 'System / Supervisor' },
          { step: 5, title: 'Monthly Reports', description: 'Attendance summary reports are generated per employee and department for payroll integration.', role: 'HR / Payroll' },
        ]}
        tips={['Grace period of 15 minutes applies to standard day shift', 'Remote workers track time via the mobile app', '3 late arrivals in a month trigger a policy violation flag']}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold">{records.length}</div><div className="text-xs text-muted-foreground">Total Records</div></div>
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold text-success">{present}</div><div className="text-xs text-muted-foreground">Present</div></div>
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold text-warning">{late}</div><div className="text-xs text-muted-foreground">Late</div></div>
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold text-destructive">{absent}</div><div className="text-xs text-muted-foreground">Absent</div></div>
      </div>

      {hasAccess(['admin', 'hr']) && (
        <button onClick={() => { setFormData({ employeeId: '', employeeName: '', department: '', clockIn: '', clockOut: '', status: 'Present' }); setEditIdx(null); setShowForm(true); }} className="crud-btn-primary flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add Record
        </button>
      )}

      <div className="bg-card rounded-lg border overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>Employee</th><th>Department</th><th>Clock In</th><th>Clock Out</th><th>Hours</th><th>OT</th><th>Status</th>
              {hasAccess(['admin', 'hr']) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td className="font-medium">{r.employeeName}</td>
                <td>{r.department}</td>
                <td>{r.clockIn || '—'}</td>
                <td>{r.clockOut || '—'}</td>
                <td>{r.hours ?? '—'}</td>
                <td>{r.overtime ?? '—'}</td>
                <td><span className={r.status === 'Present' ? 'badge-active' : r.status === 'Late' ? 'badge-pending' : r.status === 'Absent' ? 'badge-rejected' : 'badge-info'}>{r.status}</span></td>
                {hasAccess(['admin', 'hr']) && (
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(i)} className="p-1 hover:bg-muted rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(i)} className="p-1 hover:bg-destructive/10 rounded text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">{editIdx !== null ? 'Edit Record' : 'Add Attendance Record'}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div className="form-field"><label className="form-label">Employee Name</label><input className="form-input" value={formData.employeeName} onChange={e => setFormData(f => ({ ...f, employeeName: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Department</label><input className="form-input" value={formData.department} onChange={e => setFormData(f => ({ ...f, department: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-field"><label className="form-label">Clock In</label><input className="form-input" type="time" value={formData.clockIn} onChange={e => setFormData(f => ({ ...f, clockIn: e.target.value }))} /></div>
                <div className="form-field"><label className="form-label">Clock Out</label><input className="form-input" type="time" value={formData.clockOut} onChange={e => setFormData(f => ({ ...f, clockOut: e.target.value }))} /></div>
              </div>
              <div className="form-field"><label className="form-label">Status</label>
                <select className="form-select" value={formData.status} onChange={e => setFormData(f => ({ ...f, status: e.target.value as AttendanceRecord['status'] }))}>
                  {['Present', 'Late', 'Absent', 'Half Day'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSave} className="crud-btn-primary flex-1">Save</button>
              <button onClick={() => setShowForm(false)} className="crud-btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
