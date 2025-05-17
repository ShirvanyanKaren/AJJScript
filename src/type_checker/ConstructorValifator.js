// ConstructorValidator.js
const TypeCheckerError = require("./TypeCheckerError");
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




}

module.exports = {
  validateConstructor
};
