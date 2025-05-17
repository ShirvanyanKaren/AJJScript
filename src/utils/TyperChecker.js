const TypeCheckerError = require("../type_checker/TypeCheckerError");

function validateType(type, classTable) {
    if (["integer", "string", "boolean", "void"].includes(type.typeName)) return;
    if (!classTable.has(type.typeName)) {
      throw TypeCheckerError.undefinedReference(type.typeName, "type", 0, 0);
    }
  }

function isTypeCompatible(expected, actual, ctx) {

}

function isSubclass(sub, sup, ctx) {

}

module.exports = {
  validateType,
  isTypeCompatible,
  isSubclass,
};
