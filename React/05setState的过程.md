- **setState 是异步的** —— vue 修改属性也是异步的。
- 概括一下 setState 的过程
- setState({对象变化}, callback)



# setState 的异步

```js
addList(){
	const currentList = this.state.list;
  console.log(this.state.list); // ['a','b']
  this.setState({
    list: currentList.concat('c');
  })
  console.log(this.state.list); // ['a', 'b']
}
```

## setState 为何需要异步

- 可能会一次执行多次 setState => **为了避免渲染很多次，汇聚到一次进行。**
- 没必要每次 setState 都重新渲染。
- 即使是每次重新渲染，用户也看不到中间的效果。**js 是单线程的，DOM 渲染和 js 执行是顺序执行，js 执行的时候，DOM 会卡顿。所以如果 js 执行从 1 变化到 10，用户看不到的，只能看到最后的 10。**



# setState 的过程

- 每个组件实例，都有个 renderComponent 方法（继承自 React.Component)
- 执行 renderComponent，会重新执行实例的 render
- render 函数返回 newVnode，然后拿到 preVnode
- 执行 patch(newVnode, preVnode)



Component 父类实际有个方法：

```js
class Component{
  constructor(){}
  
  renderComponent(){
    const prevVnode = this._vnode;
    const newVnode = this.render(); // render函数返回的是node对象！
    patch(prevVnode, newVnode);
    this._vnode = newVnode;
  }
}
```

组件进行 setState 的时候，会自己自动进行一个回调函数，调用 `renderComponent`

```js
class App extends Component{
  addList(){
		const currentList = this.state.list;
  	this.setState({
    	list: currentList.concat('c');
  	},()=>{
      // 箭头函数，this是上一层的指向
      this.renderComponent()
    })
	}
  render(){
    ...
  }
}
```



# 总结

- 异步 => 为了提高效率
- 最终走向：patch(preVnode, newVnode)

























