const TypeCheckerError = require("./TypeCheckError");

function buildClassRegistry(classDefs) {

  const classTable = new Map();
  const inheritanceMap = new Map();

  if (classDefs.length === 0) {
    return { classTable, inheritanceMap };
  }
  for (const classDef of classDefs) {
    if (classTable.has(classDef.name)) {
      throw TypeCheckerError.duplicateDefinition(classDef.name, "class", 0, 0);
    }
    classTable.set(classDef.name, classDef);

    if (classDef.superclass) {
      inheritanceMap.set(classDef.name, classDef.superclass);
    }
  }


  return { classTable, inheritanceMap };
}

module.exports = { buildClassRegistry };