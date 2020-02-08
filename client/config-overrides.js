const {
  override,
  babelInclude,
  addWebpackAlias,
  overrideDevServer,
  removeModuleScopePlugin,
} = require('customize-cra');
const path = require('path');

module.exports = {
  webpack: override(
    addWebpackAlias({
      '@server': path.resolve(__dirname, '../server'),
    }),
    babelInclude([path.resolve('src'), path.resolve('../server')]),
    removeModuleScopePlugin()
  ),
};
