---
lang: zh
tags:
  - git
  - linux
create: 2024-07-01
---

# 使用 Gitea 搭建私有 Git 服务器和 CI/CD

> 终于可以专注于文章内容了，应该暂时不需要再改代码了。

## 什么是 CI/CD，为什么要搞一套

现在搞完了发现其实没必要自己部署，Github Actions 可能完全够了。
但是搞了就是搞了，还能学到一些东西。

## 选择 Gitea 的理由

私有化部署的 Git 服务的选择其实不很多。如果对于企业来说，可能 Gitlab
更好（更重，功能更全）。

而对于我来说。使用更轻量的服务更为明智（毕竟自己的服务器
性能有限）

而之前使用的 gogs 没有集成 ci/cd。尝试配置 drone 后发现有一大堆坑。

> https://github.com/gogs/gogs/issues/7172
>
> 例如这个。如果 drone 重启后则无法直接通过 oauth 登入。
> 这个 issue 这么长时间还没有 ok 也是醉了

## 安装 Gitea

直接用 Docker compose 安装 gitea.

使用 [Dockge](https://github.com/louislam/dockge) 管理 compose
(Dockge 里面称作 stack，堆栈)
是更为方便的。（笔者已经使用很长时间了）

这是 Gitea 官方提供的 compose.yaml

```yaml /@version@/
version: "3"

networks:
  gitea:
    external: false

services:
  server:
    image: gitea/gitea:@version@
    container_name: gitea
    environment:
      - USER_UID=1000
      - USER_GID=1000
    restart: always
    networks:
      - gitea
    volumes:
      - ./gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"
      - "222:22"
```

注意修改上面的 `version`，可以直接去掉（获取 latest）

访问 3000 端口即可进行其他的配置。

### 配置 act-runner

如果要使用 action 功能，则必须配置 act-runner

参考 https://docs.gitea.com/zh-cn/usage/actions/act-runner 进行配置

## 编写 action

Gitea 的 action 被设计为与 Github Actions 兼容。但是也存在一些区别，详细请参考
https://docs.gitea.com/zh-cn/usage/actions/comparison

在 `.gitea/workflows/NAME.yaml` 里面写即可。

这是本项目编译和部署的 action:

```yaml
name: build # 无所谓
on: [push] # 当 push 的时候执行。
jobs:
  build:
    runs-on: ubuntu-latest # 好像大家都用 ubuntu-latest，反正最后会自动清理，无所谓了
    env: # 暴露环境变量
      DATABASE_URL: ${{ secrets.DATABASE_URL }} # 这是从 secrets 里面拿，不会在 log 里面显示其内容。
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
      UPLOAD_PATH: "/var/opt/uploads/" # 这个其实应该从 var 里面拿，懒，不改了
    steps:
      - name: Checkout the code # 就是把代码搞下来
        uses: actions/checkout@v4
        with:
          path: src
      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9 # 指定版本
      - name: Build # 编译脚本
        run: |
          cd ./src/projects/app
          pnpm i
          pnpm prisma generate
          pnpm run build
      - name: Deploy # 通过 ssh 进行部署（其实是通过 rsync）
        uses: easingthemes/ssh-deploy@main # 参考
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          ARGS: "-rlgoDzvc -i"
          SOURCE: "./src/projects/app/.output"
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: ${{ secrets.REMOTE_TARGET }}
          SCRIPT_BEFORE: |
            echo 'BEFORE RSYNC'
          SCRIPT_AFTER: |
            echo 'AFTER RSYNC'
            sudo systemctl restart homesite.service
```
