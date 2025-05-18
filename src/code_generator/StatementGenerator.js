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

        case "Assignment": {
            let target, value;
            if (statement.left.identifier && statement.left.varType) {
              const varName = statement.left.identifier;
              declaredVariables.add(varName);
              target = `let ${varName}`;
            } else if (statement.left.type === "Variable") {
              target = statement.left.name;
              if (!declaredVariables.has(target)) {
                declaredVariables.add(target);
                target = `let ${target}`;
              }
            } else {
              target = generateExpression(statement.left, ctx);
            }
      
            if (
              statement.left.type === "FieldAccess" &&
              statement.right.type === "Variable" &&
              declaredVariables.has(statement.right.name)
            ) {
              value = statement.right.name;
            } else {
              value = generateExpression(statement.right, ctx);
            }
      
            appendLine(`${target} = ${value};`);
            break;
          }
    }
  

  }
  
  module.exports = { generateStatement };
  