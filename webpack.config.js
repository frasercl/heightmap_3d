const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.(frag|vert|glsl)$/,
        use: 'shader-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: '/node_modules/'
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    compress: true,
    port: 8000,
  }
};
