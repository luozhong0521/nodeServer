/**
 * desc: 下载静态资源
 * User: luozhong
 * Date: 2017/9/5
 * Time: 19:31
 * email:luozhong0521@163.com
 */
const fs = require('fs');
const urllib = require('url');
const gitCode = require('../common/gitCode');
const exec = require('child_process').exec;
const { dealRequest, getOrigin } = require('../common/utils');
const basePath = './public/uiFiles/UIManagement/';

function execFun(ter) {
    return new Promise((resolve, reject) => {
        exec(ter, function(error, trmSuc, trmErr) {
            if(error) {
                reject(error);
            }
            resolve(trmSuc);
        });
    });
}

module.exports = function (app) {
    app.get('/downloadSrc', function (req, res) {
        let params = urllib.parse(req.url, true);
        const path = `${basePath}${params.query.path}/assets`;
        const outPath = `${basePath}${params.query.path}/assets.zip`;
        function zipFile() {
            execFun(`cd ${basePath}${params.query.path} && zip -r -D assets.zip assets`).then((r) => {
                if (fs.existsSync(outPath)) {
                    const p = outPath.replace('./public', getOrigin());
                    let result = {
                        code: 0,
                        message: "ok",
                        data: p
                    };
                    dealRequest(res, result, {});
                }
            });
        }
        if (fs.existsSync(path)) { // 如果存在assets资源 则打包
            // 调用系统压缩指令
            if (fs.existsSync(outPath)) { // 如果存在打包路径 则先删除
                execFun(`rm ${outPath}`).then((r) => {
                    zipFile();
                });
                return;
            }
            zipFile();
        } else {
            let result = {
                code: 0,
                message: "ok",
                data: ''
            };
            dealRequest(res, result, {});
        }
    });
};