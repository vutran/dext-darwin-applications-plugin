let iconValue = '';

/**
 * Resolves the mocked icon value
 *
 * @param {String} path
 * @param {Number} size
 * @param {Promise<Buffer>}
 */
const fileIcon = (path, size) => Promise.resolve(Buffer.from(iconValue));

/**
 * Sets the mock icon value
 *
 * @param {String} val
 */
fileIcon.__setIconValue = (val) => {
  iconValue = val;
};

module.exports = fileIcon;
