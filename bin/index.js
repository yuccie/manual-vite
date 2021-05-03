#! /usr/bin/env node

// 需要启动一个服务，并且监听某个端口
const createServer = require('../index.js');

createServer().listen(4000, (err) => {
    if (err) {
        throw err;
    }

    console.log('server start in 4000 port \n');
    console.log('http://localhost:4000');
})



