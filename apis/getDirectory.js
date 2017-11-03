/**
 * desc: 根据path查找当前目录下的所有文件，参数为空查找主目录，生成目录树
 * User: luozhong
 * Date: 2017/6/7
 * Time: 19:31
 * email:luozhong0521@163.com
 */
const { getFileName, dealRequest } = require('../common/utils');
module.exports = function (app) {
    const urllib = require('url');
    app.get('/getDirectory', function (req, res) {
        const params = urllib.parse(req.url, true);
        const query = params.query;
        getFileName(query.path).then((r) => {
            const result = {
                code: 0,
                message: "ok",
                data: r
            };
            dealRequest(res, result, params);
        });
    });
};