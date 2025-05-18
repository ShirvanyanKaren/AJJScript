// CodeGenerator.js
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


    return this.output;
  }

  generateParams(params) {
    return params.map((param) => param.identifier).join(", ");
  }
r
}


module.exports = CodeGenerator;
