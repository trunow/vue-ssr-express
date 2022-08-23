const { defineConfig } = require('@vue/cli-service');
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
// })

// module.exports = {
	chainWebpack: (webpackConfig) => {
		// Необходимо отключать cache-loader, иначе в сборке для клиента
		// будут использоваться кэшированные компоненты из сборки для сервера
		webpackConfig.module.rule("vue").uses.delete("cache-loader");
		webpackConfig.module.rule("js").uses.delete("cache-loader");
		webpackConfig.module.rule("ts").uses.delete("cache-loader");
		webpackConfig.module.rule("tsx").uses.delete("cache-loader");

		if (!process.env.SSR) {
			// Определяем точку входа клиентской части приложения
			webpackConfig.entry("app").clear().add("./src/entry-client.js");
			return;
		}

		// Определяем точку входа серверной части приложения
		webpackConfig.entry("app").clear().add("./src/entry-server.js");

		// Это позволяет webpack обрабатывать динамические импорты в соответствии
		// с подходом в Node, а также указывает `vue-loader` выдавать
		// серверно-ориентированный код при компиляции компонентов Vue.
		webpackConfig.target("node");
		// Это указывает сборке для сервера использовать экспорты в стиле Node
		webpackConfig.output.libraryTarget("commonjs2");

		webpackConfig.plugin("manifest").use(new WebpackManifestPlugin({ fileName: "ssr-manifest.json" }));

		// https://webpack.js.org/configuration/externals/#function
		// https://github.com/liady/webpack-node-externals
		// Экстернализация зависимостей приложения. Это сделает сборку для сервера
		// гораздо быстрее и создаст более лёгкий файл итоговой сборки.

		// Не нужно экстернализировать зависимости, которые должны обрабатываться webpack.
		// Также следует внести в белый список зависимости, которые изменяют `global` (например, полифилы)
		webpackConfig.externals(nodeExternals({ allowlist: /\.(css|vue)$/ }));

		webpackConfig.optimization.splitChunks(false).minimize(false);

		webpackConfig.plugins.delete("preload");
		webpackConfig.plugins.delete("prefetch");
		webpackConfig.plugins.delete("progress");
		webpackConfig.plugins.delete("friendly-errors");

		webpackConfig.plugin("limit").use(
			new webpack.optimize.LimitChunkCountPlugin({
				maxChunks: 1,
			})
		);
	},
// };
});