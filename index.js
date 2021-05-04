const Koa = require('koa');
const { serveStaticPlugin } = require('./plugins/serverPluginServeStatic');
const { moduleRewritePlugin } = require('./plugins/serverPluginModuleRewrite');
const { moduleResolvePlugin } = require('./plugins/serverPluginModuleResolve');
const { htmlPlugin } = require('./plugins/serverPluginHtmlPlugin'); // 向返回的html里注入一些逻辑：比如process变量，热更新等
const { vuePlugin } = require('./plugins/serverPluginVuePlugin'); // 需要拦截.vue文件并解析返回

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
        // 4、向html注入一些逻辑或变量
        // 其实也可以直接在html文件里写script标签实现，只是比较low且对用户不友好。
        htmlPlugin,

        // 2、解析import语法，重写路径
        moduleRewritePlugin,

        // 3、重写路径后，需要从新路径里拿到资源
        moduleResolvePlugin,

        // 5、拦截.vue后缀的文件，并处理
        vuePlugin,
        // 1、实现静态服务
        serveStaticPlugin, 
    ]
    midwareArr.forEach(mid => mid(context))

    return app;
}

module.exports = createServer;