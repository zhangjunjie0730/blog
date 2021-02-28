# 1. `Lazy` 和 `Suspense`

## 应用

```js
const WithLazyLoad = (WrappedComponent) => {
  return class extends React.Component {
    render() {
			return (
      	<React.Suspense fallback={<div>Loading...</div>} >
        	<WrappedComponent {...this.props} />
        </React.Suspense>
      )
    }
  }
}


// 对路由进行懒加载
const Home = React.lazy(() => import('./components/Home'));
const About = React.lazy(() => import('./components/About'));

class App extends React.Component {
  render() {
		return (
    	<BrowserRouter>
      	<Switch>
      		<Route path="/" exact component={WithLazyLoad(Home)} />
					...
      	</Switch>
      </BrowserRouter>
    )
  }
}
```





## 参考

1. https://zhuanlan.zhihu.com/p/58979795