import { useState } from 'react';
import { announcements as initialAnn, type Announcement } from '@/data/hrData';
import { Plus, X, Edit2, Trash2, Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

export default function Announcements() {
  const { hasAccess } = useAuth();
  const [items, setItems] = useState<Announcement[]>(initialAnn);
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', author: '', priority: 'medium' as Announcement['priority'], category: 'General' });

  const handleSave = () => {
    if (!formData.title) { toast.error('Title required'); return; }
    const ann: Announcement = { ...formData, id: editIdx !== null ? items[editIdx].id : `ANN-${String(items.length + 1).padStart(3, '0')}`, date: new Date().toISOString().split('T')[0] };
    if (editIdx !== null) { setItems(prev => prev.map((a, i) => i === editIdx ? ann : a)); toast.success('Updated'); }
    else { setItems(prev => [ann, ...prev]); toast.success('Published'); }
    setShowForm(false); setEditIdx(null);
  };

  return (
    <div className="space-y-4">
      <ProcessGuide title="How Announcements Work" steps={[
        { step: 1, title: 'Create Announcement', description: 'HR or Admin drafts the announcement with title, content, priority, and category.', role: 'Admin / HR' },
        { step: 2, title: 'Publish', description: 'Announcement is published and visible to all employees on the dashboard.', role: 'Admin / HR' },
        { step: 3, title: 'Employee Views', description: 'Employees see announcements sorted by priority and date.', role: 'All employees' },
      ]} tips={['High priority announcements appear with a red indicator', 'Use categories to help employees filter relevant announcements']} />

      {hasAccess(['admin', 'hr']) && (
        <button onClick={() => { setFormData({ title: '', content: '', author: '', priority: 'medium', category: 'General' }); setEditIdx(null); setShowForm(true); }} className="crud-btn-primary flex items-center gap-1"><Plus className="w-3 h-3" /> New Announcement</button>
      )}

      <div className="space-y-3">
        {items.map((a, i) => (
          <div key={a.id} className="bg-card rounded-lg border p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={a.priority === 'high' ? 'badge-rejected' : a.priority === 'medium' ? 'badge-pending' : 'badge-active'}>{a.priority}</span>
                  <span className="badge-info">{a.category}</span>
                </div>
                <h3 className="font-bold">{a.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{a.content}</p>
                <div className="text-xs text-muted-foreground mt-2">By {a.author} · {a.date}</div>
              </div>
              {hasAccess(['admin', 'hr']) && (
                <div className="flex gap-1">
                  <button onClick={() => { setFormData(a); setEditIdx(i); setShowForm(true); }} className="p-1 hover:bg-muted rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { setItems(prev => prev.filter((_, idx) => idx !== i)); toast.success('Deleted'); }} className="p-1 hover:bg-destructive/10 rounded text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold">{editIdx !== null ? 'Edit' : 'New'} Announcement</h3><button onClick={() => setShowForm(false)}><X className="w-4 h-4" /></button></div>
            <div className="space-y-3">
              <div className="form-field"><label className="form-label">Title</label><input className="form-input" value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Content</label><textarea className="form-input" rows={3} value={formData.content} onChange={e => setFormData(f => ({ ...f, content: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Author</label><input className="form-input" value={formData.author} onChange={e => setFormData(f => ({ ...f, author: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Priority</label><select className="form-select" value={formData.priority} onChange={e => setFormData(f => ({ ...f, priority: e.target.value as Announcement['priority'] }))}><option>high</option><option>medium</option><option>low</option></select></div>
              <div className="form-field"><label className="form-label">Category</label><input className="form-input" value={formData.category} onChange={e => setFormData(f => ({ ...f, category: e.target.value }))} /></div>
            </div>
            <div className="flex gap-2 mt-4"><button onClick={handleSave} className="crud-btn-primary flex-1">Publish</button><button onClick={() => setShowForm(false)} className="crud-btn-secondary flex-1">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
