const PRODUCTION_ENV_NAME = 'production';
const DEVELOPMENT_ENV_NAME = 'development';
const ALLOWED_ENVIRONMENTS = [PRODUCTION_ENV_NAME, DEVELOPMENT_ENV_NAME];

class Environment {
  static named(environmentName) {
    this._assertEnvironmentNameIsSupported(environmentName);

    return new this(environmentName);
  }

  static _assertEnvironmentNameIsSupported(environmentName) {
    if (!ALLOWED_ENVIRONMENTS.includes(environmentName)) {
      throw new Error(`unsupported environment '${environmentName}'`);
    }
  }

  constructor(environmentName) {
    this._requestedEnv = environmentName;
  }

  isProduction() {
    return this._requestedEnv === PRODUCTION_ENV_NAME;
  }

  isDevelopment() {
    return this._requestedEnv === DEVELOPMENT_ENV_NAME;
  }
}

module.exports = Environment;
