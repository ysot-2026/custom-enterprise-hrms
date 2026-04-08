import { useState } from 'react';
import { jobPostings, type JobPosting } from '@/data/hrData';
import { Plus, X, Edit2, Trash2, Users, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

export default function Recruitment() {
  const { hasAccess } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>(jobPostings);
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState({ position: '', department: '', location: '', type: 'Full-time', postedDate: '', applicants: 0, shortlisted: 0, interviews: 0, status: 'draft' as JobPosting['status'] });

  const handleSave = () => {
    if (!formData.position) { toast.error('Position required'); return; }
    const job: JobPosting = { ...formData, id: editIdx !== null ? jobs[editIdx].id : `JOB-${String(jobs.length + 1).padStart(3, '0')}` };
    if (editIdx !== null) { setJobs(prev => prev.map((j, i) => i === editIdx ? job : j)); toast.success('Updated'); }
    else { setJobs(prev => [...prev, job]); toast.success('Added'); }
    setShowForm(false); setEditIdx(null);
  };

  return (
    <div className="space-y-4">
      <ProcessGuide title="How Recruitment Works" steps={[
        { step: 1, title: 'Requisition Created', description: 'HOD/Manager creates a staff requisition with justification, budget, and job requirements.', role: 'HOD / Manager' },
        { step: 2, title: 'Requisition Approved', description: 'HR and management approve the requisition. Budget is confirmed.', role: 'HR Head / CEO' },
        { step: 3, title: 'Sourcing & Applications', description: 'Job is posted internally/externally. Applications are received and logged in the system.', role: 'HR / Recruiter' },
        { step: 4, title: 'Screening & Shortlisting', description: 'HR screens CVs against criteria. Shortlisted candidates move to interview stage.', role: 'HR / Recruiter' },
        { step: 5, title: 'Interviews & Evaluation', description: 'Panel interviews are conducted. Scores and recommendations are recorded.', role: 'Interview Panel' },
        { step: 6, title: 'Selection & Background Check', description: 'Top candidate is selected. Background verification is conducted.', role: 'HR' },
        { step: 7, title: 'Offer & Onboarding', description: 'Offer letter is sent. Upon acceptance, onboarding process begins.', role: 'HR' },
      ]} tips={['Internal candidates are considered first before external sourcing', 'All interviews require at least 2 panel members', 'Background checks must be completed before offer confirmation']} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold">{jobs.length}</div><div className="text-xs text-muted-foreground">Total Postings</div></div>
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold text-success">{jobs.filter(j => j.status === 'active').length}</div><div className="text-xs text-muted-foreground">Active</div></div>
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold">{jobs.reduce((s, j) => s + j.applicants, 0)}</div><div className="text-xs text-muted-foreground">Total Applicants</div></div>
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold">{jobs.reduce((s, j) => s + j.interviews, 0)}</div><div className="text-xs text-muted-foreground">Interviews</div></div>
      </div>

      {hasAccess(['admin', 'hr']) && (
        <button onClick={() => { setFormData({ position: '', department: '', location: '', type: 'Full-time', postedDate: new Date().toISOString().split('T')[0], applicants: 0, shortlisted: 0, interviews: 0, status: 'draft' }); setEditIdx(null); setShowForm(true); }} className="crud-btn-primary flex items-center gap-1"><Plus className="w-3 h-3" /> New Job Posting</button>
      )}

      <div className="bg-card rounded-lg border overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Position</th><th>Department</th><th>Location</th><th>Applicants</th><th>Shortlisted</th><th>Status</th>{hasAccess(['admin', 'hr']) && <th>Actions</th>}</tr></thead>
          <tbody>
            {jobs.map((j, i) => (
              <tr key={j.id}>
                <td className="font-mono text-xs">{j.id}</td><td className="font-medium">{j.position}</td><td>{j.department}</td><td>{j.location}</td>
                <td>{j.applicants}</td><td>{j.shortlisted}</td>
                <td><span className={j.status === 'active' ? 'badge-active' : j.status === 'closed' ? 'badge-rejected' : 'badge-pending'}>{j.status}</span></td>
                {hasAccess(['admin', 'hr']) && (
                  <td><div className="flex gap-1">
                    <button onClick={() => { setFormData(j); setEditIdx(i); setShowForm(true); }} className="p-1 hover:bg-muted rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => { setJobs(prev => prev.filter((_, idx) => idx !== i)); toast.success('Deleted'); }} className="p-1 hover:bg-destructive/10 rounded text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold">{editIdx !== null ? 'Edit' : 'New'} Job Posting</h3><button onClick={() => setShowForm(false)}><X className="w-4 h-4" /></button></div>
            <div className="space-y-3">
              <div className="form-field"><label className="form-label">Position</label><input className="form-input" value={formData.position} onChange={e => setFormData(f => ({ ...f, position: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Department</label><input className="form-input" value={formData.department} onChange={e => setFormData(f => ({ ...f, department: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Location</label><input className="form-input" value={formData.location} onChange={e => setFormData(f => ({ ...f, location: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Status</label><select className="form-select" value={formData.status} onChange={e => setFormData(f => ({ ...f, status: e.target.value as JobPosting['status'] }))}><option>draft</option><option>active</option><option>closed</option></select></div>
            </div>
            <div className="flex gap-2 mt-4"><button onClick={handleSave} className="crud-btn-primary flex-1">Save</button><button onClick={() => setShowForm(false)} className="crud-btn-secondary flex-1">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
