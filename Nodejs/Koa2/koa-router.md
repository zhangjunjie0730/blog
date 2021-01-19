# API

- `routes.allowedMethods()`



## `routes.allowedMethods()`

能识别具体请求方式错误的方法。

[参考文档（含源码）](http://www.zuo11.com/blog/2020/8/allowedMethods_use.html)

**使用方式：**

- 全局状态添加：能够限定请求方式，如果请求方式不对，会报错405，请求方式有误。

```js
module.exports = server => {
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') return;
    const route = require(`./${file}`);
    server.use(route.routes()).use(route.allowedMethods());
  });
};
```

不添加该 api 时：

```js
GET http://127.0.0.1:3002/article/ 404 (Not Found)
```

添加后：

```js
GET http://127.0.0.1:3002/article/ 404 (Method Not Allowed)
```

**能够更好识别请求错误。**















