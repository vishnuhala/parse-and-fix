export type TokenType = 
  | 'NUMBER' 
  | 'OPERATOR' 
  | 'LPAREN' 
  | 'RPAREN' 
  | 'EOF' 
  | 'INVALID'
  | 'KEYWORD'
  | 'IDENTIFIER'
  | 'SEMICOLON'
  | 'LBRACE'
  | 'RBRACE'
  | 'COMMA'
  | 'ASSIGN'
  | 'COMPARISON'
  | 'LOGICAL';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

export interface ParseError {
  message: string;
  position: number;
  suggestion: string;
}

export interface ParseResult {
  success: boolean;
  tree?: ASTNode;
  errors?: ParseError[];
}

export interface ASTNode {
  type: 'number' | 'binary_op' | 'declaration' | 'assignment' | 'identifier' | 'if_statement' | 'while_loop' | 'for_loop' | 'function' | 'block' | 'return' | 'program';
  value?: number | string | ASTNode;
  operator?: string;
  left?: ASTNode;
  right?: ASTNode;
  dataType?: string;
  identifier?: string;
  init?: ASTNode;
  condition?: ASTNode;
  body?: ASTNode | ASTNode[];
  increment?: ASTNode;
  elseBranch?: ASTNode;
  parameters?: ASTNode[];
  returnType?: string;
  statements?: ASTNode[];
}

export class Lexer {
  private input: string;
  private position: number = 0;
  private keywords = new Set([
    'int', 'float', 'char', 'void', 'if', 'else', 'while', 'for', 
    'return', 'break', 'continue', 'struct', 'const', 'do', 'switch',
    'case', 'default', 'double', 'long', 'short', 'unsigned', 'signed'
  ]);

  constructor(input: string) {
    this.input = input.trim();
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    
    while (this.position < this.input.length) {
      // Skip whitespace
      if (/\s/.test(this.input[this.position])) {
        this.position++;
        continue;
      }

      // Skip single-line comments
      if (this.input[this.position] === '/' && this.input[this.position + 1] === '/') {
        while (this.position < this.input.length && this.input[this.position] !== '\n') {
          this.position++;
        }
        continue;
      }

      // Skip multi-line comments
      if (this.input[this.position] === '/' && this.input[this.position + 1] === '*') {
        this.position += 2;
        while (this.position < this.input.length - 1) {
          if (this.input[this.position] === '*' && this.input[this.position + 1] === '/') {
            this.position += 2;
            break;
          }
          this.position++;
        }
        continue;
      }

      const char = this.input[this.position];
      
      // Numbers
      if (/\d/.test(char)) {
        tokens.push(this.readNumber());
        continue;
      }

      // Identifiers and keywords
      if (/[a-zA-Z_]/.test(char)) {
        tokens.push(this.readIdentifier());
        continue;
      }

      // Comparison and logical operators
      if (char === '=' && this.input[this.position + 1] === '=') {
        tokens.push({ type: 'COMPARISON', value: '==', position: this.position });
        this.position += 2;
        continue;
      }
      if (char === '!' && this.input[this.position + 1] === '=') {
        tokens.push({ type: 'COMPARISON', value: '!=', position: this.position });
        this.position += 2;
        continue;
      }
      if (char === '<' && this.input[this.position + 1] === '=') {
        tokens.push({ type: 'COMPARISON', value: '<=', position: this.position });
        this.position += 2;
        continue;
      }
      if (char === '>' && this.input[this.position + 1] === '=') {
        tokens.push({ type: 'COMPARISON', value: '>=', position: this.position });
        this.position += 2;
        continue;
      }
      if (char === '&' && this.input[this.position + 1] === '&') {
        tokens.push({ type: 'LOGICAL', value: '&&', position: this.position });
        this.position += 2;
        continue;
      }
      if (char === '|' && this.input[this.position + 1] === '|') {
        tokens.push({ type: 'LOGICAL', value: '||', position: this.position });
        this.position += 2;
        continue;
      }
      if (char === '<') {
        tokens.push({ type: 'COMPARISON', value: '<', position: this.position });
        this.position++;
        continue;
      }
      if (char === '>') {
        tokens.push({ type: 'COMPARISON', value: '>', position: this.position });
        this.position++;
        continue;
      }
      if (char === '!') {
        tokens.push({ type: 'LOGICAL', value: '!', position: this.position });
        this.position++;
        continue;
      }

      // Assignment
      if (char === '=') {
        tokens.push({ type: 'ASSIGN', value: '=', position: this.position });
        this.position++;
        continue;
      }
      
      // Arithmetic operators
      if (['+', '-', '*', '/', '%', '^'].includes(char)) {
        tokens.push({ type: 'OPERATOR', value: char, position: this.position });
        this.position++;
        continue;
      }
      
      // Delimiters
      if (char === '(') {
        tokens.push({ type: 'LPAREN', value: char, position: this.position });
        this.position++;
        continue;
      }
      if (char === ')') {
        tokens.push({ type: 'RPAREN', value: char, position: this.position });
        this.position++;
        continue;
      }
      if (char === '{') {
        tokens.push({ type: 'LBRACE', value: char, position: this.position });
        this.position++;
        continue;
      }
      if (char === '}') {
        tokens.push({ type: 'RBRACE', value: char, position: this.position });
        this.position++;
        continue;
      }
      if (char === ';') {
        tokens.push({ type: 'SEMICOLON', value: char, position: this.position });
        this.position++;
        continue;
      }
      if (char === ',') {
        tokens.push({ type: 'COMMA', value: char, position: this.position });
        this.position++;
        continue;
      }
      
      // Invalid character
      tokens.push({ type: 'INVALID', value: char, position: this.position });
      this.position++;
    }
    
    tokens.push({ type: 'EOF', value: '', position: this.position });
    return tokens;
  }

  private readIdentifier(): Token {
    const start = this.position;
    let identifier = '';
    
    while (this.position < this.input.length && /[a-zA-Z0-9_]/.test(this.input[this.position])) {
      identifier += this.input[this.position];
      this.position++;
    }
    
    const type = this.keywords.has(identifier) ? 'KEYWORD' : 'IDENTIFIER';
    return { type, value: identifier, position: start };
  }

  private readNumber(): Token {
    const start = this.position;
    let numStr = '';
    let hasDot = false;
    
    while (this.position < this.input.length) {
      const char = this.input[this.position];
      
      if (/\d/.test(char)) {
        numStr += char;
        this.position++;
      } else if (char === '.' && !hasDot) {
        hasDot = true;
        numStr += char;
        this.position++;
      } else {
        break;
      }
    }
    
    return {
      type: 'NUMBER',
      value: numStr,
      position: start
    };
  }
}

class Parser {
  private tokens: Token[];
  private current: number = 0;
  private errors: ParseError[] = [];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): ParseResult {
    try {
      // Check for invalid tokens first
      const invalidToken = this.tokens.find(t => t.type === 'INVALID');
      if (invalidToken) {
        this.errors.push({
          message: `Invalid character '${invalidToken.value}'`,
          position: invalidToken.position,
          suggestion: `Remove '${invalidToken.value}' or use valid characters`
        });
        return { success: false, errors: this.errors };
      }

      // Check if this looks like C code (has keywords, semicolons, or braces)
      const hasCFeatures = this.tokens.some(t => 
        t.type === 'KEYWORD' || t.type === 'SEMICOLON' || 
        t.type === 'LBRACE' || t.type === 'RBRACE' || t.type === 'IDENTIFIER'
      );

      let tree: ASTNode;
      if (hasCFeatures) {
        tree = this.program();
      } else {
        tree = this.expression();
      }
      
      if (this.currentToken().type !== 'EOF') {
        const token = this.currentToken();
        this.errors.push({
          message: `Unexpected token '${token.value}'`,
          position: token.position,
          suggestion: 'Check for missing operators, semicolons, or braces'
        });
      }
      
      if (this.errors.length > 0) {
        return { success: false, errors: this.errors };
      }
      
      return { success: true, tree };
    } catch (error) {
      return { success: false, errors: this.errors };
    }
  }

  // C Program parsing
  private program(): ASTNode {
    const statements: ASTNode[] = [];
    
    while (this.currentToken().type !== 'EOF') {
      statements.push(this.statement());
    }
    
    return {
      type: 'program',
      statements
    };
  }

  private statement(): ASTNode {
    const token = this.currentToken();
    
    // Declaration
    if (token.type === 'KEYWORD' && ['int', 'float', 'char', 'void', 'double'].includes(token.value)) {
      return this.declaration();
    }
    
    // Control structures
    if (token.type === 'KEYWORD' && token.value === 'if') {
      return this.ifStatement();
    }
    if (token.type === 'KEYWORD' && token.value === 'while') {
      return this.whileLoop();
    }
    if (token.type === 'KEYWORD' && token.value === 'for') {
      return this.forLoop();
    }
    if (token.type === 'KEYWORD' && token.value === 'return') {
      return this.returnStatement();
    }
    
    // Block
    if (token.type === 'LBRACE') {
      return this.block();
    }
    
    // Assignment or expression statement
    if (token.type === 'IDENTIFIER') {
      return this.assignmentOrExpression();
    }
    
    this.errors.push({
      message: `Unexpected token '${token.value}'`,
      position: token.position,
      suggestion: 'Expected declaration, statement, or expression'
    });
    throw new Error('Unexpected token');
  }

  private declaration(): ASTNode {
    const dataType = this.advance().value; // int, float, char, etc.
    
    if (this.currentToken().type !== 'IDENTIFIER') {
      this.errors.push({
        message: 'Expected identifier after type',
        position: this.currentToken().position,
        suggestion: `Add variable name after '${dataType}'`
      });
      throw new Error('Expected identifier');
    }
    
    const identifier = this.advance().value;
    let init: ASTNode | undefined;
    
    // Check for function declaration
    if (this.currentToken().type === 'LPAREN') {
      return this.functionDeclaration(dataType, identifier);
    }
    
    // Variable initialization
    if (this.currentToken().type === 'ASSIGN') {
      this.advance();
      init = this.expression();
    }
    
    if (this.currentToken().type !== 'SEMICOLON') {
      this.errors.push({
        message: 'Missing semicolon',
        position: this.currentToken().position,
        suggestion: `Add ';' after declaration`
      });
      throw new Error('Missing semicolon');
    }
    this.advance();
    
    return {
      type: 'declaration',
      dataType,
      identifier,
      init
    };
  }

  private functionDeclaration(returnType: string, name: string): ASTNode {
    this.advance(); // consume (
    
    const parameters: ASTNode[] = [];
    if (this.currentToken().type !== 'RPAREN') {
      // Parse parameters
      while (true) {
        if (this.currentToken().type === 'KEYWORD') {
          const paramType = this.advance().value;
          if (this.currentToken().type === 'IDENTIFIER') {
            const paramName = this.advance().value;
            parameters.push({
              type: 'declaration',
              dataType: paramType,
              identifier: paramName
            });
          }
        }
        
        if (this.currentToken().type === 'COMMA') {
          this.advance();
        } else {
          break;
        }
      }
    }
    
    if (this.currentToken().type !== 'RPAREN') {
      this.errors.push({
        message: 'Missing closing parenthesis in function declaration',
        position: this.currentToken().position,
        suggestion: 'Add ) after parameters'
      });
      throw new Error('Missing )');
    }
    this.advance();
    
    const body = this.block();
    
    return {
      type: 'function',
      returnType,
      identifier: name,
      parameters,
      body
    };
  }

  private block(): ASTNode {
    if (this.currentToken().type !== 'LBRACE') {
      this.errors.push({
        message: 'Expected {',
        position: this.currentToken().position,
        suggestion: 'Add { to start block'
      });
      throw new Error('Expected {');
    }
    this.advance();
    
    const statements: ASTNode[] = [];
    while (this.currentToken().type !== 'RBRACE' && this.currentToken().type !== 'EOF') {
      statements.push(this.statement());
    }
    
    if (this.currentToken().type !== 'RBRACE') {
      this.errors.push({
        message: 'Missing closing brace',
        position: this.currentToken().position,
        suggestion: 'Add } to close block'
      });
      throw new Error('Missing }');
    }
    this.advance();
    
    return {
      type: 'block',
      statements
    };
  }

  private ifStatement(): ASTNode {
    this.advance(); // consume 'if'
    
    if (this.currentToken().type !== 'LPAREN') {
      this.errors.push({
        message: 'Expected ( after if',
        position: this.currentToken().position,
        suggestion: 'Add ( before condition'
      });
      throw new Error('Expected (');
    }
    this.advance();
    
    const condition = this.expression();
    
    if (this.currentToken().type !== 'RPAREN') {
      this.errors.push({
        message: 'Expected ) after condition',
        position: this.currentToken().position,
        suggestion: 'Add ) after if condition'
      });
      throw new Error('Expected )');
    }
    this.advance();
    
    const body = this.currentToken().type === 'LBRACE' ? this.block() : this.statement();
    
    let elseBranch: ASTNode | undefined;
    if (this.currentToken().type === 'KEYWORD' && this.currentToken().value === 'else') {
      this.advance();
      elseBranch = this.currentToken().type === 'LBRACE' ? this.block() : this.statement();
    }
    
    return {
      type: 'if_statement',
      condition,
      body,
      elseBranch
    };
  }

  private whileLoop(): ASTNode {
    this.advance(); // consume 'while'
    
    if (this.currentToken().type !== 'LPAREN') {
      this.errors.push({
        message: 'Expected ( after while',
        position: this.currentToken().position,
        suggestion: 'Add ( before condition'
      });
      throw new Error('Expected (');
    }
    this.advance();
    
    const condition = this.expression();
    
    if (this.currentToken().type !== 'RPAREN') {
      this.errors.push({
        message: 'Expected ) after condition',
        position: this.currentToken().position,
        suggestion: 'Add ) after while condition'
      });
      throw new Error('Expected )');
    }
    this.advance();
    
    const body = this.currentToken().type === 'LBRACE' ? this.block() : this.statement();
    
    return {
      type: 'while_loop',
      condition,
      body
    };
  }

  private forLoop(): ASTNode {
    this.advance(); // consume 'for'
    
    if (this.currentToken().type !== 'LPAREN') {
      this.errors.push({
        message: 'Expected ( after for',
        position: this.currentToken().position,
        suggestion: 'Add ( before for clauses'
      });
      throw new Error('Expected (');
    }
    this.advance();
    
    const init = this.currentToken().type === 'SEMICOLON' ? undefined : this.statement();
    const condition = this.currentToken().type === 'SEMICOLON' ? undefined : this.expression();
    
    if (this.currentToken().type === 'SEMICOLON') {
      this.advance();
    }
    
    const increment = this.currentToken().type === 'RPAREN' ? undefined : this.assignmentOrExpression();
    
    if (this.currentToken().type !== 'RPAREN') {
      this.errors.push({
        message: 'Expected ) after for clauses',
        position: this.currentToken().position,
        suggestion: 'Add ) after for loop header'
      });
      throw new Error('Expected )');
    }
    this.advance();
    
    const body = this.currentToken().type === 'LBRACE' ? this.block() : this.statement();
    
    return {
      type: 'for_loop',
      init,
      condition,
      increment,
      body
    };
  }

  private returnStatement(): ASTNode {
    this.advance(); // consume 'return'
    
    let value: ASTNode | undefined;
    if (this.currentToken().type !== 'SEMICOLON') {
      value = this.expression();
    }
    
    if (this.currentToken().type !== 'SEMICOLON') {
      this.errors.push({
        message: 'Missing semicolon after return',
        position: this.currentToken().position,
        suggestion: 'Add ; after return statement'
      });
      throw new Error('Missing semicolon');
    }
    this.advance();
    
    return {
      type: 'return',
      value
    };
  }

  private assignmentOrExpression(): ASTNode {
    const identifier = this.advance().value;
    
    if (this.currentToken().type === 'ASSIGN') {
      this.advance();
      const value = this.expression();
      
      if (this.currentToken().type === 'SEMICOLON') {
        this.advance();
      }
      
      return {
        type: 'assignment',
        identifier,
        value
      };
    }
    
    // It's just an identifier in an expression
    this.current--; // back up
    const expr = this.expression();
    
    if (this.currentToken().type === 'SEMICOLON') {
      this.advance();
    }
    
    return expr;
  }

  private currentToken(): Token {
    return this.tokens[this.current] || this.tokens[this.tokens.length - 1];
  }

  private advance(): Token {
    const token = this.currentToken();
    if (this.current < this.tokens.length - 1) {
      this.current++;
    }
    return token;
  }

  private expression(): ASTNode {
    return this.additive();
  }

  private additive(): ASTNode {
    let left = this.multiplicative();
    
    while (this.currentToken().type === 'OPERATOR' && 
           ['+', '-'].includes(this.currentToken().value)) {
      const operator = this.advance().value;
      const right = this.multiplicative();
      left = {
        type: 'binary_op',
        operator,
        left,
        right
      };
    }
    
    return left;
  }

  private multiplicative(): ASTNode {
    let left = this.power();
    
    while (this.currentToken().type === 'OPERATOR' && 
           ['*', '/', '%'].includes(this.currentToken().value)) {
      const operator = this.advance().value;
      const right = this.power();
      left = {
        type: 'binary_op',
        operator,
        left,
        right
      };
    }
    
    return left;
  }

  private power(): ASTNode {
    let left = this.primary();
    
    if (this.currentToken().type === 'OPERATOR' && 
        this.currentToken().value === '^') {
      const operator = this.advance().value;
      const right = this.power(); // Right associative
      return {
        type: 'binary_op',
        operator,
        left,
        right
      };
    }
    
    return left;
  }

  private primary(): ASTNode {
    const token = this.currentToken();
    
    if (token.type === 'NUMBER') {
      this.advance();
      return {
        type: 'number',
        value: parseFloat(token.value)
      };
    }

    if (token.type === 'IDENTIFIER') {
      this.advance();
      return {
        type: 'identifier',
        value: token.value
      };
    }
    
    if (token.type === 'LPAREN') {
      this.advance();
      const expr = this.expression();
      
      if (this.currentToken().type !== 'RPAREN') {
        this.errors.push({
          message: 'Missing closing parenthesis',
          position: token.position,
          suggestion: `Add ')' after position ${this.currentToken().position}`
        });
        throw new Error('Missing closing parenthesis');
      }
      
      this.advance();
      return expr;
    }
    
    if (token.type === 'RPAREN') {
      this.errors.push({
        message: 'Unexpected closing parenthesis',
        position: token.position,
        suggestion: 'Remove extra ) or add matching ( before it'
      });
      throw new Error('Unexpected )');
    }
    
    if (token.type === 'OPERATOR') {
      // Unary operators
      if (['+', '-'].includes(token.value)) {
        const operator = this.advance().value;
        const operand = this.primary();
        return {
          type: 'binary_op',
          operator: operator === '-' ? 'unary_neg' : 'unary_pos',
          left: { type: 'number', value: 0 },
          right: operand
        };
      }
      
      this.errors.push({
        message: `Expected number or '(' but got operator '${token.value}'`,
        position: token.position,
        suggestion: 'Add a number or expression before the operator'
      });
      throw new Error('Unexpected operator');
    }
    
    this.errors.push({
      message: `Expected number or '(' but got '${token.value}'`,
      position: token.position,
      suggestion: 'Expression must start with a number or ('
    });
    throw new Error('Unexpected token');
  }
}

export function parseExpression(input: string): ParseResult {
  if (!input.trim()) {
    return {
      success: false,
      errors: [{
        message: 'Empty expression',
        position: 0,
        suggestion: 'Enter an arithmetic expression (e.g., 2 + 3 * 4)'
      }]
    };
  }

  const lexer = new Lexer(input);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  return parser.parse();
}

export function formatTree(node: ASTNode, indent: number = 0): string {
  const spaces = '  '.repeat(indent);
  
  if (node.type === 'number') {
    return `${spaces}Number: ${node.value}`;
  }

  if (node.type === 'identifier') {
    return `${spaces}Identifier: ${node.value}`;
  }
  
  if (node.type === 'binary_op') {
    let result = `${spaces}Operation: ${node.operator}\n`;
    if (node.left) {
      result += formatTree(node.left, indent + 1) + '\n';
    }
    if (node.right) {
      result += formatTree(node.right, indent + 1);
    }
    return result;
  }

  if (node.type === 'program') {
    let result = `${spaces}Program\n`;
    node.statements?.forEach(stmt => {
      result += formatTree(stmt, indent + 1) + '\n';
    });
    return result;
  }

  if (node.type === 'declaration') {
    let result = `${spaces}Declaration: ${node.dataType} ${node.identifier}`;
    if (node.init) {
      result += `\n${spaces}  = \n${formatTree(node.init, indent + 2)}`;
    }
    return result;
  }

  if (node.type === 'assignment') {
    let result = `${spaces}Assignment: ${node.identifier}\n`;
    if (node.value && typeof node.value === 'object' && 'type' in node.value) {
      result += formatTree(node.value as ASTNode, indent + 1);
    }
    return result;
  }

  if (node.type === 'function') {
    let result = `${spaces}Function: ${node.returnType} ${node.identifier}(`;
    result += node.parameters?.map(p => `${p.dataType} ${p.identifier}`).join(', ') || '';
    result += `)\n`;
    if (node.body) {
      if (Array.isArray(node.body)) {
        node.body.forEach(stmt => {
          result += formatTree(stmt, indent + 1) + '\n';
        });
      } else {
        result += formatTree(node.body as ASTNode, indent + 1);
      }
    }
    return result;
  }

  if (node.type === 'block') {
    let result = `${spaces}Block\n`;
    node.statements?.forEach(stmt => {
      result += formatTree(stmt, indent + 1) + '\n';
    });
    return result;
  }

  if (node.type === 'if_statement') {
    let result = `${spaces}If Statement\n`;
    result += `${spaces}  Condition:\n${formatTree(node.condition!, indent + 2)}\n`;
    const body = Array.isArray(node.body) ? node.body[0] : node.body!;
    result += `${spaces}  Then:\n${formatTree(body, indent + 2)}`;
    if (node.elseBranch) {
      result += `\n${spaces}  Else:\n${formatTree(node.elseBranch, indent + 2)}`;
    }
    return result;
  }

  if (node.type === 'while_loop') {
    let result = `${spaces}While Loop\n`;
    result += `${spaces}  Condition:\n${formatTree(node.condition!, indent + 2)}\n`;
    const body = Array.isArray(node.body) ? node.body[0] : node.body!;
    result += `${spaces}  Body:\n${formatTree(body, indent + 2)}`;
    return result;
  }

  if (node.type === 'for_loop') {
    let result = `${spaces}For Loop\n`;
    if (node.init) result += `${spaces}  Init:\n${formatTree(node.init, indent + 2)}\n`;
    if (node.condition) result += `${spaces}  Condition:\n${formatTree(node.condition, indent + 2)}\n`;
    if (node.increment) result += `${spaces}  Increment:\n${formatTree(node.increment, indent + 2)}\n`;
    const body = Array.isArray(node.body) ? node.body[0] : node.body!;
    result += `${spaces}  Body:\n${formatTree(body, indent + 2)}`;
    return result;
  }

  if (node.type === 'return') {
    let result = `${spaces}Return`;
    if (node.value && typeof node.value === 'object' && 'type' in node.value) {
      result += `\n${formatTree(node.value as ASTNode, indent + 1)}`;
    }
    return result;
  }
  
  return `${spaces}Unknown: ${node.type}`;
}

export function evaluateAST(node: ASTNode): number {
  if (node.type === 'number') {
    return node.value as number || 0;
  }

  if (node.type === 'identifier') {
    throw new Error(`Cannot evaluate identifier '${node.value}' without variable context`);
  }
  
  if (node.type === 'binary_op' && node.left && node.right) {
    const left = evaluateAST(node.left);
    const right = evaluateAST(node.right);
    
    switch (node.operator) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        if (right === 0) throw new Error('Division by zero');
        return left / right;
      case '%':
        return left % right;
      case '^':
        return Math.pow(left, right);
      case 'unary_neg':
        return -right;
      case 'unary_pos':
        return right;
      default:
        throw new Error(`Unknown operator: ${node.operator}`);
    }
  }

  if (node.type === 'program' || node.type === 'declaration' || 
      node.type === 'function' || node.type === 'if_statement' ||
      node.type === 'while_loop' || node.type === 'for_loop') {
    throw new Error('Cannot evaluate C program structure - this parser focuses on syntax analysis');
  }
  
  throw new Error(`Invalid AST node type: ${node.type}`);
}
