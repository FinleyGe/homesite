---
lang: zh
tags:
  - interview
  - dingtalk
create: 2024-05-27
---

# 钉钉一面

## 笔试

有三个题目，使用 js 解决。

### 1. 实现一个函数，取交集并去重

```js
intersection([1, 2, 2, 3, 4, 5], [3, 3, 4, 5, 6, 7]); // [3, 4, 5]
```

笔者的答案:

```js
function intersection(a1, a2) {
  return a1.filter((e) => a2.includes(e));
}
```

> 这题给的样例输入并不好，实现的函数里面没有体现出去重。
> 因此在后续的面试中，面试官要求给出一个去重的算法。
>
> 我给出了一个比较笨的方法：使用快慢指针进行搜索，如果有相同，则删除一个。
>
> 在 js 中可以直接通过 Set 进行去重 `Array.from(new Set(array))`

### 2. 解析字符串的 Query Params

```js
parseQueryString("https://www.dingtalk.com/index.html?key0=0&key1=1&key2=2");
// output:
// {
//   key0: "0",
//   key1: "1",
//   key2: "2",
// }
```

笔者的答案：

```js
function parseQueryString(str) {
  const q = str.split("?")[1];
  if (!q) return {};
  const obj = {};
  for (const pair of q.split("&")) {
    const [key, value] = pair.split("=");
    obj[key] = value;
  }
  return obj;
}
```

> 这个答案可能并不是最好的，使用 `reduce` 函数构造对象可能更好，笔者现场没写出来。
> 参考： [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

### 3. 将数组解析为树，然后输出树的深度和最大子节点数

```js
let list = [
  { id: 1, name: "部门A", parentId: 0 },
  { id: 2, name: "部门B", parentId: 0 },
  { id: 3, name: "部门C", parentId: 1 },
  { id: 4, name: "部门D", parentId: 1 },
  { id: 5, name: "部门E", parentId: 2 },
  { id: 6, name: "部门F", parentId: 3 },
  { id: 7, name: "部门G", parentId: 2 },
  { id: 8, name: "部门H", parentId: 4 },
];

convert(list);
// output:
// [
//   {
//     "id": 1,
//     "name": "部门A",
//     "parentId": 0,
//     "children": [
//       {
//         "id": 3,
//         "name": "部门C",
//         "parentId": 1,
//         "children": [
//           {
//             "id": 6,
//             "name": "部门F",
//             "parentId": 3
//           }
//         ]
//       },
//       {
//         "id": 4,
//         "name": "部门D",
//         "parentId": 1,
//         "children": [
//           {
//             "id": 8,
//             "name": "部门H",
//             "parentId": 4
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "id": 2,
//     "name": "部门B",
//     "parentId": 0,
//     "children": [
//       {
//         "id": 5,
//         "name": "部门E",
//         "parentId": 2
//       },
//       {
//         "id": 7,
//         "name": "部门G",
//         "parentId": 2
//       }
//     ]
//   }
// ]

calculate(tree);
// output:
// {
//   maxDepth: 3,
//   maxChildrenCount: 2,
// }
```

笔者的答案：

```js
function convert(list) {
  const tree = [];
  for (const item of list) {
    if (item.parentId === 0) {
      tree.push(item);
    }
    for (const item2 of list) {
      if (item.id === item2.parentId) {
        if (!item.children) {
          item.children = [];
        }
        item.children.push(item2);
      }
    }
  }
  return tree;
}

function calculate(tree) {
  let maxDepth = 0;
  let maxChildrenCount = 0;

  function dfs(node, depth) {
    maxDepth = maxDepth < depth ? depth : maxDepth;
    if (node.children) {
      maxChildrenCount =
        maxChildrenCount < node.children.length
          ? node.children.length
          : maxChildrenCount;
      for (const child of node.children) {
        dfs(child, depth + 1);
      }
    }
  }

  for (const node of tree) {
    dfs(node, 1);
  }

  return { maxDepth, maxChildrenCount };
}
```

## 面试

面试通过电话进行，持续了约 56 分钟。以下为部分问题的摘录，其中顺序略有调整。

部分问题针对我个人，并没有普适性，所以没有摘录。

### Q1: 在日常开发过程中是否使用过 ES6 特有的语法？

- 使用过，箭头函数可能是最常用的 ES6 特性。（解释有什么区别，下一问题）
- 使用 const 和 let 取代 var. (var 有什么问题，为什么不用 var)
- 可选链操作符和 '??' 符
- Symbol 作为新的一个数据类型（举例是 Vue 的 Project/inject 的 Key）

> 还有一些特性没有提到，比如对象的结构和 for of 循环。

#### 箭头函数和普通函数有什么区别？

语法上，箭头函数比普通函数更加紧凑便利。最大的特点是箭头函数没有自己的 this。箭头函数的 this 是在定义时
获取的外部 this。是固定的。

有只能使用箭头函数的场景：防抖和节流函数的实现，（因为要涉及到 call(this), 不能使用普通函数定义)

#### var 有什么问题，为什么不推荐使用。

var 有一些历史遗留问题。var 的作用域只有全局作用域和函数作用域，因此在一些涉及到块作用域的情况下，有 var 的存在可能会造成问题。

使用 let 作为变量，则可以更好的使用作用域，避免很多问题的发生。

### Q2：Vue 和 React 的区别

我认为最主要的区别是数据绑定的原理不同。 vue 基于 proxy 实现数据的双向绑定，因此 vue 作为一个 mvvm 框架，
数据改变则视图改变，视图改变同样会造成数据改变。

而 react 默认认为组件是无状态的，需要使用 useState 来定义状态。状态发生改变则对组件进行重新渲染。

> 还有一些其他的区别，比如 diff 算法的不同。 Vue 对比节点，如果类型相同而 className 不同，则认为是不同类型的元素
> 进行删除重建，但是 react 会认为是同类型的节点，只会修改节点属性。
>
> vue 列表对比使用收尾指针法，而 react 采用从左到右依次对比的方法。
>
> 参考：[https://worktile.com/kb/ask/19606.html](https://worktile.com/kb/ask/19606.html)

### Q3 （没答上来）: 是否了解过浏览器的重绘(reflow)和重排(repaint)

> 1. HTML 被 HTML 解析器解析成 DOM 树；
> 2. CSS 被 CSS 解析器解析成 CSSOM 树；
> 3. 结合 DOM 树和 CSSOM 树，生成一棵渲染树(Render Tree)，这一过程称为 Attachment；
> 4. 生成布局(flow)，浏览器在屏幕上“画”出渲染树中的所有节点；
> 5. 将布局绘制(paint)在屏幕上，显示出整个页面。
>
> 在页面的生命周期中，网页生成的时候，至少会渲染一次。在用户访问的过程中，还会不断触发重排(reflow)和重绘(repaint)，不管页面发生了重绘还是重排，都会影响性能，最可怕的是重排，会使我们付出高额的性能代价，所以我们应尽量避免。
>
> 重绘不一定导致重排，但重排一定会导致重绘。
>
> 参考 [https://juejin.cn/post/6844904083212468238](https://juejin.cn/post/6844904083212468238)

### Q4（没答上来）: Taro 或者是 uni-app 的编译机制

> 笔者只用过一次啊。。怎么知道这个！
> 丢一篇参考文章：
>
> [https://juejin.cn/post/6983864416819216415](https://juejin.cn/post/6983864416819216415)

### Q5 (答上来了吗) ：Flutter 的跨平台是怎么实现的

Flutter 实际上也是 hybrid App，只不过性能比 React Native 或者是 Electron 这种要好。

> 丢一篇参考文章：
>
> [https://juejin.cn/post/6844903630584152072](https://juejin.cn/post/6844903630584152072)

### 还会问些啥

基本上除了上述的问题，还有就是看你简历里面写的项目经历，问一些相关的项目的具体问题。

还会问近期在学什么。
