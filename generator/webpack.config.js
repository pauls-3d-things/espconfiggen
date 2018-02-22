const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: {
        configApp: ["./lib/IndexConfigApp.js"],
        generatorApp: ["./lib/IndexGeneratorApp.js"]
    }
    ,
    output: {
        path: __dirname,
        filename: "dist/[name].bundle.min.js"
    },
    devtool: "source-map",
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
        new UglifyJsPlugin()
    ]
};