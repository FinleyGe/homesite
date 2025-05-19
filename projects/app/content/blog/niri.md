---
lang: zh
tags:
  - linux
create: 2024-09-01
---

# Niri，一个可滚动平铺的 Wayland 组合器。

最近发现了这个新的 Wayland compositor，叫 [Niri](https://github.com/YaLTeR/niri).

> 有三个奇怪的概念：Wayland compositor, Desktop Environment, Window Manager.
>
> 1. Desktop Environment 也就是桌面环境，是一个集成化的环境，可以是基于 x11 的，也可以是基于 Wayland 的。比如 Gnome, Kde plasma
> 2. Window Manager 就是窗口管理器，它可以是 DE 的一部分，是 X11 的概念。例如 i3, kwin
> 3. Wayland compositor 是 wayland 的概念。它可以混成多个 wayland client。例如 sway, i3-wm, 以及这个 niri

## Niri 吸引我的理由

1. 滚动平铺：水平方向平铺，无限长, 添加窗口并不会导致窗口的大小改变。
2. 输入方式：鼠标，键盘，触摸板的支持很完整。
3. 配置简单，只需要一个 `config.kdl` 文件

## Xwayland 应用的问题

https://github.com/YaLTeR/niri/wiki/Xwayland

用 `xwayland-satellite` 几乎可以解决所有问题。但是它还是一个很新的项目:

1. 启动 `xwayland-satellite`
2. 使用 `env DISPLAY=:0` 来启动 xwayland 应用。

但是我在启动 `wechat-universal` 的时候它就崩溃了。

因此我用 `cage` 去启动 `wechat-universal`。

```bash
cage -- wechat-universal
```

同时使用 `clipboard-sync` 同步剪贴板。

## 其他配合应用

1. `mako` 通知
2. `waybar` 状态栏
3. `fuzzel` 搜索
