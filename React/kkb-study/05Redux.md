# redux 过程

view => action => reducer => store(state) => view。

1. 首先 store(state) 决定了 view。
2. 然后当用户和 view 交互的时候，会产生一些 action。
3. 这些 action 会触发 reducer 因此来改变 state。
4. state 会实时改变 view 的变化。





# redux 优缺点

## 优点







## 缺点

1. 代码复杂，要把方法单独抽离到一个文件，过于臃肿。
2. redux 的传递是通过父组件传递下来的。当一个组件相关数据更新时，即使父组件不需要用到这个组件，父组件还是会重新 render，影响效率。需要写 `shouleComponentUpdate` 来进行判断。



























