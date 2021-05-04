const { readBody } = require('../utils.js');
const { parse } = require('es-module-lexer'); 
const MagicString = require('magic-string');

function rewriteImports(source) {
    const imports = parse(source)[0];
    console.log('imports', imports);
    // 返回类似如下结果，数组的每一项都是一条import语法，s就是导入模块的开始
    // end就是字符串的结束，n就是具体的模块
    // [
    //     [
    //       { n: 'vue', s: 27, e: 30, ss: 0, se: 31, d: -1 },
    //       { n: './App.vue', s: 49, e: 58, ss: 32, se: 59, d: -1 }
    //     ],
    //     [], // 这个数组里是动态导入的部分
    //     false
    // ]

    // 需要重写字符串，这里需要用到magic-string
    let str = new MagicString(source);
    imports.forEach(({ n,s,e }) => {
        if (/^[^\/\.]/.test(n)) {
            const id = `/node_modules/.vite/${n}.js`;
            str.overwrite(s, e, id);
        }
    })
    return String(str);
}


exports.moduleRewritePlugin = async function({ app, root }) {
    app.use(async (ctx, next) => {
        // 洋葱模型，这里执行权直接交给下一个中间件
        await next();

        // 我们需要拦截.js文件，
        if (ctx.body && ctx.response.is('js')) {
            // 将公共方法抽离出去，注意这里的数据是流，而且是异步
            const resBody =  await readBody(ctx.body);
            // 刷新一下页面，就会看到main.js文件里的内容
            // console.log('resbody', resBody);

            // 解析import语法，重写文件路径
            // 'vue' -> '/node_modules/.vite/vue.js?v=4fd96829'
            // 需要用到es-module-lexer 这是 ES Module 语法的词法分析利器，比babel和Acorn强大许多
            const res = rewriteImports(resBody);
            // 重写后挂载在ctx.body上
            ctx.body = res;
        }
    })
}