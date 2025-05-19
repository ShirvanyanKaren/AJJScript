/**
 * @file Parser.js
 * @description Main Parser class for the AJJ language. Converts tokens into an abstract syntax tree (AST).
 */

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

const {
  parseClassDef,
  parseConstructor,
  parseMethodDef,
  parseVarDec,
} = require("./ClassParser");

const {
  parseStmt,
  parseIfStmt,
  parseWhileStmt,
  parseReturnStmt,
  parseBlockStmt,
} = require("./StatementParser");

const {
  parseExp,
  parseTernary,
  parseComparison,
  parseAddExp,
  parseMultExp,
  parseUnaryExp,
  parseCallExp,
  parsePrimaryExp,
} = require("./ExpParser");

/**
 * The main Parser class for the AJJ language.
 * It processes a list of tokens into an abstract syntax tree (AST).
 */
class Parser {
  /**
   * @param {BaseToken[]} tokens - The list of tokens to parse.
   */
  constructor(tokens) {
    /** @type {BaseToken[]} */
    this.tokens = tokens; // Tokens to be parsed
    /** @type {number} */
    this.current = 0; // Index of the current token
  }

  /** @returns {BaseToken} */
  peek() {
    return this.tokens[this.current];
  }

  /** @returns {boolean} */
  isAtEnd() {
    return this.current >= this.tokens.length;
  }

  /** @returns {BaseToken} */
  previous() {
    return this.tokens[this.current - 1];
  }

  /** @returns {BaseToken} */
  advance() {
    return this.tokens[this.current++];
  }

  /**
   * @param {...Function} tokenTypes
   * @returns {boolean}
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
   * @param {Function} tokenType
   * @returns {boolean}
   */
  check(tokenType) {
    if (this.isAtEnd()) return false;
    return this.peek() instanceof tokenType;
  }

  /**
   * @param {Function} tokenType
   * @param {string} errorMessage
   * @returns {BaseToken}
   */
  consume(tokenType, errorMessage) {
    if (this.check(tokenType)) {
      return this.advance();
    }
    throw new Error(`${errorMessage} at position ${this.current}`);
  }

  /** @returns {Program} */
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

  /** @returns {Program} */
  parse() {
    return this.parseProgramStructure();
  }

  /** @returns {ClassDef} */
  parseClassDef() {
    return parseClassDef(this);
  }

  /** @returns {VarDec} */
  parseVarDec() {
    return parseVarDec(this);
  }

  /** @returns {{ typeName: string }} */
  parseType() {
    const token = this.advance();
    if (token instanceof ClassNameTypeToken) {
      return { typeName: token.value };
    }
    return {
      typeName: token.constructor.name.replace("TypeToken", "").toLowerCase(),
    };
  }

  /** @returns {Constructor} */
  parseConstructor() {
    return parseConstructor(this);
  }

  /** @returns {MethodDef} */
  parseMethodDef() {
    return parseMethodDef(this);
  }

  /** @returns {ExpressionStatement} */
  parseStsmt() {
    return parseStmt(this);
  }

  /** @returns {ExpressionStatement} */
  parseStmt() {
    return parseStmt(this);
  }

  /** @returns {ExpressionStatement} */
  parseIfStmt() {
    return parseIfStmt(this);
  }

  /** @returns {ExpressionStatement} */
  parseWhileStmt() {
    return parseWhileStmt(this);
  }

  /** @returns {ReturnStatement} */
  parseReturnStmt() {
    return parseReturnStmt(this);
  }

  /** @returns {ExpressionStatement[]} */
  parseBlockStmt() {
    return parseBlockStmt(this);
  }

  /** @returns {BinaryExpression} */
  parseComparison() {
    return parseComparison(this);
  }

  /** @returns {TernaryExpression} */
  parseTernary() {
    return parseTernary(this);
  }

  /** @returns {TernaryExpression} */
  parseExp() {
    return parseTernary(this);
  }

  /** @returns {BinaryExpression} */
  parseAddExp() {
    return parseAddExp(this);
  }

  /** @returns {UnaryExpression} */
  parseUnaryExp() {
    return parseUnaryExp(this);
  }

  /** @returns {BinaryExpression} */
  parseMultExp() {
    return parseMultExp(this);
  }

  /** @returns {MethodCall} */
  parseCallExp() {
    return parseCallExp(this);
  }

  /** @returns {FieldAccess|This|Super|NewExpression|Print|Assignment|ReturnStatement} */
  parsePrimaryExp() {
    return parsePrimaryExp(this);
  }
}

module.exports = Parser;