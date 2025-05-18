/**
 * ExpressionGenerator.js
 *
 * Handles expression code generation for AJJScript.
 */

function generateExpression(expr, ctx) {
    if (!expr) return "";
  
    const { generateExpression: gen, currentClass, declaredVariables } = ctx;
  
    switch (expr.type) {
      case "BinaryExpression": {
        const left = gen(expr.left, ctx);
        const right = gen(expr.right, ctx);
        const op = translateOperator(expr.operator);
        return `(${left} ${op} ${right})`;
      }
      case "Variable": {
        const name = expr.name;
        if (expr.isParam) return name;
        if (currentClass && !declaredVariables.has(name)) return `this.${name}`;
        return name;
      }
      case "IntegerLiteral":
        return expr.value.toString();
      case "StringLiteral":
        return `\"${expr.value}\"`;
      case "BooleanLiteral":
        return expr.value.toString();
      case "This":
        return "this";
      case "CallExpression":
        case "MethodCall": {
          const args = expr.args.map(arg => gen(arg, ctx)).join(", ");      
          if (expr.callee === "Global") {
            return `${expr.methodName}(${args})`;
          }
          const callee = gen(expr.callee, ctx);
          return `${callee}.${expr.methodName}(${args})`;
        }
        
      case "NewExpression": {
        const args = expr.args.map(arg => gen(arg, ctx)).join(", ");
        return `new ${expr.className}(${args})`;
      }
      case "FieldAccess": {
        const object = gen(expr.object, ctx);
        return `${object}.${expr.field}`;
      }
      case "TernaryExpression": {
        const cond = gen(expr.condition, ctx);
        const trueExpr = gen(expr.trueExpr, ctx);
        const falseExpr = gen(expr.falseExpr, ctx);
        return `(${cond} ? ${trueExpr} : ${falseExpr})`;
      }
      case "PostfixIncrement":
        return `${gen(expr.operand, ctx)}++`;
      case "PrefixIncrement":
        return `++${gen(expr.operand, ctx)}`;
      case "Print":
        return `AJJ.print(${gen(expr.argument, ctx)})`;
      default:
        return "/* unknown expression */";
    }
  }
  
  function translateOperator(op) {
    const operatorMap = {
      PlusToken: "+",
      MinusToken: "-",
      MultiplyToken: "*",
      DivideToken: "/",
      AssignmentToken: "=",
    };
  
    if (!op) return "+";
    if (typeof op === "string") return op;
    if (op.constructor?.name && operatorMap[op.constructor.name]) {
      return operatorMap[op.constructor.name];
    }
    return "+";
  }
  
  module.exports = { generateExpression };
  