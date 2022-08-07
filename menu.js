/**
 * This script is used manually to crate/update official acct's menu
 */
const request = require('request');
const schedule = require('node-schedule');
const jssdk = require('./app/libs/jssdk');

request.debug = true;

const menuItems = {
    "button": [
        {
            "type": "click",
            "name": "Historical Questions",
            "key": "conversation-history"
        },
        {
            "type": "view",
            "name": "Random Pickup",
            "url": "http://8.210.121.79/wechat/random"
        }
    ]
};

doMenuSync();

// schedule.scheduleJob({second: 0, minute: 1}, () => {
//     console.log('about to sync menu items');
//     doMenuSync();
// });

// setInterval(() => {
//     console.log(new Date());
// }, 2000);

function doMenuSync() {
    jssdk.getAccessToken((err, token) => {
        if (err || !token) {
            return console.error('Retrieve access_token fail');
        }

        console.log({token});

        request.get(
            `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${token}`,
            (e, response, body) => {
                if (e) {
                    return console.error('Delete menu fail', e);
                }

                console.log('Delete menu succ', body);

                request.post(
                    { 
                        url: `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`, 
                        json: menuItems 
                    },
                    (_e,  _response, _body) => {
                        if (_e) {
                            return console.error('Create menu fail', _e);
                        }

                        console.log('Create menu succ', body);
                    }
                );
            }
        );
    })
}