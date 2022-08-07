const { doesNotMatch } = require('assert');
const crypto = require('crypto');
const debug = require('debug')('jswechat:jssdk')
const fs = require('fs')
const request = require('request');

function JSSDK(appId, appSecret) {
    this.appId = appId;
    this.appSecret = appSecret;
}

JSSDK.prototype.getSignPackage = function (url, done) {
    this.getJsApiTicket((err, jsApiTicket) => {
        if (err) {
            return done(err, null);
        }

        const timestamp = Math.round(Date.now() / 1000);
        const nonceStr = this.createNonceStr();
    
        const stringForSign = `jsapi_ticket=${jsApiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
        const hash = crypto.createHash('sha1');
        const sign = hash.update(stringForSign).digest('hex');
        
        return done(null, {
            appId: this.appId,
            nonceStr: nonceStr,
            timestamp: timestamp,
            url: url,
            signature: sign,
            rawString: stringForSign
        })
    });
}

JSSDK.prototype.getJsApiTicket = function(done) {
    debug('getJsApiTicket.done:', done);
    const cacheFile = '.jsapsticket.json';
    const time = Math.round(Date.now() / 1000);
    const instance = this;
    const data = instance.readCacheFile(cacheFile);

    if (data.expireTime < time) {
        // jsapiticket already expired
        instance.getAccessToken(function(error, accessToken) {
            if (error) {
                debug('getJsApiTicket.getAccessToken.error:', error);
                return done(error, null);
            }

            const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=${accessToken}`;
            request.get(url, function(err, res, body) {
                if (err) {
                    debug('getJsApiTicket.request.error:', err, url);
                    return done(err, null);
                }

                debug('getJsApiTicket.request.body:', body);

                try {
                    const data = JSON.parse(body);
                    instance.writeCacheFile(cacheFile, {
                        expireTime: Math.round(Data.now() / 1000 + 7200),
                        jsApiTicket: data.ticket
                    });
                    done(null, data.ticket);
                }catch(e) {
                    debug('getJsApiTicket.request.parse.error:', err, url);
                    done(e, null);
                }
            })
        })
    }else {
        done(null, data.jsApiTicket);
    }
}

JSSDK.prototype.createNonceStr = function() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = chars.length;
    let str = "";
    for (let i = 0; i < length; i++) {
      const start = Math.round(Math.random() * length);
      str += chars.substring(start, start + 1);
    }
    return str;
}

JSSDK.prototype.getAccessToken = function(done) {
    const cacheFile = 'accesstoken.json';
    const instance = this;
    const timestamp = Math.round(Date.now() / 1000);

    const data = instance.readCacheFile(cacheFile);
    if (!data.expireTime || data.expireTime < timestamp) {
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${instance.appId}&secret=${instance.appSecret}`;
        debug('getAccessToken.request.url:', url);

        request.get(url, function(err, res, body) {
            if (err) {
                debug('getAccessToke.request.err:', err, body);
                return done(err, null);
            }

            debug('getAccessToken.request.body:', body);
            const data = JSON.parse(body);
            if (!data.access_token) {
                debug('getAccessToken.request.wrong.body:', body);
                return done(new Error('getAccessToken return wrong json'), null);
            }

            instance.writeCacheFile(cacheFile, {
                expireTime: Math.round(Date.now() / 1000) + 7200,
                accessToken: data.access_token
            });

            done(null, data.access_token);
        })
    }else{
        done(null, data.accessToken)
    }
}

JSSDK.prototype.readCacheFile = function(filename) {
    try {
        return JSON.parse(fs.readFileSync(filename));
    }catch(e) {
        debug('read file %s failed: %s', filename, e)
    }

    return {};
}

JSSDK.prototype.writeCacheFile = function(filename, data) {
    return fs.writeFileSync(filename, JSON.stringify(data));
}

const testOfficialAcctAppId = 'wxf21cb0ae67a525ad';
const testOfficialAcctAppSecret = '8d63d1be57b3aa07bdc0d9e2dc2d855d';
const jssdk = new JSSDK(testOfficialAcctAppId, testOfficialAcctAppSecret);
module.exports = jssdk
debug(jssdk.getSignPackage("/test", (err, data) => {
    console.log(err, JSON.stringify(data));
}))
// debug(sdk.getAccessToken((err, accessToken) => {
//     console.log(accessToken);
// }))