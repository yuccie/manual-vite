const path = require('path');
const fs = require('fs').promises;
const { resolveVue } = require('../utils')
const defaultExportReg = /((?:^|\n|;)\s*)export default/

// 解析.vue后缀的文件
exports.vuePlugin = function({app, root}) {
    app.use(async (ctx, next) => {
        console.log('ctx.path', ctx.path);
        // 非.vue结尾的文件
        if (!ctx.path.endsWith('.vue')) {
            return next();
        }

        // vue文件处理
        const filePath = path.join(root, ctx.path);
        const content = await fs.readFile(filePath, 'utf-8');

        // 获取文件内容
        const { parse, compileTemplate } = require(resolveVue(root).compiler);
        const { descriptor } = parse(content); // 将vue文件解析成一个对象

        // 没有?xxx
        if (!ctx.query.type) {
            let code = '';
            if (descriptor.script) {
                let content = descriptor.script.content;
                let repalced = content.replace(defaultExportReg, '$1const _script =');
                code += repalced;
            }

            if (descriptor.template) {
                const templateRequest = `${ctx.path}?type=template`;
                code += `\nimport { render as _render } from ${JSON.stringify(templateRequest)}`;
                code += `\n_script.render = _render`;
            }

            ctx.type = 'js';
            code += `\nexport defalut _script`;
            ctx.body = code;
        }

        if (ctx.query.type === 'template') {
            ctx.type = 'js';
            const content = descriptor.template.content;
            const { code } = compileTemplate({ source: content });
            ctx.body = code;
        }
    })
}