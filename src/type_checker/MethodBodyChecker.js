// src/typechecker/MethodBodyChecker.js
const TypeCheckerError = require("./TypeCheckError");
const { typeCheckStatement } = require("./StatementValidator");
const { typeCheckSuperCall } = require("./SuperCallValidator");

function typeCheckMethodBodies(classTable, ctx) {
  for (const classDef of classTable.values()) {
    ctx.currentClass = classDef;

    typeCheckConstructorBody(classDef.constructor, ctx);

    for (const method of classDef.methods) {
      ctx.currentMethod = method;
      for (const stmt of method.body) {
        typeCheckStatement(stmt, ctx);
      }
    }

    ctx.currentClass = null;
    ctx.currentMethod = null;
  }
}

function typeCheckConstructorBody(constructor, ctx) {
  if (constructor.superCall) {
    typeCheckSuperCall(constructor.superCall, ctx);
  }

  for (const stmt of constructor.body) {
    typeCheckStatement(stmt, ctx);
  }
}

module.exports = {
  typeCheckMethodBodies,
};