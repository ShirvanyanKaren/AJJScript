/**
 * @file compiler.js
 * @description Main entry point for the AJJScript compiler. It handles reading the source file,
 * tokenizing, parsing, type checking, generating JavaScript code, and executing it.
 */

const fs = require('fs');
const path = require('path');
const Parser = require('./parser/Parser');
const TypeChecker = require('./type_checker/TypeChecker');
const { generateCode } = require('./code_generator');
const Tokenizer = require('./lexer/Tokenizer');

/**
 * Compiles the given AJJScript file and runs the resulting JavaScript code.
 * It goes through all compilation stages: tokenizing, parsing, type checking, and code generation.
 *
 * @param {string} filePath - Path to the source file to compile and run.
 */
function compileAndRun(filePath) {
    try {
        // Read the source file content
        const sourceCode = fs.readFileSync(filePath, 'utf8');

        // Convert raw source code to tokens
        const tokenizer = new Tokenizer(sourceCode);
        const tokens = tokenizer.tokenizeAll();

        // Parse the tokens into an abstract syntax tree (AST)
        const parser = new Parser(tokens);
        const ast = parser.parse();

        // Type check the AST to catch semantic errors
        const typeChecker = new TypeChecker();
        typeChecker.typeCheck(ast);

        // Generate JavaScript code from the valid AST
        const classTable = typeChecker.classTable;
        const jsCode = generateCode(ast, classTable);

        // Execute the generated JavaScript
        eval(jsCode);
        
    } catch (error) {
        // Display detailed error message and stop execution on failure
        console.error('\nCompilation error:', error.message);
        console.error('\nError stack:', error.stack);
        process.exit(1);
    }
}

// Check that a file path was provided as a command-line argument
if (process.argv.length < 3) {
    console.error('Please provide a file path to compile');
    console.error('Usage: node compiler.js <file_path>');
    process.exit(1);
}

// Only run if this file is executed directly from the command line
if (require.main === module) {
    const filename = process.argv[2];
    if (!filename) {
        console.error('Please provide a file path to compile');
        console.error('Usage: node compiler.js <file_path>');
        process.exit(1);
    }

    // Resolve the full path and compile the file
    const filePath = path.resolve(process.cwd(), filename);
    compileAndRun(filePath);
}

// Export the function for potential use in other modules (e.g., test runners)
module.exports = compileAndRun;
