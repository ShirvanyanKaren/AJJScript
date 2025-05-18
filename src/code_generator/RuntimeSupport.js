function generateRuntimeSupport(appendLine, indentLevelCallback) {
    appendLine("const AJJ = {");
    indentLevelCallback(1);
  
    // Print function
    appendLine("print: function(value) {");
    indentLevelCallback(1);
    appendLine("console.log(value);");
    indentLevelCallback(-1);
    appendLine("},");
  
    // Class creation
    appendLine("createClass: function(className, parent) {");
    indentLevelCallback(1);
  
    appendLine("class Class {");
    indentLevelCallback(1);
    appendLine("constructor(...args) {");
    indentLevelCallback(1);
    appendLine("if (this.constructor === Class) {");
    indentLevelCallback(1);
    appendLine('if (typeof this.init === "function") {');
    indentLevelCallback(1);
    appendLine("this.init(...args);");
    indentLevelCallback(-1);
    appendLine("}");
    indentLevelCallback(-1);
    appendLine("}");
    indentLevelCallback(-1);
    appendLine("}");
    indentLevelCallback(-1);
    appendLine("}");
  
    appendLine("if (parent) {");
    indentLevelCallback(1);
    appendLine("Object.setPrototypeOf(Class.prototype, parent.prototype);");
    indentLevelCallback(-1);
    appendLine("}");
  
    appendLine("Class.className = className;");
    appendLine("return Class;");
  
    indentLevelCallback(-1);
    appendLine("}");
  
    indentLevelCallback(-1);
    appendLine("};");
  }
  
  module.exports = { generateRuntimeSupport };