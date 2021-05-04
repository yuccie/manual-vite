const { readBody } = require('../utils.js');

exports.htmlPlugin = function({ app, root }) {
    const injectText = `
        <script>
            window.process = {};
            process.env = {
                NODE_ENV: 'development',
            }
        </script>
    `
    app.use(async (ctx, next) => {
        // 拦截html资源，插入process变量(因为此时项目启动会报错： process is not defined)
        await next();

        if (ctx.body && ctx.response.is('html')) {
            const tempHtml = await readBody(ctx.body);

            // $& 这是正则匹配中，表示匹配的当前项；如下其实就是插入一个在head里插入一个script标签
            ctx.body = tempHtml.replace('<head>', `$&${injectText}`)
        }
    })
}