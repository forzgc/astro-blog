---
title: archlinux安装filebrowser
tags: [archlinux, filebrowser]
date: 2023-04-20
poster: 000001.jpg
---

# archlinux 安装 filebrowser

## 下载安装

1. 地址 [filebrowser](https://github.com/filebrowser/filebrowser/releases)

```
wget xxx
```

2. 解压

```
tar -xf -C xxx
```

3. 复制到/usr/local/bin 目录

```
cp filebowser /usr/local/bin/filebowser
```

## 配置

1. 创建配置文件

```
cd ~
mkdir .config/filebrowser

nano .config/filebrowser/config.json
# 填入以下配置
{
    "port": 8080,
    "address": "0.0.0.0",
    "root": "[文件夹路径]",
    "database": "[filebowser.db路径]",
    "log": "[filebrowser.log路径]",
    "username": "admin"
}
```

## 守护进程配置

```
nano .config/systemd/user/filebrowserd.service
# 填入以下配置
[Unit]
Description=Filebrowser Daemon

[Service]
Type=simple
ExecStart=/usr/local/bin/filebrowser -c /home/xxx/.config/filebrowser/config.json

[Install]
WantedBy=default.target
```
## 启动
```
systemctl --user enable filebrowserd.service
systemctl --user start filebrowserd.service
```