const {
  ColonToken,
  SemiColonToken,
  DotToken,
  LeftCurlyToken,
  RightCurlyToken,
  ClassNameTypeToken,
  IntegerToken,
  StringToken,
  VariableToken,
  ClassToken,
  NewToken,
  MethodNameToken,
  ExtendToken,
  MethodToken,
} = require("./tokens");
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

  skipWhiteSpace() {
    while (
      this.offset < this.input.length &&
      /\s/.test(this.input[this.offset])
    ) {
      this.offset++;
    }
  }

  nextToken() {
    this.skipWhiteSpace();
    if (this.offset >= this.input.length) return null;

    const char = this.input[this.offset];

    if (this.isLetter(char)) return this.tokenizeWord();
    if (this.isDigit(char)) return this.tokenizeNumber();
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
    const prev = this.tokens[this.tokens.length - 1];

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
    // Class name contexts
    if (
      prev instanceof ClassToken ||
      prev instanceof NewToken ||
      prev instanceof ColonToken ||
      prev instanceof ExtendToken ||
      prev === undefined ||
      prev instanceof RightCurlyToken
    ) {
      return new ClassNameTypeToken(name);
    }

    // Check for method name after dot or standalone method call
    if (
      prev instanceof DotToken ||
      prev instanceof MethodToken ||
      (this.offset < this.input.length && this.input[this.offset] === "(")
    ) {
      return new MethodNameToken(name);
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
    this.offset++; // Skip opening quote

    while (this.offset < this.input.length) {
      const char = this.input[this.offset];
      if (char === '"') {
        this.offset++; // Skip closing quote
        return new StringToken(result);
      }
      if (char === "\\") {
        this.offset++;
        if (this.offset >= this.input.length) {
          throw new Error("Unterminated string literal - escape sequence");
        }
        const nextChar = this.input[this.offset];
        switch (nextChar) {
          case "n":
            result += "\n";
            break;
          case "t":
            result += "\t";
            break;
          case "r":
            result += "\r";
            break;
          case '"':
            result += '"';
            break;
          case "\\":
            result += "\\";
            break;
          default:
            result += nextChar;
        }
      } else {
        result += char;
      }
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
}
module.exports = Tokenizer;
