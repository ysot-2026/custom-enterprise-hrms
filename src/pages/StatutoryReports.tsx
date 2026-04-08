import { payrollSummary, formatCurrency } from '@/data/hrData';
import ProcessGuide from '@/components/ProcessGuide';

export default function StatutoryReports() {
  const items = [
    { name: 'PAYE (Pay As You Earn)', amount: payrollSummary.paye, deadline: '9th of following month', authority: 'KRA' },
    { name: 'SHIF (Social Health Insurance Fund)', amount: payrollSummary.shif, deadline: '9th of following month', authority: 'SHA' },
    { name: 'NSSF (National Social Security Fund)', amount: payrollSummary.nssf, deadline: '15th of following month', authority: 'NSSF' },
    { name: 'Housing Levy', amount: payrollSummary.housing, deadline: '9th of following month', authority: 'KRA' },
  ];
  return (
    <div className="space-y-4">
      <ProcessGuide title="How Statutory Reports Work" steps={[
        { step: 1, title: 'Payroll Processed', description: 'Statutory deductions are calculated during payroll processing.', role: 'Payroll Officer' },
        { step: 2, title: 'Reports Generated', description: 'System generates P10, SHIF, NSSF and Housing Levy reports.', role: 'System' },
        { step: 3, title: 'Filing & Remittance', description: 'Reports are filed with respective authorities and payments remitted before deadlines.', role: 'Finance / HR' },
      ]} tips={['Late filing attracts penalties — always file before the 9th', 'Keep copies of all filed returns for audit purposes']} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.name} className="bg-card rounded-lg border p-5">
            <div className="text-sm font-medium text-muted-foreground">{item.name}</div>
            <div className="text-2xl font-bold mt-1">{formatCurrency(Math.round(item.amount))}</div>
            <div className="text-xs text-muted-foreground mt-2">Authority: {item.authority} · Deadline: {item.deadline}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
