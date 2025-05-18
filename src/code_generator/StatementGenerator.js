/**
 * StatementGenerator.js
 *
 * Handles generation of code for statements.
 */

function generateStatement(statement, ctx) {
    const {
      appendLine,
      indentLevelCallback,
      generateExpression,
      declaredVariables,
    } = ctx;

    switch (statement.type) {
        case "ExpressionStatement": {
          if (statement.expression?.type === "MethodDeclaration") {
            const { name, params, body } = statement.expression;
            const paramList = params.map(p => p.identifier).join(", ");
            appendLine(`function ${name}(${paramList}) {`);
            indentLevelCallback(1);
            for (const stmt of body.statements) {
              generateStatement(stmt, ctx);
            }
            indentLevelCallback(-1);
            appendLine("}");
          } else {
            appendLine(`${generateExpression(statement.expression, ctx)};`);
          }
          break;
        }

    }
  

  }
  
  module.exports = { generateStatement };
  