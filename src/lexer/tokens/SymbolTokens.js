const BaseToken = require("./BaseToken");

class LeftCurlyToken extends BaseToken {
    constructor() {
        super("{");
    }
}
class RightCurlyToken extends BaseToken {
    constructor() {
        super("}");
    }
}
class LeftParenToken extends BaseToken {
    constructor() {
        super("(");
    }
}
class RightParenToken extends BaseToken {
    constructor() {
        super(")");
    }
}
class DotToken extends BaseToken {
    constructor() {
        super(".");
    }
}
class SemiColonToken extends BaseToken {
    constructor() {
        super(";");
    }
}
class CommaToken extends BaseToken {
    constructor() {
        super(",");
    }
}
class ColonToken extends BaseToken {
    constructor() {
        super(":");
    }
}
class LeftBracketToken extends BaseToken {
    constructor() {
        super("[");
    }
}
class RightBracketToken extends BaseToken {
    constructor() {
        super("]");
    }
}

module.exports = {
    LeftCurlyToken,
    RightCurlyToken,
    LeftParenToken,
    RightParenToken,
    DotToken,
    SemiColonToken,
    CommaToken,
    ColonToken,
    LeftBracketToken,
    RightBracketToken
};