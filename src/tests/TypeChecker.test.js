const TypeChecker = require("../type_checker/TypeChecker");
const TypeCheckerError = require("../type_checker/TypeCheckError");
const isTypeCompatible = require("../utils/TyperChecker").isTypeCompatible;
const typeCheckExpression =
  require("../type_checker/ExpressionValidator").typeCheckExpression;
const {
  Program,
  ClassDef,
  Constructor,
  MethodDef,
  VarDec,
  ExpressionStatement,
  BinaryExpression,
  UnaryExpression,
  MethodCall,
  FieldAccess,
  This,
  Super,
  NewExpression,
  ReturnStatement,
  Assignment,
  Print,
  TernaryExpression,
  MethodDeclaration
} = require("../parser/ASTNodes");

describe("TypeChecker", () => {
  let typeChecker;

  beforeEach(() => {
    typeChecker = new TypeChecker();
  });

  describe("AST Nodes", () => {
    test("should create a Program node", () => {
        const program = new Program([], []);
        expect(program).toBeInstanceOf(Program);
    });
    test("should create a ClassDef node", () => {
        const classDef = new ClassDef("A", null, [], new Constructor([], null, []), []);
        expect(classDef).toBeInstanceOf(ClassDef);
    });
    test("should create a Constructor node", () => {
        const constructor = new Constructor([], null, []);
        expect(constructor).toBeInstanceOf(Constructor);
    });
    test("should create a MethodDef node", () => {
        const methodDef = new MethodDef("foo", [], { typeName: "void" }, []);
        expect(methodDef).toBeInstanceOf(MethodDef);
    });
    test("should create a VarDec node", () => {
        const varDec = new VarDec({ typeName: "int" }, "x");
        expect(varDec).toBeInstanceOf(VarDec);
    });
    test("should create an ExpressionStatement node", () => {
        const expressionStatement = new ExpressionStatement(new BinaryExpression("x", "+", "y"));
        expect(expressionStatement).toBeInstanceOf(ExpressionStatement);
    });
    test("should create a BinaryExpression node", () => {
        const binaryExpression = new BinaryExpression("x", "+", "y");
        expect(binaryExpression).toBeInstanceOf(BinaryExpression);
    });
    test("should create a UnaryExpression node", () => {
        const unaryExpression = new UnaryExpression("-", "x");
        expect(unaryExpression).toBeInstanceOf(UnaryExpression);
    });
    test("should create a MethodCall node", () => {
        const methodCall = new MethodCall("foo", []);
        expect(methodCall).toBeInstanceOf(MethodCall);
    });
    test("should create a FieldAccess node", () => {
        const fieldAccess = new FieldAccess("x", "y");
        expect(fieldAccess).toBeInstanceOf(FieldAccess);
    });
    test("should create a This node", () => {
        const thisNode = new This();
        expect(thisNode).toBeInstanceOf(This);
    });
    test("should create a Super node", () => {
        const superNode = new Super();
        expect(superNode).toBeInstanceOf(Super);
    });
    test("should create a NewExpression node", () => {
        const newExpression = new NewExpression("A", []);
        expect(newExpression).toBeInstanceOf(NewExpression);
    });
    test("should create a ReturnStatement node", () => {
        const returnStatement = new ReturnStatement("x");
        expect(returnStatement).toBeInstanceOf(ReturnStatement);
    });
    test("should create an Assignment node", () => {
        const assignment = new Assignment("x", "y");
        expect(assignment).toBeInstanceOf(Assignment);
    });
    test("should create a Print node", () => {
        const printNode = new Print("x");
        expect(printNode).toBeInstanceOf(Print);
    });
    test("should create a TernaryExpression node", () => {
        const ternaryExpression = new TernaryExpression("condition", "trueExpr", "falseExpr");
        expect(ternaryExpression).toBeInstanceOf(TernaryExpression);
    });
    test("should create a MethodDeclaration node", () => {
        const methodDeclaration = new MethodDeclaration("foo", [], { typeName: "void" }, []);
        expect(methodDeclaration).toBeInstanceOf(MethodDeclaration);
    });
    });
  describe("Class Validation", () => {
    test("should detect duplicate class definitions", () => {
      const program = new Program(
        [
          new ClassDef("A", null, [], new Constructor([], null, []), []),
          new ClassDef("A", null, [], new Constructor([], null, []), []),
        ],
        [],
      );

      expect(() => typeChecker.typeCheck(program)).toThrow(TypeCheckerError);
    });

    test("should detect circular inheritance", () => {
      const program = new Program(
        [
          new ClassDef("A", "B", [], new Constructor([], null, []), []),
          new ClassDef("B", "A", [], new Constructor([], null, []), []),
        ],
        [],
      );

      expect(() => typeChecker.typeCheck(program)).toThrow(TypeCheckerError);
    });

    test("should detect undefined superclass", () => {
      const program = new Program(
        [
          new ClassDef(
            "A",
            "NonExistent",
            [],
            new Constructor([], null, []),
            [],
          ),
        ],
        [],
      );

      expect(() => typeChecker.typeCheck(program)).toThrow(TypeCheckerError);
    });
  });

  describe("Constructor Validation", () => {
    test("should require super call in subclass constructor", () => {
      const program = new Program(
        [
          new ClassDef("Parent", null, [], new Constructor([], null, []), []),
          new ClassDef(
            "Child",
            "Parent",
            [],
            new Constructor([], null, []),
            [],
          ),
        ],
        [],
      );

      expect(() => typeChecker.typeCheck(program)).toThrow(TypeCheckerError);
    });

    test("should reject super call in class with no superclass", () => {
      const program = {
        classDefs: [
          {
            name: "A",
            superclass: null,
            varDecs: [],
            constructor: {
              params: [
                {
                  identifier: "x",
                  varType: {
                    typeName: "integer",
                  },
                  isProtected: false,
                  isPrivate: false,
                },
                {
                  identifier: "y",
                  varType: {
                    typeName: "integer",
                  },
                  isProtected: false,
                  isPrivate: false,
                },
                {
                  identifier: "z",
                  varType: {
                    typeName: "integer",
                  },
                  isProtected: false,
                  isPrivate: false,
                },
              ],
              superCall: {
                args: [
                  {
                    type: "Variable",
                    name: "x",
                  },
                  {
                    type: "Variable",
                    name: "y",
                  },
                  {
                    type: "Variable",
                    name: "z",
                  },
                ],
              },
              body: [
                {
                  type: "Assignment",
                  left: {
                    type: "FieldAccess",
                    object: {
                      type: "This",
                    },
                    field: "x",
                  },
                  right: {
                    type: "Variable",
                    name: "x",
                  },
                },
                {
                  type: "Assignment",
                  left: {
                    type: "FieldAccess",
                    object: {
                      type: "This",
                    },
                    field: "y",
                  },
                  right: {
                    type: "Variable",
                    name: "y",
                  },
                },
                {
                  type: "Assignment",
                  left: {
                    type: "FieldAccess",
                    object: {
                      type: "This",
                    },
                    field: "z",
                  },
                  right: {
                    type: "Variable",
                    name: "z",
                  },
                },
              ],
            },
            methods: [],
          },
        ],
        statements: [],
      };

      expect(() => typeChecker.typeCheck(program)).toThrow(
        TypeCheckerError || TypeError,
      );
    });
  });

  describe("Method Validation", () => {
    test("should detect duplicate method definitions", () => {
      const program = new Program(
        [
          new ClassDef("A", null, [], new Constructor([], null, []), [
            new MethodDef("foo", [], { typeName: "void" }, []),
            new MethodDef("foo", [], { typeName: "void" }, []),
          ]),
        ],
        [],
      );

      expect(() => typeChecker.typeCheck(program)).toThrow(TypeCheckerError);
    });

    test("should validate method return types", () => {
      const program = new Program(
        [
          new ClassDef("A", null, [], new Constructor([], null, []), [
            new MethodDef("foo", [], { typeName: "NonExistentType" }, []),
          ]),
        ],
        [],
      );

      expect(() => typeChecker.typeCheck(program)).toThrow(TypeCheckerError);
    });
  });

  describe("Field Validation", () => {
    test("should detect duplicate field definitions", () => {
      const program = new Program(
        [
          new ClassDef(
            "A",
            null,
            [
              new VarDec({ typeName: "int" }, "x"),
              new VarDec({ typeName: "int" }, "x"),
            ],
            new Constructor([], null, []),
            [],
          ),
        ],
        [],
      );

      expect(() => typeChecker.typeCheck(program)).toThrow(TypeCheckerError);
    });

    test("should validate field types", () => {
      const program = new Program(
        [
          new ClassDef(
            "A",
            null,
            [new VarDec({ typeName: "NonExistentType" }, "x")],
            new Constructor([], null, []),
            [],
          ),
        ],
        [],
      );

      expect(() => typeChecker.typeCheck(program)).toThrow(TypeCheckerError);
    });
  });

  test("should not allow assignment of null to primitive types", () => {
    expect(isTypeCompatible({ typeName: "int" }, { typeName: "null" })).toBe(
      false,
    );
  });

  test("should allow assignment between same types", () => {
    expect(isTypeCompatible({ typeName: "int" }, { typeName: "int" })).toBe(
      true,
    );
  });
  test("should not allow int to string assignment", () => {
    const program = {
      classDefs: [
        {
          name: "A",
          superclass: null,
          varDecs: [
            {
              varType: {
                typeName: "integer",
              },
              identifier: "x",
              isProtected: true,
              isPrivate: false,
            },
            {
              varType: {
                typeName: "integer",
              },
              identifier: "y",
              isProtected: false,
              isPrivate: true,
            },
            {
              varType: {
                typeName: "integer",
              },
              identifier: "z",
              isProtected: false,
              isPrivate: false,
            },
          ],
          constructor: {
            params: [
              {
                varType: {
                  typeName: "integer",
                },
                identifier: "x",
                isProtected: false,
                isPrivate: false,
              },
              {
                varType: {
                  typeName: "integer",
                },
                identifier: "y",
                isProtected: false,
                isPrivate: false,
              },
              {
                varType: {
                  typeName: "integer",
                },
                identifier: "z",
                isProtected: false,
                isPrivate: false,
              },
            ],
            superCall: null,
            body: [
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "x",
                },
                right: {
                  type: "Variable",
                  name: "x",
                },
              },
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "y",
                },
                right: {
                  type: "Variable",
                  name: "y",
                },
              },
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "z",
                },
                right: {
                  type: "Variable",
                  name: "z",
                },
              },
            ],
          },
          methods: [],
        },
      ],
      statements: [
        {
          type: "Assignment",
          left: {
            varType: {
              typeName: "integer",
            },
            identifier: "x",
            isProtected: false,
            isPrivate: false,
          },
          right: {
            type: "IntegerLiteral",
            value: 0,
          },
        },
        {
          type: "Assignment",
          left: {
            type: "Variable",
            name: "x",
          },
          right: {
            type: "StringLiteral",
            value: "string",
          },
        },
      ],
    };

    expect(() => typeChecker.typeCheck(program)).toThrow(TypeCheckerError);
  });
});

describe("TypeChecker Basic Tests", () => {
  function runProgram(program) {
    const checker = new TypeChecker();
    checker.typeCheck(program);
  }

  test("should type check simple global assignment", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "Assignment",
          left: { identifier: "x", varType: { typeName: "integer" } },
          right: { type: "IntegerLiteral", value: 5 },
        },
      ],
    };

    expect(() => runProgram(program)).not.toThrow();
  });

  test("should throw on type mismatch in assignment", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "Assignment",
          left: { identifier: "x", varType: { typeName: "integer" } },
          right: { type: "StringLiteral", value: "oops" },
        },
      ],
    };

    expect(() => runProgram(program)).toThrow(TypeCheckerError);
  });

  test("should type check global method declaration and call", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "MethodDeclaration",
            name: "hello",
            params: [{ identifier: "msg", varType: { typeName: "string" } }],
            returnType: { typeName: "void" },
            body: {
              type: "Block",
              statements: [
                {
                  type: "Print",
                  argument: { type: "Variable", name: "msg" },
                },
              ],
            },
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "MethodCall",
            callee: "Global",
            methodName: "hello",
            args: [{ type: "StringLiteral", value: "world" }],
          },
        },
      ],
    };

    expect(() => runProgram(program)).not.toThrow();
  });

  test("supercall with incorrect number of arguments", () => {
    const program = {
      classDefs: [
        {
          name: "A",
          superclass: null,
          varDecs: [
            {
              varType: {
                typeName: "integer",
              },
              identifier: "x",
              isProtected: true,
              isPrivate: false,
            },
            {
              varType: {
                typeName: "integer",
              },
              identifier: "y",
              isProtected: false,
              isPrivate: true,
            },
            {
              varType: {
                typeName: "integer",
              },
              identifier: "z",
              isProtected: false,
              isPrivate: false,
            },
          ],
          constructor: {
            params: [
              {
                varType: {
                  typeName: "integer",
                },
                identifier: "x",
                isProtected: false,
                isPrivate: false,
              },
              {
                varType: {
                  typeName: "integer",
                },
                identifier: "y",
                isProtected: false,
                isPrivate: false,
              },
              {
                varType: {
                  typeName: "integer",
                },
                identifier: "z",
                isProtected: false,
                isPrivate: false,
              },
            ],
            superCall: null,
            body: [
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "x",
                },
                right: {
                  type: "Variable",
                  name: "x",
                },
              },
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "y",
                },
                right: {
                  type: "Variable",
                  name: "y",
                },
              },
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "z",
                },
                right: {
                  type: "Variable",
                  name: "z",
                },
              },
            ],
          },
          methods: [],
        },
        {
          name: "B",
          superclass: "A",
          varDecs: [
            {
              varType: {
                typeName: "integer",
              },
              identifier: "f",
              isProtected: false,
              isPrivate: false,
            },
          ],
          constructor: {
            params: [
              {
                identifier: "x",
                varType: {
                  typeName: "integer",
                },
                isProtected: false,
                isPrivate: false,
              },
              {
                identifier: "y",
                varType: {
                  typeName: "integer",
                },
                isProtected: false,
                isPrivate: false,
              },
            ],
            superCall: {
              args: [
                {
                  type: "Variable",
                  name: "x",
                },
                {
                  type: "Variable",
                  name: "y",
                },
              ],
            },
            body: [
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "f",
                },
                right: {
                  type: "Variable",
                  name: "f",
                },
              },
            ],
          },
          methods: [],
        },
      ],
      statements: [],
    };
    expect(() => runProgram(program)).toThrow(TypeCheckerError);
  });

  test("should fail global method call with incorrect arg type", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "MethodDeclaration",
            name: "greet",
            params: [{ identifier: "name", varType: { typeName: "string" } }],
            returnType: { typeName: "void" },
            body: {
              type: "Block",
              statements: [
                {
                  type: "Print",
                  argument: { type: "Variable", name: "name" },
                },
              ],
            },
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "MethodCall",
            callee: "Global",
            methodName: "greet",
            args: [{ type: "IntegerLiteral", value: 123 }],
          },
        },
      ],
    };

    expect(() => runProgram(program)).toThrow(TypeCheckerError);
  });
  test("correct use of super call", () => {
    const program = {
      classDefs: [
        {
          name: "A",
          superclass: null,
          varDecs: [
            {
              varType: {
                typeName: "integer",
              },
              identifier: "x",
              isProtected: false,
              isPrivate: false,
            },
            {
              varType: {
                typeName: "integer",
              },
              identifier: "y",
              isProtected: false,
              isPrivate: false,
            },
          ],
          constructor: {
            params: [
              {
                varType: {
                  typeName: "integer",
                },
                identifier: "x",
                isProtected: false,
                isPrivate: false,
              },
              {
                varType: {
                  typeName: "integer",
                },
                identifier: "y",
                isProtected: false,
                isPrivate: false,
              },
            ],
            superCall: null,
            body: [
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "x",
                },
                right: {
                  type: "Variable",
                  name: "x",
                },
              },
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "y",
                },
                right: {
                  type: "Variable",
                  name: "y",
                },
              },
            ],
          },
          methods: [],
        },
        {
          name: "B",
          superclass: "A",
          varDecs: [
            {
              varType: {
                typeName: "integer",
              },
              identifier: "z",
              isProtected: false,
              isPrivate: false,
            },
          ],
          constructor: {
            params: [
              {
                identifier: "x",
                varType: {
                  typeName: "integer",
                },
                isProtected: false,
                isPrivate: false,
              },
              {
                identifier: "y",
                varType: {
                  typeName: "integer",
                },
                isProtected: false,
                isPrivate: false,
              },
            ],
            superCall: {
              args: [
                {
                  type: "Variable",
                  name: "x",
                },
                {
                  type: "Variable",
                  name: "y",
                },
              ],
            },
            body: [
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "z",
                },
                right: {
                  type: "IntegerLiteral",
                  value: 3,
                },
              },
            ],
          },
          methods: [],
        },
      ],
      statements: [],
    };

    expect(() => runProgram(program)).not.toThrow();
  });

  test("Should throw for wrong super call arguments", () => {
    const program = {
      classDefs: [
        {
          name: "A",
          superclass: null,
          varDecs: [
            {
              varType: {
                typeName: "integer",
              },
              identifier: "x",
              isProtected: false,
              isPrivate: false,
            },
            {
              varType: {
                typeName: "integer",
              },
              identifier: "y",
              isProtected: false,
              isPrivate: false,
            },
          ],
          constructor: {
            params: [
              {
                varType: {
                  typeName: "integer",
                },
                identifier: "x",
                isProtected: false,
                isPrivate: false,
              },
              {
                varType: {
                  typeName: "integer",
                },
                identifier: "y",
                isProtected: false,
                isPrivate: false,
              },
            ],
            superCall: null,
            body: [
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "x",
                },
                right: {
                  type: "Variable",
                  name: "x",
                },
              },
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "y",
                },
                right: {
                  type: "Variable",
                  name: "y",
                },
              },
            ],
          },
          methods: [],
        },
        {
          name: "B",
          superclass: "A",
          varDecs: [
            {
              varType: {
                typeName: "integer",
              },
              identifier: "z",
              isProtected: false,
              isPrivate: false,
            },
          ],
          constructor: {
            params: [
              {
                varType: {
                  typeName: "integer",
                },
                isProtected: false,
                isPrivate: false,
              },
              {
                varType: {
                  typeName: "integer",
                },
                isProtected: false,
                isPrivate: false,
              },
            ],
            superCall: {
              args: [
                {
                  type: "StringLiteral",
                  value: "sss",
                },
                {
                  type: "IntegerLiteral",
                  value: 2,
                },
              ],
            },
            body: [
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "z",
                },
                right: {
                  type: "IntegerLiteral",
                  value: 3,
                },
              },
            ],
          },
          methods: [],
        },
      ],
      statements: [],
    };
    expect(() => runProgram(program)).toThrow(TypeCheckerError);
  });
  test("valid ternary expression", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "Assignment",
          left: {
            varType: {
              typeName: "boolean",
            },
            identifier: "b",
            isProtected: false,
            isPrivate: false,
          },
          right: {
            type: "BooleanLiteral",
            value: false,
          },
        },
        {
          type: "Assignment",
          left: {
            varType: {
              typeName: "integer",
            },
            identifier: "f",
            isProtected: false,
            isPrivate: false,
          },
          right: {
            type: "TernaryExpression",
            condition: {
              type: "Variable",
              name: "b",
            },
            trueExpr: {
              type: "IntegerLiteral",
              value: 1,
            },
            falseExpr: {
              type: "IntegerLiteral",
              value: 2,
            },
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "Print",
            argument: {
              type: "Variable",
              name: "f",
            },
          },
        },
      ],
    };
    expect(() => runProgram(program)).not.toThrow();
  });
  test("should allow print", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "Print",
            argument: {
              type: "BooleanLiteral",
              value: true,
            },
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "Print",
            argument: {
              type: "IntegerLiteral",
              value: 42,
            },
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "Print",
            argument: {
              type: "StringLiteral",
              value: "hello",
            },
          },
        },
      ],
    };
    expect(() => runProgram(program)).not.toThrow();
  });
  test("should not throw for post and pre increment", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "Assignment",
          left: {
            varType: {
              typeName: "integer",
            },
            identifier: "x",
            isProtected: false,
            isPrivate: false,
          },
          right: {
            type: "IntegerLiteral",
            value: 5,
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "PrefixIncrement",
            operand: {
              type: "Variable",
              name: "x",
            },
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "PostfixIncrement",
            operand: {
              type: "Variable",
              name: "x",
            },
          },
        },
      ],
    };
    expect(() => runProgram(program)).not.toThrow();
  });
  test("should throw for accessing protected field from outside class", () => {
    const program = {
      classDefs: [
        {
          name: "C",
          superclass: null,
          varDecs: [
            {
              varType: {
                typeName: "integer",
              },
              identifier: "a",
              isProtected: true,
              isPrivate: false,
            },
            {
              varType: {
                typeName: "integer",
              },
              identifier: "b",
              isProtected: false,
              isPrivate: true,
            },
            {
              varType: {
                typeName: "integer",
              },
              identifier: "c",
              isProtected: false,
              isPrivate: false,
            },
          ],
          constructor: {
            params: [
              {
                varType: {
                  typeName: "integer",
                },
                identifier: "a",
                isProtected: false,
                isPrivate: false,
              },
              {
                varType: {
                  typeName: "integer",
                },
                identifier: "b",
                isProtected: false,
                isPrivate: false,
              },
              {
                varType: {
                  typeName: "integer",
                },
                identifier: "c",
                isProtected: false,
                isPrivate: false,
              },
            ],
            superCall: null,
            body: [
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "a",
                },
                right: {
                  type: "Variable",
                  name: "a",
                },
              },
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "b",
                },
                right: {
                  type: "Variable",
                  name: "b",
                },
              },
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "c",
                },
                right: {
                  type: "Variable",
                  name: "c",
                },
              },
            ],
          },
          methods: [
            {
              name: "printC",
              params: [],
              returnType: {
                typeName: "void",
              },
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "Print",
                    argument: {
                      type: "FieldAccess",
                      object: {
                        type: "This",
                      },
                      field: "c",
                    },
                  },
                },
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "Print",
                    argument: {
                      type: "FieldAccess",
                      object: {
                        type: "This",
                      },
                      field: "b",
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
      statements: [
        {
          type: "Assignment",
          left: {
            varType: {
              typeName: "C",
            },
            identifier: "c",
            isProtected: false,
            isPrivate: false,
          },
          right: {
            type: "NewExpression",
            className: "C",
            args: [
              {
                type: "IntegerLiteral",
                value: 1,
              },
              {
                type: "IntegerLiteral",
                value: 2,
              },
              {
                type: "IntegerLiteral",
                value: 3,
              },
            ],
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "Print",
            argument: {
              type: "FieldAccess",
              object: {
                type: "Variable",
                name: "c",
              },
              field: "a",
            },
          },
        },
      ],
    };
    expect(() => runProgram(program)).toThrow(TypeCheckerError);
  });
  test("expressions should not throw", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "Print",
            argument: {
              type: "BinaryExpression",
              left: {
                type: "IntegerLiteral",
                value: 1,
              },
              operator: "+",
              right: {
                type: "IntegerLiteral",
                value: 2,
              },
            },
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "Print",
            argument: {
              type: "BinaryExpression",
              left: {
                type: "StringLiteral",
                value: "a",
              },
              operator: "+",
              right: {
                type: "StringLiteral",
                value: "b",
              },
            },
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "Print",
            argument: {
              type: "BinaryExpression",
              left: {
                type: "IntegerLiteral",
                value: 5,
              },
              operator: "-",
              right: {
                type: "IntegerLiteral",
                value: 3,
              },
            },
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "Print",
            argument: {
              type: "BinaryExpression",
              left: {
                type: "IntegerLiteral",
                value: 4,
              },
              operator: "*",
              right: {
                type: "IntegerLiteral",
                value: 2,
              },
            },
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "Print",
            argument: {
              type: "BinaryExpression",
              left: {
                type: "IntegerLiteral",
                value: 10,
              },
              operator: "/",
              right: {
                type: "IntegerLiteral",
                value: 2,
              },
            },
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "Print",
            argument: {
              type: "BinaryExpression",
              left: {
                type: "IntegerLiteral",
                value: 1,
              },
              operator: "==",
              right: {
                type: "IntegerLiteral",
                value: 1,
              },
            },
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "Print",
            argument: {
              type: "BinaryExpression",
              left: {
                type: "IntegerLiteral",
                value: 3,
              },
              operator: "!=",
              right: {
                type: "IntegerLiteral",
                value: 2,
              },
            },
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "Print",
            argument: {
              type: "BinaryExpression",
              left: {
                type: "IntegerLiteral",
                value: 1,
              },
              operator: "<",
              right: {
                type: "IntegerLiteral",
                value: 2,
              },
            },
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "Print",
            argument: {
              type: "BinaryExpression",
              left: {
                type: "IntegerLiteral",
                value: 3,
              },
              operator: ">",
              right: {
                type: "IntegerLiteral",
                value: 2,
              },
            },
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "Print",
            argument: {
              type: "BinaryExpression",
              left: {
                type: "BooleanLiteral",
                value: true,
              },
              operator: "||",
              right: {
                type: "BooleanLiteral",
                value: true,
              },
            },
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "Print",
            argument: {
              type: "BinaryExpression",
              left: {
                type: "BooleanLiteral",
                value: true,
              },
              operator: "&&",
              right: {
                type: "BooleanLiteral",
                value: false,
              },
            },
          },
        },
      ],
    };
    expect(() => runProgram(program)).not.toThrow();
  });
  test("mismatch ternery expression", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "Assignment",
          left: {
            varType: {
              typeName: "integer",
            },
            identifier: "num",
            isProtected: false,
            isPrivate: false,
          },
          right: {
            type: "TernaryExpression",
            condition: {
              type: "IntegerLiteral",
              value: 5,
            },
            trueExpr: {
              type: "IntegerLiteral",
              value: 10,
            },
            falseExpr: {
              type: "IntegerLiteral",
              value: 20,
            },
          },
        },
      ],
    };
    expect(() => runProgram(program)).toThrow(TypeCheckerError);
  });
  test("classes with valid expressions and usage of this", () => {
    const program = {
      classDefs: [
        {
          name: "A",
          superclass: null,
          varDecs: [
            {
              varType: {
                typeName: "integer",
              },
              identifier: "x",
              isProtected: true,
              isPrivate: false,
            },
            {
              varType: {
                typeName: "integer",
              },
              identifier: "y",
              isProtected: false,
              isPrivate: true,
            },
            {
              varType: {
                typeName: "integer",
              },
              identifier: "z",
              isProtected: false,
              isPrivate: false,
            },
          ],
          constructor: {
            params: [
              {
                varType: {
                  typeName: "integer",
                },
                identifier: "x",
                isProtected: false,
                isPrivate: false,
              },
              {
                varType: {
                  typeName: "integer",
                },
                identifier: "y",
                isProtected: false,
                isPrivate: false,
              },
              {
                varType: {
                  typeName: "integer",
                },
                identifier: "z",
                isProtected: false,
                isPrivate: false,
              },
            ],
            superCall: null,
            body: [
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "x",
                },
                right: {
                  type: "Variable",
                  name: "x",
                },
              },
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "y",
                },
                right: {
                  type: "Variable",
                  name: "y",
                },
              },
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "z",
                },
                right: {
                  type: "Variable",
                  name: "z",
                },
              },
            ],
          },
          methods: [
            {
              name: "getZ",
              params: [],
              returnType: {
                typeName: "integer",
              },
              body: [
                {
                  type: "Return",
                  value: {
                    type: "FieldAccess",
                    object: {
                      type: "This",
                    },
                    field: "z",
                  },
                },
              ],
            },
          ],
        },
        {
          name: "B",
          superclass: "A",
          varDecs: [
            {
              varType: {
                typeName: "integer",
              },
              identifier: "extra",
              isProtected: false,
              isPrivate: false,
            },
          ],
          constructor: {
            params: [
              {
                identifier: "x",
                varType: {
                  typeName: "integer",
                },
                isProtected: false,
                isPrivate: false,
              },
              {
                identifier: "y",
                varType: {
                  typeName: "integer",
                },
                isProtected: false,
                isPrivate: false,
              },
              {
                identifier: "z",
                varType: {
                  typeName: "integer",
                },
                isProtected: false,
                isPrivate: false,
              },
              {
                identifier: "extra",
                varType: {
                  typeName: "integer",
                },
                isProtected: false,
                isPrivate: false,
              },
            ],
            superCall: {
              args: [
                {
                  type: "Variable",
                  name: "x",
                },
                {
                  type: "Variable",
                  name: "y",
                },
                {
                  type: "Variable",
                  name: "z",
                },
                {
                  type: "Variable",
                  name: "extra",
                },
              ],
            },
            body: [
              {
                type: "Assignment",
                left: {
                  type: "FieldAccess",
                  object: {
                    type: "This",
                  },
                  field: "extra",
                },
                right: {
                  type: "Variable",
                  name: "extra",
                },
              },
            ],
          },
          methods: [
            {
              name: "test",
              params: [],
              returnType: {
                typeName: "void",
              },
              body: [
                {
                  type: "Assignment",
                  left: {
                    varType: {
                      typeName: "integer",
                    },
                    identifier: "a",
                    isProtected: false,
                    isPrivate: false,
                  },
                  right: {
                    type: "BinaryExpression",
                    left: {
                      type: "IntegerLiteral",
                      value: 5,
                    },
                    operator: "+",
                    right: {
                      type: "IntegerLiteral",
                      value: 2,
                    },
                  },
                },
                {
                  type: "Assignment",
                  left: {
                    varType: {
                      typeName: "integer",
                    },
                    identifier: "b",
                    isProtected: false,
                    isPrivate: false,
                  },
                  right: {
                    type: "BinaryExpression",
                    left: {
                      type: "IntegerLiteral",
                      value: 5,
                    },
                    operator: "-",
                    right: {
                      type: "IntegerLiteral",
                      value: 2,
                    },
                  },
                },
                {
                  type: "Assignment",
                  left: {
                    varType: {
                      typeName: "integer",
                    },
                    identifier: "c",
                    isProtected: false,
                    isPrivate: false,
                  },
                  right: {
                    type: "BinaryExpression",
                    left: {
                      type: "IntegerLiteral",
                      value: 5,
                    },
                    operator: "*",
                    right: {
                      type: "IntegerLiteral",
                      value: 2,
                    },
                  },
                },
                {
                  type: "Assignment",
                  left: {
                    varType: {
                      typeName: "integer",
                    },
                    identifier: "d",
                    isProtected: false,
                    isPrivate: false,
                  },
                  right: {
                    type: "BinaryExpression",
                    left: {
                      type: "IntegerLiteral",
                      value: 5,
                    },
                    operator: "/",
                    right: {
                      type: "IntegerLiteral",
                      value: 2,
                    },
                  },
                },
                {
                  type: "Assignment",
                  left: {
                    varType: {
                      typeName: "boolean",
                    },
                    identifier: "e",
                    isProtected: false,
                    isPrivate: false,
                  },
                  right: {
                    type: "BinaryExpression",
                    left: {
                      type: "IntegerLiteral",
                      value: 1,
                    },
                    operator: "<",
                    right: {
                      type: "IntegerLiteral",
                      value: 2,
                    },
                  },
                },
                {
                  type: "Assignment",
                  left: {
                    varType: {
                      typeName: "boolean",
                    },
                    identifier: "f",
                    isProtected: false,
                    isPrivate: false,
                  },
                  right: {
                    type: "BinaryExpression",
                    left: {
                      type: "IntegerLiteral",
                      value: 3,
                    },
                    operator: ">",
                    right: {
                      type: "IntegerLiteral",
                      value: 1,
                    },
                  },
                },
                {
                  type: "Assignment",
                  left: {
                    varType: {
                      typeName: "boolean",
                    },
                    identifier: "g",
                    isProtected: false,
                    isPrivate: false,
                  },
                  right: {
                    type: "BinaryExpression",
                    left: {
                      type: "IntegerLiteral",
                      value: 5,
                    },
                    operator: "<=",
                    right: {
                      type: "IntegerLiteral",
                      value: 5,
                    },
                  },
                },
                {
                  type: "Assignment",
                  left: {
                    varType: {
                      typeName: "boolean",
                    },
                    identifier: "h",
                    isProtected: false,
                    isPrivate: false,
                  },
                  right: {
                    type: "BinaryExpression",
                    left: {
                      type: "IntegerLiteral",
                      value: 6,
                    },
                    operator: ">=",
                    right: {
                      type: "IntegerLiteral",
                      value: 4,
                    },
                  },
                },
                {
                  type: "Assignment",
                  left: {
                    varType: {
                      typeName: "boolean",
                    },
                    identifier: "i",
                    isProtected: false,
                    isPrivate: false,
                  },
                  right: {
                    type: "BinaryExpression",
                    left: {
                      type: "BooleanLiteral",
                      value: true,
                    },
                    operator: "==",
                    right: {
                      type: "BooleanLiteral",
                      value: false,
                    },
                  },
                },
                {
                  type: "Assignment",
                  left: {
                    varType: {
                      typeName: "boolean",
                    },
                    identifier: "k",
                    isProtected: false,
                    isPrivate: false,
                  },
                  right: {
                    type: "BinaryExpression",
                    left: {
                      type: "BooleanLiteral",
                      value: true,
                    },
                    operator: "&&",
                    right: {
                      type: "BooleanLiteral",
                      value: false,
                    },
                  },
                },
                {
                  type: "Assignment",
                  left: {
                    varType: {
                      typeName: "boolean",
                    },
                    identifier: "l",
                    isProtected: false,
                    isPrivate: false,
                  },
                  right: {
                    type: "BinaryExpression",
                    left: {
                      type: "BooleanLiteral",
                      value: false,
                    },
                    operator: "||",
                    right: {
                      type: "BooleanLiteral",
                      value: true,
                    },
                  },
                },
                {
                  type: "Assignment",
                  left: {
                    varType: {
                      typeName: "string",
                    },
                    identifier: "s",
                    isProtected: false,
                    isPrivate: false,
                  },
                  right: {
                    type: "BinaryExpression",
                    left: {
                      type: "StringLiteral",
                      value: "hi",
                    },
                    operator: "+",
                    right: {
                      type: "StringLiteral",
                      value: "world",
                    },
                  },
                },
                {
                  type: "Assignment",
                  left: {
                    varType: {
                      typeName: "string",
                    },
                    identifier: "m",
                    isProtected: false,
                    isPrivate: false,
                  },
                  right: {
                    type: "BinaryExpression",
                    left: {
                      type: "IntegerLiteral",
                      value: 1,
                    },
                    operator: "+",
                    right: {
                      type: "StringLiteral",
                      value: "abc",
                    },
                  },
                },
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "PostfixIncrement",
                    operand: {
                      type: "FieldAccess",
                      object: {
                        type: "This",
                      },
                      field: "x",
                    },
                  },
                },
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "PrefixIncrement",
                    operand: {
                      type: "FieldAccess",
                      object: {
                        type: "This",
                      },
                      field: "z",
                    },
                  },
                },
                {
                  type: "Assignment",
                  left: {
                    varType: {
                      typeName: "integer",
                    },
                    identifier: "ok",
                    isProtected: false,
                    isPrivate: false,
                  },
                  right: {
                    type: "FieldAccess",
                    object: {
                      type: "This",
                    },
                    field: "x",
                  },
                },
              ],
            },
          ],
        },
      ],
      statements: [],
    };
    expect(() => runProgram(program)).not.toThrow();
  });

  test("should throw for incorrect assignment with boolean and int", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "Assignment",
          left: {
            varType: {
              typeName: "integer",
            },
            identifier: "wrong",
            isProtected: false,
            isPrivate: false,
          },
          right: {
            type: "BinaryExpression",
            left: {
              type: "BooleanLiteral",
              value: true,
            },
            operator: "+",
            right: {
              type: "IntegerLiteral",
              value: 3,
            },
          },
        },
      ],
    };
    expect(() => runProgram(program)).toThrow(TypeCheckerError);
  });

  test("use of this outside of class", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "Assignment",
          left: {
            type: "FieldAccess",
            object: {
              type: "This",
            },
            field: "num",
          },
          right: {
            type: "IntegerLiteral",
            value: 3,
          },
        },
      ],
    };
    expect(() => runProgram(program)).toThrow(TypeCheckerError);
  });

  test("incorrect use of super", () => {
    const program = {
      classDefs: [
        {
          name: "B",
          superclass: null,
          varDecs: [],
          constructor: {
            params: [],
            superCall: {
              args: [],
            },
            body: [],
          },
          methods: [],
        },
      ],
      statements: [],
    };
    expect(() => runProgram(program)).toThrow(TypeCheckerError);
  });

  describe("Expression Validator", () => {
    test("super call with no current class", () => {
      const ctx = {
        type: "Super",
        currentClass: null,
      };
      const expression = {
        type: "Super",
      };

      expect(() => typeCheckExpression(expression, ctx)).toThrow(
        TypeCheckerError,
      );
    });
    test("super call with current class", () => {
      const ctx = {
        type: "Super",
        currentClass: {
          superclass: true,
        },
      };
      const expression = {
        type: "Super",
      };

      expect(() => typeCheckExpression(expression, ctx)).not.toThrow(
        TypeCheckerError,
      );
    });
    test("IntegerLiteral", () => {
        expect(typeCheckExpression({ type: "IntegerLiteral" }, {})).toEqual({ typeName: "integer" });
      });
    
      test("StringLiteral", () => {
        expect(typeCheckExpression({ type: "StringLiteral" }, {})).toEqual({ typeName: "string" });
      });
    
      test("This throws without class", () => {
        expect(() => typeCheckExpression({ type: "This" }, {})).toThrow("this used outside");
      });
    
      test("This returns type with currentClass", () => {
        expect(typeCheckExpression({ type: "This" }, { currentClass: { name: "A" } })).toEqual({ typeName: "A" });
      });
    
      test("Super throws with no class", () => {
        expect(() => typeCheckExpression({ type: "Super" }, {})).toThrow("super used in invalid context");
      });
    
      test("Super throws with no superclass", () => {
        expect(() => typeCheckExpression({ type: "Super" }, { currentClass: {} })).toThrow("super used in invalid context");
      });
    
      test("Super returns type", () => {
        expect(typeCheckExpression({ type: "Super" }, { currentClass: { superclass: "Base" } })).toEqual({ typeName: "Base" });
      });
    
      test("Variable from method params", () => {
        const ctx = { currentMethod: { params: [{ identifier: "x", varType: { typeName: "integer" } }] } };
        expect(typeCheckExpression({ type: "Variable", name: "x" }, ctx)).toEqual({ typeName: "integer" });
      });
    
      test("Variable from constructor params", () => {
        const ctx = {
          currentClass: { constructor: { params: [{ identifier: "x", varType: { typeName: "integer" } }] } },
        };
        expect(typeCheckExpression({ type: "Variable", name: "x" }, ctx)).toEqual({ typeName: "integer" });
      });
    
      test("Variable from class field", () => {
        const ctx = {
          currentClass: { name: "A", varDecs: [{ identifier: "x", varType: { typeName: "integer" } }] },
          inheritanceMap: new Map(),
          classTable: new Map(),
          globalVars: new Map(),
        };
        expect(typeCheckExpression({ type: "Variable", name: "x" }, ctx)).toEqual({ typeName: "integer" });
      });
    
      test("Variable from globalVars", () => {
        const ctx = {
          globalVars: new Map([["x", { typeName: "integer" }]]),
        };
        expect(typeCheckExpression({ type: "Variable", name: "x" }, ctx)).toEqual({ typeName: "integer" });
      });
    
      test("Variable throws if undefined", () => {
        const ctx = {
          globalVars: new Map(),
          classTable: new Map(),
          inheritanceMap: new Map(),
        };
        expect(() => typeCheckExpression({ type: "Variable", name: "x" }, ctx)).toThrow("Undefined variable");
      });
    
      test("PostfixIncrement type", () => {
        const ctx = { globalVars: new Map([["x", { typeName: "boolean" }]]) };
        expect(() => typeCheckExpression({ type: "PostfixIncrement", operand: { type: "Variable", name: "x" } }, ctx)).not.toThrow();
      });
    
      test("FieldAccess throws on unknown class", () => {
        const ctx = {
          classTable: new Map(),
          currentClass: { name: "A" },
        };
        expect(() => typeCheckExpression({ type: "FieldAccess", object: { type: "This" }, field: "x" }, ctx)).toThrow("Undefined class");
      });
    
      test("FieldAccess throws if field missing", () => {
        const ctx = {
          currentClass: { name: "A" },
          classTable: new Map([["A", { varDecs: [] }]]),
          inheritanceMap: new Map(),
        };
        expect(() =>
          typeCheckExpression({ type: "FieldAccess", object: { type: "This" }, field: "x" }, ctx)
        ).toThrow("Field x not found");
      });
    
      test("Global method call returns correct type", () => {
        const ctx = {
          globalMethods: new Map([
            [
              "log",
              {
                params: [{ varType: { typeName: "integer" } }],
                returnType: { typeName: "void" },
              },
            ],
          ]),
        };
        const expr = {
          type: "MethodCall",
          callee: "Global",
          methodName: "log",
          args: [{ type: "IntegerLiteral", value: 5 }],
        };
        expect(typeCheckExpression(expr, ctx)).toEqual({ typeName: "void" });
      });
    
      test("Class method call with inheritance", () => {
        const ctx = {
          classTable: new Map([
            [
              "A",
              {
                methods: [{ name: "foo", params: [], returnType: { typeName: "integer" } }],
              },
            ],
          ]),
          inheritanceMap: new Map(),
        };
        const expr = {
          type: "MethodCall",
          callee: { type: "This" },
          methodName: "foo",
          args: [],
        };
        ctx.currentClass = { name: "A" };
        expect(typeCheckExpression(expr, ctx)).toEqual({ typeName: "integer" });
      });
    
      test("BinaryExpression + integer", () => {
        const ctx = {};
        const expr = {
          type: "BinaryExpression",
          operator: "+",
          left: { type: "IntegerLiteral" },
          right: { type: "IntegerLiteral" },
        };
        expect(typeCheckExpression(expr, ctx)).toEqual({ typeName: "integer" });
      });
    
      test("BinaryExpression + string", () => {
        const ctx = {};
        const expr = {
          type: "BinaryExpression",
          operator: "+",
          left: { type: "StringLiteral" },
          right: { type: "IntegerLiteral" },
        };
        expect(typeCheckExpression(expr, ctx)).toEqual({ typeName: "string" });
      });
    
      test("BinaryExpression < returns boolean", () => {
        const expr = {
          type: "BinaryExpression",
          operator: "<",
          left: { type: "IntegerLiteral" },
          right: { type: "IntegerLiteral" },
        };
        expect(typeCheckExpression(expr, {})).toEqual({ typeName: "boolean" });
      });
    
      test("NewExpression type check", () => {
        const ctx = {
          classTable: new Map([
            [
              "Test",
              {
                constructor: {
                  params: [{ varType: { typeName: "integer" } }],
                },
              },
            ],
          ]),
        };
        const expr = {
          type: "NewExpression",
          className: "Test",
          args: [{ type: "IntegerLiteral", value: 1 }],
        };
        expect(typeCheckExpression(expr, ctx)).toEqual({ typeName: "Test" });
      });
    
      test("Print returns void", () => {
        expect(typeCheckExpression({ type: "Print", argument: { type: "IntegerLiteral" } }, {})).toEqual({
          typeName: "void",
        });
      });
    
      test("TernaryExpression", () => {
        const expr = {
          type: "TernaryExpression",
          condition: { type: "BooleanLiteral" },
          trueExpr: { type: "IntegerLiteral" },
          falseExpr: { type: "IntegerLiteral" },
        };
        expect(typeCheckExpression(expr, {})).toEqual({ typeName: "integer" });
      });
    
      test("Default return typeName void", () => {
        expect(typeCheckExpression({ type: "UnknownType" }, {})).toEqual({ typeName: "void" });
      });
      test("Variable not found in context", () => {
        const ctx = {
          currentMethod: null,
          currentClass: null,
          inheritanceMap: new Map(),
          classTable: new Map(),
          globalVars: new Map(),
        };
        const expr = { type: "Variable", name: "missingVar" };
        expect(() => typeCheckExpression(expr, ctx)).toThrow(TypeCheckerError);
      });
    
      test("PrefixIncrement on non-integer", () => {
        const ctx = {
          currentMethod: null,
        };
        const expr = {
          type: "PrefixIncrement",
          operand: { type: "StringLiteral", value: "notInt" },
        };
        expect(() => typeCheckExpression(expr, ctx)).toThrow(TypeCheckerError);
      });
    
      test("FieldAccess with undefined class", () => {
        const ctx = {
          classTable: new Map(),
        };
        const expr = {
          type: "FieldAccess",
          object: { type: "StringLiteral", value: "text" },
          field: "nonexistent",
        };
        expect(() => typeCheckExpression(expr, ctx)).toThrow(TypeCheckerError);
      });
    
      test("FieldAccess with private field outside class", () => {
        const ctx = {
          currentClass: { name: "B" },
          classTable: new Map([
            ["A", {
              name: "A",
              varDecs: [{ identifier: "x", varType: { typeName: "integer" }, isPrivate: true }],
            }],
          ]),
          inheritanceMap: new Map(),
        };
        const expr = {
          type: "FieldAccess",
          object: { type: "Variable", name: "a" },
          field: "x",
        };
        ctx.classTable.set("integer", {}); 
        expect(() => typeCheckExpression(expr, ctx)).toThrow(TypeCheckerError);
      });
    
      test("Global method not found", () => {
        const ctx = {
          globalMethods: new Map(),
        };
        const expr = {
          type: "MethodCall",
          callee: "Global",
          methodName: "unknownMethod",
          args: [],
        };
        expect(() => typeCheckExpression(expr, ctx)).toThrow(TypeCheckerError);
      });
    
      test("Global method wrong arg count", () => {
        const ctx = {
          globalMethods: new Map([
            ["foo", { params: [{ varType: { typeName: "integer" } }] }],
          ]),
        };
        const expr = {
          type: "MethodCall",
          callee: "Global",
          methodName: "foo",
          args: [],
        };
        expect(() => typeCheckExpression(expr, ctx)).toThrow(TypeCheckerError);
      });
    
      test("MethodCall on unknown class", () => {
        const ctx = {
          classTable: new Map(),
        };
        const expr = {
          type: "MethodCall",
          callee: { type: "Variable", name: "unknown" },
          methodName: "doSomething",
          args: [],
        };
        expect(() => typeCheckExpression(expr, ctx)).toThrow(TypeCheckerError);
      });
    
      test("Method not found in MethodCall", () => {
        const ctx = {
          classTable: new Map([
            ["A", { name: "A", methods: [] }],
          ]),
          inheritanceMap: new Map(),
        };
        const expr = {
          type: "MethodCall",
          callee: { type: "Variable", name: "obj" },
          methodName: "missing",
          args: [],
        };
        expect(() => typeCheckExpression(expr, ctx)).toThrow(TypeCheckerError);
      });
    
      test("MethodCall wrong number of args", () => {
        const ctx = {
          classTable: new Map([
            ["A", { name: "A", methods: [{ name: "foo", params: [{}] }] }],
          ]),
          inheritanceMap: new Map(),
        };
        const expr = {
          type: "MethodCall",
          callee: { type: "Variable", name: "obj" },
          methodName: "foo",
          args: [],
        };
        expect(() => typeCheckExpression(expr, ctx)).toThrow(TypeCheckerError);
      });
    
      test("BinaryExpression - wrong types for arithmetic", () => {
        const expr = {
          type: "BinaryExpression",
          operator: "-",
          left: { type: "StringLiteral", value: "hi" },
          right: { type: "IntegerLiteral", value: 2 },
        };
        expect(() => typeCheckExpression(expr, {})).toThrow(TypeCheckerError);
      });
    
      test("BinaryExpression - unknown operator", () => {
        const expr = {
          type: "BinaryExpression",
          operator: "???",
          left: { type: "IntegerLiteral", value: 1 },
          right: { type: "IntegerLiteral", value: 2 },
        };
        expect(() => typeCheckExpression(expr, {})).toThrow(TypeCheckerError);
      });
    
      test("NewExpression with unknown class", () => {
        const ctx = {
          classTable: new Map(),
        };
        const expr = {
          type: "NewExpression",
          className: "UnknownClass",
          args: [],
        };
        expect(() => typeCheckExpression(expr, ctx)).toThrow(TypeCheckerError);
      });
    
      test("NewExpression wrong constructor args", () => {
        const ctx = {
          classTable: new Map([
            ["A", { constructor: { params: [{ varType: { typeName: "integer" } }] } }],
          ]),
        };
        const expr = {
          type: "NewExpression",
          className: "A",
          args: [],
        };
        expect(() => typeCheckExpression(expr, ctx)).toThrow(TypeCheckerError);
      });
    
      test("NewExpression arg type mismatch", () => {
        const ctx = {
          classTable: new Map([
            ["A", {
              constructor: {
                params: [{ varType: { typeName: "integer" } }],
              },
            }],
          ]),
        };
        const expr = {
          type: "NewExpression",
          className: "A",
          args: [{ type: "StringLiteral", value: "oops" }],
        };
        expect(() => typeCheckExpression(expr, ctx)).toThrow(TypeCheckerError);
      });
    
      test("TernaryExpression - non-boolean condition", () => {
        const expr = {
          type: "TernaryExpression",
          condition: { type: "IntegerLiteral", value: 1 },
          trueExpr: { type: "IntegerLiteral", value: 1 },
          falseExpr: { type: "IntegerLiteral", value: 2 },
        };
        expect(() => typeCheckExpression(expr, {})).toThrow(TypeCheckerError);
      });
    
      test("TernaryExpression - type mismatch", () => {
        const expr = {
          type: "TernaryExpression",
          condition: { type: "BooleanLiteral", value: true },
          trueExpr: { type: "IntegerLiteral", value: 1 },
          falseExpr: { type: "StringLiteral", value: "wrong" },
        };
        expect(() => typeCheckExpression(expr, {})).toThrow(TypeCheckerError);
      });

  });
});
