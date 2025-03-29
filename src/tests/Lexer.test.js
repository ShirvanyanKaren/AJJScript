const Tokenizer = require("../lexer/Tokenizer");
const BaseToken = require("../lexer/tokens/BaseToken");
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
  IfToken,
  ReturnToken,
  WhileToken,
  BreakToken,
  ThisToken,
  PrintToken,
} = require("../lexer/tokens/StatementTokens");
const {
  TrueToken,
  FalseToken,
  IntegerToken,
  StringToken,
} = require("../lexer/tokens/ExpressionTypeTokens");
const {
  ClassNameTypeToken,
  IntegerTypeToken,
  StringTypeToken,
  BooleanTypeToken,
  VoidTypeToken,
} = require("../lexer/tokens/TypeTokens");
const {
  AssignmentToken,
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
} = require("../lexer/tokens/OperatorTokens");
const VariableToken = require("../lexer/tokens/VariableToken");
const {
  SuperToken,
  ClassToken,
  NewToken,
  MethodNameToken,
  ConstructorToken,
  ExtendToken,
  MethodToken
} = require("../lexer/tokens/SpecialTokens");
const {
  PublicToken,
  PrivateToken,
  ProtectedToken,
  AccessToken,
} = require("../lexer/tokens/AccessTokens");


