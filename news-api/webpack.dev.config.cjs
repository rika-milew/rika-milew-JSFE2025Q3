const path = require('path');

module.exports = {
    mode: 'development',

    devtool: 'source-map',

    devServer: {
        static: {
            directory: path.resolve(__dirname, './dist'),
        },
        compress: true,
        port: 3000,
        open: true,
        hot: true,
    }
};
