const { readBody } = require('../utils.js');


exports.moduleRewritePlugin = async function({ app, root }) {
    app.use(async (ctx, next) => {
        // 洋葱模型，这里执行权直接交给下一个中间件
        await next();

        // 等到上面的中间件（其实就是静态文件服务器）执行完，会执行下面的逻辑
        // static中间件执行完会在ctx.body上挂载资源文件，这里通过一个方法读取
        if (ctx.body) {
            // 将公共方法抽离出去，注意这里的数据是流，而且是异步
            const resBody =  await readBody(ctx.body);
            // 刷新一下页面，就会看到resBody的内容为html里的内容
            console.log('resbody', resBody);
        }
        const resBody =  await readBody(ctx.body);
        console.log('resbody', resBody);
    })
}