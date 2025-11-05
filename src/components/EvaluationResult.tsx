import { Card } from "@/components/ui/card";
import { Calculator, Code2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExecutionResult } from "@/lib/parser";

interface EvaluationResultProps {
  evaluationData: {
    result: number | null;
    error?: string;
    programOutput?: ExecutionResult;
  };
}

export const EvaluationResult = ({ evaluationData }: EvaluationResultProps) => {
  const { result, error, programOutput } = evaluationData;

  if (error) {
    return (
      <Alert className="border-error bg-error/10">
        <AlertDescription className="text-error-foreground">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-6 h-6 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {programOutput ? "Program Output" : "Evaluation Result"}
            </p>
            <p className="text-3xl font-bold text-primary font-mono">
              {result !== null ? result : "N/A"}
            </p>
          </div>
        </div>

        {programOutput && (
          <div className="space-y-4 mt-6">
            {programOutput.output.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4 text-accent" />
                  <h3 className="font-semibold text-sm">Console Output:</h3>
                </div>
                <Card className="p-4 bg-muted/50">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {programOutput.output.join('\n')}
                  </pre>
                </Card>
              </div>
            )}

            {programOutput.executionSteps && programOutput.executionSteps.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">Execution Steps:</h3>
                <Card className="p-4 bg-muted/50">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {programOutput.executionSteps.join('\n')}
                  </pre>
                </Card>
              </div>
            )}

            {Object.keys(programOutput.variables).length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">Final Variable State:</h3>
                <Card className="p-4 bg-muted/50">
                  <div className="space-y-1">
                    {Object.entries(programOutput.variables).map(([name, value]) => (
                      <div key={name} className="flex justify-between font-mono text-sm">
                        <span className="text-muted-foreground">{name}:</span>
                        <span className="text-foreground font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
