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
  }
}

module.exports = { typeCheckStatement };
