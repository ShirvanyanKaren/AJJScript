const CodeGenerator = require("../code_generator/CodeGenerator");

describe("CodeGenerator - Main Integration", () => {
  function generateCodeFromProgram(program) {
    const generator = new CodeGenerator();
    return generator.generate(program).trim();
  }

  test("generates empty program with runtime and wrapper", () => {
    const program = {
      classDefs: [],
      statements: [],
    };

    const output = generateCodeFromProgram(program);

    expect(output).toContain("const AJJ = {");
    expect(output).toContain("(function() {");
    expect(output).toContain("})();");
  });

  test("generates print statement in main block", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "Print",
          argument: { type: "StringLiteral", value: "Hello" },
        },
      ],
    };

    const output = generateCodeFromProgram(program);

    expect(output).toContain('AJJ.print("Hello");');
  });
});


describe("CodeGenerator Integration Tests", () => {
  let generator;

  beforeEach(() => {
    generator = new CodeGenerator();
  });

  function expectGeneratedContains(code, ...expectedLines) {
    expectedLines.forEach(line =>
      expect(code).toContain(line)
    );
  }

  test("generates class with constructor and varDecs", () => {
    const program = {
      classDefs: [
        {
          name: "MyClass",
          varDecs: [{ identifier: "x" }],
          constructor: {
            params: [{ identifier: "x" }],
            body: []
          },
          methods: []
        }
      ],
      statements: []
    };

    const output = generator.generate(program);

    expectGeneratedContains(
      output,
      "const MyClass = AJJ.createClass('MyClass');",
      "this.x = null;",
      "MyClass.prototype.init = function(x) {"
    );
  });

  test("generates class with superclass and superCall", () => {
    const program = {
      classDefs: [
        {
          name: "Parent",
          varDecs: [],
          constructor: {
            params: [{ identifier: "a" }],
            body: []
          },
          methods: []
        },
        {
          name: "Child",
          superclass: "Parent",
          varDecs: [],
          constructor: {
            params: [{ identifier: "a" }, { identifier: "b" }],
            superCall: true,
            body: []
          },
          methods: []
        }
      ],
      statements: []
    };

    const output = generator.generate(program);

    expectGeneratedContains(
      output,
      "const Child = AJJ.createClass('Child', Parent);",
      "Object.getPrototypeOf(Child.prototype).init.call(this, );"
    );
  });

  test("generates method inside class", () => {
    const program = {
      classDefs: [
        {
          name: "Test",
          varDecs: [],
          constructor: { params: [], body: [] },
          methods: [
            {
              name: "sayHello",
              params: [{ identifier: "msg" }],
              body: [
                {
                  type: "Print",
                  argument: { type: "StringLiteral", value: "hello" }
                }
              ]
            }
          ]
        }
      ],
      statements: []
    };

    const output = generator.generate(program);
    expectGeneratedContains(
      output,
      "Test.prototype.sayHello = function(msg) {",
      "AJJ.print(\"hello\");"
    );
  });

  test("generates main program statements", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "Print",
          argument: { type: "StringLiteral", value: "Main Works" }
        }
      ]
    };

    const output = generator.generate(program);
    expectGeneratedContains(
      output,
      "(function() {",
      "AJJ.print(\"Main Works\");",
      "})();"
    );
  });

  test ("generates if statement", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "If",
          condition: { type: "BooleanLiteral", value: true },
          thenBranch: {
            type: "Print",
            argument: { type: "StringLiteral", value: "True" }
          },
          elseBranch: null
        }
      ]
    };

    const output = generator.generate(program);
    expectGeneratedContains(
      output,
      "if (true) {",
      "AJJ.print(\"True\");"
    );
  }
  );

  test("generates while loop", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "While",
          condition: { type: "BooleanLiteral", value: true },
          body: {
            type: "Print",
            argument: { type: "StringLiteral", value: "Looping" }
          }
        }
      ]
    };

    const output = generator.generate(program);
    expectGeneratedContains(
      output,
      "while (true) {",
      "AJJ.print(\"Looping\");"
    );
  });
  test("generates return statement", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "Return",
          value: { type: "IntegerLiteral", value: 42 }
        }
      ]
    };

    const output = generator.generate(program);
    expectGeneratedContains(
      output,
      "return 42;"
    );
  });
  test("generates assignment statement", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: 'Assignment',
          left: {
            varType: [Object],
            identifier: 'x',
            isProtected: false,
            isPrivate: false
          },
          right: { type: 'IntegerLiteral', value: 10 }
        }
      ]
    };

    const output = generator.generate(program);
    expectGeneratedContains(
      output,
      "x = 10;"
    );
  });
  test("generates binary expression", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: 'Assignment',
          left: {
            varType: { typeName: 'integer' },
            identifier: 'result',
            isProtected: false,
            isPrivate: false
          },
          right: {
            type: 'BinaryExpression',
            left: { type: 'IntegerLiteral', value: 5 },
            operator: '+',
            right: { type: 'IntegerLiteral', value: 10 }
          }
        }
      ]
    };

    const output = generator.generate(program);
    expectGeneratedContains(
      output,
      "result = (5 + 10);"
    );
  });
  test("generates method call", () => {
    const program = {
        "classDefs": [],
        "statements": [
          {
            "type": "ExpressionStatement",
            "expression": {
              "type": "MethodDeclaration",
              "name": "deez",
              "params": [
                {
                  "varType": {
                    "typeName": "integer"
                  },
                  "identifier": "num"
                }
              ],
              "returnType": {
                "typeName": "void"
              },
              "body": {
                "type": "Block",
                "statements": [
                  {
                    "type": "ExpressionStatement",
                    "expression": {
                      "type": "Print",
                      "argument": {
                        "type": "BinaryExpression",
                        "left": {
                          "type": "StringLiteral",
                          "value": "deez"
                        },
                        "operator": "+",
                        "right": {
                          "type": "Variable",
                          "name": "num"
                        }
                      }
                    }
                  }
                ]
              }
            }
          },
          {
            "type": "ExpressionStatement",
            "expression": {
              "type": "MethodCall",
              "callee": "Global",
              "methodName": "deez",
              "args": [
                {
                  "type": "IntegerLiteral",
                  "value": 1
                }
              ]
            }
          }
        ]
    };

    const output = generator.generate(program).trim();
    expectGeneratedContains(
      output,
      `AJJ.print((\"deez\" + num));`
    );
  });
  test("generates ternary expression", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: 'Assignment',
          left: {
            varType: { typeName: 'integer' },
            identifier: 'result',
            isProtected: false,
            isPrivate: false
          },
          right: {
            type: 'TernaryExpression',
            condition: { type: 'BooleanLiteral', value: true },
            trueExpr: { type: 'IntegerLiteral', value: 1 },
            falseExpr: { type: 'IntegerLiteral', value: 0 }
          }
        }
      ]
    };

    const output = generator.generate(program);
    expectGeneratedContains(
      output,
      "result = (true ? 1 : 0);"
    );
  });
  test("variable reassignment", () => {
    const program = {
      
        "classDefs": [],
        "statements": [
          {
            "type": "Assignment",
            "left": {
              "varType": {
                "typeName": "integer"
              },
              "identifier": "x",
              "isProtected": false,
              "isPrivate": false
            },
            "right": {
              "type": "IntegerLiteral",
              "value": 10
            }
          },
          {
            "type": "Assignment",
            "left": {
              "type": "Variable",
              "name": "x"
            },
            "right": {
              "type": "IntegerLiteral",
              "value": 5
            }
          },
          {
            "type": "ExpressionStatement",
            "expression": {
              "type": "Print",
              "argument": {
                "type": "Variable",
                "name": "x"
              }
            }
          }
        ]
    };
    const output = generator.generate(program);
    expectGeneratedContains(
      output,
      "x = 10;",
      "x = 5;",
      "AJJ.print(x);"
    );
  }
  );

  test("if else statement", () => {
    const program = {
        "classDefs": [],
        "statements": [
          {
            "type": "Assignment",
            "left": {
              "varType": {
                "typeName": "boolean"
              },
              "identifier": "num",
              "isProtected": false,
              "isPrivate": false
            },
            "right": {
              "type": "BooleanLiteral",
              "value": false
            }
          },
          {
            "type": "If",
            "condition": {
              "type": "Variable",
              "name": "num"
            },
            "thenBranch": {
              "type": "Block",
              "statements": [
                {
                  "type": "ExpressionStatement",
                  "expression": {
                    "type": "Print",
                    "argument": {
                      "type": "StringLiteral",
                      "value": "num is true"
                    }
                  }
                }
              ]
            },
            "elseBranch": {
              "type": "Block",
              "statements": [
                {
                  "type": "ExpressionStatement",
                  "expression": {
                    "type": "Print",
                    "argument": {
                      "type": "StringLiteral",
                      "value": "num is false"
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    const output = generator.generate(program);
    expectGeneratedContains(
      output,
      "let num = false;",
      "if (num) {",
      "AJJ.print(\"num is true\");",
      "} else {",
      "AJJ.print(\"num is false\");"
    );
  }
  );
  test("while loop with break", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "While",
          condition: { type: "BooleanLiteral", value: true },
          body: {
            type: "Block",
            statements: [
              {
                type: "Break"
              }
            ]
          }
        }
      ]
    };

    const output = generator.generate(program);
    expectGeneratedContains(
      output,
      "while (true) {",
      "break;"
    );
  });
  test("break statement outside loop", () => {
    const program = {
      classDefs: [],
      statements: [
        {
          type: "Break"
        }
      ]
    };

    const output = generator.generate(program);
    expectGeneratedContains(
      output,
      "break;"
    );
  });
  test("test return statement", () => {
    const program = {
        "classDefs": [],
        "statements": [
          {
            "type": "ExpressionStatement",
            "expression": {
              "type": "MethodDeclaration",
              "name": "deez",
              "params": [
                {
                  "varType": {
                    "typeName": "integer"
                  },
                  "identifier": "num"
                }
              ],
              "returnType": {
                "typeName": "integer"
              },
              "body": {
                "type": "Block",
                "statements": [
                  {
                    "type": "Return",
                    "value": {
                      "type": "Variable",
                      "name": "num"
                    }
                  }
                ]
              }
            }
          },
          {
            "type": "Assignment",
            "left": {
              "varType": {
                "typeName": "integer"
              },
              "identifier": "num",
              "isProtected": false,
              "isPrivate": false
            },
            "right": {
              "type": "MethodCall",
              "callee": "Global",
              "methodName": "deez",
              "args": [
                {
                  "type": "IntegerLiteral",
                  "value": 10
                }
              ]
            }
          }
        ]
      }
    const output = generator.generate(program);
    expectGeneratedContains(
      output,
      "return num;",
      "num = deez(10);"
    );
  }
  );
  test("Class declaration with methods", () => {
    const program = {
        "classDefs": [
          {
            "name": "Ayo",
            "superclass": null,
            "varDecs": [
              {
                "varType": {
                  "typeName": "string"
                },
                "identifier": "name",
                "isProtected": false,
                "isPrivate": false
              },
              {
                "varType": {
                  "typeName": "integer"
                },
                "identifier": "age",
                "isProtected": false,
                "isPrivate": false
              }
            ],
            "constructor": {
              "params": [
                {
                  "varType": {
                    "typeName": "string"
                  },
                  "identifier": "name",
                  "isProtected": false,
                  "isPrivate": false
                },
                {
                  "varType": {
                    "typeName": "integer"
                  },
                  "identifier": "age",
                  "isProtected": false,
                  "isPrivate": false
                }
              ],
              "superCall": null,
              "body": [
                {
                  "type": "Assignment",
                  "left": {
                    "type": "FieldAccess",
                    "object": {
                      "type": "This"
                    },
                    "field": "name"
                  },
                  "right": {
                    "type": "Variable",
                    "name": "name"
                  }
                },
                {
                  "type": "Assignment",
                  "left": {
                    "type": "FieldAccess",
                    "object": {
                      "type": "This"
                    },
                    "field": "age"
                  },
                  "right": {
                    "type": "Variable",
                    "name": "age"
                  }
                }
              ]
            },
            "methods": [
              {
                "name": "getName",
                "params": [],
                "returnType": {
                  "typeName": "string"
                },
                "body": [
                  {
                    "type": "Return",
                    "value": {
                      "type": "FieldAccess",
                      "object": {
                        "type": "This"
                      },
                      "field": "name"
                    }
                  }
                ]
              },
              {
                "name": "printNameAndAge",
                "params": [],
                "returnType": {
                  "typeName": "void"
                },
                "body": [
                  {
                    "type": "ExpressionStatement",
                    "expression": {
                      "type": "Print",
                      "argument": {
                        "type": "BinaryExpression",
                        "left": {
                          "type": "BinaryExpression",
                          "left": {
                            "type": "BinaryExpression",
                            "left": {
                              "type": "BinaryExpression",
                              "left": {
                                "type": "StringLiteral",
                                "value": "Hello, my name is "
                              },
                              "operator": "+",
                              "right": {
                                "type": "FieldAccess",
                                "object": {
                                  "type": "This"
                                },
                                "field": "name"
                              }
                            },
                            "operator": "+",
                            "right": {
                              "type": "StringLiteral",
                              "value": " and I am "
                            }
                          },
                          "operator": "+",
                          "right": {
                            "type": "FieldAccess",
                            "object": {
                              "type": "This"
                            },
                            "field": "age"
                          }
                        },
                        "operator": "+",
                        "right": {
                          "type": "StringLiteral",
                          "value": " years old."
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        ],
        "statements": [
          {
            "type": "Assignment",
            "left": {
              "varType": {
                "typeName": "Ayo"
              },
              "identifier": "mrAyo",
              "isProtected": false,
              "isPrivate": false
            },
            "right": {
              "type": "NewExpression",
              "className": "Ayo",
              "args": [
                {
                  "type": "StringLiteral",
                  "value": "Ayo"
                },
                {
                  "type": "IntegerLiteral",
                  "value": 25
                }
              ]
            }
          },
          {
            "type": "ExpressionStatement",
            "expression": {
              "type": "MethodCall",
              "callee": {
                "type": "Variable",
                "name": "mrAyo"
              },
              "methodName": "printNameAndAge",
              "args": []
            }
          }
        ]
      }
    const output = generator.generate(program);
    expectGeneratedContains(
      output,
      "const Ayo = AJJ.createClass('Ayo');",
      "let mrAyo = new Ayo(\"Ayo\", 25);",
      "mrAyo.printNameAndAge();"
    );
  }
  );
  test("simple postfix increment", () => {
    const program = {
        "classDefs": [],
        "statements": [
          {
            "type": "Assignment",
            "left": {
              "varType": {
                "typeName": "integer"
              },
              "identifier": "noob",
              "isProtected": false,
              "isPrivate": false
            },
            "right": {
              "type": "IntegerLiteral",
              "value": 3
            }
          },
          {
            "type": "While",
            "condition": {
              "type": "BinaryExpression",
              "left": {
                "type": "Variable",
                "name": "noob"
              },
              "operator": "<",
              "right": {
                "type": "IntegerLiteral",
                "value": 10
              }
            },
            "body": {
              "type": "Block",
              "statements": [
                {
                  "type": "ExpressionStatement",
                  "expression": {
                    "type": "PostfixIncrement",
                    "operand": {
                      "type": "Variable",
                      "name": "noob"
                    }
                  }
                },
                {
                  "type": "If",
                  "condition": {
                    "type": "BinaryExpression",
                    "left": {
                      "type": "Variable",
                      "name": "noob"
                    },
                    "operator": "==",
                    "right": {
                      "type": "IntegerLiteral",
                      "value": 5
                    }
                  },
                  "thenBranch": {
                    "type": "Block",
                    "statements": [
                      {
                        "type": "ExpressionStatement",
                        "expression": {
                          "type": "Print",
                          "argument": {
                            "type": "StringLiteral",
                            "value": "noob is 5"
                          }
                        }
                      }
                    ]
                  },
                  "elseBranch": null
                },
                {
                  "type": "ExpressionStatement",
                  "expression": {
                    "type": "Print",
                    "argument": {
                      "type": "Variable",
                      "name": "noob"
                    }
                  }
                }
              ]
            }
          }
        ]
      
    }
    const output = generator.generate(program);
    expectGeneratedContains(
      output,
      "let noob = 3;",
      "while ((noob < 10)) {",
      "noob++;",
      "if ((noob == 5)) {",
      "AJJ.print(\"noob is 5\");",
      "AJJ.print(noob);"
    );
  }
  );

  test("Simple prefix increment", () => {
    const program = {
        "classDefs": [],
        "statements": [
          {
            "type": "Assignment",
            "left": {
              "varType": {
                "typeName": "integer"
              },
              "identifier": "noob",
              "isProtected": false,
              "isPrivate": false
            },
            "right": {
              "type": "IntegerLiteral",
              "value": 3
            }
          },
          {
            "type": "While",
            "condition": {
              "type": "BinaryExpression",
              "left": {
                "type": "Variable",
                "name": "noob"
              },
              "operator": "<",
              "right": {
                "type": "IntegerLiteral",
                "value": 10
              }
            },
            "body": {
              "type": "Block",
              "statements": [
                {
                  "type": "ExpressionStatement",
                  "expression": {
                    "type": "PrefixIncrement",
                    "operand": {
                      "type": "Variable",
                      "name": "noob"
                    }
                  }
                },
                {
                  "type": "If",
                  "condition": {
                    "type": "BinaryExpression",
                    "left": {
                      "type": "Variable",
                      "name": "noob"
                    },
                    "operator": "==",
                    "right": {
                      "type": "IntegerLiteral",
                      "value": 5
                    }
                  },
                  "thenBranch": {
                    "type": "Block",
                    "statements": [
                      {
                        "type": "ExpressionStatement",
                        "expression": {
                          "type": "Print",
                          "argument": {
                            "type": "StringLiteral",
                            "value": "noob is 5"
                          }
                        }
                      }
                    ]
                  },
                  "elseBranch": null
                },
                {
                  "type": "ExpressionStatement",
                  "expression": {
                    "type": "Print",
                    "argument": {
                      "type": "Variable",
                      "name": "noob"
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    const output = generator.generate(program);
    expectGeneratedContains(
      output,
      "let noob = 3;",
      "while ((noob < 10)) {",
      "++noob;",
      "if ((noob == 5)) {",
      "AJJ.print(\"noob is 5\");",
      "AJJ.print(noob);"
    );
  }
  );
    
    
});