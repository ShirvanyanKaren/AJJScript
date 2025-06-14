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
        const paramList = params.map((p) => p.identifier).join(", ");
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
    case "If": {
      appendLine(`if (${generateExpression(statement.condition, ctx)}) {`);
      indentLevelCallback(1);
      generateStatement(statement.thenBranch, ctx);
      indentLevelCallback(-1);
      if (statement.elseBranch) {
        appendLine("} else {");
        indentLevelCallback(1);
        generateStatement(statement.elseBranch, ctx);
        indentLevelCallback(-1);
      }
      appendLine("}");
      break;
    }
    case "For": {
      let init;
      if (statement.initializer.type === "Assignment") {
        const { left, right } = statement.initializer;

        let target;
        if (left.identifier && left.varType) {
          const varName = left.identifier;
          declaredVariables.add(varName);
          target = `let ${varName}`;
        } else {
          target = generateExpression(left, ctx);
        }

        const value = generateExpression(right, ctx);
        init = `${target} = ${value}`;
      } else {
        init = generateExpression(statement.initializer, ctx);
      }

      const cond = generateExpression(statement.condition, ctx);
      const incr = generateExpression(statement.increment, ctx);

      appendLine(`for (${init}; ${cond}; ${incr}) {`);
      indentLevelCallback(1);
      generateStatement(statement.body, ctx);
      indentLevelCallback(-1);
      appendLine("}");
      break;
    }
    case "While": {
        appendLine(`while (${generateExpression(statement.condition, ctx)}) {`);
        indentLevelCallback(1);
        generateStatement(statement.body, ctx);
        indentLevelCallback(-1);
        appendLine("}");
        break;
      }
  
      case "Block": {
        for (const stmt of statement.statements) {
          generateStatement(stmt, ctx);
        }
        break;
      }
  
      case "Return": {
        if (statement.value) {
          appendLine(`return ${generateExpression(statement.value, ctx)};`);
        } else {
          appendLine("return;");
        }
        break;
      }
  
      case "Break": {
        appendLine("break;");
        break;
      }
  
      case "Print": {
        const arg = generateExpression(statement.argument, ctx);
        appendLine(`AJJ.print(${arg});`);
        break;
      }
      
  
      default:
        appendLine("// Unknown statement type");
  }
}

module.exports = { generateStatement };
