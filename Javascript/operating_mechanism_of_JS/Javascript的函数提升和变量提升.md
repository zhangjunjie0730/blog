先看例子：

- 例 1：**变量提升**: 用变量存储函数，会一段一段执行，逐步改变

```javascript
var foo = function () {
  console.log('foo1');
};

foo(); // foo1，foo赋值

var foo = function () {
  console.log('foo2');
};

foo(); // foo2，foo重新赋值
```

- 例 2：**函数提升**: 原因 → 同一作用域下存在多个同名函数声明时，后面的会替换前面的函数声明！

```javascript
foo(); // foo2

function foo() {
  console.log('foo1');
}

foo(); // foo2

function foo() {
  console.log('foo2');
}

foo(); // foo2
```

- 例 3：**函数声明优先级>变量**： 说明函数时在**执行前就已经赋好值**了，变量属于执行时进行赋值的。

```javascript
foo(); // foo2

var foo = function () {
  console.log('foo1');
};

foo(); // foo1，foo重新赋值

function foo() {
  console.log('foo2');
}

foo(); // foo1
```
