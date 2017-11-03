/**
 * desc: 拉取最新ui
 * User: luozhong
 * Date: 2017/6/7
 * Time: 19:31
 * email:luozhong0521@163.com
 */
const { dealRequest, gitOption, updateLog } = require('../common/utils');
const gitCode = require('../common/gitCode');

const fs = require('fs');
const exec = require('child_process').exec;
const urllib = require('url');
module.exports = function (app) {
    function pullUi(res) {
        gitOption(gitCode.pull).then((stdout) => {
            delRes(res, stdout);
        });
    }
    function cloneUi(res) {
        gitOption(gitCode.clone).then((stdout) => {
            delRes(res, stdout);
        });
    }
    function delRes(res, stdout) {
        exec('cd public/uiFiles/UIManagement && git log -1', function(error, trmSuc, trmErr){
            if(error) {
                console.error('error: ' + error);
                return;
            }
            const commitInfo = trmSuc;
            const userReg = /Author:(.*)</; // 匹配提交用户信息正则
            const dateReg = /Date:(.*)/; // 匹配提交用户信息正则
            let userName = commitInfo.match(userReg);
            let commitDate = commitInfo.match(dateReg);
            userName = userName ? userName[1] : '';
            commitDate = commitDate ? commitDate[1] : '';
            const update = new Date();
            const result = {
                code: 0,
                message: stdout,
                data: {
                    userName,
                    commitDate,
                    update,
                }
            };
            dealRequest(res, result, {});
            updateLog();
        });
    }
    app.get('/getCode', function (req, res) {
        console.log('拉取代码');
        const params = urllib.parse(req.url, true);
        // 成功的例子
        const path = './public/uiFiles/UIManagement';
        if (fs.existsSync(path)) {
            pullUi(res);
        } else {
            cloneUi(res)
        }
    });
};