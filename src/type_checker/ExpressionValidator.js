const TypeCheckerError = require("./TypeCheckerError");
const {isTypeCompatible} = require("../utils/TypeChecker")
const { isSubclass }  = require("../utils/TypeChecker");

function typeCheckExpression(expr, ctx) {
  switch (expr.type) {
  }
}

module.exports = { typeCheckExpression };
