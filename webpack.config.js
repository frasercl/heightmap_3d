const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: "development",
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [{
      test: /\.(frag|vert|glsl)$/,
      use: [
        {
          loader: 'shader-loader',
          options: {}
        }
      ]
    }]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    compress: true,
    port: 8000,
  }
};
