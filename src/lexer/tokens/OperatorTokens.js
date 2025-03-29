const BaseToken = require('./BaseToken');

class PlusToken extends BaseToken {}
class MinusToken extends BaseToken {}
class MultiplyToken extends BaseToken {}
class DivideToken extends BaseToken {}
class EqualsToken extends BaseToken {}
class NotEqualsToken extends BaseToken {}
class GreaterThanEqualToken extends BaseToken {}
class GreaterThanToken extends BaseToken {}
class LessThanEqualToken extends BaseToken {}
class LessThanToken extends BaseToken {}
class AssignmentToken extends BaseToken {}

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
};