const moduleReg = /^\/node_modules\/\.vite\//;
const fs = require('fs').promises; // 引入异步版本
const { resolveVue } = require('../utils');

exports.moduleResolvePlugin = function({ app, root }) {
 
    const vueResolved = resolveVue(root);

    // 匹配当前请求的url，如果是以/node_modules/开头的，说明是重写的路径
    app.use(async (ctx, next) => {
        if (!moduleReg.test(ctx.path)) {
            // 非重写路径，直接返回，添加return有等待效果，其实相当于return await next();
            return next();
        }

        // 拿到模块的名字
        const moduleName = ctx.path.replace(moduleReg, '').slice(0, -3);
        // console.log(moduleName, 'moduleName'); // vue

        // 设置响应类型
        ctx.type = 'js';
        // 需要去项目目录下查找对应真实的文件
        // 这里引用的是promises，也就是可以异步
        const content = await fs.readFile(vueResolved[moduleName], 'utf-8')

        // 找到后再次挂载
        ctx.body = content;
    })
}