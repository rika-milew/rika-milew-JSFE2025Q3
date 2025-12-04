const path = require('path');

module.exports = {
    mode: 'production',
    output: {
        publicPath: './', 
        filename: 'index.js',
        path: path.resolve(__dirname, './dist'),
    },
    optimization: {
        minimize: false, 
    },
    devtool: 'source-map',
};