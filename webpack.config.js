var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {path: __dirname, filename: 'bundle.js'},
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2016', 'react']
                }
            }
        ]
    },
    resolve: {
        alias: {
            handsontable: path.resolve(__dirname, 'node_modules/handsontable-pro')
        }
    },
};