const TypeCheckerError = require("./TypeCheckError");
const { typeCheckExpression } = require("./ExpressionValidator");
const { isTypeCompatible } = require("../utils/TyperChecker");

function typeCheckSuperCall(superCall, ctx) {
  if (!ctx.currentClass.superclass) {
    throw TypeCheckerError.invalidSuperCall("super() call in class with no superclass", 0, 0);
  }

  const superClass = ctx.classTable.get(ctx.currentClass.superclass);
  const superConstructor = superClass.constructor;
  const expectedParams = superConstructor.params;

  if (superCall.args.length < expectedParams.length) {
    throw TypeCheckerError.invalidSuperCall(
      `super() expects at least ${expectedParams.length} argument(s), but got ${superCall.args.length}`,
      0,
      0
    );
  }

  for (let i = 0; i < expectedParams.length; i++) {
    const argType = typeCheckExpression(superCall.args[i], ctx);
    const paramType = expectedParams[i].varType;

    if (!isTypeCompatible(paramType, argType, ctx)) {
      throw TypeCheckerError.typeMismatch(paramType.typeName, argType.typeName, 0, 0);
    }
  }
}

module.exports = { typeCheckSuperCall };
