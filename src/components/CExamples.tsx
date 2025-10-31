import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, CheckCircle2, XCircle } from "lucide-react";

interface CExamplesProps {
  onSelectExample: (expression: string) => void;
}

export const CExamples = ({ onSelectExample }: CExamplesProps) => {
  const validExamples = [
    {
      title: "Factorial Program",
      code: "#include <stdio.h>\n\nint factorial(int n) {\n  if (n <= 1) {\n    return 1;\n  }\n  return n * factorial(n - 1);\n}\n\nint main() {\n  int num = 5;\n  int result = factorial(num);\n  return 0;\n}",
      description: "Recursive factorial calculation"
    },
    {
      title: "Prime Number Check",
      code: "#include <stdio.h>\n\nint isPrime(int n) {\n  if (n <= 1) {\n    return 0;\n  }\n  for (int i = 2; i < n; i++) {\n    if (n % i == 0) {\n      return 0;\n    }\n  }\n  return 1;\n}",
      description: "Function to check if number is prime"
    },
    {
      title: "Palindrome Check",
      code: "int isPalindrome(int n) {\n  int reversed = 0;\n  int original = n;\n  while (n > 0) {\n    reversed = reversed * 10 + n % 10;\n    n = n / 10;\n  }\n  if (original == reversed) {\n    return 1;\n  }\n  return 0;\n}",
      description: "Check if number is palindrome"
    },
    {
      title: "Array Operations",
      code: "int main() {\n  int arr[5];\n  int sum = 0;\n  for (int i = 0; i < 5; i++) {\n    arr[i] = i * 2;\n    sum += arr[i];\n  }\n  return 0;\n}",
      description: "Array declaration and manipulation"
    },
    {
      title: "Pointer Usage",
      code: "int main() {\n  int x = 10;\n  int *ptr = &x;\n  int value = *ptr;\n  *ptr = 20;\n  return 0;\n}",
      description: "Pointer operations and dereferencing"
    },
    {
      title: "Switch Statement",
      code: "void checkGrade(int score) {\n  switch (score) {\n    case 90:\n      grade = 'A';\n      break;\n    case 80:\n      grade = 'B';\n      break;\n    default:\n      grade = 'F';\n      break;\n  }\n}",
      description: "Switch-case for grade evaluation"
    },
    {
      title: "Do-While Loop",
      code: "int main() {\n  int i = 0;\n  do {\n    i++;\n  } while (i < 5);\n  return 0;\n}",
      description: "Do-while loop example"
    },
    {
      title: "Fibonacci Sequence",
      code: "int fibonacci(int n) {\n  if (n <= 1) {\n    return n;\n  }\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}",
      description: "Recursive Fibonacci calculation"
    },
    {
      title: "String Operations",
      code: "int main() {\n  char str[100] = \"Hello\";\n  char ch = 'A';\n  return 0;\n}",
      description: "String and character handling"
    },
    {
      title: "Function with Printf",
      code: "#include <stdio.h>\n\nint main() {\n  int x = 42;\n  printf(\"Value: %d\", x);\n  return 0;\n}",
      description: "Printf function call"
    },
    {
      title: "Compound Operators",
      code: "int main() {\n  int x = 10;\n  x += 5;\n  x -= 3;\n  x *= 2;\n  x /= 4;\n  return 0;\n}",
      description: "Using compound assignment operators"
    },
    {
      title: "Break & Continue",
      code: "int main() {\n  for (int i = 0; i < 10; i++) {\n    if (i == 5) {\n      continue;\n    }\n    if (i == 8) {\n      break;\n    }\n  }\n  return 0;\n}",
      description: "Loop control with break and continue"
    }
  ];

  const invalidExamples = [
    {
      title: "Missing Semicolon",
      code: "int x = 5",
      error: "Missing semicolon after declaration"
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
      title: "Unclosed String",
      code: "char str[] = \"Hello;",
      error: "String literal not closed"
    },
    {
      title: "Missing Array Size",
      code: "int arr[];",
      error: "Array declared without size"
    },
    {
      title: "Invalid Break",
      code: "int main() {\n  break;\n  return 0;\n}",
      error: "Break outside loop or switch"
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
