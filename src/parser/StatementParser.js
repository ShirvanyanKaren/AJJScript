const {
    IfToken,
    ElseToken,
    WhileToken,
    ReturnToken,
    BreakToken,
    LeftCurlyToken,
    RightCurlyToken,
    SemiColonToken,
    AssignmentToken,
    LeftParenToken,
    RightParenToken,
    CommaToken,
    ForToken,
  } = require("../lexer/tokens");
  
  const {
    isTypeToken,
  } = require("../utils/Parser");
  
  const ParserErrors = require("../utils/ParserErrorMessages");
  const { Assignment, ExpressionStatement, MethodDeclaration } = require("./ASTNodes");
  
  function parseStmt(parser) {
    if (parser.match(IfToken)) return parseIfStmt(parser);
    if (parser.match(WhileToken)) return parseWhileStmt(parser);
    if (parser.match(ReturnToken)) return parseReturnStmt(parser);
    if (parser.match(ForToken)) return parseForStmt(parser);
    if (parser.match(BreakToken)) {
      parser.consume(SemiColonToken, ParserErrors.EXPECT_SEMICOLON_AFTER_BREAK);
      return { type: "Break" };
    }
    if (parser.match(LeftCurlyToken)) return parseBlockStmt(parser);
  
    if (isTypeToken(parser.peek())) {
      const varDec = parser.parseVarDec();
      if (parser.match(AssignmentToken)) {
        const rightExpr = parser.parseExp();
        parser.consume(SemiColonToken, ParserErrors.EXPECT_SEMICOLON_AFTER_VARDEC_ASSIGN);
        return new Assignment(varDec, rightExpr);
      }
      parser.consume(SemiColonToken, ParserErrors.EXPECT_SEMICOLON_AFTER_VARDEC);
      return varDec;
    }
  
    const expr = parser.parseExp();
    if (parser.match(AssignmentToken)) {
      const rightExpr = parser.parseExp();
      parser.consume(SemiColonToken, ParserErrors.EXPECT_SEMICOLON_AFTER_VARDEC_ASSIGN);
      return new Assignment(expr, rightExpr);
    }
      
  
    parser.consume(SemiColonToken, ParserErrors.EXPECT_SEMICOLON_AFTER_VARDEC_ASSIGN);
    return new ExpressionStatement(expr);
  }
  
  function parseIfStmt(parser) {
    parser.consume(LeftParenToken, ParserErrors.EXPECT_LEFT_PAREN_AFTER_IF);
    const condition = parser.parseExp();
    parser.consume(RightParenToken, ParserErrors.EXPECT_RIGHT_PAREN_AFTER_IF);
    const thenBranch = parseStmt(parser);
    let elseBranch = null;
    if (parser.match(ElseToken)) {
      elseBranch = parseStmt(parser);
    }
    return { type: "If", condition, thenBranch, elseBranch };
  }
  function parseForStmt(parser) {
    parser.consume(LeftParenToken, ParserErrors.EXPECT_LEFT_PAREN_AFTER_FOR);
  
    const initializer = parser.parseStmt();
  
    const condition = parser.parseExp();
    parser.consume(SemiColonToken, ParserErrors.EXPECT_SEMICOLON_AFTER_FOR_COND);
  
    const increment = parser.parseExp();
    parser.consume(SemiColonToken, ParserErrors.EXPECT_SEMICOLON_AFTER_FOR_INCR);
    parser.consume(RightParenToken, ParserErrors.EXPECT_RIGHT_PAREN_AFTER_FOR_INCR);
  
    const body = parseStmt(parser);
  
    return {
      type: "For",
      initializer,
      condition,
      increment,
      body
    };
  }
  
  
  function parseWhileStmt(parser) {
    parser.consume(LeftParenToken, ParserErrors.EXPECT_LEFT_PAREN_AFTER_WHILE);
    const condition = parser.parseExp();
    parser.consume(RightParenToken, ParserErrors.EXPECT_RIGHT_PAREN_AFTER_WHILE);
    const body = parseStmt(parser);
    return { type: "While", condition, body };
  }
  
  function parseReturnStmt(parser) {
    let expr = null;
    if (!parser.check(SemiColonToken)) {
      expr = parser.parseExp();
    }
    parser.consume(SemiColonToken, ParserErrors.EXPECT_SEMICOLON_AFTER_RETURN);
    return { type: "Return", value: expr };
  }
  
  function parseBlockStmt(parser) {
    const statements = [];
    while (!parser.check(RightCurlyToken) && !parser.isAtEnd()) {
      statements.push(parseStmt(parser));
    }
    parser.consume(RightCurlyToken, ParserErrors.EXPECT_RIGHT_CURLY_AFTER_BLOCK);
    return { type: "Block", statements };
  }
  
  module.exports = {
    parseStmt,
    parseIfStmt,
    parseWhileStmt,
    parseReturnStmt,
    parseBlockStmt,
  };
  