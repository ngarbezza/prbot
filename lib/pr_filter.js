'use strict';

export class PrFilter {
  static valueFor(prRules, prToEvaluate) {
    return new this(prRules).value(prToEvaluate);
  }

  constructor(prRules) {
    this._prRules = prRules;
  }

  value(prToEvaluate) {
    return this._hasAllTheRequiredLabels(prToEvaluate) && this._doesNotHaveAnExcludedLabel(prToEvaluate);
  }

  _hasAllTheRequiredLabels(prToEvaluate) {
    return this._prRules.includeLabels.every(requiredLabel =>
      this._isLabeled(prToEvaluate, requiredLabel),
    );
  }

  _doesNotHaveAnExcludedLabel(prToEvaluate) {
    return !this._prRules.excludeLabels.some(excludedLabel =>
      this._isLabeled(prToEvaluate, excludedLabel),
    );
  }

  _isLabeled(prToEvaluate, requiredLabel) {
    return prToEvaluate.labels.some(label => label.name === requiredLabel);
  }
}
