# 基本使用

- `Promise.all` ：三个都完成，才调用成功；
- `Promise.race`：有一个成功就调用成功。
- 多个串联，先拿到第一个信息，再去请求另一个信息，.then 来进行顺序执行。



# Promise 标准

- 三种状态：pending fulfilled rejected。初始状态是 pending，pending => fulfilled、pending => rejected 状态不可逆。
- 



# async/await

- then 只是将 callback 拆分了。
- async/await 是最直接的同步写法。

