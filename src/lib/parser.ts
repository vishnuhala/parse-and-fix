export type TokenType = 
  | 'NUMBER' 
  | 'OPERATOR' 
  | 'LPAREN' 
  | 'RPAREN' 
  | 'EOF' 
  | 'INVALID';

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
  type: 'number' | 'binary_op';
  value?: number;
  operator?: string;
  left?: ASTNode;
  right?: ASTNode;
}

class Lexer {
  private input: string;
  private position: number = 0;

  constructor(input: string) {
    this.input = input.trim();
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    
    while (this.position < this.input.length) {
      const char = this.input[this.position];
      
      if (/\s/.test(char)) {
        this.position++;
        continue;
      }
      
      if (/\d/.test(char)) {
        tokens.push(this.readNumber());
        continue;
      }
      
      if (['+', '-', '*', '/', '%', '^'].includes(char)) {
        tokens.push({
          type: 'OPERATOR',
          value: char,
          position: this.position
        });
        this.position++;
        continue;
      }
      
      if (char === '(') {
        tokens.push({
          type: 'LPAREN',
          value: char,
          position: this.position
        });
        this.position++;
        continue;
      }
      
      if (char === ')') {
        tokens.push({
          type: 'RPAREN',
          value: char,
          position: this.position
        });
        this.position++;
        continue;
      }
      
      tokens.push({
        type: 'INVALID',
        value: char,
        position: this.position
      });
      this.position++;
    }
    
    tokens.push({ type: 'EOF', value: '', position: this.position });
    return tokens;
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
          suggestion: `Remove '${invalidToken.value}' or use valid operators: +, -, *, /, %, ^, (, )`
        });
        return { success: false, errors: this.errors };
      }

      const tree = this.expression();
      
      if (this.currentToken().type !== 'EOF') {
        const token = this.currentToken();
        this.errors.push({
          message: `Unexpected token '${token.value}'`,
          position: token.position,
          suggestion: 'Check for missing operators or extra characters'
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
  
  return `${spaces}Unknown`;
}
