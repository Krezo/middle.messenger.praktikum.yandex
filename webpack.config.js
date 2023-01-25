const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { webpack, ProvidePlugin } = require('webpack')

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: { node: 'current' } }],
                // '@babel/preset-react',
                // '@babel/preset-typescript',
              ],
              plugins: [
                [
                  '@babel/plugin-transform-react-jsx',
                  {
                    pragma: 'h',
                    runtime: 'classic', // defaults to classic
                  },
                ],
              ],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      // изображения
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      // шрифты и SVG
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
    ],
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new ProvidePlugin({
      h: [path.resolve(path.join(__dirname, 'src/modules/h')), 'default'],
    }),
  ],
}
