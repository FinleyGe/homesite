---
lang: zh
create: 2023-06-29
tags:
  - backend
  - code
  - migration
---

# 线程、进程、协程

程序的并发实现方式，常见的无非如题所述的三种：
线程、进程和协程。本文将总结三者的区别，以及在 python 和 golang 等语言中的实际应用。

## 并发、并行、异步、同步

- 并发 (Concurrency)，是指在同一段时间内执行多个程序
- 并行（Parallelism），是指在同一刻有多个程序在同时执行

并发可以理解为两个（或多个）程序表现上能*同时*进行。
而真正意义上的同时，对于单核 CPU，真正意义上的**并行**（在某一个时刻，同时运行多个程序）并不存在。

因此从直白的说，**并发**是一种程序的调度技术，使 CPU 的空闲时间降低，而大大提高效率。

CPU 本身也有并发技术，如**中断机制**、**流水 CPU**、**DMA**等等，这并非是本文的重点。

- 异步（Asynchrony)，是指多个程序的运行并没有时间上的顺序关系
- 非阻塞（Non-blocking），是指程序的执行过程中不存在等待，是异步的实现
- 同步（Synchrony)，和异步相对，程序的运行有时间上的顺序，通常会有阻塞
- 阻塞 (Blocking)， 是指任务执行过程中的暂停或等待，通常是为了实现**同步**

在时序逻辑电路中也有同步和异步的概念，同步的时序逻辑电路通常引入一个统一的时钟信号。

### 并发安全

程序的并发需要考虑的一个问题就是并发安全。

对于一段数据，由于并发的存在，可能存在脏读的情况。
一般的解决方式是通过加锁的方式，产生一定程度上的阻塞，从而避免并发导致的数据冲突。

能避免由于并发而造成的数据冲突的数据结构称之为并发安全的（或是线程安全的）

## 线程

线程 (Thread) 是 CPU 调度的最小单位。也就是说子线程的执行先后顺序是由 CPU 决定调度的。

一个**进程**可以有多个线程。

### Python 中多线程的实现

```python
import threading

def sub_program(name: str) -> None:
    for _ in range(5):
        print(f'Hello {name}')

def main() -> None:
    threads = [threading.Thread(target=sub_program, args=(str(i),)) for i in range(10)]
    for thread in threads:
        thread.start()

if __name__ == '__main__':
    main()
```

## 进程

进程 (Process) 是计算机资源分配的最小单位，是**并行**。

以下是 Python 实现多进程

### Python 多进程的实现

```python
import multiprocessing

def sub_program(name: str) -> None:
    for _ in range(5):
        print(f'Hello {name}')

def main() -> None:
    pool = multiprocessing.Pool(5)
    for i in range(5):
        pool.apply_async(sub_program, args=(str(i),))
    pool.close()
    pool.join()

if __name__ == '__main__':
    main()
```

## 协程

协程 (Coroutine), 也叫微线程。
是在一个线程内异步执行，
需要程序自己进行调动（而不是 CPU 去调动）
资源消耗相比线程来说更小。

### Python 协程的实现

```python
import asyncio

async def sub_program(name: str) -> None:
    for _ in range(5):
        print(f'Hello {name}')

async def main() -> None:
    await asyncio.gather(*[sub_program(str(i)) for i in range(5)])


if __name__ == '__main__':
    asyncio.run(main())
```

## 并发开销

总的来说，资源开销: 协程 < 线程 < 进程。

## GIL 锁

GIL （全局解释器锁）是指只能有一个线程解释执行 Python 的字节码。
这是因为一些 Python 的解释器（例如 CPython）的实现不是线程安全的，
通过 GIL 可以避免多个线程访问修改同一数据。

GIL 的存在对于 CPU 密集型的任务来说，可能会影响多线程的性能。也是 Python 为人诟病的一点。

## Goroutine

Go 在语言层面支持并发操作得益于 Go 的 Goroutine.
Goroutine 是一种协程的实现。
而相比 Python 在协程上的繁琐程度，Go 通过关键字 `go` 可以实现并发。

例如下面的一段样例，
该样例模拟的是两个输入设备，一个设备等待用户的输入，而另一个设备每隔 1s 进行一次输入。

```python
import asyncio

async def func():
    while True:
        await asyncio.sleep(1)
        print('ran')

async def func2():
    print(await asyncio.get_running_loop().run_in_executor(None, input, '>'))

async def main():
    await asyncio.gather(func(), func2())

asyncio.run(main())
```

而 `Golang` 的实现相比而言就简单很多

```go
package main

import (
	"fmt"
	"time"
)

func func1() {
	for {
		time.Sleep(1 * time.Second)
		fmt.Println("ran")
	}
}

func func2() {
	var input string
	fmt.Print(">")
	fmt.Scanln(&input)
	fmt.Println(input)
}

func main() {
	go func1()
	for {
		func2()
	}
}
```

作为对比，上述代码的多线程版本（python）

```python
import threading
import time

def func():
    while True:
        time.sleep(1)
        print('ran')

def func2():
    print(input('>'))

x = threading.Thread(target=func)
x.start()
while True:
    func2()
```
