/**
 * @fileoverview Parses class definitions, constructors, methods, and variable declarations in the AJJ language.
 * This file is part of the AJJ compiler frontend.
 */

const {
    ClassToken,
    ExtendToken,
    ConstructorToken,
    SuperToken,
    MethodToken,
    ClassNameTypeToken,
    LeftCurlyToken,
    RightCurlyToken,
    SemiColonToken,
    ProtectedToken,
    PrivateToken,
    VariableToken,
    LeftParenToken,
    RightParenToken,
    MethodNameToken,
  } = require("../lexer/tokens");
  
  const {
    ClassDef,
    Constructor,
    MethodDef,
    VarDec,
  } = require("../parser/ASTNodes");
  
  const {
    isTypeToken,
    isAccessModifier,
    parseCommaSeparated,
    parseUntil,
  } = require("../utils/Parser");
  
  const ParserErrors = require("../utils/ParserErrorMessages");
  
  /**
   * Parses a class definition from the current token stream.
   * @param {import('../parser/Parser')} parser - The parser instance.
   * @returns {ClassDef} - The parsed class definition node.
   */
  function parseClassDef(parser) {

  }
  
  /**
   * Parses a variable declaration.
   * @param {import('../parser/Parser')} parser - The parser instance.
   * @returns {VarDec} - A variable declaration node.
   */
  function parseVarDec(parser) {

  }
  
  /**
   * Parses either an `init` or `super` constructor block.
   * @param {import('../parser/Parser')} parser - The parser instance.
   * @returns {Constructor} - A constructor node.
   * @throws {Error} If constructor is not formatted correctly.
   */
  function parseConstructor(parser) {
    
  }
  
  /**
   * Parses a method definition.
   * @param {import('../parser/Parser')} parser - The parser instance.
   * @returns {MethodDef} - A method definition node.
   */
  function parseMethodDef(parser) {
  }
  
  module.exports = {
    parseClassDef,
    parseConstructor,
    parseMethodDef,
    parseVarDec
  };
  