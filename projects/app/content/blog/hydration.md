---
lang: zh
tags:
  - frontend
create: 2024-09-27
---

# 水合(Hydration)到底是什么

水合到底是什么？

## 水合的定义

维基百科上对“水合”这一化学概念的定义是：

> 在化学中，水合反应（hydration reaction），也叫作水化，是一种化学反应，
> 其中物质与水结合。
> 在有机化学中，将水加入不饱和底物中，该底物通常是烯烃或炔烃。
> 这种类型的反应在工业上用于生产乙醇，异丙醇，和 2-丁醇
> [维基百科](https://zh.wikipedia.org/zh-cn/%E6%B0%B4%E5%90%88)

也就是说，水合就是把水加入到物质中，从而形式一种新的物质。

在 Nuxt 的官方文档中，有一个简短的定义：

> 在浏览器中使静态页面具有交互性被称为“水合”。

可以这样理解：

1. 服务器上进行一部分的渲染，并且将这一部分返回给浏览器，相当于水合反应之“底物”
2. 在浏览器中，Vue.js 就相当于水
3. 而把 Vue.js 和 HTML 结合起来，使页面有交互性，这就是水合。

实际上 Nuxt 支持如下几个渲染模式：

1. 通用渲染，也就是上面水合的描述过程，也是 Nuxt 的默认行为。
2. 客户端渲染，即不进行 SSR，完全在浏览器中进行渲染。（就像最开始写 Vue，通过 Vite 构建的 SPA）
3. 混合渲染，一部分页面可以在服务器上渲染，另一部分则是客户端渲染.
4. 边缘渲染, 这是 Nuxt3 提供的强大功能. 也就是借助 CDN 技术, 可以在距离用户最近的边缘服务器上进行渲染. 其本质是一种部署方式.

## useHydration

```ts
useHydration <T> (key: string, get: () => T, set: (value: T) => void) => {}
```

- key: 唯一标识符
- get: 设置默认值(服务端使用, 返回一个值)
- set: 前端获取服务端拿来的值

官方文档中对 useHydration 的描述很少, 只是说它主要在内部使用, 例如 useAsyncData 中使用了它.
通过 useHydration 可以实现对水合的完全控制.

## useAsyncData 和 useFetch 的区别

官方提到了 useFetch 和 useAsyncData('', () => $fetch(...)) 没有什么区别。
useAsyncData 可以使用其他的非 fetch 方式来获取数据，例如通过 fs 获取文件内容。

通过 useAsyncData 可以以 SSR 友好的方式获取数据。

目前我通过 useFetch 获取 Nuxt server 暴露的一个接口 api 来获取已经编译好的博客 jsx 内容 （避免二次编译）。
在选用混合渲染的情况下，将 blog 相关的页面进行预渲染。
Google Lighthouse 可以有一个很好的 Performance 指标。
