import { Token } from "@/lib/parser";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Braces } from "lucide-react";

interface TokenVisualizationProps {
  tokens: Token[];
}

const tokenColors: Record<string, string> = {
  NUMBER: "bg-success/20 text-success border-success/30",
  OPERATOR: "bg-accent/20 text-accent border-accent/30",
  LPAREN: "bg-primary/20 text-primary border-primary/30",
  RPAREN: "bg-primary/20 text-primary border-primary/30",
  INVALID: "bg-error/20 text-error border-error/30",
  EOF: "bg-muted text-muted-foreground border-border"
};

export const TokenVisualization = ({ tokens }: TokenVisualizationProps) => {
  return (
    <Card className="p-6 bg-code-bg border-code-border">
      <div className="flex items-center gap-2 mb-4">
        <Braces className="w-5 h-5 text-accent" />
        <h3 className="font-semibold">Lexical Analysis - Tokens</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {tokens.map((token, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <Badge 
              variant="outline" 
              className={`font-mono text-xs ${tokenColors[token.type]} transition-all hover:scale-105`}
            >
              {token.value || 'EOF'}
            </Badge>
            <span className="text-xs text-muted-foreground">{token.type}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Total tokens: {tokens.length} | Position-aware tokenization complete
        </p>
      </div>
    </Card>
  );
};
