const static = require('koa-static');
const path = require('path');

exports.serveStaticPlugin = function ({ app, root }) {
    // 拿到koa实例以及node进程的工作目录，就可以设置静态文件服务器了

    // 首先项目跟目录是一个静态文件服务器，其次就是public
    // 之所以单独设置public，是因为可以直接访问/public，而不用通过xxx/public
    app.use(static(root));
    app.use(static(path.join(root, './public')));
}