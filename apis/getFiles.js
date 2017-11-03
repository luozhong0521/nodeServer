/**
 * desc: 获取文件夹内容
 * User: luozhong
 * Date: 2017/6/7
 * Time: 19:31
 * email:luozhong0521@163.com
 */
const { getFiles, dealRequest } = require('../common/utils');
module.exports = function (app) {
    const urllib = require('url');
    app.post('/getFiles', function (req, res) {
        let params = urllib.parse(req.url, true);
        const path = params.query.path;
        getFiles(path).then((r) => {
            let result = {
                code: 0,
                message: "ok",
                data: r
            };
            dealRequest(res, result, {});
        });
    });
};