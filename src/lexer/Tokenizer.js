/**
 * @file Tokenizer.js
 * @description Converts source code input into a stream of tokens used by the parser.
 */

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

/**
 * The Tokenizer class reads input code and splits it into meaningful tokens.
 * It handles identifiers, numbers, strings, symbols, and keywords.
 */
class Tokenizer {
  /**
   * @param {string} input - The raw source code string to tokenize.
   */
  constructor(input) {
    this.input = input;
    this.offset = 0;
    this.tokens = [];
  }

  /**
   * Tokenizes the entire input string.
   * @returns {Array<Token>} An array of tokens representing the input.
   */
  tokenizeAll() {
    while (this.offset < this.input.length) {
      const token = this.nextToken();
      if (token !== null) this.tokens.push(token);
    }
    return this.tokens;
  }

  /**
   * Skips over whitespace characters in the input.
   */
  skipWhiteSpace() {
    while (
      this.offset < this.input.length &&
      /\s/.test(this.input[this.offset])
    ) {
      this.offset++;
    }
  }

  /**
   * Gets the next token from the input.
   * @returns {Token|null}
   */
  nextToken() {
    this.skipWhiteSpace();
    if (this.offset >= this.input.length) return null;

    const char = this.input[this.offset];

    if (this.isLetter(char)) return this.tokenizeWord();
    if (this.isDigit(char)) return this.tokenizeNumber();
    if (char === '"') return this.tokenizeString();

    return this.tokenizeSymbol();
  }

  /**
   * Tokenizes a symbol (e.g., `{`, `;`, `:` or `==`).
   * @returns {Token}
   */
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

  /**
   * Tokenizes a word, which may be a keyword, class name, method name, or variable.
   * @returns {Token}
   */
  tokenizeWord() {
    let name = "";
    const prev = this.tokens[this.tokens.length - 1];

    // Read the full word
    while (
      this.offset < this.input.length &&
      this.isLetterOrDigit(this.input[this.offset])
    ) {
      name += this.input[this.offset++];
    }

    // Check if it's a keyword (like class, new, method)
    const TokenClass = keywordMap[name];
    if (TokenClass) return new TokenClass();

    // Class name context (e.g., after 'class', 'new', or ':')
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

    // Method name context (e.g., after a dot or 'method' keyword)
    if (
      prev instanceof DotToken ||
      prev instanceof MethodToken ||
      (this.offset < this.input.length && this.input[this.offset] === "(")
    ) {
      return new MethodNameToken(name);
    }

    // Lookahead for class-type variable declarations
    const lookahead = this.input.slice(this.offset).trimStart();
    const looksLikeVarDecl =
      /^[a-zA-Z_][a-zA-Z0-9_]*\s*=/.test(lookahead) ||
      /^[a-zA-Z_][a-zA-Z0-9_]*\s*;/.test(lookahead);

    if (name[0] === name[0].toUpperCase() && looksLikeVarDecl) {
      return new ClassNameTypeToken(name);
    }

    // Default to variable token
    return new VariableToken(name);
  }

  /**
   * Tokenizes a number literal.
   * @returns {IntegerToken}
   */
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

  /**
   * Tokenizes a string literal, handling escape sequences.
   * @returns {StringToken}
   */
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

  /**
   * Checks if a character is a letter (a-z or A-Z).
   * @param {string} char
   * @returns {boolean}
   */
  isLetter(char) {
    return /[a-zA-Z]/.test(char);
  }

  /**
   * Checks if a character is a letter or digit.
   * @param {string} char
   * @returns {boolean}
   */
  isLetterOrDigit(char) {
    return /[a-zA-Z0-9]/.test(char);
  }

  /**
   * Checks if a character is a digit (0-9).
   * @param {string} char
   * @returns {boolean}
   */
  isDigit(char) {
    return /[0-9]/.test(char);
  }
}

module.exports = Tokenizer;
