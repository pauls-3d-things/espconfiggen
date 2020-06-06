var path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var entries = {};

if (process.env.NODE_ENV == "production") {
    entries.configApp = ["./src/IndexConfigApp.tsx"];
}
entries.generatorApp = ["./src/IndexGeneratorApp.tsx"];

module.exports = {
    entry: entries,
    module: {
        rules: [
            {
                test: /.tsx?$/,
                loaders: ['ts-loader'],
                exclude: /node_modules/,
                include: /src/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader",],
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].bundle.min.js"
    },
    devtool: "eval",
    devServer: {
        contentBase: "dist/",
        port: 8081,
        // proxy: {
        //     '/api': {
        //         target: 'http://localhost:8080/api/',
        //         secure: false
        //     }
        // }
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            tslint: true,
            checkSyntacticErrors: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'node_modules/monaco-editor/min/vs',
                    to: 'vs',
                }
            ]
        })
    ]
};