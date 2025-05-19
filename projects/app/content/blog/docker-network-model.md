---
lang: zh
tags:
  - docker
create: 2024-03-17
---

# Docker 网络模型

在[之前的文章](https://www.f1nley.xyz/blog/n1-armbian-docker-openwrt-bypass-route)中，
我曾经使用 Docker 的 Macvlan 网络在内网创建了一台 OpenWrt 主机作为旁路网关。

那么 Docker 的网络究竟有哪几种，每种网络模型都是什么样的呢？

Docker 的网络模型一共有六种:

- bridge: 默认的桥接网路
- host: 去除了宿主机和容器的网络隔离
- none: 完全将容器和宿主机、以及其他容器隔离
- ipvlan: 完全控制 ipv4 和 ipv6 协议
- macvlan: 给容器分配一个 MAC 地址
- overlay: 连接多个容器和宿主机

## Bridge

> 网桥 [桥接器 - 维基百科，自由的百科全书](https://zh.wikipedia.org/zh-cn/%E6%A9%8B%E6%8E%A5%E5%99%A8)
> 网桥是一种在**数据链路层**将多个网段连接在一起变成一个子网的设备

对于 Docker 来说则是一样的道理。在同一个 Bridge 网路中的容器之间能够相互通信。

容器在没有经过任何配置的默认情况下，就是 Bridge 模式。
容器将连接到默认的 `bridge` 网路。
而宿主机则与默认的 `bridge` 连接，宿主机作为网关，转发容器的网络请求，使容器可以进行网络请求。

我们使用的 `-p 8080:80` 参数则相当于 **端口转发**。其本质是将外部的请求通过网桥传入容器。

### 用户定义的 Bridge

当然除开默认的 `bridge`，用户还可以自定义网桥设备。
最主要的作用是可以与默认的网桥隔离开来。

```
docker network create test-bri
```

将创建一个网桥。

## Host 模式

Host 模式的容器和 Docker 宿主机共享同一个网络命名空间（ Networking namespace )，容器并没有自己的 ip

```bash
docker run --network=host --name=a1 -d -i alpine:latest
docker exec -it a1 /bin/sh

# in the container:
ip a
```

你将得到和宿主机一样的输出

这种模式有两个应用场景：

1. 优化性能
2. 容器需要处理很多很多端口

## None 模式

None 模式顾名思义就是没有配置网络：完全隔离自己和其他的容器以及虚拟机。

## IPvlan 和 MACvlan

最主要的功能是把容器的的网络接口和宿主机变成同一等级。

这一功能是 Linux 内核实现的（要求 4.2 版本以上）

> 之后可能再写一篇博客研究一下内核层面是如何实现的

IPvlan 和 MACvlan 的最主要区别就是设备的 MAC 地址是否相同。

> 开启 vlan 需要首先将网卡开启混杂模式（也即接受所有的网络信息）

```bash
ip link set eth0 promisc on
```

### IPVlan L2 和 L3

一个物理接口只能选择一个模式（要么 l2，要么 l3）

- L2，容器的 ip 和 主机在同一个子网内
- L3，容器的 ip 和主机不在同一子网内，容器之间可以相互通信（即使不是同一子网，只要共享同一个物理接口），主机的子网内的设备无法访问容器

### MACvlan

```bash
docker network create -d macvlan \
  --subnet=172.16.86.0/24 \
  --gateway=172.16.86.1 \
  -o parent=eth0 pub_net
```

使用上述命令创建一个桥接的 MACVlan，需要指定三个内容：

1. 子网网段
2. 子网网关
3. 物理接口

## Overlay 模式

在多 Docker 主机的情况下使用（笔者几乎没有这种使用场景）
实现多主机之间的容器通信。
具体还是参考官方文档来吧，笔者没有条件和场景使用这种技术

[Overlay network driver | Docker Docs](https://docs.docker.com/network/drivers/overlay/)

## 测试 Docker 网络的小技巧

可以使用 alpine 镜像进行测试。通过如下语句创建一个运行中的 alpine 镜像

```bash
# 创建：
docker run --name=a1 -d -i alpine:lates
# hint: -d 表示在后台运行, -i 表示交互模式运行
# 删除：
docker rm -f a1
# hint: 使用 -f 就不用管是不是在运行了
```

## 个人的一些想法

感觉最常用的应该是 ipvlan l2 / macvlan 和 bridge。

如果暴露的端口较少，例如数据库（MySQL 的 3306, Postgres 的 7654），完全可以使用 Bridge 模式 Publish 端口出来用。

如果暴露的端口是少见且特有的端口（例如 Syncthing 的 8384, 22000）则完全可以使用 host 模式

而如果需要暴露更多的端口，或者是有更复杂的服务（例如要跑一个私有的 gitlab，或者是 omv），那么应该使用 vlan 的方式吧。

## 参考文献

- [docker 的 4 种网络模型 - 知乎](https://zhuanlan.zhihu.com/p/559977397)
- [Networking overview | Docker Docs](https://docs.docker.com/network/)
- [桥接器 - 维基百科，自由的百科全书](https://zh.wikipedia.org/zh-cn/%E6%A9%8B%E6%8E%A5%E5%99%A8)
