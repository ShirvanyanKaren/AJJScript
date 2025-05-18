const TypeCheckerError = require("./TypeCheckError");
const { typeCheckExpression } = require("./ExpressionValidator");
const { isTypeCompatible } = require("../utils/TyperChecker");


function typeCheckStatement(stmt, ctx) {
  const { currentMethod, currentClass, globalVars } = ctx;
  switch (stmt.type) {

  }
}

module.exports = { typeCheckStatement };
