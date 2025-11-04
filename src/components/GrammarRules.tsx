import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export const GrammarRules = () => {
  const grammar = [
    { rule: "Expression", production: "Additive" },
    { rule: "Additive", production: "Multiplicative (('+' | '-') Multiplicative)*" },
    { rule: "Multiplicative", production: "Power (('*' | '/' | '%') Power)*" },
    { rule: "Power", production: "Primary ('^' Power)?" },
    { rule: "Primary", production: "NUMBER | '(' Expression ')' | ('+' | '-') Primary" },
  ];

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Grammar Rules (BNF)</h3>
      </div>
      <div className="space-y-3">
        {grammar.map((item, index) => (
          <div key={index} className="font-mono text-sm">
            <span className="text-primary font-semibold">{item.rule}</span>
            <span className="text-muted-foreground mx-2">→</span>
            <span className="text-foreground/90">{item.production}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Operator Precedence (High to Low):</strong></p>
          <p>1. Parentheses ( )</p>
          <p>2. Power (^) - Right associative</p>
          <p>3. Multiplication, Division, Modulo (*, /, %)</p>
          <p>4. Addition, Subtraction (+, -)</p>
        </div>
      </div>
    </Card>
  );
};
