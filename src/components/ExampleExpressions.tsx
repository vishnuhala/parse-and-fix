import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface ExampleExpressionsProps {
  onSelect: (expression: string) => void;
}

const examples = [
  { label: "Simple addition", expr: "2 + 3" },
  { label: "Order of operations", expr: "2 + 3 * 4" },
  { label: "Parentheses", expr: "(2 + 3) * 4" },
  { label: "Power operation", expr: "2 ^ 3 + 1" },
  { label: "Complex expression", expr: "((5 + 3) * 2 - 4) / 2" },
  { label: "Missing parenthesis", expr: "(2 + 3 * 4" },
  { label: "Invalid character", expr: "2 + 3 $ 4" },
  { label: "Double operator", expr: "2 ++ 3" },
];

export const ExampleExpressions = ({ onSelect }: ExampleExpressionsProps) => {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="font-semibold">Example Expressions</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {examples.map((example, index) => (
          <Button
            key={index}
            variant="secondary"
            className="justify-start font-mono text-xs h-auto py-3 px-4 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
            onClick={() => onSelect(example.expr)}
          >
            <span className="text-left flex-1">{example.expr}</span>
            <span className="text-[10px] text-muted-foreground ml-2 hidden sm:inline">
              {example.label}
            </span>
          </Button>
        ))}
      </div>
    </Card>
  );
};
