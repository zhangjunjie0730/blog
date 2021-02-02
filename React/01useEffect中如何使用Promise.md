**useEffect 的回调参数只能返回一个用于清除副作用的 clean-up 函数。**

```js
useEffect(()=>{
  document.addEventListener('click',()=>...);
  return document.removeEventListener('click',()=>...)
})
```

类似于上述的清除函数，所以无法作为 Promise 函数的返回。

如果想要在 useEffect 中使用 Promise 函数，就需要在外层写好一个函数，然后放在 useEffect 的回调函数中。

```js
const fetchData = async()=>{
  let res = await axios('http://...');
  setList(res.data);
}
useEffect(()=>{
  fetchData();
},[]);
```



