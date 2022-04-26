'use strict';

class RepoConfigurationParser {
  static parseFrom(env) {
    return new this(env).parse();
  }

  static errorMessageForVariableWithSyntaxErrors(envVar, value) {
    return `Error trying to parse ${envVar}=${value} as JSON. Make sure the syntax is correct.`;
  }

  static errorMessageForMissingConfigurationFields(envVar) {
    return `Error trying to use ${envVar}, it has missing fields. Make sure name, org, includeLabels and excludeLabels are set.`;
  }

  constructor(env) {
    this._env = env;
  }

  parse() {
    return Object.keys(this._env)
      .filter(envVar => envVar.startsWith('REPO_'))
      .map(envVar => this._parseRepoConfig(envVar));
  }

  _parseRepoConfig(envVar) {
    const value = this._env[envVar];
    try {
      const parsedConfig = JSON.parse(value);
      this._validateConfigIsComplete(parsedConfig, envVar);
      return parsedConfig;
    } catch (error) {
      if (error instanceof SyntaxError) {
        this._raiseParseError(envVar, value);
      } else {
        throw error;
      }
    }
  }

  _validateConfigIsComplete(parsedConfig, envVar) {
    if (!(parsedConfig.name && parsedConfig.org && parsedConfig.includeLabels && parsedConfig.excludeLabels)) {
      throw new Error(RepoConfigurationParser.errorMessageForMissingConfigurationFields(envVar));
    }
  }

  _raiseParseError(envVar, value) {
    throw new Error(RepoConfigurationParser.errorMessageForVariableWithSyntaxErrors(envVar, value));
  }
}

module.exports = RepoConfigurationParser;
