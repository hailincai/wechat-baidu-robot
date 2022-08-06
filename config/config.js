const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'wechat-baidu-robot'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/wechat-baidu-robot-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'wechat-baidu-robot'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/wechat-baidu-robot-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'wechat-baidu-robot'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/wechat-baidu-robot-production'
  }
};

module.exports = config[env];
