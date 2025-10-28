import { ParseResult, formatTree } from "@/lib/parser";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Lightbulb, TreePine } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ParseOutputProps {
  result: ParseResult | null;
}

export const ParseOutput = ({ result }: ParseOutputProps) => {
  if (!result) {
    return (
      <Card className="p-8 bg-card border-border">
        <div className="text-center text-muted-foreground">
          <TreePine className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Parse results will appear here</p>
        </div>
      </Card>
    );
  }

  if (result.success && result.tree) {
    return (
      <div className="space-y-4">
        <Alert className="border-success bg-success/10 glow-success">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <AlertDescription className="text-success-foreground">
            ✓ Valid syntax! Expression parsed successfully.
          </AlertDescription>
        </Alert>
        
        <Card className="p-6 bg-code-bg border-code-border">
          <div className="flex items-center gap-2 mb-4">
            <TreePine className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Syntax Tree</h3>
          </div>
          <pre className="font-mono text-sm text-foreground/90 overflow-x-auto">
            {formatTree(result.tree)}
          </pre>
        </Card>
      </div>
    );
  }

  if (result.errors && result.errors.length > 0) {
    return (
      <div className="space-y-4">
        <Alert className="border-error bg-error/10 glow-error">
          <AlertCircle className="h-5 w-5 text-error" />
          <AlertDescription className="text-error-foreground">
            ✗ Syntax error detected in expression
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          {result.errors.map((error, index) => (
            <Card key={index} className="p-5 bg-card border-border">
              <div className="space-y-3">
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-error mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-error">
                        {error.message}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Position: {error.position}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 pl-6 border-l-2 border-accent">
                  <Lightbulb className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-accent mb-1">
                      Suggestion
                    </p>
                    <p className="text-sm text-foreground/80">
                      {error.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
