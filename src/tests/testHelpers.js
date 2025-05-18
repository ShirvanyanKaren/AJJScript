const {
    Program,
    ClassDef,
    Constructor,
    MethodDef,
    VarDec
} = require('../parser/ASTNodes');

// Helper to create a basic class definition
function createBasicClass(name, superclass = null) {
    return new ClassDef(
        name,
        superclass,
        [],
        new Constructor([], null, []),
        []
    );
}

// Helper to create a method definition
function createMethod(name, params = [], returnType = { typeName: 'void' }, body = []) {
    return new MethodDef(name, params, returnType, body);
}

// Helper to create a variable declaration
function createVarDec(type, name) {
    return new VarDec({ typeName: type }, name);
}

// Helper to create a constructor
function createConstructor(params = [], superCall = null, body = []) {
    return new Constructor(params, superCall, body);
}

// Helper to create a binary expression
function createBinaryExpr(left, operator, right) {
    return {
        type: 'BinaryExpression',
        operator,
        left,
        right
    };
}

// Helper to create a method call
function createMethodCall(callee, methodName, args = []) {
    return {
        type: 'MethodCall',
        callee,
        methodName,
        args
    };
}

// Helper to create a field access
function createFieldAccess(object, field) {
    return {
        type: 'FieldAccess',
        object,
        field
    };
}

// Helper to create literals
const literals = {
    int: (value) => ({ type: 'IntegerLiteral', value }),
    string: (value) => ({ type: 'StringLiteral', value }),
    boolean: (value) => ({ type: 'BooleanLiteral', value }),
    null: () => ({ type: 'NullLiteral' }),
    this: () => ({ type: 'This' }),
    super: () => ({ type: 'Super' })
};

// Helper to create statements
const statements = {
    return: (value) => ({ type: 'Return', value }),
    if: (condition, thenBranch, elseBranch = null) => ({
        type: 'If',
        condition,
        thenBranch,
        elseBranch
    }),
    while: (condition, body) => ({
        type: 'While',
        condition,
        body
    }),
    break: () => ({ type: 'Break' }),
    block: (statements) => ({ type: 'Block', statements }),
    assignment: (left, right) => ({
        type: 'Assignment',
        left,
        right
    })
};

module.exports = {
    createBasicClass,
    createMethod,
    createVarDec,
    createConstructor,
    createBinaryExpr,
    createMethodCall,
    createFieldAccess,
    literals,
    statements
}; 


