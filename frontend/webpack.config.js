const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const DotenvPlugin = require('dotenv-webpack');


const APP_ROOT = process.env.APP_ROOT ?? '..';
const IS_PRODUCTION = process.env.NODE_ENV == 'production';
const MODE = process.env.MODE;


const dotenv = require('dotenv');
const dotenvConfigPath = path.join(`${APP_ROOT}/.env.${process.env.NODE_ENV}`);
const dotenvLocalConfigPath = path.join(`${APP_ROOT}/.env.${process.env.NODE_ENV}.local`);
const env = {
    ...dotenv.config({ path: dotenvConfigPath }).parsed,
    ...dotenv.config({ path: dotenvLocalConfigPath }).parsed
};


const stylesHandler = IS_PRODUCTION ? MiniCssExtractPlugin.loader : 'style-loader';

const config = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'static/[name].[contenthash].js',
        clean: true
    },
    devServer: {
        open: true,
        host: env.CLIENT_HOST,
        port: env.CLIENT_PORT
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html'
        }),
        new DotenvPlugin({
            path: dotenvConfigPath,
        }),
        new DotenvPlugin({
            path: dotenvLocalConfigPath
        }),
        new webpack.DefinePlugin({
            'process.env.API_URL': JSON.stringify(
                env.API_URL ??
                `http://${env.API_HOST}${env.API_PORT.length ? ':' + env.API_PORT : ''}${env.API_URL_PREFIX}/`
            )
        })
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all'
                }
            }
        }
    }
};

if (MODE === 'bundle-analyzer') {
    config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = () => {
    if (IS_PRODUCTION) {
        config.mode = 'production';

        config.plugins.push(new MiniCssExtractPlugin({
            filename: 'styles/[name].[contenthash].css'
        }));


        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        }));
    } else {
        config.mode = 'development';
    }

    return config;
};
