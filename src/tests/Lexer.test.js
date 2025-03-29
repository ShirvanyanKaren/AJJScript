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
  MethodToken,
} = require("../lexer/tokens/SpecialTokens");
const {
  PublicToken,
  PrivateToken,
  ProtectedToken,
  AccessToken,
} = require("../lexer/tokens/AccessTokens");

describe("Numeric Handling", () => {
  test("Valid integer parsing", () => {
    expectTokenizes("123", [new IntegerToken(123)]);
  });
  test("Valid negative integer parsing", () => {
    expectTokenizes("-123", [new IntegerToken(-123)]);
  });
});

describe("Type Handling", () => {
  test("Assignment for IntegerTypeToken", () => {
    expectTokenizes("int", [new IntegerTypeToken()]);
  });
  test("Assignment for StringTypeToken", () => {
    expectTokenizes("string", [new StringTypeToken()]);
  });
  test("Assignment for BooleanTypeToken", () => {
    expectTokenizes("boolean", [new BooleanTypeToken()]);
  });
  test("Assignment for VoidTypeToken", () => {
    expectTokenizes("void", [new VoidTypeToken()]);
  });
});
