const TypeCheckerError = require("../type_checker/TypeCheckError");

function validateType(type, classTable) {
    if (["integer", "string", "boolean", "void"].includes(type.typeName)) return;
    if (!classTable.has(type.typeName)) {
      throw TypeCheckerError.undefinedReference(type.typeName, "type", 0, 0);
    }
  }

  function isTypeCompatible(expected, actual, ctx) {
    if (expected.typeName === actual.typeName) return true;
    if (actual.typeName === "null") {
      return !["int", "boolean", "void"].includes(expected.typeName);
    }
    let current = expected.typeName
    while (current) {
      if (current == actual.typeName) return true;
      if (!ctx?.inheritanceMap) break;
      current = ctx.inheritanceMap.get(current);
    }
    return false;
  }

  function isSubclass(sub, sup, ctx) {
    while (sub) {
      if (sub === sup) return true;
      sub = ctx.inheritanceMap.get(sub);
    }
    return false;
  }

module.exports = {
  validateType,
  isTypeCompatible,
  isSubclass,
};
