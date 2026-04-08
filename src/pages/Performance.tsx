import { useState } from 'react';
import { performanceReviews, type PerformanceReview } from '@/data/hrData';
import { Star, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

export default function Performance() {
  const { hasAccess } = useAuth();
  const [reviews, setReviews] = useState<PerformanceReview[]>(performanceReviews);
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState({ employeeName: '', department: '', reviewer: '', goalsCompleted: 0, goalsTotal: 0, rating: null as number | null, status: 'scheduled' as PerformanceReview['status'] });

  const completed = reviews.filter(r => r.status === 'completed');
  const avgRating = completed.filter(r => r.rating).reduce((s, r) => s + (r.rating || 0), 0) / (completed.filter(r => r.rating).length || 1);

  const handleSave = () => {
    if (!formData.employeeName) { toast.error('Employee name required'); return; }
    if (editIdx !== null) {
      setReviews(prev => prev.map((r, i) => i === editIdx ? formData : r));
      toast.success('Review updated');
    } else {
      setReviews(prev => [...prev, formData]);
      toast.success('Review added');
    }
    setShowForm(false);
    setEditIdx(null);
  };

  return (
    <div className="space-y-4">
      <ProcessGuide
        title="How Performance Management Works — 10-Stage Appraisal Cycle"
        steps={[
          { step: 1, title: 'Targets Set', description: 'At the start of the review cycle, employee and manager agree on performance targets aligned to department and company goals.', role: 'Employee / Manager' },
          { step: 2, title: 'Tracking & Monitoring', description: 'Throughout the quarter, progress against targets is tracked. Manager monitors via dashboards.', role: 'Employee / Manager' },
          { step: 3, title: 'Mid-Cycle Check-in', description: 'Manager and employee have a formal check-in to discuss progress, blockers, and adjust targets if needed.', role: 'Manager / Employee' },
          { step: 4, title: 'Appraisal Form Issued', description: 'HR issues the appraisal form to the employee for self-assessment at cycle end.', role: 'HR' },
          { step: 5, title: 'Self-Assessment', description: 'Employee completes self-assessment rating and comments on each goal.', role: 'Employee' },
          { step: 6, title: 'Manager Evaluation', description: 'Direct manager evaluates the employee performance and provides ratings and feedback.', role: 'Manager / Supervisor' },
          { step: 7, title: 'HOD Approval', description: 'Head of Department reviews and approves the final ratings for consistency.', role: 'HOD' },
          { step: 8, title: 'HR Processing', description: 'HR processes the appraisal — calculates final ratings and prepares recommendations.', role: 'HR' },
          { step: 9, title: 'Results Presented', description: 'Appraisal results are presented to the employee with clear feedback.', role: 'Manager / HR' },
          { step: 10, title: 'Decision Made', description: 'Final decision: salary increment, promotion, training plan, or Performance Improvement Plan (PIP).', role: 'HR / Management' },
        ]}
        tips={['Decisions include: Reward (salary increase), Promotion, Training enrollment, or PIP', 'PIPs run for 90 days with bi-weekly reviews', 'Ratings: 1-2 = Below, 3 = Meets, 4-5 = Exceeds expectations']}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold">{reviews.length}</div><div className="text-xs text-muted-foreground">Total Reviews</div></div>
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold text-success">{completed.length}</div><div className="text-xs text-muted-foreground">Completed</div></div>
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold">{reviews.filter(r => r.status === 'in_progress').length}</div><div className="text-xs text-muted-foreground">In Progress</div></div>
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold">{avgRating.toFixed(1)}</div><div className="text-xs text-muted-foreground">Avg Rating</div></div>
      </div>

      {hasAccess(['admin', 'hr', 'supervisor', 'hod']) && (
        <button onClick={() => { setFormData({ employeeName: '', department: '', reviewer: '', goalsCompleted: 0, goalsTotal: 0, rating: null, status: 'scheduled' }); setEditIdx(null); setShowForm(true); }} className="crud-btn-primary flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add Review
        </button>
      )}

      <div className="bg-card rounded-lg border overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Employee</th><th>Department</th><th>Reviewer</th><th>Goals</th><th>Rating</th><th>Status</th>
            {hasAccess(['admin', 'hr']) && <th>Actions</th>}
          </tr></thead>
          <tbody>
            {reviews.map((r, i) => (
              <tr key={i}>
                <td className="font-medium">{r.employeeName}</td>
                <td>{r.department}</td>
                <td>{r.reviewer}</td>
                <td>{r.goalsCompleted}/{r.goalsTotal}</td>
                <td>{r.rating ? <span className="flex items-center gap-1"><Star className="w-3 h-3 text-warning fill-warning" /> {r.rating}</span> : '—'}</td>
                <td><span className={r.status === 'completed' ? 'badge-active' : r.status === 'in_progress' ? 'badge-pending' : 'badge-info'}>{r.status}</span></td>
                {hasAccess(['admin', 'hr']) && (
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => { setFormData(r); setEditIdx(i); setShowForm(true); }} className="p-1 hover:bg-muted rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { setReviews(prev => prev.filter((_, idx) => idx !== i)); toast.success('Deleted'); }} className="p-1 hover:bg-destructive/10 rounded text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
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
              <h3 className="font-bold">{editIdx !== null ? 'Edit Review' : 'Add Performance Review'}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div className="form-field"><label className="form-label">Employee</label><input className="form-input" value={formData.employeeName} onChange={e => setFormData(f => ({ ...f, employeeName: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Department</label><input className="form-input" value={formData.department} onChange={e => setFormData(f => ({ ...f, department: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Reviewer</label><input className="form-input" value={formData.reviewer} onChange={e => setFormData(f => ({ ...f, reviewer: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-field"><label className="form-label">Goals Completed</label><input className="form-input" type="number" value={formData.goalsCompleted} onChange={e => setFormData(f => ({ ...f, goalsCompleted: Number(e.target.value) }))} /></div>
                <div className="form-field"><label className="form-label">Goals Total</label><input className="form-input" type="number" value={formData.goalsTotal} onChange={e => setFormData(f => ({ ...f, goalsTotal: Number(e.target.value) }))} /></div>
              </div>
              <div className="form-field"><label className="form-label">Rating</label><input className="form-input" type="number" step="0.1" min="0" max="5" value={formData.rating ?? ''} onChange={e => setFormData(f => ({ ...f, rating: e.target.value ? Number(e.target.value) : null }))} /></div>
              <div className="form-field"><label className="form-label">Status</label>
                <select className="form-select" value={formData.status} onChange={e => setFormData(f => ({ ...f, status: e.target.value as PerformanceReview['status'] }))}>
                  {['scheduled', 'in_progress', 'completed'].map(s => <option key={s}>{s}</option>)}
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
