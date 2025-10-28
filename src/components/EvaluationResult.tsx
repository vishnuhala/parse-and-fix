import { Card } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EvaluationResultProps {
  result: number | null;
  error?: string;
}

export const EvaluationResult = ({ result, error }: EvaluationResultProps) => {
  if (error) {
    return (
      <Alert className="border-error bg-error/10">
        <AlertDescription className="text-error-foreground">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (result === null) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-center gap-3">
        <Calculator className="w-6 h-6 text-primary" />
        <div>
          <p className="text-sm text-muted-foreground mb-1">Evaluation Result</p>
          <p className="text-3xl font-bold text-primary font-mono">
            {result}
          </p>
        </div>
      </div>
    </Card>
  );
};
