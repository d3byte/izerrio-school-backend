const path = require('path')
const webpack = require('webpack')
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
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })  
    ],
    devtool: false,
})