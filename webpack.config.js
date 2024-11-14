const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

const port = 3000;
let publicUrl = `ws://localhost:${port}/ws`;
//only for gitpod
if(process.env.GITPOD_WORKSPACE_URL){
  const [schema, host] = process.env.GITPOD_WORKSPACE_URL.split('://');
  publicUrl = `wss://${port}-${host}/ws`;
}
//only for codespaces
if(process.env.CODESPACE_NAME){
  publicUrl = `wss://${process.env.CODESPACE_NAME}-${port}.app.github.dev/ws`;
}

module.exports = {
  entry: [
    './src/js/index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader: 'style-loader', // crea nodos de estilo a partir de cadenas JS
          },
          {
            loader: 'css-loader', // traduce CSS a CommonJS
          },
        ],
      }, // archivos CSS
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: { name: '[name].[ext]' },
        },
      }, // para imágenes
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        use: ['file-loader'],
      }, // para fuentes
      {
        test: /\.mp3$/, // Para archivos de audio MP3
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/audio/[name].[hash:8].[ext]', // El archivo de audio se moverá a la carpeta 'assets/audio'
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devtool: "source-map",
  devServer: {
    port,
    hot: true,
    allowedHosts: "all",
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    client: {
      webSocketURL: publicUrl
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new ESLintPlugin({
    //   files: path.resolve(__dirname, "src"),
    // }),
    new HtmlWebpackPlugin({
        favicon: 'imagen.ico',
        template: 'template.html'
    }),
  ]
};
