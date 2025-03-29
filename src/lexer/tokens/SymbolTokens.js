const BaseToken = require("./BaseToken");

class LeftCurlyToken extends BaseToken {}
class RightCurlyToken extends BaseToken {}
class LeftParenToken extends BaseToken {}
class RightParenToken extends BaseToken {}
class DotToken extends BaseToken {}
class SemiColonToken extends BaseToken {}
class CommaToken extends BaseToken {}
class ColonToken extends BaseToken {}

module.exports = {
    LeftCurlyToken,
    RightCurlyToken,
    LeftParenToken,
    RightParenToken,
    DotToken,
    SemiColonToken,
    CommaToken,
    ColonToken,
};
