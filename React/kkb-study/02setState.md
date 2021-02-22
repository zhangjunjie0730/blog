# **使用技巧**

`setState(partialState, callback)` 。

> - `partialState` ：==`function|object` 表示与当前 `state` 合并的子集==
> - `callback` ：当 `state` 更新后会被调用！

## 异步

原因：避免多次更新重绘，合并之后更新。

==这种异步是指，我打印 `console.log(this.state.count)` 时拿到的是落后的值，但是渲染到页面是最新的值！！！注意！==

### 获取最新状态方式

#### 1. 在 `callback` 中获取

```react
changeValue = v => {
  this.setState({
    counter: this.state.counter + v,
  	},
  	() => console.log('get current counter')
  )
}
```



#### 2. 在 `setTimeout` 中获得

```react
setTimeout(()=>{
  this.setCounter();
}, 0);
```

1. `setState` 只有在合成事件和生命周期函数中是异步的，==在原生事件和 `setTimeout` 中是同步的。==

   ```js
   // 1.合成事件是指下面这种：
   changeValue = v => {
       this.setState({
         counter: this.state.counter + v
       });
   };
   setCounter = () => {
       this.changeValue(1);
       this.changeValue(2);
   };
   ```

   

2. ==原因？？？==是不是 `setTimeout` 也是异步的，单独创建了一个队列任务，当前状态被保存在这个任务中？？？



#### 3. 原生事件中同步

**原生事件一定要写在生命周期中，当组件挂载完成后去执行的事件。**

```react
componentDidMount(){
	document.body.addEventListener('click', this.changeValue, false);
}
```





## 更新可能会吞并

下面的方式更新不会执行两次 `this.changeValue(2)` 。因为 `setState` 是批量更新。==只会执行第二次，每次➕2==

```js
changeValue = v => {
    this.setState({
      counter: this.state.counter + v
    });
};
setCounter = () => {
    this.changeValue(1);
    this.changeValue(2);
};
```



如果想要实行这种链式调用，**使用函数式的 `setState`**

```js
// 接受参数state，返回对象
changeValue = v => {
  this.setState(state => ({
    count: state.count + v,
  }));
};
setCounter = () => {
  this.changeValue(1);
  this.changeValue(2);
  console.log(this.state.count);
};
```



==原因是什么？？？==

==会不会是函数式能创建一个函数作用域，保存当时的 state 状态？？？==



## 总结

1. `setState` 只有在合成事件和生命周期函数操作时，拿到的值是异步的，会批量更新，==但是值在页面上渲染都是最新的==。
2. `setState` 解决异步的办法，用 `setTimeout` 或者生命周期函数中用到原生事件。
3. `setState` 更新可能会合并，只更新最后一次。解决方案：用到函数式方法。























