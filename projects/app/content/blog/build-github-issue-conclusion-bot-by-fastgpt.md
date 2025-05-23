---
lang: zh
tags:
  - fastgpt
create: 2024-10-14
---

# 使用 FastGPT 构建一个 Github issue 总结机器人

由于提 Issue 的开发者/用户很多，
我们希望有一个每天可以自动总结 issue 的机器人，
并自动发送结果到飞书群中，
这样可以快速浏览最近的问题和需求。

## Github issue 接口

> https://api.github.com/repos/{owner}/{repo}/issues

Github 提供上述的接口获取某个 repo 的 issue

默认筛选的是最近的 30 条 issues

> https://docs.github.com/zh/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues
>
> 参考 Github 的 API 文档以获得更多的信息

## 工作流搭建过程

### 1. 构造请求

![](https://www.f1nley.xyz/api/img/FOrotsak.png)

获取昨天的日期

```js
function main() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return {
    date: `${year}-${month}-${day}T${hours}:${minutes}:000Z`,
  };
}
```

构造请求并通过 Http 请求模块进行请求

### 2. 请求处理

![](https://www.f1nley.xyz/api/img/KlnS2mX9.png)

原始响应是一个 JSON 字符串，将字符串进行 parse 后进行处理

```js
function main({ res }) {
  const issues = JSON.parse(res);
  const ret = [];
  for (const issue of issues) {
    if (issue.pull_request) continue;
    ret.push({
      title: issue.title,
      body: issue.body,
      url: issue.html_url,
    });
  }

  return {
    ret: JSON.stringify(ret),
  };
}
```

由于 issue 接口会将 pull_request 也视为 issue 。只能在代码里面过滤

### 3. 调用大模型进行总结输出

![](https://www.f1nley.xyz/api/img/UKHuau2F.png)

提示词如下：

```txt
你是一个 Github Issue 的总结机器人。

## 任务

根据输入的多条 issue 信息， 总结其提出的问题， 并用中文输出。

## 输入格式：

输入的内容为一个 JSON 格式的数组， 其中 title 表示标题，
body 表示内容， url 表示跳转的 url

## 输出格式

总结内容后需要以 markdown 连接格式输出该条总结的来源 issue 。
你应该使用中文进行输出。
例如:

**1. 某某问题**
这个问题出现在某某处。
来源:

- [issue 标题](url)
- [issue 标题 2](url2)

```

### 4. 飞书 webhook 设置

![](https://www.f1nley.xyz/api/img/txisZh94.png)

### 5. 飞书机器人设置

在 botbuilder.feishu.cn 构建机器人应用/流程

![](https://www.f1nley.xyz/api/img/KLZ7Sk80.png)

![](https://www.f1nley.xyz/api/img/wEjGP2yz.png)

## 效果

![](https://www.f1nley.xyz/api/img/Vp1NKvho.png)
