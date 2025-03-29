const BaseToken = require('./BaseToken');

class ReturnToken extends BaseToken {}
class IfToken extends BaseToken {}
class ElseToken extends BaseToken {}
class WhileToken extends BaseToken {}
class BreakToken extends BaseToken {}
class PrintToken extends BaseToken {}
class ThisToken extends BaseToken {}

module.exports = {
    ReturnToken,
    IfToken,
    ElseToken,
    WhileToken,
    BreakToken,
    PrintToken,
    ThisToken,
};
