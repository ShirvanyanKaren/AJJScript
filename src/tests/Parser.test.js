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
  
  // Expression Parsing Tests
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
    
    test('should parse binary expressions with multiplication', () => {
      const tokens = [
        new IntegerToken(5),
        new MultiplyToken(),
        new IntegerToken(3),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseExp();
      
      expect(result.left).toEqual({ type: 'IntegerLiteral', value: 5 });
      expect(result.right).toEqual({ type: 'IntegerLiteral', value: 3 });
    });
    
    test('should respect precedence in complex expressions', () => {
      const tokens = [
        new IntegerToken(2),
        new PlusToken(),
        new IntegerToken(3),
        new MultiplyToken(),
        new IntegerToken(4),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseExp();
      
      // Should be parsed as: 2 + (3 * 4)
      expect(result.left).toEqual({ type: 'IntegerLiteral', value: 2 });
      expect(result.right.left).toEqual({ type: 'IntegerLiteral', value: 3 });
      expect(result.right.right).toEqual({ type: 'IntegerLiteral', value: 4 });
    });
    
    test('should parse boolean literals', () => {
      // Test true token
      let tokens = [
        new TrueToken(),
        new SemiColonToken()
      ];
      let parser = new Parser(tokens);
      let result = parser.parseExp();
      
      expect(result.type).toBe("BooleanLiteral");
      expect(result.value).toBe(true);
      
      // Test false token
      tokens = [
        new FalseToken(),
        new SemiColonToken()
      ];
      parser = new Parser(tokens);
      result = parser.parseExp();
      
      expect(result.type).toBe("BooleanLiteral");
      expect(result.value).toBe(false);
    });
    
    test('should parse print statement', () => {
      const tokens = [
        new PrintToken(),
        new LeftParenToken(),
        new StringToken("Hello, world!"),
        new RightParenToken(),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseExp();
      
      expect(result.type).toBe("Print");
      expect(result.argument.type).toBe("StringLiteral");
      expect(result.argument.value).toBe("Hello, world!");
    });
    
    test('should parse parenthesized expressions', () => {
      const tokens = [
        new LeftParenToken(),
        new IntegerToken(42),
        new RightParenToken(),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseExp();
      
      expect(result.type).toBe("IntegerLiteral");
      expect(result.value).toBe(42);
    });
    
    test('should parse this expression', () => {
      const tokens = [
        new ThisToken(),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseExp();
      
      expect(result.type).toBe("This");
    });
  });
  
  // Statement Parsing Tests
  describe('Statement Parsing', () => {
    test('should parse variable declarations', () => {
      const tokens = [
        new IntegerTypeToken(),
        createVar("counter"),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseStmt();
      
      expect(result.varType).toEqual({ typeName: "integer" });
      expect(result.identifier).toBe("counter");
    });
    
    test('should parse assignment statements', () => {
      const tokens = [
        createVar("x"),
        new AssignmentToken(),
        new IntegerToken(10),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseStmt();
      
      expect(result.type).toBe("Assignment");
      expect(result.left).toEqual({ type: 'Variable', name: 'x' });
      expect(result.right).toEqual({ type: 'IntegerLiteral', value: 10 });
    });
    
    test('should parse if statements', () => {
      const tokens = [
        new IfToken(),
        new LeftParenToken(),
        createVar("condition"),
        new RightParenToken(),
        new LeftCurlyToken(),
        new IntegerTypeToken(),
        createVar("x"),
        new SemiColonToken(),
        new RightCurlyToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseStmt();
      
      expect(result.type).toBe("If");
      expect(result.condition).toEqual({ type: 'Variable', name: 'condition' });
      expect(result.thenBranch.type).toBe("Block");
      expect(result.thenBranch.statements.length).toBe(1);
      expect(result.elseBranch).toBeNull();
    });
    
    test('should parse if-else statements', () => {
      const tokens = [
        new IfToken(),
        new LeftParenToken(),
        createVar("condition"),
        new RightParenToken(),
        new LeftCurlyToken(),
        new RightCurlyToken(),
        new ElseToken(),
        new LeftCurlyToken(),
        new RightCurlyToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseStmt();
      
      expect(result.type).toBe("If");
      expect(result.condition).toEqual({ type: 'Variable', name: 'condition' });
      expect(result.thenBranch.type).toBe("Block");
      expect(result.elseBranch.type).toBe("Block");
    });
    
    test('should parse while statements', () => {
      const tokens = [
        new WhileToken(),
        new LeftParenToken(),
        createVar("condition"),
        new RightParenToken(),
        new LeftCurlyToken(),
        new RightCurlyToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseStmt();
      
      expect(result.type).toBe("While");
      expect(result.condition).toEqual({ type: 'Variable', name: 'condition' });
      expect(result.body.type).toBe("Block");
    });
    
    test('should parse return statements', () => {
      const tokens = [
        new ReturnToken(),
        new IntegerToken(42),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseStmt();
      
      expect(result.type).toBe("Return");
      expect(result.value).toEqual({ type: 'IntegerLiteral', value: 42 });
    });
    
    test('should parse empty return statements', () => {
      const tokens = [
        new ReturnToken(),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseStmt();
      
      expect(result.type).toBe("Return");
      expect(result.value).toBeNull();
    });
    
    test('should parse block statements', () => {
      const tokens = [
        new LeftCurlyToken(),
        new IntegerTypeToken(),
        createVar("x"),
        new SemiColonToken(),
        new StringTypeToken(),
        createVar("y"),
        new SemiColonToken(),
        new RightCurlyToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseStmt();
      
      expect(result.type).toBe("Block");
      expect(result.statements.length).toBe(2);
    });
    
    test('should parse break statement', () => {
      const tokens = [
        new BreakToken(),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseStmt();
      
      expect(result.type).toBe("Break");
    });
  });
  
  // Method Call Parsing
  describe('Method Call Parsing', () => {
    test('should parse method calls', () => {
      const tokens = [
        createVar("obj"),
        new DotToken(),
        new MethodNameToken("method"),
        new LeftParenToken(),
        new IntegerToken(1),
        new CommaToken(),
        new IntegerToken(2),
        new RightParenToken(),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseExp();
      
      expect(result.type).toBe("MethodCall");
      expect(result.callee).toEqual({ type: 'Variable', name: 'obj' });
      expect(result.methodName).toBe("method");
    });
    
    test('should parse chained method calls', () => {
      const tokens = [
        createVar("obj"),
        new DotToken(),
        new MethodNameToken("method1"),
        new LeftParenToken(),
        new RightParenToken(),
        new DotToken(),
        new MethodNameToken("method2"),
        new LeftParenToken(),
        new RightParenToken(),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseExp();
      
      expect(result.type).toBe("MethodCall");
      expect(result.callee.callee).toEqual({ type: 'Variable', name: 'obj' });
      expect(result.callee.methodName).toBe("method1");
    });
  });
  
  // Class-related Parsing Tests
  describe('Class-related Parsing', () => {
    test('should parse simple class definitions', () => {
      const tokens = [
        new ClassToken(),
        new ClassNameTypeToken("MyClass"),
        new LeftCurlyToken(),
        new ConstructorToken(),
        new LeftParenToken(),
        new RightParenToken(),
        new LeftCurlyToken(),
        new RightCurlyToken(),
        new RightCurlyToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseClassDef();
      
      expect(result.name).toBe("MyClass");
      expect(result.superclass).toBeNull();
      expect(result.varDecs.length).toBe(0);
      expect(result.methods.length).toBe(0);
    });
    
    test('should parse class with instance variables', () => {
      const tokens = [
        new ClassToken(),
        new ClassNameTypeToken("WithVars"),
        new LeftCurlyToken(),
        new IntegerTypeToken(),
        createVar("x"),
        new SemiColonToken(),
        new StringTypeToken(),
        createVar("name"),
        new SemiColonToken(),
        new ConstructorToken(),
        new LeftParenToken(),
        new RightParenToken(),
        new LeftCurlyToken(),
        new RightCurlyToken(),
        new RightCurlyToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseClassDef();
      
      expect(result.name).toBe("WithVars");
      expect(result.varDecs.length).toBe(2);
      expect(result.varDecs[0].identifier).toBe("x");
      expect(result.varDecs[1].identifier).toBe("name");
    });
    
    test('should parse class with extends', () => {
      const tokens = [
        new ClassToken(),
        new ClassNameTypeToken("Child"),
        new ExtendToken(),
        new ClassNameTypeToken("Parent"),
        new LeftCurlyToken(),
        new ConstructorToken(),
        new LeftParenToken(),
        new RightParenToken(),
        new LeftCurlyToken(),
        new RightCurlyToken(),
        new RightCurlyToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseClassDef();
      
      expect(result.name).toBe("Child");
      expect(result.superclass).toBe("Parent");
    });
    
    test('should parse new expression', () => {
      const tokens = [
        new NewToken(),
        new ClassNameTypeToken("MyClass"),
        new LeftParenToken(),
        new IntegerToken(1),
        new CommaToken(),
        new StringToken("hello"),
        new RightParenToken(),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseExp();
      
      expect(result.type).toBe("NewExpression");
      expect(result.className).toBe("MyClass");
    });
    
    test('should parse constructor with super call', () => {
      const classInheritanceTokens = [
        new ClassToken(),
        new ClassNameTypeToken("A"),
        new LeftCurlyToken(),
        new IntegerTypeToken(),
        new VariableToken("n"),
        new SemiColonToken(),
      
        new ConstructorToken(),
        new LeftParenToken(),
        new IntegerTypeToken(),
        new VariableToken("n"),
        new RightParenToken(),
        new LeftCurlyToken(),
        new ThisToken(),
        new DotToken(),
        new MethodNameToken("n"),
        new AssignmentToken(),
        new VariableToken("n"),
        new SemiColonToken(),
        new RightCurlyToken(),
        new RightCurlyToken(),
      
        new ClassToken(),
        new ClassNameTypeToken("b"),
        new ExtendToken(),
        new ClassNameTypeToken("A"),
        new LeftCurlyToken(),
        new IntegerTypeToken(),
        new VariableToken("m"),
        new SemiColonToken(),
      
        new SuperToken(),
        new LeftParenToken(),
        new VariableToken("m"),
        new RightParenToken(),
        new LeftCurlyToken(),
        new ThisToken(),
        new DotToken(),
        new MethodNameToken("m"),
        new AssignmentToken(),
        new VariableToken("m"),
        new SemiColonToken(),
        new RightCurlyToken(),
        new RightCurlyToken()
      ];
      
      const parser = new Parser(classInheritanceTokens);
      const result = parser.parse();
      
      expect(result.superCall).not.toBeNull();
    });
    
    test('should parse constructor without super call', () => {
      const tokens = [
        new ConstructorToken(),
        new LeftParenToken(),
        new RightParenToken(),
        new LeftCurlyToken(),
        // No super call here
        new IntegerTypeToken(),
        createVar("x"),
        new SemiColonToken(),
        new RightCurlyToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseConstructor();
      
      expect(result.params.length).toBe(0);
      expect(result.superCall).toBeNull();
      expect(result.body.length).toBe(1);
    });
    
    test('should parse method definitions with parameters and return type', () => {
      const tokens = [
        new MethodToken(),
        new MethodNameToken("calculate"),
        new LeftParenToken(),
        new IntegerTypeToken(),
        createVar("a"),
        new CommaToken(),
        new IntegerTypeToken(),
        createVar("b"),
        new RightParenToken(),
        new IntegerTypeToken(),
        new LeftCurlyToken(),
        new ReturnToken(),
        new IntegerToken(42),
        new SemiColonToken(),
        new RightCurlyToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseMethodDef();
      
      expect(result.name).toBe("calculate");
      expect(result.params.length).toBe(2);
      expect(result.returnType).toEqual({ typeName:"integer" });
      expect(result.body.length).toBe(1);
    });
    
    test('should parse method with empty parameter list', () => {
      const tokens = [
        new MethodToken(),
        new MethodNameToken("noParams"),
        new LeftParenToken(),
        new RightParenToken(),
        new VoidTypeToken(),
        new LeftCurlyToken(),
        new RightCurlyToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parseMethodDef();
      
      expect(result.name).toBe("noParams");
      expect(result.params.length).toBe(0);
      expect(result.body.length).toBe(0);
    });
  });
  
  // Program Parsing Tests
  describe('Program Parsing', () => {
    test('should parse a simple program', () => {
      const tokens = [
        new IntegerTypeToken(),
        createVar("x"),
        new SemiColonToken(),
        createVar("x"),
        new AssignmentToken(),
        new IntegerToken(42),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parse();
      
      expect(result.classDefs.length).toBe(0);
      expect(result.statements.length).toBe(2);
    });
    
    test('should parse a program with classes and statements', () => {
      const tokens = [
        new ClassToken(),
        new ClassNameTypeToken("Test"),
        new LeftCurlyToken(),
        new ConstructorToken(),
        new LeftParenToken(),
        new RightParenToken(),
        new LeftCurlyToken(),
        new RightCurlyToken(),
        new RightCurlyToken(),
        new IntegerTypeToken(),
        createVar("main"),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parse();
      
      expect(result.classDefs.length).toBe(1);
      expect(result.statements.length).toBe(1);
    });
    
    test('should parse a complex program with classes and statements', () => {
      const tokens = [
        new ClassToken(),
        new ClassNameTypeToken("TestClass"),
        new LeftCurlyToken(),
        new IntegerTypeToken(),
        createVar("x"),
        new SemiColonToken(),
        new ConstructorToken(),
        new LeftParenToken(),
        new RightParenToken(),
        new LeftCurlyToken(),
        new RightCurlyToken(),
        new MethodToken(),
        new MethodNameToken("test"),
        new LeftParenToken(),
        new RightParenToken(),
        new VoidTypeToken(),
        new LeftCurlyToken(),
        new RightCurlyToken(),
        new RightCurlyToken(),
        new IntegerTypeToken(),
        createVar("main"),
        new SemiColonToken(),
        new PrintToken(),
        new LeftParenToken(),
        new StringToken("Hello"),
        new RightParenToken(),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      const result = parser.parse();
      
      expect(result.classDefs.length).toBe(1);
      expect(result.statements.length).toBe(2);
      expect(result.classDefs[0].name).toBe("TestClass");
      expect(result.classDefs[0].varDecs.length).toBe(1);
      expect(result.classDefs[0].methods.length).toBe(1);
    });
  });
  
  // Error Handling Tests
  describe('Error Handling', () => {
    test('should throw error on missing semicolon after expression', () => {
      const tokens = [
        new IntegerToken(42),
        // missing semicolon
        new IntegerToken(10)
      ];
      const parser = new Parser(tokens);
      
      expect(() => {
        parser.parseStmt();
      }).toThrow(/Expected ';'/);
    });
    
    test('should throw error on missing closing parenthesis in if statement', () => {
      const tokens = [
        new IfToken(),
        new LeftParenToken(),
        createVar("x"),
        // missing right paren
        new LeftCurlyToken(),
        new RightCurlyToken()
      ];
      const parser = new Parser(tokens);
      
      expect(() => {
        parser.parseStmt();
      }).toThrow(/Expected '\)'/);
    });
    
    test('should throw error on missing closing brace in block', () => {
      const tokens = [
        new LeftCurlyToken(),
        new IntegerTypeToken(),
        createVar("x"),
        new SemiColonToken(),
        // missing closing brace
      ];
      const parser = new Parser(tokens);
      
      expect(() => {
        parser.parseStmt();
      }).toThrow(/Expected '}'/);
    });
    
    test('should throw error on unexpected token in expression', () => {
      const tokens = [
        new LeftCurlyToken(), // This is not valid as an expression
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      
      expect(() => {
        parser.parseExp();
      }).toThrow(/Unexpected token/);
    });
    
    test('should handle invalid assignment by treating it as an assignment rather than throwing', () => {
      const tokens = [
        new IntegerToken(42), // Cannot assign to a literal
        new AssignmentToken(),
        new IntegerToken(10),
        new SemiColonToken()
      ];
      const parser = new Parser(tokens);
      
      expect(() => {
        const result = parser.parseStmt();
        // Verify it treats it as an assignment
        expect(result.type).toBe("Assignment");
      }).not.toThrow();
    });
    
    test('should throw error when there is no matching class name token', () => {
      const tokens = [
        new ClassToken(),
        // Missing class name
        new LeftCurlyToken(),
        new RightCurlyToken()
      ];
      const parser = new Parser(tokens);
      
      expect(() => {
        parser.parseClassDef();
      }).toThrow(/Expected class name/);
    });
    
    test('should throw error when parser reaches end of input unexpectedly', () => {
      const tokens = [
        new WhileToken(),
        new LeftParenToken(),
        // Incomplete input
      ];
      const parser = new Parser(tokens);
      
      expect(() => {
        parser.parseStmt();
      }).toThrow();
    });
  });
  
  // Token Utility Function Tests
  describe('Token Utility Functions', () => {
    test('should check for token types correctly', () => {
      const parser = new Parser([]);
      
      // Test isTypeToken
      expect(isTypeToken(new IntegerTypeToken())).toBe(true);
      expect(isTypeToken(new StringTypeToken())).toBe(true);
      expect(isTypeToken(new BooleanTypeToken())).toBe(true);
      expect(isTypeToken(new VoidTypeToken())).toBe(true);
      expect(isTypeToken(new ClassNameTypeToken())).toBe(true);
      
      // Test with non-type tokens
      expect(isTypeToken(new IntegerToken(42))).toBe(false);
    });
    
    test('should handle isAtEnd correctly', () => {
      const parser = new Parser([]);
      expect(parser.isAtEnd()).toBe(true);
      
      const parserWithTokens = new Parser([new IntegerToken(1)]);
      expect(parserWithTokens.isAtEnd()).toBe(false);
    });
    
    test('should parse comma-separated lists correctly', () => {
      // Empty list
      const emptyListTokens = [
        new MethodToken(),
        new MethodNameToken("mthd"),
        new LeftParenToken(),
        new RightParenToken(),
        new VoidTypeToken(),
        new LeftCurlyToken(),
        new RightCurlyToken(),
        new SemiColonToken(),
      ];
      const emptyParser = new Parser(emptyListTokens);
      const newParser = emptyParser.parse();
      expect(newParser.statements[0]).toBeInstanceOf(ExpressionStatement);
      
    });
    
    test('should advance tokens correctly', () => {
      const tokens = [
        new IntegerToken(1),
        new IntegerToken(2),
        new IntegerToken(3)
      ];
      const parser = new Parser(tokens);
      
      expect(parser.advance().value).toBe(1);
      expect(parser.advance().value).toBe(2);
      expect(parser.advance().value).toBe(3);
      expect(parser.isAtEnd()).toBe(true);
    });
    
    test('should match token types correctly', () => {
      const tokens = [new IntegerToken(42)];
      const parser = new Parser(tokens);
      
      expect(parser.match(StringToken)).toBe(false); 
      expect(parser.match(IntegerToken, StringToken)).toBe(true); 
      expect(parser.isAtEnd()).toBe(true);
    });
    
    test('should throw when attempting to consume incorrect token', () => {
      const parser = new Parser([new IntegerToken(42)]);
      
      expect(() => {
        parser.consume(StringToken, "Expected string");
      }).toThrow(/Expected string/);
    });
    
    test('should get previous token correctly', () => {
      const tokens = [new IntegerToken(1), new IntegerToken(2)];
      const parser = new Parser(tokens);
      
      parser.advance();
      expect(parser.previous().value).toBe(1);
      
      parser.advance();
      expect(parser.previous().value).toBe(2);
    });
    
    test('should peek at current token without advancing', () => {
      const tokens = [new IntegerToken(42)];
      const parser = new Parser(tokens);
      
      const peeked = parser.peek();
      expect(peeked.value).toBe(42);
      expect(parser.current).toBe(0); 
    });

    test('expressions should be parsed correctly', () => {
      const tokens = [
        new IntegerTypeToken(),
        new VariableToken("num"),
        new AssignmentToken(),
        new IntegerToken(0),
        new SemiColonToken(),
      
        new VariableToken("num"),
        new AssignmentToken(),
        new IntegerToken(30),
        new PlusToken(),
        new IntegerToken(40),
        new MultiplyToken(),
        new IntegerToken(50),
        new MinusToken(),
        new IntegerToken(60),
        new DivideToken(),
        new IntegerToken(70),
        new MultiplyToken(),
        new IntegerToken(80),
        new SemiColonToken(),
      
        new VariableToken("num"),
        new IncrementToken(),
        new SemiColonToken(),
      
        new IncrementToken(),
        new VariableToken("num"),
        new SemiColonToken(),
      
        new VariableToken("num"),
        new EqualsToken(),
        new IntegerToken(10),
        new SemiColonToken(),
      
        new VariableToken("num"),
        new NotEqualsToken(),
        new IntegerToken(10),
        new SemiColonToken(),
      
        new VariableToken("num"),
        new GreaterThanToken(),
        new IntegerToken(10),
        new SemiColonToken(),
      
        new IfToken(),
        new LeftParenToken(),
        new VariableToken("num"),
        new EqualsToken(),
        new VariableToken("num"),
        new RightParenToken(),
        new LeftCurlyToken(),
        new VariableToken("num"),
        new AssignmentToken(),
        new IntegerToken(10),
        new SemiColonToken(),
        new RightCurlyToken(),
      
        new ElseToken(),
        new LeftCurlyToken(),
        new VariableToken("num"),
        new AssignmentToken(),
        new IntegerToken(20),
        new SemiColonToken(),
        new RightCurlyToken(),
      
        new IfToken(),
        new LeftParenToken(),
        new FalseToken(),
        new AndToken(),
        new TrueToken(),
        new RightParenToken(),
        new LeftCurlyToken(),
        new VariableToken("num"),
        new AssignmentToken(),
        new IntegerToken(10),
        new SemiColonToken(),
        new RightCurlyToken(),
      
        new ElseToken(),
        new IfToken(),
        new LeftParenToken(),
        new TrueToken(),
        new OrToken(),
        new FalseToken(),
        new RightParenToken(),
        new LeftCurlyToken(),
        new VariableToken("num"),
        new AssignmentToken(),
        new IntegerToken(20),
        new SemiColonToken(),
        new RightCurlyToken(),
      
        new ElseToken(),
        new LeftCurlyToken(),
        new VariableToken("num"),
        new AssignmentToken(),
        new IntegerToken(30),
        new SemiColonToken(),
        new RightCurlyToken(),
      ];
      const parser = new Parser(tokens);
      const result = parser.parse()
      expect(result.statements.length).toBe(9);
    });
    test('class parsing should work correctly', () => {
      const classTokens = [
        new ClassToken(),
        new ClassNameTypeToken("A"),
        new LeftCurlyToken(),
      
        new ProtectedToken(),
        new IntegerTypeToken(),
        new VariableToken("x"),
        new SemiColonToken(),
      
        new PrivateToken(),
        new IntegerTypeToken(),
        new VariableToken("y"),
        new SemiColonToken(),
      
        new IntegerTypeToken(),
        new VariableToken("z"),
        new SemiColonToken(),
      
        new ConstructorToken(),
        new LeftParenToken(),
        new IntegerTypeToken(),
        new VariableToken("x"),
        new CommaToken(),
        new IntegerTypeToken(),
        new VariableToken("y"),
        new CommaToken(),
        new IntegerTypeToken(),
        new VariableToken("z"),
        new RightParenToken(),
        new LeftCurlyToken(),
      
        new ThisToken(),
        new DotToken(),
        new MethodNameToken("x"),
        new AssignmentToken(),
        new VariableToken("x"),
        new SemiColonToken(),
      
        new ThisToken(),
        new DotToken(),
        new MethodNameToken("y"),
        new AssignmentToken(),
        new VariableToken("y"),
        new SemiColonToken(),
      
        new ThisToken(),
        new DotToken(),
        new MethodNameToken("z"),
        new AssignmentToken(),
        new VariableToken("z"),
        new SemiColonToken(),
      
        new RightCurlyToken(),
      
        new MethodToken(),
        new MethodNameToken("printThisStuff"),
        new LeftParenToken(),
        new RightParenToken(),
        new VoidTypeToken(),
        new LeftCurlyToken(),
      
        new PrintToken(),
        new LeftParenToken(),
        new ThisToken(),
        new DotToken(),
        new MethodNameToken("z"),
        new PlusToken(),
        new StringToken("thisisisiis"),
        new RightParenToken(),
        new SemiColonToken(),
      
        new RightCurlyToken(),
        new RightCurlyToken(),
      ];

      const parser = new Parser(classTokens);
      const result = parser.parse();
      expect(result.classDefs.length).toBe(1);
      expect(result.classDefs[0].name).toBe("A");
      expect(result.classDefs[0].varDecs.length).toBe(3);
      expect(result.classDefs[0].varDecs[0].identifier).toBe("x");
      expect(result.classDefs[0].varDecs[1].identifier).toBe("y");
      expect(result.classDefs[0].varDecs[2].identifier).toBe("z");
    });

      
  });
  
}); 