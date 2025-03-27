const BaseToken = require("./BaseToken");

class AccessToken extends BaseToken {
  constructor(value) {
    super();
    this.value = value;
  }
}

class PublicToken extends AccessToken {
  constructor() {
    super("public");
  }
}

class PrivateToken extends AccessToken {
  constructor() {
    super("private");
  }
}

class ProtectedToken extends AccessToken {
  constructor() {
    super("protected");
  }
}

module.exports = {
  AccessToken,
  PublicToken,
  PrivateToken,
  ProtectedToken,
};