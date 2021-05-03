# manual-vite

## 步骤一，先初始化执行脚本

1. 定义bin目录，注意shebang是 `#! /usr/bin/env node`，注意不是user，路径是绝对路径，另外这里写env主要是为兼容安装到不同目录里的node。
2. 链接bin里面的脚本，使用npm link，这样就可以全局使用自定义脚本了
3. 如果想npm run 脚本名，则需要定义脚本的vulue为：xxx: node xxx
4. 如果想在script里直接执行脚本，则需要使用软连接，也就是模块在node_modules/.bin/ 目录里生成软连接才可以，怎么手动生成这个软连接文件呢？

```
控制台显示的user@hostname (who am I and where am I)
user 是用户名，在设置 -》用户与群组 -》高级选项里修改
hostname是电脑名字，系统偏好设置 --> 共享 --> 更改电脑名称更改
```