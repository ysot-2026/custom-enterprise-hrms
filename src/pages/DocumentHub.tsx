import ProcessGuide from '@/components/ProcessGuide';
import { FolderOpen, FileText, Download } from 'lucide-react';

const documents = [
  { name: 'Employee Handbook 2026', category: 'Policy', updated: '2026-01-15', size: '2.4 MB' },
  { name: 'Leave Policy', category: 'Policy', updated: '2026-03-01', size: '540 KB' },
  { name: 'Code of Conduct', category: 'Policy', updated: '2025-12-10', size: '1.1 MB' },
  { name: 'IT Security Policy', category: 'IT', updated: '2026-02-20', size: '890 KB' },
  { name: 'Travel & Expense Policy', category: 'Finance', updated: '2026-01-30', size: '620 KB' },
  { name: 'Performance Appraisal Template', category: 'HR', updated: '2026-03-15', size: '340 KB' },
  { name: 'Onboarding Checklist', category: 'HR', updated: '2026-02-01', size: '180 KB' },
  { name: 'Fleet Usage Guidelines', category: 'Operations', updated: '2026-03-10', size: '450 KB' },
];

export default function DocumentHub() {
  return (
    <div className="space-y-4">
      <ProcessGuide title="How Document Hub Works" steps={[
        { step: 1, title: 'Upload Documents', description: 'HR/Admin uploads company policies, templates, and guidelines to the central repository.', role: 'Admin / HR' },
        { step: 2, title: 'Categorize', description: 'Documents are organized by category (Policy, HR, IT, Finance, Operations).', role: 'Admin / HR' },
        { step: 3, title: 'Access & Download', description: 'Employees can browse, search, and download documents relevant to them.', role: 'All employees' },
      ]} tips={['All employees must read and acknowledge the Employee Handbook', 'Policies are reviewed and updated annually']} />

      <div className="bg-card rounded-lg border overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Document</th><th>Category</th><th>Last Updated</th><th>Size</th><th>Action</th></tr></thead>
          <tbody>
            {documents.map((doc, i) => (
              <tr key={i}>
                <td className="font-medium flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground" /> {doc.name}</td>
                <td><span className="badge-info">{doc.category}</span></td>
                <td className="text-xs">{doc.updated}</td>
                <td className="text-xs">{doc.size}</td>
                <td><button className="crud-btn-secondary flex items-center gap-1 text-xs"><Download className="w-3 h-3" /> Download</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
