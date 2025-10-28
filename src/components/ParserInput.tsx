import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Code2 } from "lucide-react";

interface ParserInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: { position: number };
}

export const ParserInput = ({ value, onChange, error }: ParserInputProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="expression" className="flex items-center gap-2 text-sm font-medium">
        <Code2 className="w-4 h-4 text-accent" />
        Enter Expression
      </Label>
      <div className="relative">
        <Textarea
          id="expression"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., (2 + 3) * 4 - 5 / 2"
          className="font-mono text-base bg-code-bg border-code-border min-h-[120px] resize-none focus-visible:ring-primary transition-all"
          spellCheck={false}
        />
        {error && (
          <div 
            className="absolute bottom-2 left-2 w-1 h-6 bg-error animate-pulse"
            style={{ left: `${Math.min(error.position * 0.6, 90)}%` }}
          />
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Supports: +, -, *, /, %, ^ (power), and parentheses
      </p>
    </div>
  );
};
