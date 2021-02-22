# 优缺点

![](images/%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%87%BD%E6%95%B0%E5%9B%BE%E8%B0%B1.jpg)

## 优点

### 1. 更容易复用代码

这是 `hooks` 的最大优点！解决了类组件难以复用逻辑的问题。

1. 每调用一次 `useHook` 都会生成一份独立的状态，因为函数有自己的作用域，会开辟一个独立的空间。
2. 虽然状态和副作用 `useEffect` 的存在依赖于组件，但是它们可以在组件外部定义。类组件就做不到。
3. 自定义方法 `useSomething` 能有效代替高阶组件，写起来更方便。



**类组件方式实现把外部配置放置在组件内。**需要构造高阶组件，过程复杂。传递外部的内容必须要通过 `props` 。

```js
import config from './api';
function useTable(config){
  return function(WrappedComponent){
    return class extends React.Component {
      state = {
        tableProps: config.xxx
      };
    
    	render(){
        const {tableProps} = this.state;
        return <WrappedComponent tableProps={tableProps} />
      }
    }
  }
}

class App extends React.Component {
  render(){
		const {tableProps} = this.props;
    return (
    	<table>{...tableProps}</table>
    )
  }
}
export default useTable(App);
```



**`react hooks` 实现这个 `useTable` 函数。**

```js
import config from './api';

function useTable(config){
  const [tableProps, useTableProps] = useState(config.xxx);
  return tableProps;
}

function App(){
  const {tableProps} = useTable();
  return (
  	<table>{...tableProps}</table>
  )
}
```





### 2. 书写方便

1. `props` 等状态读取都是直接从==当前作用域直接获得变量==，但是类组件需要先访问实例的 `this` ，然后才能访问其属性和方法。
2. 改变状态 `state` 更加简单：`useState` 。





## 缺点

### 1. 响应式的 `useEffect`

`useEffect` 和 `useCallback` 依赖数组项的内容具有不确定性。比如，当前 `useEffect` 依赖某个函数的不可变性，但是这个不可变性又依赖于另一个函数，形成了一个依赖链。如果这条链上某个节点意外地被改变，`useEffect` 也会被触发，所以这种性能问题对开发者的要求更高。



### 2. 状态不同步

函数都有自己的独立作用域。当进行异步操作时，经常会碰到异步回调的变量引用是之前的，旧的(可以看成是闭包)。如下，有两个按钮，一个负责打印当前的 `count` ，一个负责给 `count+1` 。如果我先点击打印，然后迅速点击 add 按钮，他就会打印旧的状态，并没有➕1。这就是状态不同步造成的。

==为什么类组件不出现这个问题？因为类组件的属性和方法都存放在 `React.Component` 继承过来的父类中的 `instance` 上，调用用到 `this.state.xxx` 或 `this.method()` 。每次都是不变的 `instance` ，所以不存在引用到旧的。==

```js
export default function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setTimeout(() => console.log(count), 1000);
  };

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={handleClick}>打印</button>
      <button onClick={() => setCount(count + 1)}>add</button>
    </div>
  );
}
```



解决这个不同步的方法，我们也参照 `instance` 。用 `useRef` 返回的对象保存 `state`，这样就能长久保存。

> `createRef` 和 `useRef` ：
>
> 1. ==`createRef` 只能用在类组件中，`useRef` 只能用在 Hooks 中。==在 Hooks 中使用 `createRef` 永远也拿不到 `ref` 。原因是：`createRef` 没有 Hooks 效果，值会随着函数式组件重复执行而不断被初始化。类组件中分离了生命周期，例如 `componentDidMount` 初始化时仅执行一次。
> 2. `useRef` 的值不会更新，但是 `createRef` 的值会更新。



























