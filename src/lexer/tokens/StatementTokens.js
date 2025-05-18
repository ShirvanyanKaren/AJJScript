const BaseToken = require('./BaseToken');

class ReturnToken extends BaseToken {}
class IfToken extends BaseToken {}
class ElseToken extends BaseToken {}
class WhileToken extends BaseToken {}
class BreakToken extends BaseToken {}
class PrintToken extends BaseToken {}
class ThisToken extends BaseToken {}
class ForToken extends BaseToken {
    constructor() {
        super();
        this.type = "ForToken";
    }

}

module.exports = {
    ReturnToken,
    IfToken,
    ElseToken,
    WhileToken,
    BreakToken,
    PrintToken,
    ThisToken,
    ForToken,
};
