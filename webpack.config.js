var path = require('path');
var webpack = require('webpack');

module.exports = {
  cache: true,
  entry: {
    teaching: path.resolve(__dirname, 'public', 'javascripts', 'teaching.js')
  },
  output: {
    path: path.join(__dirname, 'public', 'dist'),
    publicPath: 'dist/',
    filename: '[name]s.js'
  },
  module: {
    loaders: [
      // required to write 'require('./style.css')'
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      // required for bootstrap icons
      { test: /\.woff$/, loader: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff' },
      { test: /\.ttf$/, loader: 'file-loader?prefix=font/' },
      { test: /\.eot$/, loader: 'file-loader?prefix=font/' },
      { test: /\.svg$/, loader: 'file-loader?prefix=font/' }
    ]
  },
  resolve: {
    extensions: ['', '.js']
  },
  plugins: [

  ]
};