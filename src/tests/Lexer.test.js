const Tokenizer = require("../lexer/Tokenizer");
const BaseToken = require("../lexer/tokens/BaseToken");
 const { 
  // Symbol Tokens
  LeftCurlyToken,
  RightCurlyToken,
  LeftParenToken,
  RightParenToken,
  DotToken,
  SemiColonToken,
  CommaToken,
  ColonToken,

  // Statement Tokens
  IfToken,
  ReturnToken,
  WhileToken,
  BreakToken,
  ThisToken,
  PrintToken,

  // Expression Tokens
  TrueToken,
  FalseToken,
  IntegerToken,
  StringToken,

  // Keyword Tokens
  ClassNameTypeToken,
  IntegerTypeToken,
  StringTypeToken,
  BooleanTypeToken,
  VoidTypeToken,

  // Operator Tokens
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
  NotToken,


  // Special Tokens
  SuperToken,
  ClassToken,
  NewToken,
  MethodNameToken,
  VariableToken,
  ConstructorToken,
  ExtendToken,
  MethodToken,

// Access Tokens
  PublicToken,
  PrivateToken,
  ProtectedToken,
  AccessToken,
} = require("../lexer/tokens");

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
    test("Println method should be recognized", () => {
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
      expectTokenizes(`class Test { method() { return 1; } }`, [
        new ClassToken(),
        new ClassNameTypeToken("Test"),
        new LeftCurlyToken(),
        new MethodToken(),
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
    test("Class declaration with extension", () => {
      expectTokenizes("class Test extends Prev {}", [
        new ClassToken(),
        new ClassNameTypeToken("Test"),
        new ExtendToken(),
        new ClassNameTypeToken("Prev"),
        new LeftCurlyToken(),
        new RightCurlyToken(),
      ]);
    });
    test("Class declaration with constructor", () => {
      expectTokenizes("class Test { init() {} }", [
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
    // how to test only this test below
    // npm test -- -t "Class declaration with assignment of this."
    test("Class declaration with assingment of this.", () => {
      expectTokenizes(
        `class Test { 
          this.num;
          init () {
            this.num = 10;
            }
        }`, [
        new ClassToken(),
        new ClassNameTypeToken("Test"),
        new LeftCurlyToken(),
        new ThisToken(),
        new DotToken(),
        new MethodNameToken("num"),
        new SemiColonToken(),
        new ConstructorToken(),
        new LeftParenToken(),
        new RightParenToken(),
        new LeftCurlyToken(),
        new ThisToken(),
        new DotToken(),
        new MethodNameToken("num"),
        new AssignmentToken(),
        new IntegerToken(10),
        new SemiColonToken(),
        new RightCurlyToken(),
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

    test("Method inside a class with access tokens", () => {
      expectTokenizes(`public class Test { public method() { return 1; } }`, [
        new PublicToken(),
        new ClassToken(),
        new ClassNameTypeToken("Test"),
        new LeftCurlyToken(),
        new PublicToken(),
        new MethodToken(),
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

  describe("String Handling", () => {
    test("Parses simple string", () => {
      expectTokenizes('"hello";', [
        new StringToken("hello"),
        new SemiColonToken(),
      ]);
    });
  
    test("Parses escaped newline", () => {
      expectTokenizes('"line1\\nline2";', [
        new StringToken("line1\nline2"),
        new SemiColonToken(),
      ]);
    });
  
    test("Parses escaped tab", () => {
      expectTokenizes('"a\\tb";', [
        new StringToken("a\tb"),
        new SemiColonToken(),
      ]);
    });
  
    test("Parses escaped carriage return", () => {
      expectTokenizes('"a\\rb";', [
        new StringToken("a\rb"),
        new SemiColonToken(),
      ]);
    });
  
    test('Parses escaped quote', () => {
      expectTokenizes('"a\\"b";', [
        new StringToken('a"b'),
        new SemiColonToken(),
      ]);
    });
  
    test("Parses escaped backslash", () => {
      expectTokenizes('"a\\\\b";', [
        new StringToken("a\\b"),
        new SemiColonToken(),
      ]);
    });
  
    test("Parses unknown escape char as literal", () => {
      expectTokenizes('"a\\qb";', [
        new StringToken("aqb"),
        new SemiColonToken(),
      ]);
    });
  
    test("Throws on unterminated escape sequence", () => {
      const tokenizer = new Tokenizer('"hello\\');
      expect(() => tokenizer.tokenizeAll()).toThrow("Unterminated string literal - escape sequence");
    });
  
    test("Throws on completely unterminated string", () => {
      const tokenizer = new Tokenizer('"unterminated');
      expect(() => tokenizer.tokenizeAll()).toThrow("Unterminated string literal");
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

  describe("Numeric Handling", () => {
    test("Valid integer parsing", () => {
      expectTokenizes("123", [new IntegerToken(123)]);
    });
  });
  test("tokenizeNumber throws if no digits found", () => {
    const tokenizer = new Tokenizer("abc"); // non-digit input
    tokenizer.offset = 0;
  
    expect(() => tokenizer.tokenizeNumber()).toThrow("Invalid number at position 0");
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
      expectTokenizes("!", [new NotToken()]);
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

  test("Fallback to Class for unknown words", () => {
    expectTokenizes("foo", [new ClassNameTypeToken("foo")]);
  });

  test("Unknown not recognized token", () => {
    expect( () => expectTokenizes("$", [new BaseToken()])).toThrow();
  });

  test("variable token", () => {
    expectTokenizes("int heyMethod", [
      new IntegerTypeToken(),
      new VariableToken("heyMethod"),
    ]);
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