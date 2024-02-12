import { RepoConfigurationParser } from '../lib/repo_configuration_parser.js';

import { assert, suite, test } from '@pmoo/testy';

suite('Repo configuration parser', () => {
  test('it parses all variables starting with REPO_', () => {
    const env = {
      NOT_APPLICABLE: 'foo',
      REPO_ABC: '{"name":"repoABC","org":"myOrg","includeLabels":[],"excludeLabels":[]}',
      REPO_XYZ: '{"name":"repoXYZ","org":"myOrg","includeLabels":[],"excludeLabels":[]}',
    };
    const parsedConfigurations = RepoConfigurationParser.parseFrom(env);
    assert.that(parsedConfigurations).includesExactly(
      { name: 'repoABC', org: 'myOrg', includeLabels: [], excludeLabels: [] },
      { name: 'repoXYZ', org: 'myOrg', includeLabels: [], excludeLabels: [] },
    );
  });

  test('it raises an error if a REPO_ variable has a syntax error', () => {
    const env = {
      NOT_APPLICABLE: 'foo',
      REPO_ABC: '{"name":',
    };
    assert
      .that(() => RepoConfigurationParser.parseFrom(env))
      .raises(new Error(RepoConfigurationParser.errorMessageForVariableWithSyntaxErrors('REPO_ABC', '{"name":')));
  });

  test('it raises an error if a REPO_ variable can be parsed but it has missing fields', () => {
    const env = {
      NOT_APPLICABLE: 'foo',
      REPO_ABC: '{"name":"repoABC","includeLabels":[],"excludeLabels":[]}', // missing 'org'
    };
    assert
      .that(() => RepoConfigurationParser.parseFrom(env))
      .raises(new Error(RepoConfigurationParser.errorMessageForMissingConfigurationFields('REPO_ABC')));
  });
});
