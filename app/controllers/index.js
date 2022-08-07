const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const wechat = require('wechat');
const jssdk = require('../libs/jssdk');
const Article = mongoose.model('Article');

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

router.get('/conversation', handleWechatRequet);
router.post('/conversation', handleWechatRequet);

