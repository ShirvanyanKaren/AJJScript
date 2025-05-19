const fs = require('fs');
const path = require('path');
const Parser = require('./parser/Parser');
const TypeChecker = require('./type_checker/TypeChecker');
const { generateCode } = require('./code_generator');
const Tokenizer = require('./lexer/Tokenizer');

function compileAndRun(filePath) {
    try {
        const sourceCode = fs.readFileSync(filePath, 'utf8');
        const tokenizer = new Tokenizer(sourceCode);
        const tokens = tokenizer.tokenizeAll();
        const parser = new Parser(tokens);
        const ast = parser.parse();
        const typeChecker = new TypeChecker();
        typeChecker.typeCheck(ast);
        const classTable = typeChecker.classTable;
        const jsCode = generateCode(ast, classTable);
        eval(jsCode);
        
    } catch (error) {
        console.error('\nCompilation error:', error.message);
        console.error('\nError stack:', error.stack);
        process.exit(1);
    }
}

if (process.argv.length < 3) {
    console.error('Please provide a file path to compile');
    console.error('Usage: node compiler.js <file_path>');
    process.exit(1);
}
if (require.main === module) {
    const filename = process.argv[2];
    if (!filename) {
        console.error('Please provide a file path to compile');
        console.error('Usage: node compiler.js <file_path>');
        process.exit(1);
    }
    const filePath = path.resolve(process.cwd(), filename);
    compileAndRun(filePath);
}

module.exports = compileAndRun;
