---
create: 2024-10-04
lang: zh
tags:
  - devtools
  - fastgpt
  - frontend
  - code
---

# 使用 Babel 生成自定义的 API 文档

## Babel

**Babel** 是一个 JavaScript 的编译器。

> 那么那位先生要问了，你 JavaScript 是解释型语言，为什么需要编译器呢?

实际上，Babel 的最初的功能是为了实现 ES6 到 ES5 的转换（在旧版本的引擎或浏览器中使用新的特性）。也就是说，
源代码和编译后的目标代码都是 js, 只不过编译后的代码不一定是具有人类可读性的代码。

在编译的过程中，`babel/parser` 会将源代码转换为 AST（抽象语法树），而 `babel/generator` 则将 AST 转换为目标代码。

我们要做的实际上就是通过 parse 出的 AST，来分析、提取，最后生成我们需要的结构和 API 文档.

如果你观察 `babel` 的 monorepo 的仓库，你会发现它可与分到三个部分：

1. `parser`: 实现 JavaScript 到 AST 的转换
2. `generator`: 实现 AST 到 JavaScript 的转换
3. `traverse`: 遍历 AST 的工具

> 使用 [AST Explorer](https://astexplorer.net/)
> 可以在线解析 JavaScript 代码，并查看 AST 树。

### parser

> 参考：https://babeljs.io/docs/babel-parser

```JavaScript /parse/
import { parse } from '@babel/parser';

const code = `
  function add(a, b) {
    return a + b;
  }
`;

const ast = parse(code, {
    plugins: ['typescript', 'jsx', 'flow'],
});
```

上述的代码解释了 parse 的使用：
传入一个 `string` 类型的 js 代码，
parse 将返回 AST 树

#### parser 插件

可选的 parser 插件有很多，例如:

- typescript 开启 typescript 插件
- flow 开启 flow 插件
- jsx 开启 jsx 插件

> 也可以使用自己自定义的 parser 插件，参考：
> https://www.babeljs.cn/docs/plugins

#### AST 树

通过 parser 解析出的 ast 树为一个`Program`对象，其
`body` 属性为一个列表，包含了这个文件从上到下的节点。

```
Program {
    body: [
        VariableDeclaration {},
        FunctionDeclaration {},
        ...
    ]
}
```

对于一个节点 (Node), 有不同的类型，可以参考
https://babeljs.io/docs/babel-types#api

对于遍历 AST 树的需求，可以使用 `babel/traverse` 模块。

### traverse

便于遍历 AST

```JavaScript
traverse(ast, {
  enter(path) {
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  },
});

traverse(ast, {
  FunctionDeclaration: function(path) {
        path.node.id.name = "x";
      },
});
```

使用 `enter` 来 _进入_ 一个节点，或者直接使用
node types 来对某种节点进行操作。

#### 访问者模式

访问者模式是一种设计模式。如果有一个复杂的类，就像 AST 树这样的
复杂的树结构，并且每个节点都有可能完全不同，
每个节点上可能有
相同的而不相关的操作。
可以考虑使用访问者模式。

访问者模式将创建一个独立的新的对象（也就是 visitor 对象），
将对 AST 树的操作委托到这个对象上。

> 参考： https://refactoringguru.cn/design-patterns/visitor

### generator

这个比较简单，直接给一个 AST 树结构，
和相应的 options 即可生成代码。

## FastGPT 后端代码结构

对于每个接口，
其文件路径和 url 是一一对应的，
在遍历的时候可以顺便获得。

```
import ...

export metadata = {
    name: 'example',
    description: 'example',
    author: 'example',
}

export type ExampleQuery = {}
export type ExampleBody = {}
export type ExampleResponse = {}

function handler(...) {
    ...
}

export default NextApi(handler)
```

在 handler 中可能存在鉴权的函数，其参数决定了这个接口的
鉴权方式。

我们需要做的是:

1. 获取三个类型的具体定义。
2. 获取元数据
3. 获取鉴权方式
4. 生成目标文档

### 获取类型定义

类型定义的 Node Type 是 `TypeAliasDeclaration`。
它有多种类型：

- TypeLiteral 表示这里定义的是一个对象，通过这个 TypeLiteral 的 members 把 properties 拿出来即可
- TypeReference 表示引用来一个其他的类型，这个类型可以直接把名字拿出来
- 其他的，例如 String, Number 等

### 获取元数据

元数据的 Node Type 是 `VariableDeclaration`。

## OpenAPI 规范

参考：https://openapi.apifox.cn/

可以进行构建 openapi 对象，然后使用工具 [redocly](https://redocly.com/) 生成 html

> 这部分代码在: https://github.com/labring/FastGPT/tree/main/scripts/openapi
