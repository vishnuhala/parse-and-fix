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
  LBRACKET: "bg-primary/20 text-primary border-primary/30",
  RBRACKET: "bg-primary/20 text-primary border-primary/30",
  INVALID: "bg-error/20 text-error border-error/30",
  EOF: "bg-muted text-muted-foreground border-border",
  KEYWORD: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  IDENTIFIER: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  SEMICOLON: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  LBRACE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  RBRACE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  COMMA: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  ASSIGN: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  COMPARISON: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  LOGICAL: "bg-red-500/20 text-red-400 border-red-500/30",
  INCREMENT: "bg-green-500/20 text-green-400 border-green-500/30",
  DECREMENT: "bg-green-500/20 text-green-400 border-green-500/30",
  COMPOUND_ASSIGN: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  STRING: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  CHAR: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  PREPROCESSOR: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  DOT: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  ARROW: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  AMPERSAND: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
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
