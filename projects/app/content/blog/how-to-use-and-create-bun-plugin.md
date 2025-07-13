---
lang: zh
create: 2025-07-14
tags:
  - bun
  - frontend
---

# Bun Plugin 怎么搞

最近搞了一个 FastGPT-plugin，使用 bun 作为 package manager 和 bundler。bun 的 build 在默认情况下已经足够强大了，但是如果需要在编译时对代码进行修改，则需要通过 plugin 来实现。

## Bun 和 bun plugin

[Bun](https://bun.sh/) 是一个以 **快速** 著称的 all-in-one 的工具。

Bun plugin 是 Bun 提供的一个 **通用的** 插件 API，可以用于拓展 runtime 和 bundler

## 构建一个 bun 的 plugin

可以引入 BunPlugin 类型来帮助构建 plugin：

```typescript
// myPlugin.ts
import type { BunPlugin } from 'bun';

const myPlugin: BunPlugin = {
  name: "Custom loader",
  setup(build) {
    // implementation
  },
};

export default myPlugin
```

官方文档中提供了 Loader, Virtual Module 等例子，我们可以直接从底层的类型定义开始看：

以下是官方文档中 Bun Plugin 的类型定义[^1]
```typescript
namespace Bun {
  function plugin(plugin: {
    name: string;
    setup: (build: PluginBuilder) => void;
  }): void;
}

type PluginBuilder = {
  onStart(callback: () => void): void;
  onResolve: (
    args: { filter: RegExp; namespace?: string },
    callback: (args: { path: string; importer: string }) => {
      path: string;
      namespace?: string;
    } | void,
  ) => void;
  onLoad: (
    args: { filter: RegExp; namespace?: string },
    callback: (args: { path: string }) => {
      loader?: Loader;
      contents?: string;
      exports?: Record<string, any>;
    },
  ) => void;
  config: BuildConfig;
};

type Loader = "js" | "jsx" | "ts" | "tsx" | "css" | "json" | "toml" | "object";
```

然而实际上在 `bun.d.ts`[^2] 中 build 参数对象还有几个 property，在官方文档中没有明确说明，我这里拷贝过来（去掉了 JSDoc 注释）：

```typescript
  interface PluginBuilder {
    onStart(callback: OnStartCallback): this;
    onBeforeParse(
      constraints: PluginConstraints,
      callback: {
        napiModule: unknown;
        symbol: string;
        external?: unknown | undefined;
      },
    ): this;
    onLoad(constraints: PluginConstraints, callback: OnLoadCallback): this;
    onResolve(constraints: PluginConstraints, callback: OnResolveCallback): this;
    config: BuildConfig & { plugins: BunPlugin[] };
    module(specifier: string, callback: () => OnLoadResult | Promise<OnLoadResult>): this;
  }

```

### `config`

可以使用这个 config 来修改 bun build 的 config，如官方的例子：

```typescript
await Bun.build({
  entrypoints: ["./app.ts"],
  outdir: "./dist",
  sourcemap: "external",
  plugins: [
    {
      name: "demo",
      setup(build) {
        console.log(build.config.sourcemap); // "external"

        build.config.minify = true; // enable minification

        // `plugins` is readonly
        console.log(`Number of plugins: ${build.config.plugins.length}`);
      },
    },
  ],
});
```

### `module`

使用 `module` 方法可以定义虚拟模块 (Virtual Module)，类似于 Jest / Vitest 中的 Module Mocking，只不过这种虚拟模块可以在开发环境、生产环境的 runtime 中使用。
> 官方文档：This feature is currently only available at runtime with `Bun.plugin` and not yet supported in the bundler, but you can mimic the behavior using `onResolve` and `onLoad`.
>
> 这个功能目前能在 Bun 的 runtime 中有效，并没有支持 bundler（也就是编译时）。但是可以使用 `onResolve` 和 `onLoad` 来实现相似的效果。

module 方法需要传入两个参数
1. specifier：string 类型，也就是这个模块的名字
2. callback: 函数，返回值有:
	1. loader: 可以看上面的 loader 的类型定义，有 `js`, `ts`, `object` 等
	2. contents: string，源码（当loader 为 `js`, `ts`时）
	3. exports: object, 当 loader 为 `object` 时。

下面是官方文档中的例子：
```typescript
import { plugin } from "bun";

plugin({
  name: "my-virtual-module",

  setup(build) {
    build.module(
      // The specifier, which can be any string - except a built-in, such as "buffer"
      "my-transpiled-virtual-module",
      // The callback to run when the module is imported or required for the first time
      () => {
        return {
          contents: "console.log('hello world!')",
          loader: "js",
        };
      },
    );

    build.module("my-object-virtual-module", () => {
      return {
        exports: {
          foo: "bar",
        },
        loader: "object",
      };
    });
  },
});

// Sometime later
// All of these work
import "my-transpiled-virtual-module";
require("my-transpiled-virtual-module");
await import("my-transpiled-virtual-module");
require.resolve("my-transpiled-virtual-module");

import { foo } from "my-object-virtual-module";
const object = require("my-object-virtual-module");
await import("my-object-virtual-module");
require.resolve("my-object-virtual-module");
```
### 生命周期 hook

#### 1. `onStart`

`onStart` 被触发于插件被使用的时候，可以做一些不依赖于某一个模块的，全局的设置。

```typescript
build.onStart(()=>{
	console.log("starting")
})
```

#### 2. `onResolve`

bun 的 bundler 定位这个文件的过程就叫 `resolve`，resolve 被触发于要寻找这个文件的过程中。

需要传入两个参数：
1. 第一个参数constraints，是一个对象：
	1. filter: 正则，用于匹配要修改的字符串
	2. namespace: 可选字符串。在 `import 'yaml:myConfig.yaml';` 中 `yaml` 就是 `namespace`
2. 第二个参数 callback 回调函数，处理匹配到的字符串用的。

#### 3. `onLoad`

onLoad 接收两个参数，第一个参数和 `onResolve` 的一样，用于过滤哪些文件会触发这个 hook，第二个参数传入的 callback 则是对这个模块本身的修改。
其返回值是一个模块，和上面的 `module` 的返回值一致。

这里官方提供一个 Transpiler API，用于对代码的简单处理：
```typescript
const transpiler = new Bun.Transpiler();
```

`transpiler` 并没有很全面的功能，只提供了四个函数：
1. `scan`，扫描import 和 export
2. `scanImport` 扫描 import（性能比 `scan` 好)
3. `transform` 从 JSX/TSX 转成 JS
4. `transformSync` 就是同步版本的 `transform`

#### 4. Native Plugin

build 还提供了一个 hook 叫 `onBeforeParse`，这个是供 Native plugin 使用的，使用 NAPI。

笔者没有深入了解这个内容，这里略过了。

```typescript
onBeforeParse(
  args: { filter: RegExp; namespace?: string },
  callback: { napiModule: NapiModule; symbol: string; external?: unknown },
): void;
```

## 使用 plugin

Bun 的 plugin 可以直接使用 plugin 函数在运行时使用：
```typescript
import { plugin } from 'Bun';
import customPlugin from 'customPlugin.ts';

plugin(customPlugin);
```

如果想在 Build 的时候使用，则可以使用：
```typescript
Bun.build({
	plugins: [customPlugin]
	// ...
});
```

如果在 bundler 中和在运行时都需要使用，则可以写一个 preload 脚本，并且在 bunfig 中进行配置。

```typescript
// path/to/preload.ts
import { plugin } from 'Bun';
import customPlugin from 'customPlugin.ts';

plugin(customPlugin);
```

```toml
# bunfig.toml
preload = ["path/to/preload.ts"]
```

## 思考

Bun 的插件 API 没有提供源代码的 AST 的直接访问，
如果插件需要对代码进行大规模的修改，
在 AST parser（如 Babel, SWC 等）中能更方便的进行修改，或许直接使用 rollup, rolldown 或者是 vite 这种构建工具会更好。

[^1]: [Plugins – Runtime \| Bun Docs](https://bun.com/docs/runtime/plugins#reference)
[^2]: 版本：@types/bun@1.2.18
