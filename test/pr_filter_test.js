import { PrFilter } from '../lib/pr_filter.js';

import { assert, suite, test } from '@pmoo/testy';

suite('PR filter', () => {
  const prWithNoLabels = () => ({ labels: [] });
  const prLabeled = (...labelNames) => ({ labels: labelNames.map(label => ({ name: label })) });

  test('includes a PR if no rules are specified', () => {
    const prRules = { includeLabels: [], excludeLabels: [] };
    assert.isTrue(PrFilter.valueFor(prRules, prWithNoLabels()));
  });

  test('does not include a PR if it does not have a required label', () => {
    const prRules = { includeLabels: ['required'], excludeLabels: [] };
    assert.isFalse(PrFilter.valueFor(prRules, prWithNoLabels()));
  });

  test('includes a PR if it has a required label', () => {
    const prRules = { includeLabels: ['required'], excludeLabels: [] };
    assert.isTrue(PrFilter.valueFor(prRules, prLabeled('required')));
  });

  test('does not include a PR if it does not contain all the required labels', () => {
    const prRules = { includeLabels: ['required one', 'required two'], excludeLabels: [] };
    assert.isFalse(PrFilter.valueFor(prRules, prLabeled('required one')));
  });

  test('includes a PR if it has all the required labels', () => {
    const prRules = { includeLabels: ['required one', 'required two'], excludeLabels: [] };
    assert.isTrue(PrFilter.valueFor(prRules, prLabeled('required one', 'required two')));
  });

  test('does not include a PR if it contains an explicitly excluded label', () => {
    const prRules = { includeLabels: [], excludeLabels: ['not interesting'] };
    assert.isFalse(PrFilter.valueFor(prRules, prLabeled('not interesting')));
  });

  test('includes a PR if it does not contain an explicitly excluded label', () => {
    const prRules = { includeLabels: [], excludeLabels: ['not interesting'] };
    assert.isTrue(PrFilter.valueFor(prRules, prWithNoLabels()));
  });

  test('does not include a PR if it contains at least one explicitly excluded label', () => {
    const prRules = { includeLabels: [], excludeLabels: ['not interesting one', 'not interesting two'] };
    assert.isFalse(PrFilter.valueFor(prRules, prLabeled('not interesting two')));
  });
});
