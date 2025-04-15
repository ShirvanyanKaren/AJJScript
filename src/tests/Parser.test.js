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


}