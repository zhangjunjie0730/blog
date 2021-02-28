# FormData的作用

1. 模拟 HTML 表单，相当于把表单映射成表单对象，自动将表单对象中的数据拼接成请求参数的格式。
2. ==异步上传二进制文件。==

## 使用

```js
var form = document.querySelect('form');
var formData = new FormData(form);
...
xhr.send(formData)

// 服务端，用formidable模块来解析
const form = new formidable.IncomingForm();
// err错误对象 fields保存了表单当中的普通请求参数 files保存的是文件上传相关信息
form.parse(req, (err, fields, files) => {
  res.send(fields);
})
```



### `FormData` 对象常用方法

```js
const formData = new FormData(form);
// 1.get 获得表单中name对于属性的内容值
formData.get('username'); // zhangsan
// 2.set 设置值 如果属性存在=>覆盖。如果不存在=>创建
formData.set('key', 'value'); // 例如发布文章时没有写发布时间，可以在这里设置为当前时间
// 3. delete
formData.delete('key'); // 比如用户需要输入确认密码，但是表单提交时并不需要两次密码，可以把确认密码删掉。
// 4. append 和set的区别：append如果属性存在，会保存两个值！！
formData.append('key', 'value'); // 可以创建一个空对象，自己追加内容
```

![截屏2021-02-25 上午9.53.07](images/%E6%88%AA%E5%B1%8F2021-02-25%20%E4%B8%8A%E5%8D%889.53.07.png)

通过 `append` 方法，确实可以看到两个 username 属性。**但是，服务端如果不特殊设置，默认接受最后一个，也就是覆盖操作。**



## 上传文件操作

```js
<input type="file" id="file" />
  
var file = document.querySelect('#file');
file.onchange = function(){
	var formData = new FromData();
  // 追加文件，随意设置文件名
  formData.append('attrName', this.files[0]);
  xhr.open('post', 'www....');
  xhr.send(formData);
  xhr.onload = function (){
		if(xhr.status === 200){
      console.log(xhr.responseText);
    }
  }
}

// 服务器端
app.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, 'upload'); //设置文件存储路径
  form.keepExtensions = true; //设置保留文件后缀
  form.parse(req, (err, fields, files) => {
    do something...
    res.sen('ok')
  })
})
```



## 文件上传进度展示

```js
file.onchange = function () {
  xhr.upload.onprogress = function(e){
		bar.style.width = (e.loaded / e.total) * 100 + '%'
  }
}
```





## 实现图片即时预览

能够实现的原理：

1. `files.attrname.path` 可以获取到传过去的图片在服务端的==硬盘地址==。
2. ==静态资源文件可以通过服务端的地址加上静态资源地址访问到==。

```js
form.parse(req, (err, fields, files) => {
  // path直接获得的是完整的硬盘地址，要把它分割为：pulic/uploads
	res.send({
		path: files.attrName.path.split('public')[1],
  });
})

// 客户端拿到地址后，就把图片放在img标签中
xhr.onload = function (){
	var res = JSON.parse(xhr.responseText);
  var img = document.createElement('img');
  img.src = res.path;
  // onload就相当于它们自带的异步方式，图片的src被请求过来后才会加载
  img.onload = function(){
		box.appendChild(img); //加载完成后才显示到页面中
  }
}
```

为什么要动态创建 `img` 标签而不是直接放在页面中事先准备好的 `img` 中？

因为放入事先准备好的，会让用户看到加载过程。动态创建时，等到加载完成才会把 `img` 追加到页面上，用户体验好。













