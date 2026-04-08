import ProcessGuide from '@/components/ProcessGuide';
import { Upload, FileText } from 'lucide-react';

export default function BulkUpload() {
  return (
    <div className="space-y-4">
      <ProcessGuide title="How Bulk Upload Works" steps={[
        { step: 1, title: 'Download Template', description: 'Download the CSV/Excel template with required columns for the data type (employees, attendance, etc.).', role: 'HR / Admin' },
        { step: 2, title: 'Fill Data', description: 'Populate the template with employee data following the format guidelines.', role: 'HR / Admin' },
        { step: 3, title: 'Upload File', description: 'Upload the completed file. System validates data format and checks for duplicates.', role: 'HR / Admin' },
        { step: 4, title: 'Review & Confirm', description: 'Review the validation report. Fix any errors and confirm the import.', role: 'HR / Admin' },
      ]} tips={['Maximum 5,000 records per upload', 'Supported formats: CSV, XLSX', 'Always backup data before bulk imports']} />

      <div className="bg-card rounded-lg border p-8 text-center">
        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="font-bold mb-1">Upload Employee Data</h3>
        <p className="text-sm text-muted-foreground mb-4">Drag and drop your CSV or Excel file here, or click to browse</p>
        <div className="flex justify-center gap-3">
          <button className="crud-btn-primary">Choose File</button>
          <button className="crud-btn-secondary flex items-center gap-1"><FileText className="w-3 h-3" /> Download Template</button>
        </div>
      </div>
    </div>
  );
}
