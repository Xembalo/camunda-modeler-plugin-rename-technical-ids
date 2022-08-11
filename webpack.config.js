const path = require('path');

const CamundaModelerWebpackPlugin = require('camunda-modeler-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'client.js'
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: 'react-svg-loader'
      }
    ]
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new CamundaModelerWebpackPlugin()
  ]
};
