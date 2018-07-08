const path = require('path')
const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const config = require('./webpack.config')

module.exports = merge(config, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'prod.js'
    },
    optimization: {
        minimizer: [
          new UglifyJsPlugin()
        ]
    },
    devtool: false,
})