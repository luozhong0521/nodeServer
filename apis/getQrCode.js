/**
 * desc: 获取图片二维码
 * User: luozhong
 * Date: 2017/6/7
 * Time: 19:31
 * email:luozhong0521@163.com
 */
const qr = require('qr-image');
const { dealRequest } = require('../common/utils');
module.exports = function (app) {
    const urllib = require('url');
    app.get('/getQrCode', function (req, res) {
        let params = urllib.parse(req.url, true);
        const path = params.query.path;
        const qr_png = qr.image(path, { type: 'png',size : 6 });  
        imgName = `${imgName}.png`;  
        let result = {
            code: 0,
            message: "ok",
            data: qr_png,
        };
        dealRequest(res, result, {});
    });
};