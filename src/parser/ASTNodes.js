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