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

const VariableToken = require("../lexer/tokens/VariableToken");
