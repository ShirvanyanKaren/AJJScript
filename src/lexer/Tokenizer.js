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
    // End of input
    if (this.offset >= this.input.length) return null;

    const char = this.input[this.offset];
    const next = this.input[this.offset + 1];

    if (char === "-" && this.isDigit(next)) {
      this.offset++;
      const token = this.tokenizeNumber();
      token.value = -token.value;
      return token;
    }
    // Testing for numbers, strings, and words
    if (this.isLetter(char)) return this.tokenizeWord();
    if (this.isDigit(char)) return this.tokenizeNumber();
    if (char === '"') return this.tokenizeString();

    return this.tokenizeSymbol();
  }

  tokenizeSymbol() {
    const twoChar = this.input.slice(this.offset, this.offset + 2);
    const oneChar = this.input[this.offset];

    // Multi-character symbols
    if (multiCharSymbolMap[twoChar]) {
      this.offset += 2;
      return new multiCharSymbolMap[twoChar]();
    }

    // Single-character symbols
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

  tokenizeNumber() {
    let number = "";
    while (
      this.offset < this.input.length &&
      this.isDigit(this.input[this.offset])
    ) {
      number += this.input[this.offset++];
    }

    if (number === "") {
      throw new Error(`Invalid number at position ${this.offset}`);
    }

    return new IntegerToken(parseInt(number, 10));
  }

  tokenizeString() {
    let result = "";
    this.offset++;

    while (this.offset < this.input.length) {
      const char = this.input[this.offset];
      if (char === '"') {
        this.offset++;
        return new StringToken(result);
      }
      result += char;
      this.offset++;
    }

    throw new Error("Unterminated string literal");
  }
  isLetter(char) {
    return /[a-zA-Z]/.test(char);
  }

  isLetterOrDigit(char) {
    return /[a-zA-Z0-9]/.test(char);
  }

  isDigit(char) {
    return /[0-9]/.test(char);
  }

  skipWhiteSpace() {
    while (
      this.offset < this.input.length &&
      /\s/.test(this.input[this.offset])
    ) {
      this.offset++;
    }
  }
}
