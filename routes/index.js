 /**
 * Created by luozhong on 15/12/30.
 */
 module.exports = function ( app ) {
     require('../apis/getPreviewImgs')(app);
     require('../apis/getFiles')(app);
     require('../apis/getDirectory')(app);
     require('../apis/getCode')(app);
     require('../apis/getQrCode')(app);
     require('../apis/downloadSrc')(app);
 };