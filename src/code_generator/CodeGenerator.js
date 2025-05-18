// CodeGenerator.js
const {generateRuntimeSupport} = require("./RuntimeSupport");
const { generateClassDef}= require("./ClassGenerator");
const {generateStatement} = require("./StatementGenerator");
const {generateExpression} = require("./ExpressionGenerator");

class CodeGenerator {
  constructor() {
    this.indentLevel = 0;
    this.output = "";
    this.currentClass = null;
    this.declaredVariables = new Set();
    this.classTable = new Map();
  }


  indentLevelCallback(change) {
    this.indentLevel += change;
  }

  indent() {
    return "  ".repeat(this.indentLevel);
  }fgenerateExpression

  appendLine(line) {
    this.output += this.indent() + line + "\n";
  }

  generate(program) {
    this.output = "";
    this.indentLevel = 0;
    this.declaredVariables = new Set();
    this.appendLine("// AJJScript Runtime");
    generateRuntimeSupport(
      this.appendLine.bind(this),
      this.indentLevelCallback.bind(this),
    );    
    this.appendLine("");

    for (const classDef of program.classDefs) {
      generateClassDef(classDef, {
        appendLine: this.appendLine.bind(this),
        indentLevelCallback: this.indentLevelCallback.bind(this),
        declaredVariables: this.declaredVariables,
        classTable: this.classTable,
        generateParams: this.generateParams.bind(this),
        generateExpression: generateExpression.bind(this),
        generateStatement: generateStatement.bind(this),
      });
      this.appendLine("");
    }

    this.appendLine("// Main Program");
    this.appendLine("(function() {");
    this.indentLevel++;

    for (const statement of program.statements) {
      generateStatement(statement, {
        appendLine: this.appendLine.bind(this),
        indent: this.indent.bind(this),
        indentLevelCallback: this.indentLevelCallback.bind(this),
        generateExpression: generateExpression.bind(this),
        declaredVariables: this.declaredVariables,
        currentClass: this.currentClass,
      });
    }

    this.indentLevel--;
    this.appendLine("})();");

    return this.output;
  }

  generateParams(params) {
    return params.map((param) => param.identifier).join(", ");
  }
r
}


module.exports = CodeGenerator;
