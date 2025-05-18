/**
 * ClassGenerator.js
 *
 * Responsible for generating class definitions, constructors, and methods.
 */


function generateClassDef(classDef, ctx) {
    const {
      appendLine,
      indentLevelCallback,
      declaredVariables,
      classTable,
      generateParams,
      generateExpression,
      generateStatement,
    } = ctx;
  
    ctx.currentClass = classDef.name;
  
    // Class declaration
    if (classDef.superclass) {
      appendLine(
        `const ${classDef.name} = AJJ.createClass('${classDef.name}', ${classDef.superclass});`
      );
    } else {
      appendLine(`const ${classDef.name} = AJJ.createClass('${classDef.name}');`);
    }
  
    // Constructor
    const params = classDef.constructor?.params || [];
    appendLine(
      `${classDef.name}.prototype.init = function(${generateParams(params)}) {`
    );
    indentLevelCallback(1);
  
    for (const param of params) declaredVariables.add(param.identifier);
    for (const varDec of classDef.varDecs || []) {
      appendLine(`this.${varDec.identifier} = null;`);
    }
  
    if (classDef.constructor?.superCall) {
      const superClass = classDef.superclass && classTable.get(classDef.superclass);
      const superParamCount = superClass?.constructor?.params?.length || 0;
      const superArgs = params.slice(0, superParamCount).map(p => p.identifier).join(", ");
      appendLine(`Object.getPrototypeOf(${classDef.name}.prototype).init.call(this, ${superArgs});`);
    }
  
    for (const stmt of classDef.constructor?.body || []) {
      generateStatement(stmt, ctx);
    }
  
    indentLevelCallback(-1);
    appendLine("};");
  
    // Methods
    for (const method of classDef.methods) {
      appendLine(`${classDef.name}.prototype.${method.name} = function(${generateParams(method.params)}) {`);
      indentLevelCallback(1);
  
      for (const param of method.params) declaredVariables.add(param.identifier);
      for (const stmt of method.body) {
        generateStatement(stmt, ctx);
      }
  
      indentLevelCallback(-1);
      appendLine("};");
      declaredVariables.clear();
    }
  
    ctx.currentClass = null;
  }
  
  module.exports = { generateClassDef };
  