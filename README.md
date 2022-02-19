# kc-mc-package
管理部署工具打包webpack插件
# 使用
```
    // 安装
    npm install kc-mc-package -d -s
    // vue.config.js
    const kcp = require('kc-mc-package')
    ...
    plugins: [
        new kcp({
            projectName: 'dist'
        })
    ]
```
