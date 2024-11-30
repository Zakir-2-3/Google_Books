const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production"; // Определяем, продакшн или разработка

  return {
    mode: isProduction ? "production" : "development",
    entry: "./src/js/index.js",
    output: {
      filename: "js/[name].bundle.js",
      path: path.resolve(__dirname, "build"),
      clean: true, // Очищает папку сборки перед каждой сборкой
    },
    devtool: isProduction ? false : "source-map", // Оригинальный source-map только в development
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader, // Извлекает CSS в отдельный файл
            "css-loader",
            "sass-loader", // Компилирует SCSS в CSS
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: "asset/resource", // Для оптимизации изображений
          generator: {
            filename: "images/[name][ext]",
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(), // Очищает папку build
      new MiniCssExtractPlugin({
        filename: "css/[name].css", // Имя итогового CSS файла
      }),
      new HtmlWebpackPlugin({
        template: "./src/index.html", // Подключает HTML файл
        filename: isProduction
        ? path.resolve(__dirname, "index.html") // Для продакшна — в корень
        : "index.html", // Для разработки — остаётся в памяти dev-сервера
      }),
    ],
    devServer: {
      static: "./src", // Папка для dev-сервера
      open: true, // Автоматически открывает браузер
      compress: true, // Включает сжатие
      port: 9000, // Порт для dev-сервера
      client: {
        logging: "warn", // Уровень логирования: 'none', 'error', 'warn', 'info', 'log', 'verbose'
      },
    },
    resolve: {
      extensions: [".js", ".scss"],
    },
  };
};
