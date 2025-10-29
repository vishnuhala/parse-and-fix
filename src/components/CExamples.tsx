import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, CheckCircle2, XCircle } from "lucide-react";

interface CExamplesProps {
  onSelectExample: (expression: string) => void;
}

export const CExamples = ({ onSelectExample }: CExamplesProps) => {
  const validExamples = [
    {
      title: "Simple Declaration",
      code: "int x = 5;",
      description: "Variable declaration with initialization"
    },
    {
      title: "Multiple Declarations",
      code: "int a = 10;\nfloat b = 3.14;\nchar c;",
      description: "Multiple variable declarations"
    },
    {
      title: "Assignment Statement",
      code: "x = 10;",
      description: "Simple assignment to variable"
    },
    {
      title: "If Statement",
      code: "if (x > 5) {\n  y = 10;\n}",
      description: "Conditional statement with block"
    },
    {
      title: "If-Else Statement",
      code: "if (x > 0) {\n  y = 1;\n} else {\n  y = 0;\n}",
      description: "If-else with multiple statements"
    },
    {
      title: "While Loop",
      code: "while (x < 10) {\n  x = x + 1;\n}",
      description: "While loop with increment"
    },
    {
      title: "For Loop",
      code: "for (int i = 0; i < 10; i = i + 1) {\n  sum = sum + i;\n}",
      description: "For loop with initialization and increment"
    },
    {
      title: "Function Declaration",
      code: "int add(int a, int b) {\n  return a + b;\n}",
      description: "Function with parameters and return"
    },
    {
      title: "Nested If Statements",
      code: "if (x > 0) {\n  if (y > 0) {\n    z = 1;\n  }\n}",
      description: "Nested conditional statements"
    },
    {
      title: "Complex Expression",
      code: "int result = (a + b) * (c - d);",
      description: "Declaration with complex arithmetic"
    },
    {
      title: "Main Function",
      code: "int main() {\n  int x = 5;\n  return 0;\n}",
      description: "Complete main function structure"
    },
    {
      title: "Void Function",
      code: "void printHello() {\n  x = 1;\n}",
      description: "Void return type function"
    }
  ];

  const invalidExamples = [
    {
      title: "Missing Semicolon",
      code: "int x = 5",
      error: "Missing semicolon after declaration"
    },
    {
      title: "Missing Type",
      code: "x = 5;",
      error: "Variable used without declaration (context dependent)"
    },
    {
      title: "Unclosed Brace",
      code: "if (x > 5) {\n  y = 10;",
      error: "Missing closing brace }"
    },
    {
      title: "Missing Parenthesis",
      code: "if x > 5 {\n  y = 10;\n}",
      error: "Missing ( and ) around condition"
    },
    {
      title: "Invalid Character",
      code: "int x = 5@;",
      error: "Invalid character @ in expression"
    },
    {
      title: "Missing Function Body",
      code: "int add(int a, int b);",
      error: "Function declaration without body"
    },
    {
      title: "Unclosed Parenthesis",
      code: "int result = (a + b * c;",
      error: "Missing closing parenthesis"
    },
    {
      title: "Extra Closing Brace",
      code: "int x = 5;\n}",
      error: "Unexpected closing brace"
    },
    {
      title: "Missing Condition",
      code: "if () {\n  x = 5;\n}",
      error: "Empty condition in if statement"
    },
    {
      title: "Invalid Operator",
      code: "int x = 5 $ 3;",
      error: "Invalid operator $ used"
    },
    {
      title: "Missing Return Type",
      code: "add(int a, int b) {\n  return a + b;\n}",
      error: "Function missing return type"
    },
    {
      title: "Double Semicolon",
      code: "int x = 5;;",
      error: "Extra semicolon creates empty statement"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-success/10 border-success/30">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <h3 className="font-semibold text-success">Valid C Programs</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {validExamples.map((example, index) => (
            <Button
              key={index}
              onClick={() => onSelectExample(example.code)}
              variant="outline"
              className="h-auto min-h-[180px] flex flex-col items-start gap-3 p-4 hover:bg-success/20 border-success/30"
            >
              <div className="flex items-center gap-2 w-full flex-shrink-0">
                <Code2 className="w-4 h-4 text-success flex-shrink-0" />
                <span className="font-medium text-sm leading-tight">{example.title}</span>
              </div>
              <code className="text-xs font-mono text-left w-full bg-code-bg p-3 rounded whitespace-pre-wrap flex-grow overflow-auto max-h-[100px]">
                {example.code}
              </code>
              <p className="text-xs text-muted-foreground text-left w-full leading-relaxed flex-shrink-0">
                {example.description}
              </p>
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-error/10 border-error/30">
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="w-5 h-5 text-error" />
          <h3 className="font-semibold text-error">Invalid C Programs (With Errors)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invalidExamples.map((example, index) => (
            <Button
              key={index}
              onClick={() => onSelectExample(example.code)}
              variant="outline"
              className="h-auto min-h-[180px] flex flex-col items-start gap-3 p-4 hover:bg-error/20 border-error/30"
            >
              <div className="flex items-center gap-2 w-full flex-shrink-0">
                <XCircle className="w-4 h-4 text-error flex-shrink-0" />
                <span className="font-medium text-sm leading-tight">{example.title}</span>
              </div>
              <code className="text-xs font-mono text-left w-full bg-code-bg p-3 rounded whitespace-pre-wrap flex-grow overflow-auto max-h-[100px]">
                {example.code}
              </code>
              <p className="text-xs text-error text-left w-full leading-relaxed flex-shrink-0">
                ⚠️ {example.error}
              </p>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};
