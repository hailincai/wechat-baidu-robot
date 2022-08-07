const { request } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const wechat = require('wechat');
const jssdk = require('../libs/jssdk');
const User = mongoose.model('User');

mongoose.Promise = require('bluebird');

// const baseUrl = 'http://8.210.121.79';

module.exports = (app) => {
  app.use('/wechat', router);
};

router.get('/hello', (req, res, next) => {
    console.log(req.headers);
    const url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
    jssdk.getSignPackage(`${url}`, (err, signPackage) => {
        if (err) {
          return next(err);
        }
    
        // console.log(JSON.stringify(signPackage));
    
        res.render('index', { 
          title: 'Hello wechat from ECS --> Express',
          signPackage: signPackage,
          pretty: true
        });
    }); 
});

const config = {
    appid: 'wx3866dd6ba4392c5d',
    token: 'micropower'
};

const handleWechatRequet = wechat(config, function(req, res, next) {
    const message = req.weixin;
    console.log(message);

    res.reply('hello');
});

const handleUserSync = function(req, res, next) {
  if (!req.query.openid) {
    next();
  }

  const openid = req.query.openid;
  User.findOne({openid}).exec((err, user) => {
    if (err) {
      return next(err);
    }

    if (user) {
      console.log(`use existing user: ${openid}`);
      req.user = user;
      return next();
    }

    const newUser = new User({
      openid,
      createAt: new Date(),
      conversationCount: 0
    });

    console.log(`create new user: ${openid}`);
    newUser.save((e, u) => {
      if (e) {
        return next(e);
      }

      req.user = u;
      next();
    })
  })
}

router.get('/conversation', handleWechatRequet);
router.post('/conversation', handleUserSync, handleWechatRequet);

