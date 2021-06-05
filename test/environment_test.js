const Environment = require('../lib/environment');
const { suite, test, assert } = require('@pmoo/testy');

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
