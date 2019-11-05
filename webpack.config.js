module.exports = {
    entry: ['./client/src/index.js'],
    output: {
      path: __dirname + '/public',
      filename: 'bundle.js',
    },
    mode: 'development',
    module: {
      rules: [
        {
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      ],
    },
  };
  