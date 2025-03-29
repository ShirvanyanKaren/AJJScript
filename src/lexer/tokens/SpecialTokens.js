const BaseToken = require('./BaseToken');

class SuperToken extends BaseToken {}
class ClassToken extends BaseToken {}
class NewToken extends BaseToken {}
class MethodNameToken extends BaseToken {}
class ExtendToken extends BaseToken {}
class ConstructorToken extends BaseToken {}
class MethodToken extends BaseToken {}

module.exports = {
    SuperToken,
    ClassToken,
    NewToken,
    MethodNameToken,
    ExtendToken,
    ConstructorToken,
    MethodToken,
};