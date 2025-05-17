const {
    VariableToken,
    IntegerToken,
    StringToken,
    TrueToken,
    FalseToken,
    ThisToken,
    PrintToken,
    NewToken,
    MethodNameToken,
    LeftParenToken,
    RightParenToken,
    DotToken,
    PlusToken,
    MinusToken,
    MultiplyToken,
    DivideToken,
    IncrementToken,
    QuestionMarkToken,
    ColonToken,
    LessThanToken,
    LessThanEqualToken,
    GreaterThanToken,
    GreaterThanEqualToken,
    EqualsToken,
    NotEqualsToken,
    ClassNameTypeToken,
    MethodToken,
    LeftCurlyToken,
    OrToken,
    AndToken,
    ForToken,
    SemiColonToken,

  } = require("../lexer/tokens");
  
  const {
    BinaryExpression,
    UnaryExpression,
    MethodCall,
    FieldAccess,
    This,
    Print,
    NewExpression,
    TernaryExpression,
    MethodDeclaration
  } = require("./ASTNodes");

  const { parseBlockStmt } = require("./StatementParser");
  const {parseVarDec} = require("./ClassParser");
  
  const { parseCommaSeparated, parseParams } = require("../utils/Parser");
  const ParserErrors = require("../utils/ParserErrorMessages");
  
  function parseExp(parser) {
    return parseLogical(parser);
  }
  
  function parseLogical(parser) {
    let expr = parseComparison(parser);
  
    while (parser.match(OrToken, AndToken)) {
      const operator = parser.previous().value;
      const right = parseComparison(parser);
      expr = new BinaryExpression(expr, operator, right);
    }
  
    return expr;
  }
  
  
  function parseTernary(parser) {
    let condition = parseLogical(parser);
  
    if (parser.match(QuestionMarkToken)) {
      const trueExpr = parseLogical(parser);
      parser.consume(ColonToken, ParserErrors.EXPECT_TERNARY_COLON);
      const falseExpr = parseLogical(parser);
      return new TernaryExpression(condition, trueExpr, falseExpr);
    }
  
    return condition;
  }
  
  function parseComparison(parser) {
    let expr = parseAddExp(parser);
  
    while (
      parser.match(
        LessThanToken,
        LessThanEqualToken,
        GreaterThanToken,
        GreaterThanEqualToken,
        EqualsToken,
        NotEqualsToken,
      )
    ) {
      const operator = parser.previous().value;
      const right = parseAddExp(parser);
      expr = new BinaryExpression(expr, operator, right);
    }
  
    return expr;
  }
  
  function parseAddExp(parser) {
    let expr = parseMultExp(parser);
  
    while (parser.match(PlusToken, MinusToken)) {
      const operator = parser.previous().value;
      const right = parseMultExp(parser);
      expr = new BinaryExpression(expr, operator, right);
    }
  
    return expr;
  }
  
  function parseMultExp(parser) {
    let expr = parseUnaryExp(parser);
  
    while (parser.match(MultiplyToken, DivideToken)) {
      const operator = parser.previous().value;
      const right = parseUnaryExp(parser);
      expr = new BinaryExpression(expr, operator, right);
    }
  
    return expr;
  }
  
  function parseUnaryExp(parser) {
    if (parser.match(IncrementToken)) {
      const operand = parseUnaryExp(parser);
      return { type: "PrefixIncrement", operand };
    }
  
    if (parser.match(NotEqualsToken)) {
      const operand = parseUnaryExp(parser);
      return { type: "LogicalNot", operand };
    }
  
    return parseCallExp(parser);
  }
  
  
  function parseCallExp(parser) {
    let expr = parsePrimaryExp(parser);
  
    while (parser.check(DotToken) || parser.check(LeftParenToken)) {
      if (parser.match(DotToken)) {
        const name = parser.peek();
        if (name instanceof MethodNameToken || name instanceof VariableToken) {
          parser.advance();
          if (parser.check(LeftParenToken)) {
            parser.consume(LeftParenToken, ParserErrors.EXPECT_LEFT_PAREN_AFTER_METHOD);
            const args = parseCommaSeparated({ parser, parseFunc: parser.parseExp.bind(parser), endToken: RightParenToken });
            parser.consume(RightParenToken, ParserErrors.EXPECT_RIGHT_PAREN_AFTER_ARGS);
            expr = new MethodCall(expr, name.value, args);
          } else {
            expr = new FieldAccess(expr, name.value);
          }
        } else {
          throw new Error(`Expected field or method name after '.' at position ${parser.current}`);
        }
      } else if (parser.match(LeftParenToken)) {
        const args = parseCommaSeparated({ parser, parseFunc: parser.parseExp.bind(parser), endToken: RightParenToken });
        parser.consume(RightParenToken, ParserErrors.EXPECT_RIGHT_PAREN_AFTER_ARGS);
        expr = new MethodCall(expr, null, args);
      }
    }
  
    if (parser.match(IncrementToken)) {
      expr = { type: "PostfixIncrement", operand: expr };
    }
  
    return expr;
  }
  
  
  function parsePrimaryExp(parser) {
    const token = parser.peek();
    
    if (parser.match(VariableToken)) return { type: "Variable", name: token.value };
    if (parser.match(IntegerToken)) return { type: "IntegerLiteral", value: token.value };
    if (parser.match(StringToken)) return { type: "StringLiteral", value: token.value };
    if (parser.match(TrueToken)) return { type: "BooleanLiteral", value: true };
    if (parser.match(FalseToken)) return { type: "BooleanLiteral", value: false };
    if (parser.match(ThisToken)) return new This();
  
    if (parser.match(PrintToken)) {
      parser.consume(LeftParenToken, ParserErrors.EXPECT_LEFT_PAREN_AFTER_PRINT);
      const arg = parser.parseExp();

      parser.consume(RightParenToken, ParserErrors.EXPECT_RIGHT_PAREN_AFTER_PRINT);
      return new Print(arg);
    }
  
    if (parser.match(NewToken)) {
      const classNameToken = parser.consume(ClassNameTypeToken, "Expected class name after new");
      parser.consume(LeftParenToken, ParserErrors.EXPECT_LEFT_PAREN_AFTER_CLASS);
      const args = parseCommaSeparated({ parser, parseFunc: parser.parseExp.bind(parser), endToken: RightParenToken });
      parser.consume(RightParenToken, ParserErrors.EXPECT_RIGHT_PAREN_AFTER_NEW_ARGS);
      return new NewExpression(classNameToken.value, args);
    }
  
    if (parser.match(MethodNameToken)) {
      
      const methodName = token.value;
      parser.consume(LeftParenToken, ParserErrors.EXPECT_LEFT_PAREN_AFTER_METHOD);
      const args = parseCommaSeparated({ parser, parseFunc: parser.parseExp.bind(parser), endToken: RightParenToken });
      parser.consume(RightParenToken, ParserErrors.EXPECT_RIGHT_PAREN_AFTER_METHOD);
      return new MethodCall("Global", methodName, args);
    }
  
    if (parser.match(LeftParenToken)) {
      const expr = parser.parseExp();
      parser.consume(RightParenToken, ParserErrors.EXPECT_RIGHT_PAREN_AFTER_EXP);
      return expr;
    }

    if (parser.match(MethodToken)) {

      const name = parser.consume(MethodNameToken, "Expected method name after 'method'");
      parser.consume(LeftParenToken, "Expected '(' after method name");
    
      // ⚠️ parseParams MUST return [{ identifier, varType, ... }]
      const params = parseParams(parser);

    
      parser.consume(RightParenToken, "Expected ')' after parameters");
      const returnType = parser.parseType();

    
      parser.consume(LeftCurlyToken, "Expected '{' before method body");
      const body = parseBlockStmt(parser); // ✅ This will consume until `}`
    

      return new MethodDeclaration(name.value, params, returnType, body);
    }
    
      
    throw new Error(`Unexpected token ${token.constructor.name} in expression at position ${parser.current}`);
  }
  
  module.exports = {
    parseExp,
    parseTernary,
    parseComparison,
    parseAddExp,
    parseMultExp,
    parseUnaryExp,
    parseCallExp,
    parsePrimaryExp,
  };
  