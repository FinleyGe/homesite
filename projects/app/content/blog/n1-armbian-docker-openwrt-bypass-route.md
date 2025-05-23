---
lang: zh
create: 2024-02-27
tags:
  - docker
  - migration
---

# n1 盒子安装 docker，docker 中安装 openwrt，openwrt 配置旁路由

去年[搞了一台 n1 盒子](https://elk.zone/g0v.social/@FinleyGe/111567320089503363)，寒假期间从海鲜市场淘来了一台中兴的千兆路由器 （型号是 E503），准备让 N1 盒子做旁路网关，实现软路由（主要目的是实现透明的魔法）

现在我的（宿舍）网络拓扑图如下：

```txt
[百兆宽带] -- [E503路由器]（主路由 192.168.123.1 ）--wlan-- 无线终端设备（手机等）
					|
					├-- (lan1) -- 电脑 (192.168.123.123)
					├-- (lan2) -- N1 盒子
									|--- 192.168.123.250 Armbian
									├--- 192.168.123.251 openwrt 旁路由
```

旁路网关就是把内网中的终端设备的网关设置为旁路由的网关(192.168.123.251)，而旁路由的网关设置为主路由网关（192.168.123.1），如是，则内网中的所有流量都将经过旁路由的转发，再到主路由。

除了手动设置网关外，可以通过 DHCP 自动设置网关。

## n1 刷入 Armbian

由于我购入的 n1 已经刷入过 openwrt，直接插入烧录好的 U 盘即可从 U 盘启动
我使用的 Armbian 固件是：Armbian_24.2.0_amlogic_s905d_bullseye_6.6.15_server_2024.02.01.img.gz
可以从
[Releases · ophub/amlogic-s9xxx-armbian · GitHub](https://github.com/ophub/amlogic-s9xxx-armbian/releases)
获取

> 如何选择版本? 参考:
> [DebianReleases - Debian Wiki](https://wiki.debian.org/DebianReleases)

我选择的是 Bullseye，较老的版本。我希望尽量使用 docker 管理我 n1 盒子上的各种应用，因此 debian 的版本并不重要。

下载后解压得到镜像文件 `.img`

```
gzip -d file.img.gz
```

（如你所见，我是在 Linux 环境下进行操作的）

Linux 下推荐的烧录工具是 Etcher

```
paru -S etcher-bin
```

烧录后，插入 n1 盒子 （据称推荐插入靠近网口的那个 usb 口），启动后进入 U 盘内的 armbian 系统。

默认的 `root` 密码是`1234`

输入 `nand–sata-install` 烧录 Armbian 到 eMMC

## docker 安装

先换源

```bash
vi /etc/apt/source.list
apt update
```

使用`armbian-config`配置固定的网络地址

```bash
vi /etc/network/interface.d/static
```

这将在新建一个文件叫 static
输入如下内容，注意根据你的具体情况设置。

```txt
auto eth0
allow-hotplug eth0
iface eth0 inet static
address 192.168.123.250
netmask 255.255.255.0
gateway 192.168.123.1
dns-nameservers 192.168.123.1
```

- address 是 armbian 的地址（自定义）
- gateway 写主路由的 ip 地址
- dns-nameservers 可以写主路由的 ip，也可以写 dns 服务器

使用 `armbian-install` 安装 docker

## 使用 docker 安装 openwrt

开启网卡的混杂模式（即接收内网中所有数据包，无论其目的地是否是本地）

```bash
ip link set eth0 promisc on
```

将这句命令加入

```bash
vi /etc/rc.local
```

首先使用 macvlan 创建给 openwrt 用的 network

```bash
docker network create -d macvlan \
--subnet=192.168.123.0/24 --gateway=192.168.123.1 -o parent=eth0 macnet
```

开 openwrt 容器

```bash
docker run --restart always -d --name openwrt --network macnet --privileged unifreq/openwrt-aarch64
```

进去修改 root 密码

```bash
docker exec -it openwrt bash
passwd
```

修改 ip 地址

```bash
vi /etc/config/network
```

在 `interface 'lan'` 里面改

```txt
option proto 'static'
option ipaddr '192.168.123.251'
option gateway '192.168.123.1'
```

此时可以在内网的终端设备上通过 `192.168.123.251` 访问 `luci` 界面进行配置。

## 配置旁路网关

### openwrt 中

网络-接口-lan 设置：
基本设置：

- 协议：静态
- ipv4: 192.168.123.251
- 网关: 192.168.123.1
- 自定义 DNS: 114.114.114.114, 223.5.5.5
  高级设置：
- 勾选强制链路
  物理设置：
- 取消桥接接口
- 接口选择 eth0

在下面的 DHCP 高级设置中勾选`动态 DHCP` 和 `强制`

DHCP 选项输入:

- `3,192.168.123.251` (路由器)
- `6,192.168.123.251` (DNS 服务器)

### 主路由中

关闭 DHCP

## 设置 openwrt 插件

由于众所周知的原因此处略去，需要提示的一点是不一定要开启 旁路网关兼容，需要试一试。

## 参考

- [DebianReleases - Debian Wiki](https://wiki.debian.org/DebianReleases)
- [amlogic-s9xxx-armbian/README.cn.md at main · ophub/amlogic-s9xxx-armbian · GitHub](https://github.com/ophub/amlogic-s9xxx-armbian/blob/main/README.cn.md)
- [2022-7-29 Docker Openwrt r22.07.07-斐讯无线路由器以及其它斐迅网络设备-恩山无线论坛](https://www.right.com.cn/forum/thread-958173-1-1.html)
- [2024-1-27 87 版 KVM,Rock5b,N1,S905x3,S922x,贝壳/我家云,vplus,R66S/68S 等-OPENWRT 专版-恩山无线论坛](https://www.right.com.cn/forum/thread-4076037-1-1.html)
- [DHCP 选项编号](http://help.sonicwall.com/help/sw/chi/7730/26/2/4/content/Network_DHCP_Server.042.12.html)
