const {
    ColonToken,
  } = require("./tokens/SymbolTokens");
  const {
    ClassNameTypeToken,
  } = require("./tokens/TypeTokens");
  const {
    IntegerToken,
    StringToken,
  } = require("./tokens/ExpressionTypeTokens");
  const VariableToken = require("./tokens/VariableToken");
  const {
    ClassToken,
    NewToken,
    MethodNameToken,
    ExtendToken,
  } = require("./tokens/SpecialTokens");
  const { keywordMap, symbolMap, multiCharSymbolMap } = require("../utils/Lexer");

  class Tokenizer {
    constructor(input) {
      this.input = input;
      this.offset = 0;
      this.tokens = [];
    }

    tokenizeAll() {

    }

    nextToken() {

    }
    skipWhiteSpace() {

    }


}