import { useState } from "react";
import { parseExpression, ParseResult, evaluateAST, Token, Lexer, executeProgram, ExecutionResult } from "@/lib/parser";
import { ParserInput } from "@/components/ParserInput";
import { ParseOutput } from "@/components/ParseOutput";
import { ExampleExpressions } from "@/components/ExampleExpressions";
import { CExamples } from "@/components/CExamples";
import { TokenVisualization } from "@/components/TokenVisualization";
import { GrammarRules } from "@/components/GrammarRules";
import { TreeVisualization } from "@/components/TreeVisualization";
import { EvaluationResult } from "@/components/EvaluationResult";
import { ExportResults } from "@/components/ExportResults";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [evaluationData, setEvaluationData] = useState<{ result: number | null; error?: string; programOutput?: ExecutionResult } | null>(null);

  const handleParse = () => {
    if (!expression.trim()) {
      toast.error("Please enter an expression to parse");
      return;
    }

    // Get tokens from lexer
    const lexer = new Lexer(expression);
    const tokenList = lexer.tokenize();
    setTokens(tokenList);

    const parseResult = parseExpression(expression);
    setResult(parseResult);

    // Try to execute C program or evaluate arithmetic
    if (parseResult.success && parseResult.tree) {
      try {
        // Try executing as C program first
        const execResult = executeProgram(parseResult.tree);
        
        if (execResult.error) {
          setEvaluationData({ result: null, error: execResult.error, programOutput: execResult });
          toast.error("Execution error: " + execResult.error);
        } else {
          setEvaluationData({ result: execResult.returnValue || 0, programOutput: execResult });
          toast.success("Program executed successfully!");
        }
      } catch (error) {
        // If execution fails, try arithmetic evaluation
        try {
          const evalResult = evaluateAST(parseResult.tree);
          setEvaluationData({ result: evalResult });
          toast.success("Expression parsed and evaluated successfully!");
        } catch (evalError) {
          setEvaluationData({ result: null, error: evalError instanceof Error ? evalError.message : "Evaluation failed" });
          toast.success("Expression parsed successfully!");
        }
      }
    } else {
      setEvaluationData(null);
      toast.error("Syntax error detected");
    }
  };

  const handleClear = () => {
    setExpression("");
    setResult(null);
    setTokens([]);
    setEvaluationData(null);
  };

  const handleExampleSelect = (example: string) => {
    setExpression(example);
    setResult(null);
    setTokens([]);
    setEvaluationData(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleParse();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            Mini Parser with Error Suggestions
          </h1>
          <p className="text-muted-foreground text-lg mb-2">
            Comprehensive C & Arithmetic Expression Parser with Error Recovery
          </p>
          <p className="text-sm text-muted-foreground">
            Lexical Analysis • Syntax Analysis • Semantic Evaluation • Error Detection & Recovery
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-lg">
            <div onKeyDown={handleKeyPress}>
              <ParserInput
                value={expression}
                onChange={setExpression}
                error={result?.errors?.[0]}
              />

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleParse}
                  className="flex-1 gap-2"
                  disabled={!expression.trim()}
                >
                  <PlayCircle className="w-4 h-4" />
                  Parse Expression
                  <span className="ml-auto text-xs opacity-70">Ctrl+Enter</span>
                </Button>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear
                </Button>
                {result && (
                  <ExportResults 
                    expression={expression}
                    result={result}
                    tokens={tokens}
                    evaluation={evaluationData?.result || null}
                  />
                )}
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm">
              <Tabs defaultValue="c-examples" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="c-examples">C Programs</TabsTrigger>
                  <TabsTrigger value="arithmetic">Arithmetic</TabsTrigger>
                </TabsList>
                
                <TabsContent value="c-examples">
                  <CExamples onSelectExample={handleExampleSelect} />
                </TabsContent>
                
                <TabsContent value="arithmetic">
                  <ExampleExpressions onSelect={handleExampleSelect} />
                </TabsContent>
              </Tabs>
            </Card>
            <GrammarRules />
          </div>

          {tokens.length > 0 && <TokenVisualization tokens={tokens} />}

          {result && (
            <Tabs defaultValue="output" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="output">Parse Output</TabsTrigger>
                <TabsTrigger value="tree" disabled={!result.success}>Visual Tree</TabsTrigger>
                <TabsTrigger value="eval" disabled={!evaluationData}>Evaluation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="output" className="mt-6">
                <ParseOutput result={result} />
              </TabsContent>
              
              <TabsContent value="tree" className="mt-6">
                {result.tree && <TreeVisualization tree={result.tree} />}
              </TabsContent>
              
              <TabsContent value="eval" className="mt-6">
                {evaluationData && <EvaluationResult evaluationData={evaluationData} />}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
