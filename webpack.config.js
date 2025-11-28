const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isWebComponent = env && env.target === 'wc';

  return {
    entry: isWebComponent
      ? './src/web-component.ts'
      : './src/main.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'weather-widget.js',
      clean: true,
      library: isWebComponent ? {
        type: 'umd'
      } : undefined
    },
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'vue': 'vue/dist/vue.esm-bundler.js'
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              isCustomElement: (tag) => tag === 'weather-widget'
            }
          }
        },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            transpileOnly: true
          },
          exclude: /node_modules/
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                api: 'modern',
                sassOptions: {
                  silenceDeprecations: ['import', 'global-builtin']
                }
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      ...(!isWebComponent ? [
        new HtmlWebpackPlugin({
          template: './public/index.html'
        })
      ] : [])
    ],
    devServer: {
      static: './dist',
      hot: true,
      port: 3000
    },
    devtool: isProduction ? false : 'source-map'
  };
};
