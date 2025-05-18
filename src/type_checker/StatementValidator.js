const TypeCheckerError = require("./TypeCheckError");
const { typeCheckExpression } = require("./ExpressionValidator");
const { isTypeCompatible } = require("../utils/TyperChecker");

function typeCheckStatement(stmt, ctx) {
  const { currentMethod, currentClass, globalVars } = ctx;
  switch (stmt.type) {
    case "Block":
      stmt.statements.forEach((s) => typeCheckStatement(s, ctx));
      break;

    case "If": {
      const condType = typeCheckExpression(stmt.condition, ctx);
      if (condType.typeName !== "boolean") {
        throw TypeCheckerError.typeMismatch("boolean", condType.typeName, 0, 0);
      }
      typeCheckStatement(stmt.thenBranch, ctx);
      if (stmt.elseBranch) {
        typeCheckStatement(stmt.elseBranch, ctx);
      }
      break;
    }

    case "While": {
      ctx.loopDepth++;
      const condType = typeCheckExpression(stmt.condition, ctx);
      if (condType.typeName !== "boolean") {
        throw TypeCheckerError.typeMismatch("boolean", condType.typeName, 0, 0);
      }
      typeCheckStatement(stmt.body, ctx);
      ctx.loopDepth--;
      break;
    }

    case "Break": {
      if (ctx.loopDepth === 0) {
        throw new TypeCheckerError("Break statement outside of loop", 0, 0);
      }
      break;
    }

    case "Return": {
      if (!currentMethod) {
        throw new TypeCheckerError("Return statement outside of method", 0, 0);
      }
      const expectedType = currentMethod.returnType;
      if (!stmt.value && expectedType.typeName !== "void") {
        throw TypeCheckerError.returnTypeMismatch(
          expectedType.typeName,
          "void",
          0,
          0,
        );
      }
      if (stmt.value) {
        const actualType = typeCheckExpression(stmt.value, ctx);

        if (!isTypeCompatible(expectedType, actualType, ctx)) {
          throw TypeCheckerError.returnTypeMismatch(
            expectedType.typeName,
            actualType.typeName,
            0,
            0,
          );
        }
      }
      break;
    }

    case "Assignment": {
      if (stmt.left.varType && stmt.left.identifier) {
        const declaredType = stmt.left.varType;
        const varName = stmt.left.identifier;
        const valueType = typeCheckExpression(stmt.right, ctx);

        if (!isTypeCompatible(declaredType, valueType, ctx)) {
          throw TypeCheckerError.typeMismatch(
            declaredType.typeName,
            valueType.typeName,
            0,
            0,
          );
        }

        if (!currentClass && !currentMethod) {
          globalVars.set(varName, declaredType);
        }

        return;
      }

      const leftType = typeCheckExpression(stmt.left, ctx);
      const rightType = typeCheckExpression(stmt.right, ctx);
      if (!isTypeCompatible(leftType, rightType, ctx)) {
        throw TypeCheckerError.typeMismatch(
          leftType.typeName,
          rightType.typeName,
          0,
          0,
        );
      }
      return;
    }
    case "ExpressionStatement": {
      if (stmt?.expression?.type === "MethodDeclaration") {
        const oldClass = ctx.currentClass;
        const oldMethod = ctx.currentMethod;

        ctx.currentMethod = {
          params: stmt.expression.params,
          returnType: stmt.expression.returnType,
          name: stmt.expression.name,
        };
        ctx.globalMethods.set(stmt.expression.name, ctx.currentMethod);

        for (const stmts of stmt.expression.body.statements) {
          typeCheckStatement(stmts, ctx);
        }

        ctx.currentClass = oldClass;
        ctx.currentMethod = oldMethod;
        break;
      } else {
        typeCheckExpression(stmt.expression, ctx);
      }
      break;
    }

    default:
      if (stmt.expression) {
        typeCheckExpression(stmt.expression, ctx);
      }
  }
}

module.exports = { typeCheckStatement };