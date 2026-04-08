import { useState } from 'react';
import { expenseClaims, type ExpenseClaim, formatCurrency } from '@/data/hrData';
import { Plus, X, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

export default function Expenses() {
  const { hasAccess } = useAuth();
  const [claims, setClaims] = useState<ExpenseClaim[]>(expenseClaims);
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState({ employeeName: '', department: '', category: 'Travel', description: '', amount: 0, date: '', hasReceipt: true, status: 'pending' as ExpenseClaim['status'] });

  const handleSave = () => {
    if (!formData.employeeName) { toast.error('Required fields missing'); return; }
    const claim: ExpenseClaim = { ...formData, id: editIdx !== null ? claims[editIdx].id : `EXP-${String(claims.length + 1).padStart(3, '0')}` };
    if (editIdx !== null) { setClaims(prev => prev.map((c, i) => i === editIdx ? claim : c)); toast.success('Updated'); }
    else { setClaims(prev => [...prev, claim]); toast.success('Submitted'); }
    setShowForm(false); setEditIdx(null);
  };

  return (
    <div className="space-y-4">
      <ProcessGuide title="How Expense Management Works" steps={[
        { step: 1, title: 'Submit Claim', description: 'Employee submits expense claim with receipt, category, and description.', role: 'Employee' },
        { step: 2, title: 'Supervisor Review', description: 'Direct supervisor reviews and approves the claim.', role: 'Supervisor' },
        { step: 3, title: 'Finance Approval', description: 'Finance team verifies receipts and approves for reimbursement.', role: 'Finance' },
        { step: 4, title: 'Reimbursement', description: 'Approved claims are processed in the next payroll cycle or via petty cash.', role: 'Finance / Payroll' },
      ]} tips={['Always attach receipts for claims above Ksh 5,000', 'Entertainment claims require prior approval', 'Reimbursements are processed within 14 working days']} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold">{claims.length}</div><div className="text-xs text-muted-foreground">Total Claims</div></div>
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold text-warning">{claims.filter(c => c.status === 'pending').length}</div><div className="text-xs text-muted-foreground">Pending</div></div>
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold">{formatCurrency(claims.reduce((s, c) => s + c.amount, 0))}</div><div className="text-xs text-muted-foreground">Total Value</div></div>
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold text-success">{claims.filter(c => c.status === 'reimbursed').length}</div><div className="text-xs text-muted-foreground">Reimbursed</div></div>
      </div>

      <button onClick={() => { setFormData({ employeeName: '', department: '', category: 'Travel', description: '', amount: 0, date: new Date().toISOString().split('T')[0], hasReceipt: true, status: 'pending' }); setEditIdx(null); setShowForm(true); }} className="crud-btn-primary flex items-center gap-1"><Plus className="w-3 h-3" /> New Claim</button>

      <div className="bg-card rounded-lg border overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Employee</th><th>Category</th><th>Description</th><th>Amount</th><th>Receipt</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {claims.map((c, i) => (
              <tr key={c.id}>
                <td className="font-mono text-xs">{c.id}</td><td className="font-medium">{c.employeeName}</td><td>{c.category}</td><td className="max-w-[200px] truncate">{c.description}</td>
                <td>{formatCurrency(c.amount)}</td><td>{c.hasReceipt ? '✓' : '✗'}</td>
                <td><span className={c.status === 'approved' || c.status === 'reimbursed' ? 'badge-active' : c.status === 'pending' ? 'badge-pending' : 'badge-rejected'}>{c.status}</span></td>
                <td><div className="flex gap-1">
                  {c.status === 'pending' && hasAccess(['admin', 'hr', 'supervisor']) && (
                    <>
                      <button onClick={() => { setClaims(prev => prev.map((cl, idx) => idx === i ? { ...cl, status: 'approved' } : cl)); toast.success('Approved'); }} className="p-1 hover:bg-success/10 rounded text-success"><CheckCircle className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { setClaims(prev => prev.map((cl, idx) => idx === i ? { ...cl, status: 'rejected' } : cl)); toast.success('Rejected'); }} className="p-1 hover:bg-destructive/10 rounded text-destructive"><XCircle className="w-3.5 h-3.5" /></button>
                    </>
                  )}
                  {hasAccess(['admin', 'hr']) && <button onClick={() => { setClaims(prev => prev.filter((_, idx) => idx !== i)); toast.success('Deleted'); }} className="p-1 hover:bg-destructive/10 rounded text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold">{editIdx !== null ? 'Edit' : 'New'} Expense Claim</h3><button onClick={() => setShowForm(false)}><X className="w-4 h-4" /></button></div>
            <div className="space-y-3">
              <div className="form-field"><label className="form-label">Employee</label><input className="form-input" value={formData.employeeName} onChange={e => setFormData(f => ({ ...f, employeeName: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Department</label><input className="form-input" value={formData.department} onChange={e => setFormData(f => ({ ...f, department: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Category</label><select className="form-select" value={formData.category} onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}>{['Travel', 'Entertainment', 'Training', 'Transport', 'Office Supplies', 'Software'].map(c => <option key={c}>{c}</option>)}</select></div>
              <div className="form-field"><label className="form-label">Description</label><input className="form-input" value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Amount (Ksh)</label><input className="form-input" type="number" value={formData.amount} onChange={e => setFormData(f => ({ ...f, amount: Number(e.target.value) }))} /></div>
              <div className="form-field"><label className="form-label">Date</label><input className="form-input" type="date" value={formData.date} onChange={e => setFormData(f => ({ ...f, date: e.target.value }))} /></div>
            </div>
            <div className="flex gap-2 mt-4"><button onClick={handleSave} className="crud-btn-primary flex-1">Submit</button><button onClick={() => setShowForm(false)} className="crud-btn-secondary flex-1">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
