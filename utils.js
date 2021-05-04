const { Readable } = require('stream');

// 不是所有情况都是数据流
exports.readBody = function(stream) {
    if (stream instanceof Readable) {
        // 注意koa中所有的异步事件都必须是promise
        return new Promise((resolve, reject) => {
            let res = '';

            // 监听流数据事件，不停地累加数据
            stream.on('data', data => {
                res += data;
            });

            stream.on('end', () => {
                resolve(res);
            })
        });
    } else {
        return String(stream);
    }
}