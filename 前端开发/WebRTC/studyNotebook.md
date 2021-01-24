# 飞书训练营笔记

飞书技术栈：Electron -> WebRTC音视频通信

## 1. Electron开发桌面客户端

- 跨平台（write once，run everywhere）
- 丰富的原生UI定制能力（如：托盘，原生菜单）
- 可以通过native add-on提供原生能力

![image-20201119191006984](studyNotebook.assets/image-20201119191006984.png)



## 2. 初识WebRTC

### WebRTC的信令协商过程

![image-20201119191632584](studyNotebook.assets/image-20201119191632584.png)





























# 一、WebRTC概述

**音视频处理 + 即使通讯的开源库**

能做什么呢？

- 音视频实时互动
- 游戏、即时通讯、文件传输等
- 百宝箱：传输、音视频处理（回音消除、降噪等等）

能学到什么？

- 音视频设备访问与管理 —— 跨平台
- 音视频数据的采集
- 数据的传输与实时互动

- WebRTC的工作机制

互动demo：appr.tc



# 二、WebRTC的架构

![image-20201119134635104](studyNotebook.assets/image-20201119134635104.png)



## 目录结构

![image-20201119135357273](studyNotebook.assets/image-20201119135357273.png)

![image-20201119135546472](studyNotebook.assets/image-20201119135546472.png)

 

![image-20201119180617534](studyNotebook.assets/image-20201119180617534.png)

![image-20201119180725725](studyNotebook.assets/image-20201119180725725.png)



## 运行机制

### 轨与流

- **Track**
- **MediaStream**

### 重要类

- **MediaStream**

- ⭐ **RTCPeerConnection**
- **RTCDataChannel**

底层原理：

![image-20201119181421783](studyNotebook.assets/image-20201119181421783.png)



![image-20201119181440979](studyNotebook.assets/image-20201119181440979.png)



# 三、环境搭建

## Web服务器

- Nodejs
- Nginx
- Apache

## Web服务工作原理

![image-20201119181840075](studyNotebook.assets/image-20201119181840075.png)

## Nodejs工作原理

![image-20201119181942742](studyNotebook.assets/image-20201119181942742.png)

**Javascript解析过程**

![image-20201119182041808](studyNotebook.assets/image-20201119182041808.png)

**Nodejs时间处理**

![image-20201119182101592](studyNotebook.assets/image-20201119182101592.png)

**两个V8引擎**

![image-20201119182348040](studyNotebook.assets/image-20201119182348040.png)





## HTTPS服务

不是 https 服务，chorme 不允许打开摄像头等操作。

HTTPS = HTTP + TLS/SSL (加密)

<img src="studyNotebook.assets/image-20201119182632907.png" alt="image-20201119182632907" style="zoom:67%;" />

### Nodejs搭建HTTPS服务

- 生成 HTTPS 证书
- 引入 HTTPS 模块
- 指定证书位置，创建 HTTPS 服务





