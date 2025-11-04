import { Card } from "@/components/ui/card";
import { Terminal, CheckCircle2, XCircle, Variable } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExecutionResult } from "@/lib/parser";

interface ProgramOutputProps {
  result: ExecutionResult;
}

export const ProgramOutput = ({ result }: ProgramOutputProps) => {
  return (
    <div className="space-y-4">
      {result.error ? (
        <Alert className="border-error bg-error/10">
          <XCircle className="h-4 w-4 text-error" />
          <AlertDescription className="text-error-foreground">
            {result.error}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-success bg-success/10">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="text-success-foreground">
            Program executed successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Program Output */}
      {result.output.length > 0 && (
        <Card className="p-6 bg-card/50 border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-primary">Program Output</h3>
          </div>
          <div className="bg-code-bg p-4 rounded-lg font-mono text-sm space-y-1">
            {result.output.map((line, i) => (
              <div key={i} className="text-foreground">{line}</div>
            ))}
          </div>
        </Card>
      )}

      {/* Return Value */}
      {result.returnValue !== null && (
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/5 border-accent/30">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Return Value</p>
              <p className="text-3xl font-bold text-accent font-mono">
                {result.returnValue}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Variables State */}
      {Object.keys(result.variables).length > 0 && (
        <Card className="p-6 bg-card/50 border-muted">
          <div className="flex items-center gap-2 mb-4">
            <Variable className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Variable State</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(result.variables).map(([name, value]) => (
              <div key={name} className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">{name}</p>
                <p className="font-mono font-semibold text-foreground">
                  {String(value)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
