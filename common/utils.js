/**
 * desc: 工具类
 * User: luozhong
 * Date: 2017/8/2
 * Time: 21:19
 * email:luozhong0521@163.com
 */
const exec = require('child_process').exec;
const fs = require('fs');
const basePath = './public/uiFiles/UIManagement';
const os = require('os');
const ifaces = os.networkInterfaces();
const iptable={};
let origin = '';
for (var dev in ifaces) {
    ifaces[dev].forEach(function(details,alias){
            if (details.family=='IPv4') {
                iptable[dev+(alias?':'+alias:'')]=details.address;
            }
        });
}
origin = `http://${iptable.en0 || 'localhost'}:3005`;

exports.getOrigin = function() {
    return origin;
};
// 读取日志文件
function getLog() {
    return fs.readFileSync('./update_log.json', {encoding:'utf-8'});
};

/**
 * 判断当前文件夹下是否有图
 * @param {any} arr 文件夹内容
 */
function checkImg(arr) {
    if (typeof arr === 'object') {
        arr = JSON.stringify(arr);
    }
    const except = ['.jpg', '.png', '.jpeg', '.svg'];
    let hasImg = false;
    for (let i = 0; i < except.length; i++) {
        if (arr.indexOf(except[i]) >= 0) {
            hasImg = true;
            break;
        }
    }
    return hasImg;
};

/**
 * 更新日志
 * @export
 */
exports.updateLog = function() {
    const log = JSON.parse(getLog());
    const newLog = {
         "userName": "",
         "pullDate": new Date().getTime(),
    };
    log.push(newLog);
    fs.writeFileSync('./update_log.json', JSON.stringify(log));
}

/**
 * 获取当前文件目录
 * @param path 文件目录
 * @returns {Promise}
 */
exports.getFileName = function(path) {
    const except = ['.jpg', '.png', '.jpeg', '.svg'];
    if (!path) {
        path = '';
    }
    path = `${basePath}${path}`;

    const dirObj = {
        path,
        children: [],
    };
    let log = getLog() || [];
    return new Promise((resolve, reject) => {
        function getDir(tree) {
            let filesArr = fs.readdirSync(`${tree.path}`);
            filesArr = filesArr.filter(item => item.indexOf('.') !== 0 && item !== 'README.md');
            // if (filesArr.indexOf('preview') >= 0) {
            //     return;
            // } else {
            //     if (checkImg(filesArr)) {
            //         return;
            //     }
            // }
            let index = -1;
            const node = filesArr.map((f) => {
                if (checkImg(f)) {
                    let imgUrl = `${tree.path}/${f}`;
                    imgUrl = imgUrl.replace('./public', origin);
                    return {
                        name: f,
                        path: imgUrl,
                    }
                }
                index ++;
                return {
                    name: f,
                    index,
                    path: `${tree.path}/${f}`,
                }
            });
            if (node.length > 0) {
                tree.children = node;
            }
            node.forEach((n) => {
                try {
                    if (fs.statSync(n.path).isDirectory()) {
                        getDir(n);
                    }
                } catch(err) {
                    
                }
            });
        }
        if (fs.existsSync(path)) {
            getDir(dirObj);
        }
        try {
            log = JSON.parse(log);
        } catch(err) {
            log = [];
        }
        resolve({
            directory: dirObj,
            log,
        });
    })
}

// 获取path下所有内容
function getFileContent(path) {
    path = path || basePath;
    return new Promise((resolve, reject) => {
        let fileArr = [];
        if (fs.existsSync(path)) {
            fileArr = fs.readdirSync(path);
        } else {
            fileArr = [];
        }
        resolve({
            fileArr,
        });
    });
};

/**
 * 获取文件夹内容，返回当前项目对应的预览图
 * @param path: 文件路径
 */
exports.getFiles = function(path) {
    path = path || basePath;
    return new Promise((resolve, reject) => {
        const fileArr = getFileContent(path);
    });
    return getFileContent(path)
    // return new Promise((resolve, reject) => {
    //     let fileArr = [];
    //     if (fs.existsSync(path)) {
    //         const files = fs.readdirSync(path);
    //         if (files.indexOf('preview') < 0) {
    //             fileArr = files.filter(item => fs.statSync(`${path}/${item}`).isDirectory());
    //         }
    //         getImgs(fileArr);
    //     } else {
    //         fileArr = [];
    //     }
    //     resolve({
    //         fileArr,
    //     });
    // });
};

function getImgs(fileArr) {
    const getPreview = function(pathName) {
        getFileContent(`${basePath}/${pathName}`).then((res) => {
        });
    }
    getPreview(fileArr[1]);
};

/**
 * 获取预览图内容
 * @param path: './public/uiFiles/UIManagement/xxx'
 */
exports.getPreviewImgs = function(path) {
    let previewArr = [];
    let linksNameData = []; //  标注
    const linksPath = path.replace('preview', 'links');
    const linksBasePath = linksPath.replace('./public', origin);
    return new Promise((resolve, reject) => {
        if (fs.existsSync(path)) {
            const arr = fs.readdirSync(path);
            // 获取标注 如果没有标注文件夹 则返回空
            if (fs.existsSync(linksPath)) {
                // 有标注
                const linksArr = fs.readdirSync(linksPath);
                linksNameData = linksArr.map((item) => {
                    let linkName = `${item}`;
                    linkName = linkName.substr(0, linkName.indexOf('.'));
                    return linkName;
                });
            }
            previewArr = arr.map((item) => {
                const obj = {};
                let fileName = `${item}`;
                fileName = fileName.substr(0, fileName.indexOf('.')); // 文件名称
                const previewPath = `${path}/${item}`;
                obj.previewUrl = previewPath.replace('./public', origin); // 预览图url
                const fileStat = fs.statSync(previewPath); // 文件信息
                obj.name = fileName;
                obj.mtime = fileStat.mtime;
                obj.ctime = fileStat.ctime;
                obj.birthtime = fileStat.birthtime;
                if (linksNameData.length > 0 && linksNameData.indexOf(fileName) >= 0) { // 此预览图有标注
                    obj.linkUrl = `${linksBasePath}/${fileName}.html`; // 标注url;
                }
                return obj;
            });
        } else {
            previewArr = [];
        }
        resolve({
            previewArr,
        });
    })
}

/**
 * 处理接口结果
 * @export
 * @param {any} result 接口返回值
 * @param {any} server http协议对象
 * @param {any} params 参数 josn
 */
exports.dealRequest = function(server, result, params) {
    server.writeHeader(200, {
        'Content-Type': 'text/plain;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
    });
    if (params.query && params.query.callback) {
        const str = params.query.callback + '(' + JSON.stringify(result) + ')';
        server.end(str);
    } else {
        server.end(JSON.stringify(result)); //普通的json
    }
}

/**
 * git 操作
 * @export
 * @param {any} code 命令
 */
exports.gitOption = function(code) {
    return new Promise((resolve, reject) => {
        exec(code, {
            encoding: 'utf8',
            timeout: 0,
            maxBuffer: 5000 * 1024, // 默认 200 * 1024
            killSignal: 'SIGTERM'
        }, function(error, stdout, stderr){
            if(error) {
                reject(error);
                return;
            }
            resolve(stdout);
        });
    });
}