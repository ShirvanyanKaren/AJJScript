/**
 * @file CodeGenerator.js
 * @description Translates a parsed AJJScript program into JavaScript code.
 * It handles generating runtime support, class definitions, and main program statements.
 */

const { generateRuntimeSupport } = require("./RuntimeSupport");
const { generateClassDef } = require("./ClassGenerator");
const { generateStatement } = require("./StatementGenerator");
const { generateExpression } = require("./ExpressionGenerator");

/**
 * CodeGenerator converts an abstract syntax tree (AST) into JavaScript source code.
 */
class CodeGenerator {
  constructor() {
    /** @type {number} */
    this.indentLevel = 0; // Current indentation level used for formatting

    /** @type {string} */
    this.output = ""; // Accumulated output JavaScript code

    /** @type {string|null} */
    this.currentClass = null; // Name of the class currently being generated

    /** @type {Set<string>} */
    this.declaredVariables = new Set(); // Tracks declared variables to prevent redeclaration

    /** @type {Map<string, ClassDef>} */
    this.classTable = new Map(); // Class definitions for code generation reference
  }

  /**
   * Adjusts the indentation level.
   * @param {number} change
   */
  indentLevelCallback(change) {
    this.indentLevel += change;
  }

  /** @returns {string} */
  indent() {
    return "  ".repeat(this.indentLevel);
  }

  /**
   * Appends a line with indentation to the output.
   * @param {string} line
   */
  appendLine(line) {
    this.output += this.indent() + line + "\n";
  }

  /**
   * Generates JavaScript code from an AJJScript AST.
   * @param {Program} program
   * @returns {string}
   */
  generate(program) {
    this.output = "";
    this.indentLevel = 0;
    this.declaredVariables = new Set();

    this.appendLine("// AJJScript Runtime");
    generateRuntimeSupport(
      this.appendLine.bind(this),
      this.indentLevelCallback.bind(this)
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

  /**
   * Converts a parameter list to a comma-separated string.
   * @param {Array<{identifier: string}>} params
   * @returns {string}
   */
  generateParams(params) {
    return params.map((param) => param.identifier).join(", ");
  }
}

module.exports = CodeGenerator;