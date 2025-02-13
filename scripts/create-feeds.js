const Feed = require('feed').Feed;
const { description } = require('../package.json');
const { getHelpers } = require('../lib/helpers');
const { writeFile } = require('fs').promises;
const { join } = require('path');
const { toSlug } = require('../lib/slug');

(async () => {
  const helpers = await getHelpers();
  try {
    const feed = new Feed({
      title: 'Tiny Helpers',
      description,
      id: 'https://toolunity-helper.vercel.app/',
      link: 'https://toolunity-helper.vercel.app/',
      language: 'en',
      image: 'http://example.com/image.png',
      favicon: 'https://toolunity-helper.vercel.app/favicon.ico',
      copyright: `All rights reserved ${new Date().getUTCFullYear()}, Stefan Judis`,
      generator: 'Feed for tiny-helpers.dev', // optional, default = 'Feed for Node.js'
      feedLinks: {
        atom: 'https://toolunity-helper.vercel.app/feed.atom',
        rss: 'https://toolunity-helper.vercel.app/feed.xml',
      },
      author: {
        name: 'Stefan Judis',
        email: 'stefanjudis@gmail.com',
        link: 'https://www.stefanjudis.com',
      },
    });

    helpers
      .sort((a, b) => (new Date(a.addedAt) < new Date(b.addedAt) ? 1 : -1))
      .forEach(({ addedAt, name, desc, url }) => {
        feed.addItem({
          title: `New helper added: ${name} – ${desc}.`,
          id: toSlug(name),
          link: url,
          description: desc,
          content: `More tools! 🎉🎉🎉 "${name}" is available at ${url}`,
          date: new Date(addedAt),
          image: `https://toolunity-helper.vercel.app/api/screenshot/?url=${url}`,
        });
      });

    console.log('Writing rss feed');
    writeFile(join('.', 'static', 'feed.xml'), feed.rss2());
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
