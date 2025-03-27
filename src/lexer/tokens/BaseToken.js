class BaseToken {
    constructor(value = null) {
        this.value = value;
    }
    toString() {
        return `${this.constructor.name}(${typeof this.value})`;
    }
}
module.exports = BaseToken;