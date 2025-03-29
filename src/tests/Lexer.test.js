const Tokenizer = require("../lexer/Tokenizer");
const BaseToken = require("../lexer/tokens/BaseToken");
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
  IfToken,
  ReturnToken,
  WhileToken,
  BreakToken,
  ThisToken,
  PrintToken,
} = require("../lexer/tokens/StatementTokens");
const {
  TrueToken,
  FalseToken,
  IntegerToken,
  StringToken,
} = require("../lexer/tokens/ExpressionTypeTokens");
const {
  ClassNameTypeToken,
  IntegerTypeToken,
  StringTypeToken,
  BooleanTypeToken,
  VoidTypeToken,
} = require("../lexer/tokens/TypeTokens");
const {
  AssignmentToken,
  PlusToken,
  MinusToken,
  MultiplyToken,
  DivideToken,
  EqualsToken,
  NotEqualsToken,
  GreaterThanEqualToken,
  GreaterThanToken,
  LessThanEqualToken,
  LessThanToken,
} = require("../lexer/tokens/OperatorTokens");
const VariableToken = require("../lexer/tokens/VariableToken");
const {
  SuperToken,
  ClassToken,
  NewToken,
  MethodNameToken,
  ConstructorToken,
  ExtendToken,
  MethodToken,
} = require("../lexer/tokens/SpecialTokens");
const {
  PublicToken,
  PrivateToken,
  ProtectedToken,
  AccessToken,
} = require("../lexer/tokens/AccessTokens");

describe("Tokenizer Tests", () => {
  function expectTokenizes(input, expected) {
    const tokenizer = new Tokenizer(input);
    const result = tokenizer.tokenizeAll();
    expect(result.length).toBe(expected.length);
    for (let i = 0; i < expected.length; i++) {
      expect(result[i]).toBeInstanceOf(expected[i].constructor);
      if (expected[i].value !== undefined) {
        expect(result[i].value).toEqual(expected[i].value);
      }
    }
  }

  describe("Numeric Handling", () => {
    test("Valid integer parsing", () => {
      expectTokenizes("123", [new IntegerToken(123)]);
    });
    test("Valid negative integer parsing", () => {
      expectTokenizes("-123", [new IntegerToken(-123)]);
    });
  });

  describe("Type Handling", () => {
    test("Assignment for IntegerTypeToken", () => {
      expectTokenizes("int", [new IntegerTypeToken()]);
    });
    test("Assignment for StringTypeToken", () => {
      expectTokenizes("string", [new StringTypeToken()]);
    });
    test("Assignment for BooleanTypeToken", () => {
      expectTokenizes("boolean", [new BooleanTypeToken()]);
    });
    test("Assignment for VoidTypeToken", () => {
      expectTokenizes("void", [new VoidTypeToken()]);
    });
  });

  describe("Operators Handling", () => {
    test("Assignment for + operator", () => {
      expectTokenizes("+", [new PlusToken()]);
    });
    test("Assignment for - operator", () => {
      expectTokenizes("-", [new MinusToken()]);
    });
    test("Assignment for * operator", () => {
      expectTokenizes("*", [new MultiplyToken()]);
    });
    test("Assignment for / operator", () => {
      expectTokenizes("/", [new DivideToken()]);
    });
    test("Assignment for = operator", () => {
      expectTokenizes("=", [new AssignmentToken()]);
    });
    test("Assignment for == operator", () => {
      expectTokenizes("==", [new EqualsToken()]);
    });
    test("Assignment for != operator", () => {
      expectTokenizes("!=", [new NotEqualsToken()]);
    });
    test("Assignment for >= operator", () => {
      expectTokenizes(">=", [new GreaterThanEqualToken()]);
    });
    test("Assignment for ! operator", () => {
      expectTokenizes("!", [new FalseToken()]);
    });
    test("Assignment for > operator", () => {
      expectTokenizes(">", [new GreaterThanToken()]);
    });
    test("Assignment for <= operator", () => {
      expectTokenizes("<=", [new LessThanEqualToken()]);
    });
    test("Assignment for < operator", () => {
      expectTokenizes("<", [new LessThanToken()]);
    });
  });

  describe("Basic Tokens", () => {
    test("Empty input should return no tokens", () => {
      expectTokenizes("", []);
    });

    test("Basic symbols", () => {
      expectTokenizes("{}();", [
        new LeftCurlyToken(),
        new RightCurlyToken(),
        new LeftParenToken(),
        new RightParenToken(),
        new SemiColonToken(),
      ]);
    });
  });

  describe("Keywords and Literals", () => {
    test("Boolean literals", () => {
      expectTokenizes("if (false) {}", [
        new IfToken(),
        new LeftParenToken(),
        new FalseToken(),
        new RightParenToken(),
        new LeftCurlyToken(),
        new RightCurlyToken(),
      ]);
    });

    test("String literals", () => {
      expectTokenizes(`return \"Hello, World!\";`, [
        new ReturnToken(),
        new StringToken("Hello, World!"),
        new SemiColonToken(),
      ]);
    });
  });

  describe("Print Method", () => {
    test("Println method should be recognized as a method call", () => {
      expectTokenizes('println("Hello, World!");', [
        new PrintToken(),
        new LeftParenToken(),
        new StringToken("Hello, World!"),
        new RightParenToken(),
        new SemiColonToken(),
      ]);
    });
  });

  describe("Expressions and Operators", () => {
    test("Complex expression with operators", () => {
      expectTokenizes("(4 + 5) * 3;", [
        new LeftParenToken(),
        new IntegerToken(4),
        new PlusToken(),
        new IntegerToken(5),
        new RightParenToken(),
        new MultiplyToken(),
        new IntegerToken(3),
        new SemiColonToken(),
      ]);
    });
  });

  describe("Classes and Methods", () => {
    test("Class declaration", () => {
      expectTokenizes("class Test {}", [
        new ClassToken(),
        new ClassNameTypeToken("Test"),
        new LeftCurlyToken(),
        new RightCurlyToken(),
      ]);
    });

    test("Method inside a class", () => {
      expectTokenizes(`class Test { method returnScore() { return 1; } }`, [
        new ClassToken(),
        new ClassNameTypeToken("Test"),
        new LeftCurlyToken(),
        new MethodToken(),
        new MethodNameToken("returnScore"),
        new LeftParenToken(),
        new RightParenToken(),
        new LeftCurlyToken(),
        new ReturnToken(),
        new IntegerToken(1),
        new SemiColonToken(),
        new RightCurlyToken(),
        new RightCurlyToken(),
      ]);
    });
  });

  describe("Other keywords", () => {
    test("return keyword", () => {
      expectTokenizes("return 1;", [
        new ReturnToken(),
        new IntegerToken(1),
        new SemiColonToken(),
      ]);
    });
  });

  describe("Classes and Access Modifiers", () => {
    test("Protected ", () => {
      expectTokenizes("protected class Test {}", [
        new ProtectedToken(),
        new ClassToken(),
        new ClassNameTypeToken("Test"),
        new LeftCurlyToken(),
        new RightCurlyToken(),
      ]);
    });
    test("Private ", () => {
      expectTokenizes("private class Test {}", [
        new PrivateToken(),
        new ClassToken(),
        new ClassNameTypeToken("Test"),
        new LeftCurlyToken(),
        new RightCurlyToken(),
      ]);
    });
    test("Public ", () => {
      expectTokenizes("public class Test {}", [
        new PublicToken(),
        new ClassToken(),
        new ClassNameTypeToken("Test"),
        new LeftCurlyToken(),
        new RightCurlyToken(),
      ]);
    });
    test("Class declaration and extension", () => {
      expectTokenizes("class Test extends Exam {}", [
        new ClassToken(),
        new ClassNameTypeToken("Test"),
        new ExtendToken(),
        new ClassNameTypeToken("Exam"),
        new LeftCurlyToken(),
        new RightCurlyToken(),
      ]);
    });
    test("Class declaration with constructor", () => {
      expectTokenizes("class Test { constructor() {} }", [
        new ClassToken(),
        new ClassNameTypeToken("Test"),
        new LeftCurlyToken(),
        new ConstructorToken(),
        new LeftParenToken(),
        new RightParenToken(),
        new LeftCurlyToken(),
        new RightCurlyToken(),
        new RightCurlyToken(),
      ]);
    });
    test("Class declaration with assingment of this.", () => {
      expectTokenizes("class Test { this.var = 10; }", [
        new ClassToken(),
        new ClassNameTypeToken("Test"),
        new LeftCurlyToken(),
        new ThisToken(),
        new DotToken(),
        new VariableToken("var"),
        new AssignmentToken(),
        new IntegerToken(10),
        new SemiColonToken(),
        new RightCurlyToken(),
      ]);
    });
    test("Class declaration with access tokens", () => {
      expectTokenizes("public class Test {}", [
        new PublicToken(),
        new ClassToken(),
        new ClassNameTypeToken("Test"),
        new LeftCurlyToken(),
        new RightCurlyToken(),
      ]);
    });
  });

  describe("Class Hierarchy Structure", () => {
    test("Tokenize class Animal with method and constructor", () => {
      expectTokenizes(
        `
        public class Animal {
          init() {}
          method speak() void { return println(0); }
        }
      `,
        [
          new PublicToken(),
          new ClassToken(),
          new ClassNameTypeToken("Animal"),
          new LeftCurlyToken(),
          new ConstructorToken(),
          new LeftParenToken(),
          new RightParenToken(),
          new LeftCurlyToken(),
          new RightCurlyToken(),
          new MethodToken(),
          new MethodNameToken("speak"),
          new LeftParenToken(),
          new RightParenToken(),
          new VoidTypeToken(),
          new LeftCurlyToken(),
          new ReturnToken(),
          new PrintToken(),
          new LeftParenToken(),
          new IntegerToken(0),
          new RightParenToken(),
          new SemiColonToken(),
          new RightCurlyToken(),
          new RightCurlyToken(),
        ],
      );
    });

    test("Tokenize class Cat extending Animal", () => {
      expectTokenizes(
        `
        public class Cat extends Animal {
          init() { super(); }
          method speak() void { return println(1); }
        }
      `,
        [
          new PublicToken(),
          new ClassToken(),
          new ClassNameTypeToken("Cat"),
          new ExtendToken(),
          new ClassNameTypeToken("Animal"),
          new LeftCurlyToken(),
          new ConstructorToken(),
          new LeftParenToken(),
          new RightParenToken(),
          new LeftCurlyToken(),
          new SuperToken(),
          new LeftParenToken(),
          new RightParenToken(),
          new SemiColonToken(),
          new RightCurlyToken(),
          new MethodToken(),
          new MethodNameToken("speak"),
          new LeftParenToken(),
          new RightParenToken(),
          new VoidTypeToken(),
          new LeftCurlyToken(),
          new ReturnToken(),
          new PrintToken(),
          new LeftParenToken(),
          new IntegerToken(1),
          new RightParenToken(),
          new SemiColonToken(),
          new RightCurlyToken(),
          new RightCurlyToken(),
        ],
      );
    });

    test("Tokenize class Dog extending Animal", () => {
      expectTokenizes(
        `
        public class Dog extends Animal {
          init() { super(); }
          method speak() void { return println(2); }
        }
      `,
        [
          new PublicToken(),
          new ClassToken(),
          new ClassNameTypeToken("Dog"),
          new ExtendToken(),
          new ClassNameTypeToken("Animal"),
          new LeftCurlyToken(),
          new ConstructorToken(),
          new LeftParenToken(),
          new RightParenToken(),
          new LeftCurlyToken(),
          new SuperToken(),
          new LeftParenToken(),
          new RightParenToken(),
          new SemiColonToken(),
          new RightCurlyToken(),
          new MethodToken(),
          new MethodNameToken("speak"),
          new LeftParenToken(),
          new RightParenToken(),
          new VoidTypeToken(),
          new LeftCurlyToken(),
          new ReturnToken(),
          new PrintToken(),
          new LeftParenToken(),
          new IntegerToken(2),
          new RightParenToken(),
          new SemiColonToken(),
          new RightCurlyToken(),
          new RightCurlyToken(),
        ],
      );
    });
  });

  describe("Variable Declarations", () => {
    test("Variable assignment", () => {
      expectTokenizes("var: int = 10;", [
        new VariableToken("var"),
        new ColonToken(),
        new IntegerTypeToken(),
        new AssignmentToken(),
        new IntegerToken(10),
        new SemiColonToken(),
      ]);
    });
    test("Variable assignment with access token", () => {
      expectTokenizes("public var: int = 10;", [
        new PublicToken(),
        new VariableToken("var"),
        new ColonToken(),
        new IntegerTypeToken(),
        new AssignmentToken(),
        new IntegerToken(10),
        new SemiColonToken(),
      ]);
    });
  });

  describe("Control Flow", () => {
    test("While loop", () => {
      expectTokenizes("while (true) { break; }", [
        new WhileToken(),
        new LeftParenToken(),
        new TrueToken(),
        new RightParenToken(),
        new LeftCurlyToken(),
        new BreakToken(),
        new SemiColonToken(),
        new RightCurlyToken(),
      ]);
    });
  });

  describe("Edge Cases", () => {
    test("Empty spaces should be ignored", () => {
      expectTokenizes("   ", []);
    });
    test("Valid single character symbols", () => {
      expectTokenizes("{}();,", [
        new LeftCurlyToken(),
        new RightCurlyToken(),
        new LeftParenToken(),
        new RightParenToken(),
        new SemiColonToken(),
        new CommaToken(),
      ]);
    });
  });
  describe("To string checks", () => {
    test("To string checks", () => {
      expect(new IntegerTypeToken(5).toString()).toBe(
        "IntegerTypeToken(number)",
      );
      expect(new StringToken("Hello, World!").toString()).toBe(
        "StringToken(string)",
      );
      expect(new BaseToken().toString()).toBe("BaseToken(object)");
    });
  });

  describe("Instance Checks", () => {
    test("InstanceOf checks", () => {
      expect(new IntegerTypeToken()).toBeInstanceOf(IntegerTypeToken);
      expect(new PublicToken()).toBeInstanceOf(AccessToken);
      expect(new ProtectedToken()).toBeInstanceOf(ProtectedToken);
      expect(new VariableToken("var")).toBeInstanceOf(VariableToken);
      expect(new PrivateToken()).toBeInstanceOf(AccessToken);
    });
    test("Not InstanceOf checks", () => {
      expect(new IntegerTypeToken()).not.toBeInstanceOf(AccessToken);
      expect(new PublicToken()).not.toBeInstanceOf(IntegerTypeToken);
    });
  });
});

describe("Error Handling", () => {
  test("Unexpected token should throw error", () => {
    expect(() => expectTokenizes("@", [])).toThrow();
  });
  test("Unterminated string should throw error", () => {
    expect(() => expectTokenizes('"Unclosed String', [])).toThrow();
  });
  test("Unterminated string literal should throw error", () => {
    expect(() => expectTokenizes('"Unclosed String', [])).toThrow();
  });
});
