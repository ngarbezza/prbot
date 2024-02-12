import { Environment } from '../lib/environment.js';

import { assert, suite, test } from '@pmoo/testy';

suite('environment', () => {
  test('building it for production', () => {
    const env = Environment.named('production');
    assert.isTrue(env.isProduction());
    assert.isFalse(env.isDevelopment());
  });

  test('building it for development', () => {
    const env = Environment.named('development');
    assert.isTrue(env.isDevelopment());
    assert.isFalse(env.isProduction());
  });

  test('building it for an unsupported env name', () => {
    assert.that(() => Environment.named('unknown')).raises(/unsupported environment 'unknown'/);
  });
});
