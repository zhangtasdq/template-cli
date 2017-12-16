template-cli
===
> 一个用于创建脚手架的工具类似于 vue-cli，只是下载的模版是由自己服务器端定义

安装
---
```
npm install -g template-gen-cli
```

配置
---
## 服务器端

### package.json
> 服务器的根路径下需要有一个 `package.json` 文件，里面描述对应模版的信息
#### 示例
```json
{
    "template": {
        "lensynui": { // 模版的名字，需要在命令行使用
            "default": "1.0.0", // 当未指定模版的版本时，默认下载的版本    
            "1.0.0": {
                "name": "hello.zip", // 模版存放在本地的名字
                "path": "/template/hello.zip", // 模版的路径，基于 server 配置
                "options": [ // 由使用者自己选择是否需要的功能
                    {
                        "type": "confirm",
                        "message": "Add unit test?",
                        "name": "unit",
                        "cmds": [ // 如这个功能是添加测试，则会执行如下命令
                            {
                                "key": "addDevPackage", // 向 devPackage 里面添加包
                                "value": [
                                    {"name": "chai", "version": "^4.1.2"},
                                    {"name": "mocha", "version": "^4.0.1"}
                                ]
                            },
                            {
                                "key": "addScript", // 向 script 里面添加命令
                                "value": [
                                    {"name": "test", "value": "mocha"}
                                ]
                            },
                            {
                                "key": "cp", // 将 test 目录复制到 base 目录里面
                                "value": {
                                    "from": "test",
                                    "to": "base"
                                }
                            }
                        ]
                    }
                ]
            }
        }
    }
}

```

### 模版结构
1. 模版必须是 zip 压缩的。
2. 压缩文件中必须要有 base 目录，此目录中的所有内容将会复制到使用者执行命令的路径下

使用
---
1. 首先需要配置服务器的地址，如 `template-cli -s http://localhost:8080`
2. 下载模版 `template-cli -t helloworld`

### 参数

#### -s
> 设置服务器的地址

#### -t
> 指定模版本的名字

### －tv
> 指定模版的版本
