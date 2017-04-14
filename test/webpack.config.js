/**
 * Created by folgerfan on 2017/2/23.
 */
var path = require('path');
var webpack=require('webpack');
var compileDist = path.resolve(__dirname, 'dist');
module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './index.js',
    module:{
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    cacheDirectory: true,
                    presets: ['es2015']
                }
            },
            {
                test:/\.css$/,
                loader:'style-loader!css-loader'
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192'
            },
            {
                test:/\.html?$/,
                loader:'raw-loader'
            },
            {
                test:/\.handlebars$/,
                loader:'handlebars-loader'
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        },
        extensions: ['.js', '.vue', '.json']
    },
    output: {
        path: compileDist,
        filename: "entry.bundle.js",
        chunkFilename: 'c.[name].[hash].js',
        // publicPath: `http://static.yk.qq.com/${config.cdnDist}/`,//运营平台文件不放cdn
        publicPath:'/bikan/dist/',
        pathinfo: true
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        pup
    ],
    //pro cheap-module-source-map
    devtool: 'source-map'
};