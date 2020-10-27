JS 内存空间分为**栈(stack)**、**堆(heap)**、**池(一般也会归类为栈中)**。 其中**栈**存放变量，**堆**存放复杂对象，**池**存放常量，所以也叫常量池。

- 基本类型：--> **栈内存**（不包含闭包中的变量）
- 引用类型：--> **堆内存**，闭包中的变量保存在堆内存中，所以能够引用到闭包中的变量！
  最简单的闭包：

```javascript
function A() {
  let a = 1;
  function B() {
    console.log(a);
  }
  return B();
}
A(); // 1
```

`闭包`的简单定义是：函数 A 返回了一个函数 B，并且函数 B 中使用了函数 A 的变量，函数 B 就被称为闭包。

# 内存回收

JavaScript 有自动垃圾收集机制，垃圾收集器会每隔一段时间就执行一次释放操作，找出那些不再继续使用的值，然后释放其占用的内存。

- 局部变量和全局变量的销毁
  - **局部变量**：局部作用域中，当函数执行完毕，局部变量也就没有存在的必要了，因此垃圾收集器很容易做出判断并回收。
  - **全局变量**：全局变量什么时候需要自动释放内存空间则很难判断，所以**在开发中尽量避免使用全局变量**。
- 以 Google 的 V8 引擎为例，V8 引擎中所有的 JS 对象都是通过堆来进行内存分配的
  - **初始分配**：当声明变量并赋值时，V8 引擎就会在堆内存中分配给这个变量。
  - **继续申请**：当已申请的内存不足以存储这个变量时，V8 引擎就会继续申请内存，直到堆大小达到了 V8 引擎的内存上限为止。
- V8 引擎对堆内存中的 JS 对象进行**分代管理**
  - **新生代**：存活周期较短的 JS 对象，如临时变量、字符串等。
  - **老生代**：经过多次垃圾回收仍然存活，存活周期较长的对象，如主控制器、服务器对象等。

# 垃圾回收算法

**核心思想**：判断内存是否还使用。常用有两种：**引用计数**(现代浏览器不再使用)，**标记清除**(常用)。

## 引用计数

引用计数算法定义“内存不再使用”的标准很简单，就是看一个对象**是否有指向它的引用**。如果没有其他对象指向它了，说明该对象已经不再需要了。

```javascript
// 创建一个对象person，他有两个指向属性age和name的引用
var person = {
  age: 12,
  name: 'aaaa',
};

person.name = null; // 虽然name设置为null，但因为person对象还有指向name的引用，因此name不会回收

var p = person;
person = 1; //原来的person对象被赋值为1，但因为有新引用p指向原person对象，因此它不会被回收

p = null; //原person对象已经没有引用，很快会被回收
console.log(person); // 1
console.log(p); // { age: 12, name: null }, p指向person的地址, person重新赋值后地址里的对象仍然不变
```

**引用计数致命问题：循环引用**
如果两个对象相互引用，尽管他们已不再使用，但是垃圾回收器不会进行回收，最终可能会导致内存泄露。

```javascript
function cycle() {
  var o1 = {};
  var o2 = {};
  o1.a = o2;
  o2.a = o1;

  return 'cycle reference!';
}

cycle();
```

`cycle`函数执行完成之后，对象`o1`和`o2`实际上已经不再需要了，但根据引用计数的原则，他们之间的相互引用依然存在，因此这部分内存不会被回收。所以现代浏览器不再使用这个算法。IE 仍然使用。
**经典循环引用案例**

```javascript
var div = document.createElement('div');
div.onclick = function () {
  console.log('click');
};
```

变量 div 有事件处理函数的引用，同时事件处理函数也有 div 的引用，因为 div 变量可在函数内被访问，所以循环引用就出现了。

## 标记清除（常用）

标记清除算法将“不再使用的对象”定义为“无法到达的对象”。即从根部（在 JS 中就是全局对象）出发定时扫描内存中的对象，**凡是能从根部（在 JS 中就是全局对象）到达的对象，保留**。那些从根部出发无法触及到的对象被标记为不再使用，稍后进行回收。

**现在对于主流浏览器来说，只需要切断需要回收的对象与根部的联系。**

_简单来说：全局对象被标记，不会清除。_

**但也存在内存泄漏的问题**，例如：

```javascript
email.message = document.createElement(“div”);
displayList.appendChild(email.message);

// 稍后从displayList中清除DOM元素
displayList.removeAllChildren();
```

上面代码中，`div`元素已经从 DOM 树中清除，但是该`div`元素还绑定在 email 对象中，所以如果 email 对象存在，那么该`div`元素就会一直保存在内存中。

**标记清除 (Mark-and-sweep) **算法由以下几步组成：

- 1、垃圾回收器创建了一个“**roots**”列表。roots 通常是代码中全局变量的引用。JavaScript 中，“**window**” 对象是一个全局变量，被当作 root 。window 对象总是存在，因此垃圾回收器可以检查它和它的所有子对象是否存在（即不是垃圾）；
- 2、所有的 roots 被检查和标记为激活（即不是垃圾）。所有的子对象也被递归地检查。从 root 开始的所有对象如果是可达的，它就不被当作垃圾。
- 3、所有未被标记的内存会被当做垃圾，收集器现在可以释放内存，归还给操作系统了。

现代的垃圾回收器改良了算法，但是本质是相同的：可达内存被标记，其余的被当作垃圾回收。

# 内存泄漏

对于持续运行的服务进程（daemon），必须及时释放不再用到的内存。否则，内存占用越来越高，轻则影响系统性能，重则导致进程崩溃。 对于不再用到的内存，没有及时释放，就叫做内存泄漏（memory leak）

## 重点：四种常见 JS 内存泄漏

### 1. 意外的全局变量

- `bar` 忘记加 var 或 let，使 bar 称为全局变量

```javascript
function foo(arg) {
  bar = 'this is a hidden global variable'; // 实际是window.bar
}
```

- `this` 指向出错导致

```javascript
function foo() {
  this.variable = 'potential accidental global';
}

// foo 调用自己，this 指向了全局对象（window）
// 而不是 undefined
foo();
```

**解决办法**：在 JavaScript 文件头部加上 `'use strict'`，使用严格模式避免意外的全局变量，此时上例中的 this 指向 `undefined`。如果必须**使用全局变量存储大量数据时，确保用完以后把它设置为 null**或者重新定义。

### 2. 被遗忘的计时器或回调函数

- 节点 node 或者数据不再需要时，定时器依旧指向这些数据。所以哪怕当 node 节点被移除后，interval 仍旧存活并且垃圾回收器没办法回收，它的依赖也没办法被回收，除非终止定时器。

```javascript
var someResource = getData();
setInterval(function() {
    var node = document.getElementById('Node');
    if(node) {
        // 处理 node 和 someResource
        node.innerHTML = JSON.stringify(someResource));
    }
}, 1000);
```

- 对于下面观察者的例子，一旦它们不再需要（或者关联的对象变成不可达），**明确地移除它们非常重要**。老的 IE 6 是无法处理循环引用的。因为老版本的 IE 是无法检测 DOM 节点与 JavaScript 代码之间的循环引用，会导致内存泄漏。

```javascript
var element = document.getElementById('button');
function onClick(event) {
  element.innerHTML = 'text';
}

element.addEventListener('click', onClick);
```

**但是**，现代的浏览器（包括 IE 和 Microsoft Edge）使用了更先进的垃圾回收算法（标记清除），已经可以正确检测和处理循环引用了。即回收节点内存时，不必非要调用 `removeEventListener` 了。

### 3、脱离 DOM 的引用

如果把 DOM 存成字典（JSON 键值对）或者数组，此时，同样的 DOM 元素存在两个引用：一个在 DOM 树中，另一个在字典中。那么将来需要把两个引用都清除。

```js
var elements = {
  button: document.getElementById('button'),
  image: document.getElementById('image'),
  text: document.getElementById('text'),
};
function doStuff() {
  image.src = 'http://some.url/image';
  button.click();
  console.log(text.innerHTML);
  // 更多逻辑
}
function removeButton() {
  // 按钮是 body 的后代元素
  document.body.removeChild(document.getElementById('button'));
  // 此时，仍旧存在一个全局的 #button 的引用
  // elements 字典。button 元素仍旧在内存中，不能被 GC 回收。
}
```

如果代码中保存了表格某一个 `<td>` 的引用。将来决定删除整个表格的时候，直觉认为 GC 会回收除了已保存的 `<td>` 以外的其它节点。实际情况并非如此：此 `<td>` 是表格的子节点，子元素与父元素是引用关系。由于代码**保留了 `<td>` 的引用**，导致整个表格仍待在内存中。**所以保存 DOM 元素引用的时候，要小心谨慎。**

### 4、闭包

闭包的关键是**匿名函数可以访问父级作用域的变量**。

```js
var theThing = null;
var replaceThing = function () {
  var originalThing = theThing;
  var unused = function () {
    if (originalThing) console.log('hi');
  };

  theThing = {
    longStr: new Array(1000000).join('*'),
    someMethod: function () {
      console.log(someMessage);
    },
  };
};

setInterval(replaceThing, 1000);
```

每次调用 `replaceThing` ，`theThing` 得到一个包含一个大数组和一个新闭包（`someMethod`）的新对象。同时，变量 `unused` 是一个引用 `originalThing` 的闭包（先前的 `replaceThing` 又调用了 `theThing` ）。`someMethod` 可以通过 `theThing` 使用，`someMethod` 与 `unused` 分享闭包作用域，尽管 `unused` 从未使用，它引用的 `originalThing` 迫使它保留在内存中（防止被回收）。

**解决方法**：

在 `replaceThing` 的最后添加 `originalThing = null` 。

# 内存泄漏识别方法

## 1. 浏览器方法

1. 打开开发者工具，选择 Memory
2. 在右侧的 Select profiling type 字段里面勾选 timeline
3. 点击左上角的录制按钮。
4. 在页面上进行各种操作，模拟用户的使用情况。
5. 一段时间后，点击左上角的 stop 按钮，面板上就会显示这段时间的内存占用情况。

## 2. 命令行方法

```javascript
console.log(process.memoryUsage());

// 输出
{
  rss: 27709440,		// resident set size，所有内存占用，包括指令区和堆栈
  heapTotal: 5685248,   // "堆"占用的内存，包括用到的和没用到的
  heapUsed: 3449392,	// 用到的堆的部分
  external: 8772 		// V8 引擎内部的 C++ 对象占用的内存
}
```

# `WeakMap()`和`WeakSet()`

ES6 新出的两种数据结构：`WeakMap()` 和 `WeakSet()`，表示这是弱引用，它们对于值的引用都是不计入垃圾回收机制的。

```javascript
const wm = new WeakMap();
const element = document.getElementById('example');

wm.set(element, 'some information');
wm.get(element); // "some information"
```

先新建一个 `WeakMap()` 实例，然后将一个 DOM 节点作为键名存入该实例，并将一些附加信息作为键值，一起存放在 `WeakMap()`里面。这时，`WeakMap()`里面对 element 的引用就是弱引用，不会被计入垃圾回收机制。

# 常见面试题

**1. 从内存来看 null 和 undefined 本质的区别是什么？**

> 给全局变量赋值为 null 表示：将这个变量的指针对象以及值清空，JS 会回收全局变量为 null 的对象。给局部变量赋值为 null 时，相当于给局部变量分配了一块空的内存，值为 null。
>
> 给一个全局变量赋值为 undefined，相当于将这个对象的值清空，但是这个对象依旧存在。如果是给对象的属性赋值为 undefined，说明这个值为空值。

- 声明了一个变量，但未对其初始化时，这个变量的值就是 undefined

  ```javascript
  var data;
  console.log(data === undefined); // true
  ```

- 对于尚未声明过的变量，只能执行一项操作，即使用 `typeof` 操作符检测其数据类型，使用其他的操作都会报错。

  ```javascript
  //data变量未定义
  console.log(typeof data); // "undefined"
  console.log(data === undefined); //报错
  ```

**2. ES6 语法中的 const 声明一个只读的常量，那为什么下面可以修改 const 的值？**

```javascript
const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop; // 123

// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only
```

> `const` 实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，`const` 只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。因此，将一个对象声明为常量必须非常小心。
