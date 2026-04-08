import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { employees, type Employee } from '@/data/hrData';
import { Search, Plus, Edit2, Trash2, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

const departments = ['All Departments', ...new Set(employees.map(e => e.department))];
const statuses = ['All Status', 'Active', 'On Leave', 'Consultant'];

export default function EmployeeDirectory() {
  const [searchParams] = useSearchParams();
  const { hasAccess } = useAuth();
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState(searchParams.get('department') || 'All Departments');
  const [status, setStatus] = useState(searchParams.get('type') === 'consultant' ? 'Consultant' : 'All Status');
  const [page, setPage] = useState(1);
  const [localEmployees, setLocalEmployees] = useState<Employee[]>(employees);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const perPage = 50;

  const [formData, setFormData] = useState<{ name: string; email: string; department: string; jobTitle: string; type: 'Employee' | 'Consultant'; grossPay: number }>({ name: '', email: '', department: 'Engineering', jobTitle: '', type: 'Employee', grossPay: 0 });

  const filtered = useMemo(() => {
    return localEmployees.filter(e => {
      const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
      const matchDept = dept === 'All Departments' || e.department === dept;
      const matchStatus = status === 'All Status' || (status === 'Consultant' ? e.type === 'Consultant' : e.status === status);
      return matchSearch && matchDept && matchStatus;
    });
  }, [search, dept, status, localEmployees]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const handleSave = () => {
    if (!formData.name || !formData.email) { toast.error('Name and email required'); return; }
    if (editingEmployee) {
      setLocalEmployees(prev => prev.map(e => e.id === editingEmployee.id ? { ...e, ...formData } : e));
      toast.success('Employee updated');
    } else {
      const newId = `PAR-${String(localEmployees.length + 1).padStart(4, '0')}`;
      setLocalEmployees(prev => [{ ...formData, id: newId, status: 'Active' as const, joinDate: new Date().toISOString().split('T')[0], type: formData.type as 'Employee' | 'Consultant' }, ...prev]);
      toast.success('Employee added');
    }
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setLocalEmployees(prev => prev.filter(e => e.id !== id));
      toast.success('Employee removed');
    }
  };

  const openEdit = (emp: Employee) => {
    setFormData({ name: emp.name, email: emp.email, department: emp.department, jobTitle: emp.jobTitle, type: emp.type, grossPay: emp.grossPay });
    setEditingEmployee(emp);
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <ProcessGuide
        title="How Employee Directory Works"
        steps={[
          { step: 1, title: 'Search & Filter', description: 'Use the search bar, department filter, or status filter to find employees quickly.', role: 'All roles with access' },
          { step: 2, title: 'View Employee Details', description: 'Click the eye icon to view full employee profile including department, role, and pay details.', role: 'All roles with access' },
          { step: 3, title: 'Add New Employee', description: 'Click "+ Add Employee" to create a new employee record with all required details.', role: 'Admin / HR' },
          { step: 4, title: 'Edit Employee', description: 'Click the pencil icon to update employee information like department, title, or pay.', role: 'Admin / HR' },
          { step: 5, title: 'Remove Employee', description: 'Click the trash icon to remove an employee record (with confirmation).', role: 'Admin only' },
        ]}
        tips={['Use pagination to browse through large datasets', 'Filter by "Consultant" to see contractors separately']}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Search by name, ID, or email…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="form-input pl-10" />
        </div>
        <select value={dept} onChange={e => { setDept(e.target.value); setPage(1); }} className="form-select w-auto">
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="form-select w-auto">
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        {hasAccess(['admin', 'hr']) && (
          <button onClick={() => { setFormData({ name: '', email: '', department: 'Engineering', jobTitle: '', type: 'Employee', grossPay: 0 }); setEditingEmployee(null); setShowForm(true); }} className="crud-btn-primary flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Employee
          </button>
        )}
      </div>

      <div className="text-xs text-muted-foreground">{filtered.length} employees found · Page {page} of {totalPages}</div>

      <div className="bg-card rounded-lg border overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Department</th><th>Job Title</th><th>Type</th><th>Status</th>
              {hasAccess(['admin', 'hr']) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginated.map(emp => (
              <tr key={emp.id}>
                <td className="font-mono text-xs">{emp.id}</td>
                <td className="font-medium">{emp.name}</td>
                <td>{emp.department}</td>
                <td>{emp.jobTitle}</td>
                <td><span className={emp.type === 'Consultant' ? 'badge-consultant' : 'badge-employee'}>{emp.type}</span></td>
                <td><span className={emp.status === 'Active' ? 'badge-active' : emp.status === 'On Leave' ? 'badge-pending' : 'badge-rejected'}>{emp.status}</span></td>
                {hasAccess(['admin', 'hr']) && (
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => setViewEmployee(emp)} className="p-1 hover:bg-muted rounded"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => openEdit(emp)} className="p-1 hover:bg-muted rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                      {hasAccess(['admin']) && <button onClick={() => handleDelete(emp.id)} className="p-1 hover:bg-destructive/10 rounded text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="crud-btn-secondary">Previous</button>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="crud-btn-secondary">Next</button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div className="form-field"><label className="form-label">Full Name</label><input className="form-input" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Email</label><input className="form-input" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Department</label><select className="form-select" value={formData.department} onChange={e => setFormData(f => ({ ...f, department: e.target.value }))}>{departments.filter(d => d !== 'All Departments').map(d => <option key={d}>{d}</option>)}</select></div>
              <div className="form-field"><label className="form-label">Job Title</label><input className="form-input" value={formData.jobTitle} onChange={e => setFormData(f => ({ ...f, jobTitle: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Type</label><select className="form-select" value={formData.type} onChange={e => setFormData(f => ({ ...f, type: e.target.value as 'Employee' | 'Consultant' }))}><option>Employee</option><option>Consultant</option></select></div>
              <div className="form-field"><label className="form-label">Gross Pay (Ksh)</label><input className="form-input" type="number" value={formData.grossPay} onChange={e => setFormData(f => ({ ...f, grossPay: Number(e.target.value) }))} /></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSave} className="crud-btn-primary flex-1">Save</button>
              <button onClick={() => setShowForm(false)} className="crud-btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewEmployee && (
        <div className="modal-overlay" onClick={() => setViewEmployee(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Employee Details</h3>
              <button onClick={() => setViewEmployee(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2 text-sm">
              {Object.entries({ ID: viewEmployee.id, Name: viewEmployee.name, Email: viewEmployee.email, Department: viewEmployee.department, 'Job Title': viewEmployee.jobTitle, Type: viewEmployee.type, Status: viewEmployee.status, 'Gross Pay': `Ksh ${viewEmployee.grossPay.toLocaleString()}`, 'Join Date': viewEmployee.joinDate }).map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
