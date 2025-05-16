const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require('fs');

const walkDir = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath, fileList);
    } else if (file.endsWith(".html")) {
      fileList.push(fullPath);
    }
  });

  return fileList;
};

const generateHtmlPlugins = () => {
  const pagesDir = path.resolve(__dirname, "src/pages");
  const htmlFiles = walkDir(pagesDir); // Получаем все html-файлы

  return htmlFiles.map(fullPath => {
    const relativePath = path.relative(pagesDir, fullPath); // относительный путь
    const filename = relativePath.replace(/\\/g, "/"); // кроссплатформенный

    const pageContent = fs.readFileSync(fullPath, "utf-8");

    console.log(filename);

    return new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/pages/shared/_layout.html"),
      filename: filename, // сохраняем структуру
      title: path.basename(filename, ".html"),
      bodyContent: pageContent // если используешь кастомный template
    });
  });
};

module.exports = {
  entry: './app/modules/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main_bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    ...generateHtmlPlugins(),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "/dict"),
    },
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/auction\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
          to: '/main/auction/detail.html'
        },
        { from: /^\/auth$/, to: "/auth/auth.html" },
        { from: /^\/productAdd$/, to: "/main/products/add.html" },
        { from: /^\/personal$/, to: "/main/user/personal.html" },
        { from: /^\/$/, to: "/main/index.html" }
      ]
    },
    compress: true,
    port: 9000,
    hot: true
  },
  mode: 'development'
}