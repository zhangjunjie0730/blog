博客链接：[JSPang](https://jspang.com/detailed?id=62)



# Electron概述

## 1. 选型特点

1. 公司没有专门的桌面应用开发者，而需要前端兼顾来进行开发时，用Electron就是一个不错的选择。
2. 一个应用同时开发Web端和桌面端的时候，那使用Electron来进行开发就对了。
3. 开发一些效率工具，比如说我们的VSCode，比如说一些API类的工具，用Electron都是不错的选择。





# Demo

## 1. 安装

依赖 node.js

```
npm install electron --save-dev
```

检验版本

```
npx electron -v
```

启动命令

```
./node_modules/.bin/electron
```

全局安装

```
npm install electron -g
```

全局安装后，可以使用下面命令启动

```
electron .
```



## 2. 初始化与启动

