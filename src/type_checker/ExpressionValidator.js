const TypeCheckerError = require("./TypeCheckError");
const { isTypeCompatible, isSubclass } = require("../utils/TyperChecker");

function typeCheckExpression(expr, ctx) {
  switch (expr.type) {
    case "BooleanLiteral":
      return { typeName: "boolean" };

    case "IntegerLiteral":
      return { typeName: "integer" };

    case "StringLiteral":
      return { typeName: "string" };

    case "This":
      if (!ctx.currentClass) {
        throw new TypeCheckerError("this used outside of class context", 0, 0);
      }
      return { typeName: ctx.currentClass.name };

    case "Super":
      if (!ctx.currentClass || !ctx.currentClass.superclass) {
        throw new TypeCheckerError("super used in invalid context", 0, 0);
      }
      return { typeName: ctx.currentClass.superclass };

    case "Variable": {
      if (ctx.currentMethod) {
        const param = ctx?.currentMethod?.params?.find(p => p?.identifier === expr?.name);
        if (param) return param.varType;
      }

      if (ctx.currentClass?.constructor) {
        const param = ctx?.currentClass?.constructor?.params?.find(p => p?.identifier === expr?.name);
        if (param) return param.varType;
      }

      let classDef = ctx.currentClass;
      while (classDef) {
        const field = classDef?.varDecs?.find(v => v.identifier === expr.name);
        if (field) return field.varType;
        const superName = ctx.inheritanceMap.get(classDef.name);
        classDef = superName ? ctx.classTable.get(superName) : null;
      }

      if (ctx?.globalVars?.has(expr.name)) return ctx.globalVars.get(expr.name);

      throw TypeCheckerError.undefinedReference(expr.name, "variable", 0, 0);
    }
  }
}

module.exports = { typeCheckExpression };
