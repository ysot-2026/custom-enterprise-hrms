import { useState } from 'react';
import { initialKpis, type KPI, formatCurrency } from '@/data/hrData';
import { Plus, X, Edit2, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { toast } from 'sonner';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

export default function KPIManagement() {
  const { hasAccess } = useAuth();
  const [kpis, setKpis] = useState<KPI[]>(initialKpis);
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', category: '', target: 0, actual: 0, unit: '', frequency: 'Monthly' as KPI['frequency'], owner: '', department: '', status: 'on_track' as KPI['status'] });

  const handleSave = () => {
    if (!formData.name) { toast.error('KPI name required'); return; }
    const kpi: KPI = { ...formData, id: editIdx !== null ? kpis[editIdx].id : `KPI-${String(kpis.length + 1).padStart(3, '0')}`, trend: [formData.actual], createdDate: new Date().toISOString().split('T')[0] };
    if (editIdx !== null) { setKpis(prev => prev.map((k, i) => i === editIdx ? kpi : k)); toast.success('Updated'); }
    else { setKpis(prev => [...prev, kpi]); toast.success('Added'); }
    setShowForm(false); setEditIdx(null);
  };

  return (
    <div className="space-y-4">
      <ProcessGuide title="How KPI Management Works" steps={[
        { step: 1, title: 'Define KPIs', description: 'HR/HOD creates KPIs with targets, units, frequency, and assigns owners.', role: 'Admin / HR / HOD' },
        { step: 2, title: 'Track Progress', description: 'Actual values are updated periodically. System calculates status (on track, at risk, behind).', role: 'KPI Owner' },
        { step: 3, title: 'Review & Report', description: 'KPI dashboards are reviewed in management meetings for strategic decisions.', role: 'Management' },
      ]} tips={['Green = on track, Yellow = at risk, Red = behind target', 'KPIs feed into the performance appraisal process']} />

      {hasAccess(['admin', 'hr', 'hod']) && (
        <button onClick={() => { setFormData({ name: '', category: '', target: 0, actual: 0, unit: '', frequency: 'Monthly', owner: '', department: '', status: 'on_track' }); setEditIdx(null); setShowForm(true); }} className="crud-btn-primary flex items-center gap-1"><Plus className="w-3 h-3" /> Add KPI</button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => (
          <div key={kpi.id} className="bg-card rounded-lg border p-4">
            <div className="flex justify-between items-start mb-2">
              <div><div className="font-medium text-sm">{kpi.name}</div><div className="text-xs text-muted-foreground">{kpi.category} · {kpi.frequency}</div></div>
              <span className={kpi.status === 'on_track' ? 'badge-active' : kpi.status === 'at_risk' ? 'badge-pending' : 'badge-rejected'}>{kpi.status.replace('_', ' ')}</span>
            </div>
            <div className="flex items-end gap-2 mb-2"><span className="text-2xl font-bold">{kpi.actual}</span><span className="text-sm text-muted-foreground">/ {kpi.target} {kpi.unit}</span></div>
            <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="h-2 rounded-full" style={{ width: `${Math.min(100, (kpi.actual / kpi.target) * 100)}%`, background: kpi.status === 'on_track' ? 'hsl(var(--success))' : kpi.status === 'at_risk' ? 'hsl(var(--warning))' : 'hsl(var(--destructive))' }} /></div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{kpi.owner} · {kpi.department}</span>
              {hasAccess(['admin', 'hr']) && (
                <div className="flex gap-1">
                  <button onClick={() => { setFormData(kpi); setEditIdx(i); setShowForm(true); }} className="p-1 hover:bg-muted rounded"><Edit2 className="w-3 h-3" /></button>
                  <button onClick={() => { setKpis(prev => prev.filter((_, idx) => idx !== i)); toast.success('Deleted'); }} className="p-1 hover:bg-destructive/10 rounded text-destructive"><Trash2 className="w-3 h-3" /></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold">{editIdx !== null ? 'Edit KPI' : 'Add KPI'}</h3><button onClick={() => setShowForm(false)}><X className="w-4 h-4" /></button></div>
            <div className="space-y-3">
              <div className="form-field"><label className="form-label">Name</label><input className="form-input" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Category</label><input className="form-input" value={formData.category} onChange={e => setFormData(f => ({ ...f, category: e.target.value }))} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div className="form-field"><label className="form-label">Target</label><input className="form-input" type="number" value={formData.target} onChange={e => setFormData(f => ({ ...f, target: Number(e.target.value) }))} /></div>
                <div className="form-field"><label className="form-label">Actual</label><input className="form-input" type="number" value={formData.actual} onChange={e => setFormData(f => ({ ...f, actual: Number(e.target.value) }))} /></div>
                <div className="form-field"><label className="form-label">Unit</label><input className="form-input" value={formData.unit} onChange={e => setFormData(f => ({ ...f, unit: e.target.value }))} /></div>
              </div>
              <div className="form-field"><label className="form-label">Owner</label><input className="form-input" value={formData.owner} onChange={e => setFormData(f => ({ ...f, owner: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Department</label><input className="form-input" value={formData.department} onChange={e => setFormData(f => ({ ...f, department: e.target.value }))} /></div>
            </div>
            <div className="flex gap-2 mt-4"><button onClick={handleSave} className="crud-btn-primary flex-1">Save</button><button onClick={() => setShowForm(false)} className="crud-btn-secondary flex-1">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
