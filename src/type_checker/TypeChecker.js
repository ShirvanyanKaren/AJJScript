/**
 * @file TypeChecker.js
 * @description Main TypeChecker class responsible for validating a program's type correctness.
 * It delegates specific validation steps to helper modules for classes, inheritance, statements, etc.
 */

const TypeCheckerError = require("./TypeCheckError");
const { buildClassRegistry } = require("./ClassRegistry");
const { validateInheritanceHierarchy } = require("./InheritanceValidator");
const { validateClassMembers } = require("./ClassMemberValidator");
const { typeCheckMethodBodies } = require("./MethodBodyChecker");
const { typeCheckStatement } = require("./StatementValidator");
const { typeCheckSuperCall } = require("./SuperCallValidator");

/**
 * TypeChecker performs type checking on a parsed program.
 * It validates class structure, inheritance, method logic, and top-level statements.
 */
class TypeChecker {
  constructor() {
    /**
     * @type {Map<string, ClassDef>}
     * Holds all class definitions by name.
     */
    this.classTable = new Map();

    /**
     * @type {Map<string, string>}
     * Maps each class to its superclass for inheritance validation.
     */
    this.inheritanceMap = new Map();

    /**
     * @type {string|null}
     * Tracks the current class during traversal.
     */
    this.currentClass = null;

    /**
     * @type {string|null}
     * Tracks the current method being type checked.
     */
    this.currentMethod = null;

    /**
     * @type {number}
     * Tracks how deep we are in nested loops (used for break/continue validation).
     */
    this.loopDepth = 0;

    /**
     * @type {Map<string, string>}
     * Stores types of global variables.
     */
    this.globalVars = new Map();

    /**
     * @type {Map<string, MethodDef>}
     * Stores globally defined methods (outside classes).
     */
    this.globalMethods = new Map();
  }

  /**
   * Type checks an entire program by validating class structures and top-level statements.
   * @param {Program} program - The parsed program AST.
   */
  typeCheck(program) {
    // Step 1: Build the class registry and inheritance map from class definitions
    const { classTable, inheritanceMap } = buildClassRegistry(program.classDefs);
    this.classTable = classTable;
    this.inheritanceMap = inheritanceMap;

    // Step 2: Validate that the inheritance graph is valid (e.g., no cycles)
    validateInheritanceHierarchy(this.classTable, this.inheritanceMap);

    // Step 3: Validate fields and methods inside each class
    validateClassMembers(this.classTable, this.inheritanceMap, this);

    // Step 4: Type check all method bodies inside the classes
    typeCheckMethodBodies(this.classTable, this);

    // Step 5: Type check top-level program statements (outside of classes)
    program.statements.forEach(stmt => typeCheckStatement(stmt, this));
  }

  /**
   * Type checks a constructor's body, including its optional `super(...)` call.
   * @param {ConstructorDef} constructor - The constructor AST node.
   */
  typeCheckConstructorBody(constructor) {
    // Check if there's a call to `super(...)` and validate it
    if (constructor.superCall) {
      typeCheckSuperCall(constructor.superCall, this);
    }

    // Type check each statement in the constructor body
    constructor.body.forEach((stmt) => typeCheckStatement(stmt, this));
  }
}

module.exports = TypeChecker;
