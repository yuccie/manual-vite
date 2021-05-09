# manual-vite

整体思路：
1. 编写vite
2. 通过 npm link 来链接 编写的vite
3. 在使用官方vite的脚手架里，通过my-vite来使用自己定义的vite

## 步骤一，先初始化执行脚本

1. 定义bin目录，注意shebang是 `#! /usr/bin/env node`，注意不是user，路径是绝对路径，另外这里写env主要是为兼容安装到不同目录里的node。
2. 链接bin里面的脚本，使用npm link，这样就可以全局使用自定义脚本了
3. 如果想npm run 脚本名，则需要定义脚本的vulue为：xxx: node xxx
4. 如果想在script里直接执行脚本，则需要使用软连接，也就是模块在node_modules/.bin/ 目录里生成软连接才可以，怎么手动生成这个软连接文件呢？

- 控制台显示的user@hostname (who am I and where am I)
- user 是用户名，在设置 -》用户与群组 -》高级选项里修改
- hostname是电脑名字，系统偏好设置 --> 共享 --> 更改电脑名称更改，也可以直接通过hostname直接更改，man hostname查看帮助，man hostname -s jsArt就可以去掉.local字样了。

环境变量添加到哪个配置文件里，是根据你当前终端的shell来决定的
1. echo $SHELL 可以查看当前shell
2. 然后在当前shell的配置文件里添加环境变量，比如~/.zshrc
3. 添加完后，执行source ~/.zshrc即可

## 步骤二，初始化http服务器

利用koa起一个静态服务，拦截项目中的请求

需要的依赖：
- koa, koa-static

更新.gitignore文件

```bash
git rm -r --cached .  # 放弃所有已追踪的文件
 # 增加 .gitignore，并添加忽略规则
git add . # 增加追踪文件
git commit -m '更新.gitignore' # 或 gcam '更新.gitignore'文件
```

### 手写vite步骤：

1. npm link创建软连接，链接到自己的myVite，定义package.json的bin字段
2. 启动koa服务，并定义上下文对象，内含koa实例以及process.cwd()当前node运行目录，其实就是服务实例和项目根路径封到一个对象obj上
3. 定义静态文件服务器中间件，并将obj传入进去，并分别在public和根目录上设置静态服务器
4. 定义读取文件数据流的中间件，访问一个资源，静态文件服务器会将资源数据挂载在中间件的ctx上，然后读取数据流中间件通过监听stream事件，获取到数据流。
5. 第4步已经拿到了数据，但现在需要从入口的app.js分析，因此需要读取js资源，同时利用es-module-lexer解析文件内容，获取里面的es module语法的模块，然后利用magicString重写资源引用路径。
6. 重写路径后，需要添加中间件从新路径里拿到最终的文件资源，同时需要返回一些项目的核心资源。
7. 因为有时候会涉及到process等服务端的变量，因此可以添加中间件，将这些变量通过重写ctx.body来直接塞到html里，从而避免出错。
8. 上面的步骤还只是处理了js等资源，还需要处理vue等资源。。。方式差不多

总结就是：拦截请求，修改请求的路径，返回对应路径下的资源。
### 其他

- 最新的vite已经不再使用koa了，官方理由如下，总结就是需要大量的插件，而不是中间件。

> Since most of the logic should be done via plugin hooks instead of middlewares, the need for middlewares is greatly reduced. The internal server app is now a good old [connect](https://github.com/senchalabs/connect) instance instead of Koa.

