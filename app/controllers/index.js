const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const wechat = require('wechat');
const Article = mongoose.model('Article');

module.exports = (app) => {
  app.use('/wechat', router);
};

router.get('/hello', (req, res, next) => {
  Article.find((err, articles) => {
    if (err) return next(err);
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
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

