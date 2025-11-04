import { useState } from "react";
import { parseExpression, ParseResult } from "@/lib/parser";
import { ParserInput } from "@/components/ParserInput";
import { ParseOutput } from "@/components/ParseOutput";
import { ExampleExpressions } from "@/components/ExampleExpressions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Cpu } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<ParseResult | null>(null);

  const handleParse = () => {
    if (!expression.trim()) {
      toast.error("Please enter an expression to parse");
      return;
    }

    const parseResult = parseExpression(expression);
    setResult(parseResult);

    if (parseResult.success) {
      toast.success("Expression parsed successfully!");
    } else {
      toast.error("Syntax error detected");
    }
  };

  const handleExampleSelect = (expr: string) => {
    setExpression(expr);
    setResult(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleParse();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 glow-primary">
              <Cpu className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Mini Parser
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Arithmetic expression parser with intelligent error detection and helpful recovery suggestions
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <Card className="p-6 bg-card border-border">
            <div onKeyDown={handleKeyPress}>
              <ParserInput
                value={expression}
                onChange={setExpression}
                error={result?.errors?.[0]}
              />
              <Button
                onClick={handleParse}
                className="w-full mt-4 bg-primary hover:bg-primary/90 glow-primary transition-all"
                size="lg"
              >
                <Play className="w-4 h-4 mr-2" />
                Parse Expression
                <span className="ml-auto text-xs opacity-70">Ctrl+Enter</span>
              </Button>
            </div>
          </Card>

          {/* Output Section */}
          <div>
            <ParseOutput result={result} />
          </div>
        </div>

        {/* Examples Section */}
        <ExampleExpressions onSelect={handleExampleSelect} />

        {/* Footer Info */}
        <Card className="mt-8 p-6 bg-card/50 border-border">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            About This Parser
          </h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              This mini parser demonstrates syntactic analysis with error recovery capabilities.
              It tokenizes input, builds an abstract syntax tree (AST), and provides contextual
              error messages with actionable suggestions.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
              <div>
                <p className="font-medium text-foreground mb-1">Supported Operators</p>
                <p className="font-mono text-xs">+, -, *, /, %, ^ (power)</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Features</p>
                <p className="text-xs">Precedence handling, unary operators, nested parentheses</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
