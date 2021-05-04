const moduleReg = /^\/node_modules\/\.vite\//;
const fs = require('fs').promises; // 引入异步版本
const path = require('path');

// 根据传入的root目录，返回一个存储资源的map对象
function resovleVue(root) {
    // vue3由几个部分组成，需要引入runtime-dom，runtime-core，reactivity,shared
    // 还需要解析单文件组件，用到compiler-sfc

    // 编译是在后端实现的，所以需要拿到commonjs规范的模块
    const compilerPkgPath = path.join(root, 'node_modules', '@vue/compiler-sfc/package.json');

    // 拿到package.json里的内容，
    const compilerPkg = require(compilerPkgPath);

    // 再根据package.json里的main路径，拼接相对路径，就找到了最
    const compilerPath = path.join(path.dirname(compilerPkgPath), compilerPkg.main);
    // /Users/yaqi/for_art/demos/vite-vue/node_modules/@vue/compiler-sfc

    // 再找到其他的模块
    const resovlePath = name => path.resolve(root, 'node_modules', `@vue/${name}/dist/${name}.esm-bundler.js`);
    const runtimeDomPath = resovlePath('runtime-dom');
    const runtimeCorePath = resovlePath('runtime-core');
    const reactivityPath = resovlePath('reactivity');
    const sharedPath = resovlePath('shared');

    // 返回模块对应的路径
    return {
        compiler: compilerPath,
        '@vue/runtime-dom': runtimeDomPath,
        '@vue/runtime-core': runtimeCorePath,
        '@vue/reactivity': reactivityPath,
        '@vue/shared': sharedPath,
        vue: runtimeDomPath
    }
}

exports.moduleResolvePlugin = function({ app, root }) {
 
    const vueResolved = resovleVue(root);

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