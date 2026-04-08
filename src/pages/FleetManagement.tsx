import ProcessGuide from '@/components/ProcessGuide';
import { Truck, Users, Wrench, AlertTriangle } from 'lucide-react';

export default function FleetManagement() {
  const vehicles = [
    { reg: 'KDA 001A', make: 'Toyota Land Cruiser', status: 'In Use', assignedTo: 'John Kamau', mileage: 24500 },
    { reg: 'KDB 234B', make: 'Toyota Hilux', status: 'Available', assignedTo: '—', mileage: 45200 },
    { reg: 'KCC 567C', make: 'Nissan NV350', status: 'Maintenance', assignedTo: '—', mileage: 78300 },
    { reg: 'KDE 890D', make: 'Toyota Corolla', status: 'In Use', assignedTo: 'Mary Wanjiku', mileage: 8900 },
    { reg: 'KDF 112E', make: 'Isuzu FRR', status: 'In Use', assignedTo: 'Peter Ochieng', mileage: 112000 },
  ];

  return (
    <div className="space-y-4">
      <ProcessGuide title="How Fleet Management Works" steps={[
        { step: 1, title: 'Vehicle Request', description: 'Employee submits a vehicle request specifying purpose, destination, dates, and passengers.', role: 'Employee' },
        { step: 2, title: 'Supervisor Approval', description: 'Direct supervisor approves the request based on business justification.', role: 'Supervisor' },
        { step: 3, title: 'Fleet Allocation', description: 'Fleet manager allocates available vehicle and assigns a driver based on route and vehicle type.', role: 'Fleet Manager' },
        { step: 4, title: 'Trip Execution', description: 'Driver records start/end mileage, fuel used. GPS tracking monitors the trip.', role: 'Driver' },
        { step: 5, title: 'Trip Completion', description: 'Upon return, vehicle is inspected. Fuel logs and mileage are recorded for cost tracking.', role: 'Fleet Manager' },
        { step: 6, title: 'Maintenance Scheduling', description: 'System alerts when vehicles are due for service based on mileage or time intervals.', role: 'Fleet Manager / System' },
      ]} tips={['All trips require pre-approval — no unauthorized vehicle use', 'Fuel cards are tracked per vehicle', 'Incidents must be reported within 24 hours']} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-card border text-center"><Truck className="w-5 h-5 mx-auto mb-1 text-muted-foreground" /><div className="text-xl font-bold">{vehicles.length}</div><div className="text-xs text-muted-foreground">Total Vehicles</div></div>
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold text-success">{vehicles.filter(v => v.status === 'Available').length}</div><div className="text-xs text-muted-foreground">Available</div></div>
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold">{vehicles.filter(v => v.status === 'In Use').length}</div><div className="text-xs text-muted-foreground">In Use</div></div>
        <div className="p-3 rounded-lg bg-card border text-center"><div className="text-xl font-bold text-warning">{vehicles.filter(v => v.status === 'Maintenance').length}</div><div className="text-xs text-muted-foreground">Maintenance</div></div>
      </div>

      <div className="bg-card rounded-lg border overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Registration</th><th>Vehicle</th><th>Status</th><th>Assigned To</th><th>Mileage</th></tr></thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.reg}>
                <td className="font-mono text-xs font-bold">{v.reg}</td><td>{v.make}</td>
                <td><span className={v.status === 'Available' ? 'badge-active' : v.status === 'In Use' ? 'badge-info' : 'badge-pending'}>{v.status}</span></td>
                <td>{v.assignedTo}</td><td>{v.mileage.toLocaleString()} km</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
