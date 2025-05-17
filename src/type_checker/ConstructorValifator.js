// ConstructorValidator.js
const TypeCheckerError = require("./TypeCheckerError");
function validateConstructor(classDef, ctx) {
  const { classTable, inheritanceMap } = ctx;
  const ctor = classDef.constructor;


}

module.exports = {
  validateConstructor
};
