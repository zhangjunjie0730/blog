# React 概述

- React 负责逻辑控制：data => vDOM
- ReactDom 负责实际渲染：vDOM => DOM
- JSX => 描述界面 UI
- `babel-loader` ：JSX => JS 对象。
- `React.createElement` ：JS 对象 => vDOM





# CSS 模块化

[规则文档](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)

`css` 模块化：

```react
import style from './index.module.css';
<img className={style.logo} />
```



`scss` 使用：

```react
npm i sass -D

import style from './index.module.scss';
<img className={style.logo} />
```







# 生命周期函数

## 定时器的使用

**类组件中**：

```react
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ date: new Date() });
    }, 1000);
  }
  // 定时器一定要在组件销毁时卸载
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  componentDidUpdate() {
    console.log('timer is undating');
  }
  render() {
    return (
        <div>{this.state.date.toLocaleTimeString()}</div>
    );
  }
}
```



**Hooks 中** ：

```react
function App() {
  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return <div>{date.toLocaleTimeString()}</div>;
}
```







































