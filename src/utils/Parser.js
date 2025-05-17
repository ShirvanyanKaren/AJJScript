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
  }
  
  function isAccessModifier(token) {
  }
  
  function isClassName(name, tokens) {
  }
  
  function parseCommaSeparated({ parser, parseFunc, endToken }) {
  }


  function parseUntil(parser, parseFunc, endToken) {
  }

  function parseParams(parser) {
  }
  
  module.exports = {
    isTypeToken,
    isAccessModifier,
    isClassName,
    parseCommaSeparated,
    parseUntil,
    parseParams
  };
  