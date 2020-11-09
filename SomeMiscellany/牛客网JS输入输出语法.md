# 牛客网输入输出语法

**利用 `readline()` 接收输入，`print()` 接收输出。**

1. **单行输入**

   ```js
   var line = readline();
   ```

2. **固定行数输入**

   **第一个输入的就是行数，先接收行数**

   ```js
   let n = parseInt(readline());
   let lines;
   for(let i=0;i<n;i++){
     lines = readline();
   }
   ```

3. **任意行数输入**

   ```js
   let lines;
   while(lines=readline()){
   	// 操作一下，存入数组还是字符串还是什么的
   }
   ```

   