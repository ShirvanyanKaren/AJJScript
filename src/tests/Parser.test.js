const {
    Program,
    ClassDef,
    Constructor,
    MethodDef,
    VarDec,
    ExpressionStatement,
    BinaryExpression,
} = require('../parser/ASTNodes');


describe('AST Nodes', () => {
    test('should create a Program node', () => {
        const classDefs = ['classDef1', 'classDef2'];
        const statements = ['stmt1', 'stmt2'];
        const program = new Program(classDefs, statements);
        expect(program.classDefs).toEqual(classDefs);
        expect(program.statements).toEqual(statements);
    });

    test('should create a ClassDef node', () => {
        const name = 'MyClass';
        const superclass = 'BaseClass';
        const varDecs = ['varDec1'];
        const constructorNode = 'constructorNode';
        const methods = ['method1', 'method2'];
        const classDef = new ClassDef(name, superclass, varDecs, constructorNode, methods);
        expect(classDef.name).toBe(name);
        expect(classDef.superclass).toBe(superclass);
        expect(classDef.varDecs).toEqual(varDecs);
        expect(classDef.constructor).toBe(constructorNode);
        expect(classDef.methods).toEqual(methods);
    });

    test('should create a Constructor node', () => {
        const params = ['param1', 'param2'];
        const superCall = { arguments: ['arg1'] };
        const body = ['stmt'];
        const ctor = new Constructor(params, superCall, body);
        expect(ctor.params).toEqual(params);
        expect(ctor.superCall).toEqual(superCall);
        expect(ctor.body).toEqual(body);
    });

    



})