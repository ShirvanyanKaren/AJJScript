const { ColonToken } = require("./tokens/SymbolTokens");
const { ClassNameTypeToken } = require("./tokens/TypeTokens");
const { IntegerToken, StringToken } = require("./tokens/ExpressionTypeTokens");
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
    while (this.offset < this.input.length) {
      const token = this.nextToken();
      if (token !== null) this.tokens.push(token);
    }
    return this.tokens;
  }

  nextToken() {}

  skipWhiteSpace() {
    while (
      this.offset < this.input.length &&
      /\s/.test(this.input[this.offset])
    ) {
      this.offset++;
    }
  }
}
