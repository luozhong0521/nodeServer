/**
 * desc: 获取预览图
 * User: luozhong
 * Date: 2017/6/7
 * Time: 19:31
 * email:luozhong0521@163.com
 */
const { getPreviewImgs, dealRequest } = require('../common/utils');
module.exports = function (app) {
    const urllib = require('url');
    app.get('/getPreviewImgs', function (req, res) {
        let params = urllib.parse(req.url, true);
        const path = req.query.path;
        getPreviewImgs(path).then((r) => {
            let result = {
                code: 0,
                message: "ok",
                data: r
            };
            dealRequest(res, result, {});
        });
    });
};