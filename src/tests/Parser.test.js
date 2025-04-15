const {
  Program,
  ClassDef,
  Constructor,
  MethodDef,
  VarDec,
  ExpressionStatement,
  BinaryExpression,
} = require("../parser/ASTNodes");

describe("AST Nodes", () => {
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
});
