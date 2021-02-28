# 问题

1. virtual dom 是什么？
2. 说一下 diff 算法？





# Virtual DOM

是一种编程概念。UI 以一种理想化、虚拟化的形式被保存在内存中，通过 `ReactDOM` 等库与真实的 DOM 同步。通过对比、更新的方式来协调每次更新后的 DOM。

==虚拟 DOM 就是 js 对象，通过对象保存 DOM，然后更新时用 diff 算法进行对比。==

React 中，虚拟 DOM 里面具体的东西存在 `fibers` 对象中，这个后面说。



## 优势

下面是真实的 DOM 节点 `div` 中所有的 key：

<img src="images/%E6%88%AA%E5%B1%8F2021-02-14%20%E4%B8%8B%E5%8D%885.52.34.png" alt="截屏2021-02-14 下午5.52.34" style="zoom:50%;" />

如果想通过比较真实 DOM，显然很庞大，不可能实现。

所以才引出虚拟 DOM，也就是 js 对象存储每次产生的新对象，和旧的进行对比。这个 js 对象存在内存中，可以批量的、最小化进行 DOM 操作。



# JSX

## 原理

JSX 是语法糖，本质就是 `React.createELement(...)`

`babel-loader` 会预编译 JSX 变成 `React.createElement(...)` 。



## 与 vue 异同

- react中虚拟 dom+jsx 的设计⼀开始就有，vue 则是演进过程中才出现的。 
- jsx本来就是 js 扩展，转义过程简单直接的多；把 template 编译为 render 函数的过程需要复杂的编译器转换字符串-ast-js函数字符串。







# vDom

算法复杂度为 O(n)。以往的通用方法采用生成一棵树转换成另外一棵树的最小操作数，复杂度是 O(n^3^)。所以 React 的优化方式有以下三种：

1. 两个不同类型的元素会产生出不同的树
2. 不同层级之间的比较不做，直接抛弃。
3. 开发者通过 `key` `props` 来暗示那些子元素在不同渲染下能保持稳定。

## diff 策略

1. 同级比较，
2. 有不同类型的两个组件会产生不同的树结构。
3. 通过 `key` 和 `props` 来暗示哪些元素能在不同渲染中保持稳定。





## diff 过程

==对比两个虚拟 DOM 时有三种操作：删除、替换和更新。==

- 更新：有相同的 key 但是 vnode 和newVnode 不同时更新。
- 替换：前后 vnode 类型不同或 key 不同。
- 删除：没有 newVnode 时。

[官方文档](https://zh-hans.reactjs.org/docs/reconciliation.html)

### 性能优化

**传统的 diff 算法对比时，如果碰到一组更新的列表：**

1. 尾部插入新元素：先匹配到 `first` 树，再匹配到 `second` 树，最后发现需要更新，插入第三颗 `third` 树。
2. 在头部插入新元素：`Duke` 和 `Connecticut` 树一开始就没有匹配，会从一开始就重建每一个字元素。==性能损耗==

```js
// 1.在尾部插入新元素相当于给子树添加一个第三颗元素树，开销小
<ul>
  <li>first</li>
  <li>second</li>
</ul>
<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>

// 2.在头部插入新元素，对比时Duke
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```



**用了 key 之后：**

当每个子元素都有 key 时，React 就能知道具体是哪个 key 有变化。

```js
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

上述情况，会发现 2015 和 2016 的 key 对于的内容没有变化，所以不会进行销毁重建，只是在头部插入 2014 的内容。==key 只需要在列表中保持唯一就好，不用全局唯一==。

**如果数组下标作为 key 会发生什么情况？**

如果数组修改顺序时，会导致非受控组件的 state 相互篡改导致无法预期的变动

 

### 总结

- ==算法不会尝试匹配不同组件类型的子树。==当输入的更新内容相似时，建议改成同一类型，这样就不会出现整体重建情况。
- `Key` 应该具有稳定、可预测、列表内唯一的特点。





### diff 细节

以这个组件为例：

```js
class Test extends React.Component {
  state = {
    data: [{ key: 1, value: 1 }, { key: 2, value: 2 }]
  };
  componentDidMount() {
    setTimeout(() => {
      const data = [{ key: 0, value: 0 }, { key: 2, value: 2 }]
      this.setState({
        data
      })
    }, 3000);
  }
  render() {
    const { data } = this.state;
    return (
      <>
        { data.map(item => <p key={item.key}>{item.value}</p>) }
      </>
    )
  }
}
```





## Fiber

### 1. 为什么要 Fiber

在 React 15 版本的时候，我们如果有组件需要更新的话，那么就会递归向下遍历整个虚拟 DOM 树来判断需要更新的地方。这种递归的方式弊端在于无法中断，必须更新完所有组件才会停止。这样的弊端会造成如果我们需要更新一些庞大的组件，那么在更新的过程中可能就会长时间阻塞主线程，从而造成用户的交互、动画的更新等等都不能及时响应。

`Fiber` 重新实现了 React 的核心算法，带来了杀手锏增量更新功能。它有能力将整个更新任务拆分为一个个小的任务，并且能控制这些任务的执行。

 

### 2. 实现 `Fiber`

`window.requestIdleCallback(callback[, options])` 方法在浏览器空闲时段调用的函数排队。能够闲时循环上执行后台和低优先级工作。==在每一帧的加载时间中，完成该帧加载的剩余时间用来执行这些闲时工作。==

`Fiber` 就通过这种方式让 vDOM 进行增量式渲染。`React Fiber` 的更新过程分为两个阶段：`Reconciliation Phase` 和 `Commit Phase` 。



### 3. `fiber` 数据结构

`fiber` 可以认为是一个工作单元，执行更新任务的整个流程(不包括渲染)，就是在反复寻找工作单元并运行它们，这样就能把任务拆分。

拆分工作单元的目的就是为了让我们能控制 `stack frame` (调用栈的内容)，可以随时执行它们和按情况中断工作。

`fiber` 就是存储了很多上下文信息的对象，就是改进版的 vDOM，`fiber` 也会组成 `fiber tree` 。==它们是链表结构==。

<img src="images/%E6%88%AA%E5%B1%8F2021-02-15%20%E4%B8%8B%E5%8D%881.40.16.png" alt="截屏2021-02-15 下午1.40.16" style="zoom:33%;" />

```js
// fiber
{
  ...
  // 浏览器环境下指 DOM 节点
  stateNode: any,

  // 形成列表结构
  return: Fiber | null,
  child: Fiber | null,
  sibling: Fiber | null,

  // 更新相关
  pendingProps: any,  // 新的 props
  memoizedProps: any,  // 旧的 props
  // 存储 setState 中的第一个参数
  updateQueue: UpdateQueue<any> | null,
  memoizedState: any, // 旧的 state

  // 调度相关
  expirationTime: ExpirationTime,  // 任务过期时间

  // 大部分情况下每个 fiber 都有一个替身 fiber
  // 在更新过程中，所有的操作都会在替身上完成，当渲染完成后，
  // 替身会代替本身
  alternate: Fiber | null,

  // 先简单认为是更新 DOM 相关的内容
  effectTag: SideEffectTag, // 指这个节点需要进行的 DOM 操作
  // 以下三个属性也会形成一个链表
  nextEffect: Fiber | null, // 下一个需要进行 DOM 操作的节点
  firstEffect: Fiber | null, // 第一个需要进行 DOM 操作的节点
  lastEffect: Fiber | null, // 最后一个需要进行 DOM 操作的节点，同时也可用于恢复任务
  ....
}
```

==`fiber` 和 `Fiber` 不是一个东西。`fiber` 是数据结构，`Fiber` 是一种调和器。==



### 4. `Fiber` 调度器

每次有更新任务时，调度器会给任务分配优先级。比如动画更新优先级高，离屏元素的更新优先级会低。

调度器就会在优先级的截止日期之前用 `requestIdleCallback` 函数来进行浏览器空闲时候执行更新任务。









###  5. 具体 `diff` 过程

可以吧 Fiber 看成是加强版的 diff 算法。因为 diff 算法存在缺陷，无法终端，必须更新完才能停止。所以采用 `Fiber` 增量更新方式。

diff 算法会进行==循环寻找==，也就是自顶向下的一个循环：

1. 永远从 `root` 开始，无论之前有没有被打断工作。
2. 先判断当前节点是否存在第一个子节点，存在的话它就是下一个工作单元，不存在就让下一个节点继续寻找，执行该条规则，不存在就跳到规则 3。
3. 判断当前节点是否有兄弟节点。如果存在，就用规则 2，否则跳到规则 4。
4. 回到父节点并判断父节点是否存在。存在就执行 3，不存在就执行 5。
5. 当前工作单元为 null，完成了整个循环。































































