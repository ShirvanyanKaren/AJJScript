// ConstructorValidator.js
const TypeCheckerError = require("./TypeCheckError");
function validateConstructor(classDef, ctx) {
  const { classTable, inheritanceMap } = ctx;
  const ctor = classDef.constructor;

  if (!ctor) {
    if (classDef.superclass) {
      const superCls = classTable.get(classDef.superclass);
      if (!superCls?.constructor) {
        throw TypeCheckerError.invalidConstructor(
          classDef.superclass,
          "Superclass constructor is missing",
          0,
          0
        );
      }
      classDef.constructor = { ...superCls.constructor, isInherited: true };
      return;
    } else {
      throw TypeCheckerError.invalidConstructor(
        classDef.name,
        "Constructor required for base class",
        0,
        0
      );
    }
  }

  if (ctor.params.length === 0 && ctor.superCall) {
    ctor.params = ctor.superCall.args.map((arg, i) => ({
      varType: typeCheckExpression(arg),
      identifier: `param${i}`
    }));
  }

  if (classDef.superclass) {
    const superCls = classTable.get(classDef.superclass);
    if (!superCls?.constructor) {
      throw TypeCheckerError.invalidConstructor(
        classDef.superclass,
        "Superclass constructor is missing",
        0,
        0
      );
    }
    if (!ctor.superCall) {
      throw TypeCheckerError.invalidSuperCall("Missing super() call", 0, 0);
    }
    if (ctor.superCall.args.length < superCls.constructor.params.length) {
      throw TypeCheckerError.invalidSuperCall(
        `super() expects ${superCls.constructor.params.length} arg(s)`,
        0,
        0
      );
    }
  } else if (ctor.superCall) {
    throw TypeCheckerError.invalidSuperCall(
      "super() call in class with no superclass",
      0,
      0
    );
  }
}

module.exports = {
  validateConstructor
};
