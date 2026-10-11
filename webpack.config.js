// webpack.config.js
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
    mode: "development",
    entry: {
        main: "./src/index.js"
        // second: "./src/second-script.js"
    },
    output: {
        filename: "./main.js",
        path: path.resolve(import.meta.dirname, "dist"),
        clean: true,
        publicPath: "",
    },
    devtool: "eval-source-map",
    devServer: {
        watchFiles: ["./src/index.html"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            // filename: 'index.html',
            // chunks: ['main'],
        }),
        // new HtmlWebpackPlugin({
        //     template: "./src/second-page.html",
        //     filename: 'second-page.html',
        //     chunks: ['second'],
        // }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            }
        ],
    },
};