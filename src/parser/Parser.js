const {
  ClassToken,
  ExtendToken,
  NewToken,
  ConstructorToken,
  MethodToken,
  MethodNameToken,
  SuperToken,
} = require("../lexer/tokens/SpecialTokens");

const {
  LeftCurlyToken,
  RightCurlyToken,
  LeftParenToken,
  RightParenToken,
  DotToken,
  SemiColonToken,
  CommaToken,
  ColonToken,
} = require("../lexer/tokens/SymbolTokens");

const {
  PlusToken,
  MinusToken,
  MultiplyToken,
  DivideToken,
  AssignmentToken,
} = require("../lexer/tokens/OperatorTokens");

const {
  IntegerTypeToken,
  StringTypeToken,
  BooleanTypeToken,
  VoidTypeToken,
  ClassNameTypeToken,
} = require("../lexer/tokens/TypeTokens");

const {
  IntegerToken,
  StringToken,
  TrueToken,
  FalseToken,
} = require("../lexer/tokens/ExpressionTypeTokens");

const {
  ReturnToken,
  IfToken,
  ElseToken,
  WhileToken,
  BreakToken,
  PrintToken,
  ThisToken,
} = require("../lexer/tokens/StatementTokens");

const {
  Program,
  ClassDef,
  Constructor,
  MethodDef,
  VarDec,
  ExpressionStatement,
  BinaryExpression,
} = require("./ASTNodes");

const VariableToken = require("../lexer/tokens/VariableToken");

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current - 0;
  }
  peek() {
    return this.tokens[this.current];
  }

  isAtEnd() {
    return this.current >= this.tokens.length;
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  advance() {
    return this.tokens[this.current++];
  }

  match(...tokenTypes) {
    for (let type of tokenTypes) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  check(tokenType) {
    if (this.isAtEnd()) return false;
    return this.peek() instanceof tokenType;
  }

  consume(tokenType, errorMessage) {
    if (this.check(tokenType)) {
      return this.advance();
    }
    throw new Error(`${errorMessage} at position ${this.current}`);
  }

  // Parsing Methods

  // program ::= classdef* stmt+
  parseProgram() {
    const classDefs = [];
    while (this.check(ClassToken)) {
      classDefs.push(this.parseClassDef());
    }
    const statements = [];
    while (!this.isAtEnd()) {
      statements.push(this.parseStmt());
    }
    return new Program(classDefs, statements);
  }

  // classdef ::= 'class' classname ['extends' classname] '{' (vardec ';')* constructor methoddef* '}'
  parseClassDef() {
    this.consume(ClassToken, "Expected 'class' keyword");
    const nameToken = this.consume(ClassNameTypeToken, "Expected class name");
    const className = nameToken.value;

    let superclass = null;
    if (this.match(ExtendToken)) {
      const superToken = this.consume(
        ClassNameTypeToken,
        "Expected superclass name",
      );
      superclass = superToken.value;
    }

    this.consume(LeftCurlyToken, "Expected '{' to start class body");

    const varDecs = [];
    // Parse variable declarations until no longer sees a type token.
    while (this.isTypeToken(this.peek())) {
      const varDec = this.parseVarDec();
      varDecs.push(varDec);
      this.consume(SemiColonToken, "Expected ';' after variable declaration");
    }

    // Parse the constructor (init) part.
    const constructorNode = this.parseConstructor();

    // Parse method definitions.
    const methods = [];
    while (this.check(MethodToken)) {
      methods.push(this.parseMethodDef());
    }

    this.consume(RightCurlyToken, "Expected '}' after class body");
    return new ClassDef(
      className,
      superclass,
      varDecs,
      constructorNode,
      methods,
    );
  }

  // vardec ::= type var
  parseVarDec() {
    const typeNode = this.parseType();
    const varToken = this.consume(VariableToken, "Expected variable name");
    return new VarDec(typeNode, varToken.value);
  }

  parseType() {
    const token = this.advance();
    return { typeName: token.value };
  }

  // constructor ::= 'init' '(' comma_vardec ')' '{' [ 'super' '(' comma_exp ')' ';' ] stmt* '}'
  parseConstructor() {
    this.consume(ConstructorToken, "Expected constructor (init) keyword");
    this.consume(LeftParenToken, "Expected '(' after constructor keyword");

    const params = this.parseCommaSeparated(
      this.parseVarDec.bind(this),
      RightParenToken,
    );

    this.consume(RightParenToken, "Expected ')' after constructor parameters");
    this.consume(LeftCurlyToken, "Expected '{' to start constructor body");

    let superCall = null;
    if (this.match(SuperToken)) {
      this.consume(LeftParenToken, "Expected '(' after 'super'");
      const args = this.parseCommaSeparated(
        this.parseExp.bind(this),
        RightParenToken,
      );
      this.consume(RightParenToken, "Expected ')' after super arguments");
      this.consume(SemiColonToken, "Expected ';' after super call");
      superCall = { arguments: args };
    }

    const body = [];
    while (!this.check(RightCurlyToken)) {
      body.push(this.parseStmt());
    }
    this.consume(RightCurlyToken, "Expected '}' after constructor body");
    return new Constructor(params, superCall, body);
  }

  parseMethodDef() {
    this.consume(MethodToken, "Expected 'method' keyword");
    const methodNameToken = this.consume(
      MethodNameToken,
      "Expected method name",
    );
    const methodName = methodNameToken.value;

    this.consume(LeftParenToken, "Expected '(' after method name");
    const params = this.parseCommaSeparated(
      this.parseVarDec.bind(this),
      RightParenToken,
    );
    this.consume(RightParenToken, "Expected ')' after method parameters");

    const returnType = this.parseType();
    this.consume(LeftCurlyToken, "Expected '{' to start method body");

    const body = [];
    while (!this.check(RightCurlyToken)) {
      body.push(this.parseStmt());
    }
    this.consume(RightCurlyToken, "Expected '}' after method body");
    return new MethodDef(methodName, params, returnType, body);
  }

  // stmt ::= exp ';'
  //        | vardec ';'
  //        | var '=' exp ';'
  //        | while '(' exp ')' stmt
  //        | break ';'
  //        | return [exp] ';'
  //        | if '(' exp ')' stmt [else stmt]
  //        | '{' stmt* '}'
  parseStmt() {
    if (this.match(IfToken)) {
      return this.parseIfStmt();
    }
    if (this.match(WhileToken)) {
      return this.parseWhileStmt();
    }
    if (this.match(ReturnToken)) {
      return this.parseReturnStmt();
    }
    if (this.match(LeftCurlyToken)) {
      return this.parseBlockStmt();
    }
    // Check for variable declarations by testing for a type token.
    if (this.isTypeToken(this.peek())) {
      const varDec = this.parseVarDec();
      this.consume(SemiColonToken, "Expected ';' after variable declaration");
      return varDec;
    }

    // Otherwise, assume an expression statement or assignment.
    const expr = this.parseExp();
    if (this.check(AssignmentToken)) {
      // consume assignment token
      this.advance();
      const rightExpr = this.parseExp();
      this.consume(SemiColonToken, "Expected ';' after assignment");
      return { type: "Assignment", left: expr, right: rightExpr };
    }
    this.consume(SemiColonToken, "Expected ';' after expression");
    return new ExpressionStatement(expr);
  }

  // if '(' exp ')' stmt [else stmt]
  parseIfStmt() {
    this.consume(LeftParenToken, "Expected '(' after if");
    const condition = this.parseExp();
    this.consume(RightParenToken, "Expected ')' after if condition");
    const thenBranch = this.parseStmt();
    let elseBranch = null;
    if (this.match(ElseToken)) {
      elseBranch = this.parseStmt();
    }
    return { type: "If", condition, thenBranch, elseBranch };
  }

  // while '(' exp ')' stmt
  parseWhileStmt() {
    this.consume(LeftParenToken, "Expected '(' after while");
    const condition = this.parseExp();
    this.consume(RightParenToken, "Expected ')' after while condition");
    const body = this.parseStmt();
    return { type: "While", condition, body };
  }

  // return [exp] ';'
  parseReturnStmt() {
    let expr = null;
    if (!this.check(SemiColonToken)) {
      expr = this.parseExp();
    }
    this.consume(SemiColonToken, "Expected ';' after return statement");
    return { type: "Return", value: expr };
  }

  // '{' stmt* '}'
  parseBlockStmt() {
    const statements = [];
    while (!this.check(RightCurlyToken) && !this.isAtEnd()) {
      statements.push(this.parseStmt());
    }
    this.consume(RightCurlyToken, "Expected '}' after block");
    return { type: "Block", statements };
  }

  parseExp() {
    return this.parseAddExp();
  }

  // Additive expressions
  parseAddExp() {
    let left = this.parseMultExp();
    while (this.match(PlusToken, MinusToken)) {
      const operator = this.previous();
      const right = this.parseMultExp();
      left = new BinaryExpression(left, operator, right);
    }
    return left;
  }

  // Multiplicative expressions
  parseMultExp() {
    let left = this.parseCallExp();
    while (this.match(MultiplyToken, DivideToken)) {
      const operator = this.previous();
      const right = this.parseCallExp();
      left = new BinaryExpression(left, operator, right);
    }
    return left;
  }

  parseCallExp() {
          let exp = this.parsePrimaryExp();
          while (this.match(DotToken)) {
              const methodNameToken = this.consume(MethodNameToken, "Expected method name after '.'");
              this.consume(LeftParenToken, "Expected '(' after method name");
              const args = this.parseCommaSeparated(this.parseExp.bind(this), RightParenToken);
              this.consume(RightParenToken, "Expected ')' after call arguments");
              exp = {type: "CallExpression", callee: exp, methodName: methodNameToken.value, arguments: args};
          }
          return exp;
      }



  
}
