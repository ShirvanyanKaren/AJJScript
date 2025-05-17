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
    parser.consume(ClassToken, ParserErrors.EXPECT_CLASS_KEYWORD);
    const nameToken = parser.consume(ClassNameTypeToken, ParserErrors.EXPECT_CLASS_NAME);
    const className = nameToken.value;
  
    let superclass = null;
    if (parser.match(ExtendToken)) {
      const superToken = parser.consume(ClassNameTypeToken, ParserErrors.EXPECT_SUPERCLASS_NAME);
      superclass = superToken.value;
    }
  
    parser.consume(LeftCurlyToken, ParserErrors.EXPECT_LEFT_CURLY);
  
    const varDecs = [];
    while (isTypeToken(parser.peek()) || isAccessModifier(parser.peek())) {
      const varDec = parseVarDec(parser);
      varDecs.push(varDec);
      parser.consume(SemiColonToken, ParserErrors.EXPECT_SEMICOLON_AFTER_VARDEC);
    }
  
    let constructorNode = null;
    if (parser.check(ConstructorToken) || parser.check(SuperToken)) {
      constructorNode = parseConstructor(parser);
    }
  
    const methods = [];
    while (parser.check(MethodToken)) {
      methods.push(parseMethodDef(parser));
    }
  
    parser.consume(RightCurlyToken, ParserErrors.EXPECT_RIGHT_CURLY);
  
    return new ClassDef(className, superclass, varDecs, constructorNode, methods);
  }
  
  /**
   * Parses a variable declaration.
   * @param {import('../parser/Parser')} parser - The parser instance.
   * @returns {VarDec} - A variable declaration node.
   */
  function parseVarDec(parser) {
    let isProtected = false;
    let isPrivate = false;
  
    if (parser.match(ProtectedToken)) isProtected = true;
    if (parser.match(PrivateToken)) isPrivate = true;
  
    const typeToken = parser.peek();
    if (!isTypeToken(typeToken)) {
      throw new Error(`Expected type token at position ${parser.current}`);
    }
    const typeNode = parser.parseType();
    const varToken = parser.consume(VariableToken, ParserErrors.EXPECT_VARIABLE_NAME);
  
    const node = new VarDec(typeNode, varToken.value);
    node.isProtected = isProtected;
    node.isPrivate = isPrivate;
    return node;
  }
  
  /**
   * Parses either an `init` or `super` constructor block.
   * @param {import('../parser/Parser')} parser - The parser instance.
   * @returns {Constructor} - A constructor node.
   * @throws {Error} If constructor is not formatted correctly.
   */
  function parseConstructor(parser) {
    if (parser.match(ConstructorToken)) {
      parser.consume(LeftParenToken, ParserErrors.EXPECT_LEFT_PAREN_AFTER_INIT);
      const params = parseCommaSeparated({
        parser,
        parseFunc: parseVarDec.bind(null, parser),
        endToken: RightParenToken
      });
      parser.consume(RightParenToken, ParserErrors.EXPECT_CONSTRUCTOR_PARAMS_END);
      parser.consume(LeftCurlyToken, ParserErrors.EXPECT_LEFT_CURLY);
      const body = parseUntil(parser, parser.parseStmt.bind(parser), RightCurlyToken);
      parser.consume(RightCurlyToken, ParserErrors.EXPECT_RIGHT_CURLY);
      return new Constructor(params, null, body);
    }
  
    if (parser.match(SuperToken)) {
      parser.consume(LeftParenToken, ParserErrors.EXPECT_LEFT_PAREN_AFTER_SUPER);
      const args = parseCommaSeparated({
        parser,
        parseFunc: parser.parseExp.bind(parser),
        endToken: RightParenToken
      });
      parser.consume(RightParenToken, ParserErrors.EXPECT_SUPER_ARGS_END);
      parser.consume(LeftCurlyToken, ParserErrors.EXPECT_LEFT_CURLY);
      const body = parseUntil(parser, parser.parseStmt.bind(parser), RightCurlyToken);
      parser.consume(RightCurlyToken, ParserErrors.EXPECT_RIGHT_CURLY_AFTER_SUPER);
  
      const params = args.map(arg => ({
        identifier: arg.name,
        varType: { typeName: "integer" }, // TODO: Use actual type checking?
        isProtected: false,
        isPrivate: false
      }));
  
      return new Constructor(params, { args }, body);
    }
  
    throw new Error("Expected constructor (either `init` or `super`) declaration");
  }
  
  /**
   * Parses a method definition.
   * @param {import('../parser/Parser')} parser - The parser instance.
   * @returns {MethodDef} - A method definition node.
   */
  function parseMethodDef(parser) {
    parser.consume(MethodToken, ParserErrors.EXPECT_METHOD_KEYWORD);
    const methodNameToken = parser.consume(MethodNameToken, ParserErrors.EXPECTED_METHOD_NAME);
    const methodName = methodNameToken.value;
  
    parser.consume(LeftParenToken, ParserErrors.EXPECT_LEFT_PAREN_AFTER_METHOD);
    const params = parseCommaSeparated({
      parser,
      parseFunc: parseVarDec.bind(null, parser),
      endToken: RightParenToken
    });
    parser.consume(RightParenToken, ParserErrors.EXPECT_METHOD_PARAMS_END);
  
    const returnType = parser.parseType();
    parser.consume(LeftCurlyToken, ParserErrors.EXPECT_METHOD_BODY_START);
    const body = parseUntil(parser, parser.parseStmt.bind(parser), RightCurlyToken);
    parser.consume(RightCurlyToken, ParserErrors.EXPECT_METHOD_BODY_END);
  
    return new MethodDef(methodName, params, returnType, body);
  }
  
  module.exports = {
    parseClassDef,
    parseConstructor,
    parseMethodDef,
    parseVarDec
  };
  