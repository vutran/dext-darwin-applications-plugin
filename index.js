const path = require('path');
const osApps = require('os-apps');
const fileIcon = require('file-icon');

/**
 * Returns true if the path matches the query
 *
 * @param {String} query
 * @param {String} filePath
 * @return {Boolean} Returns true if matched
 */
const isMatched = (query, filePath) => filePath.indexOf(query) > -1;

/**
 * Converts an application path to an item
 *
 * @param {String} filePath
 * @return {Promise} - Resolves to a Dext item schema
 */
const toItem = filePath => new Promise((resolve) => {
  const fileName = path.basename(filePath, path.extname(filePath));
  fileIcon(filePath, 128)
    .then((buffer) => {
      resolve({
        title: fileName,
        subtitle: filePath,
        arg: filePath,
        icon: {
          type: 'file',
          path: `data:image/png;base64,${buffer.toString('base64')}`,
        },
      });
    });
});

module.exports = {
  action: 'open',
  query: query => new Promise((resolve) => {
    const items = [];
    if (!query) {
      resolve({ items });
      return;
    }

    osApps.getAll()
      .then((apps) => {
        const q = query.toLowerCase();
        const itemPromises = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < apps.length; i++) {
          if (isMatched(q, apps[i].toLowerCase())) {
            itemPromises.push(toItem(apps[i]));
          }
        }
        Promise.all(itemPromises)
          .then(itemsResolved => resolve({ items: itemsResolved }));
      })
      .catch(() => resolve({ items }));
  }),
};
