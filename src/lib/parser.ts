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
  | 'LOGICAL'
  | 'INCREMENT'
  | 'DECREMENT'
  | 'COMPOUND_ASSIGN'
  | 'LBRACKET'
  | 'RBRACKET'
  | 'STRING'
  | 'CHAR'
  | 'PREPROCESSOR'
  | 'DOT'
  | 'ARROW'
  | 'AMPERSAND';

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
  type: string;
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
  parameters?: { type: string; name: string }[];
  returnType?: string;
  statements?: ASTNode[];
  size?: ASTNode;
  isArray?: boolean;
  isPointer?: boolean;
  arguments?: ASTNode[];
  test?: ASTNode;
  cases?: { value: ASTNode; body: ASTNode[] }[];
  default?: ASTNode[];
  directive?: string;
}

export class Lexer {
  private input: string;
  private position: number = 0;
  private keywords = new Set([
    'int', 'float', 'char', 'void', 'if', 'else', 'while', 'for', 
    'return', 'break', 'continue', 'struct', 'const', 'do', 'switch',
    'case', 'default', 'double', 'long', 'short', 'unsigned', 'signed',
    'sizeof', 'static', 'extern', 'auto', 'register', 'enum', 'union',
    'typedef', 'volatile', 'goto'
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

      // Preprocessor directives
      if (this.input[this.position] === '#') {
        const start = this.position;
        let directive = '';
        while (this.position < this.input.length && this.input[this.position] !== '\n') {
          directive += this.input[this.position];
          this.position++;
        }
        tokens.push({ type: 'PREPROCESSOR', value: directive, position: start });
        continue;
      }

      // String literals
      if (this.input[this.position] === '"') {
        tokens.push(this.readString());
        continue;
      }

      // Character literals
      if (this.input[this.position] === "'") {
        tokens.push(this.readChar());
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

      // Increment/Decrement
      if (char === '+' && this.input[this.position + 1] === '+') {
        tokens.push({ type: 'INCREMENT', value: '++', position: this.position });
        this.position += 2;
        continue;
      }
      if (char === '-' && this.input[this.position + 1] === '-') {
        tokens.push({ type: 'DECREMENT', value: '--', position: this.position });
        this.position += 2;
        continue;
      }

      // Compound assignments
      if (char === '+' && this.input[this.position + 1] === '=') {
        tokens.push({ type: 'COMPOUND_ASSIGN', value: '+=', position: this.position });
        this.position += 2;
        continue;
      }
      if (char === '-' && this.input[this.position + 1] === '=') {
        tokens.push({ type: 'COMPOUND_ASSIGN', value: '-=', position: this.position });
        this.position += 2;
        continue;
      }
      if (char === '*' && this.input[this.position + 1] === '=') {
        tokens.push({ type: 'COMPOUND_ASSIGN', value: '*=', position: this.position });
        this.position += 2;
        continue;
      }
      if (char === '/' && this.input[this.position + 1] === '=') {
        tokens.push({ type: 'COMPOUND_ASSIGN', value: '/=', position: this.position });
        this.position += 2;
        continue;
      }
      if (char === '%' && this.input[this.position + 1] === '=') {
        tokens.push({ type: 'COMPOUND_ASSIGN', value: '%=', position: this.position });
        this.position += 2;
        continue;
      }

      // Arrow operator
      if (char === '-' && this.input[this.position + 1] === '>') {
        tokens.push({ type: 'ARROW', value: '->', position: this.position });
        this.position += 2;
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

      // Address-of operator
      if (char === '&') {
        tokens.push({ type: 'AMPERSAND', value: '&', position: this.position });
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
      if (char === '[') {
        tokens.push({ type: 'LBRACKET', value: char, position: this.position });
        this.position++;
        continue;
      }
      if (char === ']') {
        tokens.push({ type: 'RBRACKET', value: char, position: this.position });
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
      if (char === '.') {
        tokens.push({ type: 'DOT', value: char, position: this.position });
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

  private readString(): Token {
    const start = this.position;
    let str = '"';
    this.position++; // skip opening "
    
    while (this.position < this.input.length && this.input[this.position] !== '"') {
      if (this.input[this.position] === '\\' && this.position + 1 < this.input.length) {
        str += this.input[this.position] + this.input[this.position + 1];
        this.position += 2;
      } else {
        str += this.input[this.position];
        this.position++;
      }
    }
    
    if (this.position < this.input.length && this.input[this.position] === '"') {
      str += '"';
      this.position++;
    }
    
    return { type: 'STRING', value: str, position: start };
  }

  private readChar(): Token {
    const start = this.position;
    let ch = "'";
    this.position++; // skip opening '
    
    while (this.position < this.input.length && this.input[this.position] !== "'") {
      ch += this.input[this.position];
      this.position++;
    }
    
    if (this.position < this.input.length && this.input[this.position] === "'") {
      ch += "'";
      this.position++;
    }
    
    return { type: 'CHAR', value: ch, position: start };
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

      // Check if this looks like C code
      const hasCFeatures = this.tokens.some(t => 
        t.type === 'KEYWORD' || t.type === 'SEMICOLON' || 
        t.type === 'LBRACE' || t.type === 'RBRACE' || 
        t.type === 'PREPROCESSOR'
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
      // Handle preprocessor directives
      if (this.currentToken().type === 'PREPROCESSOR') {
        statements.push({
          type: 'preprocessor',
          directive: this.currentToken().value
        });
        this.advance();
        continue;
      }
      
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
    if (token.type === 'KEYWORD' && ['int', 'float', 'char', 'void', 'double', 'long', 'short', 'unsigned', 'signed'].includes(token.value)) {
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
    if (token.type === 'KEYWORD' && token.value === 'do') {
      return this.doWhileLoop();
    }
    if (token.type === 'KEYWORD' && token.value === 'switch') {
      return this.switchStatement();
    }
    if (token.type === 'KEYWORD' && token.value === 'break') {
      this.advance();
      if (this.currentToken().type === 'SEMICOLON') {
        this.advance();
      }
      return { type: 'break' };
    }
    if (token.type === 'KEYWORD' && token.value === 'continue') {
      this.advance();
      if (this.currentToken().type === 'SEMICOLON') {
        this.advance();
      }
      return { type: 'continue' };
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
    const dataType = this.advance().value;
    
    // Handle pointer declarations
    let isPointer = false;
    while (this.currentToken().type === 'OPERATOR' && this.currentToken().value === '*') {
      isPointer = true;
      this.advance();
    }
    
    if (this.currentToken().type !== 'IDENTIFIER') {
      this.errors.push({
        message: 'Expected identifier after type',
        position: this.currentToken().position,
        suggestion: `Add variable name after '${dataType}'`
      });
      throw new Error('Expected identifier');
    }
    
    const identifier = this.advance().value;
    
    // Array declaration
    if (this.currentToken().type === 'LBRACKET') {
      this.advance();
      let size: ASTNode | undefined;
      
      if (this.currentToken().type === 'NUMBER') {
        size = { type: 'number', value: parseFloat(this.currentToken().value) };
        this.advance();
      }
      
      if (this.currentToken().type !== 'RBRACKET') {
        this.errors.push({
          message: 'Expected ] after array size',
          position: this.currentToken().position,
          suggestion: 'Add ] to close array declaration'
        });
        throw new Error('Missing ]');
      }
      this.advance();
      
      let init: ASTNode | undefined;
      if (this.currentToken().type === 'ASSIGN') {
        this.advance();
        init = this.expression();
      }
      
      if (this.currentToken().type !== 'SEMICOLON') {
        this.errors.push({
          message: 'Missing semicolon',
          position: this.currentToken().position,
          suggestion: 'Add ; after array declaration'
        });
        throw new Error('Missing semicolon');
      }
      this.advance();
      
      return {
        type: 'declaration',
        dataType,
        identifier,
        isArray: true,
        size,
        init,
        isPointer
      };
    }
    
    // Check for function declaration
    if (this.currentToken().type === 'LPAREN') {
      return this.functionDeclaration(dataType, identifier, isPointer);
    }
    
    // Variable initialization
    let init: ASTNode | undefined;
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
      init,
      isPointer
    };
  }

  private functionDeclaration(returnType: string, name: string, isPointer: boolean): ASTNode {
    this.advance(); // consume (
    
    const parameters: { type: string; name: string }[] = [];
    if (this.currentToken().type !== 'RPAREN') {
      // Parse parameters
      while (true) {
        if (this.currentToken().type === 'KEYWORD') {
          const paramType = this.advance().value;
          let paramPointer = false;
          
          if (this.currentToken().type === 'OPERATOR' && this.currentToken().value === '*') {
            paramPointer = true;
            this.advance();
          }
          
          if (this.currentToken().type === 'IDENTIFIER') {
            const paramName = this.advance().value;
            parameters.push({
              type: paramPointer ? paramType + '*' : paramType,
              name: paramName
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
      returnType: isPointer ? returnType + '*' : returnType,
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

  private doWhileLoop(): ASTNode {
    this.advance(); // consume 'do'
    
    const body = this.currentToken().type === 'LBRACE' ? this.block() : this.statement();
    
    if (this.currentToken().type !== 'KEYWORD' || this.currentToken().value !== 'while') {
      this.errors.push({
        message: "Expected 'while' after do body",
        position: this.currentToken().position,
        suggestion: "Add 'while (condition)' after do block"
      });
      throw new Error("Expected 'while'");
    }
    this.advance();
    
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
        suggestion: 'Add ) after condition'
      });
      throw new Error('Expected )');
    }
    this.advance();
    
    if (this.currentToken().type === 'SEMICOLON') {
      this.advance();
    }
    
    return {
      type: 'do_while',
      condition,
      body
    };
  }

  private switchStatement(): ASTNode {
    this.advance(); // consume 'switch'
    
    if (this.currentToken().type !== 'LPAREN') {
      this.errors.push({
        message: 'Expected ( after switch',
        position: this.currentToken().position,
        suggestion: 'Add ( before expression'
      });
      throw new Error('Expected (');
    }
    this.advance();
    
    const test = this.expression();
    
    if (this.currentToken().type !== 'RPAREN') {
      this.errors.push({
        message: 'Expected ) after switch expression',
        position: this.currentToken().position,
        suggestion: 'Add ) after expression'
      });
      throw new Error('Expected )');
    }
    this.advance();
    
    if (this.currentToken().type !== 'LBRACE') {
      this.errors.push({
        message: 'Expected { after switch',
        position: this.currentToken().position,
        suggestion: 'Add { to start switch body'
      });
      throw new Error('Expected {');
    }
    this.advance();
    
    const cases: { value: ASTNode; body: ASTNode[] }[] = [];
    let defaultCase: ASTNode[] | undefined;
    
    while (this.currentToken().type !== 'RBRACE' && this.currentToken().type !== 'EOF') {
      if (this.currentToken().type === 'KEYWORD') {
        if (this.currentToken().value === 'case') {
          this.advance();
          const value = this.expression();
          
          if (this.currentToken().type !== 'SEMICOLON') {
            this.errors.push({
              message: 'Expected : after case value',
              position: this.currentToken().position,
              suggestion: 'Add : after case value'
            });
          } else {
            this.advance();
          }
          
          const body: ASTNode[] = [];
          while (this.currentToken().type !== 'KEYWORD' && 
                 this.currentToken().type !== 'RBRACE' && 
                 this.currentToken().type !== 'EOF') {
            body.push(this.statement());
          }
          
          cases.push({ value, body });
        } else if (this.currentToken().value === 'default') {
          this.advance();
          
          if (this.currentToken().type === 'SEMICOLON') {
            this.advance();
          }
          
          const body: ASTNode[] = [];
          while (this.currentToken().type !== 'KEYWORD' && 
                 this.currentToken().type !== 'RBRACE' && 
                 this.currentToken().type !== 'EOF') {
            body.push(this.statement());
          }
          
          defaultCase = body;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    
    if (this.currentToken().type !== 'RBRACE') {
      this.errors.push({
        message: 'Expected } to close switch',
        position: this.currentToken().position,
        suggestion: 'Add } to close switch statement'
      });
      throw new Error('Expected }');
    }
    this.advance();
    
    return {
      type: 'switch',
      test,
      cases,
      default: defaultCase
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
    
    // Array subscript
    if (this.currentToken().type === 'LBRACKET') {
      this.advance();
      const index = this.expression();
      
      if (this.currentToken().type !== 'RBRACKET') {
        this.errors.push({
          message: 'Expected ] after array index',
          position: this.currentToken().position,
          suggestion: 'Add ] to close array subscript'
        });
        throw new Error('Missing ]');
      }
      this.advance();
      
      if (this.currentToken().type === 'ASSIGN' || this.currentToken().type === 'COMPOUND_ASSIGN') {
        const op = this.advance().value;
        const value = this.expression();
        
        if (this.currentToken().type === 'SEMICOLON') {
          this.advance();
        }
        
        return {
          type: 'assignment',
          identifier,
          value,
          operator: op,
          left: { type: 'array_access', identifier, value: index }
        };
      }
    }
    
    // Function call
    if (this.currentToken().type === 'LPAREN') {
      this.advance();
      const args: ASTNode[] = [];
      
      while (this.currentToken().type !== 'RPAREN' && this.currentToken().type !== 'EOF') {
        args.push(this.expression());
        if (this.currentToken().type === 'COMMA') {
          this.advance();
        }
      }
      
      if (this.currentToken().type !== 'RPAREN') {
        this.errors.push({
          message: 'Expected ) after function arguments',
          position: this.currentToken().position,
          suggestion: 'Add ) to close function call'
        });
        throw new Error('Missing )');
      }
      this.advance();
      
      if (this.currentToken().type === 'SEMICOLON') {
        this.advance();
      }
      
      return {
        type: 'function_call',
        identifier,
        arguments: args
      };
    }
    
    // Increment/Decrement
    if (this.currentToken().type === 'INCREMENT' || this.currentToken().type === 'DECREMENT') {
      const op = this.advance().value;
      
      if (this.currentToken().type === 'SEMICOLON') {
        this.advance();
      }
      
      return {
        type: 'postfix',
        operator: op,
        identifier
      };
    }
    
    // Assignment or compound assignment
    if (this.currentToken().type === 'ASSIGN' || this.currentToken().type === 'COMPOUND_ASSIGN') {
      const op = this.advance().value;
      const value = this.expression();
      
      if (this.currentToken().type === 'SEMICOLON') {
        this.advance();
      }
      
      return {
        type: 'assignment',
        identifier,
        value,
        operator: op
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
    return this.logicalOr();
  }

  // Logical OR (||)
  private logicalOr(): ASTNode {
    let left = this.logicalAnd();
    while (this.currentToken().type === 'LOGICAL' && this.currentToken().value === '||') {
      const operator = this.advance().value;
      const right = this.logicalAnd();
      left = {
        type: 'binary_op',
        operator,
        left,
        right
      };
    }
    return left;
  }

  // Logical AND (&&)
  private logicalAnd(): ASTNode {
    let left = this.equality();
    while (this.currentToken().type === 'LOGICAL' && this.currentToken().value === '&&') {
      const operator = this.advance().value;
      const right = this.equality();
      left = {
        type: 'binary_op',
        operator,
        left,
        right
      };
    }
    return left;
  }

  // Equality (==, !=)
  private equality(): ASTNode {
    let left = this.relational();
    while (this.currentToken().type === 'COMPARISON' && (this.currentToken().value === '==' || this.currentToken().value === '!=')) {
      const operator = this.advance().value;
      const right = this.relational();
      left = {
        type: 'binary_op',
        operator,
        left,
        right
      };
    }
    return left;
  }

  // Relational (<, >, <=, >=)
  private relational(): ASTNode {
    let left = this.additive();
    while (this.currentToken().type === 'COMPARISON' && ['<', '>', '<=', '>='].includes(this.currentToken().value)) {
      const operator = this.advance().value;
      const right = this.additive();
      left = {
        type: 'binary_op',
        operator,
        left,
        right
      };
    }
    return left;
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

    if (token.type === 'STRING') {
      this.advance();
      return {
        type: 'string',
        value: token.value
      };
    }

    if (token.type === 'CHAR') {
      this.advance();
      return {
        type: 'char',
        value: token.value
      };
    }

    // Prefix increment/decrement
    if (token.type === 'INCREMENT' || token.type === 'DECREMENT') {
      const op = this.advance().value;
      if (this.currentToken().type === 'IDENTIFIER') {
        const id = this.advance().value;
        return {
          type: 'prefix',
          operator: op,
          identifier: id
        };
      }
    }

    // Logical NOT
    if (token.type === 'LOGICAL' && token.value === '!') {
      this.advance();
      return {
        type: 'binary_op',
        operator: '!',
        left: { type: 'number', value: 0 },
        right: this.primary()
      };
    }

    // Address-of operator
    if (token.type === 'AMPERSAND') {
      this.advance();
      return {
        type: 'address_of',
        right: this.primary()
      };
    }

    // Dereference operator
    if (token.type === 'OPERATOR' && token.value === '*') {
      this.advance();
      return {
        type: 'dereference',
        right: this.primary()
      };
    }

    if (token.type === 'IDENTIFIER') {
      const id = this.advance().value;

      // Array subscript
      if (this.currentToken().type === 'LBRACKET') {
        this.advance();
        const index = this.expression();
        
        if (this.currentToken().type !== 'RBRACKET') {
          this.errors.push({
            message: 'Expected ] after array index',
            position: this.currentToken().position,
            suggestion: 'Add ] to close array subscript'
          });
          throw new Error('Missing ]');
        }
        this.advance();
        
        return {
          type: 'array_access',
          identifier: id,
          value: index
        };
      }

      // Function call
      if (this.currentToken().type === 'LPAREN') {
        this.advance();
        const args: ASTNode[] = [];
        
        while (this.currentToken().type !== 'RPAREN' && this.currentToken().type !== 'EOF') {
          args.push(this.expression());
          if (this.currentToken().type === 'COMMA') {
            this.advance();
          }
        }
        
        if (this.currentToken().type !== 'RPAREN') {
          this.errors.push({
            message: 'Expected ) after function arguments',
            position: this.currentToken().position,
            suggestion: 'Add ) to close function call'
          });
          throw new Error('Missing )');
        }
        this.advance();
        
        return {
          type: 'function_call',
          identifier: id,
          arguments: args
        };
      }

      return {
        type: 'identifier',
        value: id
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
        suggestion: 'Enter an arithmetic expression or C program'
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

  if (node.type === 'string') {
    return `${spaces}String: ${node.value}`;
  }

  if (node.type === 'char') {
    return `${spaces}Char: ${node.value}`;
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

  if (node.type === 'preprocessor') {
    return `${spaces}Preprocessor: ${node.directive}`;
  }

  if (node.type === 'declaration') {
    let result = `${spaces}Declaration: ${node.dataType}${node.isPointer ? '*' : ''} ${node.identifier}`;
    if (node.isArray) {
      result += `[${node.size ? (node.size.value as number) : ''}]`;
    }
    if (node.init) {
      result += `\n${spaces}  = \n${formatTree(node.init as ASTNode, indent + 2)}`;
    }
    return result;
  }

  if (node.type === 'assignment') {
    let result = `${spaces}Assignment${node.operator !== '=' ? ` (${node.operator})` : ''}: ${node.identifier}`;
    if (node.left) {
      result += `\n${spaces}  Target:\n${formatTree(node.left as ASTNode, indent + 2)}`;
    }
    result += `\n${spaces}  Value:`;
    if (node.value && typeof node.value === 'object' && 'type' in node.value) {
      result += `\n${formatTree(node.value as ASTNode, indent + 2)}`;
    }
    return result;
  }

  if (node.type === 'function_call') {
    let result = `${spaces}Function Call: ${node.identifier}(`;
    if (node.arguments && node.arguments.length > 0) {
      result += `\n`;
      node.arguments.forEach(arg => {
        result += formatTree(arg, indent + 1) + '\n';
      });
      result += `${spaces}`;
    }
    result += ')';
    return result;
  }

  if (node.type === 'array_access') {
    let result = `${spaces}Array Access: ${node.identifier}[`;
    if (node.value) {
      result += `\n${formatTree(node.value as ASTNode, indent + 1)}\n${spaces}`;
    }
    result += ']';
    return result;
  }

  if (node.type === 'postfix' || node.type === 'prefix') {
    return `${spaces}${node.type === 'prefix' ? 'Prefix' : 'Postfix'}: ${node.operator}${node.identifier}`;
  }

  if (node.type === 'address_of') {
    let result = `${spaces}Address Of (&)\n`;
    if (node.right) {
      result += formatTree(node.right, indent + 1);
    }
    return result;
  }

  if (node.type === 'dereference') {
    let result = `${spaces}Dereference (*)\n`;
    if (node.right) {
      result += formatTree(node.right, indent + 1);
    }
    return result;
  }

  if (node.type === 'function') {
    let result = `${spaces}Function: ${node.returnType} ${node.identifier}(`;
    result += node.parameters?.map(p => `${p.type} ${p.name}`).join(', ') || '';
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

  if (node.type === 'do_while') {
    let result = `${spaces}Do-While Loop\n`;
    const body = Array.isArray(node.body) ? node.body[0] : node.body!;
    result += `${spaces}  Body:\n${formatTree(body, indent + 2)}\n`;
    result += `${spaces}  Condition:\n${formatTree(node.condition!, indent + 2)}`;
    return result;
  }

  if (node.type === 'switch') {
    let result = `${spaces}Switch Statement\n`;
    result += `${spaces}  Expression:\n${formatTree(node.test!, indent + 2)}\n`;
    if (node.cases) {
      node.cases.forEach((c, i) => {
        result += `${spaces}  Case ${i + 1}:\n`;
        result += formatTree(c.value, indent + 2) + '\n';
        c.body.forEach(stmt => {
          result += formatTree(stmt, indent + 3) + '\n';
        });
      });
    }
    if (node.default) {
      result += `${spaces}  Default:\n`;
      node.default.forEach(stmt => {
        result += formatTree(stmt, indent + 3) + '\n';
      });
    }
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

  if (node.type === 'break') {
    return `${spaces}Break`;
  }

  if (node.type === 'continue') {
    return `${spaces}Continue`;
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

  if (['program', 'declaration', 'function', 'if_statement', 'while_loop', 
       'for_loop', 'do_while', 'switch', 'function_call', 'array_access',
       'assignment', 'break', 'continue', 'return', 'preprocessor',
       'string', 'char', 'postfix', 'prefix', 'address_of', 'dereference'].includes(node.type)) {
    throw new Error('Cannot evaluate C program structure - this parser focuses on syntax analysis');
  }
  
  throw new Error(`Invalid AST node type: ${node.type}`);
}

// ============= C Program Interpreter =============

export interface ExecutionResult {
  output: string[];
  returnValue: number | null;
  variables: Record<string, any>;
  error?: string;
}

class Interpreter {
  private variables: Map<string, any> = new Map();
  private functions: Map<string, { params: any[], body: ASTNode | ASTNode[], returnType: string }> = new Map();
  private output: string[] = [];
  private returnValue: number | null = null;
  private breakFlag = false;
  private continueFlag = false;

  execute(node: ASTNode): ExecutionResult {
    try {
      this.interpretNode(node);
      return {
        output: this.output,
        returnValue: this.returnValue,
        variables: Object.fromEntries(this.variables)
      };
    } catch (error) {
      return {
        output: this.output,
        returnValue: null,
        variables: Object.fromEntries(this.variables),
        error: error instanceof Error ? error.message : "Execution error"
      };
    }
  }

  private interpretNode(node: ASTNode | ASTNode[]): any {
    if (Array.isArray(node)) {
      let lastValue;
      for (const stmt of node) {
        if (this.returnValue !== null || this.breakFlag || this.continueFlag) break;
        lastValue = this.interpretNode(stmt);
      }
      return lastValue;
    }

    switch (node.type) {
      case 'program':
        return this.interpretNode(node.statements || []);
      
      case 'function_declaration':
        this.functions.set(node.identifier!, {
          params: node.parameters || [],
          body: node.body!,
          returnType: node.returnType || 'int'
        });
        // Auto-execute main function if it exists
        if (node.identifier === 'main') {
          const result = this.callFunction('main', []);
          this.returnValue = result;
        }
        return null;
      
      case 'declaration':
        const initValue = node.init ? this.interpretNode(node.init) : 0;
        this.variables.set(node.identifier!, initValue);
        return null;
      
      case 'assignment':
        const value = this.interpretNode(node.right!);
        this.variables.set(node.identifier!, value);
        return value;
      
      case 'if_statement':
        const condition = this.interpretNode(node.condition!);
        if (this.isTruthy(condition)) {
          return this.interpretNode(node.body!);
        } else if (node.elseBranch) {
          return this.interpretNode(node.elseBranch);
        }
        return null;
      
      case 'while_loop':
        while (this.isTruthy(this.interpretNode(node.condition!))) {
          this.interpretNode(node.body!);
          if (this.returnValue !== null || this.breakFlag) break;
          if (this.continueFlag) {
            this.continueFlag = false;
            continue;
          }
        }
        this.breakFlag = false;
        return null;
      
      case 'do_while_loop':
        do {
          this.interpretNode(node.body!);
          if (this.returnValue !== null || this.breakFlag) break;
          if (this.continueFlag) {
            this.continueFlag = false;
            continue;
          }
        } while (this.isTruthy(this.interpretNode(node.condition!)));
        this.breakFlag = false;
        return null;
      
      case 'for_loop':
        if (node.init) this.interpretNode(node.init);
        while (node.condition ? this.isTruthy(this.interpretNode(node.condition)) : true) {
          this.interpretNode(node.body!);
          if (this.returnValue !== null || this.breakFlag) break;
          if (this.continueFlag) {
            this.continueFlag = false;
          }
          if (node.increment) this.interpretNode(node.increment);
        }
        this.breakFlag = false;
        return null;
      
      case 'switch_statement':
        const testValue = this.interpretNode(node.test!);
        let matched = false;
        let executeDefault = true;
        
        for (const caseNode of node.cases || []) {
          const caseValue = this.interpretNode(caseNode.value);
          if (testValue === caseValue || matched) {
            matched = true;
            executeDefault = false;
            this.interpretNode(caseNode.body);
            if (this.breakFlag) {
              this.breakFlag = false;
              break;
            }
          }
        }
        
        if (executeDefault && node.default) {
          this.interpretNode(node.default);
          this.breakFlag = false;
        }
        return null;
      
      case 'return_statement':
        if (node.value) {
          if (typeof node.value === 'object') {
            this.returnValue = this.interpretNode(node.value as ASTNode);
          } else {
            this.returnValue = typeof node.value === 'number' ? node.value : 0;
          }
        } else {
          this.returnValue = 0;
        }
        return this.returnValue;
      
      case 'break_statement':
        this.breakFlag = true;
        return null;
      
      case 'continue_statement':
        this.continueFlag = true;
        return null;
      
      case 'function_call':
        return this.callFunction(node.identifier!, node.arguments || []);
      
      case 'binary_op':
        return this.evaluateBinaryOp(node);
      
      case 'unary_op':
        const operand = this.interpretNode(node.right!);
        if (node.operator === '-') return -operand;
        if (node.operator === '!') return operand ? 0 : 1;
        return operand;
      
      case 'identifier':
        if (!this.variables.has(node.identifier!)) {
          return 0; // Default value for undefined variables
        }
        return this.variables.get(node.identifier!);
      
      case 'number':
        return node.value;
      
      case 'preprocessor':
        return null; // Ignore preprocessor directives during execution
      
      default:
        return null;
    }
  }

  private callFunction(name: string, args: ASTNode[]): any {
    if (name === 'printf') {
      const evaluatedArgs = args.map(arg => this.interpretNode(arg));
      this.output.push(evaluatedArgs.map(String).join(' '));
      return 0;
    }

    const func = this.functions.get(name);
    if (!func) {
      throw new Error(`Function ${name} not defined`);
    }

    // Create new scope for function parameters
    const previousVars = new Map(this.variables);
    const evaluatedArgs = args.map(arg => this.interpretNode(arg));
    
    func.params.forEach((param, i) => {
      this.variables.set(param.name, evaluatedArgs[i] || 0);
    });

    const previousReturn = this.returnValue;
    this.returnValue = null;

    this.interpretNode(func.body);
    const result = this.returnValue !== null ? this.returnValue : 0;

    // Restore previous scope
    this.returnValue = previousReturn;
    this.variables = previousVars;

    return result;
  }

  private evaluateBinaryOp(node: ASTNode): any {
    const left = this.interpretNode(node.left!);
    const right = this.interpretNode(node.right!);

    switch (node.operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return Math.floor(left / right);
      case '%': return left % right;
      case '==': return left === right ? 1 : 0;
      case '!=': return left !== right ? 1 : 0;
      case '<': return left < right ? 1 : 0;
      case '>': return left > right ? 1 : 0;
      case '<=': return left <= right ? 1 : 0;
      case '>=': return left >= right ? 1 : 0;
      case '&&': return (left && right) ? 1 : 0;
      case '||': return (left || right) ? 1 : 0;
      case '!': return right ? 0 : 1;
      default: return 0;
    }
  }

  private isTruthy(value: any): boolean {
    return value !== 0 && value !== null && value !== undefined;
  }
}

export function executeProgram(ast: ASTNode): ExecutionResult {
  const interpreter = new Interpreter();
  return interpreter.execute(ast);
}
