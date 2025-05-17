class Program {
    constructor(classDefs, statements) {
        this.classDefs = classDefs;
        this.statements = statements;
    }
}

class ClassDef {
    constructor(name, superclass, varDecs, constructor, methods) {
        this.name = name;
        this.superclass = superclass;
        this.varDecs = varDecs;
        this.constructor = constructor;
        this.methods = methods;
    }
}

class Constructor {
    constructor(params, superCall, body) {
        this.params = params;
        this.superCall = superCall;
        this.body = body;
    }
}

class MethodDef {
    constructor(name, params, returnType, body) {
        this.name = name;
        this.params = params;
        this.returnType = returnType;
        this.body = body;
    }
}

class VarDec {
    constructor(varType, identifier) {
        this.varType = varType;
        this.identifier = identifier;
    }
}

class ExpressionStatement {
    constructor(expression) {
        this.type = "ExpressionStatement";
        this.expression = expression;
    }
}

class BinaryExpression {
    constructor(left, operator, right) {
        this.type = "BinaryExpression";
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}

class UnaryExpression {
    constructor(operator, operand) {
        this.type = "UnaryExpression";
        this.operator = operator;
        this.operand = operand;
    }
}

class MethodCall {
    constructor(callee, methodName, args) {
        this.type = "MethodCall";
        this.callee = callee;
        this.methodName = methodName;
        this.args = args;
    }
}

class FieldAccess {
    constructor(object, field) {
        this.type = "FieldAccess";
        this.object = object;
        this.field = field;
    }
}

class This {
    constructor() {
        this.type = "This";
    }
}

class Super {
    constructor() {
        this.type = "Super";
    }
}

class NewExpression {
    constructor(className, args) {
        this.type = "NewExpression";
        this.className = className;
        this.args = args;
    }
}

class ReturnStatement {
    constructor(value) {
        this.type = "Return";
        this.value = value;
    }
}

class Assignment {
    constructor(left, right) {
        this.type = "Assignment";
        this.left = left;
        this.right = right;
    }
}

class Print {
    constructor(argument) {
        this.type = "Print";
        this.argument = argument;
    }
}

class TernaryExpression {
    constructor(condition, trueExpr, falseExpr) {
      this.type = "TernaryExpression";
      this.condition = condition;
      this.trueExpr = trueExpr;
      this.falseExpr = falseExpr;
    }
  }

  class MethodDeclaration {
    constructor(name, params, returnType, body) {
      this.type = "MethodDeclaration";
      this.name = name;
      this.params = params;
      this.returnType = returnType;
      this.body = body;
    }
  }
  class ForLoop {
    constructor(initializer, condition, increment, body) {
      this.type = "ForLoop";
      this.initializer = initializer;
      this.condition = condition;
      this.increment = increment;
      this.body = body;
    }
  }  
  

module.exports = {
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
    MethodDeclaration,
    ForLoop,
};