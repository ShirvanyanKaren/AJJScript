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