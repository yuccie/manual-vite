const path = require('path');
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

// 根据传入的root目录，返回一个存储资源的map对象
exports.resolveVue = function(root) {
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