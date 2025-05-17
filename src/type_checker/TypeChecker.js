


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

  }


  

  typeCheckConstructorBody(constructor) {

  }
  
}

module.exports = TypeChecker;
