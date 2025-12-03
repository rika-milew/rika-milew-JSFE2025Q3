const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const baseConfig = {
    entry: './src/index.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                MiniCssExtractPlugin.loader,
                  'css-loader'
                ],
            },
            {
                test: /\.ts$/i,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[folder]/[name][hash][ext]'
                }
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
    },
    plugins: [
        new ESLintPlugin({
            extensions: ['ts'],
            failOnError: false,
            emitWarning: true,
            exclude: ['**/*.css']
        }),
        new DotenvWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
         filename: 'styles/[name].[contenthash].css',
         }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/assets',
                    to: 'assets',
                    noErrorOnMissing: true
                }
            ]
         })
    ],
    devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath: '/', 
      watch: true,
    },
    compress: true,
    port: 3000,
    open: true,
    hot: true,
  },
};

module.exports = ({ mode }) => {
    const isProductionMode = mode === 'prod';
    const envConfig = isProductionMode
        ? require('./webpack.prod.config.cjs')
        : require('./webpack.dev.config.cjs');

    return merge(baseConfig, envConfig);
};