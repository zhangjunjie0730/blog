# 业务逻辑发展史

1. 面向过程：把所有的逻辑都写在一个 js 文件中，难以拆分。大项目无法维护。

2. 面向对象：把每个模块内容单独放在 js 文件中，通过 `script` 标签，一个一个引入。缺点：要引入多个 `script` 标签，也就是多次 http 请求，造成加载慢的问题。

   并且，主业务逻辑要写在 `index.js` 中，所以还得注意标签的顺序问题。

   ```html
   <script src="./header.js"></script>
   <script src="./content.js"></script>
   ...
   <script src="./index.js"></script>
   ```

3. 所以产生了新的方式，在每个模块中，你想用哪个模块就引入哪个模块。

   ```js
   import Header from "./header.js"
   ```



但实际上，浏览器不认识 `import ... from ...` 这个语句，这时候就需要 `webpack` 把语句翻译之后让浏览器正确识别。





# webpack概述

webpack 是一个模块打包工具。

类似 `css` 中的也是这样打包的。

```js
import style from "./index.css";
```

































