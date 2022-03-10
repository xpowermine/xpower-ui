const filters = require('./filters/pug-filters');
const { Years } = require('./source/years');
const env = require('./env');
const pug = require('pug');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { resolve } = require('path');
const configuration = (options) => ({
    entry: {
        about: [
            './library/index.ts',
            './views/theme/theme.ts',
            './views/tooltips/tooltips.ts',
            './views/about/about.ts',
            './views/footer/footer.ts',
        ],
        error: [
            './library/index.ts',
            './views/theme/theme.ts',
            './views/tooltips/tooltips.ts',
            './views/error/error.ts',
            './views/footer/footer.ts',
        ],
        home: [
            './library/index.ts',
            './views/theme/theme.ts',
            './views/tooltips/tooltips.ts',
            './views/connector/connector.ts',
            './views/wallet/wallet.ts',
            './views/home/home.ts',
            './views/footer/footer.ts',
        ],
        migrate: [
            './library/index.ts',
            './views/theme/theme.ts',
            './views/tooltips/tooltips.ts',
            './views/connector/connector.ts',
            './views/migrate/index.ts',
            './views/footer/footer.ts',
        ],
        nfts: [
            './library/index.ts',
            './views/theme/theme.ts',
            './views/tooltips/tooltips.ts',
            './views/connector/connector.ts',
            './views/wallet/wallet.ts',
            './views/selector/selector.ts',
            './views/nfts/nfts.ts',
            './views/footer/footer.ts',
        ],
        staking: [
            './library/index.ts',
            './views/theme/theme.ts',
            './views/tooltips/tooltips.ts',
            './views/staking/staking.ts',
            './views/footer/footer.ts',
        ],
        worker: [
            './source/miner/scripts/worker.ts',
        ],
    },
    module: {
        rules: [{
            test: /\.tsx?$/i,
            use: 'ts-loader'
        }, {
            test: /\.js$/i,
            exclude: [/node_modules/i, /\.(min|umd)\.js$/i],
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    cacheDirectory: true
                }
            }
        }, {
            test: /\.(s[ac]ss|css)$/i,
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: 'css-loader'
            }, {
                loader: 'sass-loader'
            }]
        }]
    },
    plugins: [
        new (require('eslint-webpack-plugin'))({
            extensions: ['ts']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/migrate/index.pug', {
                ...env.default, filters, PAGE: 'migrate',
                TITLE: 'XPower: Migrate'
            }),
            filename: '../views/migrate/index.pig',
            minify: false, inject: 'body',
            chunks: ['migrate']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/home/home.pug', {
                ...env.default, filters, PAGE: 'home',
                TITLE: 'XPower'
            }),
            filename: '../views/home/home.pig',
            minify: false, inject: 'body',
            chunks: ['home']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/nfts/nfts.pug', {
                ...env.default, filters, PAGE: 'nfts',
                TITLE: 'XPower: NFTs',
                YEARS: Array.from(Years())
            }),
            filename: '../views/nfts/nfts.pig',
            minify: false, inject: 'body',
            chunks: ['nfts']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/staking/staking.pug', {
                ...env.default, filters, PAGE: 'staking',
                TITLE: 'XPower: Staking'
            }),
            filename: '../views/staking/staking.pig',
            minify: false, inject: 'body',
            chunks: ['staking']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/about/about.pug', {
                ...env.default, filters, PAGE: 'about',
                TITLE: 'XPower: About'
            }),
            filename: '../views/about/about.pig',
            minify: false, inject: 'body',
            chunks: ['about']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/error/error.pug', {
                ...env.default, filters, PAGE: 'error',
                TITLE: 'XPower: Error',
            }),
            filename: '../views/error/error.pig',
            minify: false, inject: 'body',
            chunks: ['error']
        }),
        new MiniCssExtractPlugin({
            filename: '../styles/[name].[contenthash:8].css'
        })
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        fallback: {
            buffer: false, fs: false, path: false
        }
    },
    output: {
        path: resolve(__dirname, 'public', 'scripts'),
        filename: '[name].[contenthash:8].js',
        clean: true
    },
    mode: 'none', ...options
});
module.exports = (env, args) => {
    switch (args.mode) {
        case 'none':
        case 'production':
        case 'development':
            return configuration({ mode: args.mode });
        default:
            throw new Error('no matching configuration');
    }
};
