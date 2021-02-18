# 什么是reduce

给定一个场景，如何实现 `f1` 函数的返回值作为 `f2` 的参数，然后 `f2` 返回值作为 `f3` 参数：

```js
function f1(arg){
  ...
  return res;
}
function f2(arg){
  ...
  return res;
}
function f3(arg){
  ...
  return res;
}
// 实现
let res = f1(f2(f3('some')));
我们通过一个函数compose来实现
compose(f1, f2, f3);
```

这就想到数组的 `reduce` 方法。

```js
function compose(...func){
  if (funcs.length === 0) return () => {};
  if (funcs.length === 1) return funcs[0];
  // reduce(function(accumulator, currentState)=>...)
	return func.reduce((a, b) => (...args) => a(b(...args))); // => a(b(c(...args)))
}
compose(f1, f2, f3)('哈哈哈')
```











# Redux 流程

<img src="images/image-20210209222124102.png" alt="image-20210209222124102" style="zoom:50%;" />

1. `store` 来存储数据。
2. `store` 中的 `reducer` 用来初始化`state` 并定义 `state` 修改规则。
3. 通过 `dispatch` 一个 `action` 来提交对数据的修改
4. `action` 提交到 `reducer` 函数中，根据 `action` 的 `type` 返回新的 `state` 。
5. `store.subscribe()` 订阅。





# 实现Redux

```js
export function createStore(reducer) {
  let currentState = undefined;
  let currentListeners = [];

  function getState() {
    return currentState;
  }
  // 每次dispatch的时候更新
  function dispatch(action) {
    currentState = reducer(currentState, action);
    // 当dispatch更新时执行监听
    currentListeners.map(listener => listener());
  }
  // 可以多次订阅，每次订阅把回调放入数组
  function subscribe(listener) {
    currentListeners.push(listener);
  }

  // 首次加载时需要初始值，所以先进行一次dispatch
  // 取值一定要保证不和项目中会重复 => 随机生成字符串
  dispatch({ type: '@INIT/REDUX' });

  return { getState, dispatch, subscribe };
}
```





# 中间件

```js
// 普通操作
add = () => {
    store.dispatch({type: "ADD"});
  };

// 异步操作
asyAdd = () => {
  store.dispatch(dispatch => {
    setTimeout(() => {
      dispatch({type: "ADD"});
}, 1000); });
};
```



## 实现中间件

如何把 `enhancer` 放在 `createStore(store, enhancer)` 第二个参数中。

1. 最终执行发生在 `createStore` 中。
2. 在 `Middlewares` 函数中执行。

```js
function createStore(store, enhancer){
	if(enhancer) return enhancer(createStore)(reducer);
}

function applyMiddleware(...middlewares){
  return createStore => (...args) => {
    const store = createStore(...args);
  }
  return {
    ...store,
  }
}
```



==`Middleware` 的本质是：改写 `dispatch` ，每次发生动作时，产生更多的效果。==

```js
// applyMiddleware(logger, thunk)
// 中间件作用的本质：改写了dispatch，每次dispatch的时候发生不一样的事情。
export function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args);

    let dispatch = store.dispatch;

    const middleApi = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args),
    };

    // 1.给每个middleware参数;middlewareChain也是数组，是每个中间件执行之后的结果数组
    const middlewareChain = middlewares.map(middleware => middleware(middleApi));

    // 2.聚合compose，顺序执行，第一个的返回值作为第二个的参数
    dispatch = compose(...middlewareChain)(dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}

function compose(...func) {
  if (func.length === 0) return () => {};
  if (func.length === 1) return func[0];
  return func.reduce((a, b) => (...args) => a(b(...args)));
}
```



## 实现 `redux-logger`

```js
function logger() {
  return dispatch => action => {
    console.log(action.type + '执行了');
    return dispatch(action);
  };
}
```



## 实现 `redux-thunk`

```js
function thunk({ getState }) {
  return dispatch => action => {
    if (typeof action === 'function') return action(dispatch, getState);
    else return dispatch(action);
  };
}
```









# React-Redux

## API

### `<Provider store>`

### `connect()`

#### `mapStateToProps`

`mapStateToProps(state, [ownProps])()` 定义该参数，组件将监听 `Redux store` 的变化。

- `ownProps` ：当前组件自身的 `props` 。如果指定了，那么组件接收到新的 `props` 时，`mapStateToProps` 就会被调用，重新计算。==注意性能！==





```js
function App(){
  return ...
}

const mapStateToProps = state => (
	{ num: state }
)
const mapDispatchToProps = {
	add: () => { type: 'add'},
  minus: () => { type: 'minus' }
}
// 前两个改进了state和dispatch之后可以继续修改
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  // do something...
  return { ...stateProps, ...dispatchProps, ...ownProps }
}
  
export default connect(mapStateToProps, mapDispatchToPorps, mergeProps)(App);
```





这里的 `mapDispatchToProps` 有两种形式，可以是 `Object` 也可以是 `Function` 。

```js

```



# `bindActionCreators`

`bindActionCreators` 能将多个函数执行起转化成 `dispatch(action)` 的函数集合形式，这样就不用收到 `dispatch(actionCreator(type))` 的形式来调用方法了。

例如，下面的是函数执行器 `actionCreator.js` ：

```js
// 对象形式
export function addTodo(text) {
	return {
    type: 'ADD_TODO',
    text
  }
}
// 经过bindActionCreator后变成：
{ addTodo: text => dispatch(addTodo('text')) };


// 函数形式
const toggleTodo = id => {
  return {
    type: 'TOGGLE_TODO',
    id
  }
}
export { toggleTodo };
let boundActionCreators = bindActionCreators(toggleTodo, dispatch);
// 经过bindActionCreator后变成：
boundActionCreators = id => dispatch(toggleTodo(id));
```



## 实现 `bindActionCreators`

```js
function bindActionCreator(creator, dispatch){
  return (...args) => dispatch(creator(...args));
}

export function bindActionCreators(creators, dispatch) {
  const obj = {};
  for(const key in creators) {
		obj[key] = bindActionCreators(creators[key], dispatch);
  }
  return obj;
}
```





# 实现 `react-redux`

`react-redux` 核心就是两个 API，一个是 `connect` ，一个是 `Provider` 。 

1. `Provider` ：包裹上所有的子组件，通过 `Context` 的方式，把 `value={store}` 传递给所有的子组件。
2. 我们在子组件中，用 `connect` 创造一个高阶组件。传递过来 `value` 可以通过类组件中的 `contextType` 静态变量和 `this.context` 值获取到。
3. 我们在 `componentDidMount` 这个生命周期函数中来处理 `state` 和 `dispatch` 更合适一些。





```js
import React, { Component } from 'react';

const ValueContext = React.createContext();

// Provider组件应该返回包裹着的被加工过的children
// 数据用context传递
export class Provider extends Component {
  render() {
    return (
      <ValueContext.Provider value={this.props.store}>{this.props.children}</ValueContext.Provider>
    );
  }
}

// 实现核心：把store的数据传递出来
export const connect = (
  mapStateToProps = state => state,
  mapDispatchToProps
) => WrappedComponent => {
  return class extends Component {
    // this.context可以访问到 => store
    static contextType = ValueContext;

    constructor(props) {
      super(props);
      this.state = {
        // 因为更新state时会重新渲染，所以放在this.state中
        props: {},
      };
    }

    componentDidMount() {
      const { subscribe } = this.context;
      this.update();
      // 如果说dispatch运行正常但是仍然不刷新，说明没监听！
      subscribe(() => {
        this.update();
      });
    }

    update = () => {
      const { dispatch, getState } = this.context;
      let stateProps = mapStateToProps(getState());
      let dispatchProps = { dispatch };

      // 处理dispatch 两种格式 Object和Function
      if (typeof mapDispatchToProps === 'object') {
        dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
      } else if (typeof mapDispatchToProps === 'function') {
        dispatchProps = mapDispatchToProps(dispatch);
      } else {
        // 没写就默认
        dispatchProps = { dispatch };
      }

      this.setState({
        props: { ...stateProps, ...dispatchProps },
      });
    };

    render() {
      return <WrappedComponent {...this.props} {...this.state.props} />;
    }
  };
};

function bindActionCreator(creator, dispatch){
  return (...args) => dispatch(creator(...args));
}
export function bindActionCreators(creators, dispatch) {
  const obj = {};
  for(const key in creators) {
		obj[key] = bindActionCreators(creators[key], dispatch);
  }
  return obj;
}
```







