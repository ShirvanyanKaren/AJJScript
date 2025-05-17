// InheritanceValidator.js
const TypeCheckerError = require("./TypeCheckerError");

function validateInheritanceHierarchy(classTable, inheritanceMap) {
  const visited = new Set();
  const stack = new Set();

  function visit(className) {
    if (stack.has(className)) {
      throw TypeCheckerError.circularInheritance(className, 0, 0);
    }
    if (visited.has(className)) return;

    visited.add(className);
    stack.add(className);

    const parent = inheritanceMap.get(className);
    if (parent) {
      if (!classTable.has(parent)) {
        throw TypeCheckerError.undefinedReference(parent, "class", 0, 0);
      }
      visit(parent);
    }

    stack.delete(className);
  }

  for (const className of classTable.keys()) {
    visit(className);
  }
}

module.exports = { validateInheritanceHierarchy };
