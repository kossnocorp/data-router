const path = require('path')

const isTest = process.env.NODE_ENV == 'test'

module.exports = {
  devtool: isTest ? 'inline-source-map' : 'source-map',
  entry: isTest ?  {} : {
    'data_router': './index'
  },
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: '[name].js',
    library: 'dataRouter',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {test: /test\.js$/, loader: 'webpack-espower', exclude: /node_modules/},
      {test: /\.json$/, loader: 'json'}
    ]
  }
}
