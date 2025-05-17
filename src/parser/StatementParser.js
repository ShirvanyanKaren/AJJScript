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
  
  function parseStmt(parser) {}
  
  function parseIfStmt(parser) {
    
  }
  function parseForStmt(parser) {

  }
  
  
  function parseWhileStmt(parser) {

  }
  
  function parseReturnStmt(parser) {

  }
  
  function parseBlockStmt(parser) {

  }
  
  module.exports = {
    parseStmt,
    parseIfStmt,
    parseWhileStmt,
    parseReturnStmt,
    parseBlockStmt,
  };
  