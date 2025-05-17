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
        const param = ctx?.currentMethod?.params?.find(
          (p) => p?.identifier === expr?.name,
        );
        if (param) return param.varType;
      }

      if (ctx.currentClass?.constructor) {
        const param = ctx?.currentClass?.constructor?.params?.find(
          (p) => p?.identifier === expr?.name,
        );
        if (param) return param.varType;
      }

      let classDef = ctx.currentClass;
      while (classDef) {
        const field = classDef?.varDecs?.find(
          (v) => v.identifier === expr.name,
        );
        if (field) return field.varType;
        const superName = ctx.inheritanceMap.get(classDef.name);
        classDef = superName ? ctx.classTable.get(superName) : null;
      }

      if (ctx?.globalVars?.has(expr.name)) return ctx.globalVars.get(expr.name);

      throw TypeCheckerError.undefinedReference(expr.name, "variable", 0, 0);
    }
    case "PrefixIncrement": {
      const operandType = typeCheckExpression(expr.operand, ctx);
      if (operandType.typeName !== "integer") {
        throw TypeCheckerError.typeMismatch(
          "integer",
          operandType.typeName,
          0,
          0,
        );
      }
      return { typeName: "integer" };
    }

    case "FieldAccess": {
      const objectType = typeCheckExpression(expr.object, ctx);
      let classDef = ctx.classTable.get(objectType.typeName);
      if (!classDef) {
        throw TypeCheckerError.undefinedReference(
          objectType.typeName,
          "class",
          0,
          0,
        );
      }

      let field = null;
      while (classDef) {
        field = classDef.varDecs.find((v) => v.identifier === expr.field);
        if (field) break;
        const superName = ctx.inheritanceMap.get(classDef.name);
        classDef = superName ? ctx.classTable.get(superName) : null;
      }

      if (!field) {
        throw TypeCheckerError.invalidFieldAccess(
          objectType.typeName,
          expr.field,
          0,
          0,
        );
      }

      const isSameClass = ctx.currentClass?.name === classDef.name;
      const subClassCheck = isSubclass(
        ctx.currentClass?.name,
        classDef.name,
        ctx,
      );

      if (field.isPrivate && !isSameClass) {
        throw new TypeCheckerError(
          `Cannot access private field '${expr.field}' outside of '${classDef.name}'`,
          0,
          0,
        );
      }

      if (field.isProtected && !isSameClass && !subClassCheck) {
        throw new TypeCheckerError(
          `Cannot access protected field '${expr.field}' outside of '${classDef.name}' or its subclasses`,
          0,
          0,
        );
      }

      return field.varType;
    }

    case "MethodCall": {
      if (expr.callee === "Global") {
        const globalMethod = ctx.globalMethods?.get?.(expr.methodName);
        if (!globalMethod) {
          throw new TypeCheckerError(
            `Unknown global method '${expr.methodName}'`,
            0,
            0,
          );
        }

        if (expr.args.length !== globalMethod.params.length) {
          throw new TypeCheckerError(
            `Global method '${expr.methodName}' expects ${globalMethod.params.length} arguments but got ${expr.args.length}`,
            0,
            0,
          );
        }

        expr.args.forEach((arg, i) => {
          const argType = typeCheckExpression(arg, ctx);
          const paramType = globalMethod.params[i].varType;
          if (!isTypeCompatible(paramType, argType, ctx)) {
            throw TypeCheckerError.typeMismatch(
              paramType.typeName,
              argType.typeName,
              0,
              0,
            );
          }
        });

        return globalMethod.returnType;
      }

      const calleeType = typeCheckExpression(expr.callee, ctx);
      let currentClass = ctx.classTable.get(calleeType.typeName);
      if (!currentClass) {
        throw TypeCheckerError.undefinedReference(
          calleeType.typeName,
          "class",
          0,
          0,
        );
      }

      let method = null;
      while (currentClass && !method) {
        method = currentClass.methods.find((m) => m.name === expr.methodName);
        currentClass = ctx.inheritanceMap.has(currentClass.name)
          ? ctx.classTable.get(ctx.inheritanceMap.get(currentClass.name))
          : null;
      }

      if (!method) {
        throw TypeCheckerError.invalidMethodCall(
          calleeType.typeName,
          expr.methodName,
          0,
          0,
        );
      }

      if (expr.args.length !== method.params.length) {
        throw TypeCheckerError.invalidMethodCall(
          calleeType.typeName,
          `wrong number of args`,
          0,
          0,
        );
      }

      expr.args.forEach((arg, i) => {
        const argType = typeCheckExpression(arg, ctx);
        const paramType = method.params[i].varType;
        if (!isTypeCompatible(paramType, argType, ctx)) {
          throw TypeCheckerError.typeMismatch(
            paramType.typeName,
            argType.typeName,
            0,
            0,
          );
        }
      });

      return method.returnType;
    }
  }
}

module.exports = { typeCheckExpression };
