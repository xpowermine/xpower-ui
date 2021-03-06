const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');
const pug = require('pug');

const filters = require('./filters/pug-filters');
const { Years } = require('./source/years');
const YEARS = Array.from(Years());
const env = require('./env');

const configuration = ({
    mode, ...options
}) => ({
    entry: {
        about: [
            './library/index.ts',
            './views/theme/theme.ts',
            './views/tooltips/tooltips.ts',
            './views/about/about.ts',
            './views/header/header.tsx',
            './views/footer/footer.tsx',
        ],
        error: [
            './library/index.ts',
            './views/theme/theme.ts',
            './views/tooltips/tooltips.ts',
            './views/error/error.ts',
            './views/header/header.tsx',
            './views/footer/footer.tsx',
        ],
        home: [
            './library/index.ts',
            './views/theme/theme.ts',
            './views/tooltips/tooltips.ts',
            './views/location/location.ts',
            './views/home/home.tsx',
        ],
        migrate: [
            './library/index.ts',
            './views/theme/theme.ts',
            './views/tooltips/tooltips.ts',
            './views/migrate/index.ts',
            './views/header/header.tsx',
            './views/footer/footer.tsx',
            './views/connector/connector.tsx',
        ],
        nfts: [
            './library/index.ts',
            './views/theme/theme.ts',
            './views/tooltips/tooltips.ts',
            './views/wallet/wallet-ui.tsx',
            './views/selector/selector.tsx',
            './views/location/location.ts',
            './views/nfts/nfts.ts',
            './views/header/header.tsx',
            './views/footer/footer.tsx',
            './views/connector/connector.tsx',
        ],
        staking: [
            './library/index.ts',
            './views/theme/theme.ts',
            './views/tooltips/tooltips.ts',
            './views/wallet/wallet-ui.tsx',
            './views/selector/selector.tsx',
            './views/location/location.ts',
            './views/staking/staking.ts',
            './views/header/header.tsx',
            './views/footer/footer.tsx',
            './views/connector/connector.tsx',
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
            test: /\.jsx?$/i,
            exclude: [/node_modules/i, /\.(min|umd)\.js$/i],
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-react',
                        '@babel/preset-env'
                    ],
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
            extensions: ['ts', 'tsx']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/migrate/index.pug', {
                DESCRIPTION: 'Upgrade old XPower tokens to v4',
                PAGE: 'migrate', TITLE: 'XPower: Migrate',
                ...env.default, filters, mode
            }),
            filename: '../views/migrate/index.pig',
            minify: false, inject: 'body',
            chunks: ['migrate']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/home/home.pug', {
                DESCRIPTION: 'Mine & Mint Proof-of-Work Tokens on Avalanche',
                PAGE: 'home', TITLE: 'XPower',
                ...env.default, filters, mode
            }),
            filename: '../views/home/home.pig',
            minify: false, inject: 'body',
            chunks: ['home']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/nfts/nfts.pug', {
                DESCRIPTION: 'Mint stakeable XPower NFTs on Avalanche',
                PAGE: 'nfts', TITLE: 'XPower: NFTs', YEARS,
                ...env.default, filters, mode
            }),
            filename: '../views/nfts/nfts.pig',
            minify: false, inject: 'body',
            chunks: ['nfts']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/staking/staking.pug', {
                DESCRIPTION: 'Stake minted XPower NFTs on Avalanche',
                PAGE: 'staking', TITLE: 'XPower: NFT Staking', YEARS,
                ...env.default, filters, mode
            }),
            filename: '../views/staking/staking.pig',
            minify: false, inject: 'body',
            chunks: ['staking']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/about/about.pug', {
                DESCRIPTION: 'Mine & Mint Proof-of-Work Tokens on Avalanche',
                PAGE: 'about', TITLE: 'XPower: About',
                ...env.default, filters, mode
            }),
            filename: '../views/about/about.pig',
            minify: false, inject: 'body',
            chunks: ['about']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/error/error.pug', {
                DESCRIPTION: 'Oops, something bad happened!',
                PAGE: 'error', TITLE: 'XPower: Error',
                ...env.default, filters, mode
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
    mode, ...options
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
