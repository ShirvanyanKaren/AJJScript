const TypeCheckerError = require("./TypeCheckError");
const { buildClassRegistry } = require("./ClassRegistry");
const { validateInheritanceHierarchy } = require("./InheritanceValidator");
const { validateClassMembers } = require("./ClassMemberValidator");
const { typeCheckMethodBodies } = require("./MethodBodyChecker");
const { typeCheckStatement } = require("./StatementValidator");
const { typeCheckSuperCall } = require("./SuperCallValidator");


class TypeChecker {
  constructor() {
    this.classTable = new Map();
    this.inheritanceMap = new Map();
    this.currentClass = null;
    this.currentMethod = null;
    this.loopDepth = 0;
    this.globalVars = new Map();
    this.globalMethods = new Map();
  }

  typeCheck(program) {
    const { classTable, inheritanceMap } = buildClassRegistry(program.classDefs);
    this.classTable = classTable;
    this.inheritanceMap = inheritanceMap;

    validateInheritanceHierarchy(this.classTable, this.inheritanceMap);
    validateClassMembers(this.classTable, this.inheritanceMap, this);
    typeCheckMethodBodies(this.classTable, this);
  
    program.statements.forEach(stmt => typeCheckStatement(stmt, this));
  }


  

  typeCheckConstructorBody(constructor) {
    if (constructor.superCall) {
      typeCheckSuperCall(constructor.superCall, this);
    }
    constructor.body.forEach((stmt) => typeCheckStatement(stmt, this));
  }
  
}

module.exports = TypeChecker;