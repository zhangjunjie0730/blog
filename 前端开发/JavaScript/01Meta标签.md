`meta` 标签可以设置用户浏览器 cookie，页面的 SEO 优化信息等。

有两个部分：`http-equiv` http 标题信息和 `name` 页面描述信息。



# `http-equiv`

```html
// 1.设置内容类型Content-Type，帮助浏览器精确显示内容;还能设置Content-Language
<Meta http-equiv="Content-Type" Content="text/html; Charset=utf-8" />
// 2.设置cookie
<Meta http-equiv="Set-Cookie" Content="name=zhangsan; expries=Wednesday, 21-Oct-98 12:12:34 GMT; patch=/" />
// 3.设置停留时间，到5秒后自动刷新到Url地址
<Meta http-equiv="Refresh" Content="5; Url=http://www..." />

// 4.显示窗口的设定Window-target，强制页面在当前窗口以独立页面显示。防止别人在iframe中调用你的页面
<Meta http-equiv="Window-target" Content="_top" />
// 5.Page-Enter/Exit：页面载入和调出时的一些特效
<Meta http-equiv="Page-Enter" Content="blendTrans(Duration=0.5)" />
<Meta http-equiv="Page-Exit" Content="blendTrans(Duration=0.5)" />
```







# `name`

```html
// 1.Keywords
<Meta name="Keywords" Content="keywords1,keywords2,..." />
// 2.Description
// 3.Author
// 4.Copyright
```

