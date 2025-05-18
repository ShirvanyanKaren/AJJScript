const TypeCheckerError = require("./TypeCheckError");
const { validateConstructor } = require("./ConstructorValifator");
const { validateType } = require("../utils/TyperChecker");
const { typeCheckExpression } = require("./ExpressionValidator");

function validateClassMembers(classTable, inheritanceMap, ctx) {
  for (const [name, classDef] of classTable.entries()) {
    validateConstructor(classDef, ctx);

    const fieldNames = new Set();
    for (const varDec of classDef.varDecs) {
      if (fieldNames.has(varDec.identifier)) {
        throw TypeCheckerError.duplicateDefinition(varDec.identifier, "field", 0, 0);
      }
      fieldNames.add(varDec.identifier);
      validateType(varDec.varType, classTable);
    }

    const methodNames = new Set();
    for (const method of classDef.methods) {
      if (methodNames.has(method.name)) {
        throw TypeCheckerError.duplicateDefinition(method.name, "method", 0, 0);
      }
      methodNames.add(method.name);
      validateType(method.returnType, classTable);
      for (const param of method.params) {
        validateType(param.varType, classTable);
      }
    }
  }
}


module.exports = { validateClassMembers };
