const path = require('path');
const nodeExternals = require('webpack-node-externals');
const rootDir = (...args) => path.resolve(__dirname, ...args);

const includedModules = [
    'path-matcher',
];

module.exports = {
  entry: './src/index.js',
  target: 'node',
    externals: [ nodeExternals({
      whitelist: includedModules
    }) ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: rootDir('src'),
        exclude: {
          test: /node_modules/,
          exclude: includedModules,
        },
        use: 'babel-loader',
      },
    ],
  },
  output: {
    path: rootDir(),
    filename: 'index.js',
    libraryTarget: "umd"
  },
};
