---
lang: zh
create: 2024-07-24
tags:
  - devtools
---

# 使用 Tree-sitter Query 为 aerial.nvim 添加自定义 symbol

## aerial.nvim

Neovim 的 aerial.nvim 插件是一个提供 Outline 的插件。
但是写 React (Typescript) 的时候有一个问题是无法显示像 `useRequest` 等等 Hook 函数的位置。

### aerial.nvim 的配置

默认的 aerial.nvim 配置不显示 Symbol 为 `Contant` 和 `Varible` 内容。因此可以在配置文件中
手动进行如下配置

```lua
filter_kind = {
    "Class",
    "Constructor",
    "Enum",
    "Function",
    "Interface",
    "Module",
    "Method",
    "Struct",
    "Constant",
    "Variable",
},
```

## Symbol 和 Symbol Kind

复习一下编译器的工作流程（编译原理）：

1. 首先第一步要进行的是**词法分析**，也就是将一整个文本拆分成若干个 "Token"。
2. **语法分析**：将 token stream 解析为某个数据结构（例如 AST, Abstarct Syntax Tree）
3. **中间代码生成**：将上述的某个数据结构生成为中间代码
4. **目标代码生成**：生成对应平台的，对应架构的代码

对于 Tree-sitter, LSP 等等工具来说，只关心前两个步骤，因为是开发工具，而非编译器。

Tree-sitter 解析出的每个节点，都可以对应到 LSP 中的某个 Symbol.

参考: https://github.com/neovim/neovim/blob/master/runtime/lua/vim/lsp/protocol.lua
可以发现在 neovim 中提供了如下 26 种不同的 Symbol

```lua
SymbolKind = {
    File = 1,
    Module = 2,
    Namespace = 3,
    Package = 4,
    Class = 5,
    Method = 6,
    Property = 7,
    Field = 8,
    Constructor = 9,
    Enum = 10,
    Interface = 11,
    Function = 12,
    Variable = 13,
    Constant = 14,
    String = 15,
    Number = 16,
    Boolean = 17,
    Array = 18,
    Object = 19,
    Key = 20,
    Null = 21,
    EnumMember = 22,
    Struct = 23,
    Event = 24,
    Operator = 25,
    TypeParameter = 26,
},
```

## Tree-sitter 的三个概念

Tree-sitter 有三个很重要的概念:

1. parser: 自不必说，将源代码 parse 为 AST
2. query: 在 AST 中查询检索，使用 `scm` 进行
3. module: 模块化，可以拓展支持的源代码

本文关心的是 Query，也就是说如何在已经 parse 出来的 AST 中找到自己想要的东西。

### Query

使用 `scm` 进行 Query. 可以在 Tree-sitter 提供的官方 playgound: https://tree-sitter.github.io/tree-sitter/playground
中进行测试。

例如有如下语句：

```typescript
const { data, refetch, status } = useFetch(() => {});
```

如何能得到 `useFetch` 呢？

> 勾选 Query 选项以进行 Query 测试

```query
(lexical_declaration
	(variable_declarator
    	value: (call_expression
        	function: (identifier) @symbol
        )
    )
)
```

可以看到成功 query 到了 useFetch （和 @symbol 同色）

Query 语法：

1. 括号配对
2. node_type(也就是 lexical_declaration 等) 外面要有括号
3. 可以带 _field_（也就是上面的 value 等)

> 具体语法可以参考 https://tree-sitter.github.io/tree-sitter/using-parsers#pattern-matching-with-queries

在 Neovim 里面有

## 给 neovim 添加 query

参考 https://github.com/nvim-treesitter/nvim-treesitter?tab=readme-ov-file#advanced-setup

在配置文件的根目录的 `after/queries/tsx/aerial.scm` 中添加

下面是我上面提到的，解析出所有函数调用的一个示例：

```query
;; extends
(lexical_declaration
  (
   variable_declarator
   value: (
     call_expression
     function: (identifier) @name
     )
   (#set! "kind" "Constant")
  )
)@symbol
```

参考 Neovim 官方文档：https://neovim.io/doc/user/treesitter.html#_lua-module:-vim.treesitter.query

和 aerial 的 Github 仓库 README: https://github.com/stevearc/aerial.nvim?tab=readme-ov-file#treesitter-queries

需要提供 @name 和 @symbol 两个 `metadata`（通过 `#set!` 语句进行测试）

```
    set!                                          treesitter-directive-set!
        Sets key/value metadata for a specific match or capture. Value is
        accessible as either metadata[key] (match specific) or
        metadata[capture_id][key] (capture specific).
```
