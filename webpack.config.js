/*
 * @desc 使用webpack-dev-server时用的配置文件
 */
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var autoprefixer = require('autoprefixer');

var globalSystemOptions = {
};

var addCookies = function() {
  document.cookie = "userid=orm2kwUP8LYuQomQYgeQAllLgz3E;"
};

module.exports = {
  entry: {
    'app': './src/app-entry.jsx',
    'vendor': [
      'react',
      'react-dom',
      // 项目使用redux的话打开下面的注释
      // 'redux',
      // 'react-redux',
      // 'redux-thunk',
      'react-router',
    ]
  },
  devServer: {
    // 需要使用代理服务的时候，打开下面的注释，并根据api路径进行设置
    proxy: {
      '/stats/mediaPlayStat/*': {
        target: 'http://47.94.228.176:7201',
        host: '47.94.228.176:7201',
        secure: false,
        changeOrigin: true
      },
      '/op/pms/stats/*': {
        target: 'http://172.17.96.6:8152',
        host: '172.17.96.6:8152',
        secure: false,
        changeOrigin: true
      },
      '/op/base/*': {
        target: 'http://172.17.96.6:8501',
        host: '172.17.96.6:8501',
        secure: false,
        changeOrigin: true
      },
      '/op/*': {
        target: 'http://172.17.96.4:8500',
        host: '172.17.96.4:8500',
        secure: false,
        changeOrigin: true
      },
      // '/op/ui/param/*': { // 公告信息
      //   target: 'http://172.17.96.4:8111',
      //   host: '172.17.96.4:8111',
      //   secure: false,
      //   changeOrigin: true
      // },
      // '/op/system/*': { // 登录管理，组织管理，角色管理，商户管理，用户管理
      //   target: 'http://192.168.16.115:8400',
      //   host: '192.168.16.115',
      //   secure: false,
      //   changeOrigin: true
      // },
      // '/op/area/*': { // 地区管理
      //   target: 'http://192.168.16.115:8400',
      //   host: '192.168.16.115',
      //   secure: false,
      //   changeOrigin: true
      // },
      // '/op/app/*': { // 应用，统计，升级策略，策略详情，
      //   target: 'http://192.168.16.115:8401',
      //   host: '192.168.16.115',
      //   secure: false,
      //   changeOrigin: true
      // },
      // '/op/category/*': { // 分类管理
      //   target: 'http://192.168.16.115:8501',
      //   host: '192.168.16.115',
      //   secure: false,
      //   changeOrigin: true
      // },
      // '/op/cibn/*': { // cibn媒资管理
      //   target: 'http://192.168.16.115:8501',
      //   host: '192.168.16.115',
      //   secure: false,
      //   changeOrigin: true
      // },
      // '/op/homepage/*': { // 首页管理
      //   target: 'http://192.168.16.115:8501',
      //   host: '192.168.16.115',
      //   secure: false,
      //   changeOrigin: true
      // },
      // '/op/node/*': { // 节点管理，预下载媒资
      //   target: 'http://192.168.16.115:8402',
      //   host: '192.168.16.115',
      //   secure: false,
      //   changeOrigin: true
      // },
      // '/op/price/*': { // 价格策略
      //   target: 'http://192.168.16.115:8501',
      //   host: '192.168.16.115',
      //   secure: false,
      //   changeOrigin: true
      // },
      // '/op/media/*': { // 媒资管理
      //   target: 'http://192.168.16.115:8501',
      //   host: '192.168.16.115',
      //   secure: false,
      //   changeOrigin: true
      // },
      // '/op/subject/*': { // 专题管理
      //   target: 'http://192.168.16.115:8501',
      //   host: '192.168.16.115',
      //   secure: false,
      //   changeOrigin: true
      // },
      // '/op/message/*': { // 信息发布
      //   target: 'http://192.168.16.115:8501',
      //   host: '192.168.16.115',
      //   secure: false,
      //   changeOrigin: true
      // },
    }
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, 'public'),
    // 使用webpack-dev-server的话需要设置该选项
    publicPath: '',
    filename: '[name].js'
  },
  module: {
    preLoaders: [
      // 语法检查
      {
        test: /(\.jsx|\.js)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
    ],
    loaders: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
    }, {
      test: /(\.jsx|\.js)$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react', 'stage-0']
      }
    }, {
      test: /\.(gif|png|jpg|jpeg)$/,
      // 小于10K的图片将会被编码成base64
      loader: "url-loader?limit=10240&name=images/[name].[ext]"
    }],
  },
  postcss: function () {
    return [autoprefixer({
      browsers: ['ios >= 5.0']
    })];
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"deployment"'
      }
    }),
    new ExtractTextPlugin("[name].css"),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'init']
    }),
    new CopyWebpackPlugin([
      {
        from: './src/third',
        to: 'third'
      }
    ]),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunksSortMode: 'dependency',
      // globalSystemOptions: JSON.stringify(globalSystemOptions),
      staticPath: '.',
      payApiHost: '',
      // cookies: '(' + addCookies.toString() + ')()',
    })
  ]
};
