# 用法

## 1. Route 中三种渲染方式

```js
<Router>
  <Route 
		exact
    patch="/"
		// compoennt为第二优先级，按照路由匹配
		component={HomePage}
		// children第一优先级，不按路由匹配，永远显示在页面上
		children={() => <div>children</div>}
		// render第三优先级，按照路由匹配
		render={() => <div>render</div>}
  />
</Router>
```

1. `children` ：函数形式渲染。
   - 使用场景：不管 `location` 是否匹配，都需需要渲染的内容用 `children` 。
   - 优先级第一。
2. `render` ：函数形式渲染。
   - 只在当 `location` 匹配时渲染。
3. `component` ：组件形式渲染。
   - 匹配时渲染。



## 2. 404 页面

```js
 {/* 添加Switch表示仅匹配⼀一个*/}
<Switch>
{/* 根路路由要添加exact，实现精确匹配 */} 
<Route
    exact
    path="/"
    component={HomePage}
  />
  <Route path="/user" component={UserPage} />
  <Route component={EmptyPage} />
</Switch>
```



# 注意

`component` 方法写组件不要写函数，影响性能。

```js
// 正确写法
<Route path="/" component={HomePage} />
  
// 错误：每次都开辟一个新的匿名函数去执行新的React.createElement
<Route path="/" component={() => <Homepage /> } />
```

==当 `component` 的时候，Router 会用你指定的组件和 `React.createElement` 创建一个 `[React element]` 。如果提供的是函数，render 每次都创建新组件，不去更新现有组件，直接卸载旧的挂在新的，很浪费。所以想用函数时，用 `render` 和 `children` 。==







# 源码实现

## 1. BrowserRouter

`<BrowserRouter>` 通过 HTML5 的 history API (`pushState` | `replaceState` | `popState` 事件)。

### `basename` 

设置 URL 的 base 值。

```js
<BrowserRouter basename="/kkb">
  <Link to="/user" />
</BrowserRouter>
// => /kkb/user
```



### 实现 `BrowserRouter`

```js

```











































