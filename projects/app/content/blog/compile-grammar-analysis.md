---
lang: zh
create: 2024-01-17
tags:
  - migration
  - compilePrinciple
---

# 编译原理（二）：语法分析

进行语法分析后得到了 token 流，对 token 流进行分析以得到语法树的过程是语法分析。
语法分析分为两种：

1. 自顶向下的语法分析
2. 自低向上的语法分析

这个方向的定义是来源于树的产生方式。

## Context-free Grammar

使用上下文无关语法进行语法定义。

```text
S -> a | b | c
```

非终结符产生（推导到）终结符。

### 二义性

一个文法可以产生多棵分析树，则为二义性文法。
例如 **悬空 else 问题**:

有语法:

```text
S -> if C then S
| if C then S else S
| id := E
C -> E = E | E < E | E > E
E -> E + E | E - E | id
```

```text
if x<3 then
	if x>0 then
		x:=5
else x:=-5 // 这个 `else` 是哪个 if 的 else ?
```

消二意义性：

```text
S -> MS | UMS
MS -> if C then MS else MS
	| id := E
UMS -> if C then S |
	if C then MS else UMS
// 其他的一样
```

## 自顶向下语法分析

从起始符号开始挑选合适的产生式，从而推导出句子
如果能顺利推导出，则说明符合语法规则，选择的产生式则可以绘制出语法树。

### LL(1)

从左（L）向右读入一个程序，最左（L）推导，采用一个（1）前看符号

使用**分析表** 进行分析（避免回溯）

- FIRST（$\alpha$）：$\alpha$中所有的终结符集，可能为 $\varepsilon$
- FOLLOW$(A)$：非终结符 $A$ 后紧跟的终结符
- SELECT($A \to \alpha$)
  - 若 $\alpha\neq \varepsilon$，且$\alpha \not\implies^+ \varepsilon$则为 FIRST($\alpha$)
  - 若 $\alpha \neq \varepsilon$且 $\alpha \implies^+ \varepsilon$则为 FIRST($\alpha$) $\cup$ FOLLOW(A)
  - 若 $\alpha = \alpha$ 则 FOLLOW(A)

分析表是一个二维数组 `M[A，a]`，其中 A 表示行，是非终结符，a 表式列是终结符或 `#`

- `M[A，a]` 中若有产生式，表明 A 可用该产生式推导，以求与输入符号 a 匹配。
- `M[A，a]` 中若为空，表明 A 不可能推导出与 a 匹配的字符串

构造表格：

若 $\alpha ∈SELECT(A \to \alpha)$，则把 A→α 加至 M[A, a] 中

定理：同一非终结符的 SELECT 交集为空集，则该文法是 LL(1) 文法

### 左公因子问题

```
A -> aB|aC
```

修改为

```
A -> aM
M -> B|C
```

### 左递归问题

如果存在形如

```
A -> Ab | a
```

的语法规则，则称为左递归（可以一直调用产生式 `A->Ab` 陷入死循环）

改为

```text
A -> aB
B -> bB
   | ε
```

则可以消除左递归问题

## 自底向上分析

对于输入串 $\omega$ **规约** 到语法规则。（最左规约则为最右推导）

**移入-规约**分析
移入：移入分析栈中
规约：应用语法规则，规约到非终结符

关键问题：

1. 识别**句柄**（每次规约的部分）

LR 分析器结构：

- 分析表
- 状态栈，符号栈

分析表：`M[S, A, G]`
S 表示状态，A 表示 Action 表， G 表示 GOTO 表

Action 表中的每一列是 终结符，GOTO 则是非终结符
Action 中:

- sn 表示 将符号和状态 n
- rn 表示 利用第 n 个产生式进行规约
- GOTO 表示遇到某非终结符后进入的后继状态
- acc 是成功接受状态。

### LR(0)

从左到右读入，最右推导，采用 0 个向前看。

右部某位置标有圆点的产生式称为相应文法的一个`LR(0)`项目（简称为项目）。

$$
A \to A \cdot A
$$

**增广文法**：如果 G 是一个以 S 为开始符号的文法，则 G 的`增广文法`G’ 就是在 G 中加上新开始符号 S’ 和产生式 S’ → S 而得到的文法。

引入这个新的开始产生式的目的是使得文法开始符号仅出现在一个产生式的左边，从而使得分析器只有一个接受状态。

- $A \to \cdot BCD$ 移入项目
- $A \to B \cdot CD$ 待约项目
- $A \to BC \cdot D$ 待约项目
- $A \to BCD \cdot$ 规约项目

![](https://img-blog.csdnimg.cn/20200725114221274.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjgxNTYwOQ==,size_16,color_FFFFFF,t_70)

项目存在等价情况：当圆点后的符号是非终结符时。等价项目组成一个闭包，形成自动机的一个状态。

LR(0) 文法存在冲突的情况（包括移入/规约冲突和规约/规约冲突）
如果 LR(0)分析表中`没有`语法分析动作`冲突`，那么给定的文法就称为`LR(0)文法`。

不是所有 CFG 都能用 LR(0)方法进行分析，也就是说，CFG 不总是 LR(0)文法。

### SLR(0)

带有一点展望的 LR 分析
考虑有如下状态

- $X \to a \cdot b\beta$
- $A \to a \cdot$
- $B \to a \cdot$
  应该使用哪一个规则进行规约？
  求 FOLLOW （A）和 FOLLOW（B），若没有交集，则
- $a \in FOLLOW(A)$ ，则用 A 规约
- 否则用 B 规约

### LR(1)

每个项变成形如 $A \to a \cdot B, \$$的形式，跟随的后缀则是继承上一级的后缀。
初始的后缀为 $。后缀由 FIRST( $\alpha$ ) 产生。
例如有 $S \to \cdot L = R, \$$ ，则需要产生一个 $L \to \dots, =$

当点处于最后一位的时候，如果输入为后缀，则使用对应的规则进行规约。
参考：

- [自下而上的语法分析——LR(0)和 SLR 分析\_lr(0)和 slr()-CSDN 博客](https://blog.csdn.net/weixin_55267022/article/details/118095586)
- [《编译原理》构造 LL(1) 分析表的步骤 - 例题解析 - xpwi - 博客园](https://www.cnblogs.com/xpwi/p/11065006.html)
