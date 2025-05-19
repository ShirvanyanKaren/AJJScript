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
    /**
     * @type {number}
     * Current indentation level used for formatting the generated code.
     */
    this.indentLevel = 0;

    /**
     * @type {string}
     * Accumulated output JavaScript code.
     */
    this.output = "";

    /**
     * @type {string|null}
     * Tracks the name of the class currently being generated.
     */
    this.currentClass = null;

    /**
     * @type {Set<string>}
     * Keeps track of declared variables in the current scope to prevent redeclarations.
     */
    this.declaredVariables = new Set();

    /**
     * @type {Map<string, ClassDef>}
     * Stores class definitions by name for reference during code generation.
     */
    this.classTable = new Map();
  }

  /**
   * Adjusts the current indentation level.
   * @param {number} change - Amount to add or subtract from indent level.
   */
  indentLevelCallback(change) {
    this.indentLevel += change;
  }

  /**
   * Returns the current indentation string based on indentLevel.
   * @returns {string}
   */
  indent() {
    return "  ".repeat(this.indentLevel);
  }

  /**
   * Appends a line of code to the output with proper indentation.
   * @param {string} line - The line of code to append.
   */
  appendLine(line) {
    this.output += this.indent() + line + "\n";
  }

  /**
   * Generates JavaScript code from a given AJJScript program AST.
   * @param {Program} program - The root of the parsed AJJScript program.
   * @returns {string} - The resulting JavaScript code.
   */
  generate(program) {
    this.output = "";
    this.indentLevel = 0;
    this.declaredVariables = new Set();

    // Generate runtime support (e.g., class helpers, super, etc.)
    this.appendLine("// AJJScript Runtime");
    generateRuntimeSupport(
      this.appendLine.bind(this),
      this.indentLevelCallback.bind(this)
    );
    this.appendLine("");

    // Generate code for each class definition
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

    // Generate code for main program (top-level statements)
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
   * Converts an array of parameter objects into a comma-separated string of parameter names.
   * @param {Array<{identifier: string}>} params - Parameters for a function or method.
   * @returns {string} - Comma-separated parameter list.
   */
  generateParams(params) {
    return params.map((param) => param.identifier).join(", ");
  }
}

module.exports = CodeGenerator;
