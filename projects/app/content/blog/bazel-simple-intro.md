---
lang: zh
create: 2023-05-05
tags:
  - migration
  - projectManagement
  - code
---

# Bazel 简略介绍

为什么要用到这个*奇怪*的东西呢？
原因是要写 cpp 的课程设计，题目是一个简单的用户管理系统。
但是可以在这个基础上拓展。
很多同学选择了老师推荐的 Qt 框架

但是 Qt 毕竟和我已有的知识相去甚远（而且也是古代的东西）

思来想去可以通过 grpc 框架生成 cpp server 代码（实际上还是参考了不少资料）
GUI 则通过现代化的 flutter 框架实现。

cpp 引入 grpc，据 grpc github 官方 repo 中的说法，他们团队使用的构建工具就是 bazel

于是决定干脆学一下这个奇怪的东西。

_为什么不学 cmake 呢？因为笔者认为 cmake 也是古代的技术，既然都要学，为什么不学新的技术？对于 Qt 也同理。_

## 什么是 Bazel

[Bazel](https://bazel.build/): Google 开发的与 make, maven 等类似的
开源的构建和测试工具。

使用 Bazel 的项目结构是很简单的

项目的根目录由 `WORKSPACE` 文件标识，
这个文件通过也担任 bazel 的项目设置的功能。

分支子目录则由 `BUILD` 文件标识。

需要注意的是上述的两个文件，都使用 `Starlark Language`

> Starlark Language 实际上是 Python 的一个方言，但是实际上不用管这么多。。
> 更多请参考：[GitHub - bazelbuild/starlark: Starlark Language](https://github.com/bazelbuild/starlark)

也可以参考笔者的 cpp 课设项目：[GitHub - FinleyGe/cpp-curriculum-design-employee: Cpp Curriculum Design: employee management](https://github.com/FinleyGe/cpp-curriculum-design-employee)

### BUILD

一般只有两种:

```
cc_library(
	name = "name",
	srcs = [],
	hdrs = [],
	deps = [],
)

cc_binary (
	name = "name",
	srcs = [],
	hdrs = [],
	deps = [],
)
```

library 顾名思义是只产生中间文件，binary 则是生成二进制可执行文件。

### WORKSPACE

workspace 应该很少需要自己写，需要引入第三方依赖的时候才需要进行修改。

例如：

```
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive") # 导入 http_archive
http_archive(
    name = "hedron_compile_commands",
    url = "https://github.com/hedronvision/bazel-compile-commands-extractor/archive/ed994039a951b736091776d677f324b3903ef939.tar.gz",
    strip_prefix = "bazel-compile-commands-extractor-ed994039a951b736091776d677f324b3903ef939",
)
load("@hedron_compile_commands//:workspace_setup.bzl", "hedron_compile_commands_setup")
hedron_compile_commands_setup()

```

`http_archive` 可以引入特定版本的第三方依赖，注意到 hash 部分实际上为 github 的 commit 的 hash.

## 遇到的问题

### 1. \#include

如果使用相对引用的方式，那么编译的时候就会出现找不到文件的问题。
举个例子

例如有项目结构如下：

```
./lib/time.hpp
./lib/time.cpp
./lib/BUILD
./src/test.cpp
./src/BUILD
./WORKSPACE
```

其中 `test.cpp` ，如果正常通过相对引用的方式：

```cpp
#indluce "../lib/header.hpp"
```

而使用了 bazel，则需要修改成

```cpp
#include "lib/header.hpp"
```

但是此时 lsp 服务器就会傻掉，需要在 WORKSPACE 中引入

```starlark
http_archive(
    name = "hedron_compile_commands",
    url = "https://github.com/hedronvision/bazel-compile-commands-extractor/archive/ed994039a951b736091776d677f324b3903ef939.tar.gz",
    strip_prefix = "bazel-compile-commands-extractor-ed994039a951b736091776d677f324b3903ef939",
)
load("@hedron_compile_commands//:workspace_setup.bzl", "hedron_compile_commands_setup")
hedron_compile_commands_setup()
```

然后使用命令 `bazel run @hedron_compile_commands//:refresh_all`

本质上这将生成包括`.gitignore`在内的给 clangd 等 lsp-server 参考的配置文件。

参考：[GitHub - hedronvision/bazel-compile-commands-extractor: Goal: Enable awesome tooling for Bazel users of the C language family.](https://github.com/hedronvision/bazel-compile-commands-extractor)

### 2. 引入 grpc

毕竟 grpc 也是 google 全家桶的一环，想到引入之或许是相对简单的。
但是实际上也花了笔者相当大的力气。

在`.proto`所在目录的`BUILD`中写入

```starlark
package(default_visibility = ["//visibility:public"]) # 全局可见

load("@rules_proto//proto:defs.bzl",
"proto_library")
load("@com_github_grpc_grpc//bazel:cc_grpc_library.bzl",
"cc_grpc_library")
load("@com_github_grpc_grpc//bazel:grpc_build_system.bzl",
"grpc_proto_library")

grpc_proto_library(
name = "api",
srcs = ["api.proto"],
) # 这里需要手动修改
```

在引用了 grpc 生成的代码的 BUILD 文件写入

```
cc_binary (
  name = "server",
  srcs = ["server.cpp"],
  deps = [
    "//api:api", # 你的api
    "@com_github_grpc_grpc//:grpc++",
    "@com_github_grpc_grpc//:grpc++_reflection",
    # 还有其他deps
  ],
)
```

`WORKSPACE`中写入

```
http_archive(
    name = "com_github_grpc_grpc",
    urls = [
        "https://github.com/grpc/grpc/archive/51a1f3ca034a30749ae9271d330f39af5fa4261a.tar.gz",
    ],
    strip_prefix = "grpc-51a1f3ca034a30749ae9271d330f39af5fa4261a",
)

load("@com_github_grpc_grpc//bazel:grpc_deps.bzl", "grpc_deps")
grpc_deps()
load("@com_github_grpc_grpc//bazel:grpc_extra_deps.bzl", "grpc_extra_deps")
grpc_extra_deps()
```

### 3. 无法编译

前一天还可以编译运行的代码第二天就编译不了了 ，什么问题呢？

报的奇怪的错`undeclared inclusion(s)`

在 `StackOverflow`上找到了解决方法，删除 bazel 的所有缓存

这应当是一个很多问题通用的解决方法。

```bash
rm -rf ~/.cache/bazel
```

参考
[c++ - bazel "undeclared inclusion(s)" errors after updating gcc - Stack Overflow](https://stackoverflow.com/questions/48155976/bazel-undeclared-inclusions-errors-after-updating-gcc/48524741#48524741)

### 4. 需要使用 C++14 ?

```
build --action_env=BAZEL_CXXOPTS="-std=c++14"
```
