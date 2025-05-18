const BaseToken = require('./BaseToken');

class PlusToken extends BaseToken {
    constructor() {
        super('+');
    }
}

class MinusToken extends BaseToken {
    constructor() {
        super('-');
    }
}


class MultiplyToken extends BaseToken {
    constructor() {
        super('*');
    }
}

class DivideToken extends BaseToken {
    constructor() {
        super('/');
    }
}

class DecrementToken extends BaseToken {
    constructor() {
        super('--');
    }
}

class EqualsToken extends BaseToken {
    constructor() {
        super('==');
    }
}

class NotEqualsToken extends BaseToken {
    constructor() {
        super('!=');
    }
}

class GreaterThanEqualToken extends BaseToken {
    constructor() {
        super('>=');
    }
}

class GreaterThanToken extends BaseToken {
    constructor() {
        super('>');
    }
}

class LessThanEqualToken extends BaseToken {
    constructor() {
        super('<=');
    }
}

class LessThanToken extends BaseToken {
    constructor() {
        super('<');
    }
}

class AssignmentToken extends BaseToken {
    constructor() {
        super('=');
    }
}

class AndOrToken extends BaseToken {}

class NotToken extends BaseToken {
    constructor() {
        super('!');
    }
} 

class AndToken extends BaseToken {
    constructor() {
        super('&&');
    }
}

class OrToken extends BaseToken {
    constructor() {
        super('||');
    }
}

class IncrementToken extends BaseToken {
    constructor() {
        super('++');
    }
}

class ModuloToken extends BaseToken {
    constructor() {
        super('%');
    }
}

class QuestionMarkToken extends BaseToken {
    constructor() {
        super('?');
    }
}

class ColonToken extends BaseToken {
    constructor() {
        super(':');
    }
}

module.exports = {
    PlusToken,
    MinusToken,
    MultiplyToken,
    DivideToken,
    EqualsToken,
    NotEqualsToken,
    GreaterThanEqualToken,
    GreaterThanToken,
    LessThanEqualToken,
    LessThanToken,
    AssignmentToken,
    AndOrToken,
    ModuloToken,
    AndToken,
    OrToken,
    QuestionMarkToken,
    ColonToken,
    IncrementToken,
    DecrementToken,
    NotToken,
};