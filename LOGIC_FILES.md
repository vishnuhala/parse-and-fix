# Core Logic Files - Mini Parser

This document lists the core logic files in the project that contain the actual parsing, lexing, and interpretation logic (excluding frontend/UI code).

## Main Logic File

### src/lib/parser.ts
This is the **primary logic file** containing all the core functionality:

**Location:** `src/lib/parser.ts` (approximately 2000 lines)

**Contents:**
1. **Type Definitions** (lines 1-71)
   - `TokenType` - All supported token types
   - `Token` interface - Token structure with type, value, and position
   - `ParseError` interface - Error reporting structure
   - `ParseResult` interface - Parsing result structure
   - `ASTNode` interface - Abstract Syntax Tree node structure
   - `ExecutionResult` interface - Program execution result

2. **Lexer Class** (lines 73-407)
   - Tokenizes input C code and arithmetic expressions
   - Handles:
     - Whitespace and comments (single-line `//` and multi-line `/* */`)
     - Preprocessor directives (`#include`, `#define`, etc.)
     - String literals and character constants
     - Numbers (integers and floating-point)
     - Identifiers and keywords
     - Operators (arithmetic, logical, comparison, assignment)
     - Delimiters (parentheses, braces, brackets, semicolons)
   
   **Key Methods:**
   - `tokenize()` - Main tokenization method
   - `readIdentifier()` - Reads variable/function names
   - `readNumber()` - Reads numeric literals
   - `readString()` - Reads string literals
   - `readChar()` - Reads character literals

3. **Parser Class** (lines 409-1736)
   - Converts tokens into an Abstract Syntax Tree (AST)
   - Implements recursive descent parsing
   - Supports:
     - C program structure (functions, variables, statements)
     - Control flow (if-else, while, do-while, for, switch-case)
     - Expressions (arithmetic, logical, comparison, assignment)
     - Function calls and definitions
     - Arrays and pointers (basic support)
     - Preprocessor directives
   
   **Key Methods:**
   - `parse()` - Entry point for parsing
   - `program()` - Parses entire C program structure
   - `statement()` - Parses individual statements
   - `expression()` - Parses expressions with operator precedence
   - `ifStatement()`, `whileLoop()`, `forLoop()`, `switchStatement()` - Control flow parsing
   - `functionDeclaration()` - Parses function definitions
   - `evaluateAST()` - Evaluates arithmetic expressions from AST

4. **Interpreter Class** (lines 1738-2002)
   - Executes the generated AST
   - Runtime environment for C programs
   - Manages:
     - Variable storage and scope
     - Function calls and returns
     - Control flow execution (loops, conditionals, switch)
     - Printf output simulation
     - Execution step tracking
   
   **Key Methods:**
   - `execute()` - Executes an AST node
   - `interpretNode()` - Interprets specific node types
   - `callFunction()` - Handles function invocation
   - `evaluateBinaryOp()` - Evaluates binary operations
   - `printf()` - Basic printf implementation
   
   **Main Entry Point:**
   - `executeProgram(ast: ASTNode)` - Executes a complete C program and returns results

## How the Logic Works

### Flow Diagram:
```
Input Code
    ↓
[Lexer] → Tokenization
    ↓
Token Stream
    ↓
[Parser] → AST Construction
    ↓
Abstract Syntax Tree
    ↓
[Interpreter/Evaluator] → Execution
    ↓
Results (output, return value, variables)
```

### Example Usage:

```typescript
// For C Programs:
const code = `
int main() {
  int x = 5;
  int y = 3;
  printf("%d", x + y);
  return x + y;
}`;

const lexer = new Lexer(code);
const tokens = lexer.tokenize();
const parseResult = parseExpression(code);
if (parseResult.success && parseResult.tree) {
  const result = executeProgram(parseResult.tree);
  // result.output: ["8"]
  // result.returnValue: 8
  // result.variables: { x: 5, y: 3 }
}

// For Arithmetic Expressions:
const expr = "2 + 3 * 4 - 5";
const parseResult = parseExpression(expr);
if (parseResult.success && parseResult.tree) {
  const value = evaluateAST(parseResult.tree);
  // value: 9
}
```

## All Logic-Related Files Summary

1. **src/lib/parser.ts** - Main logic (Lexer, Parser, Interpreter)
2. **src/lib/utils.ts** - Utility functions (for class names, etc.)

That's it! The entire parsing, lexical analysis, and interpretation logic is contained in the single file: **src/lib/parser.ts**

## To Extract This File

You can find this file at: `src/lib/parser.ts` in your project directory.

This file is completely independent of the UI and can be used in any TypeScript/JavaScript project.
