const BaseToken = require('./BaseToken');

class VoidTypeToken extends BaseToken {}
class IntegerTypeToken extends BaseToken {}
class StringTypeToken extends BaseToken {}
class BooleanTypeToken extends BaseToken {}
class ClassNameTypeToken extends BaseToken {}

module.exports = {
    VoidTypeToken,
    IntegerTypeToken,
    StringTypeToken,
    BooleanTypeToken,
    ClassNameTypeToken,
};