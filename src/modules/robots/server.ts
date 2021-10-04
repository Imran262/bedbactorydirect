import { serverHooks } from '@vue-storefront/core/server/hooks'

serverHooks.afterApplicationInitialized(({ app }) => {
  app.get('/robots.txt', (req, res) => {
    res.end('User-agent: *\n' +
      'Disallow: /admin/\n' +
      'Disallow: /app/\n' +
      'Disallow: /checkout/\n' +
      'Disallow: /contacts/\n' +
      'Disallow: /customer/\n' +
      'Disallow: /dev/\n' +
      'Disallow: /doc/\n' +
      'Disallow: /docs/\n' +
      'Disallow: /downloader/\n' +
      'Disallow: /error_log\n' +
      'Disallow: /errors/\n' +
      'Disallow: /includes/\n' +
      'Disallow: /madmin/\n' +
      'Disallow: /madmin/\n' +
      'Disallow: /review/\n' +
      'Disallow: /sendfriend/\n' +
      'Disallow: /shell/\n' +
      'Disallow: /tag/\n' +
      'Disallow: /wishlist/\n' +
      'Disallow: /*.git$\n' +
      'Disallow: /*.idea$\n' +
      'Disallow: /*.sql$\n' +
      'Disallow: /*.tgz$\n' +
      'Disallow: /*.gz$\n' +
      'Disallow: /*.sh$\n' +
      'Disallow: /?dir\n' +
      'Disallow: /*?limit=all\n' +
      'Disallow: /?mode\n' +
      'Disallow: /*.php$\n' +
      'Disallow: /rde_server/\n' +
      'Disallow: /pfullscreen/\n' +
      'Disallow: /elasticsearch/\n' +
      'Disallow: /tracker.php\n' +
      'Disallow: /js/phoenix/seo/\n' +
      'Disallow: /pinquiry/\n' +
      'Disallow: /catalogsearch/\n' +
      'Sitemap: https://www.bedfactorydirect.co.uk/sitemap/sitemap.xml')
  })
})
