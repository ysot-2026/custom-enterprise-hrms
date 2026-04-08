import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activeEmployees, permanentStaff, consultants, payrollSummary, formatCurrency } from '@/data/hrData';
import { CheckCircle, AlertCircle } from 'lucide-react';
import ProcessGuide from '@/components/ProcessGuide';

const steps = ['Review Employees', 'Calculate Payroll', 'Approve', 'Process Payment'];

export default function Payroll() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const activeCount = activeEmployees.length;

  return (
    <div className="space-y-6">
      <ProcessGuide
        title="How Payroll Processing Works"
        steps={[
          { step: 1, title: 'Review Employees', description: 'Verify active employee count, permanent staff vs. consultants, and flag any exceptions.', role: 'Payroll Officer / HR' },
          { step: 2, title: 'Calculate Payroll', description: 'System calculates gross pay, PAYE, SHIF, NSSF, Housing Levy and generates net pay amounts.', role: 'Payroll Officer' },
          { step: 3, title: 'Approve Payroll', description: 'Finance Manager and HR Head review the payroll summary and approve for payment.', role: 'Finance Manager / HR Head' },
          { step: 4, title: 'Process Payment', description: 'Bank file is generated and salary is disbursed to employee accounts. Payslips are generated.', role: 'Finance / Admin' },
        ]}
        tips={['Ensure all timesheets are submitted before running payroll', 'Check statutory rates against latest KRA guidelines', 'Consultants are subject to 5% WHT instead of PAYE']}
      />

      {/* Stepper */}
      <div className="bg-card rounded-lg border p-5">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{step}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-16 h-0.5 mx-2 ${i < currentStep ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        {currentStep === 0 && (
          <div>
            <h3 className="font-bold mb-3">Employee Review</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-muted text-center">
                <div className="text-2xl font-bold">{activeCount}</div>
                <div className="text-xs text-muted-foreground">Active Employees</div>
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                <div className="text-2xl font-bold">{permanentStaff.filter(e => e.status === 'Active').length}</div>
                <div className="text-xs text-muted-foreground">Permanent Staff</div>
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                <div className="text-2xl font-bold">{consultants.length}</div>
                <div className="text-xs text-muted-foreground">Consultants</div>
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                <div className="text-2xl font-bold text-success">0</div>
                <div className="text-xs text-muted-foreground">Exceptions</div>
              </div>
            </div>
            <p className="text-sm text-success flex items-center gap-1"><CheckCircle className="w-4 h-4" /> All employee records verified and up to date.</p>
          </div>
        )}
        {currentStep === 1 && (
          <div>
            <h3 className="font-bold mb-3">Payroll Calculation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-muted rounded"><span>Total Gross Payroll</span><span className="font-bold">{formatCurrency(payrollSummary.totalGross)}</span></div>
              <div className="flex justify-between p-2"><span>Total PAYE</span><span className="text-destructive">- {formatCurrency(Math.round(payrollSummary.paye))}</span></div>
              <div className="flex justify-between p-2"><span>Total SHIF</span><span className="text-destructive">- {formatCurrency(Math.round(payrollSummary.shif))}</span></div>
              <div className="flex justify-between p-2"><span>Total NSSF</span><span className="text-destructive">- {formatCurrency(Math.round(payrollSummary.nssf))}</span></div>
              <div className="flex justify-between p-2"><span>Total Housing Levy</span><span className="text-destructive">- {formatCurrency(Math.round(payrollSummary.housing))}</span></div>
              <div className="flex justify-between p-2 bg-muted rounded font-bold"><span>Total Net Payroll</span><span>{formatCurrency(Math.round(payrollSummary.totalNet))}</span></div>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="text-center py-6">
            <AlertCircle className="w-12 h-12 mx-auto text-warning mb-3" />
            <h3 className="font-bold mb-1">Payroll Approval Required</h3>
            <p className="text-sm text-muted-foreground mb-4">The payroll summary requires approval from Finance Manager and HR Head before processing.</p>
          </div>
        )}
        {currentStep === 3 && (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 mx-auto text-success mb-3" />
            <h3 className="font-bold mb-1">Ready to Process</h3>
            <p className="text-sm text-muted-foreground">Generate bank file and process salary payments.</p>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button disabled={currentStep === 0} onClick={() => setCurrentStep(s => s - 1)} className="crud-btn-secondary">Previous</button>
          <button disabled={currentStep === steps.length - 1} onClick={() => setCurrentStep(s => s + 1)} className="crud-btn-primary">
            {currentStep === steps.length - 2 ? 'Process Payment' : 'Next Step'}
          </button>
        </div>
      </div>
    </div>
  );
}
