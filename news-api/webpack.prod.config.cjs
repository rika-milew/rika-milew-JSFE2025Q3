const path = require('path');

module.exports = {
    mode: 'production',
    output: {
        publicPath: '/news-api/', 
        filename: 'index.js',
        path: path.resolve(__dirname, './dist'),
    },
    optimization: {
        minimize: false, 
    },
    devtool: 'source-map',
};