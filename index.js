const Koa = require('koa');
const { serveStaticPlugin } = require('./plugins/serverPluginServeStatic');

function createServer() {
    const app = new Koa();

    // 因为要拦截资源的请求，因此需要知道项目的根路径
    // 返回node进程的当前工作目录，而node进程启动就是在项目根目录
    const root = process.cwd();

    // console.log(root, 'root');
    // /Users/xxx/for_art/demos/manual-vite 

    // 自定义上下文对象，传入中间件中
    const context = {
        app,
        root,
    }

    // koa都是通过中间件形式实现功能
    // 可以定义一个中间件数组，然后将app实例以及其他的对象传过去
    const midwareArr = [
        serveStaticPlugin, // 实现静态服务
    ]
    midwareArr.forEach(mid => mid(context))




    return app;
}

module.exports = createServer;