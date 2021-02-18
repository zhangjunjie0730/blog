---
title: Javascript 在 ACM 模式下的输入和输出
---



牛客网的笔试属于 ACM 模式，有两种模式，一种是浏览器 v8 模式，一种是 node 模式。下面来介绍一下这两种模式下的输入和输出。

对于笔试题目，大致分为两种类型。

1. 只输入一个数据，然后经过处理后输出，类似下面这样：

   <img src="images/image-20210122171109527.png" alt="image-20210122171109527" style="zoom:50%;" />

2. 输入未知的数据，用换行来代替，类似下面这样：

   <img src="images/image-20210122170937155.png" alt="image-20210122170937155" style="zoom:50%;" />

# Node版本

nodejs 依赖 readline 库，接收到输入数据，用 `console.log()` 进行输出。



## 单行输入

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.on('line', line => {
  console.log(line);
});
```



## 多行输入

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let arr = [];
rl.on('line', line => {
  arr.push(line);
});
rl.on('close', () => {
  console.log(arr);
});
```



nodejs 可以在本地进行调试，在终端输入 `node test.js`，就可以进入输入：

1. 单行输入时，按回车就能查看结果
2. 多行输入时，回车代表移入下一行。**结束输入按 ctrl + C**

<img src="images/image-20210122173206928.png" alt="image-20210122173206928"  />



## 举例

### 1. 首行规定总行数

例题：[分葡萄](https://www.nowcoder.com/questionTerminal/14c0359fb77a48319f0122ec175c9ada)

```js
2
1 2 3
1 2 6
```

如果下面的 `1 2 3` 和 `1 2 6` 每行都输出相应的结果可以这样：

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const input = [];
rl.on('readline', line => {
  input.push(line);
  const n = parseInt(input[0]);
  if(input.length === n+1) solution(input);
  /*
  * 此时的input如下：[
  * "2",
  * "1 2 3",
  * "1 2 6",
  * ]
  * 所以记得用的时候用parseInt转一下！
  */
})

function solution(input){
  const n = parseInt(input[0]);
  const res = [];
  for(let i=1;i<n+1;i++){
    // 将每一行都转成一个数组，用result函数进行处理，然后每行打印结果
    const arr = input[i].split(" ").map(item => parseInt(item));
    console.log(result(arr));
  }
}
function result(arr){
  ...
  return res;
}
```













# V8 版本

## 单行输入



## 多行输入













