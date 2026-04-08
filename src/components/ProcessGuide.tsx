import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  role: string;
}

interface ProcessGuideProps {
  title: string;
  steps: ProcessStep[];
  tips?: string[];
}

export default function ProcessGuide({ title, steps, tips }: ProcessGuideProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="process-guide">
      <button onClick={() => setOpen(!open)} className="process-guide-title w-full text-left">
        <BookOpen className="w-4 h-4" />
        <span>{title}</span>
        {open ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
      </button>
      {open && (
        <div className="process-guide-content">
          <div className="space-y-2">
            {steps.map((s) => (
              <div key={s.step} className="process-step">
                <div className="process-step-number">{s.step}</div>
                <div>
                  <div className="font-medium text-foreground">{s.title}</div>
                  <div className="text-xs">{s.description}</div>
                  <div className="text-xs mt-0.5 font-medium" style={{ color: 'hsl(var(--info))' }}>
                    Role: {s.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {tips && tips.length > 0 && (
            <div className="mt-3 p-3 rounded-md" style={{ background: 'hsl(var(--muted))' }}>
              <div className="text-xs font-semibold mb-1">💡 Tips</div>
              <ul className="text-xs space-y-1 list-disc list-inside">
                {tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
