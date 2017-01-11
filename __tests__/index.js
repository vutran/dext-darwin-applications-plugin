import m from '../';

jest.mock('fs');
jest.mock('mac-icons');

describe('apps', () => {
  beforeAll(() => {
    // mocks the platform
    Object.defineProperty(process, 'platform', {
      value: 'darwin',
    });
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    require('mac-icons').__setResolvedIconValue('FOOBAR');
  });

  it('should return something', async () => {
    require('fs').__setFiles([
      'Safari.app',
      'Google Chrome.app',
      'Firefox.app',
    ]);
    const results = await m.query('Safari');
    expect(results.items.length).toBe(1);
    expect(results.items).toContainEqual({
      title: 'Safari',
      subtitle: '/Applications/Safari.app',
      arg: '/Applications/Safari.app',
      icon: {
        path: 'FOOBAR',
      },
    });
    expect(results.items).not.toContainEqual({
      title: 'Google Chrome',
      subtitle: '/Applications/Google Chrome.app',
      arg: '/Applications/Google Chrome.app',
      icon: {
        path: 'FOOBAR',
      },
    });
  });

  it('should throw an error and return nothing', () => {
    require('fs').__setThrowError('FAKE_ERROR');
    m.query('?').catch((e) => expect(e).toEqual('FAKE_ERROR'));
  });

  it('should return nothing', async () => {
    require('fs').__setThrowError(null);
    const results = await m.query('');
    expect(results.items.length).not.toBeGreaterThan(0);
  });
});
