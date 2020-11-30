# 1. useRef 和 createRef 的区别

两者得到的东西都是一样的。但是：

**useRef，不是一个可以改变的量。每次 useRef 都会返回相同的引用。**

**createRef，可以变。每次渲染都会返回新的引用，也就是能随着值的变化而变化。**

具体参考：[博客文章](https://blog.csdn.net/frontend_frank/article/details/104243286)