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

  nextToken() {
    this.skipWhiteSpace();
    if (this.offset >= this.input.length) return null;

    const char = this.input[this.offset];
    const next = this.input[this.offset + 1];

    if (char === "-" && this.isDigit(next)) {
      this.offset++;
      const token = this.tokenizeNumber();
      token.value = -token.value;
      return token;
    }

    if (/[_a-zA-Z]/.test(char)) return this.tokenizeWord();
    if (/[a-zA-Z]/.test(char)) return this.tokenizeNumber();
    if (char === '"') return this.tokenizeString();

    return this.tokenizeSymbol();
  }

  tokenizeSymbol() {
    const twoChar = this.input.slice(this.offset, this.offset + 2);
    const oneChar = this.input[this.offset];

    if (multiCharSymbolMap[twoChar]) {
      this.offset += 2;
      return new multiCharSymbolMap[twoChar]();
    }

    if (symbolMap[oneChar]) {
      this.offset++;
      return new symbolMap[oneChar]();
    }

    throw new Error(`Unexpected token at position ${this.offset}: ${oneChar}`);
  }

  tokenizeWord() {
    let name = "";

    // Read the entire word
    while (
      this.offset < this.input.length &&
      this.isLetterOrDigit(this.input[this.offset])
    ) {
      name += this.input[this.offset++];
    }

    // Keywords
    const TokenClass = keywordMap[name];
    if (TokenClass) return new TokenClass();

    // Method-like tokens (e.g. println, user-defined methods)
    if (this.offset < this.input.length && this.input[this.offset] === "(") {
      return new MethodNameToken(name);
    }

    // Class name contexts
    const prev = this.tokens[this.tokens.length - 1];
    if (
      prev instanceof ClassToken ||
      prev instanceof NewToken ||
      prev instanceof ColonToken ||
      prev instanceof ExtendToken
    ) {
      return new ClassNameTypeToken(name);
    }
    

    return new VariableToken(name);
  }

  tokenizeNumber() {}

  tokenizeString() {}

  skipWhiteSpace() {
    while (
      this.offset < this.input.length &&
      /\s/.test(this.input[this.offset])
    ) {
      this.offset++;
    }
  }
}
