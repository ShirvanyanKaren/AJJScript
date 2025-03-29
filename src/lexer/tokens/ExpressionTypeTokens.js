const BaseToken = require('./BaseToken');

class IntegerToken extends BaseToken {}
class TrueToken extends BaseToken {}
class FalseToken extends BaseToken {}
class StringToken extends BaseToken {}

module.exports = {
    IntegerToken,
    TrueToken,
    FalseToken,
    StringToken,
};