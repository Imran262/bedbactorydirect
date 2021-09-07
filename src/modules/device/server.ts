import { serverHooks } from '@vue-storefront/core/server/hooks';
import config from 'config';
import deviceLibrary from './logic';

serverHooks.beforeBuildCacheKey(({ req, site }) => {
  const tests = deviceLibrary(req.headers['user-agent'], config.device.tests);
  let device = 'unknown';
  if (tests.isDesktop) {
    device = 'desktop';
  } else if (!tests.isDesktop && tests.isDesktopOrTablet) {
    device = 'tablet';
  } else if (tests.isMobile) {
    device = 'mobile';
  }
  return `page:${device}:${site}:${req.url}`;
})
