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
    EqualsToken,
    NotEqualsToken,
    GreaterThanEqualToken,
    GreaterThanToken,
    LessThanEqualToken,
    LessThanToken,
    AssignmentToken,
  } = require("../lexer/tokens/OperatorTokens");
  const {
    PublicToken,
    PrivateToken,
    ProtectedToken,
  } = require("../lexer/tokens/AccessTokens");
  const {
    SuperToken,
    ClassToken,
    NewToken,
    ExtendToken,
    ConstructorToken,
    MethodToken,
  } = require("../lexer/tokens/SpecialTokens");
  const {
    IntegerToken,
    TrueToken,
    FalseToken,
    StringToken,
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
    VoidTypeToken,
    IntegerTypeToken,
    StringTypeToken,
    BooleanTypeToken,
    ClassNameTypeToken,
  } = require("../lexer/tokens/TypeTokens");
