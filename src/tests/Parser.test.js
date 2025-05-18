const Parser = require('../parser/Parser');
const {
  IntegerToken,
  StringToken,
  TrueToken,
  FalseToken,
} = require("../lexer/tokens/ExpressionTypeTokens");
const {
  PlusToken,
  MinusToken,
  MultiplyToken,
  DivideToken,
  AssignmentToken,
  EqualsToken,
  GreaterThanToken,
  NotEqualsToken,
  IncrementToken,
  OrToken,
  AndOrToken,
  AndToken,
} = require("../lexer/tokens/OperatorTokens");
const {
  LeftCurlyToken,
  RightCurlyToken,
  LeftParenToken,
  RightParenToken,
  DotToken,
  SemiColonToken,
  CommaToken,
  ColonToken,
} = require("../lexer/tokens/SymbolTokens");
const {
  IntegerTypeToken,
  StringTypeToken,
  BooleanTypeToken,
  VoidTypeToken,
  ClassNameTypeToken,
} = require("../lexer/tokens/TypeTokens");
const {
  ReturnToken,
  IfToken,
  ElseToken,
  WhileToken,
  BreakToken,
  PrintToken,
  ThisToken,
} = require("../lexer/tokens/StatementTokens");
const {
  ClassToken,
  ExtendToken,
  ConstructorToken,
  MethodToken,
  MethodNameToken,
  SuperToken,
  NewToken,
} = require("../lexer/tokens/SpecialTokens");
const VariableToken = require("../lexer/tokens/VariableToken");
const BaseToken = require('../lexer/tokens/BaseToken');
const {
  Program,
  ClassDef,
  Constructor,
  MethodDef,
  VarDec,
  ExpressionStatement,
  BinaryExpression,
} = require("../parser/ASTNodes");
const { parseCommaSeparated, isTypeToken } = require('../utils/Parser');
const { parseExp } = require('../parser/ExpParser');
const { PrivateToken, ProtectedToken } = require('../lexer/tokens');

describe('BaseToken', () => {
  test('should create a token with null value by default', () => {
    const token = new BaseToken();
    expect(token.value).toBeNull();
  });

  test('should create a token with the specified value', () => {
    const token = new BaseToken('test');
    expect(token.value).toBe('test');
  });

  test('should correctly format token as string', () => {
    const nullToken = new BaseToken();
    expect(nullToken.toString()).toBe('BaseToken(object)');

    const stringToken = new BaseToken('test');
    expect(stringToken.toString()).toBe('BaseToken(string)');

    const numberToken = new BaseToken(42);
    expect(numberToken.toString()).toBe('BaseToken(number)');

    const boolToken = new BaseToken(true);
    expect(boolToken.toString()).toBe('BaseToken(boolean)');
  });
});

describe('Parser - Consolidated Tests', () => {
  // Helper to create a variable token
  const createVar = (name) => new VariableToken(name);
  
  //AST Node Tests
  describe('AST Nodes', () => {
    test("should create a Program node", () => {
      const classDefs = ["classDef1", "classDef2"];
      const statements = ["stmt1", "stmt2"];
      const program = new Program(classDefs, statements);
      expect(program.classDefs).toEqual(classDefs);
      expect(program.statements).toEqual(statements);
    });

    test("should create a ClassDef node", () => {
      const name = "MyClass";
      const superclass = "BaseClass";
      const varDecs = ["varDec1"];
      const constructorNode = "constructorNode";
      const methods = ["method1", "method2"];
      const classDef = new ClassDef(
        name,
        superclass,
        varDecs,
        constructorNode,
        methods,
      );
      expect(classDef.name).toBe(name);
      expect(classDef.superclass).toBe(superclass);
      expect(classDef.varDecs).toEqual(varDecs);
      expect(classDef.constructor).toBe(constructorNode);
      expect(classDef.methods).toEqual(methods);
    });

    test("should create a Constructor node", () => {
      const params = ["param1", "param2"];
      const superCall = { arguments: ["arg1"] };
      const body = ["stmt"];
      const ctor = new Constructor(params, superCall, body);
      expect(ctor.params).toEqual(params);
      expect(ctor.superCall).toEqual(superCall);
      expect(ctor.body).toEqual(body);
    });

    test("should create a VarDec node", () => {
      const varType = { typeName: "int" };
      const identifier = "x";
      const varDec = new VarDec(varType, identifier);
      expect(varDec.varType).toEqual(varType);
      expect(varDec.identifier).toBe(identifier);
    });

    test("should create an ExpressionStatement node", () => {
      const expression = "x + y";
      const exprStmt = new ExpressionStatement(expression);
      expect(exprStmt.expression).toBe(expression);
    });

    test("should create a BinaryExpression node", () => {
      const left = "x";
      const operator = "+";
      const right = "y";
      const binaryExp = new BinaryExpression(left, operator, right);
      expect(binaryExp.left).toBe(left);
      expect(binaryExp.operator).toBe(operator);
      expect(binaryExp.right).toBe(right);
    });
    
    test("should create a full ClassDef with all properties", () => {
      const name = "MyClass";
      const superclass = "BaseClass";
      const varDecs = [
        new VarDec({ typeName: "int" }, "x"),
        new VarDec({ typeName: "string" }, "name")
      ];
      const constructorNode = new Constructor(
        [new VarDec({ typeName: "int" }, "param")],
        { arguments: ["arg1"] },
        ["stmt1"]
      );
      const methods = [
        new MethodDef("method1", [], { typeName: "void" }, []),
        new MethodDef("method2", [new VarDec({ typeName: "int" }, "param")], { typeName: "int" }, ["stmt"])
      ];
      
      const classDef = new ClassDef(name, superclass, varDecs, constructorNode, methods);
      
      expect(classDef.name).toBe(name);
      expect(classDef.superclass).toBe(superclass);
      expect(classDef.varDecs).toEqual(varDecs);
      expect(classDef.constructor).toBe(constructorNode);
      expect(classDef.methods).toEqual(methods);
    });
    
    test("should create a MethodDef node with all properties", () => {
      const name = "calculate";
      const params = ["a", "b"];
      const returnType = { typeName: "int" };
      const body = ["stmt1", "stmt2"];
      
      const methodDef = new MethodDef(name, params, returnType, body);
      
      expect(methodDef.name).toBe(name);
      expect(methodDef.params).toEqual(params);
      expect(methodDef.returnType).toEqual(returnType);
      expect(methodDef.body).toEqual(body);
    });
    
    test("should create a full Program node with both classDefs and statements", () => {
      const classDefs = [
        new ClassDef("ClassA", null, [], new Constructor([], null, []), []),
        new ClassDef("ClassB", "ClassA", [], new Constructor([], null, []), [])
      ];
      
      const statements = [
        new VarDec({ typeName: "int" }, "x"),
        new ExpressionStatement(new BinaryExpression("x", "+", "1"))
      ];
      
      const program = new Program(classDefs, statements);
      
      expect(program.classDefs).toEqual(classDefs);
      expect(program.statements).toEqual(statements);
    });
  });

  describe('Expression Parsing', () => {
    test('should parse integer literals', () => {
      const tokens = [new IntegerToken(42), new SemiColonToken()];
      const parser = new Parser(tokens);
      const result = parser.parseExp();
      
      expect(result).toEqual({
        type: 'IntegerLiteral',
        value: 42
      });
    });
    
    test('should parse string literals', () => {
      const tokens = [new StringToken("hello"), new SemiColonToken()];
      const parser = new Parser(tokens);
      const result = parser.parseExp();
      
      expect(result).toEqual({
        type: 'StringLiteral',
        value: "hello"
      });
    });
    
    test('should parse variables', () => {
      const tokens = [createVar("x"), new SemiColonToken()];
      const parser = new Parser(tokens);
      const result = parser.parseExp();
      
      expect(result).toEqual({
        type: 'Variable',
        name: "x"
      });
    });
    
    test('should parse binary expressions with addition', () => {
      const tokens = [
        new IntegerToken(5),
        new PlusToken(),
        new IntegerToken(3),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseExp();
      
      expect(result.left).toEqual({ type: 'IntegerLiteral', value: 5 });
      expect(result.right).toEqual({ type: 'IntegerLiteral', value: 3 });
    });
    

  })


}

);