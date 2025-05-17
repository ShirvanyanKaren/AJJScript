const {
  ClassToken,
  ClassNameTypeToken,
  LeftParenToken,
} = require("../lexer/tokens");

const {
  Program,
  ClassDef,
  Constructor,
  MethodDef,
  VarDec,
  ExpressionStatement,
  BinaryExpression,
  UnaryExpression,
  MethodCall,
  FieldAccess,
  This,
  Super,
  NewExpression,
  ReturnStatement,
  Assignment,
  Print,
  TernaryExpression,
} = require("./ASTNodes");



/**
 * The main Parser class for the AJJ language.
 * It processes a list of tokens into an abstract syntax tree (AST).
 */
class Parser {
  /**
   * Creates a new parser instance.
   * @param {BaseToken[]} tokens - The list of tokens to parse.
   */
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  /**
   * Gets the current token.
   * @returns {BaseToken} The current token.
   */
  peek() {
    return this.tokens[this.current];
  }

  /**
   * Checks if all tokens have been consumed.
   * @returns {boolean} True if end of token list, false otherwise.
   */
  isAtEnd() {
    return this.current >= this.tokens.length;
  }

  /**
   * Gets the previously consumed token.
   * @returns {BaseToken} The previous token.
   */
  previous() {
    return this.tokens[this.current - 1];
  }

  /**
   * Advances to the next token.
   * @returns {BaseToken} The consumed token.
   */
  advance() {
    return this.tokens[this.current++];
  }

  /**
   * Checks and consumes if the next token matches any of the provided types.
   * @param {...Function} tokenTypes - Token constructors to check.
   * @returns {boolean} True if a match was found and consumed.
   */
  match(...tokenTypes) {
    for (let type of tokenTypes) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if the next token is of a specific type.
   * @param {Function} tokenType - The token class to check against.
   * @returns {boolean} True if the token is of the given type.
   */
  check(tokenType) {
    if (this.isAtEnd()) return false;
    return this.peek() instanceof tokenType;
  }

  /**
   * Consumes a token of the expected type, or throws an error.
   * @param {Function} tokenType - Expected token constructor.
   * @param {string} errorMessage - Error message if not matched.
   * @returns {BaseToken} The matched token.
   * @throws {Error} If token does not match.
   */
  consume(tokenType, errorMessage) {
    if (this.check(tokenType)) {
      return this.advance();
    }
    throw new Error(`${errorMessage} at position ${this.current}`);
  }
  /**
   * Parses the entire program structure.
   * @returns {Program} The parsed program structure.
   */

  parseProgramStructure() {
    const classDefs = [];
    const statements = [];

    while (!this.isAtEnd() && this.check(ClassToken)) {
      classDefs.push(this.parseClassDef());
    }

    while (!this.isAtEnd()) {
      statements.push(this.parseStmt());
    }

    return new Program(classDefs, statements);
  }

  /**
   * Parses the entire program.
   * @returns {Program} The parsed program structure.
   */
  parse() {
    return this.parseProgramStructure();
  }

  parseClassDef() {
    return parseClassDef(this);
  }
  parseVarDec() {
    return parseVarDec(this);
  }

  parseType() {
    const token = this.advance();
    if (token instanceof ClassNameTypeToken) {
      return { typeName: token.value };
    }
    return {
      typeName: token.constructor.name.replace("TypeToken", "").toLowerCase(),
    };
  }
  parseConstructor() {
    return parseConstructor(this);
  }

  parseMethodDef() {
    return parseMethodDef(this);
  }

  parseStsmt() {
    return parseStmt(this);
  }

  parseStmt() {
    return parseStmt(this);
  }
  parseIfStmt() {
    return parseIfStmt(this);
  }
  parseWhileStmt() {
    return parseWhileStmt(this);
  }
  parseReturnStmt() {
    return parseReturnStmt(this);
  }
  parseBlockStmt() {
    return parseBlockStmt(this);
  }

  parseComparison() {
    return parseComparison(this);
  }

  parseTernary() {
    return parseTernary(this);
  }

  parseExp() {
    return parseTernary(this);
  }

  parseAddExp() {
    return parseAddExp(this);
  }

  parseUnaryExp() {
    return parseUnaryExp(this);
  }

  parseMultExp() {
    return parseMultExp(this);
  }

  parseCallExp() {
    return parseCallExp(this);
  }

  parsePrimaryExp() {
    return parsePrimaryExp(this);
  }
}

module.exports = Parser;
