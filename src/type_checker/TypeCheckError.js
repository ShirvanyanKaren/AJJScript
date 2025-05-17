class TypeCheckerError extends Error {
    constructor(message, line, column) {
        super(message);
        this.line = line;
        this.column = column;
        this.name = 'TypeCheckerError';
    }

    static returnTypeMismatch(expected, actual, line, column) {
        return new TypeCheckerError(
            `Return type mismatch: expected ${expected}, but got ${actual}`,
            line,
            column
        );
    }

    static duplicateDefinition(name, kind, line, column) {
        return new TypeCheckerError(
            `Duplicate ${kind} definition: ${name}`,
            line,
            column
        );
    }

    static typeMismatch(expected, actual, line, column) {
        return new TypeCheckerError(
            `Type mismatch: expected ${expected}, but got ${actual}`,
            line,
            column
        );
    }

    static undefinedReference(name, kind, line, column) {
        return new TypeCheckerError(
            `Undefined ${kind}: ${name}`,
            line,
            column
        );
    }

    static invalidMethodCall(className, methodName, line, column) {
        return new TypeCheckerError(
            `Method ${methodName} not found in class ${className}`,
            line,
            column
        );
    }

    static invalidFieldAccess(className, fieldName, line, column) {
        return new TypeCheckerError(
            `Field ${fieldName} not found in class ${className}`,
            line,
            column
        );
    }

    static circularInheritance(className, line, column) {
        return new TypeCheckerError(
            `Circular inheritance detected involving class ${className}`,
            line,
            column
        );
    }

    static invalidSuperCall(message, line, column) {
        return new TypeCheckerError(
            `Invalid super call: ${message}`,
            line,
            column
        );
    }

    static invalidConstructor(className, message, line, column) {
        return new TypeCheckerError(
            `Invalid constructor in class ${className}: ${message}`,
            line,
            column
        );
    }
}

module.exports = TypeCheckerError; 