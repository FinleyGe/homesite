---
lang: zh
tags:
  - Golang
  - backend
create: 2024-01-01
---

# 为什么 Golang

## 序言

本文是为了 《编译原理》期末大作业而准备的。
本文将讨论 Golang 的特点

## 直观 —— 奇怪而严格的语法

还记得在高中的时候，接触到 Golang 只觉得这个语言的语法很**奇怪**
例如变量声明，要使用 `var` 标识符声明，变量名竟然在类型名前面

```go
var Variable int
```

而语法又莫名严格
例如如下语句是无法编译的：

```go
func function(a int) error
{   // ERROR!
	// ...
	return nil
}
```

因为强制要求大括号不换行

如下语句也是不行的

```go
a := [
	1,
	2,
	3 // error!
]
```

需要改成

```go
a := [
	1,
	2,
	3, // end comma is nessceary
]
```

对于访问控制也是很奇怪，首字母大写就是 Public，小写就是 private

## 没有 Class —— 拥抱函数范式

存在一个类似 Class 的 `struct`

```go
type User struct {
	ID uint64
	Name string
}
```

但是并没有 C++ 中所说的五大函数（析构函数、移动赋值、拷贝赋值、拷贝复制、移动赋值）

所以一般认为 Golang 不是面向对象的。

### 函数范式

将电脑运算视为函数运算，避免使用程序状态以及可变物件。

[lambda 演算](https://zh.wikipedia.org/wiki/%CE%9B%E6%BC%94%E7%AE%97)

| 语法   | 名称   | 描述                                                                        |
| ------ | ------ | --------------------------------------------------------------------------- |
| x      | 变量   | 用字符或字符串来表示参数或者数学上的值或者表示逻辑上的值                    |
| (λx.M) | 抽象化 | 一个完整的函数定义（M 是一个 lambda 项），在表达式中的 x 都会绑定为变量 x。 |
| (M N)  | 应用   | 将函数 M 作用于参数 N。 M 和 N 是 lambda 项。                               |

函数作为 **头等对象**，一个函数既可以作为其他函数到输入参数值，也可以从函数中返回。

在其他语言中（例如 Python, C++) 存在 Lambda 表达式这一实现 **闭包** 的语法。

```python
sum = x1, x2: x1 + x2
```

```cpp
auto sum = [](int a, int b){return a + b}
```

在 Golang 中并不存在 lambda 表达式，而函数作为头等对象，可以作为变量、参数、返回值等等使用

```go
var f func(int) int

func main() {
	f = func(x int) int {
		return x + x
	}
	fmt.Println(f(2)) // 4
}
```

一个将 string 类型转换为 int 类型的实例如下

```go
scanner := bufio.NewScanner(os.Stdin)
scanner.Scan()
id_string := scanner.Text()
var id int
id = func(str string) (i int) {
	i, _ = strconv.Atoi(str)
	return
}(id_string)
fmt.Println(id)
```

## Golang 的编译器

Golang 是 [自举](<https://zh.wikipedia.org/wiki/%E8%87%AA%E4%B8%BE_(%E7%BC%96%E8%AF%91%E5%99%A8)>) 的。

> 在[计算机科学](https://zh.wikipedia.org/wiki/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6 "计算机科学")中，**自举**是一种自生成编译器的技术——也就是，某个[编程语言](https://zh.wikipedia.org/wiki/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80 "编程语言")的[编译器](https://zh.wikipedia.org/wiki/%E7%BC%96%E8%AF%91%E5%99%A8 "编译器")（或[汇编器](https://zh.wikipedia.org/wiki/%E6%B1%87%E7%BC%96%E5%99%A8 "汇编器")）是该语言编写的。

Golang 源代码通过四个步骤编译为可执行文件：

1. 词法、语法分析
2. 类型检查和 AST（Abstract Syntax Tree) 转换
3. 通用 SSA (Static Single Assignment, 静态单赋值) 的中间代码生成
4. 机器代码生成

静态单赋值可以减少重复赋值造成的浪费。

```go
a := 123 // waste !
a = 234
```

> Golang 使用 LALR（1）语法

### 交叉编译

Golang 可以进行交叉编译

Golang 生成的中间代码是平台无关的，可以生成不同的机器码（arm64, x86_64, WASM)

下面简单介绍一下 WASM
WebAssembly，是一个在 **栈虚拟机** 上使用的二进制指令格式。设计目标是在浏览器上提供一种具有高可移植性的目标语言。

WASM 并不是用来代替 JS 的。

以下是一个 Golang 编写的 WASM 例程

```go
// main.go
package main

import "syscall/js"

func main() {
	alert := js.Global().Get("alert")
	alert.Invoke("Hello, WebAssembly!")
}
```

```html
// index.html
<html>
  <script src="static/wasm_exec.js"></script>
  <script>
    const go = new Go();
    WebAssembly.instantiateStreaming(
      fetch("static/main.wasm"),
      go.importObject
    ).then((result) => go.run(result.instance));
  </script>
</html>
```

编译选项和依赖库

```bash
GOOS=js GOARCH=wasm go build -o static/main.wasm

cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" static
```

### 增量编译

由于 Golang 要求每个源文件显式声明所属包、引入包，以及静态检查循环引入的机制
Golang 的增量编译可以使 Golang 编译得极快。

### 静态类型 vs 动态类型

对于编程语言又一个 “强弱类型”的模糊概念。
js，python 是弱类型的， c++, java 是强类型的。

而静态类型和动态类型是指，类型是否可以在执行时判断。因此一般而言，编译型语言多是强类型，而解释型语言多是弱类型。

存在的特例是 TypeScript。
TypeScript 是强类型的，但是在执行时没有类型（只有 js 的六个类型）

支持反射的语言（例如 Java、Golang）也在执行时提供类型判断。

Golang 存在一个神奇的 Any 类型。
分析源码可以发现

```go
type Any interface{}
```

## Interface

接口定义对象的行为。

```go
package main

import "fmt"

type Animal interface {
	Speak() string
}

type Dog struct{}
type Cat struct{}

func (d Dog) Speak() string {
	return "Wolf!"
}

func (c Cat) Speak() string {
	return "Mewo!"
}

func main() {
	animals := []Animal{Dog{}, Cat{}}
	for _, val := range animals {
		fmt.Println(val.Speak())
	}
}
// output:
// Wolf!
// Cat!
```

```go
func (c Cat) Purr() {
	return "Purr!"
}

dog.Purr() // ERROR
animal := Animal(Cat{}) // which is a animal
animal.Purr() // ERROR
```

### interface{}

需要注意的是 interface{} 虽然被称为 any，但是实际上它不是 any（或者说，根本上就应该认为 any 是另一个类型）

一切类型都实现了 interface{} 接口，因此所有类型都是 interface{}

```go
func fun(a interface{}) {
	fmt.Println(a)
}
```

这个函数接受所有类型的参数，但是当然，其内部的处理也只能局限在 interface{}

使用反射，可以输出这个参数的类型

```go
package main

// import ...

func showType(a interface{}) {
	fmt.Println(reflect.TypeOf(a))
}
type A struct {
}

func main(){
	var a A
	fun(a) // main.A
}
```

golang 官方 fmt 库中通过 interface{} 实现的格式化打印十分强大，
在"fmt"库中有如下函数

```go
func Println(a ...any) (n int, err error) {
	return Fprintln(os.Stdout, a...) // 调用 Fprintln，将参数写入 Stdout
}

func Fprintln(w io.Writer, a ...any) (n int, err error) {
	p := newPrinter()
	p.doPrintln(a)
	n, err = w.Write(p.buf)
	p.free()
	return
}

func (p *pp) doPrintln(a []any) {
	for argNum, arg := range a {
		if argNum > 0 {
			p.buf.writeByte(' ') // 如果多于一个参数，则在参数之间写入空格
		}
		p.printArg(arg, 'v') // 打印参数，并且有一个 v 的参数
	}
	p.buf.writeByte('\n') // 最后换行
}

func (p *pp) printArg(arg any, verb rune) {
	p.arg = arg
	p.value = reflect.Value{} // 反射

	if arg == nil { // 是 nil
		switch verb {
		case 'T', 'v':
			p.fmt.padString(nilAngleString) // "<nil>"
		default:
			p.badVerb(verb) // verb 不对，报错
		}
		return
	}
	switch verb {
	case 'T':
		p.fmt.fmtS(reflect.TypeOf(arg).String()) // 使用 reflect 返回字符串
		return
	case 'p':
		p.fmtPointer(reflect.ValueOf(arg), 'p') // 指针, 使用 reflect
		return
	}
	switch f := arg.(type) {
		// ... 对 不同类型的 arg 的处理，不需要反射
			default:
		if !p.handleMethods(verb) {
			// Need to use reflection, since the type had no
			// interface methods that could be used for formatting.
			p.printValue(reflect.ValueOf(f), verb, 0)
		}
	}
	}

// in reflect package
type Value struct {
	typ_ *abi.Type // 类型
	ptr unsafe.Pointer // 指针
	flag // type flag uintptr，字节操作
}
```

## 高并发 Goroutine

Go 支持 **语言级** 并发

### 进程、线程、协程

https://blog.f1nley.xyz/post/code/concurrency/

### Goroutine

Go 语言的调度器通过使用与 CPU 数量相等的线程减少线程频繁切换的内存开销，同时在每一个线程上执行额外开销更低的 Goroutine 来降低操作系统和硬件的负载。

```go
func fun() {
	for {
		// ...
	}
}
go fun() // 开一个协程
```

### 上下文机制

```go
type Context interface {
	Deadline() (deadline time.Time, ok bool) // 这个上下文被取消的时间
	Done() <-chan struct{} // 当前工作完成或者上下文被取消的时候关闭
	Err() error // 错误处理
	Value(key interface{}) interface{} // 值
}
```

### 管道机制

channel 用于 goroutine 之间进行通信
下面给出一个优雅地结束服务器的例程

```go
func main() {
	// ...
	go func() {
		if err := server.Listen(":8080"); err != nil {
			log.Fatalln(err)
		}
	}()
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM) // listen to the signals
	<-quit // main goroutine is blocked here
	log.Println("Shutting Down")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second) // wait up to 5 secs to cancel
	defer cancel() // after shutdown
	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown", err)
	} else {
		log.Println("Server Exiting")
	}
}
```

## 高性能 GC

### 内存管理模式

1. C/C++ 的手动内存管理 (malloc, new, free)
2. Java, Python, Golang GC （Garbage Collective）垃圾回收机制
3. Rust 所有权机制

- 手动管理：看程序员个人水平，性能可能很高，也可能造成灾难性后果
- GC：程序员无需关心 GC 问题，一定存在的性能消耗。

GC 存在“内存开销”和“运算开销”之间的矛盾。

Java 的 GC 机制被称为 STW (Stop The World)。在执行垃圾回收时，Java 的所有线程被挂起，全局暂停。

Golang 的 GC 机制也是 STW，但是实现相当复杂。
Golang 的思路是尽可能降低 STW 造成的时延（微秒级），但是内存占用可能会较大。

Golang 使用 三色标记算法优化垃圾回收机制

#### 三色标记算法

- 白色对象 — 潜在的垃圾，其内存可能会被垃圾收集器回收；
- 黑色对象 — 活跃的对象，包括不存在任何引用外部指针的对象以及从根对象可达的对象；
- 灰色对象 — 活跃的对象，因为存在指向白色对象的外部指针，垃圾收集器会扫描这些对象的子对象；

1. 从灰色对象的集合中选择一个灰色对象并将其标记成黑色；
2. 将黑色对象指向的所有对象都标记成灰色，保证该对象和被该对象引用的对象都不会被回收；
3. 重复上述两个步骤直到对象图中不存在灰色对象；

## 对于开发者

### 1. gopls LSP Server

Golang 可以很方便的使用 gopls LSP 服务器提供编程时的协助

### 2. 社区环境

- Google 亲儿子
- `Gin` 轻量 Web 框架
- `GORM` ORM 框架
- `sql/driver` SQL 引擎
- `viper` 配置文件解析

## 参考

- https://draveness.me/golang/
- https://www.runoob.com/go/go-tutorial.html
