const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const PROJECT_ROOT = path.resolve(__dirname, "./");
const PORT = process.env.PORT || 8080;

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const mode = isDev ? "development" : "production";

const optimization = () => {
	const config = {
		splitChunks: {
			chunks: "all",
		},
		minimize: isProd,
	};

	if (isProd) {
		config.minimizer = [new TerserWebpackPlugin()];
	}

	return config;
};

function plugins() {
	const plugins = [
		new webpack.ProvidePlugin({
			React: "react",
		}),
		new Dotenv({
			path: isDev ? "./.env.development" : "./.env", // load this now instead of the ones in '.env'
			systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
		}),
		new HtmlWebpackPlugin({
			template: path.join(PROJECT_ROOT, "public", "index.html"),
			inject: "body",
		}),
		new CleanWebpackPlugin(),
	];

	if (isDev) {
		plugins.push(new webpack.HotModuleReplacementPlugin());
	}

	if (isProd) {
		plugins.push(
			new MiniCssExtractPlugin({
				filename: "[name].[contenthash].css",
			})
		);
	}

	return plugins;
}

module.exports = {
	mode,
	entry: ["babel-polyfill", path.join(PROJECT_ROOT, "src", "index.js")],
	output: {
		path: path.join(PROJECT_ROOT, "build"),
		clean: true,
	},
	devtool: isDev ? "inline-source-map" : false,
	resolve: {
		extensions: ["", ".js", ".jsx"],
		alias: {
			"@store": path.join(PROJECT_ROOT, "src", "store"),
			"@services": path.join(PROJECT_ROOT, "src", "services"),
		},
		symlinks: false,
		cacheWithContext: false,
	},
	optimization: optimization(),
	devServer: {
		hot: true,
		port: PORT,
		historyApiFallback: true,
	},
	plugins: plugins(),
	module: {
		rules: [
			{
				test: /\.(html)$/,
				exclude: /node_modules/,
				use: ["html-loader"],
			},
			{
				test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
				type: isProd ? "asset" : "asset/resource",
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource",
			},
			{
				test: /\.(sc|c)ss$/i,
				use: [
					isDev ? "style-loader" : MiniCssExtractPlugin.loader,
					"css-loader",
					"postcss-loader",
					"sass-loader",
				],
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
		],
	},
};
