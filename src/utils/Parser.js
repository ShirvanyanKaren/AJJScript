// utils/Parser.js

const {
    IntegerTypeToken,
    StringTypeToken,
    BooleanTypeToken,
    VoidTypeToken,
    ClassNameTypeToken,
  } = require("../lexer/tokens/TypeTokens");
  
  const {
    ProtectedToken,
    PrivateToken,
    PublicToken,
  } = require("../lexer/tokens/AccessTokens");
  
const { ClassToken, ClassNameTypeToken: ClassNameToken } = require("../lexer/tokens/SpecialTokens");
const { VariableToken, RightParenToken, CommaToken } = require("../lexer/tokens");

  
  function isTypeToken(token) {
    return (
      token instanceof IntegerTypeToken ||
      token instanceof StringTypeToken ||
      token instanceof BooleanTypeToken ||
      token instanceof VoidTypeToken ||
      token instanceof ClassNameTypeToken ||
      (token instanceof VariableToken && token._isClassName)
    );
  }
  
  function isAccessModifier(token) {
    return (
      token instanceof ProtectedToken ||
      token instanceof PrivateToken ||
      token instanceof PublicToken
    );
  }
  
  function isClassName(name, tokens) {
    for (let i = 0; i < tokens.length - 1; i++) {
      if (
        tokens[i] instanceof ClassToken &&
        tokens[i + 1] instanceof ClassNameToken &&
        tokens[i + 1].value === name
      ) {
        return true;
      }
    }
    return false;
  }
  
  function parseCommaSeparated({ parser, parseFunc, endToken }) {
    const list = [];
    if (!parser.check(endToken)) {
      list.push(parseFunc());
      while (parser.match(require("../lexer/tokens/SymbolTokens").CommaToken)) {
        list.push(parseFunc());
      }
    }
    return list;
  }


  function parseUntil(parser, parseFunc, endToken) {
    const items = [];
    while (!parser.check(endToken) && !parser.isAtEnd()) {
      items.push(parseFunc.call(parser));
    }
    return items;
  }

  function parseParams(parser) {
    const params = [];
  
    if (!parser.check(RightParenToken)) {
      do {
        const typeToken = parser.parseType(); 
        const nameToken = parser.consume(VariableToken, "Expected variable name in parameter list");
        params.push({
          varType: typeToken,
          identifier: nameToken.value,
        });
      } while (parser.match(CommaToken));
    }
  
    return params;
  }
  
  module.exports = {
    isTypeToken,
    isAccessModifier,
    isClassName,
    parseCommaSeparated,
    parseUntil,
    parseParams
  };
  